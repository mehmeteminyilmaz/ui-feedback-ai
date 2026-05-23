<div align="center">

# 🎨 UI/UX Feedback AI

**Arayüzünü yapay zeka gözüyle analiz et — saniyeler içinde uzman geri bildirimi al.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Vision_AI-7c3aed?style=for-the-badge)](https://openrouter.ai)
[![License](https://img.shields.io/badge/Lisans-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Proje Hakkında

**UI/UX Feedback AI**, bir arayüzün ekran görüntüsünü yükleyerek ya da web sitesi URL'si girerek yapay zeka destekli detaylı UI/UX analizi almanızı sağlayan bir araçtır.

Proje; Next.js 16, TypeScript ve [OpenRouter](https://openrouter.ai) üzerindeki ücretsiz vision modellerini kullanır. Türkçe çıktı üretecek şekilde yapılandırılmıştır.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 📁 **Görsel Yükleme** | PNG, JPG veya WebP formatında ekran görüntüsü yükle |
| 🔗 **URL Analizi** | Puppeteer ile herhangi bir web sitesinin ekran görüntüsünü otomatik al |
| 🤖 **AI Analiz** | OpenRouter üzerinden ücretsiz vision modeliyle derinlemesine inceleme |
| 📊 **Görsel Skor** | 100 üzerinden animasyonlu dairesel puan gösterimi |
| 💡 **Somut Öneriler** | En az 5 uygulanabilir iyileştirme maddesi |
| ♿ **Erişilebilirlik** | Renk kontrastı, font boyutu ve klavye navigasyonu tespiti |
| 📱 **Mobil Uyumluluk** | Responsive tasarım değerlendirmesi |
| 🗜️ **Otomatik Sıkıştırma** | `sharp` ile görseller API limitine sığacak şekilde optimize edilir |

---

## 🖼️ Ekran Görüntüsü

> Uygulama koyu, glassmorphism temelli premium bir arayüze sahiptir. Animasyonlu blob arka plan, parlayan kart kenarlıkları ve dairesel skor halkası içerir.

---

## 🚀 Kurulum

### 1. Repoyu klonla

```bash
git clone https://github.com/mehmeteminyilmaz/ui-feedback-ai.git
cd ui-feedback-ai
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Ortam değişkenlerini ayarla

Proje kök dizininde `.env.local` dosyası oluştur:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

> 🔑 OpenRouter API anahtarını [openrouter.ai/keys](https://openrouter.ai/keys) adresinden ücretsiz olarak alabilirsin.

### 4. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcında `http://localhost:3000` adresini aç.

---

## 🧠 Nasıl Çalışır?

```
Kullanıcı                Next.js API          OpenRouter Vision AI
   │                         │                        │
   │── Görsel / URL ────────►│                        │
   │                         │── sharp ile sıkıştır   │
   │                         │── base64'e çevir        │
   │                         │── API isteği ──────────►│
   │                         │◄── JSON analiz ─────────│
   │◄── Skor + Rapor ────────│                        │
```

1. Kullanıcı görsel yükler veya URL girer.
2. **URL modunda:** Puppeteer ile sayfanın tam ekran görüntüsü alınır.
3. Görsel `sharp` ile 1200px genişliğe yeniden boyutlandırılır ve JPEG olarak sıkıştırılır.
4. OpenRouter'a gönderilen istek, ücretsiz vision modellerinden birini (örn. NVIDIA Nemotron, Google Gemma) otomatik seçer.
5. Model Türkçe JSON formatında analiz döndürür; uygulama bunu görsel kartlara dönüştürür.

---

## 📁 Proje Yapısı

```
ui-feedback-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Ana sayfa (UI)
│   │   └── api/
│   │       ├── analyze/route.ts     # Görsel analiz API uç noktası
│   │       └── screenshot/route.ts  # Puppeteer ekran görüntüsü API'si
│   └── lib/
│       └── openrouter.ts            # OpenRouter API istemcisi
├── .env.local                       # Gizli ortam değişkenleri (repo'ya eklenmez)
├── next.config.ts
└── package.json
```

---

## ⚙️ Kullanılan Teknolojiler

- **[Next.js 16](https://nextjs.org)** — App Router, Server Components, API Routes
- **[TypeScript](https://www.typescriptlang.org)** — Tip güvenliği
- **[OpenRouter](https://openrouter.ai)** — Ücretsiz vision model yönlendiricisi
- **[Puppeteer](https://pptr.dev)** — Headless tarayıcı ile ekran görüntüsü
- **[Sharp](https://sharp.pixelplumbing.com)** — Yüksek performanslı görsel işleme
- **[Lucide React](https://lucide.dev)** — İkon kütüphanesi

---

## 🔐 Güvenlik

- `.env.local` dosyası `.gitignore`'a eklenmiştir; API anahtarın asla repoya dahil edilmez.
- Yüklenen görseller sunucuya kaydedilmez; bellek üzerinde işlenip atılır.

---

## 🤝 Katkıda Bulunma

1. Bu repoyu fork'la
2. Yeni bir branch oluştur: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerini commit'le: `git commit -m "feat: yeni özellik eklendi"`
4. Branch'ini push'la: `git push origin ozellik/yeni-ozellik`
5. Pull Request aç

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.

---

<div align="center">

**Mehmet Emin Yılmaz** tarafından geliştirildi &nbsp;·&nbsp; [GitHub](https://github.com/mehmeteminyilmaz)

</div>
