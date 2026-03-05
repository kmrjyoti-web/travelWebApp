import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, AttractionPrice } from '../../../models/itinerary.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-attraction-price-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        DialogModule,
        FloatLabelModule
    ],
    templateUrl: './attraction-price-editor.component.html'
})
export class AttractionPriceEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    showDialog = false;
    editingIndex = signal<number>(-1);
    currentPrice: AttractionPrice | null = null;

    // Table columns for easier iteration if needed, though we can just hardcode th
    cols = [
        { field: 'name', header: 'Attraction Name' },
        { field: 'price', header: 'Price / Fee' },
        { field: 'notes', header: 'Notes' }
    ];

    openAdd() {
        this.currentPrice = {
            name: '',
            price: '',
            notes: ''
        };
        this.editingIndex.set(-1);
        this.showDialog = true;
    }

    edit(index: number) {
        if (this.trip().attractionPrices) {
            this.currentPrice = { ...this.trip().attractionPrices![index] };
            this.editingIndex.set(index);
            this.showDialog = true;
        }
    }

    save() {
        if (this.currentPrice) {
            const t = this.trip();
            if (!t.attractionPrices) t.attractionPrices = [];

            if (this.editingIndex() > -1) {
                t.attractionPrices[this.editingIndex()] = this.currentPrice;
            } else {
                t.attractionPrices.push(this.currentPrice);
            }

            this.tripChange.emit(t);
            this.showDialog = false;
            this.currentPrice = null;
        }
    }

    remove(index: number) {
        if (confirm('Remove this price reference?')) {
            const t = this.trip();
            t.attractionPrices?.splice(index, 1);
            this.tripChange.emit(t);
        }
    }
}
