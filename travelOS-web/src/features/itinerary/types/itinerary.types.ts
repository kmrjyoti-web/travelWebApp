import { z } from 'zod';

export const BUDGET_OPTIONS = ['Budget', 'Moderate', 'Luxury', 'Ultra-Luxury'] as const;
export const ACCOMMODATION_OPTIONS = ['Hotel', 'Resort', 'Hostel', 'Villa', 'Airbnb', 'No Preference'] as const;
export const STAR_RATING_OPTIONS = ['No Preference', '3-Star', '4-Star', '5-Star'] as const;
export const FOOD_OPTIONS = ['Local Cuisine', 'Vegetarian', 'Vegan', 'Halal', 'No Preference'] as const;
export const SERVICE_OPTIONS = ['Guide', 'Driver', 'Translator', 'Photography'] as const;
/** Fallback list used when the currencies API is unavailable */
export const CURRENCY_OPTIONS = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY'] as const;
export const TRIP_NATURE_OPTIONS = ['Adventure', 'Relaxation', 'Cultural', 'Balanced'] as const;
export const AI_MODEL_OPTIONS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-sonnet', label: 'Claude Sonnet' },
] as const;
export const TIME_PREF_OPTIONS = ['any', 'morning', 'afternoon', 'evening', 'night'] as const;
export const TRAIN_PREF_OPTIONS = ['any', 'ac', 'sleeper', 'general'] as const;

export const selfItinerarySchema = z.object({
  from: z.string().min(2, 'Origin city is required'),
  to: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  days: z.number().int().min(1, 'Trip must be at least 1 day'),
  budget: z.enum(BUDGET_OPTIONS),
  accommodationType: z.enum(ACCOMMODATION_OPTIONS),
  starRating: z.enum(STAR_RATING_OPTIONS),
  food: z.enum(FOOD_OPTIONS),
  interests: z.string().max(500, 'Max 500 characters').optional().default(''),
  services: z.array(z.enum(SERVICE_OPTIONS)).default([]),
  adults: z.number().int().min(1, 'At least 1 adult required').max(20),
  children: z.number().int().min(0).max(10),
  currency: z.string().min(1, 'Currency is required'),
  tripNature: z.enum(TRIP_NATURE_OPTIONS),
  flightDepartureTime: z.enum(TIME_PREF_OPTIONS),
  flightArrivalTime: z.enum(TIME_PREF_OPTIONS),
  trainPreference: z.enum(TRAIN_PREF_OPTIONS),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['endDate'] }
);

export type SelfItineraryFormData = z.infer<typeof selfItinerarySchema>;

export const aiItinerarySchema = z.object({
  prompt: z.string().min(10, 'Describe your trip in at least 10 characters'),
  from: z.string().min(2, 'Origin city is required'),
  to: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10),
  budget: z.enum(BUDGET_OPTIONS),
  selectedModel: z.string().min(1, 'AI model is required'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  { message: 'End date must be on or after start date', path: ['endDate'] }
);

export type AiItineraryFormData = z.infer<typeof aiItinerarySchema>;

export const AI_ITINERARY_DEFAULTS: AiItineraryFormData = {
  prompt: '',
  from: '',
  to: '',
  startDate: '',
  endDate: '',
  adults: 2,
  children: 0,
  budget: 'Moderate',
  selectedModel: 'gemini-2.5-flash',
};

export const SELF_ITINERARY_DEFAULTS: SelfItineraryFormData = {
  from: '',
  to: '',
  startDate: '',
  endDate: '',
  days: 0,
  budget: 'Moderate',
  accommodationType: 'Hotel',
  starRating: 'No Preference',
  food: 'Local Cuisine',
  interests: '',
  services: [],
  adults: 2,
  children: 0,
  currency: 'USD',
  tripNature: 'Balanced',
  flightDepartureTime: 'any',
  flightArrivalTime: 'any',
  trainPreference: 'any',
};
