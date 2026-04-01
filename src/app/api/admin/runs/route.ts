import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("pipeline_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ runs: [] });
  }

  return NextResponse.json({ runs: data || [] });
}
