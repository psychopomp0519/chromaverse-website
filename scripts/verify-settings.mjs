/**
 * 세계관/설정 문서 검증 + 스크린샷 캡처
 *
 * 용도: 설정 문서 변경 후 웹사이트에 반영된 결과를 스크린샷으로 검증
 * 사용법: node scripts/verify-settings.mjs [mode]
 *
 * mode:
 *   all      — 전체 페이지 스크린샷 (기본)
 *   world    — 세계관 관련 페이지만
 *   novel    — 소설 관련 페이지만
 *   quick    — 랜딩 + 세계관 허브 + 소설 허브만
 */

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");
const BASE = "http://localhost:3099";

const PAGES = {
  core: [
    { name: "landing", url: "/", waitFor: 2000 },
  ],
  world: [
    { name: "world-hub", url: "/world" },
    { name: "world-creation", url: "/world/creation" },
    { name: "world-races", url: "/world/races" },
    { name: "world-power", url: "/world/power" },
    { name: "world-society", url: "/world/society" },
    { name: "world-religion", url: "/world/religion" },
    { name: "world-geography", url: "/world/geography" },
    { name: "world-history", url: "/world/history" },
    { name: "world-economy", url: "/world/economy" },
    { name: "world-codes", url: "/world/codes" },
    { name: "world-storms", url: "/world/storms" },
    { name: "world-border", url: "/world/border" },
  ],
  novel: [
    { name: "novel-hub", url: "/novel" },
    { name: "novel-ch1", url: "/novel/1" },
    { name: "novel-ch11", url: "/novel/11" },
    { name: "novel-characters", url: "/novel/characters" },
  ],
  auth: [
    { name: "auth-login", url: "/auth/login" },
    { name: "auth-signup", url: "/auth/signup" },
  ],
  other: [
    { name: "about", url: "/about" },
  ],
};

const MODES = {
  all: [...PAGES.core, ...PAGES.world, ...PAGES.novel, ...PAGES.auth, ...PAGES.other],
  world: [...PAGES.core, ...PAGES.world],
  novel: [...PAGES.core, ...PAGES.novel],
  quick: [PAGES.core[0], PAGES.world[0], PAGES.novel[0]],
};

async function clearScreenshots() {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));
    for (const f of files) {
      fs.unlinkSync(path.join(SCREENSHOTS_DIR, f));
    }
    console.log(`Cleared ${files.length} existing screenshots.`);
  } else {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

async function capturePages(pages, viewport = { width: 1280, height: 900 }) {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const results = [];

  for (const pg of pages) {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
      const response = await page.goto(`${BASE}${pg.url}`, {
        waitUntil: "networkidle2",
        timeout: 20000,
      });
      const status = response?.status() ?? 0;

      if (pg.waitFor) await new Promise(r => setTimeout(r, pg.waitFor));

      const filepath = path.join(SCREENSHOTS_DIR, `${pg.name}.png`);
      await page.screenshot({ path: filepath, fullPage: true });

      results.push({ name: pg.name, url: pg.url, status, ok: status === 200, file: filepath });
    } catch (err) {
      results.push({ name: pg.name, url: pg.url, status: 0, ok: false, error: err.message });
    }

    await page.close();
  }

  await browser.close();
  return results;
}

async function run() {
  const mode = process.argv[2] || "all";
  const pages = MODES[mode];

  if (!pages) {
    console.error(`Unknown mode: ${mode}. Available: ${Object.keys(MODES).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n=== Screenshot Verification (mode: ${mode}) ===\n`);

  // 1. 기존 스크린샷 삭제
  await clearScreenshots();

  // 2. 데스크톱 캡처
  console.log(`Capturing ${pages.length} pages (desktop 1280x900)...\n`);
  const results = await capturePages(pages);

  // 3. 결과 출력
  console.log("\n=== Results ===\n");
  for (const r of results) {
    const icon = r.ok ? "PASS" : "FAIL";
    console.log(`[${icon}] ${r.name} (${r.url}) - HTTP ${r.status}${r.error ? ` ERROR: ${r.error}` : ""}`);
  }

  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${passed}/${results.length} passed${failed > 0 ? `, ${failed} FAILED` : ""}.\n`);

  // 4. 캡처된 파일 목록
  if (passed > 0) {
    console.log("Screenshots saved to:");
    for (const r of results.filter(r => r.ok)) {
      console.log(`  ${r.file}`);
    }
    console.log("");
  }

  process.exit(failed > 0 ? 1 : 0);
}

run();
