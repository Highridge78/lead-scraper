import { z } from 'zod';
import { searchAndSaveLeads } from '@/lib/search-service';

const searchSchema = z.object({
  businessType: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(40),
  radiusMiles: z.coerce.number().int().min(1).max(100),
  keyword: z.string().max(80).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = searchSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid search input', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const leads = await searchAndSaveLeads(parsed.data);
    return Response.json({
      count: leads.length,
      leads: leads.map((lead) => ({
        id: lead.id,
        name: lead.businessName,
        score: lead.score,
        classification: lead.priority,
      })),
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search leads',
      },
      { status: 500 }
    );
  }
}
