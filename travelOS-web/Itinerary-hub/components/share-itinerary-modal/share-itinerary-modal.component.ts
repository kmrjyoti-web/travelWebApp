import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedTrip } from '../../models/itinerary.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-share-itinerary-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './share-itinerary-modal.component.html',
  styleUrls: ['./share-itinerary-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareItineraryModalComponent {
  trip = input<SavedTrip | null>();
  close = output<void>();
  share = output<{ name: string; email: string; mobile: string; tripId: string }>();

  // FIX: Explicitly type `fb` as `FormBuilder` to resolve type inference issues.
  private fb: FormBuilder = inject(FormBuilder);

  shareForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9-+\\s()]*$')]],
  });

  onSubmit() {
    if (this.shareForm.valid) {
      const currentTrip = this.trip();
      if (currentTrip) {
        const formValue = this.shareForm.getRawValue();
        this.share.emit({
            name: formValue.name || '',
            email: formValue.email || '',
            mobile: formValue.mobile || '',
            tripId: currentTrip.id
        });
        this.shareForm.reset();
      }
    } else {
        this.shareForm.markAllAsTouched();
    }
  }

  handleClose() {
    this.shareForm.reset();
    this.close.emit();
  }
}
