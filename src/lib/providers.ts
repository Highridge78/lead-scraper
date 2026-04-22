import { SearchInput } from './types';

export interface DiscoveredBusiness {
  name: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
}

export interface LeadProvider {
  discover(input: SearchInput): Promise<DiscoveredBusiness[]>;
}

function slug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class MockLeadProvider implements LeadProvider {
  async discover(input: SearchInput): Promise<DiscoveredBusiness[]> {
    const keywordText = input.keyword ? `${input.keyword} ` : '';
    return [
      {
        name: `${input.city} ${input.businessType} Pros`,
        city: input.city,
        state: input.state,
        phone: '(555) 201-1001',
        website: undefined,
        rating: 4,
        reviewCount: 12,
      },
      {
        name: `${input.city} ${input.businessType} & Sons`,
        city: input.city,
        state: input.state,
        phone: '(555) 201-1002',
        website: `https://facebook.com/${slug(input.city)}${slug(input.businessType)}`,
        rating: 4.3,
        reviewCount: 22,
      },
      {
        name: `${keywordText}${input.businessType} Experts of ${input.city}`,
        city: input.city,
        state: input.state,
        phone: '(555) 201-1003',
        website: `https://${slug(input.city)}-${slug(input.businessType)}.wixsite.com/home`,
        rating: 4.1,
        reviewCount: 9,
      },
      {
        name: `Prime ${input.businessType} ${input.city}`,
        city: input.city,
        state: input.state,
        phone: '(555) 201-1004',
        website: `https://prime-${slug(input.businessType)}-${slug(input.city)}.com`,
        rating: 4.7,
        reviewCount: 130,
      },
    ];
  }
}

export class GooglePlacesProvider implements LeadProvider {
  constructor(private readonly apiKey: string) {}

  async discover(input: SearchInput): Promise<DiscoveredBusiness[]> {
    const textQuery = `${input.businessType} in ${input.city}, ${input.state} ${input.keyword ?? ''}`.trim();
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
        'X-Goog-FieldMask':
          'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({ textQuery, maxResultCount: 20 }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Google Places API error (${response.status})`);
    }

    const payload = (await response.json()) as {
      places?: Array<{
        displayName?: { text?: string };
        formattedAddress?: string;
        nationalPhoneNumber?: string;
        websiteUri?: string;
        rating?: number;
        userRatingCount?: number;
      }>;
    };

    return (payload.places ?? []).map((place) => ({
      name: place.displayName?.text ?? 'Unknown business',
      city: input.city,
      state: input.state,
      phone: place.nationalPhoneNumber,
      website: place.websiteUri,
      rating: place.rating,
      reviewCount: place.userRatingCount,
    }));
  }
}

export function getLeadProvider(): LeadProvider {
  const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (googlePlacesApiKey) {
    return new GooglePlacesProvider(googlePlacesApiKey);
  }

  return new MockLeadProvider();
}
