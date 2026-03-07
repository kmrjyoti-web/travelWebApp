/**
 * Zod validation schemas for GeoSettings — one schema per drawer tab.
 */
import { z } from 'zod';

/** --- Tab 1: Schema Markup --- */
export const schemaMarkupSchema = z.object({
  schemaType: z.enum(['TravelAction', 'TouristTrip', 'TouristAttraction', 'Event']),
  destinationName: z.string().min(1, 'Destination name is required'),
  destinationLat: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .nullable(),
  destinationLng: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .nullable(),
  priceRange: z.string(),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
  durationIso: z
    .string()
    .refine(
      (v) => v === '' || /^P\d+D$/.test(v),
      'Duration must be ISO 8601 format (e.g. P7D) or empty',
    ),
  availability: z.enum(['InStock', 'SoldOut', 'PreOrder', 'LimitedAvailability']),
  providerName: z.string(),
  providerUrl: z
    .string()
    .refine(
      (v) => v === '' || z.string().url().safeParse(v).success,
      'Must be a valid URL or empty',
    ),
});

/** --- Tab 2: AI Search --- */
export const aiSearchSchema = z.object({
  aiSummary: z.string().max(300, 'AI summary cannot exceed 300 characters'),
  keyHighlights: z.array(z.string()).max(10, 'Maximum 10 highlights'),
  targetQueries: z.array(z.string()).max(10, 'Maximum 10 target queries'),
  faqs: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .max(10, 'Maximum 10 FAQs'),
  competitorKeywords: z.array(z.string()).max(10, 'Maximum 10 competitor keywords'),
  freshnessEnabled: z.boolean(),
  freshnessDate: z.string().nullable(),
});

/** --- Tab 3: SEO Controls --- */
export const seoSchema = z.object({
  seoTitle: z.string().max(70, 'SEO title cannot exceed 70 characters'),
  metaDescription: z.string().max(200, 'Meta description cannot exceed 200 characters'),
  canonicalUrl: z
    .string()
    .refine(
      (v) => v === '' || z.string().url().safeParse(v).success,
      'Must be a valid URL or empty',
    ),
  ogImageUrl: z
    .string()
    .refine(
      (v) => v === '' || z.string().url().safeParse(v).success,
      'Must be a valid URL or empty',
    ),
  ogTitle: z.string().max(100, 'OG title cannot exceed 100 characters'),
  twitterCard: z.enum(['summary', 'summary_large_image']),
  robots: z.string(),
  slug: z
    .string()
    .max(255, 'Slug cannot exceed 255 characters')
    .refine(
      (v) => /^[a-z0-9-]*$/.test(v),
      'Slug may only contain lowercase letters, numbers, and hyphens',
    ),
});

/** --- Tab 4: Geo Targeting --- */
export const geoTargetingSchema = z.object({
  targetCountries: z.array(z.string()),
  targetLanguages: z.array(z.string()),
  regionBoost: z
    .enum(['south_asia', 'middle_east', 'europe', 'global'])
    .nullable(),
  localCurrencyDisplay: z.boolean(),
  timezone: z.string(),
});

/** --- Tab 5: Social & Voice --- */
export const socialVoiceSchema = z.object({
  socialHashtags: z.array(z.string()),
  locationTags: z.array(z.string()),
  voiceSearchPhrases: z.array(z.string()),
  speakableSnippet: z.string().max(500, 'Speakable snippet cannot exceed 500 characters'),
});
