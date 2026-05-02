/**
 * generate_seminar.js — セミナースライド生成サンプル
 *
 * 使い方:
 *   node generate_seminar.js
 *
 * テーマ一覧は config/seminar_themes.json を参照
 * CTA・QR設定は config/cta_config.json を参照
 *
 * このファイルはサンプルです。
 * Claudeが実際に生成するときは、セミナー内容に合わせて
 * スライド内容を書き換えて使います。
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const { addCtaSlide, addQrSlide } = require("./cta_qr_slides");

// テーマ読み込み
const themes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../config/seminar_themes.json"), "utf8")
).themes;

// ─── セミナー設定（ここを書き換える） ───────────────────────
const SEMINAR = {
  title:    "サンプルセミナータイトル",
  date:     "2026年X月X日（X）21:00〜",
  theme:    themes["ocean"],       // ocean / midnight / coral / forest / teal / cherry
  filename: "sample_seminar.pptx",
};
// ────────────────────────────────────────────────────────────

const C = SEMINAR.theme;
const OUT = path.join(__dirname, "../output", SEMINAR.filename);
const mkShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.18 });

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title  = SEMINAR.title;

  // ─── SLIDE 1: タイトル ────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.dark_bg };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.08, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });

    // 日付バッジ
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.4, w: 2.8, h: 0.38, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
    s.addText(SEMINAR.date, { x: 0.5, y: 0.4, w: 2.8, h: 0.38, fontSize: 9, color: C.text_dark, bold: true, align: "center", valign: "middle", margin: 0 });

    s.addText(SEMINAR.title, {
      x: 0.5, y: 1.0, w: 9, h: 2.5,
      fontSize: 32, fontFace: "Trebuchet MS", bold: true, color: C.white,
      align: "left",
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.6, w: 1.8, h: 0.35, fill: { color: C.mid_bg }, line: { color: C.accent, width: 1 } });
    s.addText("AIセラ セミナー", { x: 0.5, y: 4.6, w: 1.8, h: 0.35, fontSize: 10, color: C.accent, bold: true, align: "center", valign: "middle", margin: 0 });

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.45, w: 10, h: 0.175, fill: { color: C.mid_bg }, line: { color: C.mid_bg, width: 0 } });
  }

  // ─── SLIDE 2: アジェンダ ──────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.light_bg };
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.0, fill: { color: C.dark_bg }, line: { color: C.dark_bg, width: 0 } });
    s.addText("本日のアジェンダ", { x: 0.4, y: 0, w: 9.2, h: 1.0, fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: C.white, valign: "middle" });

    const items = [
      "① TOPIC 1（15分）",
      "② TOPIC 2（15分）",
      "③ TOPIC 3（15分）",
      "④ まとめ & Q&A（15分）",
    ];
    items.forEach((item, i) => {
      const y = 1.1 + i * 0.95;
      s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.8, fill: { color: i % 2 === 0 ? C.white : C.light_bg }, line: { color: C.accent, width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 0.06, h: 0.8, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
      s.addText(item, { x: 0.6, y, w: 8.9, h: 0.8, fontSize: 15, fontFace: "Trebuchet MS", color: C.text_dark, valign: "middle" });
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.45, w: 10, h: 0.175, fill: { color: C.mid_bg }, line: { color: C.mid_bg, width: 0 } });
    s.addText("AIセラ セミナー", { x: 0, y: 5.45, w: 10, h: 0.175, fontSize: 8, color: C.white, align: "center", valign: "middle", margin: 0 });
  }

  // ─── SLIDE 3〜N: コンテンツスライド ───────────────────────
  // ※ Claudeがセミナー内容に合わせて追加する
  // 例:
  // {
  //   const s = pres.addSlide();
  //   // ... スライド内容
  // }

  // ─── 末尾: CTA + QR（必須・削除不可） ─────────────────────
  await addCtaSlide(pres);
  await addQrSlide(pres);

  // 保存
  await pres.writeFile({ fileName: OUT });
  console.log(`✅ 生成完了: ${OUT}`);

})().catch(e => {
  console.error("❌ エラー:", e);
  process.exit(1);
});
