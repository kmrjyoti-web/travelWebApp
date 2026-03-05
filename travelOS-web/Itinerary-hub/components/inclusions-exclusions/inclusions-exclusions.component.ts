
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inclusions-exclusions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inclusions-exclusions.component.html',
  styleUrls: ['./inclusions-exclusions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InclusionsExclusionsComponent {
  inclusions = input.required<string[] | undefined>();
  exclusions = input.required<string[] | undefined>();
}
