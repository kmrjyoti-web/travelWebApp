import { ChangeDetectionStrategy, Component, input, output, signal, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, AccommodationDetails } from '../../models/itinerary.model';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-accommodation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccommodationComponent implements OnChanges {
  trip = input.required<Trip>();
  mode = input<'maker' | 'viewer'>('maker');
  tripUpdated = output<Trip>();

  private configService = inject(ConfigService);
  config = this.configService.getConfig();

  editableAccommodations = signal<AccommodationDetails[] | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trip']) {
      this.editableAccommodations.set(
        this.trip().accommodation ? JSON.parse(JSON.stringify(this.trip().accommodation)) : []
      );
    }
  }

  notifyUpdate() {
    const currentTrip = this.trip();
    if (currentTrip) {
      const updatedTrip: Trip = {
        ...currentTrip,
        accommodation: this.editableAccommodations() ? JSON.parse(JSON.stringify(this.editableAccommodations())) : undefined,
      };
      this.tripUpdated.emit(updatedTrip);
    }
  }

  addAccommodation() {
    const newAccommodation: AccommodationDetails = {
      id: `acc_${Date.now()}`,
      type: 'Hotel',
      hotelName: 'New Accommodation',
      checkInDate: this.trip().preferences.startDate,
      checkOutDate: this.trip().preferences.endDate,
      price: 0,
      facilities: ['WiFi'],
      imageQuery: 'modern hotel lobby',
      address: '123 Main Street, City, Country',
      rating: 4,
      roomType: 'Standard Room',
      boardBasis: 'Room Only',
      contactNumber: '+1 234 567 8900',
      website: 'https://example.com'
    };
    this.editableAccommodations.update(accommodations => [...(accommodations || []), newAccommodation]);
    this.notifyUpdate();
  }
  
  removeAccommodation(id: string) {
    this.editableAccommodations.update(accommodations => accommodations ? accommodations.filter(acc => acc.id !== id) : null);
    this.notifyUpdate();
  }

  addFacility(accIndex: number) {
    this.editableAccommodations.update(accommodations => {
        if (!accommodations || !accommodations[accIndex]) return accommodations;
        const newAccommodations = [...accommodations];
        const newFacilities = [...(newAccommodations[accIndex].facilities || []), 'New Facility'];
        newAccommodations[accIndex] = {...newAccommodations[accIndex], facilities: newFacilities};
        return newAccommodations;
    });
    this.notifyUpdate();
  }
  
  removeFacility(accIndex: number, facilityIndex: number) {
      this.editableAccommodations.update(accommodations => {
        if (!accommodations || !accommodations[accIndex]?.facilities) return accommodations;
        const newAccommodations = [...accommodations];
        const newFacilities = [...newAccommodations[accIndex].facilities];
        newFacilities.splice(facilityIndex, 1);
        newAccommodations[accIndex] = {...newAccommodations[accIndex], facilities: newFacilities};
        return newAccommodations;
    });
    this.notifyUpdate();
  }

  trackById(index: number, item: AccommodationDetails): string {
    return item.id;
  }
  
  trackByIndex(index: number, item: any): any {
    return index;
  }
  
  getImageUrl(query: string | undefined): string {
    if (!query) return 'https://picsum.photos/seed/hotel/800/600';
    const seed = query.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `https://picsum.photos/seed/${seed}/800/600`;
  }
  
  getRatingAsStars(rating: number | undefined): string[] {
    const r = rating ?? 0;
    const fullStars = Math.floor(r);
    const halfStar = r % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }
}
