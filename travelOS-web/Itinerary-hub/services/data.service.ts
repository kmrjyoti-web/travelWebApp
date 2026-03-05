import { Injectable } from '@angular/core';
import { TourCategory, TourCategoryItem } from '../models/itinerary.model';
// Importing LocationDetails and Itinerary for strict typing in filter methods
import { LocationDetails, Itinerary } from '../models/itinerary.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tourCategories: TourCategory[] = [];
  private rawCsvData = `
11111111-1111-1111-1111-101111111101,SEAS-TOUR,SEAS-TOUR,SEAS-SUMR,11111111-1111-1111-1111-111111111110,Summer Special,Tours planned for the summer season including hill stations and cool retreats,a,a,a,a,a,SEAS + SUMmeR,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111102,SEAS-TOUR,SEAS-TOUR,SEAS-WINT,11111111-1111-1111-1111-111111111110,Winter Wonderland,"Snowy getaways, skiing destinations, and winter festivals",a,a,a,a,a,SEAS + WINTer,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111103,SEAS-TOUR,SEAS-TOUR,SEAS-MONS,11111111-1111-1111-1111-111111111110,Monsoon Magic,"Lush green destinations during the rainy season, waterfalls, treks",a,a,a,a,a,SEAS + MONSoon,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111104,SEAS-TOUR,SEAS-TOUR,SEAS-SPRG,11111111-1111-1111-1111-111111111110,Spring Blossom,"Floral valleys, seasonal gardens, and festival-themed tours",a,a,a,a,a,SEAS + SPRinG,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111105,SEAS-TOUR,SEAS-TOUR,SEAS-AUTM,11111111-1111-1111-1111-111111111110,Autumn Trails,"Golden landscapes, harvest festivals, and serene retreats",a,a,a,a,a,SEAS + AUTuMn,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111106,SEAS-TOUR,SEAS-TOUR,SEAS-FEST,11111111-1111-1111-1111-111111111110,Festive Season,"Packages focused around Diwali, Christmas, Eid, Holi, etc.",a,a,a,a,a,SEAS + FESTival,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111107,SEAS-TOUR,SEAS-TOUR,SEAS-NEWY,11111111-1111-1111-1111-111111111110,New Year Special,Year-end and New Year celebrations at popular destinations,a,a,a,a,a,SEAS + NEW Year,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111108,SEAS-TOUR,SEAS-TOUR,SEAS-SCHL,11111111-1111-1111-1111-111111111110,School Vacation,Designed for families during summer or winter school holidays,a,a,a,a,a,SEAS + SCHooL Break,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-101111111109,SEAS-TOUR,SEAS-TOUR,SEAS-LONG,11111111-1111-1111-1111-111111111110,Long Weekend Getaways,Optimized tours for extended public holiday weekends,a,a,a,a,a,SEAS + LONG weekend,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111101,EXPE-FOOD,EXPE-FOOD,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Food & Culinary Trail,"Local food walks, tasting tours, culinary classes",a,a,a,a,a,EXPE + FOOD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111102,EXPE-WILD,EXPE-WILD,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Wildlife Safari,"Jungle safaris, nature exploration, forest stays",a,a,a,a,a,EXPE + WILDlife,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111103,EXPE-HERI,EXPE-HERI,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Heritage Walks,City walking tours focused on architecture and history,a,a,a,a,a,EXPE + HERItage,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111104,EXPE-ADVN,EXPE-ADVN,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Adventure Sports,"Bungee, rafting, paragliding, skiing",a,a,a,a,a,EXPE + ADVeNture,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111105,EXPE-WELL,EXPE-WELL,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Wellness & Spa Retreat,Ayurvedic/spa retreat experiences,a,a,a,a,a,EXPE + WELLness,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111106,EXPE-PHOTO,EXPE-PHOTO,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Photography Expeditions,"Tours focused on capturing landscapes, wildlife, culture",a,a,a,a,a,EXPE + PHOTOgraphy,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111107,EXPE-RURL,EXPE-RURL,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Village Life & Rural Stay,"Live in villages, farming, craft, and folk culture",a,a,a,a,a,EXPE + RURaL,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111108,EXPE-CYCL,EXPE-CYCL,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Cycling Trails,Scenic cycling trips through trails and countryside,a,a,a,a,a,EXPE + CYCLe,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111109,EXPE-CRUI,EXPE-CRUI,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Cruise Experience,"River, sea, or luxury cruise journeys",a,a,a,a,a,EXPE + CRUIses,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111110,EXPE-CAMP,EXPE-CAMP,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Camping & Stargazing,Nature camp stays with night sky/stargazing activities,a,a,a,a,a,EXPE + CAMPing,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111111,EXPE-ARTC,EXPE-ARTC,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Art & Culture Immersion,"Hands-on local art, painting, dance, and music experiences",a,a,a,a,a,EXPE + ART + Culture,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-111111111112,EXPE-DESR,EXPE-DESR,EXPE-TOUR,11111111-1111-1111-1111-111111111101,Desert Safari,"Camel safaris, dune rides, bonfire in desert",a,a,a,a,a,EXPE + DESert Ride,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111101,SPTO-LUXE,SPTO-LUXE,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Luxury Tours,"High-end travel with 5-star stays, curated dining, private guides",a,a,a,a,a,SPTO + LUXE,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111102,SPTO-WILD,SPTO-WILD,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Wildlife & Jungle Tours,Safari-based and eco-tourism with forest lodges,a,a,a,a,a,SPTO + WILD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111103,SPTO-MEDI,SPTO-MEDI,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Medical & Wellness Tours,"Ayurveda, yoga retreats, medical treatment abroad",a,a,a,a,a,SPTO + MEDIcal,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111104,SPTO-WEDH,SPTO-WEDH,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Wedding & Honeymoon Tours,"Custom itineraries for weddings, honeymoon destinations",a,a,a,a,a,SPTO + WEDHoneymoon,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111105,SPTO-CRUI,SPTO-CRUI,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Cruise Vacations,"River, luxury, or adventure cruises",a,a,a,a,a,SPTO + CRUIses,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111106,SPTO-FILM,SPTO-FILM,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Film Tourism,"Visit movie shooting locations, Bollywood/Hollywood trails",a,a,a,a,a,SPTO + FILM,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111107,SPTO-SENI,SPTO-SENI,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Senior Citizen Friendly Tours,"Slow-paced, medically assisted trips for elderly travelers",a,a,a,a,a,SPTO + SENIor,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111108,SPTO-PETS,SPTO-PETS,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Pet-friendly Tours,Vacations designed for pet owners and their pets,a,a,a,a,a,SPTO + PETS,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111109,SPTO-DIVY,SPTO-DIVY,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Accessible/Divyang Tours,Barrier-free tours with assistance for differently-abled persons,a,a,a,a,a,SPTO + DIVYangjan,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111110,SPTO-GOLF,SPTO-GOLF,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Golf Holidays,Stay & play packages at iconic golf destinations,a,a,a,a,a,SPTO + GOLF,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111111,SPTO-MICE,SPTO-MICE,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Business & MICE Tours,"Meetings, Incentives, Conferences, and Exhibitions travel",a,a,a,a,a,SPTO + MICE,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111112,SPTO-EDU,SPTO-EDU,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Educational / Study Tours,"School, college, and research-based educational travel",a,a,a,a,a,SPTO + EDUcation,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111113,SPTO-HAND,SPTO-HAND,SPEC-TOUR,11111111-1111-1111-1111-111111111102,Textile & Craft Tours,"Tours to explore regional textiles, weaving, handicraft villages",a,a,a,a,a,SPTO + HANDicrafts,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-211111111114,SPTO-RAIN,SPTO-RAIN,SPEC-TOUR,11111111-1111-1111-1111-111111111102,LGBT+ Friendly Tours,Inclusively curated experiences for LGBTQ+ travelers,a,a,a,a,a,SPTO + RAINbow,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111101,THME-ADVN,THME-ADVN,THME-TOUR,11111111-1111-1111-1111-111111111103,Adventure Theme,"Covers activities like trekking, rafting, skiing, paragliding",a,a,a,a,a,THME + ADVeNture,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111102,THME-CULT,THME-CULT,THME-TOUR,11111111-1111-1111-1111-111111111103,Cultural Theme,"Traditional arts, music, festivals, and heritage experiences",a,a,a,a,a,THME + CULTure,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111103,THME-NATR,THME-NATR,THME-TOUR,11111111-1111-1111-1111-111111111103,Nature & Eco Theme,"Eco-trails, forest stays, birdwatching, eco-friendly travel",a,a,a,a,a,THME + NATuRe,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111104,THME-BEAC,THME-BEAC,THME-TOUR,11111111-1111-1111-1111-111111111103,Beach & Island Theme,"Island getaways, beach resorts, coastal relaxation",a,a,a,a,a,THME + BEACh,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111105,THME-SPIR,THME-SPIR,THME-TOUR,11111111-1111-1111-1111-111111111103,Spiritual Theme,"Pilgrimages, meditation tours, spiritual learning",a,a,a,a,a,THME + SPIRitual,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111106,THME-FEST,THME-FEST,THME-TOUR,11111111-1111-1111-1111-111111111103,Festival Theme,Special tours during regional or national festivals,a,a,a,a,a,THME + FESTival,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111107,THME-HIST,THME-HIST,THME-TOUR,11111111-1111-1111-1111-111111111103,Historical Theme,"Focus on forts, ruins, ancient temples, and historical routes",a,a,a,a,a,THME + HISTory,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111108,THME-ROMN,THME-ROMN,THME-TOUR,11111111-1111-1111-1111-111111111103,Romantic Theme,"Honeymoon, couple getaways, candlelight packages",a,a,a,a,a,THME + ROMaNtic,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111109,THME-LUXE,THME-LUXE,THME-TOUR,11111111-1111-1111-1111-111111111103,Luxury Theme,"Top-end travel with private charters, villas, and gourmet dining",a,a,a,a,a,THME + LUXE,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111110,THME-PHOTO,THME-PHOTO,THME-TOUR,11111111-1111-1111-1111-111111111103,Photography Theme,Capture-focused tours to scenic and exotic places,a,a,a,a,a,THME + PHOTOgraphy,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111111,THME-WILD,THME-WILD,THME-TOUR,11111111-1111-1111-1111-111111111103,Wildlife Theme,"Animal safaris, jungle treks, nature reserve tours",a,a,a,a,a,THME + WILDlife,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-311111111112,THME-WELL,THME-WELL,THME-TOUR,11111111-1111-1111-1111-111111111103,Wellness Theme,"Mind-body rejuvenation through Ayurveda, spa, yoga",a,a,a,a,a,THME + WELLness,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111101,SPIR-CHDH,SPIR-CHDH,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Char Dham Yatra,"Pilgrimage covering Yamunotri, Gangotri, Kedarnath, and Badrinath",a,a,a,a,a,SPIR + CHarDHam,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111102,SPIR-JYOT,SPIR-JYOT,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Jyotirlinga Darshan,Visit to the twelve sacred Jyotirlinga shrines of Lord Shiva,a,a,a,a,a,SPIR + JYOTirlinga,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111103,SPIR-SHAK,SPIR-SHAK,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Shakti Peeth Yatra,Tour to 51 Shakti Peeth temples across India,a,a,a,a,a,SPIR + SHAKti Peeth,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111104,SPIR-KAIL,SPIR-KAIL,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Kailash Mansarovar Yatra,Spiritual trek to Mount Kailash and Lake Mansarovar,a,a,a,a,a,SPIR + KAILash,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111105,SPIR-SOUT,SPIR-SOUT,SPIR-TOUR,11111111-1111-1111-1111-111111111104,South India Temple Tour,Explore ancient temples in Tamil Nadu and Kerala,a,a,a,a,a,SPIR + SOUThern Temples,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111106,SPIR-NORT,SPIR-NORT,SPIR-TOUR,11111111-1111-1111-1111-111111111104,North India Pilgrimage,"Includes Varanasi, Ayodhya, Mathura, Haridwar, and more",a,a,a,a,a,SPIR + NORTH,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111107,SPIR-BUDD,SPIR-BUDD,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Buddhist Circuit,"Covers Bodhgaya, Sarnath, Kushinagar, Lumbini, etc.",a,a,a,a,a,SPIR + BUDDhism,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111108,SPIR-SUFI,SPIR-SUFI,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Sufi & Dargah Tour,Visit famous Dargahs and Sufi shrines in India,a,a,a,a,a,SPIR + SUFI,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111109,SPIR-AMAR,SPIR-AMAR,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Amarnath Yatra,Holy cave pilgrimage in Jammu & Kashmir,a,a,a,a,a,SPIR + AMARnath,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111110,SPIR-JAGN,SPIR-JAGN,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Jagannath Yatra,Tour covering Puri Jagannath and nearby spiritual sites,a,a,a,a,a,SPIR + JAGaNnath,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111111,SPIR-VAIS,SPIR-VAIS,SPIR-TOUR,11111111-1111-1111-1111-111111111104,ISKCON & Vaishnav Tour,Tours to ISKCON temples and major Vaishnavite centers,a,a,a,a,a,SPIR + VAIShnav,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-411111111112,SPIR-RETR,SPIR-RETR,SPIR-TOUR,11111111-1111-1111-1111-111111111104,Spiritual Retreats,"Yoga, meditation, silence, and wellness retreats in spiritual settings",a,a,a,a,a,SPIR + RETReat,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111101,CATG-BUDG,CATG-BUDG,CATG-TOUR,11111111-1111-1111-1111-111111111105,Budget,Affordable tours focused on cost-effective travel and group sharing,a,a,a,a,a,CATG + BUDGet,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111102,CATG-STND,CATG-STND,CATG-TOUR,11111111-1111-1111-1111-111111111105,Standard,Balanced itinerary with standard stays and transport,a,a,a,a,a,CATG + STaNDard,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111103,CATG-DELX,CATG-DELX,CATG-TOUR,11111111-1111-1111-1111-111111111105,Deluxe,"Comfortable hotels, meals, and better logistics",a,a,a,a,a,CATG + DELuXe,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111104,CATG-LUXE,CATG-LUXE,CATG-TOUR,11111111-1111-1111-1111-111111111105,Luxury,"Premium stays, curated experiences, and private transfers",a,a,a,a,a,CATG + LUXE,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111105,CATG-PRIM,CATG-PRIM,CATG-TOUR,11111111-1111-1111-1111-111111111105,Premium,Top-tier services with exclusivity and customization,a,a,a,a,a,CATG + PRIMe,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111106,CATG-CSTM,CATG-CSTM,CATG-TOUR,11111111-1111-1111-1111-111111111105,Customised,Tours made per customer preferences,a,a,a,a,a,CATG + CuSToMised,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111107,CATG-FIXD,CATG-FIXD,CATG-TOUR,11111111-1111-1111-1111-111111111105,Fixed Departure,Pre-scheduled group departures with fixed itineraries,a,a,a,a,a,CATG + FIXeD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111108,CATG-SOLO,CATG-SOLO,CATG-TOUR,11111111-1111-1111-1111-111111111105,Solo Travel,Designed for solo travelers with safety and convenience,a,a,a,a,a,CATG + SOLO,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111109,CATG-WOMN,CATG-WOMN,CATG-TOUR,11111111-1111-1111-1111-111111111105,Women Only,"Women-centric safe, social, and engaging tours",a,a,a,a,a,CATG + WOMaN,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111110,CATG-SENI,CATG-SENI,CATG-TOUR,11111111-1111-1111-1111-111111111105,Senior Citizen,"Easy pace, medical support, and comfort for elderly travelers",a,a,a,a,a,CATG + SENIor,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111111,CATG-CORP,CATG-CORP,CATG-TOUR,11111111-1111-1111-1111-111111111105,Corporate/Business,"Tailored for business groups, MICE, incentives",a,a,a,a,a,CATG + CORPorate,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-511111111112,CATG-STUD,CATG-STUD,CATG-TOUR,11111111-1111-1111-1111-111111111105,Student/Educational,"Tours for schools, colleges, educational institutions",a,a,a,a,a,CATG + STUDent,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111101,TYPE-DOM,TYPE-DOM,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Domestic Tour,"Tour packages within the country, covering cities, states, and regions",a,a,a,a,a,TYPE + DOMestic,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111102,TYPE-INTL,TYPE-INTL,TYPE-TOUR,11111111-1111-1111-1111-111111111106,International Tour,Outbound tours to foreign destinations,a,a,a,a,a,TYPE + INTernationaL,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111103,TYPE-INBD,TYPE-INBD,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Inbound Tour,Packages for foreign tourists visiting your country,a,a,a,a,a,TYPE + INBounD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111104,TYPE-WKND,TYPE-WKND,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Weekend Getaway,"Short-duration trips near metro cities, ideal for weekends",a,a,a,a,a,TYPE + WEEKeND,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111105,TYPE-LONG,TYPE-LONG,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Long Haul Tour,Extended vacations across multiple cities/countries,a,a,a,a,a,TYPE + LONG,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111106,TYPE-ROAD,TYPE-ROAD,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Road Trip,Travel by private vehicle or bus across scenic or thematic routes,a,a,a,a,a,TYPE + ROAD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111107,TYPE-RAIL,TYPE-RAIL,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Rail Tour,Tour packages based on train journeys like luxury or scenic trains,a,a,a,a,a,TYPE + RAIL,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111108,TYPE-CRUI,TYPE-CRUI,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Cruise Tour,Packages centered around ocean or river cruises,a,a,a,a,a,TYPE + CRUIses,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111109,TYPE-FIXD,TYPE-FIXD,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Fixed Itinerary,Predefined tour plans with set schedules and inclusions,a,a,a,a,a,TYPE + FIXeD,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-611111111110,TYPE-FLEX,TYPE-FLEX,TYPE-TOUR,11111111-1111-1111-1111-111111111106,Flexible Itinerary,"Tours with customizable duration, hotels, and transport",a,a,a,a,a,TYPE + FLEXible,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111101,GRUP-FAM,GRUP-FAM,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Family Group,Tours specially designed for families with activities for all age groups,a,a,a,a,a,GRUP + FAMily,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111102,GRUP-CORP,GRUP-CORP,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Corporate Group,"Group tours for corporate outings, incentives, and team-building",a,a,a,a,a,GRUP + CORPorate,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111103,GRUP-SCHL,GRUP-SCHL,GRUP-TOUR,11111111-1111-1111-1111-111111111107,School Group,Educational and fun tours for school children,a,a,a,a,a,GRUP + SCHooL,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111104,GRUP-COLL,GRUP-COLL,GRUP-TOUR,11111111-1111-1111-1111-111111111107,College Group,Youth-oriented trips for college students,a,a,a,a,a,GRUP + COLLege,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111105,GRUP-WOMN,GRUP-WOMN,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Women Group,Safe and curated experiences for women travelers,a,a,a,a,a,GRUP + WOMaN,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111106,GRUP-SENI,GRUP-SENI,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Senior Citizens Group,"Slow-paced, comfortable trips for elderly travelers",a,a,a,a,a,GRUP + SENIor,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111107,GRUP-FRND,GRUP-FRND,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Friends Group,Fun and flexible packages for groups of friends,a,a,a,a,a,GRUP + FRieNDs,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111108,GRUP-PILG,GRUP-PILG,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Pilgrimage Group,Religious tours for communities or regional groups,a,a,a,a,a,GRUP + PILGrimage,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111109,GRUP-INCE,GRUP-INCE,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Incentive Group,"High-reward trips for employees, dealers, or partners",a,a,a,a,a,GRUP + INCEntive,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-711111111110,GRUP-CSTM,GRUP-CSTM,GRUP-TOUR,11111111-1111-1111-1111-111111111107,Customized Private Group,Tours created on-demand for any special group,a,a,a,a,a,GRUP + CuSToM,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111101,ACCM-BUDG,ACCM-BUDG,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Budget Stay,"Affordable accommodations like guesthouses, 2-star hotels, homestays",a,a,a,a,a,ACCM + BUDGet,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111102,ACCM-STND,ACCM-STND,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Standard Hotel,3-star hotels or equivalent with basic amenities,a,a,a,a,a,ACCM + STaNDard,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111103,ACCM-DELX,ACCM-DELX,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Deluxe Hotel,4-star properties offering upgraded comfort and services,a,a,a,a,a,ACCM + DELuXe,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111104,ACCM-LUXE,ACCM-LUXE,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Luxury Hotel,5-star hotels and luxury chains with premium facilities,a,a,a,a,a,ACCM + LUXE,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111105,ACCM-VILL,ACCM-VILL,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Villa Stay,"Private villas for families, groups, or couples",a,a,a,a,a,ACCM + VILLa,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111106,ACCM-REST,ACCM-REST,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Resort,Nature or beach resorts with all-inclusive options,a,a,a,a,a,ACCM + RESorT,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111107,ACCM-BOUT,ACCM-BOUT,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Boutique Stay,"Small, stylish hotels offering unique local experiences",a,a,a,a,a,ACCM + BOUTique,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111108,ACCM-HERI,ACCM-HERI,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Heritage Property,"Palaces, havelis, or heritage homes with cultural value",a,a,a,a,a,ACCM + HERItage,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111109,ACCM-TENT,ACCM-TENT,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Tent/Camp,"Camping or glamping setups in deserts, forests, or valleys",a,a,a,a,a,ACCM + TENT,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
11111111-1111-1111-1111-911111111110,ACCM-CRUI,ACCM-CRUI,ACCM-TOUR,11111111-1111-1111-1111-111111111109,Cruise Cabin,Cabin accommodation on luxury or river cruises,a,a,a,a,a,ACCM + CRUIses,a,a,a,a,a,,true,false,false,,2025-09-20 08:36:25.0000000,,,,,,,,
  `;

  private masterCategories = [
    { id: '11111111-1111-1111-1111-111111111110', name: 'Seasonal', code: 'SEAS-TOUR' },
    { id: '11111111-1111-1111-1111-111111111101', name: 'Experiences', code: 'EXPE-TOUR' },
    { id: '11111111-1111-1111-1111-111111111102', name: 'Speciality Tours', code: 'SPEC-TOUR' },
    { id: '11111111-1111-1111-1111-111111111103', name: 'Theme', code: 'THME-TOUR' },
    { id: '11111111-1111-1111-1111-111111111104', name: 'Spiritual', code: 'SPIR-TOUR' },
    { id: '11111111-1111-1111-1111-111111111105', name: 'Category', code: 'CATG-TOUR' },
    { id: '11111111-1111-1111-1111-111111111106', name: 'Type', code: 'TYPE-TOUR' },
    { id: '11111111-1111-1111-1111-111111111107', name: 'Group', code: 'GRUP-TOUR' },
    { id: '11111111-1111-1111-1111-111111111109', name: 'Accommodation', code: 'ACCM-TOUR' }
  ];

  constructor() {
    this.parseCsvData();
  }

  private parseCsvData() {
    const lines = this.rawCsvData.trim().split('\n');
    const itemsByMasterId: { [key: string]: TourCategoryItem[] } = {};

    lines.forEach(line => {
      // Very basic CSV parsing, assuming no commas within quoted fields
      const parts = line.split(',');
      if (parts.length > 6) {
        const masterId = parts[4];
        const master = this.masterCategories.find(m => m.id === masterId);
        
        // Seasonal items use parts[3] as code, others use parts[1] (mnemonic)
        let itemCode = parts[3];
        if (master && master.code !== 'SEAS-TOUR') {
          itemCode = parts[1];
        }

        const item: TourCategoryItem = {
          id: parts[0],
          name: parts[5].replace(/"/g, ''),
          description: parts[6].replace(/"/g, ''),
          code: itemCode
        };

        if (!itemsByMasterId[masterId]) {
          itemsByMasterId[masterId] = [];
        }
        itemsByMasterId[masterId].push(item);
      }
    });

    this.tourCategories = this.masterCategories.map(master => ({
      ...master,
      items: itemsByMasterId[master.id] || []
    }));
  }

  getTourCategories(): TourCategory[] {
    return this.tourCategories;
  }

  // --- New Filtering & Search Logic ---

  private masterLocationMap = {
    countries: new Map<string, string>(), // code -> name
    states: new Map<string, string>(),    // code -> name
    cities: new Map<string, string>()     // code -> name
  };

  /**
   * Extracts unique location codes from an itinerary and updates the master map.
   * Returns a summary of codes found in this specific itinerary.
   */
  extractLocationFilters(itinerary: any): { countryCodes: string[], stateCodes: string[], cityCodes: string[] } {
    const countries = new Set<string>();
    const states = new Set<string>();
    const cities = new Set<string>();

    const processLocation = (loc?: any) => {
      if (!loc) return;
      if (loc.countryCode) {
        countries.add(loc.countryCode);
        this.masterLocationMap.countries.set(loc.countryCode, loc.country || loc.countryCode);
      }
      if (loc.stateCode) {
        states.add(loc.stateCode);
        this.masterLocationMap.states.set(loc.stateCode, loc.state || loc.stateCode);
      }
      if (loc.cityCode) {
        cities.add(loc.cityCode);
        this.masterLocationMap.cities.set(loc.cityCode, loc.city || loc.cityCode);
      }
    };

    // Traverse days and activities
    if (itinerary.days) {
      itinerary.days.forEach((day: any) => {
        if (day.activities) {
          day.activities.forEach((activity: any) => {
            processLocation(activity.locationDetails);
          });
        }
        if (day.nearbyPlaces) {
          day.nearbyPlaces.forEach((place: any) => {
            processLocation(place.locationDetails);
          });
        }
      });
    }

    return {
      countryCodes: Array.from(countries),
      stateCodes: Array.from(states),
      cityCodes: Array.from(cities)
    };
  }

  /**
   * Powerful search/filter for packages/itineraries.
   * Currently filters specific activities within an itinerary based on location criteria.
   * Can be extended to filter a list of itineraries.
   */
  filterItineraryActivities(itinerary: any, filters: { countryCode?: string, stateCode?: string, cityCode?: string, category?: string }) {
    if (!itinerary || !itinerary.days) return itinerary;

    // Deep copy to avoid mutating original if needed, or filter in place (returning new structure here)
    const filteredDays = itinerary.days.map((day: any) => {
      const filteredActivities = (day.activities || []).filter((activity: any) => {
        const loc = activity.locationDetails || {};
        const matchesCountry = filters.countryCode ? loc.countryCode === filters.countryCode : true;
        const matchesState = filters.stateCode ? loc.stateCode === filters.stateCode : true;
        const matchesCity = filters.cityCode ? loc.cityCode === filters.cityCode : true;
        const matchesCategory = filters.category ? activity.activityType === filters.category : true;

        return matchesCountry && matchesState && matchesCity && matchesCategory;
      });

      if (filteredActivities.length > 0) {
        return { ...day, activities: filteredActivities };
      }
      return null;
    }).filter((day: any) => day !== null);

    return { ...itinerary, days: filteredDays };
  }

  getAllLocations() {
    return {
      countries: Array.from(this.masterLocationMap.countries.entries()).map(([code, name]) => ({ code, name })),
      states: Array.from(this.masterLocationMap.states.entries()).map(([code, name]) => ({ code, name })),
      cities: Array.from(this.masterLocationMap.cities.entries()).map(([code, name]) => ({ code, name }))
    };
  }
}
