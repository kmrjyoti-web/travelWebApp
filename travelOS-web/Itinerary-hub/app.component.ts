import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItineraryFormComponent } from './components/itinerary-form/itinerary-form.component';
import { ItineraryEditorContainerComponent } from './components/itinerary-editor/itinerary-editor-container/itinerary-editor-container.component';
import { ItineraryDisplayComponent } from './components/itinerary-display/itinerary-display.component';
import { GeminiService } from './services/gemini.service';
import { Trip, FormPreferences, Attraction, Activity, SavedTrip, LocalEvent } from './models/itinerary.model';
import { ConfigService } from './services/config.service';
import { ExplorePlacesComponent } from './components/explore-places/explore-places.component';
import { EmergencyInfoComponent } from './components/emergency-info/emergency-info.component';
import { InclusionsExclusionsComponent } from './components/inclusions-exclusions/inclusions-exclusions.component';
import { AccommodationComponent } from './components/accommodation/accommodation.component';
import { TransportationComponent } from './components/transportation/transportation.component';
import { ShareItineraryModalComponent } from './components/share-itinerary-modal/share-itinerary-modal.component';
import { IndexedDbService } from './services/indexed-db.service';
import { EncryptionService } from './services/encryption.service';
import { VisaInfoComponent } from './components/visa-info/visa-info.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';
import { ItineraryMappingComponent } from './components/itinerary-mapping/itinerary-mapping.component';
import { DataService } from './services/data.service';
import { ItineraryRepository } from './data-access/repository/itinerary.repository';
import { CreateItineraryDto } from './models/dto/itinerary.dto';
import { ItineraryStore } from './signal/store/itinerary.store';
import { PublishPackageComponent, PublishPayload } from './components/publish-package/publish-package.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ItineraryFormComponent,
    ItineraryDisplayComponent,
    ExplorePlacesComponent,
    EmergencyInfoComponent,
    InclusionsExclusionsComponent,
    AccommodationComponent,
    TransportationComponent,
    ShareItineraryModalComponent,
    VisaInfoComponent,
    WeatherDetailComponent,
    ItineraryMappingComponent,
    ItineraryEditorContainerComponent,
    PublishPackageComponent
  ],
})
export class AppComponent implements OnInit {
  private geminiService = inject(GeminiService);
  private configService = inject(ConfigService);
  private indexedDbService = inject(IndexedDbService);
  private encryptionService = inject(EncryptionService);
  private dataService = inject(DataService);
  private itineraryRepo = inject(ItineraryRepository);
  private itineraryStore = inject(ItineraryStore);

  config = this.configService.getConfig();
  title = "Itinerary Management";
  subtitle = "Admin panel for creating, viewing, and managing trip itineraries.";

  itineraries = signal<SavedTrip[]>([]);
  selectedTrip = signal<SavedTrip | null>(null);
  tripToShare = signal<SavedTrip | null>(null);

  viewMode = signal<'dashboard' | 'editor' | 'creator' | 'editor-v2' | 'publish-package'>('dashboard');
  isCreating = signal<boolean>(false);
  loadingMessage = signal<string>('');
  error = signal<string | null>(null);

  tourCategories = this.dataService.getTourCategories();

  // State for itinerary list view
  itineraryDisplayMode = signal<'list' | 'table'>('list');

  // State for the editor view
  selectedTab = signal<'itinerary' | 'accommodation' | 'transportation' | 'explore' | 'emergency' | 'inclusions' | 'visa' | 'weather' | 'mapping'>('itinerary');
  itineraryMode = signal<'maker' | 'viewer'>('maker');
  markupPercentage = signal(0);
  displayCurrency = signal<string>('USD');

  async ngOnInit() {
    await this.encryptionService.initialize();
    this.loadItinerariesFromDb();
  }

  async loadItinerariesFromDb() {
    try {
      const itineraries = await this.indexedDbService.getAllTrips();
      const itinerariesWithShareCount = itineraries.map(item => ({
        ...item,
        shareCount: item.shareCount || 0,
        mapping: item.mapping || {},
      }));
      // Sort by savedAt date descending
      itinerariesWithShareCount.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      this.itineraries.set(itinerariesWithShareCount);
    } catch (e) {
      console.error('Error reading saved itineraries from IndexedDB', e);
      this.itineraries.set([]);
    }
  }

  async handleCreateTrip(preferences: FormPreferences) {
    this.isCreating.set(true);
    this.error.set(null);

    try {
      this.loadingMessage.set('Checking visa requirements...');
      const model = preferences.selectedModel;
      const visaInfoPromise = this.geminiService.getVisaRequirements(preferences.from, preferences.to, model);

      this.loadingMessage.set('Crafting personalized itinerary...');
      const itineraryPromise = this.geminiService.generateItinerary(preferences);

      this.loadingMessage.set('Finding popular attractions...');
      const attractionsPromise = this.geminiService.getPopularAttractions(preferences.to, model);

      this.loadingMessage.set('Searching for local events...');
      const eventsPromise = this.geminiService.getDynamicEvents(preferences.to, preferences.startDate, preferences.endDate, model);

      this.loadingMessage.set('Getting emergency contact info...');
      const emergencyInfoPromise = this.geminiService.getEmergencyInfo(preferences.from, preferences.to, model);

      const [visaInfo, tripDetails, attractions, events, emergencyInfo] = await Promise.all([
        visaInfoPromise,
        itineraryPromise,
        attractionsPromise,
        eventsPromise,
        emergencyInfoPromise
      ]);

      if (!tripDetails.itinerary) {
        throw new Error('Could not parse itinerary from AI response.');
      }

      const newTrip: Trip = {
        preferences,
        visaInfo,
        itinerary: tripDetails.itinerary,
        accommodation: tripDetails.accommodation,
        transportation: tripDetails.transportation,
        attractions,
        events,
        emergencyInfo,
        configVersion: this.config.version,
        fromLocation: tripDetails.fromLocation,
        toLocation: tripDetails.toLocation,
        search_keys: tripDetails.search_keys,
        seo_detail: tripDetails.seo_detail,
      };

      const newSavedTrip: SavedTrip = {
        id: Date.now().toString(),
        title: newTrip.itinerary.title,
        savedAt: new Date().toISOString(),
        trip: newTrip,
        shareCount: 0,
        mapping: {},
      };

      await this.indexedDbService.addTrip(newSavedTrip);
      await this.loadItinerariesFromDb();
      this.viewMode.set('dashboard');

    } catch (e) {
      console.error('An error occurred during trip planning:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      this.error.set(`Failed to generate trip. Please check inputs or try again. Details: ${errorMessage}`);
    } finally {
      this.isCreating.set(false);
      this.loadingMessage.set('');
    }
  }

  selectTripForEditing(trip: SavedTrip, mode: 'editor' | 'editor-v2' = 'editor-v2') {
    this.selectedTrip.set(JSON.parse(JSON.stringify(trip)));
    this.displayCurrency.set(trip.trip.preferences.currency);
    this.markupPercentage.set(0);
    this.selectedTab.set('itinerary');
    this.viewMode.set(mode);
  }

  // New method for Publish Package
  openPublishPackage(trip: SavedTrip) {
    this.selectedTrip.set(JSON.parse(JSON.stringify(trip)));
    this.viewMode.set('publish-package');
  }

  async handlePublishPackage(payload: PublishPayload) {
    console.log('Publishing Package:', payload);
    // Here we would typically call an API to publish
    // For now, we update the local object (maybe mark as published?)
    // And sync the changes done in the editor back to the trip

    const trip = payload.trip;
    const settings = payload.settings;

    // Update the SavedTrip locally
    // Note: We might want to store "publish status" or URL in the SavedTrip object

    await this.handleTripUpdate(trip);

    // Also maybe perform specific publish actions like generating the final slug/URL and alerting user
    // For now, just go back to dashboard
    // Or show a success toast?

    alert(`Package Published Successfully!\nCurrency: ${settings.currency}\nRate: ${settings.conversionRate}\nLanguage: ${settings.language}`);
    this.viewMode.set('dashboard');
  }

  async handleTripUpdate(updatedTripData: Trip) {
    const selected = this.selectedTrip();
    if (!selected) return;

    let updatedSavedTrip: SavedTrip | undefined;

    this.selectedTrip.update(current => {
      if (!current) return null;
      updatedSavedTrip = { ...current, trip: updatedTripData, title: updatedTripData.itinerary.title };
      return updatedSavedTrip;
    });

    this.itineraries.update(allTrips => {
      const index = allTrips.findIndex(t => t.id === selected.id);
      if (index > -1) {
        const newTrips = [...allTrips];
        newTrips[index] = updatedSavedTrip!;
        return newTrips;
      }
      return allTrips;
    });

    if (updatedSavedTrip) {
      await this.indexedDbService.updateTrip(updatedSavedTrip);

      // Update the store with the authoritative ID and submit
      // The rest of the form data (slugs, details) should have been synced by the editor component
      this.itineraryStore.patchText('itineraries_global_id', updatedSavedTrip.id);
      this.itineraryStore.submit();
    }
  }

  async handleMappingUpdate(mapping: { [key: string]: string[] }) {
    const selected = this.selectedTrip();
    if (!selected) return;

    let updatedSavedTrip: SavedTrip | undefined;

    this.selectedTrip.update(current => {
      if (!current) return null;
      updatedSavedTrip = { ...current, mapping };
      return updatedSavedTrip;
    });

    if (updatedSavedTrip) {
      await this.indexedDbService.updateTrip(updatedSavedTrip);
      // Also update the main list to reflect changes if needed
      this.itineraries.update(allTrips => {
        const index = allTrips.findIndex(t => t.id === selected.id);
        if (index > -1) {
          allTrips[index] = updatedSavedTrip!;
          return [...allTrips];
        }
        return allTrips;
      });
    }
  }

  async deleteTrip(tripId: string) {
    if (confirm('Are you sure you want to permanently delete this itinerary?')) {
      await this.indexedDbService.deleteTrip(tripId);
      this.itineraries.update(trips => trips.filter(t => t.id !== tripId));
    }
  }

  goBackToDashboard() {
    this.selectedTrip.set(null);
    this.viewMode.set('dashboard');
  }

  handleAttractionAdded({ attraction, day }: { attraction: Attraction, day: number }) {
    const currentSelectedTrip = this.selectedTrip();
    if (!currentSelectedTrip) return;

    const newActivity: Activity = {
      time: "Afternoon",
      title: attraction.name,
      description: attraction.description,
      location: attraction.name,
      activityType: attraction.category,
      latitude: attraction.latitude,
      longitude: attraction.longitude,
      cost: attraction.cost,
      completed: false,
    };

    const dayIndex = day - 1;
    const newTripData = JSON.parse(JSON.stringify(currentSelectedTrip.trip));

    if (dayIndex >= 0 && dayIndex < newTripData.itinerary.days.length) {
      newTripData.itinerary.days[dayIndex].activities.push(newActivity);
    }

    this.handleTripUpdate(newTripData);
    this.selectedTab.set('itinerary');
  }

  handleEventAdded({ event, day }: { event: LocalEvent, day: number }) {
    const currentSelectedTrip = this.selectedTrip();
    if (!currentSelectedTrip) return;

    const newActivity: Activity = {
      time: "Varies",
      title: event.name,
      description: event.description,
      location: event.venue,
      activityType: 'Entertainment',
      latitude: event.latitude ?? 0,
      longitude: event.longitude ?? 0,
      cost: event.cost ?? 0,
      completed: false,
    };

    const dayIndex = day - 1;
    const newTripData = JSON.parse(JSON.stringify(currentSelectedTrip.trip));

    if (dayIndex >= 0 && dayIndex < newTripData.itinerary.days.length) {
      newTripData.itinerary.days[dayIndex].activities.push(newActivity);
    }

    this.handleTripUpdate(newTripData);
    this.selectedTab.set('itinerary');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // --- Share Modal Methods ---
  openShareModal(trip: SavedTrip) {
    this.tripToShare.set(trip);
  }

  closeShareModal() {
    this.tripToShare.set(null);
  }

  async handleShare(shareDetails: { name: string; email: string; mobile: string; tripId: string }) {
    console.log('Sharing itinerary with:', shareDetails);

    let tripToUpdate: SavedTrip | undefined;
    this.itineraries.update(allTrips => {
      const index = allTrips.findIndex(t => t.id === shareDetails.tripId);
      if (index > -1) {
        const newTrips = [...allTrips];
        const updatedTrip = { ...newTrips[index] };
        updatedTrip.shareCount = (updatedTrip.shareCount || 0) + 1;
        newTrips[index] = updatedTrip;
        tripToUpdate = updatedTrip;
        return newTrips;
      }
      return allTrips;
    });

    if (tripToUpdate) {
      await this.indexedDbService.updateTrip(tripToUpdate);
    }
    this.closeShareModal();
  }
}