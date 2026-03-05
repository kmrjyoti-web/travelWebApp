import { environment } from '../../../../../environments/environment';

export const APP_CONFIG = {
  version: '1.3.0',
  uiText: {
    title: 'AI Itinerary Builder',
    subtitle: 'Describe your dream trip, and let our AI craft a personalized, day-by-day plan for your next adventure.',
    formTitle: 'Plan Your Trip',
    termsAndConditions: 'I agree to the <a href="#" class="font-medium text-indigo-600 hover:underline">Terms and Conditions</a> and acknowledge that the generated itinerary is a suggestion.',
    initialDisplayTitle: 'Your Itinerary Awaits',
    initialDisplaySubtitle: 'Fill out the form to the left and let AI plan your perfect trip!',
  },
  services: [
    { id: 'flights', label: 'Flights' },
    { id: 'hotel', label: 'Hotel' },
    { id: 'guide', label: 'Travel Guide' },
    { id: 'transport', label: 'Transport' },
    { id: 'visa', label: 'Visa Assistance' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'cab', label: 'Cab Service' },
    { id: 'ferry', label: 'Ferry/Cruise' },
    { id: 'train', label: 'Train Tickets' },
    { id: 'finance', label: 'EMI/Finance' },
    { id: 'bus', label: 'Bus Tickets' },
    { id: 'yacht', label: 'Yacht Rental' },
  ],
  formOptions: {
    budget: ['Budget-friendly', 'Moderate', 'Mid-range', 'Luxury'],
    accommodation: ['Hotel', 'Hostel', 'Airbnb', 'Resort', 'Villa', 'Apartment', 'Row House'],
    starRating: ['No Preference', '3-star', '4-star', '5-star'],
    flightTimes: [
      { id: 'any', label: 'Any' },
      { id: 'morning', label: 'Morning (5am-12pm)' },
      { id: 'afternoon', label: 'Afternoon (12pm-5pm)' },
      { id: 'evening', label: 'Evening (5pm-9pm)' },
      { id: 'night', label: 'Night (9pm-5am)' },
    ],
    trainTypes: [
      { id: 'any', label: 'Any' },
      { id: 'high-speed', label: 'High-Speed' },
      { id: 'scenic', label: 'Scenic Route' },
      { id: 'overnight', label: 'Overnight Sleeper' },
    ],
    currencies: [
      { code: 'USD', name: 'US Dollar', rate: 1 },
      { code: 'EUR', name: 'Euro', rate: 0.93 },
      { code: 'GBP', name: 'British Pound', rate: 0.79 },
      { code: 'JPY', name: 'Japanese Yen', rate: 157.5 },
      { code: 'INR', name: 'Indian Rupee', rate: 83.4 },
    ],
  },
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'hi', name: 'Hindi' },
  ],
  activityIcons: {
    'dining': '🍴',
    'culture': '🏛️',
    'sightseeing': '👀',
    'outdoor': '🚶',
    'shopping': '🛍️',
    'entertainment': '🎭',
    'transport': '🚗',
    'default': '📍',
  },
  aiPrompts: {
    visaRequirement: `
      Provide a detailed guide for a tourist visa for a citizen of {{from}} traveling to {{to}}.
      Your response must be a JSON object.
      - The 'summary' should be a concise overview (3-4 sentences) of the visa requirements.
      - The 'sources' should be an array of up to 3 official-looking source objects, each with a 'title' and a 'uri' (e.g., official embassy website).
      - The 'processSteps' should be an array of objects detailing the visa application process step-by-step. Each step should have a 'step' number, a 'title', a 'description', an estimated 'duration' (e.g., "1-2 weeks"), and an array of required 'documents'.
      - Include a disclaimer in the summary that this information is for guidance only and should be verified with official sources.
      - If no visa is required, the summary should state that, and the processSteps array should be empty.
    `,
    itineraryGenerator: `
      You are an expert travel agent specializing in creating personalized itineraries.
      Your task is to generate a detailed, day-by-day travel plan based on the user's request.
      Ensure the itinerary is practical, engaging, and tailored to the provided preferences.
      
      The travel group consists of {{travelerInfo}}. Please tailor the activities and pacing accordingly. If children are present, prioritize family-friendly options.

      **Main Itinerary:**
      - For each activity, provide a specific location, its latitude and longitude, an 'activityType' from the categories ('Dining', 'Culture', 'Sightseeing', 'Outdoor', 'Shopping', 'Entertainment', 'Transport'), and an estimated PER-PERSON cost in USD (0 for free).
      - For each day, also suggest 2-3 'nearbyPlaces' to consider.
      - For EACH DAY, provide a specific daily 'weather' object containing a 'forecast' (e.g., "Sunny, 25°C with a gentle breeze") and a 'dressCode' (e.g., "Light cotton shirt, shorts, and comfortable sandals. Don't forget sunglasses!"). This is a mandatory field for each day.
      - Provide a general, high-level weather summary for the whole trip in the main 'weather' field (e.g., "Expect warm and sunny days with cooler evenings.").
      - Provide a paragraph of essential travel 'notes' (e.g., currency, customs, what to pack).
      - Provide a list of 4-5 key 'inclusions' and 'exclusions'.

      **Accommodation Details:**
      - Suggest ONE specific, real accommodation that fits the user's preferences (budget, accommodation type).
      - Put this single accommodation object inside a JSON array.
      - Generate a unique UUID for its 'id'.
      - Provide its 'type' based on the user's preference (e.g., 'Hotel', 'Villa').
      - Provide its name, the check-in and check-out dates (based on the trip dates), the total estimated price in USD for the entire stay, a list of 3-4 key facilities (e.g., "Free WiFi", "Swimming Pool"), and a search query for a representative image (e.g., "Hilton Paris Opera hotel exterior").
      - Also provide the hotel's full address, star rating (e.g., 4.5), a suggested room type (e.g., "Deluxe King Room"), the board basis (e.g., "Breakfast Included"), a contact phone number, and its official website URL.

      **Transportation Details:**
      - If flights are requested, provide details for one logical round-trip flight option. Include a real airline, airport codes, departure/arrival times, and an estimated per-person price in USD.
      - If trains are requested, provide details for one logical train journey.
      - For other requested transport like bus, cab, ferry, or yacht, provide details under the 'other' array. For each, specify its type, a brief detail (e.g., "Private transfer from airport to hotel"), and an estimated price in USD.
      
      Return the output as a single JSON object that strictly follows the provided schema. Do not include any markdown formatting (e.g., \`\`\`json).

      User's Request:
      ---
      {{requestDetails}}
      ---
    `,
  },
  apiKey: 'AIzaSyAlufy7uCMrSxSXCLIkJmNjm5Q1epaCkR4',
  //apiKey: 'AIzaSyC-Fh1PHj1wfiS1vItIUZov86SOIexBThs', // Paste your API Key here
  cloudinary: environment.cloudinary
};

export type AppConfig = typeof APP_CONFIG;