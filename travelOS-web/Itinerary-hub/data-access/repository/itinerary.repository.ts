import { inject, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {ItineraryApi} from "../api/itinerary.api";
import {CreateItineraryDto} from "../../models/dto/itinerary.dto";
import {ResponseHelperService} from "../../../../../shared-module/Wrapper";

@Injectable({ providedIn: "root" })
export class ItineraryRepository {
    private readonly api = inject(ItineraryApi);
    private readonly responseHelper = inject(ResponseHelperService);
    create(dto: CreateItineraryDto): Observable<any> {
        return this.api.create(dto).pipe(
            map((res: any) => this.responseHelper.ResponseHelper(res)),
            catchError((error) => throwError(() => error))
        );
    }
}