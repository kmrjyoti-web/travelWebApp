import { WritableSignal } from "@angular/core";

export type ItinerarySignalForm = {
    user_itineraries_code: WritableSignal<string | null>;
    itineraries_global_id: WritableSignal<string | null>;
    itineraries_url: WritableSignal<string | null>;

    from_country: WritableSignal<string | null>;
    from_country_code: WritableSignal<string | null>;
    from_state: WritableSignal<string | null>;
    from_state_code: WritableSignal<string | null>;

    to_country: WritableSignal<string | null>;
    to_country_code: WritableSignal<string | null>;
    to_state: WritableSignal<string | null>;
    to_state_code: WritableSignal<string | null>;

    itineraries_detail: WritableSignal<string | null>;
    no_of_shares: WritableSignal<number | null>;
    from_search_key: WritableSignal<string | null>;
    to_search_key: WritableSignal<string | null>;
    search_key: WritableSignal<string | null>;
    itineraries_heading: WritableSignal<string | null>;
};