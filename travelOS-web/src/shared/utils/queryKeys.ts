/**
 * Query key factory — centralizes all React Query cache keys.
 * Pattern: ['entity', 'scope', ...params]
 * Features import their slice and call e.g. queryKeys.itinerary.list({ page: 1 })
 */
export const queryKeys = {
  // Auth
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  // Itinerary
  itinerary: {
    all: () => ['itinerary'] as const,
    list: (params?: Record<string, unknown>) => ['itinerary', 'list', params] as const,
    detail: (id: string) => ['itinerary', 'detail', id] as const,
  },

  // Booking
  booking: {
    all: () => ['booking'] as const,
    list: (params?: Record<string, unknown>) => ['booking', 'list', params] as const,
    detail: (id: string) => ['booking', 'detail', id] as const,
  },

  // DMC
  dmc: {
    all: () => ['dmc'] as const,
    list: (params?: Record<string, unknown>) => ['dmc', 'list', params] as const,
    detail: (id: string) => ['dmc', 'detail', id] as const,
  },

  // Agent
  agent: {
    all: () => ['agent'] as const,
    list: (params?: Record<string, unknown>) => ['agent', 'list', params] as const,
    detail: (id: string) => ['agent', 'detail', id] as const,
  },

  // Analytics
  analytics: {
    dashboard: () => ['analytics', 'dashboard'] as const,
    report: (type: string, params?: Record<string, unknown>) => ['analytics', 'report', type, params] as const,
  },

  // World master data
  world: {
    countries: {
      all: () => ['world', 'countries'] as const,
      search: (q: string) => ['world', 'countries', 'search', q] as const,
      byContinent: (continent: string) => ['world', 'countries', 'continent', continent] as const,
      byCode: (code: string) => ['world', 'countries', code] as const,
      byIsd: (code: string) => ['world', 'countries', 'isd', code] as const,
    },
    states: {
      byCountry: (iso2: string) => ['world', 'states', 'country', iso2] as const,
      byId: (id: string) => ['world', 'states', id] as const,
      search: (q: string, country?: string) => ['world', 'states', 'search', q, country] as const,
    },
    cities: {
      byCountry: (iso2: string) => ['world', 'cities', 'country', iso2] as const,
      byState: (stateId: string) => ['world', 'cities', 'state', stateId] as const,
      byId: (id: string) => ['world', 'cities', id] as const,
      search: (q: string, country?: string) => ['world', 'cities', 'search', q, country] as const,
      nearby: (lat: number, lng: number, radius?: number) => ['world', 'cities', 'nearby', lat, lng, radius] as const,
    },
    airports: {
      all: (page?: number, limit?: number) => ['world', 'airports', page, limit] as const,
      search: (q: string) => ['world', 'airports', 'search', q] as const,
      byCountry: (iso2: string, internationalOnly?: boolean) => ['world', 'airports', 'country', iso2, internationalOnly] as const,
      byCity: (cityId: string) => ['world', 'airports', 'city', cityId] as const,
      nearby: (lat: number, lng: number, radius?: number) => ['world', 'airports', 'nearby', lat, lng, radius] as const,
      byIata: (code: string) => ['world', 'airports', 'iata', code] as const,
      byIcao: (code: string) => ['world', 'airports', 'icao', code] as const,
    },
    airlines: {
      all: () => ['world', 'airlines'] as const,
      search: (q: string) => ['world', 'airlines', 'search', q] as const,
      byIata: (code: string) => ['world', 'airlines', 'iata', code] as const,
    },
    currencies: {
      all: () => ['world', 'currencies'] as const,
      byCode: (code: string) => ['world', 'currencies', code] as const,
    },
    timezones: {
      all: () => ['world', 'timezones'] as const,
      byCountry: (iso2: string) => ['world', 'timezones', 'country', iso2] as const,
      byId: (id: string) => ['world', 'timezones', 'id', id] as const,
    },
  },
} as const;
