"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types";
import { ArrowRight, Clock, Target, Users } from "lucide-react";

export default function DashboardPage() {
  const [leadsNeedingAttention, setLeadsNeedingAttention] = useState<Lead[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, followUps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data: Lead[]) => {
        const attention = data.filter(l => 
          (l.priority === "high" && l.status !== "closed" && l.status !== "lost") ||
          l.status === "follow up" ||
          l.status === "new"
        );
        
        setLeadsNeedingAttention(attention.slice(0, 10)); 
        setStats({
          total: data.length,
          new: data.filter(l => l.status === "new").length,
          followUps: data.filter(l => l.status === "follow up").length
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-zinc-400 text-center text-lg font-bold animate-pulse uppercase tracking-[0.3em]">Opening Dashboard...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <h1 className="text-5xl font-black tracking-tight text-white">Sales Dashboard</h1>
          <div className="mt-3 flex items-center gap-3">
             <div className="h-1.5 w-12 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">High Ridge Web Design • Lead Finder</p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 mb-16">
          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors shadow-2xl">
            <div className="flex items-center gap-3 text-zinc-500 mb-6">
              <Users size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Total Pipeline</span>
            </div>
            <span className="text-6xl font-black text-white tracking-tighter">{stats.total}</span>
          </div>
          <div className="rounded-[2rem] border border-orange-500/10 bg-orange-500/5 p-8 hover:border-orange-500/30 transition-colors shadow-2xl">
            <div className="flex items-center gap-3 text-orange-500 mb-6">
              <Target size={20} />
              <span className="text-xs font-black uppercase tracking-widest">New Opportunities</span>
            </div>
            <span className="text-6xl font-black text-orange-500 tracking-tighter">{stats.new}</span>
          </div>
          <div className="rounded-[2rem] border border-blue-500/10 bg-blue-500/5 p-8 hover:border-blue-500/30 transition-colors shadow-2xl">
            <div className="flex items-center gap-3 text-blue-500 mb-6">
              <Clock size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Pending Follow-ups</span>
            </div>
            <span className="text-6xl font-black text-blue-500 tracking-tighter">{stats.followUps}</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
            <h2 className="text-3xl font-black tracking-tight text-white italic">Daily Sales Action List</h2>
            <div className="flex items-center gap-3">
               <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid gap-6">
            {leadsNeedingAttention.length === 0 && <p className="text-zinc-500 italic py-16 border-4 border-dashed border-zinc-900 rounded-[3rem] text-center font-bold text-xl uppercase tracking-widest opacity-30">Zero urgent tasks. Start a new search.</p>}
            {leadsNeedingAttention.map((lead) => (
              <Link 
                key={lead.id} 
                href={`/leads/${lead.id}`}
                className="group flex items-center justify-between rounded-[2.5rem] border border-zinc-800 bg-zinc-900/40 p-8 transition-all hover:border-orange-500/40 hover:bg-zinc-800 shadow-2xl"
              >
                <div className="flex items-center gap-10">
                   <div className={`flex h-16 w-16 items-center justify-center rounded-2xl font-black text-xl shadow-2xl transition-transform group-hover:scale-110 ${
                     lead.priority === "high" ? "bg-red-500 text-white shadow-red-500/20" : "bg-zinc-800 text-zinc-400"
                   }`}>
                     {lead.score || 0}
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors tracking-tight">{lead.business_name || "Unknown Business"}</h3>
                     <div className="mt-2 flex items-center gap-6 text-sm font-black uppercase tracking-widest">
                       <span className={lead.status === "new" ? "text-orange-500" : "text-blue-500"}>{lead.status}</span>
                       <span className="text-zinc-800">•</span>
                       <span className="text-zinc-500">{lead.city}, {lead.state}</span>
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="text-right hidden lg:block">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Status Note</p>
                     <p className="text-sm text-zinc-400 font-medium max-w-[300px] truncate italic">{lead.notes || "Ready for outreach."}</p>
                   </div>
                   <div className="h-14 w-14 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                      <ArrowRight size={24} className="text-zinc-700 group-hover:text-orange-500 transition-all group-hover:translate-x-1" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-20 flex justify-center">
           <Link href="/leads" className="inline-flex items-center gap-3 px-10 py-5 rounded-full border-2 border-zinc-800 text-sm font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-white transition-all">
             View Entire Pipeline
             <ArrowRight size={18} />
           </Link>
        </div>
      </div>
    </main>
  );
}
