// HTMLプレビュー生成スクリプト
// Usage: node preview_html.js --spec <path> [--out <path>]

const fs   = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const specIdx = args.indexOf("--spec");
const outIdx  = args.indexOf("--out");
if (specIdx === -1) { console.error("Usage: node preview_html.js --spec <path>"); process.exit(1); }

const specPath = args[specIdx + 1];
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

let cfgPath = path.join(__dirname, "../config/cta_config.json");
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const CTA = cfg.cta_slide || {};
const QRS = cfg.qr_slide  || {};
const QR_DISPLAY = cfg.qr_display_text || "lin.ee/yhhurWq";

// Midnight テーマカラー
const C = {
  bg:      "#0D1B2A",
  accent:  "#C9A84C",
  white:   "#F0EDE4",
  mid:     "#B0A898",
  cardBg:  "#152032",
  border:  "#2A3D50",
  navy:    "#0D1B2A",
};

function esc(s) { return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"); }

function renderTitle(slide) {
  return `
    <div class="slide slide-title">
      <div class="title-inner">
        <div class="accent-line"></div>
        <h1>${esc(spec.title)}</h1>
        <p class="subtitle">${esc(spec.subtitle)}</p>
        <div class="divider"></div>
        <p class="tag-sub">${esc(slide.subtitle || "")}</p>
        <p class="presenter">${esc(spec.presenter || "AIセラ")}</p>
      </div>
    </div>`;
}

function renderSection(slide) {
  return `
    <div class="slide slide-section">
      <div class="sec-num">SECTION  ${String(slide.num || "").padStart(2,"0")}</div>
      <h2>${esc(slide.title)}</h2>
      <p class="sec-sub">${esc(slide.subtitle || "")}</p>
    </div>`;
}

function renderContent(slide) {
  const bullets = (slide.bullets || []).map(b =>
    `<li class="bullet-item">${esc(b)}</li>`
  ).join("");
  const note = slide.note ? `<div class="note">${esc(slide.note)}</div>` : "";
  return `
    <div class="slide slide-content">
      <div class="slide-header"><h3>${esc(slide.title)}</h3></div>
      <ul class="bullets">${bullets}</ul>
      ${note}
    </div>`;
}

function renderStat(slide) {
  const stats = (slide.stats || []).map(st => `
    <div class="stat-card">
      <div class="stat-value">${esc(st.value)}</div>
      <div class="stat-label">${esc(st.label)}</div>
      <div class="stat-sub">${esc(st.sub)}</div>
    </div>`).join("");
  return `
    <div class="slide slide-stat">
      <div class="slide-header"><h3>${esc(slide.title)}</h3></div>
      <p class="stat-subtitle">${esc(slide.subtitle || "")}</p>
      <div class="stat-row">${stats}</div>
    </div>`;
}

function renderTimeline(slide) {
  const steps = (slide.steps || []).map((st, i) => `
    <div class="tl-step">
      <div class="tl-num">${i+1}</div>
      <div class="tl-content">
        <div class="tl-title">${esc(st.title)}</div>
        <div class="tl-body">${esc(st.body)}</div>
      </div>
    </div>`).join("");
  return `
    <div class="slide slide-timeline">
      <div class="slide-header"><h3>${esc(slide.title)}</h3></div>
      <div class="tl-row">${steps}</div>
    </div>`;
}

function renderTwoColumn(slide) {
  function col(d, highlight) {
    const bullets = (d.bullets || []).map(b => `<li>${esc(b)}</li>`).join("");
    return `
      <div class="col-card ${highlight ? "col-highlight" : ""}">
        <div class="col-label">${esc(d.label || "")}</div>
        <div class="col-heading">${esc(d.heading || "")}</div>
        <ul class="col-bullets">${bullets}</ul>
      </div>`;
  }
  return `
    <div class="slide slide-twocol">
      <div class="slide-header"><h3>${esc(slide.title)}</h3></div>
      <div class="twocol-row">
        ${col(slide.left || {}, false)}
        ${col(slide.right || {}, true)}
      </div>
    </div>`;
}

function renderSummary(slide) {
  const items = (slide.takeaways || []).map((t, i) => `
    <div class="summary-item">
      <span class="sum-num">${String(i+1).padStart(2,"0")}</span>
      <span class="sum-text">${esc(t)}</span>
    </div>`).join("");
  return `
    <div class="slide slide-summary">
      <div class="slide-header"><h3>${esc(slide.title)}</h3></div>
      <div class="summary-list">${items}</div>
    </div>`;
}

function renderCta() {
  const cards = (CTA.cards || []).map(c => `
    <div class="cta-card">
      <div class="cta-card-num">${esc(c.num)}</div>
      <div class="cta-card-title">${esc(c.title)}</div>
      <div class="cta-card-body">${esc(c.body)}</div>
    </div>`).join("");
  return `
    <div class="slide slide-cta">
      <div class="cta-tag">${esc(CTA.tag || "CTA")}</div>
      <div class="cta-tag-sub">${esc(CTA.tag_sub || "")}</div>
      <div class="cta-title">
        <span class="cta-title-b">${esc(CTA.title_black || "")}</span>
        <span class="cta-title-g">${esc(CTA.title_gold || "")}</span>
      </div>
      <div class="cta-sub">${esc(CTA.subtitle || "")}</div>
      <div class="cta-cards">${cards}</div>
      <div class="cta-bar">
        <span class="cta-arrow">→</span>
        <span class="cta-main">${esc(CTA.cta_main || "")}</span>
        <span class="cta-bar-sub">${esc(CTA.cta_sub || "")}</span>
      </div>
    </div>`;
}

function renderQr() {
  const bullets = (QRS.bullets || []).map(b => `<li>${esc(b)}</li>`).join("");
  return `
    <div class="slide slide-qr">
      <div class="qr-left">
        <div class="cta-tag">${esc(QRS.tag || "NEXT ACTION")}</div>
        <div class="cta-tag-sub">${esc(QRS.tag_sub || "")}</div>
        <div class="qr-title">
          <span class="cta-title-b">${esc(QRS.title_black || "")}</span><br>
          <span class="cta-title-g">${esc(QRS.title_gold || "")}</span>
        </div>
        <div class="qr-title-sub">${esc(QRS.title_sub || "")}</div>
        <ul class="qr-bullets">${bullets}</ul>
        <div class="qr-quote">${esc(QRS.quote || "")}</div>
      </div>
      <div class="qr-right">
        <div class="qr-card">
          <div class="qr-scan">${esc(QRS.scan_label || "SCAN TO JOIN")}</div>
          <div class="qr-card-title1">${esc(QRS.card_title_1 || "")}</div>
          <div class="qr-card-title2">${esc(QRS.card_title_2 || "")}</div>
          <div class="qr-box">QR<br><span>${esc(QR_DISPLAY)}</span></div>
        </div>
      </div>
    </div>`;
}

function renderSlide(slide) {
  switch(slide.type) {
    case "title":      return renderTitle(slide);
    case "section":    return renderSection(slide);
    case "content":    return renderContent(slide);
    case "stat":       return renderStat(slide);
    case "timeline":   return renderTimeline(slide);
    case "two_column": return renderTwoColumn(slide);
    case "summary":    return renderSummary(slide);
    case "cta":        return renderCta();
    case "qr":         return renderQr();
    default:           return `<div class="slide"><p>${slide.type}</p></div>`;
  }
}

const slidesHtml = spec.slides.map((s, i) => `
  <div class="slide-wrapper" id="s${i+1}">
    <div class="slide-num">${i+1} / ${spec.slides.length}</div>
    ${renderSlide(s)}
  </div>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${spec.title} — プレビュー</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #111; font-family: "Hiragino Kaku Gothic ProN", "Meiryo", "Noto Sans JP", sans-serif; color: ${C.white}; }

.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #000a; padding: 8px 20px;
  display: flex; align-items: center; gap: 12px; font-size: 13px; }
.nav a { color: ${C.accent}; text-decoration: none; }

.slides-container { padding: 60px 20px 40px; max-width: 1100px; margin: 0 auto; }

.slide-wrapper { position: relative; margin-bottom: 32px; border-radius: 8px; overflow: hidden;
  box-shadow: 0 8px 32px #0008; }
.slide-num { position: absolute; top: 8px; right: 12px; font-size: 11px; color: ${C.accent}; opacity: .7; z-index:10; }

/* Base slide */
.slide { background: ${C.bg}; width: 100%; aspect-ratio: 16/9; padding: 5% 7%; position: relative; display: flex; flex-direction: column; }

/* Title slide */
.slide-title { justify-content: center; }
.title-inner { max-width: 80%; }
.accent-line { width: 60px; height: 4px; background: ${C.accent}; margin-bottom: 20px; }
.slide-title h1 { font-size: clamp(18px,3.2vw,42px); color: ${C.white}; font-weight: 700; line-height: 1.3; margin-bottom: 14px; }
.slide-title .subtitle { font-size: clamp(10px,1.4vw,18px); color: ${C.mid}; margin-bottom: 20px; }
.divider { width: 100%; height: 1px; background: ${C.border}; margin: 16px 0; }
.tag-sub { font-size: clamp(9px,1.1vw,14px); color: ${C.mid}; }
.presenter { font-size: clamp(9px,1.1vw,14px); color: ${C.accent}; margin-top: 8px; letter-spacing: 2px; }

/* Section slide */
.slide-section { justify-content: center; align-items: center; text-align: center;
  background: linear-gradient(135deg, ${C.bg} 0%, #162540 100%); }
.sec-num { font-size: clamp(10px,1.2vw,16px); color: ${C.accent}; letter-spacing: 4px; margin-bottom: 12px; }
.slide-section h2 { font-size: clamp(16px,2.6vw,36px); color: ${C.white}; font-weight: 700; line-height: 1.35; margin-bottom: 14px; }
.sec-sub { font-size: clamp(9px,1.1vw,15px); color: ${C.mid}; }

/* Content slide */
.slide-header { border-left: 4px solid ${C.accent}; padding-left: 12px; margin-bottom: 3%; }
.slide-header h3 { font-size: clamp(13px,1.9vw,26px); color: ${C.white}; font-weight: 700; }
.bullets { list-style: none; flex: 1; }
.bullet-item { font-size: clamp(9px,1.15vw,15px); color: ${C.mid}; padding: 4px 0 4px 16px; position: relative; line-height: 1.55; border-bottom: 1px solid ${C.border}; }
.bullet-item::before { content: ""; position: absolute; left: 0; top: 12px; width: 6px; height: 6px; border-radius: 50%; background: ${C.accent}; }
.note { margin-top: 3%; font-size: clamp(8px,1vw,13px); color: ${C.accent}; font-style: italic; }

/* Stat slide */
.stat-subtitle { font-size: clamp(8px,1vw,13px); color: ${C.mid}; margin-bottom: 5%; }
.stat-row { display: flex; gap: 3%; flex: 1; }
.stat-card { flex: 1; background: ${C.cardBg}; border: 1px solid ${C.border}; border-top: 3px solid ${C.accent};
  padding: 5% 4%; display: flex; flex-direction: column; gap: 8px; border-radius: 4px; }
.stat-value { font-size: clamp(20px,3.5vw,48px); color: ${C.accent}; font-weight: 700; }
.stat-label { font-size: clamp(9px,1.1vw,14px); color: ${C.white}; font-weight: 600; }
.stat-sub { font-size: clamp(8px,0.9vw,12px); color: ${C.mid}; line-height: 1.5; }

/* Timeline slide */
.tl-row { display: flex; gap: 2%; flex: 1; }
.tl-step { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.tl-num { width: 32px; height: 32px; background: ${C.accent}; color: #000; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.tl-content { background: ${C.cardBg}; border: 1px solid ${C.border}; padding: 12px; border-radius: 4px; flex: 1; }
.tl-title { font-size: clamp(9px,1.1vw,15px); color: ${C.accent}; font-weight: 700; margin-bottom: 8px; white-space: pre-line; }
.tl-body { font-size: clamp(8px,0.9vw,12px); color: ${C.mid}; line-height: 1.5; white-space: pre-line; }

/* Two column slide */
.twocol-row { display: flex; gap: 4%; flex: 1; }
.col-card { flex: 1; background: ${C.cardBg}; border: 1px solid ${C.border}; padding: 5% 4%; border-radius: 4px; }
.col-card.col-highlight { border-color: ${C.accent}; border-top: 3px solid ${C.accent}; }
.col-label { font-size: clamp(8px,1vw,13px); color: ${C.mid}; letter-spacing: 1px; margin-bottom: 8px; }
.col-heading { font-size: clamp(11px,1.5vw,20px); color: ${C.accent}; font-weight: 700; margin-bottom: 12px; }
.col-bullets { list-style: none; }
.col-bullets li { font-size: clamp(8px,1vw,13px); color: ${C.mid}; padding: 4px 0 4px 14px; position: relative; border-bottom: 1px solid ${C.border}; }
.col-bullets li::before { content: ""; position: absolute; left: 0; top: 11px; width: 5px; height: 5px; background: ${C.accent}; border-radius: 50%; }

/* Summary slide */
.summary-list { flex: 1; display: flex; flex-direction: column; gap: 2%; justify-content: center; }
.summary-item { display: flex; align-items: flex-start; gap: 16px; padding: 2.5% 3%; background: ${C.cardBg}; border: 1px solid ${C.border}; border-radius: 4px; }
.sum-num { color: ${C.accent}; font-weight: 700; font-size: clamp(13px,1.8vw,24px); flex-shrink: 0; }
.sum-text { font-size: clamp(8px,1vw,13px); color: ${C.mid}; line-height: 1.55; }

/* CTA slide */
.slide-cta { background: #F5F0E6; color: #1A1A1A; }
.slide-cta .cta-tag { display: inline-block; background: #1A1A1A; color: #fff; font-size: clamp(7px,0.9vw,11px); letter-spacing: 3px; padding: 3px 10px; font-weight: 700; }
.slide-cta .cta-tag-sub { font-size: clamp(8px,0.9vw,12px); color: #3A3020; margin: 4px 0 8px; }
.cta-title { font-size: clamp(18px,3.2vw,42px); font-weight: 700; margin-bottom: 6px; }
.cta-title-b { color: #1A1A1A; }
.cta-title-g { color: #B8870B; margin-left: 8px; }
.cta-sub { font-size: clamp(8px,1vw,13px); color: #3A3020; margin-bottom: 3%; }
.cta-cards { display: flex; gap: 2%; flex: 1; }
.cta-card { flex: 1; background: #EDE8DC; border: 1px solid #C8B98A; border-top: 3px solid #B8870B; padding: 4% 3%; border-radius: 4px; }
.cta-card-num { font-size: clamp(7px,0.85vw,11px); color: #B8870B; font-weight: 700; letter-spacing: 2px; margin-bottom: 6px; }
.cta-card-title { font-size: clamp(10px,1.3vw,17px); color: #1A1A1A; font-weight: 700; margin-bottom: 8px; }
.cta-card-body { font-size: clamp(7px,0.85vw,11px); color: #3A3020; line-height: 1.55; }
.cta-bar { background: #1A1A1A; padding: 2% 3%; display: flex; align-items: center; gap: 12px; margin-top: 3%; border-radius: 2px; flex-shrink: 0; }
.cta-arrow { color: #B8870B; font-size: clamp(14px,1.8vw,22px); font-weight: 700; }
.cta-main { color: #fff; font-size: clamp(10px,1.3vw,17px); font-weight: 700; }
.cta-bar-sub { color: #aaa; font-size: clamp(8px,0.85vw,11px); }

/* QR slide */
.slide-qr { background: #F5F0E6; color: #1A1A1A; flex-direction: row; padding: 5% 5%; gap: 5%; }
.qr-left { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.slide-qr .cta-tag { display: inline-block; background: #1A1A1A; color: #fff; font-size: clamp(7px,0.9vw,11px); letter-spacing: 3px; padding: 3px 10px; font-weight: 700; }
.slide-qr .cta-tag-sub { font-size: clamp(8px,0.9vw,12px); color: #3A3020; }
.qr-title { font-size: clamp(16px,2.8vw,38px); font-weight: 700; line-height: 1.2; margin: 6px 0; }
.qr-title-sub { font-size: clamp(11px,1.5vw,20px); font-weight: 700; color: #1A1A1A; }
.qr-bullets { list-style: none; margin-top: 6px; flex: 1; }
.qr-bullets li { font-size: clamp(8px,0.95vw,13px); color: #3A3020; padding: 4px 0 4px 14px; position: relative; border-bottom: 1px solid #C8B98A; }
.qr-bullets li::before { content: ""; position: absolute; left: 0; top: 11px; width: 5px; height: 5px; background: #B8870B; border-radius: 50%; }
.qr-quote { font-size: clamp(7px,0.85vw,11px); color: #6A5A40; font-style: italic; margin-top: 8px; line-height: 1.5; white-space: pre-line; }
.qr-right { width: 30%; display: flex; align-items: center; }
.qr-card { background: #1A1A1A; border: 2px solid #B8870B; padding: 5%; width: 100%; border-radius: 6px; text-align: center; }
.qr-scan { color: #B8870B; font-size: clamp(7px,0.85vw,11px); letter-spacing: 3px; font-weight: 700; margin-bottom: 8px; }
.qr-card-title1, .qr-card-title2 { color: #fff; font-size: clamp(9px,1.1vw,15px); font-weight: 700; line-height: 1.4; }
.qr-box { margin-top: 10px; background: #fff; color: #1A1A1A; padding: 10px; font-size: clamp(14px,2vw,28px); font-weight: 700; border-radius: 4px; line-height: 1.4; }
.qr-box span { display: block; font-size: clamp(8px,0.9vw,12px); font-weight: 400; color: #888; margin-top: 4px; }
</style>
</head>
<body>
<nav class="nav">
  <span style="color:${C.accent};font-weight:700;">${esc(spec.title)}</span>
  <span style="color:#666;margin-left:auto">全${spec.slides.length}スライド — HTMLプレビュー</span>
</nav>
<div class="slides-container">
${slidesHtml}
</div>
</body>
</html>`;

const outPath = outIdx !== -1 ? args[outIdx + 1]
  : path.join(__dirname, "../output", path.basename(specPath, ".json") + "_preview.html");

fs.writeFileSync(outPath, html, "utf8");
console.log(`✅ HTMLプレビュー生成完了: ${outPath}`);
console.log(`   スライド数: ${spec.slides.length} 枚`);
