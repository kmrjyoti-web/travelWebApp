import { Component, input, output, signal, effect, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, PublishSettings } from '../../models/itinerary.model';
export interface PublishPayload {
  trip: Trip;
  settings: PublishSettings;
}

// PrimeNG
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';

// Editors
import { GeneralInfoEditorComponent } from '../itinerary-editor/general-info-editor/general-info-editor.component';
import { DayEditorComponent } from '../itinerary-editor/day-editor/day-editor.component';
import { TransportationEditorComponent } from '../itinerary-editor/transportation-editor/transportation-editor.component';
import { AccommodationEditorComponent } from '../itinerary-editor/accommodation-editor/accommodation-editor.component';
import { WeatherEditorComponent } from '../itinerary-editor/weather-editor/weather-editor.component';
import { PolicyEditorComponent } from '../itinerary-editor/policy-editor/policy-editor.component';
import { EventsEditorComponent } from '../itinerary-editor/events-editor/events-editor.component';
import { PopularPlacesEditorComponent } from '../itinerary-editor/popular-places-editor/popular-places-editor.component';
import { EmergencyEditorComponent } from '../itinerary-editor/emergency-editor/emergency-editor.component';
import { AttractionPriceEditorComponent } from '../itinerary-editor/attraction-price-editor/attraction-price-editor.component';
import { VisaEditorComponent } from '../itinerary-editor/visa-editor/visa-editor.component';
import { PreferencesEditorComponent } from '../itinerary-editor/preferences-editor/preferences-editor.component';
import { SearchDetailsEditorComponent } from '../itinerary-editor/search-details-editor/search-details-editor.component';
import { SeoEditorComponent } from '../itinerary-editor/seo-editor/seo-editor.component';
import { MappingEditorComponent } from '../itinerary-editor/mapping-editor/mapping-editor.component';
import { PublishSettingsEditorComponent } from '../publish-settings-editor/publish-settings-editor.component';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { ItineraryActivityStore } from '../../../Itinerary-activity/state/itinerary-activity.store';
import { ItineraryPublishMapper } from '../../../Itinerary-activity/utils/mappers/itinerary-publish.mapper';
import { ToastHelperService } from '../../../../../shared-module/services/toast/toast-helper.service';

@Component({
  selector: 'app-publish-package',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmDialogModule,
    DialogModule,

    // Editors
    GeneralInfoEditorComponent,
    DayEditorComponent,
    TransportationEditorComponent,
    AccommodationEditorComponent,
    WeatherEditorComponent,
    PolicyEditorComponent,
    EventsEditorComponent,
    PopularPlacesEditorComponent,
    EmergencyEditorComponent,
    AttractionPriceEditorComponent,
    VisaEditorComponent,
    PreferencesEditorComponent,
    SearchDetailsEditorComponent,
    SeoEditorComponent,
    MappingEditorComponent,
    PublishSettingsEditorComponent,
    ImageGalleryComponent
  ],
  templateUrl: './publish-package.component.html',
  providers: [ConfirmationService]
})
export class PublishPackageComponent {
  trip = input<Trip>();
  defaultData = input<any>();

  // Output the final package ready for publishing
  publish = output<PublishPayload>();
  cancel = output<void>();

  mutableTrip = signal<Trip | null>(null);
  activeSection = signal<'settings' | 'gallery' | 'general' | 'days' | 'accommodation' | 'transport' | 'weather' | 'policy' | 'events' | 'places' | 'emergency' | 'price-ref' | 'visa' | 'preferences' | 'search' | 'seo' | 'mapping'>('settings');
  hasUnsavedChanges = signal(false);

  // Publish Modal State
  showPublishModal = signal(false);

  // Settings from the new editor
  currentPublishSettings = signal<PublishSettings | null>(null);

  readonly store = inject(ItineraryActivityStore);

  private confirmationService = inject(ConfirmationService);
  private toast = inject(ToastHelperService);

  constructor() {
    effect(() => {
      if (this.store.publishSuccess()) {
        (this.toast as any).success('Package published successfully');
        this.showPublishModal.set(false);
        this.hasUnsavedChanges.set(false);
        // Optional: emit if parent needs to know
        // this.publish.emit(...) 
        this.store.resetPublishState();
      }

      if (this.store.error()) {
        (this.toast as any).error(this.store.error() || 'Failed to publish package');
        this.store.resetPublishState();
      }
    }, { allowSignalWrites: true });

    effect(() => {
      // deep copy trip on init
      let initialTrip = this.trip();

      // If no direct trip input, check defaultData (from Drawer/Grid)
      if (!initialTrip && this.defaultData()) {
        const data = this.defaultData();
        // Extract from defaultData.row.itineraries_detail
        if (data?.row?.itineraries_detail) {
          try {
            // data.row.itineraries_detail might be a string (JSON) or object
            const t = typeof data.row.itineraries_detail === 'string'
              ? JSON.parse(data.row.itineraries_detail)
              : data.row.itineraries_detail;

            // Ensure it matches Trip interface (or map it?)
            // Assuming it matches for now
            initialTrip = t;
          } catch (e) {
            console.error('Failed to parse itineraries_detail', e);
          }
        }
      }

      if (initialTrip) {
        const t = JSON.parse(JSON.stringify(initialTrip));

        // Preserve IDs from defaultData if available
        if (this.defaultData()) {
          const row = this.defaultData().row || this.defaultData(); // Handle potential structure variations
          t.globalId = row.itineraries_global_id;
          t.uniqueId = row.itineraries_unique_id;
        }

        this.mutableTrip.set(t);
        this.hasUnsavedChanges.set(false);

        // Initialize publish settings from existing preferences if available?
        if (t.preferences?.currency) {
          // keep default USD or user pref? 
          // "current system default price in dolar" - so we start with USD usually.
        }
      }
    }, { allowSignalWrites: true });
  }

  updateTrip(updatedTrip: Trip) {
    this.mutableTrip.set(updatedTrip);
    this.hasUnsavedChanges.set(true);
  }

  onPublishClick() {
    // If we want a final "Are you sure?" modal, we can keep this.
    // Or we can just validate settings.
    this.confirmPublish();
  }

  // onCurrencyChange removed as it is handled in settings component

  confirmPublish() {
    if (this.mutableTrip()) {
      const trip = this.mutableTrip()!;

      // Ensure Trip ID exists logic (Default Data)
      if (!trip.id) {
        // Simple fallback ID generation if missing
        trip.id = 'TRIP-' + Math.floor(Math.random() * 10000000);
      }

      const settings = this.currentPublishSettings();
      const existingSettings = trip.publishSettings || {} as any;

      // Construct Final Settings with Fallbacks
      // Priority: New Editor Settings > Existing Persisted Settings > Calculated Defaults
      const finalSettings: PublishSettings = {
        publishUrl: settings?.publishUrl || existingSettings.publishUrl || trip.itinerary.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),

        // Headings
        publishHeading: settings?.publishHeading || existingSettings.publishHeading || trip.itinerary.title,
        offer: {
          enabled: settings?.offer?.enabled ?? existingSettings.offer?.enabled ?? false,
          title: settings?.offer?.title || existingSettings.offer?.title || '',
          offerHeading: settings?.offer?.offerHeading || existingSettings.offer?.offerHeading || '',
          validityType: settings?.offer?.validityType || existingSettings.offer?.validityType || '24h',
          validityValue: settings?.offer?.validityValue ?? existingSettings.offer?.validityValue ?? 10,
          recurring: settings?.offer?.recurring ?? existingSettings.offer?.recurring ?? false,
          tags: settings?.offer?.tags || existingSettings.offer?.tags || []
        },

        // Search Keys (Merge or Default)
        searchKeys: settings?.searchKeys || existingSettings.searchKeys || ItineraryPublishMapper.generateSearchKeys(trip),

        // Standard Fields
        totalPrice: settings?.totalPrice ?? existingSettings.totalPrice ?? 0,
        currency: settings?.currency || existingSettings.currency || 'USD',
        language: settings?.language || existingSettings.language || 'en',
        conversionEnabled: settings?.conversionEnabled ?? existingSettings.conversionEnabled ?? false,
        conversionRate: settings?.conversionRate ?? existingSettings.conversionRate ?? 1,
        markupPercentage: settings?.markupPercentage ?? existingSettings.markupPercentage ?? 0,

        tags: settings?.tags || existingSettings.tags || [],
        duration: {
          days: settings?.duration?.days ?? existingSettings.duration?.days ?? (trip.itinerary?.days?.length || 1),
          nights: settings?.duration?.nights ?? existingSettings.duration?.nights ?? ((trip.itinerary?.days?.length || 1) - 1)
        },
        pauseTheme: settings?.pauseTheme ?? existingSettings.pauseTheme ?? false,
        travelers: {
          min: settings?.travelers?.min ?? existingSettings.travelers?.min ?? 1,
          max: settings?.travelers?.max ?? existingSettings.travelers?.max ?? 10
        },
        pricing: {
          currentPrice: settings?.pricing?.currentPrice ?? existingSettings.pricing?.currentPrice ?? 0,
          offerPrice: settings?.pricing?.offerPrice ?? existingSettings.pricing?.offerPrice ?? 0,
          offerValidUntilDate: settings?.pricing?.offerValidUntilDate || existingSettings.pricing?.offerValidUntilDate
        },
        budget: {
          min: settings?.budget?.min ?? existingSettings.budget?.min ?? 0,
          max: settings?.budget?.max ?? existingSettings.budget?.max ?? 0
        },
        recurringPackage: {
          enabled: settings?.recurringPackage?.enabled ?? existingSettings.recurringPackage?.enabled ?? false,
          frequency: settings?.recurringPackage?.frequency || existingSettings.recurringPackage?.frequency || 'monthly'
        },
        cardImage: settings?.cardImage || existingSettings.cardImage || ''
      };

      const payload: PublishPayload = {
        trip: trip,
        settings: finalSettings
      };

      this.store.publishItinerary(payload);
      // this.publish.emit(payload); // Moved to success effect or removed if API is the goal
      // this.showPublishModal.set(false); // Guided by store success
      // this.hasUnsavedChanges.set(false);
    }
  }

  onCancel() {
    if (this.hasUnsavedChanges()) {
      this.confirmationService.confirm({
        message: 'You have unsaved changes in the package. Are you sure you want to discard them?',
        header: 'Confirm Discard',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.cancel.emit();
        }
      });
    } else {
      this.cancel.emit();
    }
  }
}
