
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Attraction, Itinerary, LocalEvent } from '../../models/itinerary.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore-places',
  templateUrl: './explore-places.component.html',
  styleUrls: ['./explore-places.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class ExplorePlacesComponent {
  attractions = input.required<Attraction[]>();
  itinerary = input.required<Itinerary>();
  events = input.required<LocalEvent[]>();
  attractionAdded = output<{ attraction: Attraction; day: number }>();
  eventAdded = output<{ event: LocalEvent; day: number }>();

  selectedDay: { [key: string]: number } = {};
  selectedDayForEvent: { [key: string]: number } = {};

  addAttraction(attraction: Attraction, attractionName: string) {
    const day = this.selectedDay[attractionName];
    if (day) {
      this.attractionAdded.emit({ attraction, day: +day });
    }
  }

  addEvent(event: LocalEvent, eventName: string) {
    const day = this.selectedDayForEvent[eventName];
    if (day) {
      this.eventAdded.emit({ event, day: +day });
    }
  }

  getImageUrl(query: string): string {
    const seed = query.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `https://picsum.photos/seed/${seed}/400/300`;
  }

  getCostIcon(cost: string): string {
    switch (cost) {
      case 'Free': return '✅';
      case 'Low': return '$';
      case 'Medium': return '$$';
      case 'High': return '$$$';
      default: return '?';
    }
  }
}
