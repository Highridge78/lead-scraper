'use client';

import { useState } from 'react';

interface SearchResponse {
  count: number;
  leads: Array<{ name: string; score: number; classification: string }>;
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
    <main className="card">
      <h1>New Lead Search</h1>
      <form action={onSubmit} style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        <input name="businessType" placeholder="Business type (e.g. Roofing)" required />
        <input name="city" placeholder="City" required />
        <input name="state" placeholder="State" required />
        <input name="radiusMiles" type="number" min={1} max={100} defaultValue={10} required />
        <input name="keyword" placeholder="Optional keyword" />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search and Save Leads'}
        </button>
      </form>

      {error && <p style={{ color: '#f87171', marginTop: '1rem' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Saved {result.count} leads</h2>
          <ul>
            {result.leads.map((lead) => (
              <li key={`${lead.name}-${lead.score}`}>
                {lead.name} — {lead.classification} ({lead.score})
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
