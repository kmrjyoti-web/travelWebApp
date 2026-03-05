
import {CreateItineraryDto} from "../dto/itinerary.dto";
import {ItineraryRequest} from "../model/Itinerary";


export class ItineraryMapper {
    static toCreateDto(model: ItineraryRequest): CreateItineraryDto {
        return {
            user_itineraries_code: model.user_itineraries_code ?? null,
            itineraries_global_id: model.itineraries_global_id ?? null,
            itineraries_url: model.itineraries_url ?? null,

            from_country: model.from_country ?? null,
            from_country_code: model.from_country_code ?? null,
            from_state: model.from_state ?? null,
            from_state_code: model.from_state_code ?? null,

            to_country: model.to_country ?? null,
            to_country_code: model.to_country_code ?? null,
            to_state: model.to_state ?? null,
            to_state_code: model.to_state_code ?? null,

            itineraries_detail: model.itineraries_detail ?? null,
            no_of_shares: model.no_of_shares ?? null,
        };
    }
}