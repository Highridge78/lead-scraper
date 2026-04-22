'use client';

import { useState } from 'react';

const tasks = [
  { key: 'summary', label: 'Generate lead summary' },
  { key: 'score-explanation', label: 'Explain lead score' },
  { key: 'outreach', label: 'Draft outreach message' },
] as const;

export function AiTools({ leadId }: { leadId: string }) {
  const [output, setOutput] = useState<string>('');
  const [loadingTask, setLoadingTask] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');

  async function runTask(task: (typeof tasks)[number]['key']) {
    setLoadingTask(task);
    setNote('');
    const res = await fetch('/api/ai/lead-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, task }),
    });
    const body = await res.json();
    if (!res.ok) {
      setOutput('');
      setNote(body.error ?? 'AI request failed');
      setLoadingTask(null);
      return;
    }

    setOutput(body.text);
    setNote(body.usedFallback ? 'Using built-in fallback output (AI key unavailable or request failed).' : 'Generated with AI.');
    setLoadingTask(null);
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-xl font-semibold">AI tools</h2>
      <p className="mt-2 text-sm text-zinc-400">Create summaries, score explanations, and first-pass outreach drafts.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tasks.map((task) => (
          <button
            key={task.key}
            onClick={() => runTask(task.key)}
            disabled={Boolean(loadingTask)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
          >
            {loadingTask === task.key ? 'Working…' : task.label}
          </button>
        ))}
      </div>

      {note && <p className="mt-4 text-sm text-zinc-400">{note}</p>}
      {output && (
        <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-200">
          {output}
        </pre>
      )}
    </section>
  );
}
