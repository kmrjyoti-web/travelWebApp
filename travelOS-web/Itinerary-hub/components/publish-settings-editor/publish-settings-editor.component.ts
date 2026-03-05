import { Component, input, output, signal, effect, computed, inject } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary.service';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, PublishSettings } from '../../models/itinerary.model';

// PrimeNG Imports
import { ChipsModule } from 'primeng/chips';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';



@Component({
    selector: 'app-publish-settings-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChipsModule,
        CalendarModule,
        InputNumberModule,
        DropdownModule,
        InputSwitchModule,
        CheckboxModule,
        FileUploadModule
    ],
    templateUrl: './publish-settings-editor.component.html'
})
export class PublishSettingsEditorComponent {
    trip = input.required<Trip>();
    settingsChange = output<PublishSettings>();
    tripChange = output<Trip>();

    // Signals for Form Fields
    publishUrl = signal('');
    currency = signal('USD');
    language = signal('en');
    conversionEnabled = signal(false);
    conversionRate = signal(1);

    markupPercentage = signal(0);

    // New Heading & Search Keys Signals
    publishHeading = signal('');
    fromSearchKeys = signal('');
    toSearchKeys = signal('');
    searchKeys = signal('');
    offerSearchKeys = signal('');

    // New Signals
    tags = signal<string[]>([]);
    durationDays = signal(0);
    durationNights = signal(0);
    pauseTheme = signal(false);
    travelerMin = signal(1);
    travelerMax = signal(10);

    currentPrice = signal<number>(0);
    offerPrice = signal<number>(0);
    offerValidUntilDate = signal<Date | null>(null);

    offerEnabled = signal(false);
    offerTitle = signal('');
    offerHeading = signal('');
    offerValidityType = signal<'24h' | '48h' | 'custom' | 'days'>('24h');
    offerValidityValue = signal<number | undefined>(10); // Default 10 days if type is days
    offerRecurring = signal(false);
    offerTags = signal<string[]>([]);

    budgetMin = signal(0);
    budgetMax = signal(0);

    recurringPackageEnabled = signal(false);
    recurringPackageFrequency = signal<'daily' | 'weekly' | 'monthly'>('monthly');

    cardImageUrl = signal<string>('');
    cardImageUploading = signal(false);
    isGeneratingKeys = signal(false);

    // Computed Total Price based on Trip (Reference)
    totalPrice = computed(() => {
        return this.calculateTripCost(this.trip());
    });

    // Display Price Logic (This might be redundant if user manually inputs Current Price)
    // But we can use it to init the Current Price
    displayPrice = computed(() => {
        let price = this.totalPrice();
        if (this.markupPercentage() > 0) {
            price = price + (price * (this.markupPercentage() / 100));
        }
        if (this.conversionEnabled() || this.currency() !== 'USD') {
            price = price * this.conversionRate();
        }
        return price;
    });

    constructor() {
        // Initialize from trip if needed
        effect(() => {
            const t = this.trip();
            if (t) {
                if (t.publishSettings) {
                    const ps = t.publishSettings;



                    // Ensure defaults even if settings object exists
                    this.publishHeading.set(ps.publishHeading || t.itinerary.title || '');

                    // Search Key Population (Fallback if empty)
                    if (ps.searchKeys && (ps.searchKeys.from || ps.searchKeys.to || ps.searchKeys.search)) {
                        this.fromSearchKeys.set(ps.searchKeys.from || '');
                        this.toSearchKeys.set(ps.searchKeys.to || '');
                        this.searchKeys.set(ps.searchKeys.search || '');
                        this.offerSearchKeys.set(ps.searchKeys.offer || '');
                    } else {
                        // Auto-populate if keys are missing
                        this.populateSearchKeys(t);
                    }

                    // URL Default
                    if (ps.publishUrl) {
                        this.publishUrl.set(ps.publishUrl);
                    } else {
                        this.publishUrl.set(this.generateSlug(t.itinerary.title));
                    }

                    this.tags.set(ps.tags || []);
                    this.durationDays.set(ps.duration?.days || 1);
                    this.durationNights.set(ps.duration?.nights || 0);
                    this.pauseTheme.set(ps.pauseTheme);

                    this.travelerMin.set(ps.travelers?.min || 1);
                    this.travelerMax.set(ps.travelers?.max || 10);

                    this.budgetMin.set(ps.budget?.min || 0);
                    this.budgetMax.set(ps.budget?.max || 0);

                    this.currentPrice.set(ps.pricing?.currentPrice || 0);
                    this.offerPrice.set(ps.pricing?.offerPrice || 0);

                    this.recurringPackageEnabled.set(ps.recurringPackage?.enabled || false);
                    this.recurringPackageFrequency.set(ps.recurringPackage?.frequency || 'monthly');

                    this.cardImageUrl.set(ps.cardImage || '');

                    if (ps.offer) {
                        this.offerEnabled.set(ps.offer.enabled);
                        this.offerTitle.set(ps.offer.title);
                        this.offerHeading.set(ps.offer.offerHeading || '');
                        this.offerValidityType.set(ps.offer.validityType);
                        this.offerValidityValue.set(ps.offer.validityValue);
                        this.offerTags.set(ps.offer.tags || []);
                        this.offerRecurring.set(ps.offer.recurring);
                    }
                    if (ps.pricing?.offerValidUntilDate) {
                        this.offerValidUntilDate.set(new Date(ps.pricing.offerValidUntilDate));
                    }

                } else {
                    // Default Initialization
                    this.publishUrl.set(this.generateSlug(t.itinerary.title));

                    // Calculate Duration
                    if (t.itinerary && t.itinerary.days) {
                        const d = t.itinerary.days.length;
                        this.durationDays.set(d);
                        this.durationNights.set(d > 1 ? d - 1 : 0);
                    } else if (t.preferences && t.preferences.days) {
                        this.durationDays.set(t.preferences.days);
                        this.durationNights.set(t.preferences.days - 1);
                    }

                    // Init Price from calculated if not set
                    this.currentPrice.set(this.displayPrice());

                    // Auto populate if new
                    this.populateSearchKeys(t);
                    this.publishHeading.set(t.itinerary.title);
                }
            }
        }, { allowSignalWrites: true });
    }

    populateSearchKeys(trip: Trip) {
        // --- 1. From Search Keys ---
        const fromKeys = new Set<string>();
        // Preference Data
        if (trip.preferences?.from) fromKeys.add(trip.preferences.from);
        // Location Data (From)
        if (trip.fromLocation) {
            if (trip.fromLocation.city) fromKeys.add(trip.fromLocation.city);
            if (trip.fromLocation.state) fromKeys.add(trip.fromLocation.state);
            if (trip.fromLocation.country) fromKeys.add(trip.fromLocation.country);
            if (trip.fromLocation.countryCode) fromKeys.add(trip.fromLocation.countryCode);
        }
        this.fromSearchKeys.set(Array.from(fromKeys).filter(Boolean).join(', '));


        // --- 2. To Search Keys ---
        const toKeys = new Set<string>();
        // Preference Data
        if (trip.preferences?.to) toKeys.add(trip.preferences.to);
        // Location Data (To)
        if (trip.toLocation) {
            if (trip.toLocation.city) toKeys.add(trip.toLocation.city);
            if (trip.toLocation.state) toKeys.add(trip.toLocation.state);
            if (trip.toLocation.country) toKeys.add(trip.toLocation.country);
            if (trip.toLocation.countryCode) toKeys.add(trip.toLocation.countryCode);
        }
        // Itinerary Data (Activities, Attractions)
        if (trip.itinerary?.days) {
            trip.itinerary.days.forEach(day => {
                if (day.activities) {
                    day.activities.forEach((act: any) => {
                        if (act.location) toKeys.add(act.location);
                        if (act.title) toKeys.add(act.title);
                    });
                }
            });
        }
        // Attraction Names
        if (trip.attractions) {
            trip.attractions.forEach(attr => { if (attr.name) toKeys.add(attr.name); });
        }
        this.toSearchKeys.set(Array.from(toKeys).filter(Boolean).join(', '));


        // --- 3. General Search Keys ---
        const genKeys = new Set<string>();
        // Add all From/To keys context
        fromKeys.forEach(k => genKeys.add(k));
        toKeys.forEach(k => genKeys.add(k));

        // Contextual Terms
        if (trip.preferences?.interests) genKeys.add(trip.preferences.interests);
        if (trip.preferences?.tripNature) genKeys.add(trip.preferences.tripNature);

        // SEO Keywords (Array)
        if (trip.seo_detail?.keywords && Array.isArray(trip.seo_detail.keywords)) {
            trip.seo_detail.keywords.forEach(k => genKeys.add(k.trim()));
        }

        // Mapping Values (Contextual Search Terms)
        if (trip.mapping) {
            // mapping values are string arrays
            Object.values(trip.mapping).forEach(valArray => {
                if (Array.isArray(valArray)) {
                    valArray.forEach(val => {
                        if (typeof val === 'string' && val.length > 0) genKeys.add(val);
                    });
                }
            });
        }
        this.searchKeys.set(Array.from(genKeys).filter(Boolean).join(', '));


        // --- 4. Offer Search Keys ---
        const offerKeys = new Set<string>();
        offerKeys.add('Special Offer');
        offerKeys.add('Discount');
        offerKeys.add('Limited Time');
        offerKeys.add('Deal');

        if (trip.publishSettings?.offer?.tags) {
            trip.publishSettings.offer.tags.forEach(t => offerKeys.add(t));
        }

        this.offerSearchKeys.set(Array.from(offerKeys).filter(Boolean).join(', '));
    }

    calculateTripCost(trip: Trip): number {
        let cost = 0;
        // Iterate over days and activities
        if (trip.itinerary?.days) {
            trip.itinerary.days.forEach((day: any) => {
                if (day.activities) {
                    day.activities.forEach((act: any) => {
                        cost += Number(act.cost || 0);
                    });
                }
            });
        }

        // Accommodations
        if (trip.accommodation) {
            trip.accommodation.forEach((acc: any) => {
                if (acc.price) cost += Number(acc.price);
            });
        }

        // Transport
        if (trip.transportation) {
            if (trip.transportation.flights) {
                trip.transportation.flights.forEach((flight: any) => { cost += Number(flight.price || 0); });
            }
            if (trip.transportation.trains) {
                trip.transportation.trains.forEach((train: any) => { cost += Number(train.price || 0); });
            }
            if (trip.transportation.other) {
                trip.transportation.other.forEach((ot: any) => { cost += Number(ot.price || 0); });
            }
        }

        return cost;
    }

    onSettingsChange() {
        this.emitSettings();
    }

    emitSettings() {
        const s: PublishSettings = {
            publishUrl: this.publishUrl(),
            totalPrice: this.totalPrice(), // Base cost
            currency: this.currency(),
            language: this.language(),
            conversionEnabled: this.conversionEnabled(),
            conversionRate: this.conversionRate(),
            markupPercentage: this.markupPercentage(),

            publishHeading: this.publishHeading(),
            searchKeys: {
                from: this.fromSearchKeys(),
                to: this.toSearchKeys(),
                search: this.searchKeys(),
                offer: this.offerSearchKeys()
            },

            tags: this.tags(),
            duration: { days: this.durationDays(), nights: this.durationNights() },
            pauseTheme: this.pauseTheme(),
            travelers: { min: this.travelerMin(), max: this.travelerMax() },
            pricing: {
                currentPrice: this.currentPrice(),
                offerPrice: this.offerPrice(),
                offerValidUntilDate: this.offerValidUntilDate() || undefined
            },
            offer: {
                enabled: this.offerEnabled(),
                title: this.offerTitle(),
                offerHeading: this.offerHeading(),
                validityType: this.offerValidityType(),
                validityValue: this.offerValidityValue(),
                recurring: this.offerRecurring(),
                tags: this.offerTags()
            },
            budget: { min: this.budgetMin(), max: this.budgetMax() },
            recurringPackage: {
                enabled: this.recurringPackageEnabled(),
                frequency: this.recurringPackageFrequency()
            },
            cardImage: this.cardImageUrl()
        };

        this.settingsChange.emit(s);
    }

    applyConversionToTrip() {
        // This button would permanently update the trip numbers
        const t = JSON.parse(JSON.stringify(this.trip()));
        const rate = this.conversionRate();
        const markup = 1 + (this.markupPercentage() / 100);
        const factor = rate * markup;

        t.preferences.currency = this.currency();
        t.preferences.language = this.language();

        if (this.conversionEnabled() || this.currency() !== 'USD' || factor !== 1) {
            if (t.itinerary?.days) {
                t.itinerary.days.forEach((day: any) => {
                    if (day.activities) {
                        day.activities.forEach((act: any) => {
                            if (act.cost) act.cost = Number((act.cost * factor).toFixed(2));
                        });
                    }
                });
            }
            if (t.accommodation) {
                t.accommodation.forEach((acc: any) => {
                    if (acc.price) acc.price = Number((acc.price * factor).toFixed(2));
                });
            }
            if (t.transportation) {
                if (t.transportation.flights) {
                    t.transportation.flights.forEach((f: any) => { if (f.price) f.price = Number((f.price * factor).toFixed(2)); });
                }
                if (t.transportation.trains) {
                    t.transportation.trains.forEach((tr: any) => { if (tr.price) tr.price = Number((tr.price * factor).toFixed(2)); });
                }
                if (t.transportation.other) {
                    t.transportation.other.forEach((o: any) => { if (o.price) o.price = Number((o.price * factor).toFixed(2)); });
                }
            }
        }

        this.tripChange.emit(t);
    }

    // SEO Update Logic
    onPublishUrlChange(url: string) {
        this.publishUrl.set(url);
        this.onSettingsChange();
    }

    private cloudinaryService = inject(CloudinaryService);

    triggerCardImageUpload() {
        const fileInput = document.getElementById('card-image-upload') as HTMLInputElement;
        if (fileInput) fileInput.click();
    }

    private geminiService = inject(GeminiService);

    generateSearchKeysWithAI() {
        if (this.isGeneratingKeys()) return;

        this.isGeneratingKeys.set(true);
        this.geminiService.generateSearchOptimization(this.trip()).then(keys => {
            this.fromSearchKeys.set(keys.from);
            this.toSearchKeys.set(keys.to);
            this.searchKeys.set(keys.search);
            this.offerSearchKeys.set(keys.offer);
            this.isGeneratingKeys.set(false);
            this.onSettingsChange();
        }).catch((err: any) => {
            console.error('AI Key Gen Failed', err);
            this.isGeneratingKeys.set(false);
            // Fallback to local logic if AI fails
            this.populateSearchKeys(this.trip());
        });
    }

    onCardImageSelect(event: any) {
        const file = event.target.files[0]; // From hidden input
        if (file) {
            this.cardImageUploading.set(true);
            this.cloudinaryService.uploadImage(file).subscribe({
                next: (url) => {
                    this.cardImageUrl.set(url);
                    this.cardImageUploading.set(false);
                    this.onSettingsChange();
                },
                error: (err) => {
                    console.error('Card image upload failed', err);
                    alert('Upload failed.');
                    this.cardImageUploading.set(false);
                }
            });
        }
    }

    // Helper
    generateSlug(title: string): string {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 1000);
    }
}
