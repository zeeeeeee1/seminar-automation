#!/usr/bin/env node
/**
 * generate_from_spec.js — JSONスペックファイルからリッチなPPTXを生成
 *
 * 使い方:
 *   node generate_from_spec.js --spec ../specs/example_spec.json
 *   node generate_from_spec.js --spec ../specs/example_spec.json --theme midnight
 *   node generate_from_spec.js --spec ../specs/example_spec.json --output my_output.pptx
 *
 * スペックJSON形式は specs/example_spec.json を参照してください。
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");
const SC      = require("./slide_components");
const { addCtaSlide, addQrSlide } = require("./cta_qr_slides");

// ─── 引数パース ─────────────────────────────────────────
const args = process.argv.slice(2);
const get  = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const specPath    = get("--spec");
const themeOverride = get("--theme");
const outputOverride = get("--output");

if (!specPath) {
  console.error("使い方: node generate_from_spec.js --spec <path/to/spec.json>");
  process.exit(1);
}

// ─── ファイル読み込み ─────────────────────────────────────
const resolvedSpec = path.resolve(__dirname, specPath);
if (!fs.existsSync(resolvedSpec)) {
  console.error(`スペックファイルが見つかりません: ${resolvedSpec}`);
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(resolvedSpec, "utf8"));

const themes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../config/seminar_themes.json"), "utf8")
).themes;

const themeName = themeOverride || spec.theme || "ocean";
const C = themes[themeName];
if (!C) {
  console.error(`テーマが見つかりません: ${themeName}。利用可能: ${Object.keys(themes).join(", ")}`);
  process.exit(1);
}

// ─── 出力先 ───────────────────────────────────────────
const today = new Date();
const dateStr = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("");

const defaultFilename = `${dateStr}_${(spec.title || "seminar").replace(/[^\w　-鿿]/g, "_")}.pptx`;
const outputFilename  = outputOverride || spec.output_filename || defaultFilename;
const outputPath      = path.join(__dirname, "../output", outputFilename);

// ─── スライド生成 ─────────────────────────────────────
(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title  = spec.title || "セミナー";
  pres.author = spec.presenter || "AIセラ";

  const slides = spec.slides || [];

  for (const slide of slides) {
    switch (slide.type) {
      case "title":
        SC.addTitleSlide(pres, C, {
          title:     spec.title || "",
          date:      spec.date  || "",
          presenter: spec.presenter || "AIセラ",
          subtitle:  slide.subtitle || spec.subtitle || "",
        });
        break;

      case "agenda":
        SC.addAgendaSlide(pres, C, slide.items || []);
        break;

      case "section":
        SC.addSectionDivider(pres, C, {
          num:      slide.num      || 1,
          title:    slide.title    || "",
          subtitle: slide.subtitle || "",
        });
        break;

      case "content":
        SC.addContentSlide(pres, C, {
          title:   slide.title   || "",
          bullets: slide.bullets || [],
          note:    slide.note    || "",
        });
        break;

      case "stat":
        SC.addStatSlide(pres, C, {
          title:    slide.title    || "",
          subtitle: slide.subtitle || "",
          stats:    slide.stats    || [],
        });
        break;

      case "quote":
        SC.addQuoteSlide(pres, C, {
          text:   slide.text   || "",
          author: slide.author || "",
          source: slide.source || "",
        });
        break;

      case "timeline":
        SC.addTimelineSlide(pres, C, {
          title: slide.title || "",
          steps: slide.steps || [],
        });
        break;

      case "two_column":
        SC.addTwoColumnSlide(pres, C, {
          title: slide.title || "",
          left:  slide.left  || {},
          right: slide.right || {},
        });
        break;

      case "summary":
        SC.addSummarySlide(pres, C, {
          title:     slide.title     || "本日のまとめ",
          takeaways: slide.takeaways || [],
        });
        break;

      case "bio":
        SC.addBioSlide(pres, C, {
          name:         slide.name         || "",
          role:         slide.role         || "",
          description:  slide.description  || "",
          achievements: slide.achievements || [],
        });
        break;

      case "cta":
        await addCtaSlide(pres);
        break;

      case "qr":
        await addQrSlide(pres);
        break;

      default:
        console.warn(`⚠️  不明なスライドタイプ: "${slide.type}" — スキップします`);
    }
  }

  // CTA+QRが含まれていない場合は自動追加
  const hasCta = slides.some(s => s.type === "cta");
  const hasQr  = slides.some(s => s.type === "qr");
  if (!hasCta) {
    await addCtaSlide(pres);
    console.log("  → CTAスライドを自動追加しました");
  }
  if (!hasQr) {
    await addQrSlide(pres);
    console.log("  → QRスライドを自動追加しました");
  }

  await pres.writeFile({ fileName: outputPath });
  console.log(`\n✅ 生成完了: ${outputPath}`);
  console.log(`   テーマ   : ${C.name}`);
  console.log(`   スライド数: ${slides.length + (!hasCta ? 1 : 0) + (!hasQr ? 1 : 0)} 枚`);
})().catch(e => {
  console.error("❌ エラー:", e);
  process.exit(1);
});
