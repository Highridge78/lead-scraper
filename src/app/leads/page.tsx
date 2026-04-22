import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PriorityBadge } from '@/components/priority-badge';
import { listLeads } from '@/lib/leads-store';

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Leads</h1>
      <p className="mt-2 text-zinc-400">Saved opportunities from your searches.</p>

      {leads.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-300">
          <p className="text-lg font-medium">No leads saved yet.</p>
          <p className="mt-2 text-zinc-400">Run a new search to populate this pipeline with local businesses.</p>
          <Link href="/new" className="mt-4 inline-block rounded-lg bg-orange-500 px-4 py-2 font-medium text-black hover:bg-orange-400">
            Start new search
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800 bg-zinc-900 text-sm">
            <thead className="bg-zinc-950 text-left text-zinc-400">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{lead.businessName}</div>
                    <div className="text-zinc-400">{lead.businessType}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{lead.city}, {lead.state}</td>
                  <td className="px-4 py-3 font-semibold">{lead.score}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/leads/${lead.id}`} className="text-orange-300 hover:text-orange-200">
                      View details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
