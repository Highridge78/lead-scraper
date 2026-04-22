import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { Lead } from './types';

const LOCAL_DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_LEADS_FILE = path.join(LOCAL_DATA_DIR, 'leads.json');

function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

async function readLocalLeads(): Promise<Lead[]> {
  try {
    const content = await readFile(LOCAL_LEADS_FILE, 'utf8');
    return JSON.parse(content) as Lead[];
  } catch {
    return [];
  }
}

async function writeLocalLeads(leads: Lead[]) {
  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(LOCAL_LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
}

export async function listLeads(): Promise<Lead[]> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (!error && Array.isArray(data)) {
      return data.map((row) => ({
        id: String(row.id),
        businessName: row.business_name,
        businessType: row.business_type,
        city: row.city,
        state: row.state,
        phone: row.phone ?? undefined,
        website: row.website ?? undefined,
        hasWebsite: row.has_website,
        websiteQuality: row.website_quality,
        rating: row.rating ?? undefined,
        reviewCount: row.review_count ?? undefined,
        notes: row.notes ?? '',
        score: row.score,
        priority: row.priority,
        tags: row.tags ?? [],
        createdAt: row.created_at,
      })) as Lead[];
    }
  }

  const localLeads = await readLocalLeads();
  return localLeads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function saveLeads(incoming: Lead[]): Promise<Lead[]> {
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const payload = incoming.map((lead) => ({
      id: lead.id,
      business_name: lead.businessName,
      business_type: lead.businessType,
      city: lead.city,
      state: lead.state,
      phone: lead.phone ?? null,
      website: lead.website ?? null,
      has_website: lead.hasWebsite,
      website_quality: lead.websiteQuality,
      rating: lead.rating ?? null,
      review_count: lead.reviewCount ?? null,
      notes: lead.notes,
      score: lead.score,
      priority: lead.priority,
      tags: lead.tags,
      created_at: lead.createdAt,
    }));

    const { error } = await supabase.from('leads').upsert(payload, { onConflict: 'id' });
    if (!error) {
      return incoming;
    }
  }

  const existing = await readLocalLeads();
  const map = new Map(existing.map((lead) => [lead.id, lead]));
  incoming.forEach((lead) => {
    map.set(lead.id, lead);
  });

  const merged = Array.from(map.values());
  await writeLocalLeads(merged);
  return incoming;
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const leads = await listLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}
