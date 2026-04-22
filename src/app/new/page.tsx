'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';

interface SearchResponse {
  count: number;
  leads: Array<{ id: string; name: string; score: number; classification: string }>;
}

export default function NewSearchPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const payload = {
      businessType: formData.get('businessType'),
      city: formData.get('city'),
      state: formData.get('state'),
      radiusMiles: formData.get('radiusMiles'),
      keyword: formData.get('keyword') || undefined,
    };

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Unknown API error' }));
      setError(body.error ?? 'Search failed');
      setLoading(false);
      return;
    }

    const body = (await res.json()) as SearchResponse;
    setResult(body);
    setLoading(false);
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">New Lead Search</h1>
      <p className="mt-2 max-w-3xl text-zinc-400">
        Search local service businesses, score opportunity quality, and save leads for follow-up.
      </p>

      <form action={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-zinc-300">
          Business type
          <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" name="businessType" placeholder="Roofing" required />
        </label>
        <label className="grid gap-2 text-sm text-zinc-300">
          City
          <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" name="city" placeholder="Nashville" required />
        </label>
        <label className="grid gap-2 text-sm text-zinc-300">
          State
          <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" name="state" placeholder="TN" required />
        </label>
        <label className="grid gap-2 text-sm text-zinc-300">
          Radius (miles)
          <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" name="radiusMiles" type="number" min={1} max={100} defaultValue={10} required />
        </label>
        <label className="grid gap-2 text-sm text-zinc-300 md:col-span-2">
          Keyword (optional)
          <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" name="keyword" placeholder="emergency repairs" />
        </label>

        <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center rounded-lg bg-orange-500 px-4 font-medium text-black hover:bg-orange-400 disabled:opacity-60">
          {loading ? 'Searching...' : 'Search and Save Leads'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-300">{error}</p>}

      {result && (
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold">Saved {result.count} leads</h2>
          <ul className="mt-4 grid gap-3">
            {result.leads.map((lead) => (
              <li key={lead.id} className="rounded-lg border border-zinc-700 p-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between gap-3">
                  <span>{lead.name}</span>
                  <span className="text-zinc-400">
                    {lead.classification} ({lead.score})
                  </span>
                </div>
                <Link href={`/leads/${lead.id}`} className="mt-2 inline-block text-orange-300 hover:text-orange-200">
                  Open lead details →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
