import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, ItineraryDay, Activity, FormPreferences, VisaInfo, LocalEvent, EmergencyInfo, Attraction, AccommodationDetails, TransportDetails } from '../../../models/itinerary.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralInfoEditorComponent } from '../general-info-editor/general-info-editor.component';
import { DayEditorComponent } from '../day-editor/day-editor.component';
import { TransportationEditorComponent } from '../transportation-editor/transportation-editor.component';
import { AccommodationEditorComponent } from '../accommodation-editor/accommodation-editor.component';
import { WeatherEditorComponent } from '../weather-editor/weather-editor.component';
import { PolicyEditorComponent } from '../policy-editor/policy-editor.component';
import { EventsEditorComponent } from '../events-editor/events-editor.component';
import { PopularPlacesEditorComponent } from '../popular-places-editor/popular-places-editor.component';
import { EmergencyEditorComponent } from '../emergency-editor/emergency-editor.component';
import { AttractionPriceEditorComponent } from '../attraction-price-editor/attraction-price-editor.component';
import { VisaEditorComponent } from '../visa-editor/visa-editor.component';
import { PreferencesEditorComponent } from '../preferences-editor/preferences-editor.component';
import { SearchDetailsEditorComponent } from '../search-details-editor/search-details-editor.component';
import { SeoEditorComponent } from '../seo-editor/seo-editor.component';
import { MappingEditorComponent } from '../mapping-editor/mapping-editor.component';
import { ImageGalleryComponent } from '../../image-gallery/image-gallery.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ItineraryStore } from '../../../signal/store/itinerary.store';

@Component({
  selector: 'app-itinerary-editor-container',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogModule, GeneralInfoEditorComponent, DayEditorComponent, TransportationEditorComponent, AccommodationEditorComponent, WeatherEditorComponent, PolicyEditorComponent, EventsEditorComponent, PopularPlacesEditorComponent, EmergencyEditorComponent, AttractionPriceEditorComponent, VisaEditorComponent, PreferencesEditorComponent, SearchDetailsEditorComponent, SeoEditorComponent, MappingEditorComponent, ImageGalleryComponent],
  templateUrl: './itinerary-editor-container.component.html',
  providers: [ConfirmationService]
})
export class ItineraryEditorContainerComponent {
  trip = input.required<Trip>();
  saveTrip = output<Trip>();
  cancelEdit = output<void>();

  mutableTrip = signal<Trip | null>(null);
  activeSection = signal<'general' | 'gallery' | 'days' | 'accommodation' | 'transport' | 'weather' | 'policy' | 'events' | 'places' | 'emergency' | 'price-ref' | 'visa' | 'preferences' | 'search' | 'seo' | 'mapping'>('general');
  hasUnsavedChanges = signal(false);

  itineraryStore = inject(ItineraryStore);

  // Publish Settings Signals
  selectedLanguage = signal('en');
  markup = signal(0);
  showMarkupOnWebsite = signal(true);
  publishedUrl = signal('');

  private confirmationService = inject(ConfirmationService);

  constructor() {
    effect(() => {
      // deep copy trip to avoid mutating original
      if (this.trip()) {
        this.mutableTrip.set(JSON.parse(JSON.stringify(this.trip())));
        this.hasUnsavedChanges.set(false);
      }
    }, { allowSignalWrites: true });
  }

  updateTrip(updatedTrip: Trip) {
    this.mutableTrip.set(updatedTrip);
    this.hasUnsavedChanges.set(true);
  }

  saveChanges() {
    if (this.mutableTrip()) {
      this.syncToStore();
      debugger;
      this.saveTrip.emit(this.mutableTrip()!);
      this.hasUnsavedChanges.set(false);
    }
  }

  private syncToStore() {
    const t = this.mutableTrip();
    if (!t) return;

    const store = this.itineraryStore;

    // Generate Code (Slug) from Title or Fallback to ID
    let code = t.itinerary.title 
        ? t.itinerary.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        : '';
    
    if (!code) {
        code = (t as any).id || Date.now().toString();
    }

    // Basic Fields
    store.patchText('user_itineraries_code', code);
    store.patchText('itineraries_global_id', (t as any).id || Date.now().toString());
    store.patchText('itineraries_heading', t.itinerary.title);
    
    // Locations
    store.patchText('from_country', t.fromLocation?.country || t.preferences.from);
    store.patchText('from_country_code', t.fromLocation?.countryCode || null);
    store.patchText('from_state', t.fromLocation?.state || null);
    store.patchText('from_state_code', t.fromLocation?.stateCode || null);
    store.patchText('from_search_key', t.fromLocation?.city || t.preferences.from || null);
    
    store.patchText('to_country', t.toLocation?.country || t.preferences.to);
    store.patchText('to_country_code', t.toLocation?.countryCode || null);
    store.patchText('to_state', t.toLocation?.state || null);
    store.patchText('to_state_code', t.toLocation?.stateCode || null);
    store.patchText('to_search_key', t.toLocation?.city || t.preferences.to || null);

    // Metadata
    store.patchNumber('no_of_shares', 0);
    
    // Details (Serialized Trip with Publish Settings)
    const tripWithSettings = {
        ...t,
        publishSettings: {
            language: this.selectedLanguage(),
            markup: this.markup(),
            showMarkup: this.showMarkupOnWebsite()
        }
    };
    store.patchText('itineraries_detail', JSON.stringify(tripWithSettings));

    // Default URL to Canonical from SEO if available
    if (!this.publishedUrl()) {
        this.publishedUrl.set(t.seo_detail?.canonicalUrl || '');
    }
    
    this.updateSearchKeys();
  }

  private updateSearchKeys() {
    const t = this.mutableTrip();
    if (t && t.search_keys) {
      this.itineraryStore.patchText('search_key', t.search_keys.join(', '));
    }
  }

  onCancel() {
    if (this.hasUnsavedChanges()) {
        this.confirmationService.confirm({
            message: 'You have unsaved changes. Are you sure you want to discard them?',
            header: 'Confirm Discard',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.cancelEdit.emit();
            }
        });
    } else {
        this.cancelEdit.emit();
    }
  }

  switchSection(section: 'general' | 'gallery' | 'days' | 'accommodation' | 'transport' | 'weather' | 'policy' | 'events' | 'places' | 'emergency' | 'price-ref' | 'visa' | 'preferences' | 'search' | 'seo' | 'mapping') {
      // Optional: If you want to block switching tabs too when dirty
      // For now, usually safe to switch tabs as long as within same "Edit Session"
      // But if user meant "Prevent exit without saving", that applies to Cancel.
      // Switching tabs inside the editor usually preserves state in mutableTrip, so it's fine.
      this.activeSection.set(section);
  }
}
