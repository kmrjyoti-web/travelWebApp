
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Attraction, EmergencyInfo } from '../../models/itinerary.model';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';

@Component({
  selector: 'app-emergency-info',
  templateUrl: './emergency-info.component.html',
  styleUrls: ['./emergency-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyConverterPipe],
})
export class EmergencyInfoComponent {
  emergencyInfo = input.required<EmergencyInfo>();
  attractions = input.required<Attraction[]>();
  markupPercentage = input(0);
  currency = input.required<string>();
}
