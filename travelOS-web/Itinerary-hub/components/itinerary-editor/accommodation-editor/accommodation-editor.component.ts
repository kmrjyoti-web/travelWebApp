import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, AccommodationDetails } from '../../../models/itinerary.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RatingModule } from 'primeng/rating';
import { Textarea } from 'primeng/textarea';
import { ChipsModule } from 'primeng/chips';

@Component({
    selector: 'app-accommodation-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        CalendarModule,
        FloatLabelModule,
        RatingModule,
        Textarea,
        ChipsModule
    ],
    templateUrl: './accommodation-editor.component.html'
})
export class AccommodationEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    showDialog = false;
    editingIndex = signal<number>(-1);
    currentAccommodation: AccommodationDetails | null = null;

    openAdd() {
        this.currentAccommodation = {
            id: crypto.randomUUID(),
            type: 'Hotel',
            hotelName: '',
            checkInDate: '',
            checkOutDate: '',
            price: 0,
            facilities: [],
            imageQuery: '',
            rating: 0,
            address: '',
            roomType: ''
        };
        this.editingIndex.set(-1);
        this.showDialog = true;
    }

    edit(index: number) {
        if (this.trip().accommodation) {
            this.currentAccommodation = { ...this.trip().accommodation![index] };
            this.editingIndex.set(index);
            this.showDialog = true;
        }
    }

    save() {
        if (this.currentAccommodation) {
            const t = this.trip();
            if (!t.accommodation) t.accommodation = [];

            if (this.editingIndex() > -1) {
                t.accommodation[this.editingIndex()] = this.currentAccommodation;
            } else {
                t.accommodation.push(this.currentAccommodation);
            }

            this.tripChange.emit(t);
            this.showDialog = false;
            this.currentAccommodation = null;
        }
    }

    remove(index: number) {
        if (confirm('Remove this accommodation?')) {
            const t = this.trip();
            t.accommodation?.splice(index, 1);
            this.tripChange.emit(t);
        }
    }
}
