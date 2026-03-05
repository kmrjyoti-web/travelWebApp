
import { ChangeDetectionStrategy, Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Itinerary, Trip } from '../../models/itinerary.model';
import { ConfigService } from '../../services/config.service';
import { GeminiService } from '../../services/gemini.service';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule, CurrencyConverterPipe, FormsModule, TitleCasePipe],
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModalComponent {
  trip = input.required<Trip | null>();
  isOpen = input.required<boolean>();
  close = output<void>();

  private configService = inject(ConfigService);
  private geminiService = inject(GeminiService);
  private currencyConverter = new CurrencyConverterPipe();
  
  config = this.configService.getConfig();
  
  selectedLanguage = signal<string>('en');
  selectedCurrency = signal<string>('USD');
  isTranslating = signal<boolean>(false);
  translatedText = signal<string>('');
  copyStatus = signal<'idle' | 'copied'>('idle');

  canGenerate = computed(() => !!this.trip() && !this.isTranslating());

  async generateShareableText() {
    const currentTrip = this.trip();
    if (!currentTrip) return;

    this.isTranslating.set(true);
    this.translatedText.set('');
    this.copyStatus.set('idle');

    try {
      let itineraryToFormat = currentTrip.itinerary;
      // Translate if a different language is selected
      if (this.selectedLanguage() !== 'en') {
        itineraryToFormat = await this.geminiService.translateItinerary(currentTrip.itinerary, this.selectedLanguage());
      }
      this.formatItineraryAsText(itineraryToFormat, currentTrip);
    } catch (error) {
      console.error('Error during sharing process:', error);
      this.translatedText.set('Sorry, there was an error generating the text. Please try again.');
    } finally {
      this.isTranslating.set(false);
    }
  }

  private formatItineraryAsText(itinerary: Itinerary, tripDetails: Trip) {
    const currency = this.selectedCurrency();
    let text = `${itinerary.title.toUpperCase()}\n\n`;
    text += `${itinerary.summary}\n\n`;
    
    text += `DETAILS\n`;
    text += `----------------------------------------\n`;
    text += `Destination: ${tripDetails.preferences.to}\n`;
    text += `Travelers: ${tripDetails.preferences.adults} Adult(s)`;
    if (tripDetails.preferences.children > 0) {
      text += `, ${tripDetails.preferences.children} Child(ren)`;
    }
    text += `\n\n`;

    itinerary.days.forEach(day => {
      text += `========================================\n`;
      text += `DAY ${day.day}: ${day.theme}\n`;
      text += `========================================\n\n`;
      day.activities.forEach(activity => {
        const cost = activity.cost || 0;
        const costText = cost > 0 ? `(${this.currencyConverter.transform(cost, currency)})` : '(Free)';
        text += `[${activity.time}] ${activity.title} ${costText}\n`;
        text += `  - ${activity.description}\n\n`;
      });
    });
    
    text += `NOTES\n`;
    text += `----------------------------------------\n`;
    text += `${itinerary.notes}\n`;
    
    this.translatedText.set(text);
  }

  copyToClipboard() {
    if (!this.translatedText()) return;
    navigator.clipboard.writeText(this.translatedText()).then(() => {
      this.copyStatus.set('copied');
      setTimeout(() => this.copyStatus.set('idle'), 2000);
    });
  }
  
  resetAndClose() {
    this.selectedLanguage.set('en');
    this.selectedCurrency.set('USD');
    this.translatedText.set('');
    this.copyStatus.set('idle');
    this.close.emit();
  }
}
