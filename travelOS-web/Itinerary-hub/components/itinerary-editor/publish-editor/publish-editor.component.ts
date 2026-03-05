import { Component, input, signal, inject, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/itinerary.model';
import { ItineraryStore } from '../../../signal/store/itinerary.store';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-publish-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    CheckboxModule, 
    SelectModule, 
    InputNumberModule, 
    InputTextModule
  ],
  templateUrl: './publish-editor.component.html'
})
export class PublishEditorComponent implements OnInit {
  trip = input.required<Trip>();
  public itineraryStore = inject(ItineraryStore);

  languages = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' }
  ];

  selectedLanguage = signal('en');
  markup = signal(15);
  publishedUrl = signal('');
  confirmed = signal(false);
  showMarkupOnWebsite = signal(true);

  // Summary and calculation
  totalBaseCost = computed(() => {
    let cost = 0;
    const t = this.trip();
    
    // Sum attractions
    t.itinerary.days?.forEach(day => {
      day.activities?.forEach(act => {
        cost += act.cost || 0;
      });
    });

    // Sum accommodations
    t.accommodation?.forEach(acc => {
      cost += acc.price || 0;
    });

    // Sum transportation
    t.transportation?.flights?.forEach(f => cost += f.price || 0);
    t.transportation?.trains?.forEach(tr => cost += tr.price || 0);

    return cost;
  });

  totalPrice = computed(() => {
    return this.totalBaseCost() * (1 + this.markup() / 100);
  });

  constructor() {
    effect(() => {
        if (this.trip()) {
            this.syncToStore();
        }
    });
  }

  ngOnInit() {
    this.syncToStore();
  }

  private syncToStore() {

    const t = this.trip();
    const store = this.itineraryStore;

    // Basic Fields
    store.patchText('user_itineraries_code', t.itinerary.title.toLowerCase().replace(/\s+/g, '-'));
    store.patchText('itineraries_global_id', (t as any).id || Date.now().toString());
    store.patchText('itineraries_heading', t.itinerary.title);
    
    // Locations
    store.patchText('from_country', t.fromLocation?.country || t.preferences.from);
    store.patchText('from_country_code', t.fromLocation?.countryCode || null);
    store.patchText('from_state', t.fromLocation?.state || null);
    store.patchText('from_state_code', t.fromLocation?.stateCode || null);
    
    store.patchText('to_country', t.toLocation?.country || t.preferences.to);
    store.patchText('to_country_code', t.toLocation?.countryCode || null);
    store.patchText('to_state', t.toLocation?.state || null);
    store.patchText('to_state_code', t.toLocation?.stateCode || null);

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
    const t = this.trip();
    
    // from_search_key: country,countryCode,state,stateCode,city,cityCode
    const from = t.fromLocation;
    const fromParts = from ? [
        from.country, from.countryCode, 
        from.state, from.stateCode, 
        from.city, from.cityCode
    ] : [t.preferences.from];
    const fromKey = fromParts.filter(Boolean).join(',');
    
    // to_search_key: country,countryCode,state,stateCode,city,cityCode
    const to = t.toLocation;
    const toParts = to ? [
        to.country, to.countryCode, 
        to.state, to.stateCode, 
        to.city, to.cityCode
    ] : [t.preferences.to];
    const toKey = toParts.filter(Boolean).join(',');
    
    // search_key (concatenation of everything)
    const seoKeys = t.seo_detail?.keywords?.join(',') || '';
    const mappingKeys = t.mapping ? Object.values(t.mapping).flat().join(',') : '';
    const mainKey = [fromKey, toKey, seoKeys, mappingKeys].filter(Boolean).join(',');

    this.itineraryStore.patchText('from_search_key', fromKey);
    this.itineraryStore.patchText('to_search_key', toKey);
    this.itineraryStore.patchText('search_key', mainKey);
    this.itineraryStore.patchText('itineraries_url', this.publishedUrl());
  }

  onUrlChange(url: string) {
    this.publishedUrl.set(url);
    this.itineraryStore.patchText('itineraries_url', url);
    this.syncToStore();
  }

  onLanguageChange(v: any) {
    this.selectedLanguage.set(v);
    this.syncToStore();
  }

  onShowMarkupChange(v: any) {
    this.showMarkupOnWebsite.set(v);
    this.syncToStore();
  }

  onMarkupChange(v: any) {
    this.markup.set(v || 0);
    this.syncToStore(); // Refresh serialized details
  }

  publish() {
    if (this.confirmed()) {
        this.syncToStore(); // Final sync before submit
        this.itineraryStore.submit();
    }
  }
}
