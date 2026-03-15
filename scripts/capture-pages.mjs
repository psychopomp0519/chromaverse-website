import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";

const BASE_URL = "https://chromageprelude.pages.dev";
const OUTPUT_DIR = path.resolve("screenshots");

const PAGES = [
  { path: "/", name: "home" },
  { path: "/novel", name: "novel-list" },
  { path: "/novel/1", name: "novel-chapter1" },
  { path: "/novel/characters", name: "novel-characters" },
  { path: "/world", name: "world-index" },
  { path: "/world/creation", name: "world-creation" },
  { path: "/world/races", name: "world-races" },
  { path: "/world/power", name: "world-power" },
  { path: "/world/growth", name: "world-growth" },
  { path: "/world/society", name: "world-society" },
  { path: "/world/economy", name: "world-economy" },
  { path: "/world/religion", name: "world-religion" },
  { path: "/world/geography", name: "world-geography" },
  { path: "/world/history", name: "world-history" },
  { path: "/world/special-beings", name: "world-special-beings" },
  { path: "/world/chromastorm", name: "world-chromastorm" },
  { path: "/world/glossary", name: "world-glossary" },
  { path: "/about", name: "about" },
];

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const { path: pagePath, name } of PAGES) {
    const url = `${BASE_URL}${pagePath}`;
    console.log(`Capturing ${name} (${url})...`);
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      // Wait a bit for animations
      await new Promise((r) => setTimeout(r, 1500));

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${name}.png`),
        fullPage: true,
      });
      console.log(`  ✓ ${name}.png saved`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! Screenshots saved to ${OUTPUT_DIR}`);
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
