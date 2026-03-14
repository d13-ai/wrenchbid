import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* ─── Supabase ────────────────────────────────────────────────────────────── */
const supabase = createClient(
  "https://rnlrugxpnfanufevypge.supabase.co",
  "sb_publishable_N3Csawv8SnR4gO9YV7ZQkQ_s1fPC8yI"
);

/* ─── Font ────────────────────────────────────────────────────────────────── */
if (!document.getElementById("wb-font")) {
  const l = document.createElement("link");
  l.id = "wb-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap";
  document.head.appendChild(l);
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{width:100%;min-height:100vh;min-height:-webkit-fill-available;}
:root{
  --ink:#0d0d0d;--paper:#f5f0e8;--amber:#e8a020;--amber-deep:#b07010;
  --amber-light:#fef3d0;--steel:#2a2a2a;--steel2:#3d3d3d;--rule:#d0c8b8;
  --muted:#7a7060;--white:#ffffff;--green:#2d7a4a;--green-light:#e6f7ee;
  --red:#b03030;--blue:#1a4a8a;--blue-light:#e8f0fe;
  --shadow:0 4px 24px rgba(0,0,0,0.12);
}
body{background:var(--paper);color:var(--ink);font-family:'Barlow',sans-serif;line-height:1.4}
.app{width:100%;max-width:460px;margin:0 auto;min-height:100vh;min-height:-webkit-fill-available;display:flex;flex-direction:column;background:var(--paper);position:relative}
.hdr{background:var(--ink);padding:0 20px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:200}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;letter-spacing:3px;color:var(--amber);text-transform:uppercase}
.logo em{color:var(--white);font-style:normal}
.version{font-size:10px;font-weight:600;letter-spacing:2px;color:var(--steel2);background:var(--steel);padding:3px 8px;border-radius:3px;text-transform:uppercase}
.tabs{display:flex;width:100%;border-bottom:3px solid var(--ink);background:var(--white)}
.tab{flex:1;padding:10px 4px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:none;border:none;cursor:pointer;color:var(--muted);border-bottom:3px solid transparent;margin-bottom:-3px;transition:all .15s}
.tab.on{color:var(--ink);border-bottom-color:var(--amber)}
.page{flex:1;padding:20px;overflow-y:auto;-webkit-overflow-scrolling:touch}
.card{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;margin-bottom:16px;overflow:hidden}
.card-hd{background:var(--ink);padding:10px 16px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber)}
.card-bd{padding:16px}
.mic-wrap{text-align:center;padding:28px 0 20px}
.mic-hint{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:22px}
.mic-btn{width:110px;height:110px;border-radius:50%;border:2.5px solid var(--amber);background:var(--white);display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;transition:all .18s;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--amber);box-shadow:0 0 0 0 rgba(232,160,32,.4)}
.mic-btn:hover{background:var(--amber-light);transform:scale(1.04)}
.mic-btn.live{border-color:var(--red);color:var(--red);background:#fff5f5;animation:sonar 1.1s ease-out infinite}
.mic-icon{font-size:34px;line-height:1}
@keyframes sonar{0%{box-shadow:0 0 0 0 rgba(176,48,48,.5)}70%{box-shadow:0 0 0 22px rgba(176,48,48,0)}100%{box-shadow:0 0 0 0 rgba(176,48,48,0)}}
.tx-box{background:var(--ink);border-radius:4px;padding:14px 16px;min-height:70px;font-size:14px;line-height:1.6;color:var(--paper);margin-bottom:14px;border:1.5px solid var(--steel)}
.btn{padding:12px 18px;border-radius:3px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn-cta{background:var(--amber);color:var(--ink);flex:2}
.btn-cta:hover:not(:disabled){background:var(--amber-deep);color:var(--white)}
.btn-ghost{background:var(--white);color:var(--ink);border:1.5px solid var(--rule);flex:1}
.btn-ghost:hover{border-color:var(--ink)}
.btn-row{display:flex;gap:10px}
.btn-full{width:100%;padding:14px}
.loader{height:3px;background:linear-gradient(90deg,transparent 0%,var(--amber) 50%,transparent 100%);background-size:200%;animation:sweep 1s linear infinite;border-radius:2px;margin-bottom:16px}
@keyframes sweep{0%{background-position:200% 0}100%{background-position:-200% 0}}
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
.li-sub{font-size:11px;color:var(--muted);margin-top:1px}
.totals{background:var(--ink);margin:0 -22px -20px;padding:16px 22px}
.total-row{display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:5px}
.total-final{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--amber);border-top:1px solid #333;padding-top:10px;margin-top:8px;display:flex;justify-content:space-between;letter-spacing:1px}
.qdoc-notes{margin-top:14px;font-size:12px;color:var(--muted);line-height:1.6;padding-top:12px;border-top:1px solid var(--rule)}
.qdoc-notes strong{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:4px}
.editable{background:none;border:none;border-bottom:1.5px dashed var(--rule);outline:none;font-family:inherit;color:inherit;width:100%;cursor:text;transition:border-color .15s}
.editable:focus{border-bottom-color:var(--amber);background:var(--amber-light)}
.editable-name{font-size:14px;font-weight:500}
.editable-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:.5px;width:100%;padding:2px 0}
.editable-amt{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-align:right;width:70px}
.editable-meta{font-size:14px;font-weight:600}
.send-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.send-row{display:flex;gap:8px;margin-bottom:10px}
.ph-input{flex:1;background:var(--white);border:1.5px solid var(--rule);border-radius:3px;padding:12px 14px;font-size:16px;font-family:'Barlow',sans-serif;color:var(--ink);outline:none}
.ph-input:focus{border-color:var(--amber)}
.btn-sms{background:var(--amber);color:var(--ink);border:none;border-radius:3px;padding:0 18px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:background .15s}
.btn-sms:hover{background:var(--amber-deep);color:var(--white)}
.h-item{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;padding:14px 16px;margin-bottom:10px;cursor:pointer;transition:border-color .15s}
.h-item:hover{border-color:var(--amber)}
.h-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
.h-client{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.5px}
.h-total{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--amber)}
.h-job{font-size:13px;color:var(--muted);margin-bottom:8px}
.h-foot{display:flex;justify-content:space-between;align-items:center}
.h-date{font-size:11px;color:var(--muted)}
.chip{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:2px 8px;border-radius:2px}
.chip.sent{background:var(--green-light);color:var(--green)}
.chip.draft{background:var(--amber-light);color:var(--amber-deep)}
.chip.saved{background:var(--blue-light);color:var(--blue)}
.field{margin-bottom:14px}
.field label{display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.field input,.field select,.field textarea{width:100%;padding:11px 14px;background:var(--white);border:1.5px solid var(--rule);border-radius:3px;font-size:16px;font-family:'Barlow',sans-serif;color:var(--ink);outline:none;transition:border-color .15s}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--amber)}
.field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
.field textarea{resize:vertical;min-height:72px;line-height:1.5}
.field .field-hint{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.4}
.qdoc-terms{margin-top:14px;padding-top:12px;border-top:1px solid var(--rule)}
.qdoc-terms-row{margin-bottom:8px}
.qdoc-terms-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:3px}
.qdoc-terms-text{font-size:12px;color:var(--muted);line-height:1.6}
.empty{text-align:center;padding:56px 0;color:var(--muted)}
.empty-icon{font-size:44px;margin-bottom:14px}
.empty p{font-size:14px;line-height:1.7}
.empty strong{color:var(--ink)}
.tip{background:var(--amber-light);border-left:3px solid var(--amber);padding:12px 14px;border-radius:0 3px 3px 0;font-size:13px;line-height:1.6;margin-bottom:16px;color:var(--steel)}
.tip strong{color:var(--amber-deep)}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--amber);font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;border:1px solid var(--amber);z-index:999;white-space:nowrap;animation:slideUp .25s ease}
@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.disclaimer{font-size:11px;color:var(--muted);line-height:1.5;padding:10px 14px;background:var(--amber-light);border-left:3px solid var(--amber);border-radius:0 3px 3px 0;margin-bottom:12px}
.app-footer{text-align:center;padding:16px 20px;font-size:11px;color:var(--muted);border-top:1px solid var(--rule);margin-top:auto}
.app-footer a{color:var(--muted);text-decoration:underline;margin:0 6px}
.div{height:1px;background:var(--rule);margin:16px 0}
.auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
.ob-wrap{position:fixed;inset:0;z-index:1100;background:var(--ink);display:flex;flex-direction:column;overflow:hidden}
.ob-slides{display:flex;flex:1;transition:transform .4s cubic-bezier(.4,0,.2,1)}
.ob-slide{min-width:100%;padding:0 28px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.ob-icon{font-size:64px;margin-bottom:20px;line-height:1}
.ob-title{font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:var(--amber);line-height:1.1;margin-bottom:12px}
.ob-sub{font-size:15px;color:#b0a890;line-height:1.6;max-width:300px;margin:0 auto}
.ob-demo{background:#1a1a1a;border:1.5px solid var(--steel2);border-radius:6px;padding:14px 16px;margin:20px 0;width:100%;text-align:left}
.ob-demo-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ob-demo-text{font-size:14px;color:#e8e0d0;line-height:1.5;min-height:44px}
.ob-cursor{display:inline-block;width:2px;height:14px;background:var(--amber);margin-left:2px;animation:blink .7s step-end infinite;vertical-align:middle}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.ob-quote-preview{background:#1a1a1a;border:1.5px solid var(--steel2);border-radius:6px;padding:14px 16px;margin:20px 0;width:100%;text-align:left}
.ob-qrow{display:flex;justify-content:space-between;font-size:13px;color:#b0a890;padding:4px 0;border-bottom:1px solid #2a2a2a}
.ob-qrow:last-child{border-bottom:none;color:var(--amber);font-weight:700;font-size:15px;font-family:'Barlow Condensed',sans-serif;letter-spacing:1px}
.ob-phrases{margin:16px 0;width:100%;text-align:left;display:flex;flex-direction:column;gap:8px}
.ob-phrase{background:#1a1a1a;border-left:3px solid var(--amber);padding:10px 14px;border-radius:0 4px 4px 0;font-size:13px;color:#e8e0d0;font-style:italic;line-height:1.4}
.ob-dots{display:flex;gap:8px;justify-content:center;padding:16px 0}
.ob-dot{width:8px;height:8px;border-radius:50%;background:var(--steel2);transition:all .3s}
.ob-dot.on{background:var(--amber);width:24px;border-radius:4px}
.ob-footer{padding:16px 28px 32px;display:flex;flex-direction:column;gap:10px}
.ob-btn-main{width:100%;padding:15px;background:var(--amber);color:var(--ink);font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:900;letter-spacing:2px;text-transform:uppercase;border:none;border-radius:4px;cursor:pointer;transition:background .15s}
.ob-btn-main:hover{background:var(--amber-deep);color:var(--white)}
.ob-btn-skip{background:none;border:none;color:var(--steel2);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;padding:4px;font-family:'Barlow Condensed',sans-serif}
.ob-btn-skip:hover{color:#888}
.ob-btn-next{background:none;border:1.5px solid var(--steel2);color:#b0a890;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:4px;padding:12px;cursor:pointer;transition:all .15s}
.ob-btn-next:hover{border-color:var(--amber);color:var(--amber)}
.auth-box{background:var(--white);border-radius:6px;width:100%;max-width:380px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.4)}
.auth-hd{background:var(--ink);padding:24px;text-align:center}
.auth-logo{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:var(--amber)}
.auth-logo em{color:var(--white);font-style:normal}
.auth-tagline{font-size:12px;color:#888;margin-top:4px;letter-spacing:1px}
.auth-stripe{height:4px;background:var(--amber)}
.auth-bd{padding:24px}
.auth-tabs{display:flex;border-bottom:2px solid var(--rule);margin-bottom:20px}
.auth-tab{flex:1;padding:10px;background:none;border:none;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;margin-bottom:-2px}
.auth-tab.on{color:var(--ink);border-bottom-color:var(--amber)}
.auth-field{margin-bottom:14px}
.auth-field label{display:block;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:5px}
.auth-field input{width:100%;padding:12px 14px;background:var(--paper);border:1.5px solid var(--rule);border-radius:3px;font-size:16px;font-family:'Barlow',sans-serif;color:var(--ink);outline:none;transition:border-color .15s}
.auth-field input:focus{border-color:var(--amber)}
.auth-err{background:#fff0f0;border-left:3px solid var(--red);padding:10px 12px;font-size:13px;color:var(--red);border-radius:0 3px 3px 0;margin-bottom:14px;line-height:1.4}
.auth-foot{text-align:center;margin-top:14px;font-size:12px;color:var(--muted)}
.user-bar{display:flex;align-items:center;gap:8px}
.user-email{font-size:11px;color:#888;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.btn-signout{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:none;border:1px solid var(--steel2);color:#888;padding:3px 8px;border-radius:3px;cursor:pointer;font-family:'Barlow Condensed',sans-serif}
.btn-signout:hover{border-color:var(--amber);color:var(--amber)}

/* ── Rebate Wizard ── */
.rw-hero{background:var(--ink);border-radius:6px;padding:22px 20px;margin-bottom:16px;text-align:center}
.rw-hero-title{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:var(--amber);margin-bottom:6px}
.rw-hero-sub{font-size:13px;color:#aaa;line-height:1.6;margin-bottom:12px}
.rw-state-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(232,160,32,.15);border:1px solid rgba(232,160,32,.3);color:var(--amber);font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 14px;border-radius:20px}
.rw-progress{display:flex;align-items:center;gap:6px;margin-bottom:20px}
.rw-progress-bar{flex:1;height:4px;background:var(--rule);border-radius:2px;overflow:hidden}
.rw-progress-fill{height:100%;background:var(--amber);border-radius:2px;transition:width .3s ease}
.rw-progress-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.rw-question{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700;letter-spacing:.5px;color:var(--ink);margin-bottom:6px;line-height:1.3}
.rw-question-hint{font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.5}
.rw-options{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
.rw-opt{display:flex;align-items:center;gap:12px;padding:13px 16px;background:var(--white);border:1.5px solid var(--rule);border-radius:4px;cursor:pointer;transition:all .15s;text-align:left}
.rw-opt:hover{border-color:var(--amber);background:var(--amber-light)}
.rw-opt.sel{border-color:var(--amber);background:var(--amber-light)}
.rw-opt-icon{font-size:20px;line-height:1;width:28px;text-align:center;flex-shrink:0}
.rw-opt-text{flex:1}
.rw-opt-label{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.5px;color:var(--ink);display:block}
.rw-opt-desc{font-size:11px;color:var(--muted);margin-top:1px}
.rw-opt-check{width:18px;height:18px;border-radius:50%;border:2px solid var(--rule);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}
.rw-opt.sel .rw-opt-check{background:var(--amber);border-color:var(--amber)}
.rw-opt.sel .rw-opt-check::after{content:'✓';font-size:11px;font-weight:800;color:var(--ink)}
.rw-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
.rw-grid-opt{padding:14px 10px;background:var(--white);border:1.5px solid var(--rule);border-radius:4px;cursor:pointer;transition:all .15s;text-align:center}
.rw-grid-opt:hover{border-color:var(--amber);background:var(--amber-light)}
.rw-grid-opt.sel{border-color:var(--amber);background:var(--amber-light)}
.rw-grid-opt-icon{font-size:22px;margin-bottom:5px}
.rw-grid-opt-label{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.5px;color:var(--ink);display:block}
.rw-grid-opt-desc{font-size:10px;color:var(--muted);margin-top:2px}
.rw-nav{display:flex;gap:10px;margin-top:4px}
.rw-summary{background:var(--white);border:1.5px solid var(--rule);border-radius:4px;padding:14px 16px;margin-bottom:16px}
.rw-summary-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--amber-deep);margin-bottom:10px}
.rw-summary-row{display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;border-bottom:1px dashed var(--rule)}
.rw-summary-row:last-child{border-bottom:none}
.rw-summary-key{font-size:11px;color:var(--muted);font-weight:600}
.rw-summary-val{font-size:13px;font-weight:600;color:var(--ink)}
.rw-section{margin-bottom:20px}
.rw-section-label{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid var(--rule)}
.rw-card{background:var(--white);border:1.5px solid var(--rule);border-radius:6px;overflow:hidden;margin-bottom:10px;transition:box-shadow .15s}
.rw-card:hover{box-shadow:var(--shadow)}
.rw-card-hd{padding:12px 16px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;border-bottom:1px solid var(--rule)}
.rw-card-name{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;letter-spacing:.5px;color:var(--ink);flex:1;line-height:1.3}
.rw-card-amt{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:var(--green);white-space:nowrap;text-align:right}
.rw-card-bd{padding:12px 16px;font-size:13px;color:var(--muted);line-height:1.65}
.rw-card-bd ul{padding-left:16px;margin:5px 0}
.rw-card-bd li{margin-bottom:3px}
.rw-card-bd strong{color:var(--ink)}
.rw-card-ft{padding:9px 16px;background:var(--paper);border-top:1px solid var(--rule);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px}
.rw-card-expires{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:4px}
.rw-card-link{font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--blue);text-decoration:none;font-family:'Barlow Condensed',sans-serif;text-transform:uppercase}
.rw-card-link:hover{color:var(--amber-deep)}
.badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 8px;border-radius:2px;margin-left:6px;vertical-align:middle}
.badge-income{background:var(--green-light);color:var(--green)}
.badge-all{background:var(--blue-light);color:var(--blue)}
.badge-xcel{background:#fff3e0;color:#c45c00}
.badge-bhe{background:#e3f2fd;color:#0d47a1}
.badge-owner{background:#fce4ec;color:#880e4f}
.badge-expired{background:#ffebee;color:var(--red)}
.rw-total-bar{background:var(--ink);border-radius:6px;padding:16px 20px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center}
.rw-total-label{font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#888}
.rw-total-amt{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:var(--amber);letter-spacing:1px}
.rw-disc{font-size:11px;color:var(--muted);line-height:1.6;padding:10px 14px;background:var(--amber-light);border-left:3px solid var(--amber);border-radius:0 3px 3px 0;margin-bottom:14px}
.rw-no-state{text-align:center;padding:48px 20px}
.rw-no-state .icon{font-size:48px;margin-bottom:14px}
.rw-updated{font-size:10px;color:var(--muted);text-align:right;margin-bottom:14px;font-style:italic}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--rule)}
`;

if (!document.getElementById("wb-css")) {
  const s = document.createElement("style");
  s.id = "wb-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── Constants ───────────────────────────────────────────────────────────── */
const $$ = (n) => `$${Number(n || 0).toFixed(2)}`;
const todayStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const qNum = () => "WB-" + String(Date.now()).slice(-4);
const TRADES = ["Plumber","Electrician","HVAC Technician","Painter","Landscaper","Roofer","Carpenter","Handyman","Welder","Flooring Pro","Pressure Washer","Other"];
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

/* ══════════════════════════════════════════════════════════════════════════
   HARDCODED REBATE DATABASE — Colorado + Federal
   Last verified: March 2026
   Sources: energyoffice.colorado.gov, xcelenergy.com, evco.colorado.gov, IRS
   ══════════════════════════════════════════════════════════════════════════ */
const REBATE_DB = [

  /* ─────── FEDERAL ─────── */
  {
    id:"fed-ev-charger",
    source:"federal",
    sourceLabel:"Federal — IRS",
    name:"30C Alternative Fuel Vehicle Refueling Property Credit",
    amount:"Up to $1,000",
    amountNote:"30% of installation costs, max $1,000 for residential. Reduces federal tax bill dollar-for-dollar.",
    categories:["electrical","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Homeowners AND renters with tax liability. Applies to Level 2 EVSE installation.",
    requirements:["Charger must be ENERGY STAR or qualified EVSE","Must be installed at primary residence","You must have a federal tax liability to use the credit","Claim on IRS Form 8911"],
    contractorRole:"Provide itemized invoice showing labor and materials separately. Customer files on their own taxes.",
    howToApply:"Keep all receipts. File IRS Form 8911 with your federal tax return for the year of installation.",
    expires:"June 30, 2026 (expires unless Congress extends — install before then)",
    status:"active",
    url:"https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit",
    urlLabel:"IRS.gov",
    note:"⚠ Most other federal energy tax credits (25C, solar) expired December 31, 2025 per the One Big Beautiful Bill Act."
  },

  /* ─────── COLORADO STATE ─────── */
  {
    id:"co-hear-heat-pump",
    source:"state",
    sourceLabel:"Colorado — HEAR Program",
    name:"CO HEAR: Heat Pump Rebate (Cold Climate)",
    amount:"Up to $8,000",
    amountNote:"≤80% AMI: $8,000. 80–150% AMI: $4,000. Non-cold-climate units: $3,000 / $1,500.",
    categories:["hvac","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Colorado households at or below 150% of Area Median Income (AMI). Renters can qualify with landlord permission.",
    requirements:["Must be an existing single-family home (not new construction)","Must use a registered CO Energy Office contractor","Must be ENERGY STAR certified cold-climate heat pump","Primary residence only — no vacation/secondary homes","Income verification required"],
    contractorRole:"Must be a registered HEAR contractor. Rebate applied as upfront point-of-sale discount. File application with CO Energy Office on behalf of customer.",
    howToApply:"1) Customer confirms AMI eligibility at energyoffice.colorado.gov. 2) Contact a registered HEAR contractor. 3) Contractor submits application. 4) Rebate applied at installation.",
    expires:"Active through 2029 or until funds exhausted",
    status:"active",
    url:"https://energyoffice.colorado.gov/home-energy-rebates",
    urlLabel:"energyoffice.colorado.gov",
    canStack:"Can stack with Xcel Energy rebates and CO state heat pump tax credit. Cannot stack with other federal grants for the same measure."
  },
  {
    id:"co-hear-hpwh",
    source:"state",
    sourceLabel:"Colorado — HEAR Program",
    name:"CO HEAR: Heat Pump Water Heater Rebate",
    amount:"Up to $1,750",
    amountNote:"Income-qualified (≤150% AMI). Amount depends on income tier.",
    categories:["plumbing","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Colorado households at or below 150% AMI. Renters can qualify with landlord permission.",
    requirements:["Must be ENERGY STAR certified heat pump water heater","Existing home only (no new construction)","Must use registered HEAR contractor","Income verification required"],
    contractorRole:"Must be registered HEAR contractor. Apply rebate as upfront discount. Submit application to CO Energy Office.",
    howToApply:"Work with a registered HEAR contractor who handles the application process. Customer verifies income at energyoffice.colorado.gov.",
    expires:"Active through 2029 or until funds exhausted",
    status:"active",
    url:"https://energyoffice.colorado.gov/home-energy-rebates",
    urlLabel:"energyoffice.colorado.gov",
    canStack:"Stackable with Xcel HPWH rebate ($2,250) and CO state tax credit ($250)."
  },
  {
    id:"co-hear-panel",
    source:"state",
    sourceLabel:"Colorado — HEAR Program",
    name:"CO HEAR: Electrical Panel Upgrade Rebate",
    amount:"Up to $4,000",
    amountNote:"Income-qualified (≤150% AMI). Must accompany another qualifying electrification upgrade.",
    categories:["electrical","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Colorado households at or below 150% AMI installing a qualifying electrification upgrade (heat pump, HPWH, etc.).",
    requirements:["Must accompany another qualifying HEAR upgrade (e.g. heat pump)","ENERGY STAR or equivalent qualified equipment","Registered HEAR contractor required","Income verification required"],
    contractorRole:"Must be registered HEAR contractor. Panel upgrade and electrification upgrade should be submitted together.",
    howToApply:"Bundled with heat pump or other electrification project. Registered contractor handles application.",
    expires:"Active through 2029 or until funds exhausted",
    status:"active",
    url:"https://energyoffice.colorado.gov/home-energy-rebates",
    urlLabel:"energyoffice.colorado.gov"
  },
  {
    id:"co-hear-insulation",
    source:"state",
    sourceLabel:"Colorado — HEAR Program",
    name:"CO HEAR: Insulation & Air Sealing Rebate",
    amount:"Up to $1,600",
    amountNote:"Income-qualified (≤150% AMI). Can be combined with electrification projects up to $14,000 total household max.",
    categories:["insulation","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Colorado households at or below 150% AMI.",
    requirements:["Must meet program insulation/air sealing specifications","Registered HEAR contractor required","Income verification required","Existing home only"],
    contractorRole:"Must be registered HEAR contractor. Provide before/after documentation of insulation levels.",
    howToApply:"Contact a registered HEAR contractor who will coordinate application.",
    expires:"Active through 2029 or until funds exhausted",
    status:"active",
    url:"https://energyoffice.colorado.gov/home-energy-rebates",
    urlLabel:"energyoffice.colorado.gov"
  },
  {
    id:"co-hear-stove",
    source:"state",
    sourceLabel:"Colorado — HEAR Program",
    name:"CO HEAR: Electric Stove / Cooktop / Dryer",
    amount:"Up to $840 per appliance",
    amountNote:"Income-qualified (≤150% AMI). Replacing non-electric equipment or first-time installation only.",
    categories:["appliances","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Households replacing non-electric stove/cooktop/dryer, or installing electric for the first time.",
    requirements:["Must be ENERGY STAR certified","Must replace non-electric appliance OR be first-time installation","Registered HEAR contractor required","Income verification required"],
    contractorRole:"Must be registered HEAR contractor. Document removal of old gas/propane appliance if applicable.",
    howToApply:"Through registered HEAR contractor. Check energyoffice.colorado.gov for current eligible models.",
    expires:"Active through 2029 or until funds exhausted",
    status:"active",
    url:"https://energyoffice.colorado.gov/home-energy-rebates",
    urlLabel:"energyoffice.colorado.gov"
  },
  {
    id:"co-hp-taxcredit",
    source:"state",
    sourceLabel:"Colorado State Tax Credit",
    name:"CO Heat Pump State Tax Credit",
    amount:"Up to $1,000",
    amountNote:"$1,000 for qualifying air-source heat pump (HVAC), $250 for heat pump water heater. Applied as upfront discount by registered contractor — customer receives at least 33% of the credit as a line-item discount.",
    categories:["hvac","plumbing","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:true, utility:null,
    who:"All Colorado residents. No income limit. Contractor must be registered with CO Energy Office.",
    requirements:["Must be ENERGY STAR certified heat pump or HPWH","Registered CO Energy Office contractor required","Heat pump must be designed to meet at least 80% of annual heating needs","Contractor claims the tax credit and passes at least 33% to customer as invoice discount"],
    contractorRole:"Register with CO Energy Office Heat Pump Tax Credit program. Display 'State of Colorado Heat Pump Discount' as separate line item on invoice. You retain up to 66.67% of the credit.",
    howToApply:"Customer works with a registered contractor — discount applied at installation. Contractor applies for the tax credit through the CO Energy Office.",
    expires:"Ongoing (amounts reduced from 2025 levels; review annually)",
    status:"active",
    url:"https://energyoffice.colorado.gov/hptc",
    urlLabel:"energyoffice.colorado.gov/hptc",
    canStack:"Stackable with Xcel rebates and HEAR rebates."
  },
  {
    id:"co-weatherization",
    source:"state",
    sourceLabel:"Colorado — Weatherization Assistance",
    name:"CO Weatherization Assistance Program (WAP)",
    amount:"FREE (full cost covered)",
    amountNote:"No-cost home energy improvements for income-qualified households. Covers insulation, air sealing, HVAC tune-up, and more.",
    categories:["insulation","hvac","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Colorado households at or below 200% of the Federal Poverty Level. Renters may qualify if landlord participates.",
    requirements:["Income at or below 200% of Federal Poverty Level","Primary residence","Must apply through local Community Action Agency","Priority given to elderly, disabled, and families with young children"],
    contractorRole:"Not applicable — WAP contractors are assigned by the program. Refer income-qualified customers to call 1-855-469-4328.",
    howToApply:"Call 1-855-469-4328 or contact your local Community Action Agency. Apply through Colorado's WAP portal.",
    expires:"Ongoing",
    status:"active",
    url:"https://energyoffice.colorado.gov/weatherization-assistance-program",
    urlLabel:"energyoffice.colorado.gov/weatherization"
  },
  {
    id:"co-battery-credit",
    source:"state",
    sourceLabel:"Colorado State Tax Credit",
    name:"CO Battery Storage Tax Credit",
    amount:"10% of equipment cost",
    amountNote:"10% tax credit on eligible battery storage components, sales tax, and shipping. Separate from federal credits.",
    categories:["solar","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:null,
    who:"Colorado homeowners installing battery storage systems. No income limit.",
    requirements:["Qualifying battery storage equipment","File Colorado DR-1307 form","System must be on qualifying equipment list"],
    contractorRole:"Provide itemized invoice with equipment, installation, and sales tax listed separately. Customer files DR-1307.",
    howToApply:"Customer files Colorado DR-1307 tax form at tax time. Keep all receipts and equipment documentation.",
    expires:"Ongoing",
    status:"active",
    url:"https://energyoffice.colorado.gov",
    urlLabel:"energyoffice.colorado.gov"
  },
  {
    id:"co-ev-taxcredit",
    source:"state",
    sourceLabel:"Colorado State Tax Credit",
    name:"CO EV / PHEV Purchase Tax Credit",
    amount:"Up to $6,000",
    amountNote:"Up to $6,000 for new EV/PHEV purchase. Applied at point of sale through dealership.",
    categories:["electrical","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Any Colorado resident purchasing a new EV or qualifying PHEV. No income limit.",
    requirements:["New electric vehicle or qualifying PHEV","Purchase from authorized Colorado dealer","Vehicle must meet state qualifying criteria","Applied as point-of-sale discount at dealership"],
    contractorRole:"Not directly applicable to contractor work. Relevant if customer is asking about EV overall cost.",
    howToApply:"Discount applied by the dealership at point of sale. No separate application needed.",
    expires:"Ongoing (consult energyoffice.colorado.gov for current amounts)",
    status:"active",
    url:"https://evco.colorado.gov/get-the-facts/save-money",
    urlLabel:"evco.colorado.gov"
  },
  {
    id:"co-vxc",
    source:"state",
    sourceLabel:"Colorado — Vehicle Exchange Program",
    name:"Vehicle Exchange Colorado (VXC) — Income-Qualified EV",
    amount:"Up to $9,000 (new) / $6,000 (used)",
    amountNote:"Income-qualified only. $9,000 toward new BEV/PHEV (MSRP ≤$80,000) or $6,000 toward used BEV/PHEV (≤$50,000). One per household.",
    categories:["electrical","all"],
    incomeRequired:true, ownerRequired:false,
    renterOk:true, utility:null,
    who:"Income-qualified Colorado residents replacing older/high-emitting vehicles with EVs. Income limits apply.",
    requirements:["Must trade in eligible high-emitting vehicle","Must meet income requirements","Purchase from authorized dealer","One rebate per tax household"],
    contractorRole:"Not applicable. Relevant context for customers asking about EV overall incentives.",
    howToApply:"Apply through authorized VXC dealer. Visit evco.colorado.gov for current income limits and dealer list.",
    expires:"While funds last (active as of March 2026)",
    status:"active",
    url:"https://evco.colorado.gov",
    urlLabel:"evco.colorado.gov"
  },

  /* ─────── XCEL ENERGY ─────── */
  {
    id:"xcel-hp-cold",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Cold Climate Heat Pump Rebate",
    amount:"$2,250/heating ton",
    amountNote:"Typical 3–4 ton home = $6,400–$9,000 upfront. Gas customers: +1.5× bonus through 2025 invoices (submit by Sept 2026). Must be cold-climate ASHP or mini-split.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy gas customers (or electric customers with electric heat). Single-family, duplexes, fourplexes. No income requirement.",
    requirements:["Must have Xcel Energy gas OR electric service","Cold-climate ASHP or mini-split rated at 5°F","ENERGY STAR certified","Invoice dated 2025 or 2026","Participating contractor required for upfront rebate","Single-family, duplex, or fourplex only"],
    contractorRole:"Become an Xcel participating contractor. Apply rebate directly to customer invoice — Xcel pays you back directly. No waiting for rebate checks for customer.",
    howToApply:"Work with an Xcel-approved participating contractor. Submit rebate application to xcelenergy.com after installation.",
    expires:"Active — amounts effective Nov 16, 2025 (subject to change)",
    status:"active",
    url:"https://co.my.xcelenergy.com/s/residential/heating-cooling",
    urlLabel:"xcelenergy.com",
    canStack:"Stack with CO HEAR ($4,000–$8,000 income-qualified), CO state tax credit ($1,000), and $600 insulation bonus."
  },
  {
    id:"xcel-hp-standard",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Standard Air Source Heat Pump Rebate",
    amount:"$900/cooling ton",
    amountNote:"For non-cold-climate ASHP at 95°F. Cold-climate units get the higher $2,250/ton rate.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy electric or gas customers. Single-family, duplexes, fourplexes.",
    requirements:["Xcel Energy service","ENERGY STAR certified ASHP","Invoice dated 2025 or 2026","Single-family/duplex/fourplex"],
    contractorRole:"Xcel participating contractor applies rebate to invoice.",
    howToApply:"Through Xcel participating contractor or submit at xcelenergy.com.",
    expires:"Active",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-hpwh",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Heat Pump Water Heater Rebate",
    amount:"$2,250",
    amountNote:"Flat rebate for qualifying ENERGY STAR HPWH. One of the highest HPWH rebates in Colorado.",
    categories:["plumbing","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy customers. No income requirement. Single-family, duplex, fourplex.",
    requirements:["Xcel Energy service","ENERGY STAR certified heat pump water heater","Invoice dated 2025 or 2026","Adequate installation space and electrical connections required"],
    contractorRole:"Verify Xcel rebate eligibility before install. Submit rebate application through xcelenergy.com contractor portal.",
    howToApply:"Contractor submits rebate after installation. Customer can also submit at xcelenergy.com/rebates.",
    expires:"Active",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com",
    canStack:"Stack with CO HEAR ($1,750 income-qualified) and CO state tax credit ($250)."
  },
  {
    id:"xcel-whe",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Whole Home Efficiency (WHE) — 25% Bonus",
    amount:"25% bonus on all standard rebates",
    amountNote:"Install 3+ qualifying measures within 2 years after an energy audit = 25% bonus on ALL standard rebates. Plus $600 extra if you do insulation before heat pump. Typical bonus: $1,500–$2,500 extra.",
    categories:["hvac","insulation","plumbing","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Any Xcel Energy residential customer doing 3+ qualifying improvements within 2 years of enrolling.",
    requirements:["Must start with an Xcel-approved energy audit","Complete 3+ qualifying measures within 2 years","Qualifying measures: heat pumps, insulation, air sealing, HPWH, and more","Must enroll before completing measures"],
    contractorRole:"Be an Xcel-approved energy auditor and/or contractor. Coordinate all three measures to maximize customer savings. Bundle projects across the two-year window.",
    howToApply:"Customer enrolls in WHE program at xcelenergy.com. Schedule energy audit first. Then complete 3 qualifying measures.",
    expires:"Active",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-insulation",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Insulation & Air Sealing Rebate",
    amount:"$400–$750+",
    amountNote:"Attic insulation: pay-per-performance based on R-value improvement × square footage. Wall insulation: $400 standard. Plus $600 bonus if completed before heat pump install. WHE bonus adds 25%.",
    categories:["insulation","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy customers. No income requirement.",
    requirements:["Xcel Energy service (gas or electric with AC/heat)","Must meet minimum R-value improvement thresholds","Professional installation required","Invoice dated 2025 or 2026"],
    contractorRole:"Submit rebate application with before/after insulation documentation. Blower door test results help maximize rebate for attic insulation.",
    howToApply:"Submit at xcelenergy.com/rebates after installation with receipts and documentation.",
    expires:"Active",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-thermostat",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Smart Thermostat Rebate",
    amount:"$100 + $25/year",
    amountNote:"$100 bill credit upon enrollment in AC Rewards program, then $25/year. Qualifying thermostats only.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy electric customers. No income requirement.",
    requirements:["Xcel Energy electric service","ENERGY STAR certified smart thermostat on approved list","Enroll in AC Rewards program","Must have central AC"],
    contractorRole:"Install qualifying thermostat and help customer enroll in AC Rewards program at xcelenergy.com.",
    howToApply:"Customer enrolls at xcelenergy.com. Check approved thermostat list before purchasing.",
    expires:"Ongoing",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-ac",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Central AC Rebate",
    amount:"$300/cooling ton",
    amountNote:"For qualifying ENERGY STAR central air conditioning units. Available to Xcel electric customers.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy electric customers with qualifying central AC installation.",
    requirements:["Xcel Energy electric service","ENERGY STAR certified central AC","Invoice dated 2025 or 2026"],
    contractorRole:"Submit rebate at xcelenergy.com after installation.",
    howToApply:"Submit at xcelenergy.com/rebates with invoice and model number.",
    expires:"Active",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-ev-charger",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel EV Accelerate At Home — Charger Rebate",
    amount:"Up to $1,300",
    amountNote:"Standard: $500. Income-qualified: up to $1,300. Networked Level 2 charger required. Charger must be on approved list (ChargePoint, etc.).",
    categories:["electrical","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy residential customers installing Level 2 home EV charger. Standard rate available to all; higher rate for income-qualified.",
    requirements:["Xcel Energy residential service","Networked Level 2 EVSE on Xcel approved list (ChargePoint, etc.)","Licensed electrician required for installation","Must enroll in Xcel time-of-use EV rate plan"],
    contractorRole:"Install approved Level 2 EVSE. Licensed electrician must complete installation. Help customer enroll in Xcel EV program.",
    howToApply:"Apply at ev.xcelenergy.com or xcelenergy.com/programs_and_rebates. Income documentation required for enhanced rebate.",
    expires:"Active through Dec 31, 2026",
    status:"active",
    url:"https://ev.xcelenergy.com",
    urlLabel:"ev.xcelenergy.com"
  },
  {
    id:"xcel-battery",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Renewable Battery Connect Rebate",
    amount:"$250/kW up to $5,000",
    amountNote:"Standard: $250/kW, max $5,000/application + $100/year participation. Income-qualified/DIC: $500/kW up to 75% of equipment cost. Eligible: Tesla Powerwall 2, 3, SolarEdge Home Battery.",
    categories:["solar","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy customers installing qualifying battery storage. Note: You agree to allow Xcel to use up to 60% of battery up to 60 times/year for 5 years (can un-enroll anytime).",
    requirements:["Xcel Energy service","Eligible battery: Tesla Powerwall 2/3/+, SolarEdge Home Battery","Accept program terms (grid participation during peak demand)","Homeowner only"],
    contractorRole:"Install qualifying battery. Help customer understand program terms. Apply for rebate after installation.",
    howToApply:"Apply at xcelenergy.com/battery after installation. Income documentation for enhanced rate.",
    expires:"Active (was temporarily closed, reopened 2026)",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-solar-net-metering",
    source:"utility",
    sourceLabel:"Xcel Energy",
    name:"Xcel Solar*Rewards & Net Metering",
    amount:"Bill credits for excess solar",
    amountNote:"Net metering: excess solar energy credited to your bill. Choose dollar credits (roll forward indefinitely) or kWh credits (cashed out annually at average incremental cost). Solar*Rewards program available for income-qualified/DIC customers with larger upfront incentives.",
    categories:["solar","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:"xcel",
    who:"Xcel Energy customers installing rooftop solar. Solar*Rewards income/DIC program has enhanced incentives.",
    requirements:["Xcel Energy electric service","Grid-tied solar PV system","Apply and receive Xcel engineering approval BEFORE starting construction","Homeowner only"],
    contractorRole:"Do NOT begin construction until customer has received full Xcel engineering approval. Rushing this step risks losing eligibility. Help customer choose between dollar and kWh credit billing.",
    howToApply:"Apply at xcelenergy.com/solar BEFORE construction. Engineering approval can take several weeks.",
    expires:"Ongoing",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },
  {
    id:"xcel-mountain-energy",
    source:"utility",
    sourceLabel:"Xcel Energy — Mountain Energy Project",
    name:"Xcel Mountain Energy Project (High Altitude)",
    amount:"3–6× standard rebates",
    amountNote:"Mini-splits: up to $7,500/ton. Ground-source heat pumps: up to $20,000/ton. Only for specific high-altitude ZIP codes.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"xcel",
    who:"Xcel customers in qualifying high-altitude ZIP codes: 80424 (Breckenridge), 80435 (Dillon), 80443 (Frisco), 80447 (Grand Lake), 80461 (Leadville), 80497/80498 (Silverthorne), 81649 (Red Cliff).",
    requirements:["Active Xcel natural gas service required","Must be in qualifying ZIP code","Program year Dec 15, 2025–2026","Launch bonus for installs before April 15, 2026"],
    contractorRole:"Verify customer ZIP code eligibility. Apply through Xcel Mountain Energy Project portal.",
    howToApply:"Contact Xcel Energy Mountain Energy Project team. Visit xcelenergy.com for current program details.",
    expires:"Dec 2026 program year",
    status:"active",
    url:"https://www.xcelenergy.com/programs_and_rebates",
    urlLabel:"xcelenergy.com"
  },

  /* ─────── BLACK HILLS ENERGY ─────── */
  {
    id:"bhe-ev-charger",
    source:"utility",
    sourceLabel:"Black Hills Energy",
    name:"Black Hills Energy EV Charger Rebate",
    amount:"$500 standard / $1,300 income-qualified",
    amountNote:"Standard: $500. Income-qualified: $1,300. Must enroll in Black Hills time-of-use rate. Cannot stack with CO state EV tax credit.",
    categories:["electrical","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:"blackhills",
    who:"Black Hills Energy residential customers. Standard rate for all; $1,300 rate for income-qualified customers.",
    requirements:["Black Hills Energy service","Level 2 EV charger installation","Enroll in TOU rate schedule","Licensed electrician required"],
    contractorRole:"Install Level 2 EVSE. Help customer enroll in Black Hills TOU program to claim rebate.",
    howToApply:"Apply at blackhillsenergy.com or call Black Hills customer service.",
    expires:"Active through Dec 31, 2026",
    status:"active",
    url:"https://www.blackhillsenergy.com/efficiency-and-savings",
    urlLabel:"blackhillsenergy.com"
  },
  {
    id:"bhe-solar",
    source:"utility",
    sourceLabel:"Black Hills Energy",
    name:"Black Hills Energy Net Metering",
    amount:"kWh bill credits for excess solar",
    amountNote:"Black Hills offers kWh-based credits with a relatively generous year-end cash-out rate for excess generation.",
    categories:["solar","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:"blackhills",
    who:"Black Hills Energy customers installing rooftop solar.",
    requirements:["Black Hills Energy electric service","Grid-tied solar PV","Prior approval from Black Hills before installation"],
    contractorRole:"Obtain Black Hills approval before starting any solar installation.",
    howToApply:"Apply at blackhillsenergy.com before construction begins.",
    expires:"Ongoing",
    status:"active",
    url:"https://www.blackhillsenergy.com/efficiency-and-savings",
    urlLabel:"blackhillsenergy.com"
  },

  /* ─────── LOCAL / MUNICIPAL ─────── */
  {
    id:"denver-cares-hp",
    source:"local",
    sourceLabel:"City of Denver",
    name:"Denver CARe Heat Pump Rebate",
    amount:"Up to $3,500",
    amountNote:"Denver Climate Action Rebates (CARe). ⚠️ Funding is limited — program was fully subscribed in 2025 and may be paused. Verify funding status before quoting. Stackable with Xcel and HEAR rebates.",
    categories:["hvac","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:"xcel",
    who:"Denver city residents who are Xcel Energy customers. Must be within Denver city limits (some Denver County addresses may not qualify).",
    requirements:["Denver city residence","Xcel Energy customer","Heat pump installation","Homeowner"],
    contractorRole:"Help customer verify Denver city address eligibility. Apply through Denver's CARe portal.",
    howToApply:"Apply at denvergov.org/climate. Check address eligibility first.",
    expires:"While funds last — check denvergov.org for current funding status",
    status:"active",
    url:"https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Climate-Action-Sustainability-and-Resiliency",
    urlLabel:"denvergov.org"
  },
  {
    id:"denver-cares-ev",
    source:"local",
    sourceLabel:"City of Denver",
    name:"Denver CARe EV Charger Rebate",
    amount:"Up to $200",
    amountNote:"For ENERGY STAR Level 2 EV charger or Ford Charge Station Pro. Covers up to 80% of costs. Denver CARe program — Xcel territory only.",
    categories:["electrical","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:"xcel",
    who:"Denver city homeowners with Xcel Energy service installing Level 2 EV charger.",
    requirements:["Denver city address","Xcel Energy customer","ENERGY STAR or Ford Charge Station Pro charger","Not available for new construction, gut rehabs, or projects with electric service upgrades","Homeowner only"],
    contractorRole:"Install qualifying charger. Help customer apply through Denver CARe portal.",
    howToApply:"Apply at denvergov.org/climate after installation.",
    expires:"While funds last",
    status:"active",
    url:"https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Climate-Action-Sustainability-and-Resiliency",
    urlLabel:"denvergov.org"
  },
  {
    id:"fortcollins-solar",
    source:"local",
    sourceLabel:"Fort Collins Utilities",
    name:"Fort Collins Solar & Battery Rebate",
    amount:"Solar: $300/kW up to $1,500 · Battery: additional incentives",
    amountNote:"Fort Collins Utilities customers only. One of the few Colorado utilities with dedicated solar AND battery incentives beyond Xcel.",
    categories:["solar","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:null,
    who:"Fort Collins Utilities customers (not Xcel territory).",
    requirements:["Fort Collins Utilities service (not Xcel)","Grid-tied solar installation","Pre-approval before construction"],
    contractorRole:"Verify customer is a Fort Collins Utilities customer (not Xcel). Apply for rebate through Fort Collins Utilities.",
    howToApply:"Apply at fcgov.com/utilities before installation.",
    expires:"While funds last",
    status:"active",
    url:"https://www.fcgov.com/utilities/residential/conserve",
    urlLabel:"fcgov.com/utilities"
  },
  {
    id:"energy-smart-co",
    source:"local",
    sourceLabel:"EnergySmart Colorado",
    name:"EnergySmart Colorado — Local Partner Rebates",
    amount:"Varies ($400–$3,000 for solar; various for efficiency)",
    amountNote:"EnergySmart partners cover central and western Colorado. Programs vary by county/community. Combines local rebates with state and federal programs.",
    categories:["hvac","insulation","solar","all"],
    incomeRequired:false, ownerRequired:false,
    renterOk:false, utility:null,
    who:"Homeowners in central and western Colorado served by EnergySmart Colorado partners.",
    requirements:["Must be in EnergySmart Colorado service area","Work with local partner for assessment","Programs vary by location"],
    contractorRole:"Connect customer with their local EnergySmart Colorado partner for area-specific rebates and stacking opportunities.",
    howToApply:"Find local partner at energysmartcolorado.org and contact them directly.",
    expires:"Ongoing — programs vary",
    status:"active",
    url:"https://energysmartcolorado.org",
    urlLabel:"energysmartcolorado.org"
  },
  {
    id:"co-renu-loan",
    source:"state",
    sourceLabel:"Colorado — RENU Loan",
    name:"Colorado RENU Loan (0% Interest Financing)",
    amount:"Low-interest financing",
    amountNote:"The Colorado Residential Energy Upgrade (RENU) Loan provides below-market interest rate financing for energy upgrades when upfront rebates don't cover the full cost.",
    categories:["hvac","insulation","solar","plumbing","electrical","all"],
    incomeRequired:false, ownerRequired:true,
    renterOk:false, utility:null,
    who:"Colorado homeowners who want financing for energy upgrades. Available statewide.",
    requirements:["Colorado homeowner","Home must be primary residence","Energy improvement must qualify","Apply through participating lender"],
    contractorRole:"Help customer understand that RENU financing is available to supplement rebates. Direct them to ceogreenloans.org.",
    howToApply:"Apply through a participating Colorado lender. Visit ceogreenloans.org for current loan terms and lender list.",
    expires:"Ongoing",
    status:"active",
    url:"https://ceogreenloans.org",
    urlLabel:"ceogreenloans.org"
  }
];

/* ─── Rebate Filter Function (FREE — no API) ──────────────────────────────── */
function filterRebates(answers) {
  const { category, propertyType, ownership, income, electricUtil, gasUtil } = answers;
  const isXcel = electricUtil?.toLowerCase().includes("xcel") || gasUtil?.toLowerCase().includes("xcel");
  const isBlackHills = electricUtil?.toLowerCase().includes("black hills") || electricUtil?.toLowerCase().includes("bhe") || gasUtil?.toLowerCase().includes("black hills");
  const isLowIncome = income === "under60k" || income === "60to100k";
  const isOwner = ownership === "homeowner" || ownership === "landlord";
  const catId = category || "all";

  return REBATE_DB.filter(r => {
    // Category filter — when user picks a specific category, only show matching rebates
    // ("all" in each rebate's categories array means it shows under the "All Programs" selection only)
    if (catId !== "all" && !r.categories.includes(catId)) return false;
    // Renter filter — hide programs renters cannot access (renterOk:false covers utility rebates too)
    if (ownership === "renter" && !r.renterOk) return false;
    // Utility filter — only show Xcel programs if customer has Xcel or utility unknown
    if (r.utility === "xcel" && !isXcel && (electricUtil || gasUtil)) return false;
    if (r.utility === "blackhills" && !isBlackHills && (electricUtil || gasUtil)) return false;
    // Income-required filter — show income programs if income-eligible or not specified
    // (we show them all, just badge them)
    return true;
  });
}

function groupBySource(programs) {
  const order = ["federal", "state", "utility", "local"];
  const labels = { federal:"🏛 Federal Programs", state:"🏔 Colorado State Programs", utility:"⚡ Utility Rebates", local:"🏙 Local & Municipal" };
  const groups = {};
  programs.forEach(p => {
    if (!groups[p.source]) groups[p.source] = [];
    groups[p.source].push(p);
  });
  return order.filter(k => groups[k]).map(k => ({ key: k, label: labels[k], programs: groups[k] }));
}

function estimateTotal(programs, income) {
  const isLow = income === "under60k";
  const isMed = income === "60to100k";
  // Rough additive estimate of stackable highlights
  let min = 0, max = 0;
  const seen = new Set();
  programs.forEach(p => {
    if (seen.has(p.id)) return;
    seen.add(p.id);
    if (p.id === "co-hear-heat-pump") { min += isLow ? 6000 : 2000; max += isLow ? 8000 : 4000; }
    if (p.id === "xcel-hp-cold") { min += 5000; max += 9000; }
    if (p.id === "co-hp-taxcredit") { min += 330; max += 1000; }
    if (p.id === "xcel-hpwh") { max += 2250; min += 2250; }
    if (p.id === "co-hear-hpwh") { max += 1750; min += isLow ? 1750 : 875; }
    if (p.id === "xcel-battery") { min += 1000; max += 5000; }
    if (p.id === "denver-cares-hp") { max += 3500; min += 3500; }
  });
  if (max === 0) return null;
  if (min === max) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

/* ─── Rebate Wizard Component ─────────────────────────────────────────────── */
const CATEGORIES = [
  { id:"hvac", icon:"🌡️", label:"HVAC / Heat Pumps", desc:"Furnaces, AC, heat pumps, mini-splits" },
  { id:"electrical", icon:"⚡", label:"Electrical / EV Chargers", desc:"Panels, wiring, EV charging stations" },
  { id:"plumbing", icon:"🚿", label:"Plumbing / Water Heaters", desc:"Heat pump water heaters, plumbing upgrades" },
  { id:"insulation", icon:"🏠", label:"Insulation / Weatherization", desc:"Insulation, air sealing, weatherstripping" },
  { id:"solar", icon:"☀️", label:"Solar & Battery Storage", desc:"Solar PV, battery backup systems" },
  { id:"appliances", icon:"🍳", label:"Appliances", desc:"Stoves, cooktops, dryers" },
  { id:"all", icon:"📋", label:"All Programs", desc:"Show every available rebate" },
];
const PROPERTY_TYPES = [
  { id:"single-family", icon:"🏡", label:"Single-Family Home", desc:"Detached house" },
  { id:"multi-family", icon:"🏢", label:"Multi-Family / Condo", desc:"Apartment, duplex, condo" },
  { id:"mobile-home", icon:"🏠", label:"Mobile / Manufactured", desc:"Mobile or modular home" },
  { id:"commercial", icon:"🏬", label:"Commercial", desc:"Business or commercial building" },
];
const INCOME_OPTIONS = [
  { id:"under60k", icon:"💚", label:"Under $60,000/yr", desc:"May qualify for enhanced income-based rebates" },
  { id:"60to100k", icon:"💛", label:"$60,000 – $100,000/yr", desc:"May qualify for some income programs" },
  { id:"over100k", icon:"🔵", label:"Over $100,000/yr", desc:"Universal programs still available" },
  { id:"prefer_not", icon:"⚪", label:"Prefer not to say", desc:"Show all programs regardless" },
];

function RebateWizard({ state, trade }) {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ category:null, propertyType:null, ownership:null, income:null, electricUtil:"", gasUtil:"" });
  const [results, setResults] = useState(null);

  const pick = (key, val) => setAnswers(a => ({ ...a, [key]: val }));
  const canAdvance = () => {
    if (step===1) return !!answers.category;
    if (step===2) return !!answers.propertyType;
    if (step===3) return !!answers.ownership;
    if (step===4) return !!answers.income;
    return true;
  };

  const runSearch = () => {
    const programs = filterRebates({ ...answers, state });
    setResults(programs);
    setStep(7);
  };

  const reset = () => { setStep(0); setAnswers({ category:null, propertyType:null, ownership:null, income:null, electricUtil:"", gasUtil:"" }); setResults(null); };

  if (!state) return (
    <div className="rw-no-state">
      <div className="icon">📍</div>
      <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.8}}>Add your state in <strong>Setup</strong> to unlock the Rebate Finder.</p>
    </div>
  );

  if (state !== "Colorado") return (
    <div className="rw-no-state">
      <div className="icon">🏔</div>
      <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.8}}>
        <strong>This rebate database covers Colorado only</strong> for now.<br/><br/>
        For other states, visit <a href="https://www.dsireusa.org" target="_blank" rel="noopener noreferrer" style={{color:"var(--amber-deep)"}}>dsireusa.org</a> — the national database of all state energy incentives.
      </p>
    </div>
  );

  // ── INTRO ──
  if (step === 0) return (
    <div>
      <div className="rw-hero">
        <div className="rw-hero-title">💰 CO Rebate Finder</div>
        <div className="rw-hero-sub">Answer 5 quick questions — we'll match your customer to every available rebate in Colorado: federal, state, and utility programs.</div>
        <div style={{fontSize:11,color:"#92400e",background:"#fff8e1",border:"1px solid #f59e0b",borderRadius:4,padding:"7px 10px",marginTop:10}}>Rebate info is for reference only. Programs change frequently. Always verify with the program administrator. WrenchBid is not liable for unavailable or denied rebates.</div>
        <div className="rw-state-pill">📍 Colorado</div>
      </div>
      <div className="tip"><strong>Why answer questions?</strong> Income level, property type, and utility provider all change what your customer qualifies for. Takes 30 seconds.</div>
      <button className="btn btn-cta btn-full" onClick={() => setStep(1)}>Start — Find Rebates →</button>
    </div>
  );

  // ── RESULTS ──
  if (step === 7 && results) {
    const grouped = groupBySource(results);
    const total = results.length;
    const estimate = estimateTotal(results, answers.income);
    return (
      <div>
        <div className="rw-hero" style={{marginBottom:14}}>
          <div className="rw-hero-title">✅ {total} Programs Found</div>
          <div className="rw-hero-sub" style={{marginBottom:0}}>Colorado + federal rebates matching your customer's profile.</div>
        </div>

        {estimate && (
          <div className="rw-total-bar">
            <div>
              <div className="rw-total-label">Potential Customer Savings</div>
              <div className="rw-total-amt">{estimate}</div>
            </div>
            <div style={{fontSize:28}}>💰</div>
          </div>
        )}

        <div style={{background:"#fff8e1",border:"1px solid #f59e0b",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#78350f",lineHeight:1.5}}>
          <strong>⚠️ Rebate Disclaimer:</strong> WrenchBid provides this rebate information for general reference only. Program availability, amounts, and eligibility requirements change frequently and may differ from what is shown here. Some programs may be expired, paused, or fully subscribed. WrenchBid makes no warranties regarding the accuracy or availability of any rebate and is not responsible for any rebate that is denied, expired, or unavailable. Always verify directly with the program administrator before committing to a project based on rebate availability. <strong>This is not financial or legal advice.</strong>
        </div>

        <div className="rw-summary">
          <div className="rw-summary-title">Search Profile</div>
          <div className="rw-summary-row"><span className="rw-summary-key">Category</span><span className="rw-summary-val">{CATEGORIES.find(c=>c.id===answers.category)?.label}</span></div>
          <div className="rw-summary-row"><span className="rw-summary-key">Property</span><span className="rw-summary-val">{PROPERTY_TYPES.find(p=>p.id===answers.propertyType)?.label}</span></div>
          <div className="rw-summary-row"><span className="rw-summary-key">Ownership</span><span className="rw-summary-val">{answers.ownership}</span></div>
          <div className="rw-summary-row"><span className="rw-summary-key">Income</span><span className="rw-summary-val">{INCOME_OPTIONS.find(i=>i.id===answers.income)?.label}</span></div>
          {(answers.electricUtil||answers.gasUtil) && <div className="rw-summary-row"><span className="rw-summary-key">Utilities</span><span className="rw-summary-val">{[answers.electricUtil,answers.gasUtil].filter(Boolean).join(", ")}</span></div>}
        </div>

        <div className="rw-disc"><strong>⚠ Verify before quoting.</strong> Rebate amounts and program availability change. Always confirm with the issuing agency. Links below go to official sources.</div>

        <div className="rw-updated">Data verified March 2026 · energyoffice.colorado.gov · xcelenergy.com · IRS.gov</div>

        {grouped.map(g => (
          <div key={g.key} className="rw-section">
            <div className="rw-section-label">{g.label} ({g.programs.length})</div>
            {g.programs.map(prog => {
              const isIncome = prog.incomeRequired || prog.id.includes("hear") || prog.id === "co-vxc" || prog.id === "co-weatherization";
              const isExpired = prog.status === "expired";
              return (
                <div key={prog.id} className="rw-card">
                  <div className="rw-card-hd">
                    <div style={{flex:1}}>
                      <div className="rw-card-name">{prog.name}</div>
                      <div style={{marginTop:4,display:"flex",flexWrap:"wrap",gap:4}}>
                        {isIncome && <span className="badge badge-income">Income-Qualified</span>}
                        {!isIncome && <span className="badge badge-all">All Income Levels</span>}
                        {prog.utility==="xcel" && <span className="badge badge-xcel">Xcel Customers</span>}
                        {prog.utility==="blackhills" && <span className="badge badge-bhe">Black Hills Customers</span>}
                        {prog.ownerRequired && <span className="badge badge-owner">Owners Only</span>}
                        {isExpired && <span className="badge badge-expired">Expired</span>}
                      </div>
                    </div>
                    <div className="rw-card-amt">{prog.amount}</div>
                  </div>
                  <div className="rw-card-bd">
                    {prog.amountNote && <div style={{marginBottom:7,fontStyle:"italic",fontSize:12,color:"var(--muted)"}}>{prog.amountNote}</div>}
                    {prog.who && <div style={{marginBottom:7}}><strong>Who qualifies:</strong> {prog.who}</div>}
                    {prog.requirements?.length > 0 && (
                      <div style={{marginBottom:7}}>
                        <strong>Requirements:</strong>
                        <ul>{prog.requirements.map((r,i) => <li key={i}>{r}</li>)}</ul>
                      </div>
                    )}
                    {prog.contractorRole && <div style={{marginBottom:7}}><strong>Your role as contractor:</strong> {prog.contractorRole}</div>}
                    {prog.howToApply && <div style={{marginBottom: prog.canStack ? 7 : 0}}><strong>How to apply:</strong> {prog.howToApply}</div>}
                    {prog.canStack && <div style={{marginTop:4,padding:"6px 10px",background:"var(--green-light)",borderRadius:3,fontSize:12,color:"var(--green)"}}><strong>💡 Stackable:</strong> {prog.canStack}</div>}
                    {prog.note && <div style={{marginTop:6,padding:"6px 10px",background:"#fff3e0",borderRadius:3,fontSize:12,color:"#c45c00"}}>{prog.note}</div>}
                  </div>
                  <div className="rw-card-ft">
                    <div className="rw-card-expires">
                      <span>{prog.status==="limited" ? "⚠️" : prog.status==="expired" ? "❌" : "✅"}</span>
                      <span style={{color: prog.status==="expired" ? "var(--red)" : undefined}}>{prog.expires}</span>
                    </div>
                    {prog.url && <a href={prog.url} target="_blank" rel="noopener noreferrer" className="rw-card-link">{prog.urlLabel} ↗</a>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <button className="btn btn-cta btn-full" style={{marginBottom:8}} onClick={reset}>🔍 New Search</button>
        <button className="btn btn-ghost btn-full" onClick={() => { setStep(1); setResults(null); }}>← Change Answers</button>
      </div>
    );
  }

  // ── QUESTION STEPS ──
  const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div>
      <div className="rw-progress">
        <div className="rw-progress-bar"><div className="rw-progress-fill" style={{width:`${pct}%`}} /></div>
        <div className="rw-progress-label">Step {step} of {TOTAL_STEPS}</div>
      </div>

      {step === 1 && (
        <>
          <div className="rw-question">What type of work is being done?</div>
          <div className="rw-question-hint">Select the category that best matches the project.</div>
          <div className="rw-grid">
            {CATEGORIES.map(c => (
              <div key={c.id} className={`rw-grid-opt ${answers.category===c.id?"sel":""}`} onClick={() => pick("category", c.id)}>
                <div className="rw-grid-opt-icon">{c.icon}</div>
                <span className="rw-grid-opt-label">{c.label}</span>
                <div className="rw-grid-opt-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="rw-question">What type of property is this?</div>
          <div className="rw-question-hint">Property type affects eligibility for some programs.</div>
          <div className="rw-options">
            {PROPERTY_TYPES.map(p => (
              <div key={p.id} className={`rw-opt ${answers.propertyType===p.id?"sel":""}`} onClick={() => pick("propertyType", p.id)}>
                <div className="rw-opt-icon">{p.icon}</div>
                <div className="rw-opt-text"><span className="rw-opt-label">{p.label}</span><div className="rw-opt-desc">{p.desc}</div></div>
                <div className="rw-opt-check" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="rw-question">Does your customer own or rent?</div>
          <div className="rw-question-hint">Some programs require homeownership. Renters can still qualify for many.</div>
          <div className="rw-options">
            {[
              { id:"homeowner", icon:"🔑", label:"Homeowner", desc:"Customer owns the property" },
              { id:"renter", icon:"🏠", label:"Renter / Tenant", desc:"Customer rents — landlord permission may be needed" },
              { id:"landlord", icon:"🏘️", label:"Landlord / Property Owner", desc:"Installing for rental property tenants" },
            ].map(o => (
              <div key={o.id} className={`rw-opt ${answers.ownership===o.id?"sel":""}`} onClick={() => pick("ownership", o.id)}>
                <div className="rw-opt-icon">{o.icon}</div>
                <div className="rw-opt-text"><span className="rw-opt-label">{o.label}</span><div className="rw-opt-desc">{o.desc}</div></div>
                <div className="rw-opt-check" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="rw-question">Household income range?</div>
          <div className="rw-question-hint">Income level determines eligibility for HEAR rebates, which can add $4,000–$8,000 in savings.</div>
          <div className="rw-options">
            {INCOME_OPTIONS.map(o => (
              <div key={o.id} className={`rw-opt ${answers.income===o.id?"sel":""}`} onClick={() => pick("income", o.id)}>
                <div className="rw-opt-icon">{o.icon}</div>
                <div className="rw-opt-text"><span className="rw-opt-label">{o.label}</span><div className="rw-opt-desc">{o.desc}</div></div>
                <div className="rw-opt-check" />
              </div>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <div className="rw-question">Who are the utility providers?</div>
          <div className="rw-question-hint">Xcel Energy and Black Hills Energy each have unique rebate programs. Leave blank to see all.</div>
          <div className="field" style={{marginBottom:12}}>
            <label>Electric Utility</label>
            <input value={answers.electricUtil} onChange={e => pick("electricUtil", e.target.value)} placeholder="e.g. Xcel Energy, Black Hills, United Power..." />
          </div>
          <div className="field" style={{marginBottom:18}}>
            <label>Gas Utility <span style={{fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:11}}>(if applicable)</span></label>
            <input value={answers.gasUtil} onChange={e => pick("gasUtil", e.target.value)} placeholder="e.g. Xcel Energy, Black Hills Energy..." />
          </div>
          <div className="rw-summary">
            <div className="rw-summary-title">Ready to Search</div>
            <div className="rw-summary-row"><span className="rw-summary-key">Category</span><span className="rw-summary-val">{CATEGORIES.find(c=>c.id===answers.category)?.label}</span></div>
            <div className="rw-summary-row"><span className="rw-summary-key">Property</span><span className="rw-summary-val">{PROPERTY_TYPES.find(p=>p.id===answers.propertyType)?.label}</span></div>
            <div className="rw-summary-row"><span className="rw-summary-key">Ownership</span><span className="rw-summary-val">{answers.ownership}</span></div>
            <div className="rw-summary-row"><span className="rw-summary-key">Income</span><span className="rw-summary-val">{INCOME_OPTIONS.find(i=>i.id===answers.income)?.label}</span></div>
          </div>
        </>
      )}

      <div className="rw-nav">
        <button className="btn btn-ghost" onClick={() => step === 1 ? setStep(0) : setStep(s => s-1)}>← Back</button>
        {step < TOTAL_STEPS
          ? <button className="btn btn-cta" disabled={!canAdvance()} onClick={() => setStep(s => s+1)}>Next →</button>
          : <button className="btn btn-cta" onClick={runSearch}>🔍 Find Rebates — Free</button>
        }
      </div>
    </div>
  );
}

/* ─── AI Quote Parser ─────────────────────────────────────────────────────── */
async function aiParseQuote(transcript, bizName, trade, taxEnabled, taxRate) {
  const taxNote = taxEnabled && parseFloat(taxRate) > 0
    ? `Apply ${taxRate}% sales tax.` : `No sales tax. taxRate=0, tax=0.`;
  const res = await fetch("/api/quote", {
    method:"POST", headers:{"content-type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:900,
      messages:[{role:"user",content:`You are a quoting assistant for "${bizName}", a ${trade}. If not English, translate first.\n\nJob: "${transcript}"\n\nReturn ONLY valid JSON:\n{"clientName":null,"jobTitle":"string","lineItems":[{"desc":"string","qty":1,"unit":"hrs","rate":0,"total":0}],"subtotal":0,"taxRate":0,"tax":0,"grandTotal":0,"notes":null,"validDays":30}\n\n${taxNote}\nUse realistic ${trade} rates if not stated. Round to 2 decimals.`}]
    })
  });
  const d = await res.json();
  const t = d.content[0].text.trim();
  return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}")+1));
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
export default function WrenchBid() {
  const [tab,setTab]=useState("new");
  const [biz,setBiz]=useState(()=>{
    try{ const s=JSON.parse(localStorage.getItem("wb_biz")); return s||{name:"Your Business",trade:"Plumber",phone:"",email:"",licenseNum:"",paymentTerms:"",warranty:"",customTerms:"",taxEnabled:false,taxRate:"0",language:"en-US",state:""}; }
    catch{ return{name:"Your Business",trade:"Plumber",phone:"",email:"",licenseNum:"",paymentTerms:"",warranty:"",customTerms:"",taxEnabled:false,taxRate:"0",language:"en-US",state:""}; }
  });
  const [user,setUser]=useState(null);
  const [authReady,setAuthReady]=useState(false);
  const [authMode,setAuthMode]=useState("signin");
  const [onboardDone,setOnboardDone]=useState(()=>!!localStorage.getItem("wb_onboarded"));
  const [onboardStep,setOnboardStep]=useState(0);
  const [onboardTyped,setOnboardTyped]=useState("");
  const [authEmail,setAuthEmail]=useState("");
  const [authPassword,setAuthPassword]=useState("");
  const [authError,setAuthError]=useState("");
  const [authLoading,setAuthLoading]=useState(false);
  const [step,setStep]=useState("idle");
  const [transcript,setTranscript]=useState("");
  const [quote,setQuote]=useState(null);
  const [clientPhone,setClientPhone]=useState("");
  const [shareUrl,setShareUrl]=useState(null);
  const [shareLoading,setShareLoading]=useState(false);
  const [installPrompt,setInstallPrompt]=useState(null);
  const [showInstallBanner,setShowInstallBanner]=useState(false);
  const [showIosBanner,setShowIosBanner]=useState(()=>{
    const isIos=/iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone;
    const dismissed=localStorage.getItem("wb_ios_install_dismissed");
    return isIos && isSafari && !isStandalone && !dismissed;
  });
  const [sharedQuote,setSharedQuote]=useState(null);
  const [sharedLoading,setSharedLoading]=useState(()=>!!new URLSearchParams(window.location.search).get("quote"));
  const [history,setHistory]=useState(()=>{ try{return JSON.parse(localStorage.getItem("wb_history"))||[];}catch{return[];} });
  const [toast,setToast]=useState(null);
  const recognitionRef=useRef(null);
  const toastTimer=useRef(null);
  const finalRef=useRef("");
  const interimRef=useRef("");
  const displayRef=useRef("");

  useEffect(()=>{ try{localStorage.setItem("wb_history",JSON.stringify(history));}catch{} },[history]);
  useEffect(()=>{ try{localStorage.setItem("wb_biz",JSON.stringify(biz));}catch{} },[biz]);

  // Typewriter animation for onboarding screen 1
  const DEMO_TEXT = "Replace water heater for John Smith, 3 hours at $105 an hour, parts $380";
  useEffect(()=>{
    if(onboardDone||onboardStep!==0) return;
    setOnboardTyped("");
    let i=0;
    const interval=setInterval(()=>{
      i++;
      setOnboardTyped(DEMO_TEXT.slice(0,i));
      if(i>=DEMO_TEXT.length) clearInterval(interval);
    },38);
    return()=>clearInterval(interval);
  },[onboardStep,onboardDone]);

  // Catch Android install prompt
  useEffect(()=>{
    const handler=(e)=>{ e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener("beforeinstallprompt", handler);
    // If already installed, hide banner
    window.addEventListener("appinstalled", ()=>setShowInstallBanner(false));
    return()=>window.removeEventListener("beforeinstallprompt", handler);
  },[]);

  // Auto-update check: compare current JS bundle hash with what's deployed
  const [updateAvailable,setUpdateAvailable]=useState(false);
  useEffect(()=>{
    const currentScript=[...document.querySelectorAll('script[src]')].find(s=>s.src.includes('/assets/'))?.src||"";
    const check=async()=>{
      try{
        const res=await fetch("/?_cb="+Date.now(),{cache:"no-store"});
        const html=await res.text();
        const match=html.match(/\/assets\/index-([^"]+)\.js/);
        if(match&&currentScript&&!currentScript.includes(match[1])){
          setUpdateAvailable(true);
        }
      }catch{}
    };
    // Check after 30s (let app settle), then every 5 minutes
    const t1=setTimeout(check,30000);
    const t2=setInterval(check,5*60*1000);
    return()=>{clearTimeout(t1);clearInterval(t2);};
  },[]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null); setAuthReady(true);
      if(session?.user){ loadCloudQuotes(session.user.id); loadCloudBiz(session.user); }
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user??null);
      if(session?.user){ loadCloudQuotes(session.user.id); loadCloudBiz(session.user); }
    });
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    const token=new URLSearchParams(window.location.search).get("quote");
    if(!token){setSharedLoading(false);return;}
    supabase.from("shared_quotes").select("*").eq("share_token",token).single()
      .then(({data,error})=>{
        if(data&&!error) setSharedQuote(data);
        else setSharedQuote({error:true});
        setSharedLoading(false);
      });
  },[]);

  const loadCloudQuotes=async(uid)=>{
    const{data}=await supabase.from("quotes").select("quote_data,created_at").eq("user_id",uid).order("created_at",{ascending:false});
    setHistory((data||[]).map(r=>r.quote_data).filter(Boolean));
  };
  const loadCloudBiz=(u)=>{ const cb=u?.user_metadata?.biz; if(cb) setBiz(cb); };
  const saveBizToCloud=async(b)=>{ await supabase.auth.updateUser({data:{biz:b}}); };

  const handleSignUp=async()=>{ setAuthError(""); setAuthLoading(true); const{error}=await supabase.auth.signUp({email:authEmail,password:authPassword}); setAuthLoading(false); if(error)setAuthError(error.message); else ping("Welcome to WrenchBid! ✓"); };
  const handleSignIn=async()=>{ setAuthError(""); setAuthLoading(true); const{error}=await supabase.auth.signInWithPassword({email:authEmail,password:authPassword}); setAuthLoading(false); if(error)setAuthError(error.message); else ping("Welcome back ✓"); };
  const handleSignOut=async()=>{ await supabase.auth.signOut(); ping("Signed out"); };
  const ping=(msg)=>{ clearTimeout(toastTimer.current); setToast(msg); toastTimer.current=setTimeout(()=>setToast(null),2800); };

  const startRec=async()=>{
    const isMobile=/Android|iPhone|iPad/i.test(navigator.userAgent);
    if(!isMobile&&'webkitSpeechRecognition' in window){
      const rec=new window.webkitSpeechRecognition();
      rec.continuous=true; rec.interimResults=true; rec.lang=biz.language||"en-US";
      rec.onresult=(e)=>{ let f=finalRef.current,i=""; for(let j=e.resultIndex;j<e.results.length;j++){ if(e.results[j].isFinal)f+=e.results[j][0].transcript+" "; else i+=e.results[j][0].transcript; } finalRef.current=f; displayRef.current=f+i; setTranscript(f+i); };
      rec.onerror=(e)=>{ if(e.error!=="aborted")ping("Voice error: "+e.error); };
      rec.onend=()=>{ if(recognitionRef.current?.rec===rec)setStep(s=>s==="recording"?"idle":s); };
      rec.start(); recognitionRef.current={rec,type:"webspeech"}; setStep("recording"); return;
    }
    let active=true;
    try{
      const[tokenRes,stream]=await Promise.all([fetch("/api/deepgram-token"),navigator.mediaDevices.getUserMedia({audio:true})]);
      if(!tokenRes.ok){ ping("Voice setup failed"); stream.getTracks().forEach(t=>t.stop()); return; }
      const{token}=await tokenRes.json();
      if(!token){ ping("Voice token missing"); stream.getTracks().forEach(t=>t.stop()); return; }
      const ws=new WebSocket("wss://api.deepgram.com/v1/listen?model=nova-2&language="+(biz.language||"en-US")+"&interim_results=true&endpointing=100&no_delay=true&numerals=true",["token",token]);
      ws.onopen=()=>{
        if(!active){ ws.close(); stream.getTracks().forEach(t=>t.stop()); return; }
        const mt=["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/ogg","audio/mp4"].find(t=>{ try{return MediaRecorder.isTypeSupported(t);}catch{return false;} })||"";
        const mr=new MediaRecorder(stream,mt?{mimeType:mt}:{});
        mr.ondataavailable=(e)=>{ if(active&&ws.readyState===WebSocket.OPEN&&e.data.size>0)ws.send(e.data); };
        mr.start(100);
        recognitionRef.current={ws,mediaRecorder:mr,stream,type:"deepgram",deactivate:()=>{ active=false; }};
        setStep("recording");
      };
      ws.onmessage=(e)=>{
        if(!active) return;
        try{ const msg=JSON.parse(e.data); if(msg.type!=="Results")return; const text=msg.channel?.alternatives?.[0]?.transcript; if(!text)return;
          if(msg.is_final){ finalRef.current+=text+" "; interimRef.current=""; } else interimRef.current=text;
          displayRef.current=finalRef.current+interimRef.current; setTranscript(displayRef.current); }catch{}
      };
      ws.onerror=()=>{ if(active)ping("Voice connection error"); };
      ws.onclose=()=>{ if(active)setStep(s=>s==="recording"?"idle":s); };
    }catch{ ping("Could not start recording"); setStep("idle"); }
  };

  const stopRec=()=>{
    const ref=recognitionRef.current; if(!ref)return;
    recognitionRef.current=null;
    if(ref.type==="webspeech"){ ref.rec.stop(); }
    else{
      ref.deactivate(); ref.mediaRecorder?.stop(); ref.stream?.getTracks().forEach(t=>t.stop()); ref.ws?.close();
      if(interimRef.current){ finalRef.current+=interimRef.current+" "; interimRef.current=""; displayRef.current=finalRef.current; setTranscript(finalRef.current); }
    }
    setStep("idle");
  };

  const toggleMic=()=>step==="recording"?stopRec():startRec();

  useEffect(()=>{
    if(!/Android|iPhone|iPad/i.test(navigator.userAgent)&&'webkitSpeechRecognition' in window)
      navigator.mediaDevices.getUserMedia({audio:true}).then(s=>s.getTracks().forEach(t=>t.stop())).catch(()=>{});
  },[]);

  const generate=async()=>{
    if(!transcript.trim()){ping("Speak a job description first");return;}
    setStep("processing");
    try{ const data=await aiParseQuote(transcript,biz.name,biz.trade,biz.taxEnabled,biz.taxRate); setQuote({...data,qNum:qNum(),date:todayStr()}); setStep("preview"); }
    catch{ setStep("idle"); ping("Parse error — try again"); }
  };

  const saveToHistory=(status)=>{ if(!quote)return; const entry={...quote,status,transcript,bizName:biz.name,savedAt:new Date().toISOString()}; setHistory(h=>[entry,...h]); return entry; };

  // Format phone number for display
  const fmtPhone=(p)=>{const d=p.replace(/\D/g,"");if(d.length===10)return`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;if(d.length===11&&d[0]==="1")return`+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`;return p;};

  // Generate a public share URL and save quote to Supabase
  const getShareUrl=async()=>{
    if(shareUrl) return shareUrl;
    setShareLoading(true);
    try{
      const token=Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
      const payload={
        share_token:token,
        biz_name:biz.name, biz_trade:biz.trade, biz_phone:biz.phone, biz_email:biz.email, biz_license:biz.licenseNum,
        client_name:quote.clientName, job_title:quote.jobTitle, quote_num:quote.qNum, quote_date:quote.date,
        line_items:quote.lineItems, subtotal:quote.subtotal, tax:quote.tax, tax_rate:quote.taxRate,
        grand_total:quote.grandTotal, valid_days:quote.validDays, notes:quote.notes,
        payment_terms:biz.paymentTerms, warranty:biz.warranty, custom_terms:biz.customTerms,
        created_at:new Date().toISOString()
      };
      const {error}=await supabase.from("shared_quotes").insert(payload);
      if(error) throw error;
      const url=`${window.location.origin}?quote=${token}`;
      setShareUrl(url);
      setShareLoading(false);
      return url;
    } catch(e){
      setShareLoading(false);
      // Fallback: encode compact quote in URL if Supabase fails
      const compact=btoa(JSON.stringify({b:biz.name,t:quote.jobTitle,tot:quote.grandTotal,v:quote.validDays,n:quote.qNum})).slice(0,200);
      return null;
    }
  };

  const sendSMS=async()=>{
    const digits=clientPhone.replace(/\D/g,"");
    if(digits.length<10){ping("Enter a valid phone number first");return;}
    saveToHistory("sent");
    setShareLoading(true);
    const url=await getShareUrl();
    setShareLoading(false);
    const lineList=quote.lineItems.filter(l=>l.desc&&l.total>0).map(l=>`  • ${l.desc}: ${$$(l.total)}`).join("\n");
    const msg=[
      `Hi${quote.clientName?" "+quote.clientName:""}! Here's your quote from ${biz.name}.`,
      "",
      `📋 ${quote.jobTitle}`,
      lineList?lineList:"",
      "",
      `💰 Total: ${$$(quote.grandTotal)}`,
      `📅 Valid: ${quote.validDays} days`,
      url?`\n🔗 View full quote:\n${url}`:"",
      "",
      biz.phone?`📞 ${fmtPhone(biz.phone)}`:"Reply to accept."
    ].filter(l=>l!=="").join("\n").replace(/\n{3,}/g,"\n\n");
    window.open(`sms:${digits}?body=${encodeURIComponent(msg)}`);
    ping("SMS ready ✓");
  };

  const copyText=async()=>{
    saveToHistory("draft");
    const url=await getShareUrl();
    const lines=[
      `QUOTE — ${biz.name}`,
      biz.trade+( biz.phone ? `  ·  ${fmtPhone(biz.phone)}` : "")+(biz.email?`  ·  ${biz.email}`:""),
      biz.licenseNum?`License: ${biz.licenseNum}`:"",
      "─".repeat(36),
      `Job: ${quote.jobTitle}`,
      `Date: ${quote.date}    Quote #: ${quote.qNum}`,
      quote.clientName?`Client: ${quote.clientName}`:"",
      "",
      ...quote.lineItems.filter(l=>l.desc&&l.total>0).map(l=>`  ${l.desc.padEnd(26)} ${$$(l.total)}`),
      "",
      `  Subtotal:${" ".repeat(18)}${$$(quote.subtotal)}`,
      quote.tax>0?`  Tax (${quote.taxRate}%):${" ".repeat(16)}${$$(quote.tax)}`:null,
      `  TOTAL:${" ".repeat(22)}${$$(quote.grandTotal)}`,
      "",
      `Valid for ${quote.validDays} days from ${quote.date}.`,
      quote.notes?`Notes: ${quote.notes}`:"",
      biz.paymentTerms?`Payment: ${biz.paymentTerms}`:"",
      biz.warranty?`Warranty: ${biz.warranty}`:"",
      url?`\nView online: ${url}`:"",
    ].filter(l=>l!==null&&l!==undefined&&l!=="").join("\n");
    navigator.clipboard.writeText(lines).then(()=>ping("Copied ✓"));
  };

  const saveQuote=async()=>{
    const entry=saveToHistory("saved"); ping("Quote saved ✓");
    if(user&&entry) await supabase.from("quotes").insert({user_id:user.id,quote_num:entry.qNum,client_name:entry.clientName,job_title:entry.jobTitle,grand_total:entry.grandTotal,status:"saved",quote_data:entry});
  };

  const newQuote=()=>{ setQuote(null); finalRef.current=""; interimRef.current=""; displayRef.current=""; setTranscript(""); setStep("idle"); setClientPhone(""); setTab("new"); };

  const clearHistory=async()=>{
    if(window.confirm("Delete all saved quotes?")){ setHistory([]); ping("History cleared"); if(user)await supabase.from("quotes").delete().eq("user_id",user.id); }
  };

  const deleteQuote=async(i)=>{
    const q=history[i]; setHistory(h=>h.filter((_,j)=>j!==i));
    if(user&&q?.qNum)await supabase.from("quotes").delete().eq("user_id",user.id).eq("quote_num",q.qNum);
  };

  // Shared quote viewer — shown to clients via link
  if(sharedLoading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#f5f0e8"}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,letterSpacing:2,color:"#7a7060"}}>LOADING QUOTE…</div></div>;
  if(sharedQuote&&!sharedQuote.error){
    const q=sharedQuote;
    const $$n=v=>v!=null?`$${Number(v).toFixed(2)}`:"$0.00";
    return(
      <div style={{maxWidth:520,margin:"0 auto",padding:20,fontFamily:"'Barlow',sans-serif",background:"#f5f0e8",minHeight:"100vh"}}>
        <style>{`@media print{button{display:none!important}} @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;600;700&display=swap');`}</style>
        <div style={{background:"#0d0d0d",padding:"22px 24px",borderRadius:"6px 6px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,letterSpacing:3,color:"#e8a020",textTransform:"uppercase"}}>{q.biz_name}</div>
            <div style={{fontSize:13,color:"#9e9e9e",marginTop:2}}>{q.biz_trade}{q.biz_phone?` · ${q.biz_phone}`:""}{q.biz_email?` · ${q.biz_email}`:""}</div>
            {q.biz_license&&<div style={{fontSize:11,color:"#666",marginTop:2}}>Lic: {q.biz_license}</div>}
          </div>
          <button onClick={()=>window.print()} style={{background:"#e8a020",border:"none",borderRadius:4,padding:"8px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",color:"#0d0d0d"}}>🖨 Save PDF</button>
        </div>
        <div style={{background:"#fff",border:"1px solid #d0c8b8",borderTop:"none",borderRadius:"0 0 6px 6px",padding:"20px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,paddingBottom:16,borderBottom:"1px solid #d0c8b8"}}>
            <div>
              {q.client_name&&<div style={{fontSize:14,fontWeight:600,color:"#0d0d0d"}}>{q.client_name}</div>}
              <div style={{fontSize:16,fontWeight:700,color:"#0d0d0d",marginTop:q.client_name?4:0}}>{q.job_title}</div>
            </div>
            <div style={{textAlign:"right",fontSize:11,color:"#7a7060"}}>
              <div style={{fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Quote #{q.quote_num}</div>
              <div style={{marginTop:2}}>{q.quote_date}</div>
              <div style={{marginTop:2}}>Valid {q.valid_days} days</div>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
            <thead><tr style={{borderBottom:"2px solid #0d0d0d"}}>
              <th style={{textAlign:"left",padding:"6px 0",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#7a7060"}}>Description</th>
              <th style={{textAlign:"right",padding:"6px 0",fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#7a7060"}}>Amount</th>
            </tr></thead>
            <tbody>
              {(q.line_items||[]).filter(l=>l.desc&&l.total>0).map((l,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #eee"}}>
                  <td style={{padding:"10px 0",fontSize:14,color:"#0d0d0d"}}>{l.desc}</td>
                  <td style={{padding:"10px 0",fontSize:14,fontWeight:600,textAlign:"right",color:"#0d0d0d"}}>{$$n(l.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{borderTop:"2px solid #0d0d0d",paddingTop:12}}>
            {q.subtotal!==q.grand_total&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#7a7060",marginBottom:4}}><span>Subtotal</span><span>{$$n(q.subtotal)}</span></div>}
            {q.tax>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#7a7060",marginBottom:4}}><span>Tax ({q.tax_rate}%)</span><span>{$$n(q.tax)}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,marginTop:6}}><span>TOTAL</span><span style={{color:"#e8a020"}}>{$$n(q.grand_total)}</span></div>
          </div>
          {(q.notes||q.payment_terms||q.warranty||q.custom_terms)&&(
            <div style={{marginTop:20,paddingTop:14,borderTop:"1px solid #d0c8b8",fontSize:12,color:"#7a7060",lineHeight:1.6}}>
              {q.notes&&<div style={{marginBottom:6}}><strong>Notes:</strong> {q.notes}</div>}
              {q.payment_terms&&<div style={{marginBottom:6}}><strong>Payment:</strong> {q.payment_terms}</div>}
              {q.warranty&&<div style={{marginBottom:6}}><strong>Warranty:</strong> {q.warranty}</div>}
              {q.custom_terms&&<div style={{marginBottom:6}}>{q.custom_terms}</div>}
            </div>
          )}
          <div style={{marginTop:20,paddingTop:14,borderTop:"1px solid #d0c8b8",fontSize:11,color:"#aaa",textAlign:"center"}}>
            Quote generated via WrenchBid · wrenchbid.vercel.app
          </div>
        </div>
      </div>
    );
  }
  if(sharedQuote?.error) return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"'Barlow Condensed',sans-serif",color:"#7a7060"}}><div style={{fontSize:48}}>🔧</div><div style={{fontSize:18,letterSpacing:2,marginTop:12}}>QUOTE NOT FOUND</div><div style={{fontSize:13,marginTop:8}}>This link may have expired.</div></div>;

  if(!authReady) return <div className="app" style={{alignItems:"center",justifyContent:"center"}}><div className="loader" style={{width:200}}/></div>;

  return (
    <div className="app">
      {updateAvailable&&(
        <div style={{background:"#1a4a8a",color:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontWeight:600,gap:10,zIndex:300}}>
          <span>🆕 New version available</span>
          <button onClick={()=>window.location.reload()} style={{background:"#e8a020",color:"#0d0d0d",border:"none",borderRadius:3,padding:"5px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Update Now</button>
        </div>
      )}
      {showInstallBanner&&(
        <div style={{background:"#1a3a1a",color:"#fff",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:13,fontWeight:600,gap:10,zIndex:300}}>
          <span>📲 Add WrenchBid to your home screen</span>
          <div style={{display:"flex",gap:8}}>
            <button onClick={async()=>{ if(installPrompt){await installPrompt.prompt(); const r=await installPrompt.userChoice; if(r.outcome==="accepted") setShowInstallBanner(false);} }} style={{background:"#e8a020",color:"#0d0d0d",border:"none",borderRadius:3,padding:"5px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,letterSpacing:1,textTransform:"uppercase",cursor:"pointer"}}>Install</button>
            <button onClick={()=>setShowInstallBanner(false)} style={{background:"none",border:"1px solid #555",color:"#aaa",borderRadius:3,padding:"5px 10px",fontSize:12,cursor:"pointer"}}>✕</button>
          </div>
        </div>
      )}
      {showIosBanner&&(
        <div style={{background:"#1a1a2e",color:"#fff",padding:"12px 16px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,zIndex:300}}>
          <div style={{fontSize:13,lineHeight:1.5}}>
            <div style={{fontWeight:700,marginBottom:3}}>📲 Install WrenchBid on your iPhone</div>
            <div style={{color:"#aaa",fontSize:12}}>Tap <strong style={{color:"#fff"}}>Share</strong> <span style={{fontSize:14}}>⎋</span> then <strong style={{color:"#fff"}}>"Add to Home Screen"</strong></div>
          </div>
          <button onClick={()=>{localStorage.setItem("wb_ios_install_dismissed","1");setShowIosBanner(false);}} style={{background:"none",border:"1px solid #555",color:"#aaa",borderRadius:3,padding:"5px 10px",fontSize:12,cursor:"pointer",flexShrink:0}}>✕</button>
        </div>
      )}
      {!onboardDone&&!user&&(
          <div className="ob-wrap">
            {/* Slides */}
            <div className="ob-slides" style={{transform:`translateX(-${onboardStep*100}%)`}}>

              {/* Slide 1 — The hook */}
              <div className="ob-slide">
                <div className="ob-icon">🎙</div>
                <div className="ob-title">Quote any job<br/>in 60 seconds</div>
                <div className="ob-sub">Just speak the job out loud. WrenchBid builds a professional quote instantly — no typing, no templates.</div>
                <div className="ob-demo">
                  <div className="ob-demo-label"><span style={{width:8,height:8,borderRadius:"50%",background:"#b03030",display:"inline-block"}}/>Recording…</div>
                  <div className="ob-demo-text">{onboardTyped}{onboardTyped.length<74&&<span className="ob-cursor"/>}</div>
                </div>
              </div>

              {/* Slide 2 — Show the output */}
              <div className="ob-slide">
                <div className="ob-icon">⚡</div>
                <div className="ob-title">Speaks trades.<br/>Builds quotes.</div>
                <div className="ob-sub">Say it like you'd say it to a homeowner. WrenchBid understands hours, rates, materials, and client names.</div>
                <div className="ob-quote-preview">
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:13,letterSpacing:2,color:"var(--amber)",marginBottom:10,textTransform:"uppercase"}}>Quote Preview</div>
                  {[["Water Heater Replacement",""],["Labor — 3 hrs @ $105/hr","$315.00"],["Parts & Materials","$380.00"],["TOTAL","$695.00"]].map(([d,a],i)=>(
                    <div key={i} className="ob-qrow"><span>{d}</span>{a&&<span>{a}</span>}</div>
                  ))}
                </div>
                <div className="ob-phrases">
                  <div className="ob-phrase">"Roof repair for the Johnsons, 5 hours at $90, shingles cost me $210"</div>
                  <div className="ob-phrase">"Electrical panel upgrade, flat rate $1,800, client is Mike Torres"</div>
                </div>
              </div>

              {/* Slide 3 — Send it */}
              <div className="ob-slide">
                <div className="ob-icon">📱</div>
                <div className="ob-title">Text it to your<br/>client instantly</div>
                <div className="ob-sub">Send a professional quote via SMS with a tap. Your client gets a link to view and save the full quote as a PDF.</div>
                <div className="ob-demo" style={{marginTop:20}}>
                  <div className="ob-demo-label" style={{color:"#4caf50"}}>✓ What your client receives</div>
                  <div style={{fontSize:13,color:"#e8e0d0",lineHeight:1.7}}>
                    Hi John! Here's your quote from <strong style={{color:"var(--amber)"}}>Smith Plumbing</strong>.<br/>
                    📋 Water Heater Replacement<br/>
                    💰 Total: <strong style={{color:"var(--amber)"}}>$695.00</strong><br/>
                    📅 Valid: 30 days<br/>
                    🔗 <span style={{color:"#64b5f6",textDecoration:"underline"}}>View full quote →</span>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#666",marginTop:12}}>Free to use. No credit card required.</div>
              </div>
            </div>

            {/* Dots */}
            <div className="ob-dots">
              {[0,1,2].map(i=><div key={i} className={`ob-dot ${onboardStep===i?"on":""}`} onClick={()=>setOnboardStep(i)}/>)}
            </div>

            {/* Footer buttons */}
            <div className="ob-footer">
              {onboardStep<2?(
                <>
                  <button className="ob-btn-main" onClick={()=>setOnboardStep(s=>s+1)}>Next →</button>
                  <button className="ob-btn-skip" onClick={()=>{localStorage.setItem("wb_onboarded","1");setOnboardDone(true);setAuthMode("signup");}}>Skip intro</button>
                </>
              ):(
                <>
                  <button className="ob-btn-main" onClick={()=>{localStorage.setItem("wb_onboarded","1");setOnboardDone(true);setAuthMode("signup");}}>Get Started Free →</button>
                  <button className="ob-btn-next" onClick={()=>{localStorage.setItem("wb_onboarded","1");setOnboardDone(true);setAuthMode("signin");}}>Already have an account? Sign in</button>
                </>
              )}
            </div>
          </div>
        )}

      {!user&&(
        <div className="auth-overlay">
          <div className="auth-box">
            <div className="auth-hd">
                <div className="auth-logo">Wrench<em>Bid</em></div>
                <div className="auth-tagline">Voice-to-quote for tradespeople</div>
                <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:4}}>
                  {["🎙 Speak the job — quote builds itself","📱 Text it to your client in one tap","💰 Free to use, works on any phone"].map((t,i)=>(
                    <div key={i} style={{fontSize:12,color:"#888",textAlign:"left",paddingLeft:8}}>{t}</div>
                  ))}
                </div>
              </div>
            <div className="auth-stripe"/>
            <div className="auth-bd">
              <div className="auth-tabs">
                <button className={`auth-tab ${authMode==="signin"?"on":""}`} onClick={()=>{setAuthMode("signin");setAuthError("");}}>Sign In</button>
                <button className={`auth-tab ${authMode==="signup"?"on":""}`} onClick={()=>{setAuthMode("signup");setAuthError("");}}>Create Account</button>
              </div>
              {authError&&<div className="auth-err">{authError}</div>}
              <div className="auth-field"><label>Email</label><input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@yourbusiness.com" autoComplete="email"/></div>
              <div className="auth-field"><label>Password</label><input type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder={authMode==="signup"?"Min 6 characters":"Your password"} autoComplete={authMode==="signup"?"new-password":"current-password"} onKeyDown={e=>e.key==="Enter"&&(authMode==="signup"?handleSignUp():handleSignIn())}/></div>
              <button className="btn btn-cta btn-full" onClick={authMode==="signup"?handleSignUp:handleSignIn} disabled={authLoading||!authEmail||!authPassword}>{authLoading?"Please wait...":authMode==="signup"?"Create Account":"Sign In"}</button>
              <div className="auth-foot">{authMode==="signin"?"New to WrenchBid? ":"Already have an account? "}<button style={{background:"none",border:"none",color:"var(--amber-deep)",fontWeight:700,cursor:"pointer",fontSize:12}} onClick={()=>{setAuthMode(authMode==="signin"?"signup":"signin");setAuthError("");}}>{authMode==="signin"?"Create a free account":"Sign in"}</button></div>
            </div>
          </div>
        </div>
      )}

      <header className="hdr">
        <div className="logo">Wrench<em>Bid</em></div>
        {user?<div className="user-bar"><span className="user-email">{user.email}</span><button className="btn-signout" onClick={handleSignOut}>Sign Out</button></div>:<div className="version">Beta</div>}
      </header>

      <nav className="tabs">
        {[["new","⚡ Quote"],["history","📋 History"],["rebates","💰 Rebates"],["setup","⚙ Setup"]].map(([id,label])=>(
          <button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </nav>

      {tab==="new"&&(
        <div className="page">
          {step!=="preview"&&(
            <>
              <div className="tip"><strong>How it works:</strong> Tap the mic and describe the job out loud — client name, what you're doing, hours & rate, materials cost. WrenchBid builds the quote automatically.</div>
              <div className="mic-wrap">
                <div className="mic-hint">{step==="recording"?"🔴 Recording — tap to stop":"Tap to start speaking"}</div>
                <button className={`mic-btn ${step==="recording"?"live":""}`} onClick={toggleMic}>
                  <div className="mic-icon">{step==="recording"?"⏹":"🎙"}</div>
                  <div>{step==="recording"?"STOP":"SPEAK"}</div>
                </button>
              </div>
              <textarea className="tx-box" value={transcript} onChange={e=>{finalRef.current=e.target.value;interimRef.current="";displayRef.current=e.target.value;setTranscript(e.target.value);}} placeholder="Your words appear here as you speak... or type directly" rows={4} style={{resize:"vertical",width:"100%",fontFamily:"inherit",fontSize:14,lineHeight:1.6,outline:"none",cursor:"text",border:"none",background:"var(--ink)",color:"var(--paper)"}}/>
              {step==="processing"&&<div className="loader"/>}
              <div className="btn-row">
                <button className="btn btn-ghost" onClick={()=>{finalRef.current="";interimRef.current="";displayRef.current="";setTranscript("");}}>Clear</button>
                <button className="btn btn-cta" onClick={generate} disabled={!transcript.trim()||step==="processing"||step==="recording"}>{step==="processing"?"Building...":"⚡ Build Quote"}</button>
              </div>
              <div className="div"/>
              <div className="tip"><strong>Example phrases:</strong><br/>"Replace water heater for John Smith, 3 hours at $105/hr, parts cost $380"<br/><br/>"Paint exterior of house, flat rate $1400, client Maria Rodriguez"</div>
            </>
          )}
          {step==="preview"&&quote&&(
            <>
              <div className="qdoc">
                <div className="qdoc-hd"><div className="qdoc-biz">{biz.name}</div><div className="qdoc-trade">{biz.trade}{biz.phone?` · ${biz.phone}`:""}</div></div>
                <div className="qdoc-stripe"/>
                <div className="qdoc-body">
                  <div className="qdoc-meta-row">
                    <div className="qdoc-meta-cell">To<span><input className="editable editable-meta" value={quote.clientName||""} onChange={e=>setQuote(q=>({...q,clientName:e.target.value}))} placeholder="Client name"/></span></div>
                    <div className="qdoc-meta-cell" style={{textAlign:"right"}}>Quote #<span>{quote.qNum}</span></div>
                  </div>
                  <div className="qdoc-meta-row" style={{marginBottom:16}}>
                    <div className="qdoc-meta-cell">Date<span>{quote.date}</span></div>
                    <div className="qdoc-meta-cell" style={{textAlign:"right"}}>Valid<span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:4,marginTop:3}}><input type="number" value={quote.validDays} onChange={e=>setQuote(q=>({...q,validDays:Number(e.target.value)}))} style={{width:44,padding:"2px 6px",fontFamily:"'Barlow',sans-serif",fontSize:14,fontWeight:600,color:"var(--ink)",background:"var(--paper)",border:"1.5px solid var(--rule)",borderRadius:3,outline:"none",textAlign:"center"}}/><span style={{fontWeight:600,fontSize:14,color:"var(--ink)"}}>days</span></span></div>
                  </div>
                  <div className="sec-label">Scope of Work</div>
                  <div className="qdoc-job"><input className="editable editable-title" value={quote.jobTitle||""} onChange={e=>setQuote(q=>({...q,jobTitle:e.target.value}))} placeholder="Job title"/></div>
                  <div className="sec-label">Line Items</div>
                  <div className="li-table">
                    {quote.lineItems.map((li,i)=>(
                      <div className="li-row" key={i}>
                        <div style={{flex:1,marginRight:8}}>
                          <input className="editable editable-name" value={li.desc} onChange={e=>setQuote(q=>{const items=[...q.lineItems];items[i]={...items[i],desc:e.target.value};return{...q,lineItems:items};})}/>
                          {li.qty!==1&&<div className="li-sub">{li.qty} {li.unit} × {$$(li.rate)}</div>}
                        </div>
                        <input className="editable editable-amt" value={li.total} type="number" onChange={e=>setQuote(q=>{const items=[...q.lineItems];items[i]={...items[i],total:parseFloat(e.target.value)||0};const sub=items.reduce((s,l)=>s+l.total,0);const tax=sub>150?parseFloat((sub*(q.taxRate/100)).toFixed(2)):0;return{...q,lineItems:items,subtotal:parseFloat(sub.toFixed(2)),tax,grandTotal:parseFloat((sub+tax).toFixed(2))}})}/>
                      </div>
                    ))}
                  </div>
                  <div className="qdoc-notes"><strong>Notes</strong><input className="editable" style={{fontSize:12,color:"var(--muted)",marginTop:4,width:"100%"}} value={quote.notes||""} onChange={e=>setQuote(q=>({...q,notes:e.target.value}))} placeholder="Payment terms, warranty, etc."/></div>
                  {(biz.paymentTerms||biz.warranty||biz.customTerms||biz.licenseNum)&&(
                    <div className="qdoc-terms">
                      {biz.paymentTerms&&<div className="qdoc-terms-row"><div className="qdoc-terms-label">Payment Terms</div><div className="qdoc-terms-text">{biz.paymentTerms}</div></div>}
                      {biz.warranty&&<div className="qdoc-terms-row"><div className="qdoc-terms-label">Warranty</div><div className="qdoc-terms-text">{biz.warranty}</div></div>}
                      {biz.customTerms&&<div className="qdoc-terms-row"><div className="qdoc-terms-label">Terms & Conditions</div><div className="qdoc-terms-text">{biz.customTerms}</div></div>}
                      {biz.licenseNum&&<div className="qdoc-terms-row"><div className="qdoc-terms-label">License #</div><div className="qdoc-terms-text">{biz.licenseNum}</div></div>}
                    </div>
                  )}
                  <div className="disclaimer"><strong>Estimate only.</strong> Review all pricing before sending to clients.</div>
                  <div className="totals">
                    <div className="total-row"><span>Subtotal</span><span>{$$(quote.subtotal)}</span></div>
                    {quote.tax>0&&<div className="total-row"><span>Tax ({quote.taxRate}%)</span><span>{$$(quote.tax)}</span></div>}
                    <div className="total-final"><span>TOTAL</span><span>{$$(quote.grandTotal)}</span></div>
                  </div>
                </div>
              </div>
              <div className="send-lbl">Send to Client</div>
              <div className="send-row">
                <input className="ph-input" type="tel" placeholder="Client phone number" value={clientPhone} onChange={e=>{setClientPhone(e.target.value);setShareUrl(null);}}/>
                <button className="btn-sms" onClick={sendSMS} disabled={shareLoading} style={{minWidth:80,opacity:shareLoading?0.6:1}}>
                  {shareLoading?"…":"📱 SMS"}
                </button>
              </div>
              {shareUrl&&(
                <div style={{background:"#e8f5e9",border:"1px solid #81c784",borderRadius:4,padding:"8px 12px",marginBottom:8,fontSize:12,wordBreak:"break-all"}}>
                  <div style={{fontWeight:700,fontSize:10,letterSpacing:1,textTransform:"uppercase",color:"#2d7a4a",marginBottom:3}}>🔗 Quote Link (included in SMS)</div>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={{color:"#1a4a8a",textDecoration:"underline"}}>{shareUrl}</a>
                </div>
              )}
              <div className="btn-row" style={{marginBottom:8}}>
                <button className="btn btn-cta" style={{flex:1}} onClick={saveQuote}>💾 Save</button>
                <button className="btn btn-ghost" onClick={copyText} disabled={shareLoading}>{shareLoading?"…":"📋 Copy"}</button>
                <button className="btn btn-ghost" onClick={newQuote}>+ New</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab==="history"&&(
        <div className="page" style={{width:"100%"}}>
          {history.length===0
            ?<div className="empty"><div className="empty-icon">📋</div><p>No quotes yet.<br/><strong>Tap "Quote"</strong> to get started.</p></div>
            :<>
               <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                 <button className="btn btn-ghost" style={{fontSize:12,padding:"6px 14px",color:"var(--red)",borderColor:"var(--red)"}} onClick={clearHistory}>Clear All</button>
               </div>
               {history.map((q,i)=>(
                 <div className="h-item" key={i} style={{position:"relative"}}>
                   <div onClick={()=>{setQuote(q);setStep("preview");setTab("new");}}>
                     <div className="h-top"><div className="h-client">{q.clientName||"No client name"}</div><div className="h-total" style={{paddingRight:24}}>{$$(q.grandTotal)}</div></div>
                     <div className="h-job">{q.jobTitle}</div>
                     <div className="h-foot"><div className="h-date">{new Date(q.savedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div><div className={`chip ${q.status}`}>{q.status}</div></div>
                   </div>
                   <button onClick={e=>{e.stopPropagation();deleteQuote(i);}} style={{position:"absolute",top:8,right:8,background:"none",border:"none",cursor:"pointer",fontSize:15,color:"var(--muted)",padding:"4px 6px"}}>✕</button>
                 </div>
               ))}
             </>
          }
        </div>
      )}

      {tab==="rebates"&&(
        <div className="page"><RebateWizard state={biz.state} trade={biz.trade}/></div>
      )}

      {tab==="setup"&&(
        <div className="page">
          <div className="card">
            <div className="card-hd">Your Business Profile</div>
            <div className="card-bd">
              <div className="field"><label>Business Name</label><input value={biz.name} onChange={e=>setBiz(b=>({...b,name:e.target.value}))} placeholder="Mike's Plumbing LLC"/></div>
              <div className="field"><label>Your Trade</label><select value={biz.trade} onChange={e=>setBiz(b=>({...b,trade:e.target.value}))}>{TRADES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div className="field">
                <label>State</label>
                <select value={biz.state||""} onChange={e=>setBiz(b=>({...b,state:e.target.value}))}>
                  <option value="">Select your state...</option>
                  {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <div className="field-hint">Colorado has a full rebate database. Other states: we link you to DSIRE national database.</div>
              </div>
              <div className="field"><label>Phone</label><input type="tel" value={biz.phone} onChange={e=>setBiz(b=>({...b,phone:e.target.value}))} placeholder="(720) 555-0100"/></div>
              <div className="field"><label>Email</label><input type="email" value={biz.email} onChange={e=>setBiz(b=>({...b,email:e.target.value}))} placeholder="you@yourbusiness.com"/></div>
              <div className="field"><label>License # <span style={{fontWeight:400,letterSpacing:0,textTransform:"none",fontSize:11}}>(optional)</span></label><input value={biz.licenseNum} onChange={e=>setBiz(b=>({...b,licenseNum:e.target.value}))} placeholder="e.g. CO-PLB-12345"/></div>
              <div className="field">
                <label>Voice Language</label>
                <select value={biz.language||"en-US"} onChange={e=>setBiz(b=>({...b,language:e.target.value}))}>
                  <option value="en-US">🇺🇸 English</option>
                  <option value="es-US">🇲🇽 Spanish / Español</option>
                  <option value="pt-BR">🇧🇷 Portuguese / Português</option>
                  <option value="fr-FR">🇫🇷 French / Français</option>
                  <option value="zh-CN">🇨🇳 Chinese / 中文</option>
                  <option value="vi-VN">🇻🇳 Vietnamese / Tiếng Việt</option>
                  <option value="ko-KR">🇰🇷 Korean / 한국어</option>
                  <option value="ar-SA">🇸🇦 Arabic / العربية</option>
                </select>
                <div className="field-hint">Speak in your language — quotes are always built in English.</div>
              </div>
              <div className="field">
                <label>Sales Tax</label>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,letterSpacing:0,textTransform:"none",color:"var(--ink)",margin:0}}>
                    <input type="checkbox" checked={!!biz.taxEnabled} onChange={e=>setBiz(b=>({...b,taxEnabled:e.target.checked}))} style={{width:16,height:16,accentColor:"var(--amber)",cursor:"pointer"}}/>
                    Apply sales tax to quotes
                  </label>
                </div>
                {biz.taxEnabled&&<div style={{display:"flex",alignItems:"center",gap:8}}><input type="number" min="0" max="30" step="0.1" value={biz.taxRate} onChange={e=>setBiz(b=>({...b,taxRate:e.target.value}))} style={{width:90}}/><span style={{fontSize:14,color:"var(--muted)",fontWeight:500}}>% tax rate</span></div>}
                {!biz.taxEnabled&&<div className="field-hint">Tax will not appear on quotes.</div>}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-hd">Quote Terms & Conditions</div>
            <div className="card-bd">
              <div className="tip" style={{marginBottom:14}}><strong>These print on every quote automatically.</strong></div>
              <div className="field"><label>Payment Terms</label><textarea value={biz.paymentTerms} onChange={e=>setBiz(b=>({...b,paymentTerms:e.target.value}))} placeholder="e.g. 50% deposit required. Balance due upon completion."/></div>
              <div className="field"><label>Warranty</label><textarea value={biz.warranty} onChange={e=>setBiz(b=>({...b,warranty:e.target.value}))} placeholder="e.g. All labor warrantied for 1 year."/></div>
              <div className="field"><label>Additional Terms</label><textarea value={biz.customTerms} onChange={e=>setBiz(b=>({...b,customTerms:e.target.value}))} placeholder="e.g. Client responsible for permits."/></div>
              <button className="btn btn-cta btn-full" onClick={()=>{setTab("new");saveBizToCloud(biz);ping("Profile saved ✓");}}>Save Profile</button>
            </div>
          </div>
          <div className="div"/>
          <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8}}>
            <strong style={{display:"block",fontSize:10,letterSpacing:"2px",textTransform:"uppercase",color:"var(--amber-deep)",marginBottom:6}}>Roadmap</strong>
            ✅ Voice-to-quote via AI<br/>
            ✅ Quote preview + history<br/>
            ✅ SMS delivery<br/>
            ✅ Multi-language voice input<br/>
            ✅ Colorado + Federal rebate wizard (hardcoded, free, instant)<br/>
            🔜 PDF download<br/>
            🔜 Client e-signature<br/>
            🔜 Email delivery<br/>
            🔜 Stripe payment links
          </div>
        </div>
      )}

      {toast&&<div className="toast">{toast}</div>}
      <footer className="app-footer">
        © 2026 WrenchBid &nbsp;·&nbsp;
        <a href="https://wrenchbid.vercel.app/terms" target="_blank" rel="noopener noreferrer">Terms</a>
        <a href="https://wrenchbid.vercel.app/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
      </footer>
    </div>
  );
}
