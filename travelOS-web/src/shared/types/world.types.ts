/**
 * World master-data types — mirrors core-world entity toJSON() shapes.
 * Used across itinerary building, booking, DMC, and search flows.
 */

// ---------------------------------------------------------------------------
// Country
// ---------------------------------------------------------------------------
export interface Country {
  id: string;
  name: string;
  officialName: string;
  nativeName: string;
  iso2: string;
  iso3: string;
  isoNumeric: string;
  isdCode: string;
  continent: string;
  subregion: string;
  capitalCity: string;
  flagUrl: string;
  flagEmoji: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  tld: string;
  languages: string[];
  timezones: string[];
  lat: number;
  lng: number;
  population: number;
  areaSqKm: number;
  isIndependent: boolean;
  isUnMember: boolean;
  callingCodeAlt: string[];
  borders: string[];
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// State / Province
// ---------------------------------------------------------------------------
export interface State {
  id: string;
  countryId: string;
  countryIso2: string;
  name: string;
  stateCode: string;
  geonamesId: string;
  type: string;
  capital: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// City
// ---------------------------------------------------------------------------
export interface City {
  id: string;
  countryId: string;
  stateId: string;
  countryIso2: string;
  stateCode: string;
  name: string;
  nameAscii: string;
  alternateNames: string[];
  cityCode: string;
  geonamesId: string;
  isCapital: boolean;
  isCountryCapital: boolean;
  population: number;
  elevationMeters: number;
  timezone: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Airport
// ---------------------------------------------------------------------------
export type AirportType = 'large_airport' | 'medium_airport' | 'small_airport' | 'heliport' | 'seaplane_base' | 'closed';

export interface Airport {
  id: string;
  countryId: string;
  stateId: string;
  cityId: string;
  countryIso2: string;
  name: string;
  shortName: string;
  iataCode: string;
  icaoCode: string;
  airportType: AirportType;
  cityName: string;
  municipality: string;
  regionCode: string;
  lat: number;
  lng: number;
  elevationFt: number;
  continent: string;
  websiteUrl: string;
  wikipediaLink: string;
  hasScheduledService: boolean;
  isInternational: boolean;
  isActive: boolean;
  ourairportsId: string;
  homeLink: string;
}

// ---------------------------------------------------------------------------
// Airline
// ---------------------------------------------------------------------------
export interface Airline {
  id: string;
  countryId: string;
  name: string;
  alias: string;
  iataCode: string;
  icaoCode: string;
  callsign: string;
  countryIso2: string;
  isActive: boolean;
  openflightsId: string;
}

// ---------------------------------------------------------------------------
// Pincode
// ---------------------------------------------------------------------------
export interface Pincode {
  id: string;
  countryId: string;
  countryIso2: string;
  pincode: string;
  placeName: string;
  stateId: string;
  stateCode: string;
  cityId: string;
  areaId: string;
  lat: number;
  lng: number;
  accuracy: number;
}

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  namePlural: string;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Timezone
// ---------------------------------------------------------------------------
export interface Timezone {
  id: string;
  timezoneId: string;
  countryIso2: string;
  utcOffset: string;
  utcOffsetDst: string;
  abbreviation: string;
  abbreviationDst: string;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Query params
// ---------------------------------------------------------------------------
export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
}

export interface AirportListParams {
  page?: number;
  limit?: number;
}
