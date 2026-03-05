import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, VisaInfo, VisaProcessStep } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';

@Component({
    selector: 'app-visa-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule,
        ButtonModule,
        TableModule,
        DialogModule,
        ChipsModule
    ],
    templateUrl: './visa-editor.component.html'
})
export class VisaEditorComponent {
    trip = input.required<Trip>();
    tripChange = output<Trip>();

    showStepDialog = false;
    editingStepIndex = signal<number>(-1);
    currentStep: VisaProcessStep | null = null;

    ngOnInit() {
        const t = this.trip();
        if (!t.visaInfo) {
            t.visaInfo = {
                summary: '',
                sources: [],
                processSteps: []
            };
            this.tripChange.emit(t);
        }
    }

    notifyUpdate() {
        this.tripChange.emit(this.trip());
    }

    // Source Management
    addSource() {
        if (!this.trip().visaInfo.sources) this.trip().visaInfo.sources = [];
        this.trip().visaInfo.sources.push({ title: '', uri: '' });
        this.notifyUpdate();
    }

    removeSource(index: number) {
        this.trip().visaInfo.sources.splice(index, 1);
        this.notifyUpdate();
    }

    // Step Management
    openAddStep() {
        this.currentStep = {
            step: (this.trip().visaInfo.processSteps?.length || 0) + 1,
            title: '',
            description: '',
            duration: '',
            documents: []
        };
        this.editingStepIndex.set(-1);
        this.showStepDialog = true;
    }

    editStep(index: number) {
        if (this.trip().visaInfo.processSteps) {
            this.currentStep = { ...this.trip().visaInfo.processSteps![index] };
            this.editingStepIndex.set(index);
            this.showStepDialog = true;
        }
    }

    saveStep() {
        if (this.currentStep) {
            const t = this.trip();
            if (!t.visaInfo.processSteps) t.visaInfo.processSteps = [];

            if (this.editingStepIndex() > -1) {
                t.visaInfo.processSteps[this.editingStepIndex()] = this.currentStep;
            } else {
                t.visaInfo.processSteps.push(this.currentStep);
            }

            // Re-index steps
            t.visaInfo.processSteps.forEach((step, idx) => step.step = idx + 1);

            this.tripChange.emit(t);
            this.showStepDialog = false;
            this.currentStep = null;
        }
    }

    removeStep(index: number) {
        if (confirm('Remove this step?')) {
            const t = this.trip();
            t.visaInfo.processSteps?.splice(index, 1);
            // Re-index steps
            t.visaInfo.processSteps?.forEach((step, idx) => step.step = idx + 1);
            this.tripChange.emit(t);
        }
    }
}
