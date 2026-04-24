export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("outreach_attempts")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("outreach_attempts")
    .insert({
      lead_id: id,
      method: body.method,
      outcome: body.outcome,
      notes: body.notes,
      follow_up_at: body.follow_up_at,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update lead status to contacted if it was new
  const { data: lead } = await supabase.from("leads").select("status").eq("id", id).single();
  if (lead?.status === "new") {
    await supabase.from("leads").update({ status: "contacted" }).eq("id", id);
  }

  return NextResponse.json(data);
}
