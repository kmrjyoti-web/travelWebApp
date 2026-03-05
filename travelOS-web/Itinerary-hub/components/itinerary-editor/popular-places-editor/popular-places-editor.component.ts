import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, Attraction } from '../../../models/itinerary.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-popular-places-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule,
        RatingModule,
        DropdownModule
    ],
    templateUrl: './popular-places-editor.component.html'
})
export class PopularPlacesEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    showDialog = false;
    editingIndex = signal<number>(-1);
    currentPlace: Attraction | null = null;

    costOptions = [
        { label: 'Free', value: 'Free' },
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
    ];

    openAdd() {
        this.currentPlace = {
            name: '',
            description: '',
            imageQuery: '',
            estimatedCost: 'Free',
            estimatedDuration: '',
            latitude: 0,
            longitude: 0,
            category: 'Sightseeing',
            rating: 0
        };
        this.editingIndex.set(-1);
        this.showDialog = true;
    }

    edit(index: number) {
        if (this.trip().attractions) {
            this.currentPlace = { ...this.trip().attractions![index] };
            this.editingIndex.set(index);
            this.showDialog = true;
        }
    }

    save() {
        if (this.currentPlace) {
            const t = this.trip();
            if (!t.attractions) t.attractions = [];

            if (this.editingIndex() > -1) {
                t.attractions[this.editingIndex()] = this.currentPlace;
            } else {
                t.attractions.push(this.currentPlace);
            }

            this.tripChange.emit(t);
            this.showDialog = false;
            this.currentPlace = null;
        }
    }

    remove(index: number) {
        if (confirm('Remove this place?')) {
            const t = this.trip();
            t.attractions?.splice(index, 1);
            this.tripChange.emit(t);
        }
    }
}
