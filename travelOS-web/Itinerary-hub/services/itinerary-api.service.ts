import { Injectable, inject } from '@angular/core';

import { Trip } from '../models/itinerary.model';
import { Observable } from 'rxjs';
import {HttpTravelModuleService} from "../../../../core/http/services/http-travel-module-service";

@Injectable({
  providedIn: 'root'
})
export class ItineraryApiService {
  private httpTravelService = inject(HttpTravelModuleService);

  createItinerary(trip: Trip): Observable<any> {
    // The user mentioned saving all data including image path.
    // We'll send the entire trip object to the API.
    // Assuming the endpoint is 'Itinerary/Create' based on typical patterns in this project.
    return this.httpTravelService.create(trip, 'Itinerary/Create');
  }
}
