
import { Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app.config';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config = APP_CONFIG;

  // Extending config with model options dynamically if not present in APP_CONFIG
  readonly modelOptions = [
    { id: 'gemini-2.5-flash-lite', name: 'Flash Lite (High Volume)', description: '1,000 RPM - Active Development' },
    { id: 'gemini-2.5-flash', name: 'Flash (Quality)', description: '20-50 RPM - Final Testing' },
    { id: 'gemini-2.5-pro', name: 'Pro (Complex)', description: '2-5 RPM - Complex Logic' }
  ];

  getConfig(): AppConfig {
    return this.config;
  }
}
