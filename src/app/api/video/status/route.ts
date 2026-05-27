import { NextRequest, NextResponse } from "next/server";
import { pollVideoJob } from "@/lib/ai/veo";

export async function GET(req: NextRequest) {
  try {
    const operationName = req.nextUrl.searchParams.get("operation");
    if (!operationName) {
      return NextResponse.json({ error: "missing operation" }, { status: 400 });
    }
    const result = await pollVideoJob(operationName);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
