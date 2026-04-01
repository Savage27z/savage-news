import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;

  const { data, error } = await supabaseAdmin
    .from("pipeline_runs")
    .select("*")
    .eq("id", runId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Pipeline run not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
