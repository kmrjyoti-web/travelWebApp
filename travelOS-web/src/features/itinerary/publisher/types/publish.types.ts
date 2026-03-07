// ─── Publish Package — full data model ───────────────────────────────────────

export interface GeoPoint { latitude: number; longitude: number; }

// ── Image Gallery ────────────────────────────────────────────────────────────
export interface PackageImage { url: string; caption: string; isPrimary: boolean; altText?: string; }

export type MarketingAssetSize = 'vertical_feature' | 'standard_landscape' | 'large_feature' | 'portrait' | 'panoramic_banner';

export interface GallerySettings {
  count: number;
  marketingAssets: MarketingAssetSize[];
  coverImageUrl: string;
}

// ── General Info ─────────────────────────────────────────────────────────────
export interface GeneralInfo {
  title: string;
  summary: string;
  coverImageUrl: string;
  theme: string;
  tripNature: string;
  currency: string;
  durationDays: number;
  durationNights: number;
  minPax: number;
  maxPax: number;
  language: string;
}

// ── Daily Itinerary ───────────────────────────────────────────────────────────
export interface ActivityItem {
  time: string;
  title: string;
  description: string;
  location: string;
  activityType: string;
  latitude: number;
  longitude: number;
  cost: number;
  currency: string;
  tags: string[];
}

export interface DayWeather {
  forecast: string;
  dressCode: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ActivityItem[];
  nearbyPlaces: string[];
  weather: DayWeather;
  notes: string;
}

export interface DailyItinerary {
  title: string;
  summary: string;
  weather: string;
  notes: string;
  days: ItineraryDay[];
}

// ── Accommodation ─────────────────────────────────────────────────────────────
export interface AccommodationItem {
  id: string;
  type: 'hotel' | 'resort' | 'hostel' | 'villa' | 'airbnb' | 'other';
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  currency: string;
  rating: number;
  roomType: string;
  facilities: string[];
  notes: string;
}

// ── Transportation ────────────────────────────────────────────────────────────
export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  classType: string;
  price: number;
  currency: string;
  notes: string;
}

export interface TrainSegment {
  id: string;
  trainName: string;
  trainNumber: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  classType: string;
  price: number;
  currency: string;
  notes: string;
}

export interface OtherTransport {
  id: string;
  type: string;
  description: string;
  from: string;
  to: string;
  date: string;
  price: number;
  currency: string;
  notes: string;
}

export interface Transportation {
  flights: FlightSegment[];
  trains: TrainSegment[];
  other: OtherTransport[];
}

// ── Weather & Attire ──────────────────────────────────────────────────────────
export interface MonthWeather {
  month: string;
  temperature: string;
  description: string;
  dressCode: string;
  packingTips: string[];
}

export interface WeatherAttire {
  bestTimeToVisit: string;
  climate: string;
  monthlyWeather: MonthWeather[];
  generalDressCode: string;
  essentialPacking: string[];
}

// ── Inclusions & Exclusions ───────────────────────────────────────────────────
export interface InclusionsExclusions {
  inclusions: string[];
  exclusions: string[];
  importantNotes: string[];
}

// ── Local Events ──────────────────────────────────────────────────────────────
export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  latitude: number;
  longitude: number;
  entryFee: number;
  currency: string;
  tags: string[];
}

// ── Popular Places / Attractions ──────────────────────────────────────────────
export interface Attraction {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  estimatedCost: number;
  currency: string;
  estimatedDuration: string;
  rating: number;
  tags: string[];
  imageQuery: string;
}

// ── Support & Emergency ───────────────────────────────────────────────────────
export interface Hospital { name: string; address: string; phone: string; }
export interface EmergencyContact { label: string; phone: string; available24h: boolean; }

export interface SupportEmergency {
  emergencyNumber: string;
  policeNumber: string;
  ambulanceNumber: string;
  embassyName: string;
  embassyPhone: string;
  embassyAddress: string;
  hospitals: Hospital[];
  emergencyContacts: EmergencyContact[];
  travelInsuranceTips: string;
  notes: string;
}

// ── Price Reference ───────────────────────────────────────────────────────────
export type PriceType = 'per_person' | 'per_couple' | 'per_group' | 'per_night' | 'total';

export interface PriceTier {
  id: string;
  label: string;
  priceType: PriceType;
  sellingPrice: number;
  wasPrice: number;
  currency: string;
  minPax: number;
  maxPax: number;
  description: string;
}

export interface ChannelPrice {
  enabled: boolean;
  salePrice: number;
  discountPrice: number;
  budgetMin: number;
  budgetMax: number;
  baseCurrency: string;
  tax: number;
  maxDiscount: number;
}

export type PriceChannel = 'web' | 'mobile' | 'api' | 'b2b' | 'b2c' | 'marketplace' | 'custom';

export interface PriceReference {
  tiers: PriceTier[];
  markup: number;
  showMarkup: boolean;
  taxInclusive: boolean;
  taxPercentage: number;
  cancellationPolicy: string;
  paymentTerms: string;
  channelPricing: Record<PriceChannel, ChannelPrice>;
}

// ── Visa Requirements ─────────────────────────────────────────────────────────
export interface VisaApplicationStep {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  documents: string[];
}

export interface VisaOfficialSource {
  name: string;
  url: string;
}

export interface VisaRequirement {
  required: boolean;
  type: string;
  duration: string;
  cost: number;
  currency: string;
  processingTime: string;
  requirements: string[];
  applyLink: string;
  notes: string;
  onArrivalAvailable: boolean;
  eVisaAvailable: boolean;
  generalSummary: string;
  applicationSteps: VisaApplicationStep[];
  officialSources: VisaOfficialSource[];
}

// ── Trip Filter / Preferences ─────────────────────────────────────────────────
export interface TripPreferences {
  /* destinations & dates */
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  /* travelers */
  adults: number;
  children: number;
  /* budget & stay */
  budget: string;
  currency: string;
  accommodationType: string;
  starRating: string;
  /* interests & services */
  services: string[];
  foodPreference: string;
  interests: string;
  includeNightlife: boolean;
  /* legacy / other */
  food: string[];
  activities: string[];
  tripNature: string;
  groupType: 'solo' | 'couple' | 'family' | 'friends' | 'corporate' | 'any';
  ageGroup: string;
  physicalLevel: 'easy' | 'moderate' | 'challenging' | 'extreme';
  tags: string[];
}

// ── Search Details & Locations ────────────────────────────────────────────────
export interface LocationPoint extends GeoPoint {
  city: string;
  country: string;
  countryIso2: string;
  timezone: string;
}

export interface SearchDetails {
  destinationCountry: string;
  destinationCity: string;
  destinationCountryIso2: string;
  fromLocation: LocationPoint;
  toLocation: LocationPoint;
  searchKeywords: string[];
  theme: string;
  isFeatured: boolean;
  isInstantBooking: boolean;
}

// ── SEO Settings ──────────────────────────────────────────────────────────────
export interface SEOSettings {
  title: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  twitterCard: string;
  structuredDataEnabled: boolean;
}

// ── Itinerary Mapping ─────────────────────────────────────────────────────────
export interface MapWaypoint extends GeoPoint { label: string; day: number; order: number; }
export interface ItineraryMapping {
  enableMap: boolean;
  mapStyle: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  waypoints: MapWaypoint[];
  showRoute: boolean;
  zoomLevel: number;
}

// ── Publish Settings ──────────────────────────────────────────────────────────
export type PublishStatus = 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived';

export interface PublishSettings {
  status: PublishStatus;
  publishDate: string;
  expiryDate: string;
  visibility: 'public' | 'private' | 'agents_only';
  allowReviews: boolean;
  allowWishlist: boolean;
  requireApproval: boolean;
  publishedInMarketplace: boolean;
  featuredUntil: string;
  channel: string[];
  notes: string;
  /* special offer */
  specialOffer: boolean;
  offerTitle: string;
  offerHeading: string;
  offerValidUntil: string;
  offerTags: string;
  repeatOfferDaily: boolean;
  /* repeating package */
  repeatingPackage: boolean;
  resetFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  /* pricing & logic */
  baseCost: number;
  currentSellingPrice: number;
  offerPrice: number;
  budgetMin: number;
  budgetMax: number;
  priceCurrency: string;
  autoConvertCurrency: boolean;
  /* discovery & tags */
  discoveryTags: string[];
  cardImageUrl: string;
  /* constraints */
  durationDays: number;
  durationNights: number;
  travelersMin: number;
  travelersMax: number;
  pauseTheme: boolean;
  /* publication config */
  urlSlug: string;
  publishHeading: string;
  contentLanguage: string;
  urlPrefix: string;
  /* search optimization */
  fromSearchKeys: string;
  toSearchKeys: string;
  generalSearchKeys: string;
  offerSearchKeys: string;
}

// ── Top-level form ────────────────────────────────────────────────────────────
export interface PublishPackageData {
  id?: string;
  gallery: PackageImage[];
  gallerySettings: GallerySettings;
  generalInfo: GeneralInfo;
  dailyItinerary: DailyItinerary;
  accommodation: AccommodationItem[];
  transportation: Transportation;
  weatherAttire: WeatherAttire;
  inclusionsExclusions: InclusionsExclusions;
  localEvents: LocalEvent[];
  attractions: Attraction[];
  supportEmergency: SupportEmergency;
  priceReference: PriceReference;
  visaRequirements: VisaRequirement;
  tripPreferences: TripPreferences;
  searchDetails: SearchDetails;
  seoSettings: SEOSettings;
  itineraryMapping: ItineraryMapping;
  publishSettings: PublishSettings;
}

export type PublishSectionId =
  | 'gallery' | 'generalInfo' | 'dailyItinerary' | 'accommodation'
  | 'transportation' | 'weatherAttire' | 'inclusionsExclusions' | 'localEvents'
  | 'attractions' | 'supportEmergency' | 'priceReference' | 'visaRequirements'
  | 'tripPreferences' | 'searchDetails' | 'geoSeo' | 'itineraryMapping'
  | 'publishSettings';

export interface PublishSection {
  id: PublishSectionId;
  label: string;
  icon: string;
  description: string;
}

export const PUBLISH_SECTIONS: PublishSection[] = [
  { id: 'gallery',               label: 'Image Gallery',            icon: 'Images',           description: 'Cover & gallery photos' },
  { id: 'generalInfo',           label: 'General Info',             icon: 'Info',             description: 'Title, summary, duration' },
  { id: 'dailyItinerary',        label: 'Daily Itinerary',          icon: 'CalendarDays',     description: 'Day-by-day activities' },
  { id: 'accommodation',         label: 'Accommodation',            icon: 'Hotel',            description: 'Hotels & stays' },
  { id: 'transportation',        label: 'Transportation',           icon: 'Plane',            description: 'Flights, trains, other' },
  { id: 'weatherAttire',         label: 'Weather & Attire',         icon: 'CloudSun',         description: 'Climate & packing guide' },
  { id: 'inclusionsExclusions',  label: 'Inclusions & Exclusions',  icon: 'ListChecks',       description: 'What\'s included/excluded' },
  { id: 'localEvents',           label: 'Local Events',             icon: 'CalendarCheck',    description: 'Festivals & events' },
  { id: 'attractions',           label: 'Popular Places',           icon: 'MapPin',           description: 'Attractions & sights' },
  { id: 'supportEmergency',      label: 'Support & Emergency',      icon: 'ShieldAlert',      description: 'Emergency contacts' },
  { id: 'priceReference',        label: 'Price Reference',          icon: 'BadgeDollarSign',  description: 'Pricing tiers & markup' },
  { id: 'visaRequirements',      label: 'Visa Requirements',        icon: 'FileCheck',        description: 'Visa info & documents' },
  { id: 'tripPreferences',       label: 'Trip Filter/Preferences',  icon: 'SlidersHorizontal','description': 'Budget, group type, tags' },
  { id: 'searchDetails',         label: 'Search Details & Locations', icon: 'Search',         description: 'Search keywords & geo' },
  { id: 'geoSeo',                label: 'GEO & SEO Settings',       icon: 'Globe',            description: 'AI visibility, meta tags & schema' },
  { id: 'itineraryMapping',      label: 'Itinerary Mapping',        icon: 'Map',              description: 'Route & map waypoints' },
  { id: 'publishSettings',       label: 'Publish Settings',         icon: 'Send',             description: 'Status, visibility, dates' },
];

// ── Default empty state ────────────────────────────────────────────────────────
export const PUBLISH_DEFAULTS: PublishPackageData = {
  gallery: [],
  gallerySettings: { count: 4, marketingAssets: [], coverImageUrl: '' },
  generalInfo: { title: '', summary: '', coverImageUrl: '', theme: '', tripNature: 'Balanced', currency: 'USD', durationDays: 1, durationNights: 0, minPax: 1, maxPax: 20, language: 'en' },
  dailyItinerary: { title: '', summary: '', weather: '', notes: '', days: [] },
  accommodation: [],
  transportation: { flights: [], trains: [], other: [] },
  weatherAttire: { bestTimeToVisit: '', climate: '', monthlyWeather: [], generalDressCode: '', essentialPacking: [] },
  inclusionsExclusions: { inclusions: [], exclusions: [], importantNotes: [] },
  localEvents: [],
  attractions: [],
  supportEmergency: { emergencyNumber: '', policeNumber: '', ambulanceNumber: '', embassyName: '', embassyPhone: '', embassyAddress: '', hospitals: [], emergencyContacts: [], travelInsuranceTips: '', notes: '' },
  priceReference: { tiers: [], markup: 0, showMarkup: false, taxInclusive: false, taxPercentage: 0, cancellationPolicy: '', paymentTerms: '', channelPricing: { web: { enabled: true, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, mobile: { enabled: true, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, api: { enabled: false, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, b2b: { enabled: false, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, b2c: { enabled: false, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, marketplace: { enabled: false, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 }, custom: { enabled: false, salePrice: 0, discountPrice: 0, budgetMin: 0, budgetMax: 0, baseCurrency: 'USD', tax: 0, maxDiscount: 0 } } },
  visaRequirements: { required: false, type: '', duration: '', cost: 0, currency: 'USD', processingTime: '', requirements: [], applyLink: '', notes: '', onArrivalAvailable: false, eVisaAvailable: false, generalSummary: '', applicationSteps: [], officialSources: [] },
  tripPreferences: { from: '', to: '', startDate: '', endDate: '', durationDays: 0, adults: 1, children: 0, budget: 'Moderate', currency: 'USD', accommodationType: 'Hotel', starRating: 'No Preference', services: [], foodPreference: '', interests: '', includeNightlife: false, food: [], activities: [], tripNature: 'Balanced', groupType: 'any', ageGroup: '', physicalLevel: 'easy', tags: [] },
  searchDetails: { destinationCountry: '', destinationCity: '', destinationCountryIso2: '', fromLocation: { city: '', country: '', countryIso2: '', latitude: 0, longitude: 0, timezone: '' }, toLocation: { city: '', country: '', countryIso2: '', latitude: 0, longitude: 0, timezone: '' }, searchKeywords: [], theme: '', isFeatured: false, isInstantBooking: false },
  seoSettings: { title: '', metaDescription: '', keywords: [], ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '', robots: 'index,follow', twitterCard: 'summary_large_image', structuredDataEnabled: true },
  itineraryMapping: { enableMap: false, mapStyle: 'roadmap', waypoints: [], showRoute: true, zoomLevel: 10 },
  publishSettings: { status: 'draft', publishDate: '', expiryDate: '', visibility: 'public', allowReviews: true, allowWishlist: true, requireApproval: false, publishedInMarketplace: false, featuredUntil: '', channel: ['web'], notes: '', specialOffer: false, offerTitle: '', offerHeading: '', offerValidUntil: '', offerTags: '', repeatOfferDaily: false, repeatingPackage: false, resetFrequency: 'monthly', baseCost: 0, currentSellingPrice: 0, offerPrice: 0, budgetMin: 0, budgetMax: 0, priceCurrency: 'USD', autoConvertCurrency: false, discoveryTags: [], cardImageUrl: '', durationDays: 1, durationNights: 0, travelersMin: 1, travelersMax: 10, pauseTheme: false, urlSlug: '', publishHeading: '', contentLanguage: 'English (Default)', urlPrefix: 'travtech/t/', fromSearchKeys: '', toSearchKeys: '', generalSearchKeys: '', offerSearchKeys: '' },
};
