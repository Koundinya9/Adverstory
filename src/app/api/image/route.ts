import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/imagen";

export async function POST(req: NextRequest) {
  try {
    const { profile, scenes } = await req.json();
    const dataUrl = await generateImage(profile, scenes);
    return NextResponse.json({ dataUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
