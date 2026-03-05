/**
 * React Query hooks for world master data.
 *
 * Design principles:
 * - staleTime: 24 h for static master data (countries, currencies, timezones)
 * - staleTime: 1 h for semi-static data (airports, airlines)
 * - enabled guards prevent fetches when required params are empty
 * - search hooks debounced externally via useDebounce (see examples below)
 *
 * Usage example (city search in itinerary builder):
 *   const [query, setQuery] = useState('');
 *   const debouncedQ = useDebounce(query, 300);
 *   const { data: cities } = useSearchCities(debouncedQ, 'IN');
 */
import { useApiQuery } from './useApiQuery';
import { worldService } from '@/shared/services/world.service';
import { queryKeys } from '@/shared/utils/queryKeys';

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------

/** All countries — cached 24 h */
export function useCountries() {
  return useApiQuery(
    queryKeys.world.countries.all(),
    worldService.countries.getAll,
    { staleTime: DAY_MS },
  );
}

/** Search countries by name — enabled only when q.length >= 2 */
export function useSearchCountries(q: string) {
  return useApiQuery(
    queryKeys.world.countries.search(q),
    () => worldService.countries.search(q),
    { staleTime: HOUR_MS, enabled: q.length >= 2 },
  );
}

/** Countries filtered by continent */
export function useCountriesByContinent(continent: string) {
  return useApiQuery(
    queryKeys.world.countries.byContinent(continent),
    () => worldService.countries.byContinent(continent),
    { staleTime: DAY_MS, enabled: continent.length > 0 },
  );
}

/** Single country by ISO2 or ISO3 code */
export function useCountry(code: string) {
  return useApiQuery(
    queryKeys.world.countries.byCode(code),
    () => worldService.countries.byCode(code),
    { staleTime: DAY_MS, enabled: code.length > 0 },
  );
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

/** All states for a country — cached 24 h */
export function useStates(iso2: string) {
  return useApiQuery(
    queryKeys.world.states.byCountry(iso2),
    () => worldService.states.byCountry(iso2),
    { staleTime: DAY_MS, enabled: iso2.length > 0 },
  );
}

/** Search states; optionally scoped to a country */
export function useSearchStates(q: string, country?: string) {
  return useApiQuery(
    queryKeys.world.states.search(q, country),
    () => worldService.states.search(q, country),
    { staleTime: HOUR_MS, enabled: q.length >= 2 },
  );
}

/** Single state by id */
export function useWorldState(id: string) {
  return useApiQuery(
    queryKeys.world.states.byId(id),
    () => worldService.states.byId(id),
    { staleTime: DAY_MS, enabled: id.length > 0 },
  );
}

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------

/** All cities in a country */
export function useCitiesByCountry(iso2: string) {
  return useApiQuery(
    queryKeys.world.cities.byCountry(iso2),
    () => worldService.cities.byCountry(iso2),
    { staleTime: DAY_MS, enabled: iso2.length > 0 },
  );
}

/** All cities in a state */
export function useCitiesByState(stateId: string) {
  return useApiQuery(
    queryKeys.world.cities.byState(stateId),
    () => worldService.cities.byState(stateId),
    { staleTime: DAY_MS, enabled: stateId.length > 0 },
  );
}

/** Search cities; optionally scoped to a country — primary itinerary builder hook */
export function useSearchCities(q: string, country?: string) {
  return useApiQuery(
    queryKeys.world.cities.search(q, country),
    () => worldService.cities.search(q, country),
    { staleTime: HOUR_MS, enabled: q.length >= 2 },
  );
}

/** Cities near a lat/lng point */
export function useNearbyCities(lat: number, lng: number, radius = 50) {
  return useApiQuery(
    queryKeys.world.cities.nearby(lat, lng, radius),
    () => worldService.cities.nearby({ lat, lng, radius }),
    { staleTime: HOUR_MS, enabled: lat !== 0 && lng !== 0 },
  );
}

/** Single city by id */
export function useCity(id: string) {
  return useApiQuery(
    queryKeys.world.cities.byId(id),
    () => worldService.cities.byId(id),
    { staleTime: DAY_MS, enabled: id.length > 0 },
  );
}

// ---------------------------------------------------------------------------
// Airports
// ---------------------------------------------------------------------------

/** Search airports — primary itinerary/booking hook */
export function useSearchAirports(q: string) {
  return useApiQuery(
    queryKeys.world.airports.search(q),
    () => worldService.airports.search(q),
    { staleTime: HOUR_MS, enabled: q.length >= 2 },
  );
}

/** Airports in a country */
export function useAirportsByCountry(iso2: string, internationalOnly = false) {
  return useApiQuery(
    queryKeys.world.airports.byCountry(iso2, internationalOnly),
    () => worldService.airports.byCountry(iso2, internationalOnly),
    { staleTime: HOUR_MS, enabled: iso2.length > 0 },
  );
}

/** Airports serving a city */
export function useAirportsByCity(cityId: string) {
  return useApiQuery(
    queryKeys.world.airports.byCity(cityId),
    () => worldService.airports.byCity(cityId),
    { staleTime: HOUR_MS, enabled: cityId.length > 0 },
  );
}

/** Airport by IATA code */
export function useAirportByIata(code: string) {
  return useApiQuery(
    queryKeys.world.airports.byIata(code),
    () => worldService.airports.byIata(code),
    { staleTime: HOUR_MS, enabled: code.length === 3 },
  );
}

/** Airports near a lat/lng point */
export function useNearbyAirports(lat: number, lng: number, radius = 100) {
  return useApiQuery(
    queryKeys.world.airports.nearby(lat, lng, radius),
    () => worldService.airports.nearby({ lat, lng, radius }),
    { staleTime: HOUR_MS, enabled: lat !== 0 && lng !== 0 },
  );
}

// ---------------------------------------------------------------------------
// Airlines
// ---------------------------------------------------------------------------

/** All airlines — cached 24 h */
export function useAirlines() {
  return useApiQuery(
    queryKeys.world.airlines.all(),
    worldService.airlines.getAll,
    { staleTime: DAY_MS },
  );
}

/** Search airlines by name */
export function useSearchAirlines(q: string) {
  return useApiQuery(
    queryKeys.world.airlines.search(q),
    () => worldService.airlines.search(q),
    { staleTime: HOUR_MS, enabled: q.length >= 2 },
  );
}

// ---------------------------------------------------------------------------
// Currencies
// ---------------------------------------------------------------------------

/** All currencies — cached 24 h */
export function useCurrencies() {
  return useApiQuery(
    queryKeys.world.currencies.all(),
    worldService.currencies.getAll,
    { staleTime: DAY_MS },
  );
}

/** Single currency by ISO-4217 code */
export function useCurrency(code: string) {
  return useApiQuery(
    queryKeys.world.currencies.byCode(code),
    () => worldService.currencies.byCode(code),
    { staleTime: DAY_MS, enabled: code.length > 0 },
  );
}

// ---------------------------------------------------------------------------
// Timezones
// ---------------------------------------------------------------------------

/** All timezones — cached 24 h */
export function useTimezones() {
  return useApiQuery(
    queryKeys.world.timezones.all(),
    worldService.timezones.getAll,
    { staleTime: DAY_MS },
  );
}

/** Timezones for a country */
export function useTimezonesByCountry(iso2: string) {
  return useApiQuery(
    queryKeys.world.timezones.byCountry(iso2),
    () => worldService.timezones.byCountry(iso2),
    { staleTime: DAY_MS, enabled: iso2.length > 0 },
  );
}
