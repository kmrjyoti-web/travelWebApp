import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-emergency-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule
    ],
    templateUrl: './emergency-editor.component.html'
})
export class EmergencyEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    ngOnInit() {
        const t = this.trip();
        if (!t.emergencyInfo) {
            t.emergencyInfo = {
                embassy: {
                    name: '',
                    address: '',
                    phone: '',
                    website: '',
                    details: ''
                },
                localServices: {
                    police: '',
                    ambulance: '',
                    fire: '',
                    medical: ''
                }
            };
            this.tripChange.emit(t);
        }
    }

    notifyUpdate() {
        this.tripChange.emit(this.trip());
    }
}
