import { NextRequest, NextResponse } from "next/server";
import { generateStoryboard } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const { profile, roughIdea, format } = await req.json();
    const scenes = await generateStoryboard(profile, roughIdea, format);
    return NextResponse.json({ scenes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
