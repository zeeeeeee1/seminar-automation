// ============================================================
// Shared CTA + QR slide module — appended to every seminar deck
// Style: matches AIセラ brand (cream / black / gold)
//
// 使い方:
//   const { addCtaSlide, addQrSlide } = require("./cta_qr_slides");
//   await addCtaSlide(pres);   // CTAスライドを追加
//   await addQrSlide(pres);    // QRスライドを追加
//
// config/cta_config.json を自動で読み込みます。
// QR URLや文言はそちらで変更してください。
// ============================================================

const QRCode = require("qrcode");
const path   = require("path");
const fs     = require("fs");

// config読み込み（なければデフォルト値にフォールバック）
let cfg = {};
try {
  const cfgPath = path.join(__dirname, "../config/cta_config.json");
  cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
} catch (_) {}

const QR_URL      = (cfg.qr_url)           || "https://lin.ee/yhhurWq";
const QR_DISPLAY  = (cfg.qr_display_text)  || "lin.ee/yhhurWq";
const CTA         = (cfg.cta_slide)        || {};
const QRS         = (cfg.qr_slide)         || {};

const BRAND = {
  cream:   "F5F0E6",
  black:   "1A1A1A",
  gold:    "B8870B",
  goldLt:  "D4A017",
  white:   "FFFFFF",
  cardBg:  "EDE8DC",
  border:  "C8B98A",
  textMid: "3A3020",
};

function tag(s, label, x = 0.45, y = 0.22) {
  s.addShape(s.pres.shapes.RECTANGLE, {
    x, y, w: label.length * 0.115 + 0.4, h: 0.28,
    fill: { color: BRAND.black }, line: { color: BRAND.black, width: 0 },
  });
  s.addText(label, {
    x, y, w: label.length * 0.115 + 0.4, h: 0.28,
    fontSize: 8.5, fontFace: "Calibri", bold: true,
    color: BRAND.white, align: "center", valign: "middle", margin: 0,
    charSpacing: 3,
  });
}

// ─────────────────────────────────────────────
// CTA slide: "答えは、いいえ。" style
// ─────────────────────────────────────────────
async function addCtaSlide(pres, context = {}) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: BRAND.cream };

  const ctaTag    = CTA.tag     || "REALITY CHECK";
  const ctaTagSub = CTA.tag_sub || "• では、明日から稼げるか？";
  const ctaTitleB = CTA.title_black || "答えは、";
  const ctaTitleG = CTA.title_gold  || "いいえ。";
  const ctaSub    = CTA.subtitle    || "知識を入れただけでは、単価は上がらない。\n実務で使いこなせるようになるには、次の3つが必要です。";

  tag(s, ctaTag);
  s.addText(ctaTagSub, {
    x: ctaTag.length * 0.115 + 0.45 + 0.4, y: 0.22, w: 9.1 - ctaTag.length * 0.115 - 0.4, h: 0.28,
    fontSize: 9, fontFace: "Calibri", color: BRAND.textMid, valign: "middle",
  });

  // Main title
  s.addText(ctaTitleB, {
    x: 0.45, y: 0.6, w: 9.1, h: 0.78,
    fontSize: 40, fontFace: "Trebuchet MS", bold: true, color: BRAND.black,
  });
  s.addText(ctaTitleG, {
    x: 2.35, y: 0.6, w: 7.2, h: 0.78,
    fontSize: 40, fontFace: "Trebuchet MS", bold: true, color: BRAND.gold,
  });

  s.addText(ctaSub, {
    x: 0.45, y: 1.38, w: 9.1, h: 0.55,
    fontSize: 12, fontFace: "Calibri", color: BRAND.textMid,
  });

  // 3 reason cards
  // カードはconfig優先、なければデフォルト
  const cards = (CTA.cards && CTA.cards.length === 3) ? CTA.cards : [
    { num: "01 / ENVIRONMENT", title: "実践できる環境", body: "ハーネスを組める現場にそもそも入らないと、経験は積み上がらない。\n現場の選び方が単価を決める。" },
    { num: "02 / REVIEW",       title: "見てくれる人（レビュー）", body: "AIが出した設計を、そのまま提出しているうちは伸びない。\n「その判断は正しいか」を評価してくれる人が必要。" },
    { num: "03 / STRATEGY",     title: "単価交渉の導線", body: "単価を上げるには、交渉のタイミングと言葉選びがすべて。\nロードマップを一緒に引いてくれる伴走者がいるかどうかで差が出る。" },
  ];

  cards.forEach((c, i) => {
    const x = 0.3 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.05, w: 3.0, h: 2.55,
      fill: { color: BRAND.cream }, line: { color: BRAND.border, width: 1 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });
    // top accent line
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.05, w: 3.0, h: 0.04, fill: { color: BRAND.gold }, line: { color: BRAND.gold, width: 0 } });

    s.addText(c.num, { x: x + 0.14, y: 2.15, w: 2.72, h: 0.28, fontSize: 8.5, fontFace: "Calibri", color: BRAND.gold, bold: true, charSpacing: 2 });
    s.addText(c.title, { x: x + 0.14, y: 2.42, w: 2.72, h: 0.48, fontSize: 15, fontFace: "Trebuchet MS", bold: true, color: BRAND.black });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.14, y: 2.9, w: 2.72, h: 0.03, fill: { color: BRAND.border }, line: { color: BRAND.border, width: 0 } });
    s.addText(c.body, { x: x + 0.14, y: 2.97, w: 2.72, h: 1.5, fontSize: 11, fontFace: "Calibri", color: BRAND.textMid, valign: "top" });
  });

  // Dark CTA bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.6, w: 9.4, h: 0.62,
    fill: { color: BRAND.black }, line: { color: BRAND.black, width: 0 },
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 4.6, w: 0.06, h: 0.62, fill: { color: BRAND.gold }, line: { color: BRAND.gold, width: 0 } });
  s.addText("→", { x: 0.42, y: 4.6, w: 0.4, h: 0.32, fontSize: 14, color: BRAND.gold, bold: true, valign: "middle" });
  s.addText(CTA.cta_main || "そこ、僕がサポートします。", { x: 0.9, y: 4.62, w: 5.5, h: 0.32, fontSize: 13.5, fontFace: "Trebuchet MS", bold: true, color: BRAND.white });
  s.addText(CTA.cta_sub  || "個別相談会で、あなたの現場・スキル・次の一手を一緒に見ます。", { x: 0.9, y: 4.94, w: 8.6, h: 0.26, fontSize: 11, fontFace: "Calibri", color: "AAAAAA" });

  // Footer logo
  s.addText("AI  ◆  SELA", { x: 0.45, y: 5.3, w: 2.0, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: BRAND.textMid, charSpacing: 1 });
  s.addText(ctaTag, { x: 7.5, y: 5.3, w: 2.05, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: BRAND.textMid, charSpacing: 2, align: "right" });
}

// ─────────────────────────────────────────────
// QR slide: "NEXT ACTION" — scan to join
// ─────────────────────────────────────────────
async function addQrSlide(pres) {
  // Generate QR PNG base64（config/cta_config.json の qr_url を使用）
  const qrUrl = QR_URL;
  const qrBuffer = await QRCode.toBuffer(qrUrl, {
    errorCorrectionLevel: "M",
    width: 320,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  const qrBase64 = "image/png;base64," + qrBuffer.toString("base64");

  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: BRAND.cream };

  const qrsTag    = QRS.tag        || "NEXT ACTION";
  const qrsTagSub = QRS.tag_sub    || "• 特典受け取り  &  個別面談予約";
  const qrsTitleB = QRS.title_black || "技術を装着する";
  const qrsTitleG = QRS.title_gold  || "時代へ。";
  const qrsTitleS = QRS.title_sub   || "自由はすぐそこにある。";
  const qrsQuote  = QRS.quote       || "\" 技術を『着く』時代は終わり、技術を『装着（ハーネス）』する時代です。\n    まずは今日、一歩を踏み出しましょう。 \"";

  tag(s, qrsTag);
  s.addText(qrsTagSub, {
    x: qrsTag.length * 0.115 + 0.45 + 0.4, y: 0.22, w: 5, h: 0.28,
    fontSize: 9, fontFace: "Calibri", color: BRAND.textMid, valign: "middle",
  });

  // Left: headline
  s.addText(qrsTitleB, {
    x: 0.45, y: 0.62, w: 5.8, h: 0.72,
    fontSize: 36, fontFace: "Trebuchet MS", bold: true, color: BRAND.black,
  });
  s.addText(qrsTitleG, {
    x: 0.45, y: 1.3, w: 5.8, h: 0.65,
    fontSize: 36, fontFace: "Trebuchet MS", bold: true, color: BRAND.gold,
  });
  s.addText(qrsTitleS, {
    x: 0.45, y: 1.92, w: 5.8, h: 0.58,
    fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: BRAND.black,
  });

  // Bullet list
  const bullets = QRS.bullets && QRS.bullets.length ? QRS.bullets : [
    "特典4点セット（要点まとめ / ロードマップ / エージェント3選 / 案件3選）全員配布",
    "個別サポート面談（200〜300万ロードマップ ほか 3特典）",
    "限定オープンチャット（Claude Code / MCP 最新共有）",
    "次回セミナー優先ご招待",
  ];

  bullets.forEach((b, i) => {
    const y = 2.62 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: y + 0.1, w: 0.12, h: 0.12, fill: { color: BRAND.gold }, line: { color: BRAND.gold, width: 0 } });
    s.addText(b, { x: 0.68, y, w: 5.1, h: 0.4, fontSize: 11, fontFace: "Calibri", color: BRAND.textMid, valign: "middle" });
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 4.35, w: 5.2, h: 0.02, fill: { color: BRAND.border }, line: { color: BRAND.border, width: 0 } });

  // Quote
  s.addText(qrsQuote, {
    x: 0.45, y: 4.44, w: 5.2, h: 0.72,
    fontSize: 10, fontFace: "Calibri", italic: true, color: BRAND.textMid,
  });

  // Right: dark QR card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.2, y: 0.55, w: 3.4, h: 4.75,
    fill: { color: BRAND.black }, line: { color: BRAND.gold, width: 2 },
    shadow: { type: "outer", blur: 10, offset: 4, angle: 135, color: "000000", opacity: 0.25 },
  });
  // Gold top bar
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0.55, w: 3.4, h: 0.12, fill: { color: BRAND.gold }, line: { color: BRAND.gold, width: 0 } });

  s.addText(QRS.scan_label   || "SCAN TO JOIN", {
    x: 6.2, y: 0.75, w: 3.4, h: 0.3,
    fontSize: 8.5, fontFace: "Calibri", bold: true, color: BRAND.gold, align: "center", charSpacing: 3,
  });
  s.addText(QRS.card_title_1 || "特典受け取り & 個別面談", {
    x: 6.2, y: 1.05, w: 3.4, h: 0.35,
    fontSize: 13, fontFace: "Trebuchet MS", bold: true, color: BRAND.white, align: "center",
  });
  s.addText(QRS.card_title_2 || "はこちらから", {
    x: 6.2, y: 1.38, w: 3.4, h: 0.3,
    fontSize: 13, fontFace: "Trebuchet MS", bold: true, color: BRAND.white, align: "center",
  });

  // QR code image
  s.addImage({ data: qrBase64, x: 6.55, y: 1.75, w: 2.7, h: 2.7 });

  s.addText(QR_DISPLAY, {
    x: 6.2, y: 4.52, w: 3.4, h: 0.38,
    fontSize: 11.5, fontFace: "Calibri", color: "AAAAAA", align: "center", italic: true,
  });

  // Footer
  s.addText(QRS.footer_left || "AI  ◆  SELA", { x: 0.45, y: 5.3, w: 2.0, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: BRAND.textMid, charSpacing: 1 });
  s.addText(QRS.footer_right || "THANK  YOU", { x: 7.5, y: 5.3, w: 2.05, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: BRAND.textMid, charSpacing: 2, align: "right" });
}

module.exports = { addCtaSlide, addQrSlide };
