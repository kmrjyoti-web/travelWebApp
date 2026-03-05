import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisaInfo } from '../../models/itinerary.model';

@Component({
  selector: 'app-visa-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visa-info.component.html',
  styleUrls: ['./visa-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisaInfoComponent {
  visaInfo = input.required<VisaInfo>();
}
