import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, FlightDetails, TrainDetails } from '../../../models/itinerary.model';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-transportation-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TabViewModule,
        ButtonModule,
        DialogModule,
        TableModule,
        CalendarModule,
        InputTextModule,
        Textarea,
        FloatLabelModule
    ],
    templateUrl: './transportation-editor.component.html'
})
export class TransportationEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    // Dialog State
    showFlightDialog = false;
    editingFlightIndex = signal<number>(-1);
    currentFlight: FlightDetails | null = null;

    showTrainDialog = false;
    editingTrainIndex = signal<number>(-1);
    currentTrain: TrainDetails | null = null;

    showOtherDialog = false;
    editingOtherIndex = signal<number>(-1);
    currentOther: { type: string; details: string; price: number } | null = null;

    notifyUpdate() {
        this.tripChange.emit(this.trip());
    }

    // FLIGHTS
    openAddFlight() {
        this.currentFlight = {
            airline: '',
            departureAirport: '',
            arrivalAirport: '',
            departureTime: '',
            arrivalTime: '',
            price: 0
        };
        this.editingFlightIndex.set(-1);
        this.showFlightDialog = true;
    }

    editFlight(index: number) {
        if (this.trip().transportation?.flights) {
            this.currentFlight = { ...this.trip().transportation!.flights![index] };
            this.editingFlightIndex.set(index);
            this.showFlightDialog = true;
        }
    }

    saveFlight() {
        if (this.currentFlight) {
            const t = this.trip();
            if (!t.transportation) t.transportation = {};
            if (!t.transportation.flights) t.transportation.flights = [];

            if (this.editingFlightIndex() > -1) {
                t.transportation.flights[this.editingFlightIndex()] = this.currentFlight;
            } else {
                t.transportation.flights.push(this.currentFlight);
            }
            this.notifyUpdate();
            this.showFlightDialog = false;
            this.currentFlight = null;
        }
    }

    removeFlight(index: number) {
        if (confirm('Remove this flight?')) {
            const t = this.trip();
            t.transportation?.flights?.splice(index, 1);
            this.notifyUpdate();
        }
    }

    // TRAINS
    openAddTrain() {
        this.currentTrain = {
            trainType: '',
            departureStation: '',
            arrivalStation: '',
            departureTime: '',
            arrivalTime: '',
            price: 0
        };
        this.editingTrainIndex.set(-1);
        this.showTrainDialog = true;
    }

    editTrain(index: number) {
        if (this.trip().transportation?.trains) {
            this.currentTrain = { ...this.trip().transportation!.trains![index] };
            this.editingTrainIndex.set(index);
            this.showTrainDialog = true;
        }
    }

    saveTrain() {
        if (this.currentTrain) {
            const t = this.trip();
            if (!t.transportation) t.transportation = {};
            if (!t.transportation.trains) t.transportation.trains = [];

            if (this.editingTrainIndex() > -1) {
                t.transportation.trains[this.editingTrainIndex()] = this.currentTrain;
            } else {
                t.transportation.trains.push(this.currentTrain);
            }
            this.notifyUpdate();
            this.showTrainDialog = false;
            this.currentTrain = null;
        }
    }

    removeTrain(index: number) {
        if (confirm('Remove this train?')) {
            const t = this.trip();
            t.transportation?.trains?.splice(index, 1);
            this.notifyUpdate();
        }
    }

    // OTHER
    openAddOther() {
        this.currentOther = { type: '', details: '', price: 0 };
        this.editingOtherIndex.set(-1);
        this.showOtherDialog = true;
    }

    editOther(index: number) {
        if (this.trip().transportation?.other) {
            this.currentOther = { ...this.trip().transportation!.other![index] };
            this.editingOtherIndex.set(index);
            this.showOtherDialog = true;
        }
    }

    saveOther() {
        if (this.currentOther) {
            const t = this.trip();
            if (!t.transportation) t.transportation = {};
            if (!t.transportation.other) t.transportation.other = [];

            if (this.editingOtherIndex() > -1) {
                t.transportation.other[this.editingOtherIndex()] = this.currentOther;
            } else {
                t.transportation.other.push(this.currentOther);
            }
            this.notifyUpdate();
            this.showOtherDialog = false;
            this.currentOther = null;
        }
    }

    removeOther(index: number) {
        if (confirm('Remove this transport?')) {
            const t = this.trip();
            t.transportation?.other?.splice(index, 1);
            this.notifyUpdate();
        }
    }
}
