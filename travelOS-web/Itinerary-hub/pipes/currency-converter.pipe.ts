
import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ConfigService } from '../services/config.service';

@Pipe({
  name: 'currencyConverter',
  standalone: true,
})
export class CurrencyConverterPipe implements PipeTransform {
  private configService = inject(ConfigService);
  private currencyPipe = new CurrencyPipe('en-US');
  private currencies = this.configService.getConfig().formOptions.currencies;

  transform(value: number | undefined | null, currencyCode: string = 'USD'): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    
    if (value === 0 && currencyCode) {
      return this.currencyPipe.transform(0, currencyCode, 'symbol', '1.2-2');
    }
    
    if (!currencyCode) {
        currencyCode = 'USD';
    }

    const targetCurrency = this.currencies.find(c => c.code === currencyCode);
    
    if (!targetCurrency) {
      // Fallback to USD if currency not found
      return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
    }

    const convertedValue = value * targetCurrency.rate;
    return this.currencyPipe.transform(convertedValue, currencyCode, 'symbol', '1.2-2');
  }
}
