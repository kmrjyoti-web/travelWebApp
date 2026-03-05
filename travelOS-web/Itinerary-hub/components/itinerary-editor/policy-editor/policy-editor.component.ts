import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/itinerary.model';
import { ChipsModule } from 'primeng/chips';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-policy-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChipsModule,
        FloatLabelModule
    ],
    templateUrl: './policy-editor.component.html'
})
export class PolicyEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    notifyUpdate() {
        this.tripChange.emit(this.trip());
    }
}
