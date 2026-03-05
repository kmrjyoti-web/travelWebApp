import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, LocationDetails } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-search-details-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputTextModule, 
    FloatLabelModule,
    ChipsModule,
    DividerModule
  ],
  templateUrl: './search-details-editor.component.html'
})
export class SearchDetailsEditorComponent {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  ngOnInit() {
    const t = this.trip();
    let updated = false;

    if (!t.fromLocation) {
        t.fromLocation = this.createEmptyLocation();
        updated = true;
    }
    if (!t.toLocation) {
        t.toLocation = this.createEmptyLocation();
        updated = true;
    }
    if (!t.search_keys) {
        t.search_keys = [];
        updated = true;
    }

    if (updated) {
        this.tripChange.emit(t);
    }
  }

  createEmptyLocation(): LocationDetails {
      return {
          city: '',
          cityCode: '',
          state: '',
          stateCode: '',
          country: '',
          countryCode: '',
          address: ''
      };
  }

  notifyUpdate() {
    this.tripChange.emit(this.trip());
  }

  addCustomField(location: LocationDetails) {
      if (!location.customFields) {
          location.customFields = [];
      }
      location.customFields.push({ key: '', value: '' });
      this.notifyUpdate();
  }

  removeCustomField(location: LocationDetails, index: number) {
      location.customFields?.splice(index, 1);
      this.notifyUpdate();
  }
}
