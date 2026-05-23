"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, Link, Loader2, CheckCircle, AlertTriangle, Lightbulb, Smartphone, Eye, X, Sparkles, ArrowRight, Zap } from "lucide-react";

interface Analysis {
  score: number;
  summary: string;
  strengths: string[];
  critical_issues: string[];
  improvements: string[];
  accessibility: string;
  mobile: string;
}

function CircularScore({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  const r = 54;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#ffffff0a" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 12px ${color}88)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{score}</span>
        <span style={{ fontSize: 12, color: "#ffffff44", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function ParticleBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Animated mesh blobs */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%",
        background: "radial-gradient(ellipse at center, #7c3aed22 0%, transparent 70%)",
        animation: "blob1 12s ease-in-out infinite alternate",
        borderRadius: "60% 40% 70% 30% / 40% 60% 40% 60%",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-10%", width: "55%", height: "55%",
        background: "radial-gradient(ellipse at center, #06b6d422 0%, transparent 70%)",
        animation: "blob2 15s ease-in-out infinite alternate",
        borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "20%", width: "35%", height: "35%",
        background: "radial-gradient(ellipse at center, #f59e0b11 0%, transparent 70%)",
        animation: "blob3 10s ease-in-out infinite alternate",
        borderRadius: "50%",
      }} />
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}

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
  const [loadingStep, setLoadingStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadingSteps = ["Görsel işleniyor...", "AI analiz yapıyor...", "Rapor oluşturuluyor...", "Son rötuşlar..."];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(p => (p + 1) % loadingSteps.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Sadece görsel dosyası yükleyebilirsin"); return; }
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (mode === "upload" && !imageFile) return setError("Lütfen bir görsel yükle");
    if (mode === "url" && !url) return setError("Lütfen bir URL gir");
    setLoading(true); setError(null); setAnalysis(null);
    try {
      const formData = new FormData();
      if (mode === "upload" && imageFile) formData.append("image", imageFile);
      if (mode === "url") formData.append("url", url);
      if (context) formData.append("context", context);
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analiz başarısız");
      setAnalysis(data.analysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const scoreLabel = (score: number) => score >= 80 ? "Mükemmel" : score >= 60 ? "Orta Düzey" : "Geliştirilmeli";

  const glass = {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 24,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #080810; }
        @keyframes blob1 { from { transform: translate(0,0) scale(1); } to { transform: translate(5%,8%) scale(1.15); } }
        @keyframes blob2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-6%,-5%) scale(1.1); } }
        @keyframes blob3 { from { transform: translate(0,0) scale(1); } to { transform: translate(4%,-6%) scale(0.9); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 #7c3aed44; } 50% { box-shadow: 0 0 0 16px #7c3aed00; } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .upload-zone:hover { border-color: #7c3aed88 !important; background: #7c3aed08 !important; }
        .tab-btn:hover { color: #ccc !important; }
        .card-glow:hover { border-color: rgba(124,58,237,0.25) !important; box-shadow: 0 0 40px #7c3aed0a; }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 40px #7c3aed55; }
        .analyze-btn:active:not(:disabled) { transform: translateY(0); }
        .restart-btn:hover { border-color: #7c3aed88 !important; color: #a78bfa !important; }
        input::placeholder { color: #333; }
        textarea::placeholder { color: #333; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
      <ParticleBackground />

      <main style={{ minHeight: "100vh", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Hero Header */}
          <div style={{ textAlign: "center", marginBottom: 56, animation: "fadeUp .7s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #7c3aed22, #06b6d422)",
              border: "1px solid #7c3aed33", borderRadius: 40, padding: "7px 18px", marginBottom: 24,
              backdropFilter: "blur(12px)",
            }}>
              <Zap size={13} color="#a78bfa" fill="#a78bfa" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", letterSpacing: ".06em", textTransform: "uppercase" }}>AI Destekli UI/UX Analiz</span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse-ring 2s ease infinite", display: "inline-block" }} />
            </div>

            <h1 style={{
              fontSize: "clamp(38px,6vw,58px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16,
              background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #67e8f9 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Arayüzünü Bir<br />Üst Seviyeye Taşı
            </h1>
            <p style={{ color: "#666", fontSize: 17, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
              Ekran görüntüsü yükle veya URL gir — yapay zeka saniyeler içinde derinlemesine analiz sunar.
            </p>
          </div>

          {/* Main Card */}
          {!analysis && (
            <div style={{ ...glass, padding: 36, marginBottom: 28, animation: "fadeUp .7s .1s ease both", transition: "border-color .3s" }} className="card-glow">

              {/* Mode Tabs */}
              <div style={{ display: "flex", background: "#0a0a14", borderRadius: 14, padding: 5, marginBottom: 32, gap: 4 }}>
                {(["upload", "url"] as const).map((m) => (
                  <button key={m} onClick={() => { setMode(m); setError(null); }} className="tab-btn"
                    style={{
                      flex: 1, padding: "11px 0", borderRadius: 10, border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: 600, transition: "all .25s", fontFamily: "Inter, sans-serif",
                      background: mode === m
                        ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                        : "transparent",
                      color: mode === m ? "#fff" : "#555",
                      boxShadow: mode === m ? "0 4px 20px #7c3aed44, inset 0 1px 0 #ffffff22" : "none",
                    }}>
                    {m === "upload" ? "📁  Görsel Yükle" : "🔗  URL Analiz Et"}
                  </button>
                ))}
              </div>

              {/* Upload Zone */}
              {mode === "upload" && (
                <div onClick={() => fileRef.current?.click()} onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)} className="upload-zone"
                  style={{
                    border: `2px dashed ${dragOver ? "#7c3aed" : imagePreview ? "#7c3aed55" : "#1e1e2e"}`,
                    borderRadius: 16, padding: imagePreview ? 20 : 48, textAlign: "center", cursor: "pointer",
                    background: dragOver ? "#7c3aed0a" : "#0a0a14", transition: "all .25s", position: "relative",
                  }}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

                  {imagePreview ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={imagePreview} alt="preview" style={{
                        maxHeight: 260, maxWidth: "100%", borderRadius: 12, objectFit: "contain",
                        boxShadow: "0 8px 40px #00000088"
                      }} />
                      <button onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                        style={{
                          position: "absolute", top: -10, right: -10, background: "linear-gradient(135deg,#ef4444,#dc2626)",
                          border: "2px solid #080810", borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                          boxShadow: "0 4px 12px #ef444455",
                        }}>
                        <X size={13} />
                      </button>
                      <p style={{ marginTop: 12, color: "#444", fontSize: 12 }}>{imageFile?.name}</p>
                    </div>
                  ) : (
                    <>
                      <div style={{
                        width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#1a1a2e,#0f0f1e)",
                        border: "1px solid #7c3aed22", display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px", animation: "float 4s ease-in-out infinite",
                      }}>
                        <Upload size={26} color="#7c3aed" />
                      </div>
                      <p style={{ color: "#888", fontSize: 16, marginBottom: 8, fontWeight: 500 }}>Görseli buraya sürükle ya da tıkla</p>
                      <p style={{ color: "#333", fontSize: 13 }}>PNG, JPG, WebP — Her boyut desteklenir</p>
                    </>
                  )}
                </div>
              )}

              {/* URL Input */}
              {mode === "url" && (
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                    width: 34, height: 34, borderRadius: 10, background: "#1a1a2e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Link size={16} color="#7c3aed" />
                  </div>
                  <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://ornek.com"
                    style={{
                      width: "100%", padding: "16px 16px 16px 60px",
                      background: "#0a0a14", border: "1px solid #1e1e2e", borderRadius: 14,
                      color: "#fff", fontSize: 15, outline: "none", fontFamily: "Inter, sans-serif",
                      transition: "border-color .2s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                    onBlur={(e) => e.target.style.borderColor = "#1e1e2e"} />
                </div>
              )}

              {/* Context */}
              <div style={{ marginTop: 16 }}>
                <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3}
                  placeholder="İsteğe bağlı: Hedef kitle ve amaç — örn: 'E-ticaret, 25-40 yaş mobil kullanıcılar'"
                  style={{
                    width: "100%", padding: "14px 16px", background: "#0a0a14",
                    border: "1px solid #1e1e2e", borderRadius: 14, color: "#ccc",
                    fontSize: 14, outline: "none", resize: "none", fontFamily: "Inter, sans-serif", lineHeight: 1.6,
                    transition: "border-color .2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                  onBlur={(e) => e.target.style.borderColor = "#1e1e2e"} />
              </div>

              {error && (
                <div style={{
                  marginTop: 14, padding: "12px 16px", borderRadius: 12,
                  background: "linear-gradient(135deg,#ef444410,#ef444405)", border: "1px solid #ef444430",
                  color: "#f87171", fontSize: 14, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              {/* Analyze Button */}
              <button onClick={handleAnalyze} disabled={loading} className="analyze-btn"
                style={{
                  width: "100%", marginTop: 20, padding: "17px 0",
                  background: loading ? "#2d1b69" : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                  border: "none", borderRadius: 14, color: "#fff", fontSize: 16, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 10, transition: "all .25s", fontFamily: "Inter, sans-serif",
                  boxShadow: loading ? "none" : "0 8px 32px #7c3aed44, inset 0 1px 0 #ffffff22",
                  letterSpacing: ".02em",
                }}>
                {loading ? (
                  <>
                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ color: "#a78bfa" }}>{loadingSteps[loadingStep]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analiz Et
                    <ArrowRight size={16} style={{ opacity: .6 }} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp .6s ease both" }}>

              {/* Score Card */}
              <div style={{
                ...glass, padding: "36px 40px",
                background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)",
                border: "1px solid rgba(124,58,237,0.2)",
                boxShadow: "0 0 60px rgba(124,58,237,0.08)",
                display: "flex", alignItems: "center", gap: 36,
              }}>
                <CircularScore score={analysis.score} color={scoreColor(analysis.score)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{
                      padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: scoreColor(analysis.score) + "20", color: scoreColor(analysis.score),
                      letterSpacing: ".04em",
                    }}>{scoreLabel(analysis.score)}</span>
                    <span style={{ fontSize: 12, color: "#333" }}>UI/UX Kalite Skoru</span>
                  </div>
                  <p style={{ color: "#bbb", fontSize: 15, lineHeight: 1.75 }}>{analysis.summary}</p>
                </div>
              </div>

              {/* Grid: Strengths + Critical */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ ...glass, padding: 28, border: "1px solid #22c55e18", background: "rgba(34,197,94,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "#22c55e15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckCircle size={17} color="#22c55e" />
                    </div>
                    <span style={{ color: "#22c55e", fontSize: 14, fontWeight: 700, letterSpacing: ".03em" }}>Güçlü Yönler</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {analysis.strengths.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", marginTop: 8, flexShrink: 0, boxShadow: "0 0 6px #22c55e" }} />
                        <span style={{ color: "#aaa", fontSize: 13, lineHeight: 1.65 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {analysis.critical_issues?.length > 0 && (
                  <div style={{ ...glass, padding: 28, border: "1px solid #ef444418", background: "rgba(239,68,68,0.03)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#ef444415", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <AlertTriangle size={17} color="#ef4444" />
                      </div>
                      <span style={{ color: "#ef4444", fontSize: 14, fontWeight: 700, letterSpacing: ".03em" }}>Kritik Sorunlar</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {analysis.critical_issues.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", marginTop: 8, flexShrink: 0, boxShadow: "0 0 6px #ef4444" }} />
                          <span style={{ color: "#aaa", fontSize: 13, lineHeight: 1.65 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Improvements */}
              <div style={{ ...glass, padding: 32, border: "1px solid #f59e0b18", background: "rgba(245,158,11,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f59e0b15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Lightbulb size={17} color="#f59e0b" />
                  </div>
                  <span style={{ color: "#f59e0b", fontSize: 14, fontWeight: 700, letterSpacing: ".03em" }}>İyileştirme Önerileri</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {analysis.improvements.map((s, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px",
                      background: "#f59e0b08", borderRadius: 12, border: "1px solid #f59e0b10",
                    }}>
                      <span style={{
                        color: "#f59e0b", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2,
                        width: 22, height: 22, borderRadius: 6, background: "#f59e0b18",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{i + 1}</span>
                      <span style={{ color: "#aaa", fontSize: 13.5, lineHeight: 1.65 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility + Mobile */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ ...glass, padding: 26, border: "1px solid #6366f118", background: "rgba(99,102,241,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "#6366f115", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Eye size={15} color="#6366f1" />
                    </div>
                    <span style={{ color: "#6366f1", fontSize: 13, fontWeight: 700 }}>Erişilebilirlik</span>
                  </div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>{analysis.accessibility}</p>
                </div>
                <div style={{ ...glass, padding: 26, border: "1px solid #06b6d418", background: "rgba(6,182,212,0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "#06b6d415", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Smartphone size={15} color="#06b6d4" />
                    </div>
                    <span style={{ color: "#06b6d4", fontSize: 13, fontWeight: 700 }}>Mobil Uyumluluk</span>
                  </div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>{analysis.mobile}</p>
                </div>
              </div>

              {/* Restart Button */}
              <button className="restart-btn"
                onClick={() => { setAnalysis(null); setImageFile(null); setImagePreview(null); setUrl(""); setContext(""); }}
                style={{
                  padding: "15px 0", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 14,
                  color: "#444", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .25s",
                  fontFamily: "Inter, sans-serif", letterSpacing: ".02em",
                }}>
                ↺ &nbsp;Yeni Analiz Başlat
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 60, color: "#222", fontSize: 12, letterSpacing: ".04em" }}>
            Powered by OpenRouter &nbsp;·&nbsp; Gemma & Nemotron Vision Models
          </div>
        </div>
      </main>
    </>
  );
}
