import { z } from 'zod';
import { generateLeadAiText } from '@/lib/ai-service';
import { getLeadById } from '@/lib/leads-store';

const schema = z.object({
  leadId: z.string().min(1),
  task: z.enum(['summary', 'score-explanation', 'outreach']),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const lead = await getLeadById(parsed.data.leadId);
  if (!lead) {
    return Response.json({ error: 'Lead not found' }, { status: 404 });
  }

  const result = await generateLeadAiText(lead, parsed.data.task);

  return Response.json({
    text: result.text,
    usedFallback: result.usedFallback,
  });
}
