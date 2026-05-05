declare module 'connect-pg-simple';

// Add a new interface for company branding details
export interface CompanyBranding {
  id: number;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  foundedYear: number;
  headquarters: string;
  website: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  size: string;
  industry: string;
  cultureDescription: string;
  benefits: string[];
}
