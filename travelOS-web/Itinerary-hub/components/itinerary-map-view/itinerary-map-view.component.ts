import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  signal,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity, Attraction, Itinerary, Trip } from '../../models/itinerary.model';
import { GeminiService } from '../../services/gemini.service';

declare const L: any;

@Component({
  selector: 'app-itinerary-map-view',
  imports: [CommonModule],
  templateUrl: './itinerary-map-view.component.html',
  styles: [`
    :host { 
      display: block; 
      height: 80vh;
      min-height: 600px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryMapViewComponent implements AfterViewInit, OnDestroy, OnChanges {
  trip = input.required<Trip>();
  viewChanged = output<void>();

  @ViewChild('mapContainer') private mapContainer!: ElementRef;

  private geminiService = inject(GeminiService);
  private map: any;
  private markers: any[] = [];
  private dayColors: string[] = ['#4A90E2', '#D0021B', '#F5A623', '#F8E71C', '#7ED321', '#50E3C2', '#9013FE', '#B8E986', '#007AFF', '#FF2D55'];
  
  currentDayIndex = signal(0);
  localHighlights = signal<Attraction[]>([]);
  isHighlightsLoading = signal(false);
  private highlightsCache = new Map<number, Attraction[]>();
  
  constructor() {
    effect(() => {
        const dayIndex = this.currentDayIndex();
        const tripData = this.trip();
        if (tripData && tripData.itinerary.days[dayIndex]) {
            this.fetchLocalHighlights(dayIndex, tripData.itinerary.days[dayIndex].activities, tripData.preferences.to);
            this.updateMapView();
        }
    });
  }

  ngAfterViewInit(): void {
    if (typeof L === 'undefined') {
      console.error('Leaflet library is not loaded!');
      return;
    }
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trip'] && this.map) {
      this.updateAllMarkers();
      this.currentDayIndex.set(0);
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.updateAllMarkers();
  }

  private updateAllMarkers(): void {
    if (!this.map) return;
    
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    
    const itinerary = this.trip().itinerary;
    if (!itinerary) return;

    itinerary.days.forEach((day, dayIndex) => {
        const color = this.dayColors[dayIndex % this.dayColors.length];
        day.activities.forEach(activity => {
            if (activity.latitude && activity.longitude) {
                const icon = this.createMarkerIcon(color);
                const marker = L.marker([activity.latitude, activity.longitude], { icon })
                    .addTo(this.map)
                    .bindPopup(`<b>Day ${day.day}: ${activity.title}</b><p>${activity.description}</p>`);
                this.markers.push(marker);
            }
        });
    });
    this.updateMapView();
  }
  
  private updateHighlightMarkers(): void {
    // Remove only old highlight markers
    this.markers = this.markers.filter(m => {
        if (m.options.isHighlight) {
            m.remove();
            return false;
        }
        return true;
    });

    this.localHighlights().forEach(highlight => {
        if (highlight.latitude && highlight.longitude) {
            const icon = this.createMarkerIcon('#10B981', true); // Green for highlights
            const marker = L.marker([highlight.latitude, highlight.longitude], { icon, isHighlight: true })
                .addTo(this.map)
                .bindPopup(`<b>Highlight: ${highlight.name}</b><p>${highlight.description}</p>`);
            this.markers.push(marker);
        }
    });
  }

  updateMapView(): void {
    if (!this.map) return;
    const day = this.trip().itinerary.days[this.currentDayIndex()];
    if (!day || day.activities.length === 0) {
        // Fit all markers if current day has no activities
        if(this.markers.length > 0) {
            const group = new L.featureGroup(this.markers.filter(m => !m.options.isHighlight));
            this.map.fitBounds(group.getBounds().pad(0.2));
        }
        return;
    }
    const latLngs = day.activities
        .filter(a => a.latitude && a.longitude)
        .map(a => [a.latitude, a.longitude]);

    if (latLngs.length > 0) {
      this.map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 14, duration: 0.5 });
    }
  }

  async fetchLocalHighlights(dayIndex: number, activities: Activity[], destination: string) {
    if (this.highlightsCache.has(dayIndex) || activities.length === 0) {
      this.localHighlights.set(this.highlightsCache.get(dayIndex) ?? []);
      this.updateHighlightMarkers();
      return;
    }
    
    this.isHighlightsLoading.set(true);
    this.localHighlights.set([]);
    
    try {
      const highlights = await this.geminiService.getLocalHighlights(activities, destination);
      this.highlightsCache.set(dayIndex, highlights);
      this.localHighlights.set(highlights);
      this.updateHighlightMarkers();
    } catch (e) {
      console.error("Failed to fetch highlights", e);
    } finally {
      this.isHighlightsLoading.set(false);
    }
  }
  
  goToDay(direction: 'prev' | 'next'): void {
    const itinerary = this.trip()?.itinerary;
    if (!itinerary) return;

    const newIndex = direction === 'prev' 
      ? this.currentDayIndex() - 1 
      : this.currentDayIndex() + 1;
    
    if (newIndex >= 0 && newIndex < itinerary.days.length) {
      this.currentDayIndex.set(newIndex);
    }
  }
  
  private createMarkerIcon(color: string, isHighlight: boolean = false): any {
    const size = isHighlight ? '12px' : '20px';
    const borderSize = isHighlight ? '2px' : '3px';
    const html = `<div style="background-color: ${color}; width: ${size}; height: ${size}; border-radius: 50%; border: ${borderSize} solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`;
    return L.divIcon({
      html: html,
      className: '', // important to clear default styling
      iconSize: [isHighlight ? 16: 26, isHighlight ? 16: 26],
      iconAnchor: [isHighlight ? 8: 13, isHighlight ? 8: 13]
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
