import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, ItineraryDay, Activity } from '../../../models/itinerary.model';
import { FormsModule } from '@angular/forms';
// will import activity editor later
import { ActivityEditorComponent } from '../activity-editor/activity-editor.component';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-day-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ActivityEditorComponent,
    AccordionModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    DragDropModule,
    InputTextModule,
    FloatLabelModule
  ],
  templateUrl: './day-editor.component.html'
})
export class DayEditorComponent {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  // Dialog State
  displayEditDialog = signal(false);
  weatherDialogVisible = signal(false);
  editingActivity = signal<Activity | null>(null);
  editingDayIndex = signal<number>(-1);
  editingActivityIndex = signal<number>(-1);
  currentDayIndex = signal<number>(-1);

  openWeatherDialog(dayIndex: number) {
    this.currentDayIndex.set(dayIndex);
    this.weatherDialogVisible.set(true);
  }

  notifyUpdate() {
    this.tripChange.emit(this.trip());
  }

  addDay() {
    const t = this.trip();
    const nextDayNum = t.itinerary.days.length + 1;
    t.itinerary.days.push({
      day: nextDayNum,
      theme: 'New Day Theme',
      activities: [],
      nearbyPlaces: [],
      weather: { forecast: 'Sunny', dressCode: 'Casual' }
    });
    this.notifyUpdate();
  }

  drop(event: CdkDragDrop<Activity[]>, dayIndex: number) {
    const t = this.trip();
    moveItemInArray(t.itinerary.days[dayIndex].activities, event.previousIndex, event.currentIndex);
    this.notifyUpdate();
  }

  removeDay(index: number) {
    if (confirm('Are you sure you want to remove this day?')) {
      const t = this.trip();
      t.itinerary.days.splice(index, 1);
      // Re-index days
      t.itinerary.days.forEach((d, i) => d.day = i + 1);
      this.notifyUpdate();
    }
  }

  // Open the dialog to add a new activity or edit an existing one
  addActivity(dayIndex: number) {
    const newActivity: Activity = {
      time: 'Morning',
      title: 'New Activity',
      description: '',
      location: '',
      latitude: 0,
      longitude: 0,
      activityType: 'Sightseeing',
      cost: 0,
      tags: []
    };

    // We don't push yet. We open the dialog with this new activity.
    // If user saves, we push it then.
    // However, to simplify logic with indices, let's push it first, 
    // then open edit for it.
    const t = this.trip();
    t.itinerary.days[dayIndex].activities.push(newActivity);
    const actIndex = t.itinerary.days[dayIndex].activities.length - 1;
    this.openEditActivity(dayIndex, actIndex);

    // Let's notify immediately so structure exists, edits happen in dialog.
    this.notifyUpdate();
  }

  openEditActivity(dayIndex: number, actIndex: number) {
    const t = this.trip();
    const activityToEdit = t.itinerary.days[dayIndex].activities[actIndex];

    // Deep copy for the editing session so we don't mutate directly until save
    this.editingActivity.set(JSON.parse(JSON.stringify(activityToEdit)));
    this.editingDayIndex.set(dayIndex);
    this.editingActivityIndex.set(actIndex);
    this.displayEditDialog.set(true);
  }

  saveActivity() {

    const edited = this.editingActivity();
    const dIndex = this.editingDayIndex();
    const aIndex = this.editingActivityIndex();

    if (edited && dIndex >= 0 && aIndex >= 0) {
      const t = this.trip();
      // Update the array with the edited version
      t.itinerary.days[dIndex].activities[aIndex] = edited;
      this.notifyUpdate();
      this.displayEditDialog.set(false);
    }
  }

  cancelEdit() {
    this.displayEditDialog.set(false);
    this.editingActivity.set(null);
  }

  removeActivity(dayIndex: number, actIndex: number) {
    const t = this.trip();
    t.itinerary.days[dayIndex].activities.splice(actIndex, 1);
    this.notifyUpdate();
  }
}
