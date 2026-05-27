import "server-only";
import { NextRequest } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

export async function GET(req: NextRequest) {
  try {
    const gcsUri = req.nextUrl.searchParams.get("uri");
    if (!gcsUri) return new Response("missing uri", { status: 400 });

    const withoutPrefix = gcsUri.replace("gs://", "");
    const [bucket, ...pathParts] = withoutPrefix.split("/");
    const filePath = pathParts.join("/");

    const file = storage.bucket(bucket).file(filePath);
    const [buffer] = await file.download();

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="adverstory-ad.mp4"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(message, { status: 500 });
  }
}
