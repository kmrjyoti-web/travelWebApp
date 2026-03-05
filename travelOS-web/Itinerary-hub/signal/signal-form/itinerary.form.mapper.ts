import {ItinerarySignalForm} from "./itinerary.form.model";
import {CreateItineraryDto} from "../../models/dto/itinerary.dto";


export class ItineraryFormMapper {
    static toCreateDto(form: ItinerarySignalForm): CreateItineraryDto {
        return {
            user_itineraries_code: form.user_itineraries_code(),
            itineraries_global_id: form.itineraries_global_id(),
            itineraries_url: form.itineraries_url(),

            from_country: form.from_country(),
            from_country_code: form.from_country_code(),
            from_state: form.from_state(),
            from_state_code: form.from_state_code(),

            to_country: form.to_country(),
            to_country_code: form.to_country_code(),
            to_state: form.to_state(),
            to_state_code: form.to_state_code(),

            itineraries_detail: form.itineraries_detail(),
            no_of_shares: form.no_of_shares(),
            from_search_key: form.from_search_key(),
            to_search_key: form.to_search_key(),
            search_key: form.search_key(),
            itineraries_heading: form.itineraries_heading(),
        };
    }
}