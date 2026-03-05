import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Activity } from '../../../models/itinerary.model';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { DropdownModule } from 'primeng/dropdown';
import {Textarea} from "primeng/textarea";

@Component({
  selector: 'app-activity-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatLabelModule, InputTextModule, DropdownModule, Textarea],
  templateUrl: './activity-editor.component.html'
})
export class ActivityEditorComponent {
  activity = input.required<Activity>();
  activityChange = output<void>();
  remove = output<void>();

  notifyUpdate() {
    this.activityChange.emit();
  }
}
