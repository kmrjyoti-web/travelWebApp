import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, TourCategory } from '../../../models/itinerary.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-mapping-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapping-editor.component.html'
})
export class MappingEditorComponent implements OnInit {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  private dataService = inject(DataService);
  categories = signal<TourCategory[]>([]);
  openCategories = signal<{ [key: string]: boolean }>({});

  ngOnInit() {
    this.categories.set(this.dataService.getTourCategories());
    this.initializeOpenState();
  }

  private initializeOpenState() {
    const initialState: { [key: string]: boolean } = {};
    this.categories().forEach((cat, index) => {
      initialState[cat.code] = index === 0;
    });
    this.openCategories.set(initialState);
  }

  toggleCategory(categoryCode: string) {
    this.openCategories.update(current => ({ ...current, [categoryCode]: !current[categoryCode] }));
  }

  onCheckboxChange(categoryCode: string, itemCode: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    // Create a shallow copy of the trip and its mapping object
    const currentTrip = { 
      ...this.trip(),
      mapping: { ...this.trip().mapping || {} }
    };
    
    if (!currentTrip.mapping[categoryCode]) {
      currentTrip.mapping[categoryCode] = [];
    }
    
    // Create a copy of the specific category's items array
    const currentSelection = [...currentTrip.mapping[categoryCode]];
    
    if (isChecked) {
      if (!currentSelection.includes(itemCode)) {
        currentSelection.push(itemCode);
      }
    } else {
      const index = currentSelection.indexOf(itemCode);
      if (index > -1) {
        currentSelection.splice(index, 1);
      }
    }

    if (currentSelection.length === 0) {
      delete currentTrip.mapping[categoryCode];
    } else {
      currentTrip.mapping[categoryCode] = currentSelection;
    }

    this.tripChange.emit(currentTrip);
  }

  isChecked(categoryCode: string, itemCode: string): boolean {
    return this.trip().mapping?.[categoryCode]?.includes(itemCode) ?? false;
  }
}
