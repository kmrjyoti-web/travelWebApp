import {NormalizedResponse} from "../../../../../shared-module/Wrapper";


export type CreateItineraryDto = {
    user_itineraries_code: string | null;
    itineraries_global_id: string | null;
    itineraries_url: string | null;

    from_country: string | null;
    from_country_code: string | null;
    from_state: string | null;
    from_state_code: string | null;

    to_country: string | null;
    to_country_code: string | null;
    to_state: string | null;
    to_state_code: string | null;

    itineraries_detail: string | null;
    no_of_shares: number | null;
    from_search_key: string | null;
    to_search_key: string | null;
    search_key: string | null;
    itineraries_heading: string | null;
};

export type CreateItineraryResponse = NormalizedResponse<any>;