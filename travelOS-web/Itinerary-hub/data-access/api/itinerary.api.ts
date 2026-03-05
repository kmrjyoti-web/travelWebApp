import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {HttpTravelModuleService} from "../../../../../core/http/services/http-travel-module-service";
import {CreateItineraryDto} from "../../models/dto/itinerary.dto";


@Injectable({ providedIn: "root" })
export class ItineraryApi {
    private readonly http = inject(HttpTravelModuleService);
    private readonly baseUrl = "v1/Itinerary";

    create(dto: CreateItineraryDto): Observable<any> {
        return this.http.create<any>(dto, `${this.baseUrl}/Create`);
    }
}