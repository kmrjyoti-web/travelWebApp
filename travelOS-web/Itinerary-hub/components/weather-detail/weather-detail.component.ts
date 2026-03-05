import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Itinerary } from '../../models/itinerary.model';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-detail.component.html',
  styleUrls: ['./weather-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherDetailComponent {
  itinerary = input.required<Itinerary>();
}
