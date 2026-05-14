const puppeteer = require("puppeteer-core");
const path = require("path");

const inputHtml = process.argv[2] || path.resolve(__dirname, "../output/course_summary.html");
const outputPdf = process.argv[3] || inputHtml.replace(/\.html$/, ".pdf");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("file://" + inputHtml, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outputPdf,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
  });
  await browser.close();
  console.log(`✅ PDF生成完了: ${outputPdf}`);
})();
