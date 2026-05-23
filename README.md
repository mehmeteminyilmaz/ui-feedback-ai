<div align="center">

# 🎨 UI/UX Feedback AI

**Arayüzünü yapay zeka gözüyle analiz et — saniyeler içinde uzman geri bildirimi al.**

[![Vercel Canlı Demo](https://img.shields.io/badge/🚀_Canlı_Demo-ui--feedback--ai.vercel.app-000000?style=for-the-badge&logo=vercel)](https://ui-feedback-ai.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Vision_AI-7c3aed?style=flat-square)](https://openrouter.ai)

</div>

---

## 📌 Proje Hakkında

**UI/UX Feedback AI**, bir arayüzün ekran görüntüsünü yükleyerek ya da web sitesi URL'si girerek yapay zeka destekli detaylı UI/UX analizi almanızı sağlayan premium, modern ve yüksek performanslı bir araçtır.

Proje; Next.js 16, TypeScript ve [OpenRouter](https://openrouter.ai) üzerindeki ücretsiz vision modellerini kullanır. Türkçe çıktı üretecek şekilde yapılandırılmıştır.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 📁 **Görsel Yükleme** | PNG, JPG veya WebP formatında ekran görüntüsü yükle |
| 🔗 **URL Analizi** | Puppeteer ile herhangi bir web sitesinin ekran görüntüsünü otomatik al |
| 🗜️ **İstemci Tarafında Sıkıştırma (Yeni)** | Tarayıcıda (Canvas API) görseller otomatik olarak en fazla 1200px genişliğe yeniden boyutlandırılır ve %80 kalitede JPEG'e dönüştürülerek ultra hızlı yüklenir |
| 🤖 **AI Analiz** | OpenRouter üzerinden ücretsiz vision modeliyle derinlemesine inceleme |
| 📊 **Genel ve Kategori Skorları (Yeni)** | Genel puanın yanı sıra Görsel Tasarım, Kullanılabilirlik, Erişilebilirlik ve Mobil Uyumluluk için 4 ayrı animasyonlu kategori barı |
| 💡 **Somut Öneriler** | Güçlü yönler, kritik sorunlar ve en az 5 uygulanabilir iyileştirme maddesi |
| ♿ **Erişilebilirlik** | Renk kontrastı, font boyutu ve klavye navigasyonu tespiti |
| 📱 **Mobil Uyumluluk** | Responsive tasarım değerlendirmesi |
| 📋 **LinkedIn Uyumlu Rapor (Yeni)** | Tek tıkla analizi kopyalayıp LinkedIn veya diğer sosyal mecralarda doğrudan paylaşılmaya uygun formatta alma |
| ⏳ **Vercel Uyumlu (Yeni)** | Vercel'deki 10 saniyelik ücretsiz limit aşımını (timeout) önlemek için sunucu tarafında 60 saniyelik maksimum süre yapılandırması |

---

## 🖼️ Premium Arayüz

Uygulama koyu, glassmorphism temelli premium bir arayüze sahiptir.
*   **Hero Bölümü:** Gradient başlıklar ve akıcı geçişler.
*   **4'lü İstatistik Çubuğu:** Sistem analitiği hakkında anlık bilgi.
*   **Animasyonlu Skor Halkaları ve Barlar:** Sonuçları anında görselleştiren dinamik grafikler.
*   **Mikro Animasyonlar:** Hover efektleri ve akıcı scroll geçişleri.

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
Kullanıcı             Tarayıcı (Canvas)          Next.js API           OpenRouter
   │                         │                        │                    │
   │── Görsel Seç ──────────►│                        │                    │
   │                         │── Görseli Sıkıştır     │                    │
   │                         │   (Maks 1200px, 150KB) │                    │
   │                         │                        │                    │
   │── İstek Gönder ─────────────────────────────────►│                    │
   │                                                  │── API isteği ─────►│
   │                                                  │◄── JSON analiz ────│
   │◄── Rapor & Kategori Skorları ────────────────────│                    │
```

1. Kullanıcı görsel yükler veya URL girer.
2. **Görsel modunda:** Büyük dosyalar yüklenmeden önce istemci tarafında Canvas ile hızlıca sıkıştırılır. Sunucuya sadece ~150KB boyutunda optimize görsel gider.
3. **URL modunda:** Puppeteer ile sayfanın tam ekran görüntüsü alınır.
4. Next.js API rotası görselleri işler ve OpenRouter'a aktarır.
5. OpenRouter ücretsiz vision modellerinden birini otomatik seçer.
6. Model Türkçe JSON formatında analiz döndürür; uygulama bunu görsel kartlara dönüştürür.

---

## 📁 Proje Yapısı

```
ui-feedback-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Ana sayfa (SaaS Seviyesi Premium UI ve Sıkıştırma)
│   │   └── api/
│   │       ├── analyze/route.ts     # Analiz API uç noktası (Vercel maxDuration ayarlı)
│   │       └── screenshot/route.ts  # Puppeteer ekran görüntüsü API'si (Vercel maxDuration ayarlı)
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
- **[Sharp](https://sharp.pixelplumbing.com)** — Yüksek performanslı sunucu tarafı görsel işleme
- **Canvas API** — İstemci tarafında hızlı görsel ölçekleme ve sıkıştırma
- **[Lucide React](https://lucide.dev)** — İkon kütüphanesi

---

## 🔐 Güvenlik

- `.env.local` dosyası `.gitignore`'a eklenmiştir; API anahtarın asla repoya dahil edilmez.
- Yüklenen görseller sunucuya kaydedilmez; bellek üzerinde işlenip anında imha edilir.

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
