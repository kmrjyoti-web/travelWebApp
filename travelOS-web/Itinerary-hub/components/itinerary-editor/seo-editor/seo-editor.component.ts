import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, SEODetails } from '../../../models/itinerary.model';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {ButtonDirective} from "primeng/button";

@Component({
  selector: 'app-seo-editor',
  standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        FloatLabelModule,
        ChipsModule,
        DividerModule,
        DropdownModule,
        ButtonDirective
    ],
  templateUrl: './seo-editor.component.html'
})
export class SeoEditorComponent {
  trip = input.required<Trip>();
  tripChange = output<Trip>();

  robotOptions = [
      { label: 'Index, Follow', value: 'index, follow' },
      { label: 'NoIndex, Follow', value: 'noindex, follow' },
      { label: 'Index, NoFollow', value: 'index, nofollow' },
      { label: 'NoIndex, NoFollow', value: 'noindex, nofollow' }
  ];

  twitterCardOptions = [
      { label: 'Summary', value: 'summary' },
      { label: 'Summary Large Image', value: 'summary_large_image' },
      { label: 'App', value: 'app' },
      { label: 'Player', value: 'player' }
  ];

  ngOnInit() {
    const t = this.trip();
    if (!t.seo_detail) {
        t.seo_detail = {
            title: '',
            metaDescription: '',
            keywords: [],
            robots: 'index, follow'
        };
        this.tripChange.emit(t);
    }
  }

  notifyUpdate() {
    this.tripChange.emit(this.trip());
  }
}
