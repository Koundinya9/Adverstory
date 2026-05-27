import { NextRequest, NextResponse } from "next/server";
import { submitVideoJob } from "@/lib/ai/veo";

export async function POST(req: NextRequest) {
  try {
    const { profile, scenes, duration } = await req.json();
    const operationName = await submitVideoJob(profile, scenes, duration);
    return NextResponse.json({ operationName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
