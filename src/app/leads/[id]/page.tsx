"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { Lead } from "@/lib/types";
import { ArrowLeft, Phone, Mail, Globe, MapPin, Plus, Clock, ShieldCheck, Activity } from "lucide-react";

interface OutreachAttempt {
  id: string;
  method: string;
  outcome: string;
  notes: string;
  follow_up_at: string;
  created_at: string;
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [outreach, setOutreach] = useState<OutreachAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOutreachForm, setShowOutreachForm] = useState(false);

  const fetchLead = useCallback(async () => {
    const [lRes, oRes] = await Promise.all([
      fetch(`/api/leads/${id}`),
      fetch(`/api/leads/${id}/outreach`),
    ]);
    const lData = await lRes.json();
    const oData = await oRes.json();
    setLead(lData);
    setOutreach(oData);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchLead();
  };

  const addOutreach = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      method: formData.get("method"),
      outcome: formData.get("outcome"),
      notes: formData.get("notes"),
      follow_up_at: formData.get("follow_up_at"),
    };

    await fetch(`/api/leads/${id}/outreach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setShowOutreachForm(false);
    fetchLead();
  };

  if (loading) return <div className="p-8 text-zinc-400 text-center font-black uppercase tracking-[0.3em] animate-pulse">Accessing Lead Registry...</div>;
  if (!lead) return <div className="p-8 text-zinc-400 text-center font-black uppercase tracking-[0.3em]">Registry record not found.</div>;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <Link href="/leads" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white mb-12 transition-all group">
          <div className="h-8 w-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-white transition-all">
             <ArrowLeft size={16} />
          </div>
          Back to Pipeline
        </Link>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            <div className="rounded-[3rem] border border-zinc-800 bg-zinc-900/40 p-12 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none" />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter text-white">{lead.business_name || "Business Identity Pending"}</h1>
                  <div className="mt-4 flex items-center gap-3">
                     <ShieldCheck className="text-orange-500" size={20} />
                     <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 italic">Vitals Assessment: <span className="text-orange-500">{lead.score || 0}/100</span></p>
                  </div>
                </div>
                <div className={`rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl border ${
                  lead.status === "new" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : 
                  lead.status === "contacted" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  lead.status === "qualified" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                  "bg-zinc-800 text-zinc-500 border-zinc-700"
                }`}>
                  {lead.status}
                </div>
              </div>

              <div className="mt-12 grid gap-8 sm:grid-cols-2 relative z-10">
                <div className="flex items-center gap-6 group/item">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-600 group-hover/item:border-orange-500/50 group-hover/item:text-orange-500 transition-all shadow-xl">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Registered Phone</p>
                    <p className="text-lg font-black text-white tracking-tight">{lead.phone || "UNAVAILABLE"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group/item">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-600 group-hover/item:border-orange-500/50 group-hover/item:text-orange-500 transition-all shadow-xl">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Corporate Email</p>
                    <p className="text-lg font-black text-white tracking-tight break-all">{lead.email || "UNAVAILABLE"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group/item">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-600 group-hover/item:border-orange-500/50 group-hover/item:text-orange-500 transition-all shadow-xl">
                    <Globe size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Web Domain</p>
                    <p className="text-lg font-black text-white tracking-tight truncate max-w-[200px]">{lead.website || "NO WEBSITE"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group/item">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-600 group-hover/item:border-orange-500/50 group-hover/item:text-orange-500 transition-all shadow-xl">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">Primary Location</p>
                    <p className="text-lg font-black text-white tracking-tight uppercase">{lead.city}, {lead.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Outreach Timeline */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                <div className="flex items-center gap-4">
                   <Activity className="text-orange-500" size={24} />
                   <h2 className="text-3xl font-black tracking-tight text-white italic">Outreach Timeline</h2>
                </div>
                <button 
                  onClick={() => setShowOutreachForm(!showOutreachForm)}
                  className="inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-orange-400 hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                >
                  <Plus size={16} strokeWidth={4} />
                  Log Attempt
                </button>
              </div>

              {showOutreachForm && (
                <div className="rounded-[2.5rem] border-2 border-orange-500/20 bg-zinc-900 p-10 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl relative">
                  <div className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/40 italic">New Engagement Log</div>
                  <form onSubmit={addOutreach} className="grid gap-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4 italic">Methodology</label>
                        <select name="method" className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none">
                          <option value="call">Voice Call</option>
                          <option value="email">Direct Email</option>
                          <option value="text">SMS Outreach</option>
                          <option value="voicemail">Voicemail Drop</option>
                          <option value="in_person">In-Person Audit</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4 italic">Resulting Outcome</label>
                        <select name="outcome" className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none">
                          <option value="sent">Attempt Sent</option>
                          <option value="no_answer">Zero Engagement</option>
                          <option value="replied">Active Dialogue</option>
                          <option value="interested">High Interest</option>
                          <option value="not_interested">Rejected</option>
                          <option value="booked_call">Closed Opportunity</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4 italic">Strategic Follow-up Date</label>
                      <input type="date" name="follow_up_at" className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none focus:border-orange-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-4 italic">Engagement Notes</label>
                      <textarea name="notes" rows={3} placeholder="Describe the nuance of the conversation..." className="w-full rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm font-medium text-white outline-none focus:border-orange-500 transition-all leading-relaxed"></textarea>
                    </div>
                    <div className="flex justify-end gap-6 items-center">
                      <button type="button" onClick={() => setShowOutreachForm(false)} className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-300 transition-colors">Discard</button>
                      <button type="submit" className="rounded-2xl bg-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-black transition-all hover:bg-orange-500 hover:text-white shadow-xl">Commit Log</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-8">
                {outreach.length === 0 && <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs py-10 border-2 border-dashed border-zinc-900 rounded-[2rem] text-center opacity-40 italic italic">No tactical outreach recorded.</p>}
                {outreach.map((attempt) => (
                  <div key={attempt.id} className="relative pl-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-orange-500/50 before:to-transparent">
                    <div className="absolute left-[-6px] top-6 h-4 w-4 rounded-full bg-zinc-950 border-4 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                    <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900/30 p-8 group hover:border-orange-500/20 transition-all shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 italic">{attempt.method} • {attempt.outcome}</span>
                        <span className="text-[10px] text-zinc-700 font-black uppercase tracking-widest">{new Date(attempt.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-zinc-300 text-base leading-relaxed font-medium">{attempt.notes}</p>
                      {attempt.follow_up_at && (
                        <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-orange-500/10 px-4 py-1.5 text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] border border-orange-500/20 shadow-lg">
                          <Clock size={12} strokeWidth={3} />
                          NEXT ACTION: {new Date(attempt.follow_up_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="rounded-[2.5rem] border border-zinc-800 bg-zinc-900/60 p-10 space-y-10 shadow-2xl backdrop-blur-2xl sticky top-32">
              <div className="space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 italic border-b border-zinc-800 pb-4">Manage Lifecycle</h3>
                 <div className="grid grid-cols-1 gap-4">
                   {["new", "contacted", "follow up", "qualified", "closed", "lost"].map((s) => (
                     <button
                       key={s}
                       onClick={() => updateStatus(s)}
                       className={`rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl border ${
                         lead.status === s 
                           ? "bg-orange-500 text-black border-orange-500 shadow-orange-500/30 scale-[1.02]" 
                           : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-orange-500/40 hover:text-zinc-300"
                       }`}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="pt-10 border-t border-zinc-800 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 italic">Core Intelligence</h3>
                <div className="relative">
                   <div className="absolute -left-4 top-0 bottom-0 w-1 bg-zinc-800 rounded-full" />
                   <p className="text-zinc-400 text-sm leading-relaxed font-bold italic pl-4">
                     {lead.notes || "Ready for deep-dive audit and outreach strategy."}
                   </p>
                </div>
              </div>
              
              <div className="pt-6">
                 <div className="rounded-2xl bg-orange-500/5 border border-orange-500/10 p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500/60 mb-2">Partner Advice</p>
                    <p className="text-[11px] font-bold text-zinc-500 leading-tight">Fast follow-up on "high" priority leads increases close rates by 40%.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
