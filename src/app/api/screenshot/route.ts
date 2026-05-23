import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const maxDuration = 60; // Vercel'de timeout süresini 60 saniyeye çıkarır

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL gerekli" }, { status: 400 });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
    const screenshot = await page.screenshot({ type: "png", fullPage: false });
    const base64 = Buffer.from(screenshot).toString("base64");
    return NextResponse.json({ image: base64 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Screenshot hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
