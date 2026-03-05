import { ChangeDetectionStrategy, Component, input, output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCategory, TourCategoryItem } from '../../models/itinerary.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-itinerary-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './itinerary-mapping.component.html',
  styleUrls: ['./itinerary-mapping.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryMappingComponent implements OnInit, OnChanges {
  categories = input.required<TourCategory[]>();
  currentMapping = input.required<{ [key: string]: string[] }>();
  mappingSaved = output<{ [key: string]: string[] }>();

  selectedMapping: { [key: string]: string[] } = {};
  saveStatus = signal<'idle' | 'saving' | 'saved'>('idle');
  openCategories = signal<{ [key: string]: boolean }>({});

  ngOnInit() {
    this.initializeMapping();
    this.initializeOpenState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentMapping']) {
      this.initializeMapping();
    }
  }

  initializeMapping() {
    this.selectedMapping = JSON.parse(JSON.stringify(this.currentMapping() || {}));
  }

  initializeOpenState() {
    const initialState: { [key: string]: boolean } = {};
    this.categories().forEach((cat, index) => {
      initialState[cat.code] = index === 0; // Open the first category by default
    });
    this.openCategories.set(initialState);
  }

  toggleCategory(categoryCode: string) {
    this.openCategories.update(current => ({ ...current, [categoryCode]: !current[categoryCode] }));
  }

  onCheckboxChange(categoryCode: string, itemCode: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (!this.selectedMapping[categoryCode]) {
      this.selectedMapping[categoryCode] = [];
    }
    
    const currentSelection = this.selectedMapping[categoryCode];
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
      delete this.selectedMapping[categoryCode];
    }
  }

  isChecked(categoryCode: string, itemCode: string): boolean {
    return this.selectedMapping[categoryCode]?.includes(itemCode) ?? false;
  }
  
  saveMapping() {
    this.saveStatus.set('saving');
    this.mappingSaved.emit(this.selectedMapping);

    setTimeout(() => {
      this.saveStatus.set('saved');
      setTimeout(() => this.saveStatus.set('idle'), 2000);
    }, 1000);
  }
}
