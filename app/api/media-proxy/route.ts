import { NextRequest, NextResponse } from "next/server";
import { api, getBaseUrl } from "@/lib/api-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url") || "";
  const BASE = getBaseUrl();
  const cleaned = raw.trim().replace(/[\\]+/g, "/");
  const target = cleaned.startsWith("http://") || cleaned.startsWith("https://")
    ? cleaned
    : cleaned.startsWith("/")
      ? `${BASE}${cleaned}`
      : `${BASE}/${cleaned}`;

  try {
    const token = api.getToken() ?? "";
    const res = await fetch(target, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const buf = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    return new NextResponse(buf, {
      status: res.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ error: "Failed to proxy media" }, { status: 500 });
  }
}
