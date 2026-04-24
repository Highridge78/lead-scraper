"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types";
import { ArrowLeft, Search } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-zinc-400 text-center text-lg animate-pulse uppercase tracking-widest font-black">Loading Leads...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-orange-500 mb-4 transition-colors">
              <ArrowLeft size={14} />
              Return to Home
            </Link>
            <h1 className="text-5xl font-black tracking-tight text-white italic">Lead Pipeline</h1>
          </div>
          
          <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
             <input type="text" placeholder="Search pipeline..." className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-orange-500/50 w-full md:w-[320px] text-sm font-bold uppercase tracking-widest transition-all" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[3rem] border border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-3xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
                <th className="px-8 py-6">Business Entity</th>
                <th className="px-8 py-6">Current Status</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6">Vitals Score</th>
                <th className="px-8 py-6 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {leads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-zinc-800/40 transition-colors">
                  <td className="px-8 py-6">
                     <span className="text-lg font-black text-white group-hover:text-orange-400 transition-colors tracking-tight">{lead.business_name || "N/A"}</span>
                     <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-1">{lead.city}, {lead.state}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] ${
                      lead.status === "new" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : 
                      lead.status === "contacted" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                      lead.status === "qualified" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                      "bg-zinc-800 text-zinc-500 border border-zinc-700"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      lead.priority === "high" ? "text-red-500" :
                      lead.priority === "medium" ? "text-amber-500" :
                      "text-zinc-600"
                    }`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="h-1.5 w-12 bg-zinc-800 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-500" style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-sm font-black text-zinc-400 italic">{lead.score || 0}</span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex px-6 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-orange-500/50 transition-all shadow-xl active:scale-95"
                    >
                      Audit Record
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
