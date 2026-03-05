import { signal } from "@angular/core";
import { ItinerarySignalForm } from "./itinerary.form.model";

export const buildItineraryForm = (): ItinerarySignalForm => ({
    user_itineraries_code: signal<string | null>(null),
    itineraries_global_id: signal<string | null>(null),
    itineraries_url: signal<string | null>(null),

    from_country: signal<string | null>(null),
    from_country_code: signal<string | null>(null),
    from_state: signal<string | null>(null),
    from_state_code: signal<string | null>(null),

    to_country: signal<string | null>(null),
    to_country_code: signal<string | null>(null),
    to_state: signal<string | null>(null),
    to_state_code: signal<string | null>(null),

    itineraries_detail: signal<string | null>(null),
    no_of_shares: signal<number | null>(null),
    from_search_key: signal<string | null>(null),
    to_search_key: signal<string | null>(null),
    search_key: signal<string | null>(null),
    itineraries_heading: signal<string | null>(null),
});