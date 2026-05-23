"use client";
import { useState, useRef, useEffect } from "react";
import {
  Upload, Link, Loader2, CheckCircle, AlertTriangle,
  Lightbulb, Smartphone, Eye, X, Sparkles, ArrowRight,
  Zap, Palette, MousePointer, Copy, Check, ChevronDown
} from "lucide-react";

interface CategoryScores { visual: number; usability: number; accessibility: number; mobile: number; }
interface Analysis {
  score: number; summary: string;
  category_scores?: CategoryScores;
  strengths: string[]; critical_issues: string[];
  improvements: string[]; accessibility: string; mobile: string;
}

/* ─── Animated ring ─── */
function Ring({ score, color, size = 100, stroke = 9 }: { score: number; color: string; size?: number; stroke?: number }) {
  const [v, setV] = useState(0);
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  useEffect(() => { const t = setTimeout(() => setV(score), 120); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff07" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (v / 100) * circ}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(.34,1.56,.64,1)", filter: `drop-shadow(0 0 8px ${color}99)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * .28, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * .1, color: "#ffffff33", marginTop: 1 }}>/ 100</span>
      </div>
    </div>
  );
}

/* ─── Mini bar score ─── */
function ScoreBar({ label, score, color, icon }: { label: string; score: number; color: string; icon: React.ReactNode }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 200); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
          <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 5, background: "#ffffff08", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 5, transition: "width 1.2s cubic-bezier(.34,1.2,.64,1)", boxShadow: `0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

/* ─── Background ─── */
function Bg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "-15%", left: "-5%", width: "55%", height: "60%", background: "radial-gradient(ellipse,#7c3aed1a 0%,transparent 70%)", animation: "b1 14s ease-in-out infinite alternate", borderRadius: "60% 40% 70% 30%/40% 60% 40% 60%" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50%", height: "55%", background: "radial-gradient(ellipse,#06b6d41a 0%,transparent 70%)", animation: "b2 17s ease-in-out infinite alternate", borderRadius: "40% 60% 30% 70%/60% 40% 60% 40%" }} />
      <div style={{ position: "absolute", top: "35%", left: "30%", width: "45%", height: "45%", background: "radial-gradient(ellipse,#f59e0b0b 0%,transparent 70%)", animation: "b3 11s ease-in-out infinite alternate", borderRadius: "50%" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff04 1px,transparent 1px),linear-gradient(90deg,#ffffff04 1px,transparent 1px)", backgroundSize: "56px 56px" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 70%,#080810 100%)" }} />
    </div>
  );
}

const SCORE_COLOR = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";
const SCORE_LABEL = (s: number) => s >= 80 ? "Mükemmel" : s >= 60 ? "Orta Düzey" : "Geliştirilmeli";

const STATS = [
  { value: "6", label: "Analiz Kategorisi" },
  { value: "AI", label: "Vision Model" },
  { value: "~15s", label: "Ortalama Süre" },
  { value: "₺0", label: "Maliyet" },
];

const HOW = [
  { icon: "①", title: "Yükle", desc: "Görsel yükle ya da URL gir" },
  { icon: "②", title: "Analiz Et", desc: "AI arayüzü saniyeler içinde tarar" },
  { icon: "③", title: "Raporla", desc: "Kategorili skor + önerileri al" },
];

export default function Home() {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const steps = ["Görsel hazırlanıyor...", "Model analiz ediyor...", "Rapor oluşturuluyor...", "Son dokunuşlar..."];
  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (loading) { setStep(0); iv = setInterval(() => setStep(p => (p + 1) % steps.length), 1900); }
    return () => clearInterval(iv);
  }, [loading]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Sadece görsel dosyası yükleyebilirsin"); return; }
    setImageFile(file); setError(null);
    const r = new FileReader();
    r.onload = e => setImagePreview(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (mode === "upload" && !imageFile) return setError("Lütfen bir görsel yükle");
    if (mode === "url" && !url) return setError("Lütfen bir URL gir");
    setLoading(true); setError(null); setAnalysis(null);
    try {
      const fd = new FormData();
      if (mode === "upload" && imageFile) fd.append("image", imageFile);
      if (mode === "url") fd.append("url", url);
      if (context) fd.append("context", context);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analiz başarısız");
      setAnalysis(data.analysis);
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally { setLoading(false); }
  };

  const copyResults = () => {
    if (!analysis) return;
    const txt = `UI/UX Analiz Raporu\n\nGenel Skor: ${analysis.score}/100\nÖzet: ${analysis.summary}\n\nGüçlü Yönler:\n${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nKritik Sorunlar:\n${analysis.critical_issues.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nİyileştirme Önerileri:\n${analysis.improvements.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nErişilebilirlik: ${analysis.accessibility}\nMobil: ${analysis.mobile}\n\n— UI/UX Feedback AI tarafından oluşturuldu`;
    navigator.clipboard.writeText(txt);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const glass = { background: "rgba(255,255,255,0.025)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#080810;-webkit-font-smoothing:antialiased}
        @keyframes b1{from{transform:translate(0,0) scale(1)}to{transform:translate(4%,7%) scale(1.14)}}
        @keyframes b2{from{transform:translate(0,0) scale(1)}to{transform:translate(-5%,-5%) scale(1.1)}}
        @keyframes b3{from{transform:translate(0,0) scale(1)}to{transform:translate(3%,-5%) scale(.92)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes countup{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
        .hover-lift{transition:transform .25s,box-shadow .25s}
        .hover-lift:hover{transform:translateY(-3px);box-shadow:0 16px 48px #7c3aed33}
        .tab:hover{color:#ccc!important}
        .zone:hover{border-color:#7c3aed66!important;background:#7c3aed06!important}
        input::placeholder,textarea::placeholder{color:#2a2a3a}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0d0d14}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:3px}
      `}</style>
      <Bg />

      <main style={{ minHeight: "100vh", position: "relative", zIndex: 1, overflowX: "hidden" }}>

        {/* ── HERO ── */}
        <section style={{ padding: "80px 24px 60px", textAlign: "center", animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#7c3aed1a,#06b6d41a)", border: "1px solid #7c3aed33", borderRadius: 40, padding: "6px 18px", marginBottom: 28, backdropFilter: "blur(12px)" }}>
            <Zap size={12} color="#a78bfa" fill="#a78bfa" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: ".08em", textTransform: "uppercase" }}>Yapay Zeka Destekli UI/UX Analiz</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block", animation: "pulse 2s ease infinite" }} />
          </div>

          <h1 style={{ fontSize: "clamp(40px,6.5vw,72px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 22, letterSpacing: "-.02em" }}>
            <span style={{ background: "linear-gradient(135deg,#fff 0%,#c4b5fd 40%,#67e8f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Arayüzünü<br />AI Gözüyle Gör
            </span>
          </h1>
          <p style={{ color: "#555", fontSize: 18, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 40px", fontWeight: 400 }}>
            Ekran görüntüsü yükle ya da URL gir.<br />
            <span style={{ color: "#7c3aed" }}>6 kategoride</span> derinlemesine analiz, somut öneriler, gerçek skor.
          </p>

          <button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 32px", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px #7c3aed55,inset 0 1px 0 #ffffff22", fontFamily: "inherit", letterSpacing: ".02em" }} className="hover-lift">
            <Sparkles size={17} />  Hemen Analiz Et  <ChevronDown size={15} style={{ opacity: .6 }} />
          </button>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ padding: "0 24px 64px", animation: "fadeUp .7s .1s ease both" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ ...glass, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 4, animation: "countup .6s ease both" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "0 24px 72px", animation: "fadeUp .7s .15s ease both" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#7c3aed", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>Nasıl Çalışır?</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {HOW.map(h => (
                <div key={h.title} style={{ ...glass, padding: "24px 20px", textAlign: "center", transition: "border-color .3s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed33")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                  <div style={{ fontSize: 28, marginBottom: 10, background: "linear-gradient(135deg,#a78bfa,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 900 }}>{h.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#ddd", marginBottom: 6 }}>{h.title}</div>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{h.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INPUT FORM ── */}
        <section ref={formRef} style={{ padding: "0 24px 40px", animation: "fadeUp .7s .2s ease both" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ ...glass, padding: 36, transition: "border-color .3s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#7c3aed22")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>

              {/* Tabs */}
              <div style={{ display: "flex", background: "#0a0a14", borderRadius: 14, padding: 5, marginBottom: 28, gap: 4 }}>
                {(["upload", "url"] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setError(null); }} className="tab"
                    style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all .22s", background: mode === m ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "transparent", color: mode === m ? "#fff" : "#444", boxShadow: mode === m ? "0 4px 18px #7c3aed44,inset 0 1px 0 #ffffff1a" : "none" }}>
                    {m === "upload" ? "📁  Görsel Yükle" : "🔗  URL Analiz Et"}
                  </button>
                ))}
              </div>

              {/* Upload zone */}
              {mode === "upload" && (
                <div onClick={() => fileRef.current?.click()} onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)} className="zone"
                  style={{ border: `2px dashed ${dragOver ? "#7c3aed" : imagePreview ? "#7c3aed44" : "#1a1a28"}`, borderRadius: 16, padding: imagePreview ? 20 : 52, textAlign: "center", cursor: "pointer", background: dragOver ? "#7c3aed08" : "#0a0a14", transition: "all .22s", position: "relative" }}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  {imagePreview ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={imagePreview} alt="önizleme" style={{ maxHeight: 280, maxWidth: "100%", borderRadius: 12, objectFit: "contain", boxShadow: "0 8px 40px #00000099" }} />
                      <button onClick={e => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                        style={{ position: "absolute", top: -10, right: -10, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "2px solid #080810", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 4px 12px #ef444455" }}>
                        <X size={13} />
                      </button>
                      <p style={{ marginTop: 10, color: "#333", fontSize: 12 }}>{imageFile?.name}</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ width: 68, height: 68, borderRadius: 20, background: "linear-gradient(135deg,#1a1a2e,#0f0f1e)", border: "1px solid #7c3aed22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "float 4s ease-in-out infinite" }}>
                        <Upload size={28} color="#7c3aed" />
                      </div>
                      <p style={{ color: "#666", fontSize: 16, marginBottom: 8, fontWeight: 500 }}>Görseli buraya sürükle ya da tıkla</p>
                      <p style={{ color: "#2a2a3a", fontSize: 13 }}>PNG, JPG, WebP — Her boyut desteklenir</p>
                    </>
                  )}
                </div>
              )}

              {/* URL */}
              {mode === "url" && (
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: 10, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Link size={16} color="#7c3aed" />
                  </div>
                  <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://ornek.com"
                    style={{ width: "100%", padding: "16px 16px 16px 62px", background: "#0a0a14", border: "1px solid #1a1a28", borderRadius: 14, color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", transition: "border-color .2s" }}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = "#1a1a28"} />
                </div>
              )}

              {/* Context */}
              <div style={{ marginTop: 14 }}>
                <textarea value={context} onChange={e => setContext(e.target.value)} rows={3}
                  placeholder="İsteğe bağlı: Hedef kitle ve amaç — örn: 'E-ticaret, 25-40 yaş mobil kullanıcılar'"
                  style={{ width: "100%", padding: "14px 16px", background: "#0a0a14", border: "1px solid #1a1a28", borderRadius: 14, color: "#ccc", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color .2s" }}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"}
                  onBlur={e => e.target.style.borderColor = "#1a1a28"} />
              </div>

              {error && (
                <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: "#ef444410", border: "1px solid #ef444430", color: "#f87171", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />{error}
                </div>
              )}

              <button onClick={handleAnalyze} disabled={loading}
                style={{ width: "100%", marginTop: 18, padding: "18px 0", background: loading ? "#1e1030" : "linear-gradient(135deg,#7c3aed,#6d28d9,#5b21b6)", border: "none", borderRadius: 14, color: loading ? "#7c3aed" : "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .25s", fontFamily: "inherit", letterSpacing: ".02em", boxShadow: loading ? "none" : "0 8px 32px #7c3aed44,inset 0 1px 0 #ffffff22" }}
                className={loading ? "" : "hover-lift"}>
                {loading ? (
                  <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /><span>{steps[step]}</span></>
                ) : (
                  <><Sparkles size={17} />Analiz Et<ArrowRight size={15} style={{ opacity: .5 }} /></>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── RESULTS ── */}
        {analysis && (
          <section style={{ padding: "0 24px 80px", animation: "fadeUp .6s ease both" }}>
            <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Score hero */}
              <div style={{ ...glass, padding: "40px 44px", background: "linear-gradient(135deg,rgba(124,58,237,.07),rgba(6,182,212,.04))", border: "1px solid rgba(124,58,237,.22)", boxShadow: "0 0 80px rgba(124,58,237,.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
                  <Ring score={analysis.score} color={SCORE_COLOR(analysis.score)} size={148} stroke={11} />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: SCORE_COLOR(analysis.score) + "22", color: SCORE_COLOR(analysis.score), letterSpacing: ".06em", textTransform: "uppercase" }}>{SCORE_LABEL(analysis.score)}</span>
                      <span style={{ fontSize: 11, color: "#333" }}>Genel UI/UX Skoru</span>
                    </div>
                    <p style={{ color: "#bbb", fontSize: 15, lineHeight: 1.8 }}>{analysis.summary}</p>
                  </div>
                </div>

                {/* Category scores */}
                {analysis.category_scores && (
                  <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px", borderTop: "1px solid #ffffff08", paddingTop: 28 }}>
                    <ScoreBar label="Görsel Tasarım" score={analysis.category_scores.visual} color="#a78bfa" icon={<Palette size={12} color="#a78bfa" />} />
                    <ScoreBar label="Kullanılabilirlik" score={analysis.category_scores.usability} color="#f59e0b" icon={<MousePointer size={12} color="#f59e0b" />} />
                    <ScoreBar label="Erişilebilirlik" score={analysis.category_scores.accessibility} color="#6366f1" icon={<Eye size={12} color="#6366f1" />} />
                    <ScoreBar label="Mobil Uyumluluk" score={analysis.category_scores.mobile} color="#06b6d4" icon={<Smartphone size={12} color="#06b6d4" />} />
                  </div>
                )}
              </div>

              {/* Strengths + Critical */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ ...glass, padding: 28, border: "1px solid #22c55e14", background: "rgba(34,197,94,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#22c55e14", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={16} color="#22c55e" /></div>
                    <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>Güçlü Yönler</span>
                  </div>
                  {analysis.strengths.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", marginTop: 7, flexShrink: 0, boxShadow: "0 0 6px #22c55e" }} />
                      <span style={{ color: "#999", fontSize: 13, lineHeight: 1.65 }}>{s}</span>
                    </div>
                  ))}
                </div>

                {analysis.critical_issues?.length > 0 && (
                  <div style={{ ...glass, padding: 28, border: "1px solid #ef444414", background: "rgba(239,68,68,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#ef444414", display: "flex", alignItems: "center", justifyContent: "center" }}><AlertTriangle size={16} color="#ef4444" /></div>
                      <span style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>Kritik Sorunlar</span>
                    </div>
                    {analysis.critical_issues.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", marginTop: 7, flexShrink: 0, boxShadow: "0 0 6px #ef4444" }} />
                        <span style={{ color: "#999", fontSize: 13, lineHeight: 1.65 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Improvements */}
              <div style={{ ...glass, padding: 32, border: "1px solid #f59e0b12", background: "rgba(245,158,11,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f59e0b14", display: "flex", alignItems: "center", justifyContent: "center" }}><Lightbulb size={16} color="#f59e0b" /></div>
                  <span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>İyileştirme Önerileri</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {analysis.improvements.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", background: "#f59e0b06", borderRadius: 12, border: "1px solid #f59e0b0e" }}>
                      <span style={{ width: 24, height: 24, borderRadius: 7, background: "#f59e0b18", color: "#f59e0b", fontSize: 11, fontWeight: 800, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                      <span style={{ color: "#999", fontSize: 13.5, lineHeight: 1.65 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility + Mobile */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ ...glass, padding: 26, border: "1px solid #6366f112", background: "rgba(99,102,241,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "#6366f114", display: "flex", alignItems: "center", justifyContent: "center" }}><Eye size={14} color="#6366f1" /></div>
                    <span style={{ color: "#6366f1", fontSize: 12, fontWeight: 700 }}>Erişilebilirlik</span>
                  </div>
                  <p style={{ color: "#777", fontSize: 13, lineHeight: 1.75 }}>{analysis.accessibility}</p>
                </div>
                <div style={{ ...glass, padding: 26, border: "1px solid #06b6d412", background: "rgba(6,182,212,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: "#06b6d414", display: "flex", alignItems: "center", justifyContent: "center" }}><Smartphone size={14} color="#06b6d4" /></div>
                    <span style={{ color: "#06b6d4", fontSize: 12, fontWeight: 700 }}>Mobil Uyumluluk</span>
                  </div>
                  <p style={{ color: "#777", fontSize: 13, lineHeight: 1.75 }}>{analysis.mobile}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <button onClick={copyResults}
                  style={{ padding: "15px 0", background: copied ? "#22c55e15" : "#0a0a14", border: `1px solid ${copied ? "#22c55e44" : "#1a1a28"}`, borderRadius: 14, color: copied ? "#22c55e" : "#555", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .25s", fontFamily: "inherit" }}>
                  {copied ? <><Check size={15} />Kopyalandı!</> : <><Copy size={15} />Raporu Kopyala</>}
                </button>
                <button onClick={() => { setAnalysis(null); setImageFile(null); setImagePreview(null); setUrl(""); setContext(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{ padding: "15px 0", background: "transparent", border: "1px solid #1a1a28", borderRadius: 14, color: "#444", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .25s", fontFamily: "inherit" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#7c3aed55"; (e.currentTarget as HTMLButtonElement).style.color = "#a78bfa"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1a1a28"; (e.currentTarget as HTMLButtonElement).style.color = "#444"; }}>
                  ↺ &nbsp;Yeni Analiz
                </button>
              </div>

            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "0 0 40px", color: "#1e1e2e", fontSize: 12, letterSpacing: ".04em" }}>
          UI/UX Feedback AI &nbsp;·&nbsp; OpenRouter Vision &nbsp;·&nbsp; Tamamen ücretsiz
        </footer>
      </main>
    </>
  );
}
