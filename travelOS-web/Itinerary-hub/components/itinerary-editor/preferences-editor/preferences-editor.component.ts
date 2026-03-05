import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, FormPreferences } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-preferences-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputTextModule, 
    InputNumberModule,
    DropdownModule,
    FloatLabelModule,
    CalendarModule,
    CheckboxModule,
    MultiSelectModule,
    ChipsModule
  ],
  templateUrl: './preferences-editor.component.html'
})
export class PreferencesEditorComponent {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  // Options
  budgetOptions = [
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
      { label: 'Luxury', value: 'Luxury' }
  ];

  tripNatureOptions = [
      { label: 'Relaxed', value: 'Relaxed' },
      { label: 'Adventure', value: 'Adventure' },
      { label: 'Family', value: 'Family' },
      { label: 'Romantic', value: 'Romantic' },
      { label: 'Cultural', value: 'Cultural' },
      { label: 'Religious', value: 'Religious' },
       { label: 'Business', value: 'Business' }
  ];

  accommodationTypeOptions = [
      { label: 'Hotel', value: 'Hotel' },
      { label: 'Hostel', value: 'Hostel' },
      { label: 'Resort', value: 'Resort' },
      { label: 'Airbnb', value: 'Airbnb' },
      { label: 'Guesthouse', value: 'Guesthouse' }
  ];
  
  starRatingOptions = [
      { label: '3 Star', value: '3 Star' },
      { label: '4 Star', value: '4 Star' },
      { label: '5 Star', value: '5 Star' },
      { label: '5 Star Luxury', value: '5 Star Luxury' }
  ];

  serviceOptions = [
      { label: 'Flights', value: 'Flight' },
      { label: 'Hotels', value: 'Hotel' },
      { label: 'Transfers', value: 'Transfer' },
      { label: 'Activities', value: 'Activity' },
       { label: 'Visa', value: 'Visa' },
       { label: 'Insurance', value: 'Insurance' }
  ];

  notifyUpdate() {
    this.tripChange.emit(this.trip());
  }
}
