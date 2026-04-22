import { AppShell } from '@/components/app-shell';
import { ClientsTable } from '@/components/clients-table';
import { listLeads } from '@/lib/leads-store';

export default async function ClientsPage() {
  const leads = await listLeads();

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
      <p className="mt-2 max-w-3xl text-zinc-400">
        Work this list daily: prioritize high-opportunity businesses, open lead details, and move them into active deals.
      </p>

      {leads.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-300">
          <p className="text-lg font-medium">No leads available for client workflow yet.</p>
          <p className="mt-2 text-zinc-400">Run a search first, then this page becomes your searchable pipeline foundation for detail and edit flows.</p>
        </div>
      ) : (
        <div className="mt-6">
          <ClientsTable leads={leads} />
        </div>
      )}
    </AppShell>
  );
}
