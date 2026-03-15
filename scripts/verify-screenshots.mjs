import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");
const BASE = "http://localhost:3099";

const PAGES = [
  { name: "01-landing", url: "/", waitFor: 2000 },
  { name: "02-world-hub", url: "/world" },
  { name: "03-world-power", url: "/world/power" },
  { name: "04-world-geography", url: "/world/geography" },
  { name: "05-novel-hub", url: "/novel" },
  { name: "06-novel-chapter1", url: "/novel/1" },
  { name: "07-novel-characters", url: "/novel/characters" },
  { name: "08-auth-login", url: "/auth/login" },
  { name: "09-auth-signup", url: "/auth/signup" },
  { name: "10-about", url: "/about" },
];

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const results = [];

  for (const pg of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    try {
      const response = await page.goto(`${BASE}${pg.url}`, {
        waitUntil: "networkidle2",
        timeout: 20000,
      });
      const status = response?.status() ?? 0;

      if (pg.waitFor) await new Promise((r) => setTimeout(r, pg.waitFor));

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, `${pg.name}.png`),
        fullPage: true,
      });

      results.push({ name: pg.name, url: pg.url, status, ok: status === 200 });
    } catch (err) {
      results.push({ name: pg.name, url: pg.url, status: 0, ok: false, error: err.message });
    }

    await page.close();
  }

  await browser.close();

  console.log("\n=== Verification Results ===\n");
  for (const r of results) {
    const icon = r.ok ? "PASS" : "FAIL";
    console.log(`[${icon}] ${r.name} (${r.url}) - HTTP ${r.status}${r.error ? ` ERROR: ${r.error}` : ""}`);
  }

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n${passed}/${results.length} pages passed.\n`);
}

run();
