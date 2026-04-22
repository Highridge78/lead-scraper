import { Lead, LeadPriority } from './types';

export function classifyPriority(score: number): LeadPriority {
  if (score >= 75) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

export function websiteQualityFromUrl(website?: string): Lead['websiteQuality'] {
  if (!website) return 'none';

  const normalized = website.toLowerCase();

  if (
    normalized.includes('facebook.com') ||
    normalized.includes('instagram.com') ||
    normalized.includes('yelp.com')
  ) {
    return 'social-only';
  }

  if (
    normalized.includes('wixsite.com') ||
    normalized.includes('weebly.com') ||
    normalized.includes('sites.google.com')
  ) {
    return 'weak-builder';
  }

  return 'average';
}

export function scoreLead(input: {
  hasWebsite: boolean;
  websiteQuality: Lead['websiteQuality'];
  rating?: number;
  reviewCount?: number;
}): { score: number; tags: string[] } {
  let score = 0;
  const tags: string[] = [];

  if (!input.hasWebsite) {
    score += 45;
    tags.push('No website');
  }

  if (input.websiteQuality === 'social-only') {
    score += 35;
    tags.push('Social-only presence');
  }

  if (input.websiteQuality === 'weak-builder') {
    score += 20;
    tags.push('Weak site builder');
  }

  if (typeof input.reviewCount === 'number') {
    if (input.reviewCount < 20) {
      score += 15;
      tags.push('Low review count');
    } else if (input.reviewCount < 60) {
      score += 8;
    }
  } else {
    score += 10;
    tags.push('Missing review data');
  }

  if (typeof input.rating === 'number') {
    if (input.rating < 4.2) {
      score += 15;
      tags.push('Low rating');
    } else if (input.rating < 4.5) {
      score += 8;
    }
  }

  if (input.hasWebsite && input.websiteQuality === 'average') {
    score += 5;
    tags.push('Likely weak conversion structure');
  }

  return { score: Math.min(score, 100), tags };
}
