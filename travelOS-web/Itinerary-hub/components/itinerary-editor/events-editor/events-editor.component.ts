import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, LocalEvent } from '../../../models/itinerary.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import {Tooltip} from "primeng/tooltip";

@Component({
    selector: 'app-events-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule,
        CalendarModule,
        Tooltip
    ],
    templateUrl: './events-editor.component.html'
})
export class EventsEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    showDialog = false;
    editingIndex = signal<number>(-1);
    currentEvent: LocalEvent | null = null;

    openAdd() {
        this.currentEvent = {
            name: '',
            date: '',
            description: '',
            venue: '',
            cost: 0
        };
        this.editingIndex.set(-1);
        this.showDialog = true;
    }

    edit(index: number) {
        if (this.trip().events) {
            this.currentEvent = { ...this.trip().events![index] };
            this.editingIndex.set(index);
            this.showDialog = true;
        }
    }

    save() {
        if (this.currentEvent) {
            const t = this.trip();
            if (!t.events) t.events = [];

            if (this.editingIndex() > -1) {
                t.events[this.editingIndex()] = this.currentEvent;
            } else {
                t.events.push(this.currentEvent);
            }

            this.tripChange.emit(t);
            this.showDialog = false;
            this.currentEvent = null;
        }
    }

    parsedDate(date: string | undefined): string {
        if (!date) return '';
        // Handle "YYYY-MM-DD to YYYY-MM-DD" format
        if (date.includes(' to ')) {
            return date.split(' to ')[0];
        }
        return date;
    }

    remove(index: number) {
        if (confirm('Remove this event?')) {
            const t = this.trip();
            t.events?.splice(index, 1);
            this.tripChange.emit(t);
        }
    }
}
