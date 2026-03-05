/**
 * World master-data service — covers countries, states, cities, airports,
 * airlines, pincodes, currencies, and timezones.
 *
 * Base: GET /api/world/<resource>
 * No auth required (public master data).
 * All methods return the standard ApiResponse<T> shape (interceptor unwraps).
 */
import { api } from './api';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  Country,
  State,
  City,
  Airport,
  Airline,
  Pincode,
  Currency,
  Timezone,
  NearbyParams,
  AirportListParams,
} from '@/shared/types/world.types';

const BASE = '/world';

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------
const countries = {
  /** All countries */
  getAll: (): Promise<ApiResponse<Country[]>> =>
    api.get(`${BASE}/countries`),

  /** Search countries by name/iso */
  search: (q: string): Promise<ApiResponse<Country[]>> =>
    api.get(`${BASE}/countries/search`, { params: { q } }),

  /** Countries by continent (e.g. "Asia", "Europe") */
  byContinent: (continent: string): Promise<ApiResponse<Country[]>> =>
    api.get(`${BASE}/countries/continent/${encodeURIComponent(continent)}`),

  /** Country by ISD / calling code (e.g. "91") */
  byIsd: (code: string): Promise<ApiResponse<Country>> =>
    api.get(`${BASE}/countries/isd/${encodeURIComponent(code)}`),

  /** Country by ISO2 (2 chars) or ISO3 (3 chars) code */
  byCode: (code: string): Promise<ApiResponse<Country>> =>
    api.get(`${BASE}/countries/${encodeURIComponent(code)}`),
};

// ---------------------------------------------------------------------------
// States / Provinces
// ---------------------------------------------------------------------------
const states = {
  /** All states for a country (ISO2 code) */
  byCountry: (iso2: string): Promise<ApiResponse<State[]>> =>
    api.get(`${BASE}/states/country/${encodeURIComponent(iso2)}`),

  /** Single state by DB id */
  byId: (id: string): Promise<ApiResponse<State>> =>
    api.get(`${BASE}/states/${encodeURIComponent(id)}`),

  /** Search states; optionally scoped to a country */
  search: (q: string, country?: string): Promise<ApiResponse<State[]>> =>
    api.get(`${BASE}/states/search`, { params: { q, ...(country ? { country } : {}) } }),
};

// ---------------------------------------------------------------------------
// Cities
// ---------------------------------------------------------------------------
const cities = {
  /** All cities in a country */
  byCountry: (iso2: string): Promise<ApiResponse<City[]>> =>
    api.get(`${BASE}/cities/country/${encodeURIComponent(iso2)}`),

  /** All cities in a state */
  byState: (stateId: string): Promise<ApiResponse<City[]>> =>
    api.get(`${BASE}/cities/state/${encodeURIComponent(stateId)}`),

  /** Single city by DB id */
  byId: (id: string): Promise<ApiResponse<City>> =>
    api.get(`${BASE}/cities/${encodeURIComponent(id)}`),

  /** Search cities; optionally scoped to a country */
  search: (q: string, country?: string): Promise<ApiResponse<City[]>> =>
    api.get(`${BASE}/cities/search`, { params: { q, ...(country ? { country } : {}) } }),

  /** Cities within radius (km) of a lat/lng point */
  nearby: ({ lat, lng, radius = 50 }: NearbyParams): Promise<ApiResponse<City[]>> =>
    api.get(`${BASE}/cities/nearby`, { params: { lat, lng, radius } }),
};

// ---------------------------------------------------------------------------
// Airports
// ---------------------------------------------------------------------------
const airports = {
  /** Paginated list of all airports */
  getAll: ({ page = 1, limit = 50 }: AirportListParams = {}): Promise<ApiResponse<Airport[]>> =>
    api.get(`${BASE}/airports`, { params: { page, limit } }),

  /** Search airports by name, IATA, or city */
  search: (q: string): Promise<ApiResponse<Airport[]>> =>
    api.get(`${BASE}/airports/search`, { params: { q } }),

  /** Airports in a country; optional international-only filter */
  byCountry: (iso2: string, internationalOnly = false): Promise<ApiResponse<Airport[]>> =>
    api.get(`${BASE}/airports/country/${encodeURIComponent(iso2)}`, {
      params: internationalOnly ? { internationalOnly: true } : {},
    }),

  /** Airports serving a city */
  byCity: (cityId: string): Promise<ApiResponse<Airport[]>> =>
    api.get(`${BASE}/airports/city/${encodeURIComponent(cityId)}`),

  /** Airports within radius (km) of a lat/lng point */
  nearby: ({ lat, lng, radius = 100 }: NearbyParams): Promise<ApiResponse<Airport[]>> =>
    api.get(`${BASE}/airports/nearby`, { params: { lat, lng, radius } }),

  /** Single airport by IATA code (e.g. "BOM") */
  byIata: (code: string): Promise<ApiResponse<Airport>> =>
    api.get(`${BASE}/airports/iata/${encodeURIComponent(code.toUpperCase())}`),

  /** Single airport by ICAO code (e.g. "VABB") */
  byIcao: (code: string): Promise<ApiResponse<Airport>> =>
    api.get(`${BASE}/airports/icao/${encodeURIComponent(code.toUpperCase())}`),
};

// ---------------------------------------------------------------------------
// Airlines
// ---------------------------------------------------------------------------
const airlines = {
  /** All airlines */
  getAll: (): Promise<ApiResponse<Airline[]>> =>
    api.get(`${BASE}/airlines`),

  /** Search airlines by name */
  search: (q: string): Promise<ApiResponse<Airline[]>> =>
    api.get(`${BASE}/airlines/search`, { params: { q } }),

  /** Single airline by IATA code (e.g. "6E") */
  byIata: (code: string): Promise<ApiResponse<Airline>> =>
    api.get(`${BASE}/airlines/iata/${encodeURIComponent(code.toUpperCase())}`),
};

// ---------------------------------------------------------------------------
// Pincodes
// ---------------------------------------------------------------------------
const pincodes = {
  /** Exact pincode lookup for a country */
  lookup: (pincode: string, country: string): Promise<ApiResponse<Pincode>> =>
    api.get(`${BASE}/pincodes/lookup`, { params: { pincode, country } }),

  /** Prefix/partial pincode search */
  search: (q: string, country: string): Promise<ApiResponse<Pincode[]>> =>
    api.get(`${BASE}/pincodes/search`, { params: { q, country } }),

  /** All pincodes for a city */
  byCity: (cityId: string): Promise<ApiResponse<Pincode[]>> =>
    api.get(`${BASE}/pincodes/city/${encodeURIComponent(cityId)}`),
};

// ---------------------------------------------------------------------------
// Currencies
// ---------------------------------------------------------------------------
const currencies = {
  /** All active currencies */
  getAll: (): Promise<ApiResponse<Currency[]>> =>
    api.get(`${BASE}/currencies`),

  /** Single currency by ISO-4217 code (e.g. "INR") */
  byCode: (code: string): Promise<ApiResponse<Currency>> =>
    api.get(`${BASE}/currencies/${encodeURIComponent(code.toUpperCase())}`),
};

// ---------------------------------------------------------------------------
// Timezones
// ---------------------------------------------------------------------------
const timezones = {
  /** All timezones */
  getAll: (): Promise<ApiResponse<Timezone[]>> =>
    api.get(`${BASE}/timezones`),

  /** Timezones for a country */
  byCountry: (iso2: string): Promise<ApiResponse<Timezone[]>> =>
    api.get(`${BASE}/timezones/country/${encodeURIComponent(iso2)}`),

  /** Timezone by IANA id (e.g. "Asia/Kolkata") */
  byId: (timezoneId: string): Promise<ApiResponse<Timezone>> =>
    api.get(`${BASE}/timezones/id/${timezoneId}`),
};

// ---------------------------------------------------------------------------
// Unified export
// ---------------------------------------------------------------------------
export const worldService = {
  countries,
  states,
  cities,
  airports,
  airlines,
  pincodes,
  currencies,
  timezones,
};
