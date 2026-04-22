import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PriorityBadge } from '@/components/priority-badge';
import { listLeads } from '@/lib/leads-store';

export default async function DashboardPage() {
  const leads = await listLeads();
  const highPriority = leads.filter((lead) => lead.priority === 'high');
  const avgScore = leads.length ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0;

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-zinc-400">Daily lead operations for local service-business outreach.</p>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total leads</p>
          <p className="mt-2 text-3xl font-semibold">{leads.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">High-priority leads</p>
          <p className="mt-2 text-3xl font-semibold">{highPriority.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Average score</p>
          <p className="mt-2 text-3xl font-semibold">{avgScore}</p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent leads</h2>
            <Link href="/leads" className="text-sm text-orange-300 hover:text-orange-200">View all</Link>
          </div>

          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">No leads yet. Start with a new search to populate the dashboard.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead.id} className="rounded-lg border border-zinc-700 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{lead.businessName}</span>
                    <PriorityBadge priority={lead.priority} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{lead.city}, {lead.state} • score {lead.score}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">High-priority pipeline</h2>
          {highPriority.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">No high-priority leads yet. Run a search for roofers, landscapers, or plumbers in your target city.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {highPriority.slice(0, 6).map((lead) => (
                <li key={lead.id} className="rounded-lg border border-zinc-700 p-3">
                  <p className="font-medium">{lead.businessName}</p>
                  <p className="mt-1 text-sm text-zinc-400">{lead.tags.join(' • ') || 'Needs web presence improvements'}</p>
                  <Link href={`/leads/${lead.id}`} className="mt-2 inline-block text-sm text-orange-300 hover:text-orange-200">Open lead details →</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
