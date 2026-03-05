import { ChangeDetectionStrategy, Component, input, output, inject, OnInit, computed, signal, OnDestroy, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormPreferences, TripDraft } from '../../models/itinerary.model';
import { ConfigService } from '../../services/config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { dateRange: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-itinerary-form',
  templateUrl: './itinerary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ItineraryFormComponent implements OnInit, OnDestroy {
  isGenerating = input<boolean>(false);
  loadingMessage = input<string>('');
  draftToLoad = input<TripDraft | null>(null);
  generate = output<FormPreferences>();
  cancel = output<void>();

  // FIX: Explicitly type `fb` as `FormBuilder` to resolve type inference issues.
  private fb: FormBuilder = inject(FormBuilder);
  private configService = inject(ConfigService);
  private destroy$ = new Subject<void>();

  config = this.configService.getConfig();
  servicesList = this.config.services;
  modelOptions = this.configService.modelOptions;

  currentStep = signal(1);
  minDate = new Date().toISOString().split('T')[0];

  form = this.fb.group({
    from: [''],
    to: ['', Validators.required],
    dates: this.fb.group({
      startDate: [this.minDate, Validators.required],
      endDate: [this.getFutureDate(5), Validators.required],
    }, { validators: dateRangeValidator() }),
    adults: [1, [Validators.required, Validators.min(1)]],
    children: [0, [Validators.required, Validators.min(0)]],
    currency: [this.config.formOptions.currencies[0].code, Validators.required],
    budget: [this.config.formOptions.budget[1], Validators.required],
    accommodationType: [this.config.formOptions.accommodation[0], Validators.required],
    starRating: [this.config.formOptions.starRating[0]],
    food: ['Local Cuisine', Validators.required],
    interests: ['A mix of cultural sights, local food experiences, and some relaxation.', Validators.required],
    includeNightlife: [false],
    tripNature: ['Balanced'],
    selectedModel: ['gemini-2.5-flash'], // Default model
    services: this.fb.array([]),
    terms: [false, Validators.requiredTrue],
    preferredAirline: [''],
    flightDepartureTime: [this.config.formOptions.flightTimes[0].id],
    flightArrivalTime: [this.config.formOptions.flightTimes[0].id],
    trainPreference: [this.config.formOptions.trainTypes[0].id],
  });

  private formChangeSignal = signal(0);

  constructor() {
    effect(() => {
      const draft = this.draftToLoad();
      if (draft) {
        this.form.patchValue({
          to: draft.destination,
          dates: {
            startDate: draft.startDate,
            endDate: draft.endDate,
          },
          interests: draft.interests,
        });
        this.currentStep.set(1);
      }
    });
  }

  // Step Validation
  isStep1Valid = computed(() => {
    this.formChangeSignal(); // depend on change signal
    return this.form.controls.to.valid &&
      this.form.controls.dates.valid &&
      this.form.controls.budget.valid &&
      this.form.controls.adults.valid &&
      this.form.controls.children.valid;
  });

  isStep2Valid = computed(() => {
    this.formChangeSignal(); // depend on change signal
    return this.form.controls.accommodationType.valid;
  });

  isNextDisabled = computed(() => {
    if (this.currentStep() === 1) {
      return !this.isStep1Valid();
    }
    if (this.currentStep() === 2) {
      return !this.isStep2Valid();
    }
    return false;
  });

  ngOnInit() {
    this.servicesList.forEach(() => {
      this.services.push(this.fb.control(false));
    });

    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // On any value change, update a signal to trigger
      // computed signals to re-evaluate.
      this.formChangeSignal.update(c => c + 1);
    });
  }

  getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get services() {
    return this.form.controls['services'] as FormArray;
  }

  getServiceControl(index: number): FormControl {
    return this.services.at(index) as FormControl;
  }

  nextStep() {
    if (this.currentStep() < 3) {
      this.currentStep.update(step => step + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  isServiceSelected(serviceId: string): boolean {
    const serviceIndex = this.servicesList.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return false;
    }
    return this.services.controls[serviceIndex]?.value || false;
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const startDate = new Date(formValue.dates!.startDate!);
      const endDate = new Date(formValue.dates!.endDate!);
      const diffTime = endDate.getTime() - startDate.getTime();
      const durationDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const selectedServices = formValue.services
        .map((checked, i) => checked ? this.servicesList[i].id : null)
        .filter(v => v !== null) as string[];

      const preferences: FormPreferences = {
        from: formValue.from || 'Not specified',
        to: formValue.to!,
        startDate: formValue.dates!.startDate!,
        endDate: formValue.dates!.endDate!,
        days: durationDays,
        budget: formValue.budget!,
        accommodationType: formValue.accommodationType!,
        starRating: formValue.starRating!,
        food: formValue.food!,
        interests: formValue.interests!,
        services: selectedServices,
        adults: formValue.adults!,
        children: formValue.children!,
        currency: formValue.currency!,
        includeNightlife: formValue.includeNightlife || undefined,
        tripNature: formValue.tripNature || undefined,
        selectedModel: formValue.selectedModel || 'gemini-2.5-flash',
        preferredAirline: formValue.preferredAirline || undefined,
        flightDepartureTime: formValue.flightDepartureTime || undefined,
        flightArrivalTime: formValue.flightArrivalTime || undefined,
        trainPreference: formValue.trainPreference || undefined,
      };
      this.generate.emit(preferences);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
