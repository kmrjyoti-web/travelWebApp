import { Component, input, output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trip } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Textarea } from "primeng/textarea";

@Component({
  selector: 'app-general-info-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, Textarea],
  templateUrl: './general-info-editor.component.html'
})
export class GeneralInfoEditorComponent implements OnInit {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    const t = this.trip();
    this.form = this.fb.group({
      title: [t.itinerary.title, Validators.required],
      summary: [t.itinerary.summary, Validators.required],
      weather: [t.itinerary.weather],
      notes: [t.itinerary.notes]
    });

    this.form.valueChanges.subscribe(val => {
      if (this.form.valid) {
        // Create a copy of trip with updated values
        const updatedTrip = JSON.parse(JSON.stringify(this.trip()));
        updatedTrip.itinerary.title = val.title;
        updatedTrip.itinerary.summary = val.summary;
        updatedTrip.itinerary.weather = val.weather;
        updatedTrip.itinerary.notes = val.notes;

        this.tripChange.emit(updatedTrip);
      }
    });
  }
}
