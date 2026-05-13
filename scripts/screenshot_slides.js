const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const HTML_PATH = path.resolve(__dirname, "../output/individual_consultation_preview.html");
const OUT_DIR   = path.resolve(__dirname, "../output/slide_screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("file://" + HTML_PATH, { waitUntil: "networkidle0" });

  // 各スライドの wrapper を取得してスクショ
  const wrappers = await page.$$(".slide-wrapper");
  console.log(`スライド数: ${wrappers.length}`);

  for (let i = 0; i < wrappers.length; i++) {
    const outPath = path.join(OUT_DIR, `slide_${String(i+1).padStart(2,"0")}.png`);
    await wrappers[i].screenshot({ path: outPath });
    console.log(`  saved: ${outPath}`);
  }

  await browser.close();
  console.log("完了");
})();
