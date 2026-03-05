
import { ChangeDetectionStrategy, Component, computed, input, output, signal, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe, CurrencyPipe } from '@angular/common';
import { Activity, Itinerary, Trip, Attraction, TripDraft, SavedTrip, AccommodationDetails } from '../../models/itinerary.model';
import { MapDisplayComponent } from '../map-display/map-display.component';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { ItineraryMapViewComponent } from '../itinerary-map-view/itinerary-map-view.component';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { ShareModalComponent } from '../share-modal/share-modal.component';
import { ItineraryApiService } from '../../services/itinerary-api.service';
import {IndexedDbService} from "../../services/indexed-db.service";

// Declare global libraries loaded from CDN
declare const jsPDF: any;
declare const html2canvas: any;

@Component({
  selector: 'app-itinerary-display',
  templateUrl: './itinerary-display.component.html',
  styleUrls: ['./itinerary-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MapDisplayComponent, FormsModule, ItineraryMapViewComponent, CurrencyConverterPipe, TitleCasePipe, ShareModalComponent],
  // FIX: Removed pipe providers as they are now instantiated directly.
  providers: []
})
export class ItineraryDisplayComponent implements OnChanges {
  trip = input.required<Trip | null>();
  mapping = input<{ [key: string]: string[] }>({});
  isLoading = input<boolean>(false);
  error = input<string | null>(null);
  mode = input<'maker' | 'viewer'>('maker');
  markupPercentage = input(0);
  currency = input.required<string>();
  
  tripUpdated = output<Trip>();
  tripSaved = output<void>();
  modeChanged = output<'maker' | 'viewer'>();
  markupChanged = output<number>();
  currencyChanged = output<string>();
  
  private configService = inject(ConfigService);
  private indexedDbService = inject(IndexedDbService);
  private itineraryApiService = inject(ItineraryApiService);
  // FIX: Instantiate pipes directly to resolve type inference issues.
  private datePipe = new DatePipe('en-US');
  private currencyPipe = new CurrencyPipe('en-US');
  config = this.configService.getConfig();
  activityCategories = Object.keys(this.config.activityIcons).filter(k => k !== 'default');

  editableItinerary: Itinerary | null = null;
  currentDayIndex = signal(0);
  saveStatus = signal<'idle' | 'saving' | 'saved'>('idle');
  createStatus = signal<'idle' | 'creating' | 'created'>('idle');
  highlightedActivity = signal<Activity | null>(null);
  isMapView = signal(false);
  isShareModalOpen = signal(false);
  isActionsMenuOpen = signal(false);

  // Signals for drag and drop
  draggedItemInfo = signal<{ dayIndex: number; activityIndex: number } | null>(null);
  dropTargetInfo = signal<{ dayIndex: number; activityIndex: number } | null>(null);

  currentDay = computed(() => {
    if (!this.editableItinerary) return null;
    return this.editableItinerary.days[this.currentDayIndex()];
  });

  currentDayActivities = computed(() => {
    return this.currentDay()?.activities ?? [];
  });

  totalBaseCost = computed(() => {
    if (!this.editableItinerary || !this.trip()) return 0;
    const adults = this.trip()?.preferences.adults || 1;
    
    const perPersonTotal = this.editableItinerary.days.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (activity.cost || 0);
      }, 0);
    }, 0);
    
    return perPersonTotal * adults;
  });

  totalCostWithMarkup = computed(() => {
    const baseCost = this.totalBaseCost();
    const markup = baseCost * (this.markupPercentage() / 100);
    return baseCost + markup;
  });
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trip']) {
      const currentTrip = this.trip();
      this.editableItinerary = currentTrip ? JSON.parse(JSON.stringify(currentTrip.itinerary)) : null;
      if (currentTrip) {
        this.currentDayIndex.set(0);
      }
    }
  }

  notifyUpdate() {
    const currentTrip = this.trip();
    if (currentTrip && this.editableItinerary) {
      const updatedItinerary = JSON.parse(JSON.stringify(this.editableItinerary));
      const updatedTrip: Trip = { ...currentTrip, itinerary: updatedItinerary };
      this.tripUpdated.emit(updatedTrip);
    }
  }

  toggleActivityCompletion(activity: Activity) {
    activity.completed = !activity.completed;
    this.notifyUpdate();
  }

  async saveTrip() {
    const tripData = this.trip();
    console.log(tripData);
    if (!tripData) return;
    const userTitle = window.prompt('Enter a title for this itinerary:', tripData.itinerary.title);
    if (!userTitle || userTitle.trim().length === 0) return;

    this.saveStatus.set('saving');
    
    const newSavedTrip: SavedTrip = {
      id: Date.now().toString(),
      title: userTitle,
      savedAt: new Date().toISOString(),
      trip: tripData,
      shareCount: 0
    };

    try {
      await this.indexedDbService.addTrip(newSavedTrip);
      this.saveStatus.set('saved');
      this.tripSaved.emit();
      setTimeout(() => this.saveStatus.set('idle'), 2500);
    } catch(err) {
      console.error('Save failed:', err);
      alert('Could not save itinerary due to a database error.');
      this.saveStatus.set('idle');
    }
  }

  async createItinerary() {
    const tripData = this.trip();
    if (!tripData) return;

    this.createStatus.set('creating');

    // Update with latest editable itinerary
    const finalTrip: Trip = {
      ...tripData,
      itinerary: this.editableItinerary ? JSON.parse(JSON.stringify(this.editableItinerary)) : tripData.itinerary,
      mapping: this.mapping()
    };

    this.itineraryApiService.createItinerary(finalTrip).subscribe({
      next: (response) => {
        console.log('Itinerary created successfully:', response);
        this.createStatus.set('created');
        setTimeout(() => this.createStatus.set('idle'), 2500);
        alert('Itinerary created successfully on the server!');
      },
      error: (err) => {
        console.error('Creation failed:', err);
        this.createStatus.set('idle');
        alert('Could not create itinerary on the server. Please try again.');
      }
    });
  }

  exportAsJson() {
    this.isActionsMenuOpen.set(false);
    const tripData = this.trip(); if (!tripData) return;
    const exportableTrip = { ...tripData, configSnapshot: this.config };
    const jsonString = JSON.stringify(exportableTrip, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripData.itinerary.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-plan.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  exportAsPdf() {
    this.isActionsMenuOpen.set(false);
    const tripData = this.trip();
    if (!tripData) return;
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    doc.setFontSize(22);
    doc.text(tripData.itinerary.title, margin, y);
    y += 10;
    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(tripData.itinerary.summary, 180);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;
    
    tripData.itinerary.days.forEach(day => {
        if (y > 270) { // Check for page break
            doc.addPage();
            y = margin;
        }
        doc.setFontSize(16);
        doc.text(`Day ${day.day}: ${day.theme}`, margin, y);
        y += 8;

        day.activities.forEach(activity => {
            if (y > 280) {
                doc.addPage();
                y = margin;
            }
            doc.setFontSize(12).setFont(undefined, 'bold');
            doc.text(`[${activity.time}] ${activity.title}`, margin, y);
            y += 6;
            doc.setFontSize(10).setFont(undefined, 'normal');
            const descLines = doc.splitTextToSize(activity.description, 170);
            doc.text(descLines, margin + 5, y);
            y += descLines.length * 4 + 4;
        });
        y+= 5;
    });

    doc.save(`${tripData.itinerary.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
  }
  
  viewAsHtmlPage() {
    this.isActionsMenuOpen.set(false);
    const tripData = this.trip();
    if (!tripData) return;

    const htmlContent = this.generateFullPageHtml(tripData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  exportAsHtml() {
    this.isActionsMenuOpen.set(false);
    const tripData = this.trip();
    if (!tripData) return;
    
    const htmlContent = this.generateHtmlContent(tripData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripData.itinerary.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-offline.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  saveAsTripIdea() {
    this.isActionsMenuOpen.set(false);
    const tripData = this.trip();
    if (!tripData) return;
    
    const newDraft: TripDraft = {
        id: Date.now().toString(),
        destination: tripData.preferences.to,
        startDate: tripData.preferences.startDate,
        endDate: tripData.preferences.endDate,
        interests: tripData.preferences.interests
    };

    try {
        const storedDrafts = localStorage.getItem('trip_drafts');
        const drafts = storedDrafts ? JSON.parse(storedDrafts) : [];
        drafts.unshift(newDraft);
        localStorage.setItem('trip_drafts', JSON.stringify(drafts));
        alert('Itinerary saved as a new Trip Idea in the Trip Hub!');
    } catch(e) {
        console.error("Could not save trip idea to local storage", e);
        alert("Sorry, could not save this as a trip idea.");
    }
  }

  goToDay(direction: 'prev' | 'next'): void {
    if (!this.editableItinerary) return;
    const newIndex = direction === 'prev' ? this.currentDayIndex() - 1 : this.currentDayIndex() + 1;
    if (newIndex >= 0 && newIndex < this.editableItinerary.days.length) {
      this.currentDayIndex.set(newIndex);
      this.highlightedActivity.set(null);
    }
  }

  addActivity(dayIndex: number) {
    if (!this.editableItinerary) return;
    const dayActivities = this.editableItinerary.days[dayIndex].activities;
    const lastActivity = dayActivities[dayActivities.length - 1];
    const newActivity: Activity = {
      time: "Evening", title: "New Activity", description: "Describe the new activity here.",
      location: "Specify location", activityType: "Sightseeing",
      latitude: lastActivity?.latitude ?? 0, longitude: lastActivity?.longitude ?? 0,
      cost: 0, completed: false,
    };
    this.editableItinerary.days[dayIndex].activities.push(newActivity);
    this.notifyUpdate();
  }
  
  addNearbyPlaceToItinerary(dayIndex: number, place: Attraction) {
    if (!this.editableItinerary) return;
    const newActivity: Activity = {
      time: "Afternoon",
      title: place.name,
      description: place.description,
      location: place.name,
      activityType: place.category,
      latitude: place.latitude,
      longitude: place.longitude,
      cost: place.cost,
      completed: false
    };
    this.editableItinerary.days[dayIndex].activities.push(newActivity);
    this.notifyUpdate();
  }

  removeActivity(dayIndex: number, activityIndex: number) {
    if (!this.editableItinerary) return;
    this.editableItinerary.days[dayIndex].activities.splice(activityIndex, 1);
    this.notifyUpdate();
  }

  moveActivity(dayIndex: number, fromIndex: number, toIndex: number) {
    if (!this.editableItinerary) return;
    const activities = this.editableItinerary.days[dayIndex].activities;
    if (fromIndex < 0 || fromIndex >= activities.length || toIndex < 0 || toIndex >= activities.length) {
      return;
    }
    const [removed] = activities.splice(fromIndex, 1);
    activities.splice(toIndex, 0, removed);
    this.notifyUpdate();
  }

  moveActivityUpDown(dayIndex: number, activityIndex: number, direction: 'up' | 'down') {
    const toIndex = direction === 'up' ? activityIndex - 1 : activityIndex + 1;
    this.moveActivity(dayIndex, activityIndex, toIndex);
  }

  onActivityClick(activity: Activity): void {
    if (this.mode() === 'viewer') return;
    this.highlightedActivity.set(this.highlightedActivity() === activity ? null : activity);
  }

  onMarkerClicked(activity: Activity): void {
    this.highlightedActivity.set(activity);
    const day = this.currentDay();
    if (!day) return;
    const activityIndex = day.activities.findIndex(a => a.title === activity.title && a.time === activity.time);
    if (activityIndex > -1) {
      document.getElementById(`activity-${this.currentDayIndex()}-${activityIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getActivityIcon(activityType: string): string {
    const key = activityType?.toLowerCase() as keyof typeof this.config.activityIcons;
    return this.config.activityIcons[key] || this.config.activityIcons['default'];
  }
  
  getAccommodationName(accommodationId: string | undefined): string {
    if (!accommodationId) return 'Not specified';
    const accommodations = this.trip()?.accommodation ?? [];
    const found = accommodations.find(acc => acc.id === accommodationId);
    return found ? `${found.hotelName} (${found.type})` : 'Unknown Stay';
  }

  // --- Drag and Drop Methods ---
  onDragStart(event: DragEvent, dayIndex: number, activityIndex: number) {
    if (this.mode() !== 'maker') return;
    event.dataTransfer!.effectAllowed = 'move';
    this.draggedItemInfo.set({ dayIndex, activityIndex });
  }

  onDragEnter(dayIndex: number, activityIndex: number) {
    if (this.draggedItemInfo()?.dayIndex === dayIndex) {
      this.dropTargetInfo.set({ dayIndex, activityIndex });
    }
  }
  
  onDragOver(event: DragEvent) {
    if (this.draggedItemInfo()) {
        event.preventDefault();
    }
  }

  onDragLeave() {
    this.dropTargetInfo.set(null);
  }

  onDrop(event: DragEvent, dayIndex: number, toActivityIndex: number) {
    if (this.mode() !== 'maker') return;
    event.preventDefault();
    const draggedInfo = this.draggedItemInfo();
    
    if (!draggedInfo || draggedInfo.dayIndex !== dayIndex || draggedInfo.activityIndex === toActivityIndex) {
        this.onDragEnd();
        return;
    }

    this.moveActivity(dayIndex, draggedInfo.activityIndex, toActivityIndex);
    this.onDragEnd();
  }
  
  onDragEnd() {
    this.draggedItemInfo.set(null);
    this.dropTargetInfo.set(null);
  }

  isBeingDragged(dayIndex: number, activityIndex: number): boolean {
    const dragged = this.draggedItemInfo();
    return dragged?.dayIndex === dayIndex && dragged?.activityIndex === activityIndex;
  }

  isDropTarget(dayIndex: number, activityIndex: number): boolean {
    const target = this.dropTargetInfo();
    const dragged = this.draggedItemInfo();
    if (!target || !dragged) return false;
    
    if (target.dayIndex === dragged.dayIndex && target.activityIndex === dragged.activityIndex) {
        return false;
    }
    
    return target.dayIndex === dayIndex && target.activityIndex === activityIndex;
  }

  private generateHtmlContent(trip: Trip): string {
    const itinerary = trip.itinerary;
    let daysHtml = '';

    for (const day of itinerary.days) {
        let activitiesHtml = '';
        for (const activity of day.activities) {
            activitiesHtml += `
                <div class="activity">
                    <h4>[${activity.time}] ${activity.title}</h4>
                    <p>${activity.description}</p>
                    <p class="location">Location: ${activity.location}</p>
                </div>
            `;
        }
        daysHtml += `
            <div class="day">
                <h2>Day ${day.day}: ${day.theme}</h2>
                ${activitiesHtml}
            </div>
        `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${itinerary.title}</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 20px auto; padding: 20px; background-color: #f9fafb; }
              .container { background-color: #fff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h1, h2, h3, h4 { color: #111827; }
              h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
              .summary { font-size: 1.125rem; color: #4b5563; margin-bottom: 2rem; }
              .day { margin-bottom: 2rem; border-left: 3px solid #4f46e5; padding-left: 1.5rem; }
              h2 { font-size: 1.75rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; margin-bottom: 1rem; }
              .activity { margin-bottom: 1rem; }
              h4 { font-size: 1.125rem; margin-bottom: 0.25rem; }
              p { margin-top: 0; }
              .location { font-size: 0.9rem; color: #6b7280; font-style: italic; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>${itinerary.title}</h1>
              <p class="summary">${itinerary.summary}</p>
              ${daysHtml}
              <div class="notes">
                  <h2>Travel Notes</h2>
                  <p>${itinerary.notes}</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
  
  private generateFullPageHtml(trip: Trip): string {
    const { itinerary, accommodation, transportation, emergencyInfo } = trip;

    const accommodationsHtml = accommodation && accommodation.length > 0 ? `
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-slate-800 mb-4">Accommodation</h3>
        ${accommodation.map(acc => `
          <div class="p-4 border border-slate-200 rounded-lg mb-3">
            <p class="font-bold">${acc.hotelName} (${acc.type})</p>
            <p class="text-sm"><strong>Dates:</strong> ${this.datePipe.transform(acc.checkInDate, 'mediumDate')} - ${this.datePipe.transform(acc.checkOutDate, 'mediumDate')}</p>
            <p class="text-sm"><strong>Address:</strong> ${acc.address || 'N/A'}</p>
          </div>
        `).join('')}
      </div>
    ` : '';
    
    const transportHtml = transportation ? `
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-slate-800 mb-4">Transportation</h3>
        ${(transportation.flights || []).map(f => `
          <div class="p-4 border border-slate-200 rounded-lg mb-3">
            <p class="font-bold">${f.airline}: ${f.departureAirport} → ${f.arrivalAirport}</p>
            <p class="text-sm">Departs: ${this.datePipe.transform(f.departureTime, 'medium')}</p>
            <p class="text-sm">Arrives: ${this.datePipe.transform(f.arrivalTime, 'medium')}</p>
          </div>
        `).join('')}
        ${(transportation.trains || []).map(t => `
          <div class="p-4 border border-slate-200 rounded-lg mb-3">
            <p class="font-bold">${t.trainType} Train: ${t.departureStation} → ${t.arrivalStation}</p>
            <p class="text-sm">Departs: ${this.datePipe.transform(t.departureTime, 'medium')}</p>
            <p class="text-sm">Arrives: ${this.datePipe.transform(t.arrivalTime, 'medium')}</p>
          </div>
        `).join('')}
         ${(transportation.other || []).map(o => `
          <div class="p-4 border border-slate-200 rounded-lg mb-3">
            <p class="font-bold">${o.type}</p>
            <p class="text-sm">${o.details}</p>
          </div>
        `).join('')}
      </div>
    ` : '';

    const emergencyHtml = emergencyInfo ? `
      <div class="mt-8 p-6 bg-red-50 text-red-800 rounded-lg">
        <h3 class="text-xl font-semibold text-red-900 mb-4">Emergency Info</h3>
        <p><strong>${emergencyInfo.embassy.name}:</strong> ${emergencyInfo.embassy.phone}</p>
        <p><strong>Police:</strong> ${emergencyInfo.localServices.police}</p>
        <p><strong>Ambulance:</strong> ${emergencyInfo.localServices.ambulance}</p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${itinerary.title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body class="bg-slate-100">
        <div class="container mx-auto max-w-4xl p-4 sm:p-8">
          <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            <header class="text-center border-b pb-6">
              <h1 class="text-4xl font-bold text-slate-900">${itinerary.title}</h1>
              <p class="mt-3 text-lg text-slate-600">${itinerary.summary}</p>
            </header>
            <main class="mt-8">
              ${itinerary.days.map(day => `
                <div class="mb-10">
                  <h2 class="text-2xl font-bold text-indigo-700 pb-2 mb-4 border-b-2 border-indigo-200">Day ${day.day}: ${day.theme}</h2>
                  ${day.accommodationId ? `<div class="mb-4 p-3 bg-indigo-50 rounded-lg text-sm text-indigo-800"><strong>Stay:</strong> ${this.getAccommodationName(day.accommodationId)}</div>` : ''}
                  <div class="space-y-6">
                    ${day.activities.map(activity => `
                      <div class="pl-6 border-l-2 border-slate-200 relative">
                        <div class="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-indigo-500 border-4 border-white"></div>
                        <p class="font-semibold text-slate-500">${activity.time}</p>
                        <h4 class="text-lg font-semibold text-slate-800">${activity.title}</h4>
                        <p class="mt-1 text-slate-600">${activity.description}</p>
                        <p class="mt-2 text-sm text-slate-500"><strong>Location:</strong> ${activity.location}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
              ${accommodationsHtml}
              ${transportHtml}
              ${emergencyHtml}
            </main>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
