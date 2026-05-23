import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/openrouter";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const url = formData.get("url") as string | null;
    const context = formData.get("context") as string || "";

    let imageData: string;
    let mimeType: string;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      imageData = compressedBuffer.toString("base64");
      mimeType = "image/jpeg";
    } else if (url) {
      const screenshotRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/screenshot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!screenshotRes.ok) throw new Error("Screenshot alınamadı");
      const { image } = await screenshotRes.json();
      const buffer = Buffer.from(image, "base64");
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      imageData = compressedBuffer.toString("base64");
      mimeType = "image/jpeg";
    } else {
      return NextResponse.json({ error: "Görsel veya URL gerekli" }, { status: 400 });
    }

    const prompt = `Sen kıdemli bir UI/UX tasarım danışmanısın. Bu arayüz ekran görüntüsünü profesyonelce analiz et ve Türkçe olarak detaylı geri bildirim ver.

${context ? `Bağlam: ${context}` : ""}

Şu kategorilerde kapsamlı analiz yap:

1. **Genel Skor** (100 üzerinden): Genel değerlendirme ve puan
2. **Kategori Skorları** (her biri 100 üzerinden): Görsel Tasarım, Kullanılabilirlik, Erişilebilirlik, Mobil Uyumluluk
3. **Güçlü Yönler** (en az 3 madde): Ne iyi yapılmış?
4. **Kritik Sorunlar** (varsa): Acil düzeltilmesi gerekenler
5. **İyileştirme Önerileri** (en az 5 madde): Somut, uygulanabilir öneriler
6. **Erişilebilirlik**: Renk kontrastı, font boyutu, odak göstergeleri, ARIA
7. **Mobil Uyumluluk**: Responsive tasarım, dokunma hedefleri, viewport

Her madde kısa ve net olsun. Teknik terimler kullan ama açıkla.

SADECE şu JSON formatında yanıt ver, başka hiçbir şey ekleme:
{
  "score": 85,
  "summary": "...",
  "category_scores": {
    "visual": 88,
    "usability": 82,
    "accessibility": 70,
    "mobile": 75
  },
  "strengths": ["...", "...", "..."],
  "critical_issues": ["..."],
  "improvements": ["...", "...", "...", "...", "..."],
  "accessibility": "...",
  "mobile": "..."
}`;

    const text = await analyzeImage(imageData, mimeType, prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Geçersiz yanıt formatı");

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
