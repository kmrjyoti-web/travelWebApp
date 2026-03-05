
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Attraction, Itinerary, FormPreferences, VisaInfo, Activity, LocalEvent, EmergencyInfo, Trip, ImageGalleryItem } from '../models/itinerary.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;
  private configService = inject(ConfigService);
  private config = this.configService.getConfig();

  constructor() {
    const apiKey = this.config.apiKey;
    if (!apiKey) {
      console.error("API_KEY not set in src/config/app.config.ts");
      // throw new Error("API_KEY not set. Please set it in src/config/app.config.ts");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private _extractJson(text: string): string {
    const trimmedText = text.trim();
    // Case 1: Wrapped in markdown ```json ... ```
    const match = trimmedText.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return match[1];
    }

    // Case 2: Plain JSON, possibly with leading/trailing text
    const firstBrace = trimmedText.indexOf('{');
    const firstBracket = trimmedText.indexOf('[');

    if (firstBrace === -1 && firstBracket === -1) {
      // Not a JSON object or array, return original text and let JSON.parse handle the error
      return trimmedText;
    }

    let startIndex = -1;
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIndex = firstBrace;
    } else {
      startIndex = firstBracket;
    }

    const lastBrace = trimmedText.lastIndexOf('}');
    const lastBracket = trimmedText.lastIndexOf(']');
    const endIndex = Math.max(lastBrace, lastBracket);

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      return trimmedText.substring(startIndex, endIndex + 1);
    }

    return trimmedText; // Fallback to original text
  }

  async getVisaRequirements(from: string, to: string, model?: string): Promise<VisaInfo> {
    if (!from || from === 'Not specified') {
      return { summary: 'Origin country not specified. Cannot determine visa requirements.', sources: [], processSteps: [] };
    }

    const prompt = this.config.aiPrompts.visaRequirement
      .replace('{{from}}', from)
      .replace('{{to}}', to);

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        sources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              uri: { type: Type.STRING }
            },
            required: ['title', 'uri']
          }
        },
        processSteps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step: { type: Type.INTEGER },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING },
              documents: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['step', 'title', 'description']
          }
        }
      },
      required: ['summary', 'sources']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });

      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as VisaInfo;
    } catch (error: any) {
      console.error('Error fetching visa requirements:', error);
      if (error.message?.includes('429') || error.status === 429 || error.toString().includes('Quota exceeded')) {
        console.warn('Gemini Quota Exceeded. Returning Mock Visa Data.');
        return this.getMockVisaInfo();
      }
      throw new Error('Could not fetch visa requirements from AI.');
    }
  }

  private getMockVisaInfo(): VisaInfo {
    return {
      summary: "Mock Visa Data: API Quota Exceeded. Please check official sources.",
      sources: [{ title: "Mock Source", uri: "https://example.com" }],
      processSteps: [
        { step: 1, title: "Check Requirements", description: "This is a mock step due to API limits.", documents: ["Passport"] }
      ]
    };
  }

  async generateItinerary(preferences: FormPreferences): Promise<Partial<Trip>> {
    let accommodationPref = preferences.accommodationType;
    if (
      (preferences.accommodationType === 'Hotel' || preferences.accommodationType === 'Resort') &&
      preferences.starRating !== 'No Preference'
    ) {
      accommodationPref = `${preferences.starRating} ${preferences.accommodationType}`;
    }

    let travelDetails = '';
    if (preferences.services.includes('flights')) {
      travelDetails += `
      - Flight Preferences:
        - Preferred Airline: ${preferences.preferredAirline || 'Any'}
        - Departure Window: ${preferences.flightDepartureTime || 'Any'}
        - Arrival Window: ${preferences.flightArrivalTime || 'Any'}
      `;
    }
    if (preferences.services.includes('train')) {
      travelDetails += `
      - Train Preferences:
        - Type: ${preferences.trainPreference || 'Any'}
        `;
    }

    const travelerInfo = `${preferences.adults} adult(s)` + (preferences.children > 0 ? ` and ${preferences.children} child(ren)` : '');

    const requestDetails = `
      - From: ${preferences.from}
      - Destination: ${preferences.to}
      - Duration: ${preferences.days} days, from ${preferences.startDate} to ${preferences.endDate}
      - Travelers: ${travelerInfo}
      - Budget: ${preferences.budget}
      - Accommodation Preference: ${accommodationPref}
      - Food Preferences: ${preferences.food}
      - Interests & Vibe: ${preferences.interests}
      - Other requested services: ${preferences.services.join(', ')}
      ${travelDetails.trim()}
    `;

    const fullPrompt = this.config.aiPrompts.itineraryGenerator
      .replace('{{requestDetails}}', requestDetails.trim())
      .replace('{{travelerInfo}}', travelerInfo) +
      `
      
      IMPORTANT: In addition to the itinerary, you MUST generate:
      1. "fromLocation": Structured details (Country, State, City with ISO codes) for the origin ("From" location).
      2. "toLocation": Structured details (Country, State, City with ISO codes) for the main destination ("To" location).
      3. "search_keys": A list of 10-15 relevant search keywords for this trip (e.g., specific locations, themes, activity types).
      4. "seo_detail": A fully populated SEO object with Title, Meta Description, Keywords, and Open Graph tags optimized for a travel website page about this specific itinerary.

      TAGGING & THEMES:
      - If 'includeNightlife' is true (User asked: ${preferences.includeNightlife}), include "Nightlife" tagged activities and a section for it if possible.
      - If children > 0 (${preferences.children}), tag suitable activities as "Kids Friendly".
      - If Trip Nature is "Religious" or "Spiritual", tag relevant sites as "Religious".
      - Propagate these tags to the 'search_keys' list.
      
      5. "imageGallery": An array of objects for generating high-quality AI images for the trip. Generate one entry for EACH of the following aspect ratios: "616x730", "600x400", "832x785", "482x552", "1920x251".
         - For each, provide a detailed "prompt" optimized for an image generator (like Imagen 3) capturing the essence of the destination/trip.
         - Provide a short "altText".
      `;

    const attractionSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING }, description: { type: Type.STRING }, imageQuery: { type: Type.STRING },
        estimatedCost: { type: Type.STRING, enum: ['Free', 'Low', 'Medium', 'High'] },
        cost: { type: Type.NUMBER, description: 'Estimated cost in USD. 0 if free.' },
        rating: { type: Type.NUMBER, description: 'The numeric rating of the attraction, from 1 to 5.' },
        estimatedDuration: { type: Type.STRING }, latitude: { type: Type.NUMBER }, longitude: { type: Type.NUMBER }, category: { type: Type.STRING },
        locationDetails: {
          type: Type.OBJECT,
          description: "Structured location details.",
          properties: {
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            cityCode: { type: Type.STRING },
            state: { type: Type.STRING },
            stateCode: { type: Type.STRING },
            country: { type: Type.STRING },
            countryCode: { type: Type.STRING }
          }
        }
      },
      required: ['name', 'description', 'imageQuery', 'estimatedCost', 'latitude', 'longitude', 'category']
    };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        itinerary: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'A creative and fitting title for the trip itinerary.' },
            summary: { type: Type.STRING, description: 'A brief, engaging summary of the entire trip.' },
            weather: { type: Type.STRING, description: 'A short paragraph (3-4 sentences) with general weather advice for the destination during the specified travel dates.' },
            notes: { type: Type.STRING, description: 'A short paragraph (3-4 sentences) of essential notes or tips for the traveler (e.g., currency, local customs, what to pack).' },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER, description: 'The day number of the itinerary (e.g., 1, 2, 3).' },
                  theme: { type: Type.STRING, description: 'A theme for the day, like "Cultural Immersion" or "Coastal Adventure".' },
                  weather: {
                    type: Type.OBJECT,
                    description: "A detailed weather forecast and dress code suggestion for this specific day.",
                    properties: {
                      forecast: { type: Type.STRING, description: "A detailed forecast for the day (e.g., 'Sunny with a high of 25°C, light breeze in the afternoon.')." },
                      dressCode: { type: Type.STRING, description: "A practical dress code suggestion based on the forecast and planned activities (e.g., 'Light layers, comfortable walking shoes, and sunglasses.')." }
                    },
                    required: ['forecast', 'dressCode']
                  },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: 'Suggested time of day (e.g., "Morning", "Afternoon", "Evening").' },
                        title: { type: Type.STRING, description: 'A concise title for the activity.' },
                        description: { type: Type.STRING, description: 'A short description of the activity (2-3 sentences).' },
                        location: { type: Type.STRING, description: 'The specific name and address or neighborhood of the activity location.' },
                        locationDetails: {
                          type: Type.OBJECT,
                          description: "Structured location details including ISO codes.",
                          properties: {
                            address: { type: Type.STRING },
                            city: { type: Type.STRING },
                            cityCode: { type: Type.STRING, description: "UN/LOCODE or IATA city code if available, else 3-letter abbreviation." },
                            state: { type: Type.STRING },
                            stateCode: { type: Type.STRING, description: "ISO 3166-2 state/province code." },
                            country: { type: Type.STRING },
                            countryCode: { type: Type.STRING, description: "ISO 3166-1 alpha-2 country code." }
                          },
                          required: ['city', 'country', 'countryCode']
                        },
                        activityType: { type: Type.STRING, description: "Category of the activity, e.g., 'Dining', 'Culture', 'Sightseeing'." },
                        latitude: { type: Type.NUMBER, description: 'The latitude of the activity location.' },
                        longitude: { type: Type.NUMBER, description: 'The longitude of the activity location.' },
                        cost: { type: Type.NUMBER, description: 'Estimated cost per person in USD. Use 0 for free activities.' },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tags: 'Nightlife', 'Kids Friendly', 'Religious', 'Adventure', etc." }
                      },
                      required: ['time', 'title', 'description', 'location', 'activityType', 'latitude', 'longitude', 'cost'],
                    },
                  },
                  nearbyPlaces: {
                    type: Type.ARRAY,
                    description: "A list of 2-3 nearby points of interest or restaurants relevant to the day's activities.",
                    items: attractionSchema
                  }
                },
                required: ['day', 'theme', 'activities', 'nearbyPlaces', 'weather'],
              },
            },
            inclusions: {
              type: Type.ARRAY,
              description: "A list of key items included in the trip package.",
              items: { type: Type.STRING }
            },
            exclusions: {
              type: Type.ARRAY,
              description: "A list of common items not included in the trip package.",
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'summary', 'weather', 'notes', 'days', 'inclusions', 'exclusions'],
        },
        accommodation: {
          type: Type.ARRAY,
          description: "Details of the suggested accommodation(s).",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique UUID for the accommodation." },
              type: { type: Type.STRING, description: "The type of accommodation (e.g., 'Hotel', 'Villa')." },
              hotelName: { type: Type.STRING },
              checkInDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
              checkOutDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
              price: { type: Type.NUMBER, description: "Total estimated price in USD for the entire stay." },
              facilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              imageQuery: { type: Type.STRING, description: "A search query for a representative image of the hotel." },
              address: { type: Type.STRING, description: "The full address of the hotel." },
              rating: { type: Type.NUMBER, description: "The star rating of the hotel (e.g., 4.5)." },
              roomType: { type: Type.STRING, description: "A suggested room type (e.g., 'Deluxe King Room')." },
              boardBasis: { type: Type.STRING, description: "The board basis (e.g., 'Breakfast Included', 'Room Only')." },
              contactNumber: { type: Type.STRING, description: "The hotel's primary contact phone number." },
              website: { type: Type.STRING, description: "The hotel's official website URL." }
            },
            required: ['id', 'type', 'hotelName', 'checkInDate', 'checkOutDate', 'price', 'facilities', 'imageQuery']
          }
        },
        transportation: {
          type: Type.OBJECT,
          description: "Details of suggested transportation.",
          properties: {
            flights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  airline: { type: Type.STRING },
                  departureAirport: { type: Type.STRING },
                  arrivalAirport: { type: Type.STRING },
                  departureTime: { type: Type.STRING, description: "YYYY-MM-DD HH:MM format" },
                  arrivalTime: { type: Type.STRING, description: "YYYY-MM-DD HH:MM format" },
                  price: { type: Type.NUMBER, description: "Estimated price per person in USD." }
                },
                required: ['airline', 'departureAirport', 'arrivalAirport', 'departureTime', 'arrivalTime', 'price']
              }
            },
            trains: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trainType: { type: Type.STRING },
                  departureStation: { type: Type.STRING },
                  arrivalStation: { type: Type.STRING },
                  departureTime: { type: Type.STRING, description: "YYYY-MM-DD HH:MM format" },
                  arrivalTime: { type: Type.STRING, description: "YYYY-MM-DD HH:MM format" },
                  price: { type: Type.NUMBER, description: "Estimated price per person in USD." }
                },
                required: ['trainType', 'departureStation', 'arrivalStation', 'departureTime', 'arrivalTime', 'price']
              }
            },
            other: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  details: { type: Type.STRING },
                  price: { type: Type.NUMBER, description: "Estimated price per person in USD." }
                },
                required: ['type', 'details', 'price']
              }
            }
          }
        },
        fromLocation: {
          type: Type.OBJECT,
          description: "Structured location details for the origin.",
          properties: {
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            cityCode: { type: Type.STRING },
            state: { type: Type.STRING },
            stateCode: { type: Type.STRING },
            country: { type: Type.STRING },
            countryCode: { type: Type.STRING }
          },
          required: ['city', 'country', 'countryCode']
        },
        toLocation: {
          type: Type.OBJECT,
          description: "Structured location details for the main destination.",
          properties: {
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            cityCode: { type: Type.STRING },
            state: { type: Type.STRING },
            stateCode: { type: Type.STRING },
            country: { type: Type.STRING },
            countryCode: { type: Type.STRING }
          },
          required: ['city', 'country', 'countryCode']
        },
        search_keys: {
          type: Type.ARRAY,
          description: "A list of relevant search keywords for this itinerary (e.g., 'Paris', 'Honeymoon', 'Summer', 'Eiffel Tower').",
          items: { type: Type.STRING }
        },
        seo_detail: {
          type: Type.OBJECT,
          description: "SEO optimized details for this itinerary page.",
          properties: {
            title: { type: Type.STRING, description: "SEO Title tag (< 60 chars)" },
            metaDescription: { type: Type.STRING, description: "Meta description (< 160 chars)" },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Meta keywords" },
            canonicalUrl: { type: Type.STRING },
            ogTitle: { type: Type.STRING, description: "Open Graph Title" },
            ogDescription: { type: Type.STRING, description: "Open Graph Description" },
            ogImage: { type: Type.STRING, description: "Open Graph Image URL (use placeholder or search query)" },
            twitterCard: { type: Type.STRING, description: "Twitter Card type (e.g. summary_large_image)" },
            robots: { type: Type.STRING, description: "Robots tag (e.g. index, follow)" }
          },
          required: ['title', 'metaDescription', 'keywords', 'ogTitle', 'ogDescription']
        },
        imageGallery: {
          type: Type.ARRAY,
          description: "Prompts for generating marketing images in specific sizes.",
          items: {
            type: Type.OBJECT,
            properties: {
              aspectRatio: { type: Type.STRING, enum: ["616x730", "600x400", "832x785", "482x552", "1920x251"] },
              prompt: { type: Type.STRING, description: "A detailed image generation prompt." },
              altText: { type: Type.STRING, description: "Short description." }
            },
            required: ['aspectRatio', 'prompt', 'altText']
          }
        }
      },
      required: ['itinerary', 'fromLocation', 'toLocation', 'search_keys', 'seo_detail', 'imageGallery'],
    };

    try {
      const modelId = preferences.selectedModel || 'gemini-2.5-flash';
      console.log(`Generating itinerary using model: ${modelId}`);

      const response = await this.ai.models.generateContent({
        model: modelId,
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7,
        },
      });

      const jsonText = this._extractJson(response.text || '');
      const parsedData = JSON.parse(jsonText);
      return parsedData as Partial<Trip>;
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      if (error.message?.includes('429') || error.status === 429 || error.toString().includes('Quota exceeded')) {
        console.warn('Gemini Quota Exceeded. Returning Mock Itinerary Data.');
        return this.getMockItinerary(preferences);
      }
      throw new Error('Could not parse itinerary from AI response.');
    }
  }

  private getMockItinerary(pref: FormPreferences): Partial<Trip> {
    const mockTrip: Partial<Trip> = {
      itinerary: {
        title: `Mock Trip to ${pref.to} (Quota Exceeded)`,
        summary: "This is a generated mock itinerary because the Gemini API quota has been exceeded. It showcases the structure of the data including the new Nightlife and Tagging features.",
        weather: "Expect mock weather conditions.",
        notes: "Automatic mock generation.",
        days: [
          {
            day: 1,
            theme: "Mock Arrival & Nightlife",
            weather: { forecast: "Sunny", dressCode: "Casual" },
            activities: [
              {
                time: "Evening",
                title: "Mock Nightlife Activity",
                description: "Enjoying the mock nightlife.",
                location: "Downtown Mock City",
                activityType: "Nightlife",
                latitude: 0,
                longitude: 0,
                cost: 50,
                tags: ["Nightlife", "Party"]
              }
            ],
            nearbyPlaces: []
          }
        ],
        inclusions: ["Mock Inclusion"],
        exclusions: ["Mock Exclusion"]
      },
      fromLocation: {
        city: pref.from,
        country: "Unknown",
        countryCode: "XX",
        address: pref.from
      },
      toLocation: {
        city: pref.to,
        country: "Unknown",
        countryCode: "XX",
        address: pref.to
      },
      search_keys: ["Mock", "Quota Exceeded", "Nightlife", "Test"],
      seo_detail: {
        title: `Trip to ${pref.to}`,
        metaDescription: "Mock description for SEO.",
        keywords: ["travel", "mock"],
        ogTitle: `Trip to ${pref.to}`,
        ogDescription: "Mock OG Description"
      }
    };
    return mockTrip;
  }

  async getPopularAttractions(destination: string, model?: string): Promise<Attraction[]> {
    const prompt = `List 10 popular attractions and points of interest for a tourist in ${destination}. Include a mix of cultural sites, restaurants, and outdoor spaces. For each attraction, provide its name, a short description (2-3 sentences), a search query for a representative image (e.g., "Eiffel Tower at night"), an estimated cost category ('Free', 'Low', 'Medium', 'High'), an estimated cost in USD (e.g., 25 for a $25 ticket, 0 for free), a numeric rating out of 5 (e.g. 4.5), a typical duration (e.g., '1-2 hours'), its precise latitude and longitude, a category (e.g., 'Museum', 'Restaurant', 'Park'), and structured location details including Country, State, and City codes.`;

    const responseSchema = {
      // ... existing schema ...
      // type: Type.ARRAY removed
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          imageQuery: { type: Type.STRING },
          estimatedCost: { type: Type.STRING, enum: ['Free', 'Low', 'Medium', 'High'] },
          cost: { type: Type.NUMBER, description: 'Estimated cost in USD. 0 if free.' },
          rating: { type: Type.NUMBER, description: 'The numeric rating of the attraction, from 1 to 5.' },
          estimatedDuration: { type: Type.STRING },
          latitude: { type: Type.NUMBER },
          longitude: { type: Type.NUMBER },
          category: { type: Type.STRING },
          locationDetails: {
            type: Type.OBJECT,
            properties: {
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              cityCode: { type: Type.STRING },
              state: { type: Type.STRING },
              stateCode: { type: Type.STRING },
              country: { type: Type.STRING },
              countryCode: { type: Type.STRING }
            }
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'description', 'imageQuery', 'estimatedCost', 'latitude', 'longitude', 'category'],
      },
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      const parsedData = JSON.parse(jsonText);
      return parsedData as Attraction[];
    } catch (error: any) {
      console.error('Error fetching popular attractions:', error);
      if (error.message?.includes('429') || error.status === 429 || error.toString().includes('Quota exceeded')) {
        return [{
          name: "Mock Attraction (Quota Limit)",
          description: "Mock description due to API limit.",
          imageQuery: "mock image",
          estimatedCost: "Free",
          cost: 0,
          rating: 4.5,
          estimatedDuration: "1 hour",
          latitude: 0,
          longitude: 0,
          category: "Mock",
          tags: ["Mock", "Sightseeing"],
          locationDetails: { city: destination, country: "Mockland", countryCode: "XX" }
        }];
      }
      return [];
    }
  }

  async getDynamicEvents(destination: string, startDate: string, endDate: string, model?: string): Promise<LocalEvent[]> {
    const prompt = `List significant local events, festivals, concerts, or special exhibitions happening in ${destination} between ${startDate} and ${endDate}. For each event, provide its name, the specific date(s), a short description, the venue or location, its latitude, its longitude, and an estimated per-person cost in USD (0 for free). If no major events are found, return an empty array.`;
    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
          venue: { type: Type.STRING },
          latitude: { type: Type.NUMBER, description: 'The latitude of the event location.' },
          longitude: { type: Type.NUMBER, description: 'The longitude of the event location.' },
          cost: { type: Type.NUMBER, description: 'Estimated cost per person in USD. Use 0 for free events.' },
        },
        required: ['name', 'date', 'description', 'venue'],
      },
    };
    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as LocalEvent[];
    } catch (error) {
      console.error('Error fetching dynamic events:', error);
      return [];
    }
  }

  async getEmergencyInfo(from: string, to: string, model?: string): Promise<EmergencyInfo> {
    const prompt = `A citizen from ${from} is traveling to ${to}. Provide emergency contact information. Find the official embassy or consulate for ${from} in ${to} and give its name, address, primary phone number, and official website, plus a short detail (e.g., 'For consular services'). Also, provide the standard local emergency numbers for Police, Ambulance, Fire, and Medical services in ${to}.`;
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        embassy: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            phone: { type: Type.STRING },
            website: { type: Type.STRING },
            details: { type: Type.STRING },
          },
          required: ['name', 'address', 'phone', 'website', 'details'],
        },
        localServices: {
          type: Type.OBJECT,
          properties: {
            police: { type: Type.STRING },
            ambulance: { type: Type.STRING },
            fire: { type: Type.STRING },
            medical: { type: Type.STRING },
          },
          required: ['police', 'ambulance', 'fire', 'medical'],
        },
      },
      required: ['embassy', 'localServices'],
    };
    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as EmergencyInfo;
    } catch (error: any) {
      console.error('Error fetching emergency info:', error);
      if (error.message?.includes('429') || error.status === 429 || error.toString().includes('Quota exceeded')) {
        return {
          embassy: { name: "Mock Embassy", address: "Mock Address", phone: "000", website: "example.com", details: "Mock Details" },
          localServices: { police: "911", ambulance: "911", fire: "911", medical: "911" }
        };
      }
      throw new Error('Could not retrieve emergency information.');
    }
  }

  async getLocalHighlights(activities: Activity[], destination: string, model?: string): Promise<Attraction[]> {
    if (activities.length === 0) {
      return [];
    }

    const activityLocations = activities.map(a => `- ${a.title} at ${a.location}`).join('\n');

    const prompt = `Based on the following activities in ${destination}, suggest 3 nearby local highlights (like cafes, small parks, or interesting shops) that are not already on the list.
    
    Activities for the day:
    ${activityLocations}

    For each highlight, provide its name, a short description, an image query, cost category, estimated cost in USD, a numeric rating out of 5, estimated duration, latitude, longitude, category, and structured location details including Country, State, and City codes.
    `;

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          imageQuery: { type: Type.STRING },
          estimatedCost: { type: Type.STRING, enum: ['Free', 'Low', 'Medium', 'High'] },
          cost: { type: Type.NUMBER },
          rating: { type: Type.NUMBER },
          estimatedDuration: { type: Type.STRING },
          latitude: { type: Type.NUMBER },
          longitude: { type: Type.NUMBER },
          category: { type: Type.STRING },
          locationDetails: {
            type: Type.OBJECT,
            properties: {
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              cityCode: { type: Type.STRING },
              state: { type: Type.STRING },
              stateCode: { type: Type.STRING },
              country: { type: Type.STRING },
              countryCode: { type: Type.STRING }
            }
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['name', 'description', 'imageQuery', 'estimatedCost', 'latitude', 'longitude', 'category'],
      },
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as Attraction[];
    } catch (error) {
      console.error('Error fetching local highlights:', error);
      return [];
    }
  }

  async translateItinerary(itinerary: Itinerary, language: string, model?: string): Promise<Itinerary> {
    const prompt = `
      Translate all user-facing text fields in the following JSON object to the target language: ${language}.
      The fields to translate are: title, summary, weather, notes, theme, and for each activity: title, description.
      Do NOT translate any JSON keys.
      Do NOT change the structure of the JSON object.
      Return only the translated JSON object, with no markdown formatting.
      Original JSON:
      ${JSON.stringify(itinerary)}
    `;

    // Re-using the itinerary schema from the generation method
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        weather: { type: Type.STRING },
        days: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              // Simplified for brevity in this generic schema, relying on AI to keep structure
              day: { type: Type.INTEGER },
              theme: { type: Type.STRING },
              activities: { type: Type.ARRAY, items: { type: Type.OBJECT } }
            }
          }
        }
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as Itinerary;
    } catch (error) {
      console.error('Error translating itinerary:', error);
      throw new Error('Could not translate the itinerary.');
    }
  }
  async generateImagePrompts(trip: Trip, galleryCount: number, aspectRatios: string[], model?: string): Promise<ImageGalleryItem[]> {
    const prompt = `
      Summary: ${trip.itinerary.summary}
      Themes: ${trip.preferences.interests}
      
      Generate ${galleryCount} unique image prompts for the "General Gallery" (Aspect Ratio 16:9).
      Generate 1 image prompt for EACH of the following marketing aspect ratios: ${aspectRatios.join(', ')}.
      
      Output ONLY a JSON array of objects with keys: "aspectRatio", "prompt", "altText".
      For general gallery items, use "16:9" as aspect ratio.
    `;

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          aspectRatio: { type: Type.STRING },
          prompt: { type: Type.STRING },
          altText: { type: Type.STRING }
        },
        required: ['aspectRatio', 'prompt', 'altText']
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText) as ImageGalleryItem[];
    } catch (error) {
      console.error('Error generating image prompts:', error);
      // Fallback for quota or error
      return Array(galleryCount).fill(null).map((_, i) => ({
        aspectRatio: '16:9',
        prompt: `Beautiful scenic view of ${trip.preferences.to}`,
        altText: `Scene ${i + 1}`
      }));
    }
  }

  async generateImage(prompt: string, model?: string): Promise<Blob> {
    // Using Pollinations.ai for direct image generation from prompt
    // This is a free, public API that generates images on the fly.
    // We encode the prompt component to ensure URL safety.
    // Adding 'photorealistic, 8k, high quality' to ensure good results.
    const enhancedPrompt = `${prompt}, photorealistic, 8k, travel photography, cinematic lighting`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Generation failed with status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('AI Image Generation failed:', error);
      throw error;
    }
  }


  async generateSearchOptimization(trip: Trip, model?: string): Promise<{ from: string, to: string, search: string, offer: string }> {
    const prompt = `
      Analyze the following trip itinerary and generate optimized search keywords and metadata for a travel platform.
      
      Trip Details:
      Title: ${trip.itinerary.title}
      Summary: ${trip.itinerary.summary}
      From: ${trip.preferences.from}
      To: ${trip.preferences.to}
      Interests: ${trip.preferences.interests}
      Trip Nature: ${trip.preferences.tripNature}
      
      Output 4 distinct sets of keywords (comma-separated strings):
      1. "from": Keywords related to the origin (City, State, Country, Airport codes).
      2. "to": Keywords related to the destination (Cities, Regions, Attractions, Specific Locations in the itinerary).
      3. "search": Broad and specific search terms (Themes, Vibe, Activity types, Combined location+theme like "Paris honeymoon").
      4. "offer": Marketing keywords if applicable (e.g., "Special Deal", "Family Package").

      Return ONLY the JSON object.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        from: { type: Type.STRING },
        to: { type: Type.STRING },
        search: { type: Type.STRING },
        offer: { type: Type.STRING }
      },
      required: ['from', 'to', 'search', 'offer']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: model || 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      const jsonText = this._extractJson(response.text || '');
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Error generating search keys:', error);
      throw new Error('Could not generate search keys.');
    }
  }
}
