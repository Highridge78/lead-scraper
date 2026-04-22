import { getLeadProvider } from './providers';
import { classifyPriority, scoreLead, websiteQualityFromUrl } from './scoring';
import { saveLeads } from './leads-store';
import { Lead, SearchInput } from './types';

function makeLeadId(name: string, city: string, state: string) {
  return `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function dedupeByBusiness(leads: Lead[]) {
  const byId = new Map<string, Lead>();
  leads.forEach((lead) => {
    byId.set(lead.id, lead);
  });
  return Array.from(byId.values());
}

export async function searchAndSaveLeads(input: SearchInput): Promise<Lead[]> {
  const provider = getLeadProvider();
  const discovered = await provider.discover(input);

  const scored = dedupeByBusiness(
    discovered.map((business) => {
      const websiteQuality = websiteQualityFromUrl(business.website);
      const hasWebsite = Boolean(business.website);
      const { score, tags } = scoreLead({
        hasWebsite,
        websiteQuality,
        rating: business.rating,
        reviewCount: business.reviewCount,
      });

      const priority = classifyPriority(score);

      return {
        id: makeLeadId(business.name, business.city, business.state),
        businessName: business.name,
        businessType: input.businessType,
        city: business.city,
        state: business.state,
        phone: business.phone,
        website: business.website,
        hasWebsite,
        websiteQuality,
        rating: business.rating,
        reviewCount: business.reviewCount,
        score,
        priority,
        tags,
        notes: tags.length
          ? `Opportunity signals: ${tags.join(', ')}.`
          : 'Basic opportunity profile available.',
        createdAt: new Date().toISOString(),
      } satisfies Lead;
    })
  );

  await saveLeads(scored);
  return scored.sort((a, b) => b.score - a.score);
}
