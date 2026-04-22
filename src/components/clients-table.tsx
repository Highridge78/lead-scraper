'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/lib/types';
import { PriorityBadge } from './priority-badge';

export function ClientsTable({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) =>
      [lead.businessName, lead.city, lead.state, lead.businessType].join(' ').toLowerCase().includes(q)
    );
  }, [leads, query]);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Client / lead list</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by business, city, or type"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm md:w-80"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-400">
          No matches yet. Try another search term or run a new lead search.
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-800">
          {filtered.map((lead) => (
            <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{lead.businessName}</p>
                <p className="text-sm text-zinc-400">{lead.businessType} • {lead.city}, {lead.state}</p>
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={lead.priority} />
                <Link href={`/leads/${lead.id}`} className="text-sm text-orange-300 hover:text-orange-200">Open</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
