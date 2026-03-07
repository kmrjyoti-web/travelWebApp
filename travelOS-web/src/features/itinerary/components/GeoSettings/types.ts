/**
 * GeoSettings — type definitions for Advanced GEO & Visibility Settings.
 * All types mirror backend DTOs to ensure full API contract compatibility.
 */

export type SchemaType = 'TravelAction' | 'TouristTrip' | 'TouristAttraction' | 'Event';
export type Availability = 'InStock' | 'SoldOut' | 'PreOrder' | 'LimitedAvailability';
export type TwitterCard = 'summary' | 'summary_large_image';
export type RegionBoost = 'south_asia' | 'middle_east' | 'europe' | 'global' | null;
export type GeoScoreTier = 'poor' | 'fair' | 'good' | 'excellent';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GeoSettings {
  id: string;
  itineraryId: string;
  schemaType: SchemaType;
  destinationName: string;
  destinationLat: number | null;
  destinationLng: number | null;
  priceRange: string;
  currency: string;
  durationIso: string;
  availability: Availability;
  providerName: string;
  providerUrl: string;
  aiSummary: string;
  keyHighlights: string[];
  targetQueries: string[];
  faqs: FaqItem[];
  competitorKeywords: string[];
  freshnessDate: string | null;
  freshnessEnabled: boolean;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  ogTitle: string;
  twitterCard: TwitterCard;
  robots: string;
  slug: string;
  targetCountries: string[];
  targetLanguages: string[];
  regionBoost: RegionBoost;
  localCurrencyDisplay: boolean;
  timezone: string;
  socialHashtags: string[];
  locationTags: string[];
  voiceSearchPhrases: string[];
  speakableSnippet: string;
  geoScore: number;
}

export interface GeoScoreBreakdown {
  factor: string;
  maxPoints: number;
  earnedPoints: number;
  recommendation?: string;
}

export interface GeoScoreResult {
  score: number;
  tier: GeoScoreTier;
  breakdown: GeoScoreBreakdown[];
  recommendations: string[];
}

export interface GeoPreviewResult {
  jsonLd: object;
  metaTags: Record<string, string>;
  ogTags: Record<string, string>;
}

export const GEO_DEFAULTS: GeoSettings = {
  id: '',
  itineraryId: '',
  schemaType: 'TouristTrip',
  destinationName: '',
  destinationLat: null,
  destinationLng: null,
  priceRange: '',
  currency: 'USD',
  durationIso: '',
  availability: 'InStock',
  providerName: '',
  providerUrl: '',
  aiSummary: '',
  keyHighlights: [],
  targetQueries: [],
  faqs: [],
  competitorKeywords: [],
  freshnessDate: null,
  freshnessEnabled: false,
  seoTitle: '',
  metaDescription: '',
  canonicalUrl: '',
  ogImageUrl: '',
  ogTitle: '',
  twitterCard: 'summary_large_image',
  robots: 'index,follow',
  slug: '',
  targetCountries: [],
  targetLanguages: [],
  regionBoost: null,
  localCurrencyDisplay: false,
  timezone: 'UTC',
  socialHashtags: [],
  locationTags: [],
  voiceSearchPhrases: [],
  speakableSnippet: '',
  geoScore: 0,
};
