/**
 * slide_components.js — リッチスライド部品ライブラリ
 *
 * 使い方:
 *   const SC = require("./slide_components");
 *   SC.addTitleSlide(pres, theme, { title, date, presenter, subtitle });
 *   SC.addAgendaSlide(pres, theme, items);
 *   SC.addSectionDivider(pres, theme, { num, title, subtitle });
 *   SC.addContentSlide(pres, theme, { title, bullets, layout });
 *   SC.addStatSlide(pres, theme, { title, stats });
 *   SC.addQuoteSlide(pres, theme, { text, author });
 *   SC.addTimelineSlide(pres, theme, { title, steps });
 *   SC.addTwoColumnSlide(pres, theme, { title, left, right });
 *   SC.addSummarySlide(pres, theme, { title, takeaways });
 *   SC.addBioSlide(pres, theme, { name, role, description, achievements });
 */

const FOOTER_H = 0.175;
const FOOTER_Y = 5.45;
const SLIDE_W  = 10;
const SLIDE_H  = 5.625;

function footer(s, C, left = "AIセラ セミナー", right = "") {
  s.addShape(s.pres.shapes.RECTANGLE, {
    x: 0, y: FOOTER_Y, w: SLIDE_W, h: FOOTER_H,
    fill: { color: C.mid_bg }, line: { color: C.mid_bg, width: 0 },
  });
  s.addText(left, {
    x: 0.3, y: FOOTER_Y, w: 4, h: FOOTER_H,
    fontSize: 7.5, color: C.white, valign: "middle",
  });
  if (right) {
    s.addText(right, {
      x: 5.7, y: FOOTER_Y, w: 4, h: FOOTER_H,
      fontSize: 7.5, color: C.white, align: "right", valign: "middle",
    });
  }
}

function accentBar(s, C, y = 0, h = 0.07) {
  s.addShape(s.pres.shapes.RECTANGLE, {
    x: 0, y, w: SLIDE_W, h,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
}

function sideAccent(s, C, y, h) {
  s.addShape(s.pres.shapes.RECTANGLE, {
    x: 0.4, y, w: 0.06, h,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });
}

function headerBar(s, C, title) {
  s.addShape(s.pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: SLIDE_W, h: 1.0,
    fill: { color: C.dark_bg }, line: { color: C.dark_bg, width: 0 },
  });
  sideAccent(s, C, 0.2, 0.6);
  s.addText(title, {
    x: 0.6, y: 0, w: 9.0, h: 1.0,
    fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: C.white, valign: "middle",
  });
}

// ─────────────────────────────────────────────
// TITLE SLIDE
// ─────────────────────────────────────────────
function addTitleSlide(pres, C, { title, date = "", presenter = "AIセラ", subtitle = "" }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.dark_bg };

  accentBar(s, C, 0, 0.08);

  // 日付バッジ
  if (date) {
    const badgeW = Math.max(3.2, date.length * 0.16 + 0.6);
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: 0.38, w: badgeW, h: 0.38,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(date, {
      x: 0.5, y: 0.38, w: badgeW, h: 0.38,
      fontSize: 9, color: C.text_dark, bold: true, align: "center", valign: "middle", margin: 0,
    });
  }

  // メインタイトル
  s.addText(title, {
    x: 0.5, y: 0.95, w: 9, h: 2.6,
    fontSize: 34, fontFace: "Trebuchet MS", bold: true, color: C.white,
    align: "left", charSpacing: -0.5,
  });

  // サブタイトル
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5, y: 3.55, w: 9, h: 0.55,
      fontSize: 14, fontFace: "Calibri", color: C.accent_light,
    });
  }

  // プレゼンター名バッジ
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.62, w: 2.0, h: 0.35,
    fill: { color: C.mid_bg }, line: { color: C.accent, width: 1 },
  });
  s.addText(presenter, {
    x: 0.5, y: 4.62, w: 2.0, h: 0.35,
    fontSize: 10, color: C.accent, bold: true, align: "center", valign: "middle", margin: 0,
  });

  // デコレーション右下の大きなアクセント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.0, y: 1.0, w: 0.08, h: 3.8,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    transparency: 60,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.5, y: 2.0, w: 0.04, h: 2.8,
    fill: { color: C.accent_light }, line: { color: C.accent_light, width: 0 },
    transparency: 70,
  });

  footer(s, C, presenter);
}

// ─────────────────────────────────────────────
// AGENDA SLIDE
// ─────────────────────────────────────────────
function addAgendaSlide(pres, C, items) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.light_bg };
  headerBar(s, C, "本日のアジェンダ");

  const maxItems = Math.min(items.length, 6);
  const itemH = Math.min(0.9, (FOOTER_Y - 1.1) / maxItems - 0.06);

  items.slice(0, maxItems).forEach((item, i) => {
    const y = 1.12 + i * (itemH + 0.06);
    const isEven = i % 2 === 0;

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 9.2, h: itemH,
      fill: { color: isEven ? C.white : C.light_bg }, line: { color: C.accent, width: 0 },
      shadow: isEven ? { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.06 } : null,
    });
    sideAccent(s, C, y, itemH);

    // ナンバーバッジ
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y: y + itemH * 0.5 - 0.18, w: 0.36, h: 0.36,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(String(i + 1), {
      x: 0.55, y: y + itemH * 0.5 - 0.18, w: 0.36, h: 0.36,
      fontSize: 11, color: C.text_dark, bold: true, align: "center", valign: "middle", margin: 0,
    });

    s.addText(item, {
      x: 1.02, y, w: 8.5, h: itemH,
      fontSize: 14, fontFace: "Trebuchet MS", color: C.text_dark, valign: "middle",
    });
  });

  footer(s, C, "アジェンダ");
}

// ─────────────────────────────────────────────
// SECTION DIVIDER
// ─────────────────────────────────────────────
function addSectionDivider(pres, C, { num, title, subtitle = "" }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.dark_bg };

  // 背景装飾
  accentBar(s, C, 0, 0.06);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 0, w: 2.5, h: SLIDE_H,
    fill: { color: C.mid_bg }, line: { color: C.mid_bg, width: 0 },
    transparency: 60,
  });

  // セクション番号
  const numStr = String(num).padStart(2, "0");
  s.addText(numStr, {
    x: 6.5, y: 0.5, w: 3.0, h: 3.0,
    fontSize: 160, fontFace: "Trebuchet MS", bold: true,
    color: C.accent, transparency: 85, align: "center",
  });

  // SECTION ラベル
  s.addText(`SECTION  ${numStr}`, {
    x: 0.6, y: 1.4, w: 5.5, h: 0.4,
    fontSize: 10, fontFace: "Calibri", bold: true,
    color: C.accent, charSpacing: 4,
  });

  // タイトル
  s.addText(title, {
    x: 0.6, y: 1.85, w: 6.5, h: 1.9,
    fontSize: 34, fontFace: "Trebuchet MS", bold: true, color: C.white,
  });

  // アクセントライン
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.75, w: 2.4, h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });

  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 3.88, w: 6.5, h: 0.65,
      fontSize: 13, fontFace: "Calibri", color: C.text_light,
    });
  }

  footer(s, C, "AIセラ セミナー", `SECTION ${numStr}`);
}

// ─────────────────────────────────────────────
// CONTENT SLIDE（箇条書き）
// ─────────────────────────────────────────────
function addContentSlide(pres, C, { title, bullets = [], note = "" }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.light_bg };
  headerBar(s, C, title);

  const maxBullets = Math.min(bullets.length, 6);
  const areaH = FOOTER_Y - 1.1 - (note ? 0.55 : 0.1);
  const itemH = areaH / maxBullets;

  bullets.slice(0, maxBullets).forEach((text, i) => {
    const y = 1.1 + i * itemH;
    const isEven = i % 2 === 0;

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: y + 0.05, w: 9.2, h: itemH - 0.1,
      fill: { color: isEven ? C.white : C.light_bg }, line: { color: C.accent, width: 0 },
    });
    // アクセントドット
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.62, y: y + itemH * 0.5 - 0.07, w: 0.14, h: 0.14,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(text, {
      x: 0.88, y: y + 0.05, w: 8.8, h: itemH - 0.1,
      fontSize: 14, fontFace: "Calibri", color: C.text_dark, valign: "middle",
    });
  });

  // 補足ノート
  if (note) {
    const noteY = FOOTER_Y - 0.52;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: noteY, w: 9.2, h: 0.42,
      fill: { color: C.mid_bg }, line: { color: C.mid_bg, width: 0 },
      transparency: 85,
    });
    s.addText(`📌 ${note}`, {
      x: 0.55, y: noteY, w: 9.0, h: 0.42,
      fontSize: 11, fontFace: "Calibri", color: C.mid_bg, bold: true, valign: "middle",
      italic: true,
    });
  }

  footer(s, C, title);
}

// ─────────────────────────────────────────────
// STAT SLIDE（大きな数字）
// ─────────────────────────────────────────────
function addStatSlide(pres, C, { title, stats = [], subtitle = "" }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.dark_bg };
  accentBar(s, C, 0, 0.07);

  s.addText(title, {
    x: 0.5, y: 0.2, w: 9, h: 0.7,
    fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: C.white, valign: "middle",
  });

  if (subtitle) {
    s.addText(subtitle, {
      x: 0.5, y: 0.88, w: 9, h: 0.38,
      fontSize: 12, fontFace: "Calibri", color: C.accent_light,
    });
  }

  const count = Math.min(stats.length, 3);
  const cardW = count === 1 ? 4.0 : count === 2 ? 4.3 : 2.9;
  const gap   = count === 1 ? 3.0 : count === 2 ? 0.7 : 0.35;
  const startX = count === 1 ? 3.0 : count === 2 ? 0.7 : 0.35;

  stats.slice(0, count).forEach((st, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.45, w: cardW, h: 3.5,
      fill: { color: C.mid_bg }, line: { color: C.accent, width: 2 },
      shadow: { type: "outer", blur: 12, offset: 4, angle: 135, color: "000000", opacity: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.45, w: cardW, h: 0.08,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(st.value, {
      x, y: 1.7, w: cardW, h: 1.8,
      fontSize: count === 1 ? 90 : count === 2 ? 72 : 58,
      fontFace: "Trebuchet MS", bold: true,
      color: C.accent, align: "center", valign: "middle",
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.3, y: 3.5, w: cardW - 0.6, h: 0.02,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
      transparency: 50,
    });
    s.addText(st.label, {
      x, y: 3.58, w: cardW, h: 0.55,
      fontSize: 13, fontFace: "Calibri", bold: true,
      color: C.white, align: "center",
    });
    if (st.sub) {
      s.addText(st.sub, {
        x, y: 4.16, w: cardW, h: 0.7,
        fontSize: 10.5, fontFace: "Calibri",
        color: C.text_light, align: "center",
      });
    }
  });

  footer(s, C, title);
}

// ─────────────────────────────────────────────
// QUOTE SLIDE
// ─────────────────────────────────────────────
function addQuoteSlide(pres, C, { text, author = "", source = "" }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.mid_bg };

  accentBar(s, C, 0, 0.07);
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: SLIDE_H - 0.07, w: SLIDE_W, h: 0.07,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });

  // 大きなクォートマーク
  s.addText("“", {
    x: 0.2, y: 0.3, w: 2, h: 2,
    fontSize: 160, fontFace: "Georgia", color: C.accent, transparency: 40,
  });

  s.addText(text, {
    x: 1.0, y: 1.0, w: 8.0, h: 2.8,
    fontSize: 20, fontFace: "Trebuchet MS", bold: true, color: C.white,
    align: "left", valign: "middle",
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.0, y: 3.9, w: 2.2, h: 0.05,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  });

  if (author) {
    s.addText(`— ${author}${source ? `  |  ${source}` : ""}`, {
      x: 1.0, y: 4.02, w: 8.0, h: 0.45,
      fontSize: 13, fontFace: "Calibri", italic: true, color: C.accent_light,
    });
  }
}

// ─────────────────────────────────────────────
// TIMELINE / STEP SLIDE
// ─────────────────────────────────────────────
function addTimelineSlide(pres, C, { title, steps = [] }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.light_bg };
  headerBar(s, C, title);

  const count = Math.min(steps.length, 5);
  const stepW = (SLIDE_W - 0.8) / count;

  steps.slice(0, count).forEach((st, i) => {
    const x = 0.4 + i * stepW;
    const cx = x + stepW / 2;

    // 接続ライン（最後以外）
    if (i < count - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: 1.75, w: stepW, h: 0.04,
        fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        transparency: 40,
      });
    }

    // ステップ番号円形（矩形で代替）
    const circleSize = 0.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx - circleSize / 2, y: 1.55, w: circleSize, h: circleSize,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(String(i + 1), {
      x: cx - circleSize / 2, y: 1.55, w: circleSize, h: circleSize,
      fontSize: 14, fontFace: "Trebuchet MS", bold: true,
      color: C.text_dark, align: "center", valign: "middle", margin: 0,
    });

    // ステップカード
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.08, y: 2.3, w: stepW - 0.16, h: 2.7,
      fill: { color: C.white }, line: { color: C.accent, width: 1 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.08, y: 2.3, w: stepW - 0.16, h: 0.05,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });

    s.addText(st.title, {
      x: x + 0.14, y: 2.4, w: stepW - 0.28, h: 0.62,
      fontSize: 12, fontFace: "Trebuchet MS", bold: true,
      color: C.text_dark, align: "center", valign: "middle",
    });
    s.addText(st.body || "", {
      x: x + 0.14, y: 3.04, w: stepW - 0.28, h: 1.88,
      fontSize: 10.5, fontFace: "Calibri", color: C.text_dark,
      valign: "top", align: "left",
    });
  });

  footer(s, C, title);
}

// ─────────────────────────────────────────────
// TWO COLUMN SLIDE
// ─────────────────────────────────────────────
function addTwoColumnSlide(pres, C, { title, left = {}, right = {} }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.light_bg };
  headerBar(s, C, title);

  const colY = 1.08;
  const colH = FOOTER_Y - colY - 0.05;
  const colW = 4.55;
  const gap  = 0.3;

  const buildCol = (col, x, accent) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH,
      fill: { color: col.bg || C.white }, line: { color: C.accent, width: accent ? 2 : 1 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: 0.06,
      fill: { color: accent ? C.accent : C.mid_bg }, line: { color: C.accent, width: 0 },
    });
    if (col.label) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.15, y: colY + 0.12, w: colW - 0.3, h: 0.36,
        fill: { color: accent ? C.accent : C.mid_bg }, line: { color: C.accent, width: 0 },
      });
      s.addText(col.label, {
        x: x + 0.15, y: colY + 0.12, w: colW - 0.3, h: 0.36,
        fontSize: 11, fontFace: "Calibri", bold: true, charSpacing: 2,
        color: accent ? C.text_dark : C.white,
        align: "center", valign: "middle", margin: 0,
      });
    }
    if (col.heading) {
      s.addText(col.heading, {
        x: x + 0.2, y: colY + 0.56, w: colW - 0.4, h: 0.62,
        fontSize: 16, fontFace: "Trebuchet MS", bold: true, color: C.text_dark,
      });
    }
    if (col.bullets) {
      col.bullets.forEach((b, bi) => {
        const by = colY + 1.22 + bi * 0.54;
        s.addShape(pres.shapes.RECTANGLE, {
          x: x + 0.22, y: by + 0.18, w: 0.1, h: 0.1,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        s.addText(b, {
          x: x + 0.4, y: by, w: colW - 0.55, h: 0.5,
          fontSize: 12, fontFace: "Calibri", color: C.text_dark, valign: "middle",
        });
      });
    }
  };

  buildCol(left,  0.4,           false);
  buildCol(right, 0.4 + colW + gap, true);

  footer(s, C, title);
}

// ─────────────────────────────────────────────
// SUMMARY / KEY TAKEAWAYS SLIDE
// ─────────────────────────────────────────────
function addSummarySlide(pres, C, { title = "本日のまとめ", takeaways = [] }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.dark_bg };
  accentBar(s, C, 0, 0.07);

  s.addText(title, {
    x: 0.5, y: 0.12, w: 9, h: 0.72,
    fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: C.white, valign: "middle",
  });

  const count = Math.min(takeaways.length, 4);
  const cardH = (FOOTER_Y - 1.0) / count - 0.1;

  takeaways.slice(0, count).forEach((tk, i) => {
    const y = 0.95 + i * (cardH + 0.1);
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 9.2, h: cardH,
      fill: { color: C.mid_bg }, line: { color: C.accent, width: 0 },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.2 },
    });
    // アクセントサイドバー
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y, w: 0.07, h: cardH,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });

    // チェックマーク風のナンバー
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.58, y: y + cardH / 2 - 0.2, w: 0.4, h: 0.4,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText(String(i + 1), {
      x: 0.58, y: y + cardH / 2 - 0.2, w: 0.4, h: 0.4,
      fontSize: 12, fontFace: "Trebuchet MS", bold: true,
      color: C.text_dark, align: "center", valign: "middle", margin: 0,
    });

    s.addText(tk, {
      x: 1.1, y, w: 8.1, h: cardH,
      fontSize: 14, fontFace: "Calibri", color: C.white, valign: "middle",
    });
  });

  footer(s, C, title);
}

// ─────────────────────────────────────────────
// BIO / PRESENTER SLIDE
// ─────────────────────────────────────────────
function addBioSlide(pres, C, { name, role = "", description = "", achievements = [] }) {
  const s = pres.addSlide();
  s.pres = pres;
  s.background = { color: C.light_bg };

  // 左パネル（ダーク）
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 3.8, h: SLIDE_H,
    fill: { color: C.dark_bg }, line: { color: C.dark_bg, width: 0 },
  });
  accentBar(s, C, 0, 0.07);

  // アバタープレースホルダー
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.65, y: 0.55, w: 2.5, h: 2.5,
    fill: { color: C.mid_bg }, line: { color: C.accent, width: 2 },
  });
  s.addText("👤", {
    x: 0.65, y: 0.55, w: 2.5, h: 2.5,
    fontSize: 60, align: "center", valign: "middle",
  });

  s.addText(name, {
    x: 0.3, y: 3.2, w: 3.2, h: 0.65,
    fontSize: 20, fontFace: "Trebuchet MS", bold: true, color: C.white,
    align: "center",
  });
  if (role) {
    s.addText(role, {
      x: 0.3, y: 3.82, w: 3.2, h: 0.38,
      fontSize: 11, fontFace: "Calibri", color: C.accent,
      align: "center",
    });
  }

  // 右パネル
  headerBar(s, C, "プロフィール");
  // headerBarは x=0から始まるため、テキストのみ右側用に再追加
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.8, y: 0, w: SLIDE_W - 3.8, h: 1.0,
    fill: { color: C.dark_bg }, line: { color: C.dark_bg, width: 0 },
  });
  sideAccent(s, C, 0.2, 0.6);
  s.addText("プロフィール", {
    x: 4.2, y: 0, w: 5.5, h: 1.0,
    fontSize: 22, fontFace: "Trebuchet MS", bold: true, color: C.white, valign: "middle",
  });

  if (description) {
    s.addText(description, {
      x: 4.1, y: 1.1, w: 5.6, h: 1.3,
      fontSize: 12, fontFace: "Calibri", color: C.text_dark,
    });
  }

  if (achievements.length > 0) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 4.1, y: 2.48, w: 5.6, h: 0.03,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    });
    s.addText("実績・経歴", {
      x: 4.1, y: 2.58, w: 5.6, h: 0.36,
      fontSize: 11, fontFace: "Calibri", bold: true, color: C.mid_bg,
    });

    achievements.slice(0, 4).forEach((a, i) => {
      const y = 3.0 + i * 0.5;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.1, y: y + 0.17, w: 0.12, h: 0.12,
        fill: { color: C.accent }, line: { color: C.accent, width: 0 },
      });
      s.addText(a, {
        x: 4.3, y, w: 5.4, h: 0.46,
        fontSize: 12, fontFace: "Calibri", color: C.text_dark, valign: "middle",
      });
    });
  }

  footer(s, C, name);
}

module.exports = {
  addTitleSlide,
  addAgendaSlide,
  addSectionDivider,
  addContentSlide,
  addStatSlide,
  addQuoteSlide,
  addTimelineSlide,
  addTwoColumnSlide,
  addSummarySlide,
  addBioSlide,
};
