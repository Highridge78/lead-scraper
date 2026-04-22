import { LeadPriority } from '@/lib/types';

const styles: Record<LeadPriority, string> = {
  high: 'bg-red-500/20 text-red-300 border-red-400/40',
  medium: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  low: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
};

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${styles[priority]}`}>
      {priority}
    </span>
  );
}
