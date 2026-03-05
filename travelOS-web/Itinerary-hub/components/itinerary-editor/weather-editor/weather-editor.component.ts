import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-weather-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule
    ],
    templateUrl: './weather-editor.component.html'
})
export class WeatherEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    notifyUpdate() {
        this.tripChange.emit(this.trip());
    }
}
