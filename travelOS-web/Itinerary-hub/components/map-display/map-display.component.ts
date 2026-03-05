import {
  Component,
  ChangeDetectionStrategy,
  input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../models/itinerary.model';

// Leaflet is loaded from CDN, so we need to declare its global variable to satisfy TypeScript
declare const L: any;

@Component({
  selector: 'app-map-display',
  imports: [CommonModule],
  template: `<div #mapContainer class="h-full w-full rounded-lg shadow-md border border-slate-200"></div>`,
  styles: [`
    :host { 
      display: block; 
      height: 400px; 
      margin-bottom: 2rem; 
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDisplayComponent implements AfterViewInit, OnDestroy, OnChanges {
  activities = input<Activity[]>([]);
  highlightedActivity = input<Activity | null>(null);
  markerClicked = output<Activity>();

  @ViewChild('mapContainer') private mapContainer!: ElementRef;
  
  private map: any; // L.Map
  private markers: any[] = []; // L.Marker[]
  private defaultIcon: any;
  private highlightedIcon: any;

  ngAfterViewInit(): void {
    if (typeof L === 'undefined') {
      console.error('Leaflet library is not loaded!');
      return;
    }

    this.defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    this.highlightedIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;
    
    if (changes['activities'] && !changes['activities'].firstChange) {
      this.updateMarkers();
    }

    if (changes['highlightedActivity'] && !changes['highlightedActivity'].firstChange) {
      this.updateHighlightedMarker();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
        center: [20, 0],
        zoom: 2
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map) return;
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    const acts = this.activities();
    if (!acts || acts.length === 0) return;

    const latLngs: any[] = [];
    acts.forEach(act => {
      if (typeof act.latitude === 'number' && typeof act.longitude === 'number') {
        const latLng = [act.latitude, act.longitude];
        latLngs.push(latLng);
        const marker = L.marker(latLng, { icon: this.defaultIcon })
          .addTo(this.map)
          .bindPopup(`<b>${act.title}</b>`);
        
        marker.on('click', () => {
          this.markerClicked.emit(act);
        });

        this.markers.push(marker);
      }
    });

    if (latLngs.length > 0) {
      this.map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
    }
    this.updateHighlightedMarker();
  }

  private updateHighlightedMarker(): void {
    if (!this.map || !this.markers.length) return;

    const highlighted = this.highlightedActivity();
    
    this.activities().forEach((activity, index) => {
      const marker = this.markers[index];
      if (!marker) return;

      if (activity === highlighted) {
        marker.setIcon(this.highlightedIcon);
        marker.openPopup();
      } else {
        marker.setIcon(this.defaultIcon);
      }
    });

    if (highlighted && typeof highlighted.latitude === 'number' && typeof highlighted.longitude === 'number') {
      this.map.flyTo([highlighted.latitude, highlighted.longitude], 14, {animate: true, duration: 0.5});
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}