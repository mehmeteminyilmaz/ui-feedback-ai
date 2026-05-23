import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Vercel'de timeout süresini 60 saniyeye çıkarır

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL gerekli" }, { status: 400 });

  try {
    // 1. Microlink API'si ile ekran görüntüsü al
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;
    const res = await fetch(microlinkUrl);
    if (!res.ok) throw new Error("Microlink screenshot failed");
    const json = await res.json();
    if (json.status !== "success" || !json.data.screenshot?.url) {
      throw new Error("Failed to capture screenshot from microlink");
    }

    // 2. Görseli indir ve Base64 formatına dönüştür
    const imgRes = await fetch(json.data.screenshot.url);
    if (!imgRes.ok) throw new Error("Failed to download captured screenshot");
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({ image: base64 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Screenshot hatası";
    console.error("Microlink failed, trying Thum.io fallback...", message);
    
    // YEDEK PLÂN: Thum.io üzerinden doğrudan ekran görüntüsü al
    try {
      const thumioUrl = `https://image.thum.io/get/width/1280/crop/800/${url}`;
      const thumRes = await fetch(thumioUrl);
      if (thumRes.ok) {
        const arrayBuffer = await thumRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return NextResponse.json({ image: base64 });
      }
    } catch (fallbackErr) {
      console.error("Thum.io fallback failed:", fallbackErr);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
