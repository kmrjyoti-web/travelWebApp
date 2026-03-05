export interface LocationDetails {
  address?: string;
  city?: string;
  cityCode?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
  customFields?: { key: string; value: string }[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  locationDetails?: LocationDetails; // New optional field
  activityType: string;
  latitude: number;
  longitude: number;
  cost?: number;
  completed?: boolean;
  tags?: string[]; // New: e.g. ['Nightlife', 'Kids Friendly']
}

export interface DailyWeather {
  forecast: string;
  dressCode: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: Activity[];
  nearbyPlaces?: Attraction[];
  accommodationId?: string;
  weather?: DailyWeather;
}

export interface Itinerary {
  title: string;
  summary: string;
  weather: string;
  notes: string;
  days: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
}

export interface LocalEvent {
  name: string;
  date: string;
  description: string;
  venue: string;
  latitude?: number;
  longitude?: number;
  cost?: number;
}

export interface EmergencyInfo {
  embassy: {
    name: string;
    address: string;
    phone: string;
    website: string;
    details: string;
  };
  localServices: {
    police: string;
    ambulance: string;
    fire: string;
    medical: string;
  };
}

export interface FormPreferences {
  from: string;
  to: string;
  days: number;
  startDate: string;
  endDate: string;
  budget: string;
  accommodationType: string;
  starRating: string;
  food: string;
  interests: string;
  services: string[];
  adults: number;
  children: number;
  currency: string;
  preferredAirline?: string; // Re-added
  flightDepartureTime?: string;
  flightArrivalTime?: string;
  trainPreference?: string;

  // New preferences
  includeNightlife?: boolean;
  tripNature?: string; // e.g. 'Adventure', 'Relaxed', 'Family', 'Religious'
  selectedModel?: string; // New: 'gemini-2.5-flash', etc.
  language?: string; // New: 'en', 'es', 'fr', etc.
}

export interface VisaProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  documents?: string[];
}

export interface VisaInfo {
  summary: string;
  sources: { title: string; uri: string }[];
  processSteps?: VisaProcessStep[];
}

export interface Attraction {
  name: string;
  description: string;
  imageQuery: string;
  estimatedCost: 'Free' | 'Low' | 'Medium' | 'High';
  cost?: number;
  rating?: number;
  estimatedDuration: string;
  latitude: number;
  longitude: number;
  category: string;
  locationDetails?: LocationDetails; // New optional field
  tags?: string[]; // New
}

export interface AccommodationDetails {
  id: string;
  type: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  facilities: string[];
  imageQuery: string;
  address?: string;
  rating?: number;
  roomType?: string;
  boardBasis?: string;
  contactNumber?: string;
  website?: string;
}

export interface FlightDetails {
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export interface TrainDetails {
  trainType: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export interface TransportDetails {
  flights?: FlightDetails[];
  trains?: TrainDetails[];
  other?: {
    type: string;
    details: string;
    price: number;
  }[];
}



export interface SEODetails {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  robots?: string;
}

export interface PublishSettings {
  publishUrl: string;
  totalPrice: number;
  currency: string;
  language: string;
  conversionEnabled: boolean;
  conversionRate: number;
  markupPercentage: number;

  publishHeading?: string; // New
  searchKeys?: {
    from?: string;
    to?: string;
    search?: string;
    offer?: string;
  };

  tags: string[];
  duration: { days: number, nights: number };
  pauseTheme: boolean;
  travelers: { min: number, max: number };
  pricing: {
    currentPrice: number;
    offerPrice: number;
    offerValidToDay?: number;
    offerValidUntilDate?: Date;
  };
  offer: {
    enabled: boolean;
    title: string;
    offerHeading?: string; // New
    validityType: '24h' | '48h' | 'custom' | 'days';
    validityValue?: number;
    recurring: boolean;
    frequency?: 'daily' | 'weekly';
    tags: string[];
  };
  budget: { min: number, max: number };
  recurringPackage: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  cardImage?: string;
}

export interface Trip {
  id?: string;
  globalId?: string; // Mapped from itineraries_global_id
  uniqueId?: string; // Mapped from itineraries_unique_id
  preferences: FormPreferences;
  itinerary: Itinerary;
  visaInfo: VisaInfo;
  events?: LocalEvent[];
  emergencyInfo?: EmergencyInfo;
  configVersion?: string;
  attractions?: Attraction[];
  accommodation?: AccommodationDetails[];
  transportation?: TransportDetails;
  mapping?: { [key: string]: string[] };

  // New structured fields
  fromLocation?: LocationDetails;
  toLocation?: LocationDetails;
  search_keys?: string[];
  seo_detail?: SEODetails;
  attractionPrices?: AttractionPrice[];
  imageGallery?: ImageGalleryItem[];
  itineraryImages?: string[]; // New: Stores list of all gallery image URLs
  headerImage?: string; // URL for the main trip cover/slider image
  publishSettings?: PublishSettings; // New: Persistent settings for publishing
}

export interface ImageGalleryItem {
  aspectRatio: string; // e.g. '616x730'
  prompt: string;
  altText: string;
  imageUrl?: string; // New: To store the hosted image URL
}

export interface AttractionPrice {
  name: string;
  price: string;
  notes?: string;
}

export interface TripDraft {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  interests: string;
}

export interface SavedTrip {
  id: string;
  title: string;
  savedAt: string;
  trip: Trip;
  shareCount?: number;
  mapping?: { [key: string]: string[] };
}

export interface TourCategoryItem {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface TourCategory {
  id: string;
  name: string;
  code: string;
  items: TourCategoryItem[];
}



