import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  uploadImage(file: File): Observable<string> {
    const config = this.configService.getConfig();
    // Use the newly added cloudinary config
    const cloudName = (config as any).cloudinary?.cloudName;
    const uploadPreset = (config as any).cloudinary?.uploadPreset;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Please check your environment variables or app configuration.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    // Cloudinary returns a JSON response with 'secure_url'
    return this.http.post<any>(url, formData).pipe(
      map(response => response.secure_url)
    );
  }
}
