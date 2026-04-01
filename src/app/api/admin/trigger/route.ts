import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

export async function POST() {
  try {
    const result = await runPipeline();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Pipeline execution failed", message },
      { status: 500 }
    );
  }
}
