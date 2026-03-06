import { z } from 'zod';

// ─── Activity ────────────────────────────────────────────────────────────────
export const ACTIVITY_TYPES = ['sightseeing', 'meal', 'transport', 'accommodation', 'leisure', 'shopping', 'other'] as const;

export const activitySchema = z.object({
  time:        z.string().default('09:00'),
  title:       z.string().min(1, 'Activity title required'),
  description: z.string().default(''),
  type:        z.enum(ACTIVITY_TYPES).default('sightseeing'),
  location:    z.string().default(''),
  duration:    z.string().default('1 hour'),
  cost:        z.number().min(0).nullable().default(null),
});
export type ItineraryActivity = z.infer<typeof activitySchema>;

// ─── Day ─────────────────────────────────────────────────────────────────────
export const daySchema = z.object({
  day:        z.number().int().min(1),
  date:       z.string().default(''),
  title:      z.string().default(''),
  activities: z.array(activitySchema).default([]),
});
export type ItineraryDay = z.infer<typeof daySchema>;

// ─── Hotel ───────────────────────────────────────────────────────────────────
export const hotelSchema = z.object({
  night:         z.number().int().min(1),
  name:          z.string().min(1, 'Hotel name required'),
  checkIn:       z.string().default(''),
  checkOut:      z.string().default(''),
  roomType:      z.string().default('Standard'),
  starRating:    z.number().int().min(1).max(5).default(3),
  address:       z.string().default(''),
  pricePerNight: z.number().min(0).nullable().default(null),
  notes:         z.string().default(''),
});
export type ItineraryHotel = z.infer<typeof hotelSchema>;

// ─── Transport ───────────────────────────────────────────────────────────────
export const TRANSPORT_TYPES = ['flight', 'train', 'bus', 'car', 'taxi', 'ferry', 'other'] as const;

export const transportSchema = z.object({
  day:           z.number().int().min(1).default(1),
  type:          z.enum(TRANSPORT_TYPES).default('flight'),
  from:          z.string().default(''),
  to:            z.string().default(''),
  departureTime: z.string().default(''),
  arrivalTime:   z.string().default(''),
  provider:      z.string().default(''),
  bookingRef:    z.string().default(''),
  cost:          z.number().min(0).nullable().default(null),
  notes:         z.string().default(''),
});
export type ItineraryTransport = z.infer<typeof transportSchema>;

// ─── Image ───────────────────────────────────────────────────────────────────
export const IMAGE_TYPES = ['cover', 'gallery', 'hotel', 'activity'] as const;

export const imageSchema = z.object({
  url:     z.string().url('Must be a valid URL'),
  caption: z.string().default(''),
  day:     z.number().int().min(1).nullable().default(null),
  type:    z.enum(IMAGE_TYPES).default('gallery'),
});
export type ItineraryImage = z.infer<typeof imageSchema>;

// ─── Full Editor Form ────────────────────────────────────────────────────────
export const fullItinerarySchema = z.object({
  // Overview
  title:               z.string().default(''),
  from:                z.string().min(2, 'Origin city required'),
  to:                  z.string().min(2, 'Destination required'),
  startDate:           z.string().min(1, 'Start date required'),
  endDate:             z.string().min(1, 'End date required'),
  days:                z.number().int().min(1, 'Must be at least 1 day'),
  adults:              z.number().int().min(1).max(20),
  children:            z.number().int().min(0).max(10),
  budget:              z.string().default('Moderate'),
  currency:            z.string().default('USD'),
  accommodationType:   z.string().default('Hotel'),
  starRating:          z.string().default('No Preference'),
  food:                z.string().default('No Preference'),
  tripNature:          z.string().default('Balanced'),
  services:            z.array(z.string()).default([]),
  interests:           z.string().max(500).default(''),
  flightDepartureTime: z.string().default('any'),
  flightArrivalTime:   z.string().default('any'),
  trainPreference:     z.string().default('any'),
  // Meta
  source:              z.enum(['manual', 'ai', 'edit']).default('manual'),
  selectedModel:       z.string().default(''),
  // Rich content
  itineraryDays:   z.array(daySchema).default([]),
  hotels:          z.array(hotelSchema).default([]),
  transportation:  z.array(transportSchema).default([]),
  images:          z.array(imageSchema).default([]),
}).refine(
  (d) => !d.startDate || !d.endDate || new Date(d.endDate) >= new Date(d.startDate),
  { message: 'End date must be on or after start date', path: ['endDate'] },
);

export type FullItineraryFormData = z.infer<typeof fullItinerarySchema>;

export const FULL_ITINERARY_DEFAULTS: FullItineraryFormData = {
  title: '', from: '', to: '', startDate: '', endDate: '',
  days: 1, adults: 2, children: 0,
  budget: 'Moderate', currency: 'USD',
  accommodationType: 'Hotel', starRating: 'No Preference',
  food: 'No Preference', tripNature: 'Balanced',
  services: [], interests: '',
  flightDepartureTime: 'any', flightArrivalTime: 'any', trainPreference: 'any',
  source: 'manual', selectedModel: '',
  itineraryDays: [], hotels: [], transportation: [], images: [],
};

// ─── Mode ─────────────────────────────────────────────────────────────────────
export type EditorMode = 'manual' | 'ai' | 'edit';

export const EDITOR_STEPS = [
  { id: 'overview',   label: 'Overview',    icon: 'FileText' },
  { id: 'days',       label: 'Day by Day',  icon: 'CalendarDays' },
  { id: 'hotels',     label: 'Hotels',      icon: 'Building2' },
  { id: 'transport',  label: 'Transport',   icon: 'Plane' },
  { id: 'images',     label: 'Images',      icon: 'Image' },
] as const;

export type EditorStepId = typeof EDITOR_STEPS[number]['id'];
