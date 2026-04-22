import { listLeads } from '@/lib/leads-store';

export async function GET() {
  const leads = await listLeads();
  return Response.json({
    count: leads.length,
    leads,
  });
}
