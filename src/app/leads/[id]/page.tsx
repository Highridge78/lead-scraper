import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { AiTools } from '@/components/ai-tools';
import { PriorityBadge } from '@/components/priority-badge';
import { getLeadById } from '@/lib/leads-store';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-4">
        <Link href="/leads" className="text-sm text-zinc-400 hover:text-zinc-200">← Back to leads</Link>
      </div>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{lead.businessName}</h1>
            <p className="mt-1 text-zinc-400">{lead.businessType} • {lead.city}, {lead.state}</p>
          </div>
          <PriorityBadge priority={lead.priority} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Opportunity score</p>
            <p className="mt-1 text-2xl font-semibold">{lead.score}</p>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Website profile</p>
            <p className="mt-1 text-lg font-semibold">{lead.websiteQuality}</p>
            <p className="mt-1 text-sm text-zinc-400">{lead.website ?? 'No website found'}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">Phone</p>
            <p className="font-medium">{lead.phone ?? 'Not available'}</p>
            <p className="mt-3 text-sm text-zinc-400">Rating / Reviews</p>
            <p className="font-medium">{lead.rating ?? 'Unknown'} / {lead.reviewCount ?? 'Unknown'}</p>
          </div>
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-4">
            <p className="text-sm text-zinc-400">Notes</p>
            <p className="mt-1 text-zinc-200">{lead.notes}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-zinc-600 px-2 py-1 text-xs text-zinc-300">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <AiTools leadId={lead.id} />
      </div>
    </AppShell>
  );
}
