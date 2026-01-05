export interface CountryCode {
  code: string;
  country: string;
  limit: number;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', country: 'IN', limit: 10 },
  { code: '+1', country: 'US', limit: 10 },
  { code: '+44', country: 'UK', limit: 10 },
  { code: '+971', country: 'UAE', limit: 9 },
  { code: '+61', country: 'AU', limit: 9 },
  { code: '+81', country: 'JP', limit: 10 },
  { code: '+49', country: 'DE', limit: 11 },
];
