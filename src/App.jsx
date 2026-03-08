import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Font Injection ──────────────────────────────────────────────────────── */
if (!document.getElementById("wb-font")) {
  const l = document.createElement("link");
  l.id = "wb-font";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{width:100%;min-height:100vh;}
:root{
  --ink:#0d0d0d;--paper:#f5f0e8;--amber:#e8a020;--amber-deep:#b07010;
  --amber-light:#fef3d0;--steel:#2a2a2a;--steel2:#3d3d3d;--rule:#d0c8b8;
  --muted:#7a7060;--white:#ffffff;--green:#2d7a4a;--red:#b03030;
  --shadow:0 4px 24px rgba(0,0,0,0.12);
}
body{background:var(--paper);color:var(--ink);font-family:'Barlow',sans-serif;line-height:1.4}
.app{width:100%;max-width:460px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--paper);position:relative}

/* Header */
.hdr{background:var(--ink);padding:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;letter-spacing:3px;color:var(--amber);text-transform:uppercase}
.logo em{color:var(--white);font-style:normal}
.version{font-size:10px;font-weight:600;letter-spacing:2px;color:var(--steel2);background:var(--steel);padding:3px 8px;border-radius:3px;text-transform:uppercase}

/* Tabs */
.tabs{display:flex;width:100%;border-bottom:3px solid var(--ink);background:var(--white)}
.tab{flex:1;padding:12px 8px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--muted);border-bottom:3px solid transparent;margin-bottom:-3px;transition:all .15s}
.tab.on{color:var(--ink);border-bottom-color:var(--amber)}

/* Page */
.page{flex:1;padding:20px;overflow-y:auto}

/* Card */
.card{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;margin-bottom:16px;overflow:hidden}
.card-hd{background:var(--ink);padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber)}
.card-bd{padding:16px}

/* Mic */
.mic-wrap{text-align:center;padding:28px 0 20px}
.mic-hint{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:22px}
.mic-btn{
  width:110px;height:110px;border-radius:50%;
  border:2.5px solid var(--amber);background:var(--white);
  display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  cursor:pointer;transition:all .18s;
  font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--amber);
  box-shadow:0 0 0 0 rgba(232,160,32,.4)
}
.mic-btn:hover{background:var(--amber-light);transform:scale(1.04)}
.mic-btn.live{border-color:var(--red);color:var(--red);background:#fff5f5;animation:sonar 1.1s ease-out infinite}
.mic-icon{font-size:34px;line-height:1}
@keyframes sonar{0%{box-shadow:0 0 0 0 rgba(176,48,48,.5)}70%{box-shadow:0 0 0 22px rgba(176,48,48,0)}100%{box-shadow:0 0 0 0 rgba(176,48,48,0)}}

/* Transcript */
.tx-box{background:var(--ink);border-radius:4px;padding:14px 16px;min-height:70px;font-size:14px;line-height:1.6;color:var(--paper);margin-bottom:14px;position:relative;border:1.5px solid var(--steel)}
.tx-ph{color:#666;font-style:italic;font-size:13px}
.tx-box::placeholder{color:#666;font-style:italic}
.tx-cursor{display:inline-block;width:2px;height:14px;background:var(--amber);margin-left:2px;animation:blink .8s steps(1) infinite;vertical-align:middle}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* Buttons */
.btn{padding:12px 18px;border-radius:3px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn-cta{background:var(--amber);color:var(--ink);flex:2}
.btn-cta:hover:not(:disabled){background:var(--amber-deep);color:var(--white)}
.btn-ghost{background:var(--white);color:var(--ink);border:1.5px solid var(--rule);flex:1}
.btn-ghost:hover{border-color:var(--ink)}
.btn-row{display:flex;gap:10px}
.btn-full{width:100%;padding:14px}

/* Loading */
.loader{height:3px;background:linear-gradient(90deg,transparent 0%,var(--amber) 50%,transparent 100%);background-size:200%;animation:sweep 1s linear infinite;border-radius:2px;margin-bottom:16px}
@keyframes sweep{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Quote Doc */
.qdoc{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:16px;box-shadow:var(--shadow)}
.qdoc-hd{background:var(--ink);padding:18px 22px 16px}
.qdoc-biz{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;letter-spacing:3px;color:var(--amber);text-transform:uppercase}
.qdoc-trade{font-size:12px;font-weight:500;letter-spacing:1px;color:#888;margin-top:2px}
.qdoc-stripe{height:4px;background:var(--amber)}
.qdoc-body{padding:20px 22px}
.qdoc-meta-row{display:flex;justify-content:space-between;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--rule)}
.qdoc-meta-cell{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
.qdoc-meta-cell span{display:block;font-size:14px;font-weight:600;color:var(--ink);margin-top:3px;letter-spacing:0;text-transform:none}
.qdoc-job{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--rule);letter-spacing:.5px}
.sec-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:8px}
.li-table{width:100%;margin-bottom:16px}
.li-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px dashed var(--rule)}
.li-row:last-child{border-bottom:none}
.li-name{font-size:14px;font-weight:500;color:var(--ink)}
.li-sub{font-size:11px;color:var(--muted);margin-top:1px}
.li-amt{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:var(--ink);white-space:nowrap}
.totals{background:var(--ink);margin:0 -22px -20px;padding:16px 22px}
.total-row{display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:5px}
.total-final{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--amber);border-top:1px solid #333;padding-top:10px;margin-top:8px;display:flex;justify-content:space-between;letter-spacing:1px}
.qdoc-notes{margin-top:14px;font-size:12px;color:var(--muted);line-height:1.6;padding-top:12px;border-top:1px solid var(--rule)}
.qdoc-notes strong{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:4px}

/* Editable fields */
.editable{background:none;border:none;border-bottom:1.5px dashed var(--rule);outline:none;font-family:inherit;color:inherit;width:100%;cursor:text;transition:border-color .15s}
.editable:focus{border-bottom-color:var(--amber);background:var(--amber-light)}
.editable-name{font-size:14px;font-weight:500}
.editable-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:.5px;width:100%;padding:2px 0}
.editable-amt{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-align:right;width:70px}
.editable-num{width:50px;text-align:center;font-size:11px}
.editable-meta{font-size:14px;font-weight:600}

/* Editable fields */
.editable{background:none;border:none;border-bottom:1.5px dashed var(--rule);outline:none;font-family:inherit;color:inherit;width:100%;cursor:text;transition:border-color .15s}
.editable:focus{border-bottom-color:var(--amber);background:var(--amber-light)}
.editable-name{font-size:14px;font-weight:500}
.editable-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:.5px;width:100%;padding:2px 0}
.editable-amt{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-align:right;width:70px}
.editable-meta{font-size:14px;font-weight:600}

/* Send */
.send-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.send-row{display:flex;gap:8px;margin-bottom:10px}
.ph-input{flex:1;background:var(--white);border:1.5px solid var(--rule);border-radius:3px;padding:12px 14px;font-size:14px;font-family:'Barlow',sans-serif;color:var(--ink);outline:none}
.ph-input:focus{border-color:var(--amber)}
.btn-sms{background:var(--amber);color:var(--ink);border:none;border-radius:3px;padding:0 18px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:background .15s}
.btn-sms:hover{background:var(--amber-deep);color:var(--white)}

/* History */
.h-item{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:border-color .15s}
.h-item:hover{border-color:var(--amber)}
.h-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
.h-client{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.5px}
.h-total{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--amber)}
.h-job{font-size:13px;color:var(--muted);margin-bottom:8px}
.h-foot{display:flex;justify-content:space-between;align-items:center}
.h-date{font-size:11px;color:var(--muted)}
.chip{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:2px 8px;border-radius:2px}
.chip.sent{background:#e6f7ee;color:var(--green)}
.chip.draft{background:var(--amber-light);color:var(--amber-deep)}
.chip.saved{background:#e8f0fe;color:#1a56b0}

/* Setup */
.field{margin-bottom:14px}
.field label{display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.field input,.field select,.field textarea{width:100%;padding:11px 14px;background:var(--white);border:1.5px solid var(--rule);border-radius:3px;font-size:14px;font-family:'Barlow',sans-serif;color:var(--ink);outline:none;transition:border-color .15s}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--amber)}
.field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
.field textarea{resize:vertical;min-height:72px;line-height:1.5}
.field .field-hint{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.4}

/* Quote Terms Section */
.qdoc-terms{margin-top:14px;padding-top:12px;border-top:1px solid var(--rule)}
.qdoc-terms-row{margin-bottom:8px}
.qdoc-terms-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:3px}
.qdoc-terms-text{font-size:12px;color:var(--muted);line-height:1.6}

/* Empty */
.empty{text-align:center;padding:56px 0;color:var(--muted)}
.empty-icon{font-size:44px;margin-bottom:14px}
.empty p{font-size:14px;line-height:1.7}
.empty strong{color:var(--ink)}

/* Tip */
.tip{background:var(--amber-light);border-left:3px solid var(--amber);padding:12px 14px;border-radius:0 3px 3px 0;font-size:13px;line-height:1.6;margin-bottom:16px;color:var(--steel)}
.tip strong{color:var(--amber-deep)}

/* Toast */
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--amber);font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;border:1px solid var(--amber);z-index:999;white-space:nowrap;animation:slideUp .25s ease}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

/* Disclaimer */
.disclaimer{font-size:11px;color:var(--muted);line-height:1.5;padding:10px 14px;background:var(--amber-light);border-left:3px solid var(--amber);border-radius:0 3px 3px 0;margin-bottom:12px}
.disclaimer strong{color:var(--amber-deep)}

/* Footer */
.app-footer{text-align:center;padding:16px 20px;font-size:11px;color:var(--muted);border-top:1px solid var(--rule);margin-top:auto}
.app-footer a{color:var(--muted);text-decoration:underline;margin:0 6px}

/* Divider */
.div{height:1px;background:var(--rule);margin:16px 0}

::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--rule)}
`;

if (!document.getElementById("wb-css")) {
  const s = document.createElement("style");
  s.id = "wb-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const $$ = (n) => `$${Number(n || 0).toFixed(2)}`;
const todayStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const qNum = () => "WB-" + String(Date.now()).slice(-4);
const TRADES = ["Plumber","Electrician","HVAC Technician","Painter","Landscaper","Roofer","Carpenter","Handyman","Welder","Flooring Pro","Pressure Washer","Other"];

/* ─── AI Quote Parser ─────────────────────────────────────────────────────── */
async function aiParseQuote(transcript, bizName, trade, taxEnabled, taxRate) {
  const taxNote = taxEnabled && parseFloat(taxRate) > 0
    ? `Apply ${taxRate}% sales tax to all quotes.`
    : `Do NOT apply any sales tax. Set taxRate to 0 and tax to 0.`;
  const res = await fetch("/api/quote", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 900,
      messages: [{
        role: "user",
        content: `You are a quoting assistant for "${bizName}", a ${trade}. 

Spoken job description: "${transcript}"

Return ONLY valid JSON (no markdown, no explanation) with this exact shape:
{
  "clientName": "string or null",
  "jobTitle": "short 1-line job title",
  "lineItems": [
    {"desc": "description", "qty": 1, "unit": "hrs|ea|lot|sqft", "rate": 0.00, "total": 0.00}
  ],
  "subtotal": 0.00,
  "taxRate": 0,
  "tax": 0.00,
  "grandTotal": 0.00,
  "notes": "payment terms or warranty or null",
  "validDays": 30
}

Rules:
- Labor as its own line item (qty=hours, unit="hrs", rate=hourly rate)
- Materials as its own line item (unit="lot")  
- If flat rate given, one line item (unit="lot")
- ${taxNote}
- Use realistic ${trade} rates if not stated (e.g. plumber $95-125/hr)
- Round all numbers to 2 decimal places`
      }]
    })
  });
  const d = await res.json();
  const text = d.content[0].text.trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  const raw = text.slice(start, end + 1);
  return JSON.parse(raw);
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
export default function WrenchBid() {
  const [tab, setTab] = useState("new");
  const [biz, setBiz] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("wb_biz"));
      return stored || { name: "Your Business", trade: "Plumber", phone: "", email: "", licenseNum: "", paymentTerms: "", warranty: "", customTerms: "", taxEnabled: false, taxRate: "0" };
    }
    catch { return { name: "Your Business", trade: "Plumber", phone: "", email: "", licenseNum: "", paymentTerms: "", warranty: "", customTerms: "", taxEnabled: false, taxRate: "0" }; }
  });
  const [step, setStep] = useState("idle"); // idle | recording | processing | preview
  const [transcript, setTranscript] = useState("");
  const [quote, setQuote] = useState(null);
  const [clientPhone, setClientPhone] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wb_history")) || []; }
    catch { return []; }
  });
  const [toast, setToast] = useState(null);
  const recognitionRef = useRef(null);
  const toastTimer = useRef(null);
  const finalRef = useRef("");

  useEffect(() => {
    try { localStorage.setItem("wb_history", JSON.stringify(history)); } catch {}
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem("wb_biz", JSON.stringify(biz)); } catch {}
  }, [biz]);

  const ping = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  };

  /* ── Voice ── */
  const startRec = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { ping("Voice not supported — try Chrome on desktop/Android"); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.maxAlternatives = 1;
    finalRef.current = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalRef.current += t + " ";
        } else {
          interim = t;
        }
      }
      setTranscript(finalRef.current + interim);
    };
    r.onerror = (e) => { setStep("idle"); ping("Mic error: " + e.error); };
    r.onend = () => { if (step === "recording") setStep("idle"); };
    recognitionRef.current = r;
    r.start();
    setStep("recording");
    setTranscript("");
  }, [step]);

  const stopRec = () => {
    recognitionRef.current?.stop();
    setStep("idle");
  };

  const toggleMic = () => step === "recording" ? stopRec() : startRec();

  /* ── Generate ── */
  const generate = async () => {
    if (!transcript.trim()) { ping("Speak a job description first"); return; }
    setStep("processing");
    try {
      const data = await aiParseQuote(transcript, biz.name, biz.trade, biz.taxEnabled, biz.taxRate);
      setQuote({ ...data, qNum: qNum(), date: todayStr() });
      setStep("preview");
    } catch (e) {
      setStep("idle");
      ping("Parse error — try again or rephrase");
    }
  };

  /* ── Save ── */
  const saveToHistory = (status) => {
    if (!quote) return;
    const entry = { ...quote, status, transcript, bizName: biz.name, savedAt: new Date().toISOString() };
    setHistory(h => [entry, ...h]);
    return entry;
  };

  const sendSMS = () => {
    saveToHistory("sent");
    const msg = [
      `Hi${quote.clientName ? " " + quote.clientName : ""}! Quote from ${biz.name}.`,
      ``,
      `📋 ${quote.jobTitle}`,
      `💰 Total: ${$$(quote.grandTotal)}`,
      `📅 Valid: ${quote.validDays} days`,
      ``,
      biz.phone ? `📞 ${biz.phone}` : "Reply to confirm."
    ].join("\n");
    const p = clientPhone.replace(/\D/g, "");
    window.open(`sms:${p}?body=${encodeURIComponent(msg)}`);
    ping("SMS app opened ✓");
  };

  const copyText = () => {
    saveToHistory("draft");
    const lines = [
      `QUOTE — ${biz.name}`,
      `${"─".repeat(32)}`,
      `Job: ${quote.jobTitle}`,
      `Date: ${quote.date}   Quote #: ${quote.qNum}`,
      ``,
      ...quote.lineItems.map(l => `  ${l.desc.padEnd(22)} ${$$(l.total)}`),
      ``,
      `  Subtotal: ${$$(quote.subtotal)}`,
      quote.tax > 0 ? `  Tax (${quote.taxRate}%): ${$$(quote.tax)}` : null,
      `  TOTAL: ${$$(quote.grandTotal)}`,
      ``,
      `Valid for ${quote.validDays} days.`,
      quote.notes ? `\nNotes: ${quote.notes}` : null,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines).then(() => ping("Copied to clipboard ✓"));
  };

  const saveQuote = () => {
    saveToHistory("saved");
    ping("Quote saved ✓");
  };

  const newQuote = () => { setQuote(null); setTranscript(""); setStep("idle"); setClientPhone(""); };
  const clearHistory = () => {
    if (window.confirm("Delete all saved quotes? This cannot be undone.")) {
      setHistory([]);
      ping("History cleared");
    }
  };

  /* ─── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className="app">

      {/* Header */}
      <header className="hdr">
        <div className="logo">Wrench<em>Bid</em></div>
        <div className="version">Beta</div>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {[["new","⚡ New Quote"],["history","📋 History"],["setup","⚙ Setup"]].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {/* ─────────────── NEW QUOTE TAB ─────────────── */}
      {tab === "new" && (
        <div className="page">

          {/* Step: idle or recording */}
          {step !== "preview" && (
            <>
              <div className="tip">
                <strong>How it works:</strong> Tap the mic and describe the job out loud — client name, what you're doing, hours & rate, materials cost. WrenchBid builds the quote automatically.
              </div>

              <div className="mic-wrap">
                <div className="mic-hint">
                  {step === "recording" ? "🔴 Recording — tap to stop" : "Tap to start speaking"}
                </div>
                <button className={`mic-btn ${step === "recording" ? "live" : ""}`} onClick={toggleMic}>
                  <div className="mic-icon">{step === "recording" ? "⏹" : "🎙"}</div>
                  <div>{step === "recording" ? "STOP" : "SPEAK"}</div>
                </button>
              </div>

              <textarea
                className="tx-box"
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Your words appear here as you speak... or type directly"
                rows={4}
                style={{resize:"vertical",width:"100%",fontFamily:"inherit",fontSize:14,lineHeight:1.6,outline:"none",cursor:"text",border:"none",background:"var(--ink)",color:"var(--paper)"}}
              />

              {step === "processing" && <div className="loader" />}

              <div className="btn-row">
                <button className="btn btn-ghost" onClick={() => { setTranscript(""); finalRef.current = ""; }}>Clear</button>
                <button
                  className="btn btn-cta"
                  onClick={generate}
                  disabled={!transcript.trim() || step === "processing" || step === "recording"}
                >
                  {step === "processing" ? "Building..." : "⚡ Build Quote"}
                </button>
              </div>

              <div className="div" />

              <div className="tip">
                <strong>Example phrases:</strong><br />
                "Replace water heater for John Smith, 3 hours at $105/hr, parts cost $380"<br /><br />
                "Paint entire exterior of house, flat rate $1400, client is Maria Rodriguez"<br /><br />
                "Unclog main drain, 1.5 hours, $75 materials"
              </div>
            </>
          )}

          {/* Step: preview */}
          {step === "preview" && quote && (
            <>
              {/* Quote Document */}
              <div className="qdoc">
                <div className="qdoc-hd">
                  <div className="qdoc-biz">{biz.name}</div>
                  <div className="qdoc-trade">{biz.trade}{biz.phone ? ` · ${biz.phone}` : ""}</div>
                </div>
                <div className="qdoc-stripe" />
                <div className="qdoc-body">

                  <div className="qdoc-meta-row">
                    <div className="qdoc-meta-cell">
                      To<span>
                        <input
                          className="editable editable-meta"
                          value={quote.clientName || ""}
                          onChange={e => setQuote(q => ({...q, clientName: e.target.value}))}
                          placeholder="Client name"
                        />
                      </span>
                    </div>
                    <div className="qdoc-meta-cell" style={{textAlign:"right"}}>
                      Quote #<span>{quote.qNum}</span>
                    </div>
                  </div>

                  <div className="qdoc-meta-row" style={{marginBottom:16}}>
                    <div className="qdoc-meta-cell">
                      Date<span>{quote.date}</span>
                    </div>
                    <div className="qdoc-meta-cell" style={{textAlign:"right"}}>
                      Valid
                      <span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4,marginTop:3}}>
                        <input
                          type="number"
                          value={quote.validDays}
                          onChange={e => setQuote(q => ({...q, validDays: Number(e.target.value)}))}
                          style={{width:44,padding:"2px 6px",fontFamily:"'Barlow',sans-serif",fontSize:14,fontWeight:600,color:"var(--ink)",background:"var(--paper)",border:"1.5px solid var(--rule)",borderRadius:3,outline:"none",textAlign:"center"}}
                        />
                        <span style={{fontWeight:600,fontSize:14,color:"var(--ink)",letterSpacing:0,textTransform:"none"}}>days</span>
                      </span>
                    </div>
                  </div>

                  <div className="sec-label">Scope of Work</div>
                  <div className="qdoc-job">
                    <input
                      className="editable editable-title"
                      value={quote.jobTitle || ""}
                      onChange={e => setQuote(q => ({...q, jobTitle: e.target.value}))}
                      placeholder="Job title"
                    />
                  </div>

                  <div className="sec-label">Line Items</div>
                  <div className="li-table">
                    {quote.lineItems.map((li, i) => (
                      <div className="li-row" key={i}>
                        <div style={{flex:1,marginRight:8}}>
                          <input
                            className="editable editable-name"
                            value={li.desc}
                            onChange={e => setQuote(q => {
                              const items = [...q.lineItems];
                              items[i] = {...items[i], desc: e.target.value};
                              return {...q, lineItems: items};
                            })}
                          />
                          {li.qty !== 1 && (
                            <div className="li-sub">{li.qty} {li.unit} × {$$(li.rate)}</div>
                          )}
                        </div>
                        <input
                          className="editable editable-amt"
                          value={li.total}
                          type="number"
                          onChange={e => setQuote(q => {
                            const items = [...q.lineItems];
                            items[i] = {...items[i], total: parseFloat(e.target.value) || 0};
                            const subtotal = items.reduce((s, l) => s + l.total, 0);
                            const tax = subtotal > 150 ? parseFloat((subtotal * (q.taxRate/100)).toFixed(2)) : 0;
                            return {...q, lineItems: items, subtotal: parseFloat(subtotal.toFixed(2)), tax, grandTotal: parseFloat((subtotal + tax).toFixed(2))};
                          })}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="qdoc-notes">
                    <strong>Notes</strong>
                    <input
                      className="editable"
                      style={{fontSize:12,color:"var(--muted)",marginTop:4,width:"100%"}}
                      value={quote.notes || ""}
                      onChange={e => setQuote(q => ({...q, notes: e.target.value}))}
                      placeholder="Payment terms, warranty, etc."
                    />
                  </div>

                  {(biz.paymentTerms || biz.warranty || biz.customTerms || biz.licenseNum) && (
                    <div className="qdoc-terms">
                      {biz.paymentTerms && (
                        <div className="qdoc-terms-row">
                          <div className="qdoc-terms-label">Payment Terms</div>
                          <div className="qdoc-terms-text">{biz.paymentTerms}</div>
                        </div>
                      )}
                      {biz.warranty && (
                        <div className="qdoc-terms-row">
                          <div className="qdoc-terms-label">Warranty</div>
                          <div className="qdoc-terms-text">{biz.warranty}</div>
                        </div>
                      )}
                      {biz.customTerms && (
                        <div className="qdoc-terms-row">
                          <div className="qdoc-terms-label">Terms & Conditions</div>
                          <div className="qdoc-terms-text">{biz.customTerms}</div>
                        </div>
                      )}
                      {biz.licenseNum && (
                        <div className="qdoc-terms-row">
                          <div className="qdoc-terms-label">License #</div>
                          <div className="qdoc-terms-text">{biz.licenseNum}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="disclaimer">
                    <strong>Estimate only.</strong> Review all pricing before sending to clients. WrenchBid is not liable for inaccuracies in AI-generated quotes.
                  </div>

                  <div className="totals">
                    <div className="total-row"><span>Subtotal</span><span>{$$(quote.subtotal)}</span></div>
                    {quote.tax > 0 && (
                      <div className="total-row"><span>Tax ({quote.taxRate}%)</span><span>{$$(quote.tax)}</span></div>
                    )}
                    <div className="total-final"><span>TOTAL</span><span>{$$(quote.grandTotal)}</span></div>
                  </div>
                </div>
              </div>

              <div className="send-lbl">Send to Client</div>
              <div className="send-row">
                <input
                  className="ph-input"
                  type="tel"
                  placeholder="Client phone number"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                />
                <button className="btn-sms" onClick={sendSMS}>📱 SMS</button>
              </div>

              <div className="btn-row" style={{marginBottom:8}}>
                <button className="btn btn-cta" style={{flex:1}} onClick={saveQuote}>💾 Save Quote</button>
                <button className="btn btn-ghost" onClick={copyText}>📋 Copy</button>
                <button className="btn btn-ghost" onClick={newQuote}>+ New</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─────────────── HISTORY TAB ─────────────── */}
      {tab === "history" && (
        <div className="page" style={{width:"100%"}}>
          {history.length === 0
            ? <div className="empty">
                <div className="empty-icon">📋</div>
                <p>No quotes yet.<br /><strong>Tap "New Quote"</strong> to get started.</p>
              </div>
            : <div style={{width:"100%"}}>
                <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                  <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 14px",color:"var(--red)",borderColor:"var(--red)"}} onClick={clearHistory}>Clear All</button>
                </div>
                {history.map((q, i) => (
                  <div className="h-item" key={i} style={{position:"relative",width:"100%",boxSizing:"border-box"}}>
                    <div onClick={() => { setQuote(q); setStep("preview"); setTab("new"); }}>
                      <div className="h-top">
                        <div className="h-client">{q.clientName || "No client name"}</div>
                        <div className="h-total" style={{paddingRight:24}}>{$$(q.grandTotal)}</div>
                      </div>
                      <div className="h-job">{q.jobTitle}</div>
                      <div className="h-foot">
                        <div className="h-date">{new Date(q.savedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                        <div className={`chip ${q.status}`}>{q.status}</div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setHistory(h => h.filter((_,j) => j !== i)); }}
                      style={{position:"absolute",top:8,right:8,background:"none",border:"none",cursor:"pointer",fontSize:15,color:"var(--muted)",lineHeight:1,padding:"4px 6px",borderRadius:3}}
                    >✕</button>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ─────────────── SETUP TAB ─────────────── */}
      {tab === "setup" && (
        <div className="page">
          <div className="card">
            <div className="card-hd">Your Business Profile</div>
            <div className="card-bd">
              <div className="field">
                <label>Business Name</label>
                <input value={biz.name} onChange={e => setBiz(b=>({...b,name:e.target.value}))} placeholder="Mike's Plumbing LLC" />
              </div>
              <div className="field">
                <label>Your Trade</label>
                <select value={biz.trade} onChange={e => setBiz(b=>({...b,trade:e.target.value}))}>
                  {TRADES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" value={biz.phone} onChange={e => setBiz(b=>({...b,phone:e.target.value}))} placeholder="(720) 555-0100" />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={biz.email} onChange={e => setBiz(b=>({...b,email:e.target.value}))} placeholder="you@yourbusiness.com" />
              </div>
              <div className="field">
                <label>License # <span style={{fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:11}}>(optional)</span></label>
                <input value={biz.licenseNum} onChange={e => setBiz(b=>({...b,licenseNum:e.target.value}))} placeholder="e.g. CO-PLB-12345" />
              </div>

              <div className="field">
                <label>Sales Tax</label>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,letterSpacing:0,textTransform:"none",color:"var(--ink)",margin:0}}>
                    <input
                      type="checkbox"
                      checked={!!biz.taxEnabled}
                      onChange={e => setBiz(b=>({...b,taxEnabled:e.target.checked}))}
                      style={{width:16,height:16,accentColor:"var(--amber)",cursor:"pointer"}}
                    />
                    Apply sales tax to quotes
                  </label>
                </div>
                {biz.taxEnabled && (
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value={biz.taxRate}
                      onChange={e => setBiz(b=>({...b,taxRate:e.target.value}))}
                      placeholder="e.g. 8.5"
                      style={{width:90}}
                    />
                    <span style={{fontSize:14,color:"var(--muted)",fontWeight:500}}>% tax rate</span>
                  </div>
                )}
                {!biz.taxEnabled && (
                  <div className="field-hint">Tax will not appear on quotes.</div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">Quote Terms & Conditions</div>
            <div className="card-bd">
              <div className="tip" style={{marginBottom:14}}>
                <strong>These print on every quote automatically.</strong> Fill in what applies to your business — leave blank to skip.
              </div>
              <div className="field">
                <label>Payment Terms</label>
                <textarea
                  value={biz.paymentTerms}
                  onChange={e => setBiz(b=>({...b,paymentTerms:e.target.value}))}
                  placeholder="e.g. 50% deposit required before work begins. Balance due upon completion. Accepted: cash, check, Venmo, Zelle."
                />
              </div>
              <div className="field">
                <label>Warranty</label>
                <textarea
                  value={biz.warranty}
                  onChange={e => setBiz(b=>({...b,warranty:e.target.value}))}
                  placeholder="e.g. All labor warrantied for 1 year. Parts covered by manufacturer warranty only."
                />
              </div>
              <div className="field">
                <label>Additional Terms & Conditions</label>
                <textarea
                  value={biz.customTerms}
                  onChange={e => setBiz(b=>({...b,customTerms:e.target.value}))}
                  placeholder="e.g. Quote valid for stated number of days. Client is responsible for obtaining permits unless otherwise agreed. Any additional work beyond scope will require a separate written quote."
                />
              </div>
              <button className="btn btn-cta btn-full" onClick={() => { setTab("new"); ping("Profile saved ✓"); }}>
                Save Profile
              </button>
            </div>
          </div>

          <div className="tip" style={{marginTop:4}}>
            <strong>Your info shows on every quote.</strong> Add your phone so clients can call you directly from the SMS quote.
          </div>


          <div className="div" />

          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8}}>
            <strong style={{display:"block",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--amber-deep)",marginBottom:6}}>Roadmap</strong>
            ✅ Voice-to-quote via AI<br/>
            ✅ Quote preview + history<br/>
            ✅ SMS delivery<br/>
            🔜 PDF download<br/>
            🔜 Client e-signature<br/>
            🔜 Email delivery<br/>
            🔜 Stripe payment links in quotes
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      <footer className="app-footer">
        © 2026 WrenchBid &nbsp;·&nbsp;
        <a href="https://wrenchbid.vercel.app/terms" target="_blank" rel="noopener noreferrer">Terms</a>
        <a href="https://wrenchbid.vercel.app/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
      </footer>
    </div>
  );
}
