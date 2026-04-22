export type LeadPriority = 'high' | 'medium' | 'low';

export interface Lead {
  id: string;
  businessName: string;
  businessType: string;
  city: string;
  state: string;
  phone?: string;
  website?: string;
  hasWebsite: boolean;
  websiteQuality: 'none' | 'social-only' | 'weak-builder' | 'average' | 'strong';
  rating?: number;
  reviewCount?: number;
  notes: string;
  score: number;
  priority: LeadPriority;
  tags: string[];
  createdAt: string;
}

export interface SearchInput {
  businessType: string;
  city: string;
  state: string;
  radiusMiles: number;
  keyword?: string;
}
