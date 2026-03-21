/**
 * 세계관/설정 문서 검증 + 스크린샷 캡처
 *
 * 용도: 설정 문서 변경 후 웹사이트에 반영된 결과를 스크린샷으로 검증
 * 사용법: node scripts/verify-settings.mjs [mode] [--light] [--mobile] [--no-clear]
 *
 * mode:
 *   all      — 전체 페이지 스크린샷 (기본)
 *   world    — 세계관 관련 페이지만
 *   novel    — 소설 관련 페이지만
 *   quick    — 랜딩 + 세계관 허브 + 소설 허브만
 *
 * flags:
 *   --light  — 라이트 모드로 캡처 (접두사 light-)
 *   --mobile — 모바일 뷰포트 390x844 (접두사 m-)
 *   --no-clear — 기존 스크린샷 삭제하지 않음
 */

import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");
const BASE = process.env.BASE_URL || "http://localhost:3000";

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
    { name: "world-glossary", url: "/world/glossary" },
    { name: "world-chromastorm", url: "/world/chromastorm" },
    { name: "world-growth", url: "/world/growth" },
    { name: "world-special-beings", url: "/world/special-beings" },
  ],
  novel: [
    { name: "novel-hub", url: "/novel" },
    { name: "novel-ch1", url: "/novel/1" },
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

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = { light: false, mobile: false, noClear: false };
  let mode = "all";

  for (const arg of args) {
    if (arg === "--light") flags.light = true;
    else if (arg === "--mobile") flags.mobile = true;
    else if (arg === "--no-clear") flags.noClear = true;
    else if (MODES[arg]) mode = arg;
  }

  return { mode, ...flags };
}

function getPrefix(flags) {
  const parts = [];
  if (flags.mobile) parts.push("m");
  if (flags.light) parts.push("light");
  return parts.length > 0 ? parts.join("-") + "-" : "";
}

async function clearScreenshots(prefix) {
  if (fs.existsSync(SCREENSHOTS_DIR)) {
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => {
      if (!f.endsWith('.png')) return false;
      if (prefix) return f.startsWith(prefix);
      // default: only clear unprefixed files
      return !f.startsWith("m-") && !f.startsWith("light-") && !f.startsWith("m-light-");
    });
    for (const f of files) {
      fs.unlinkSync(path.join(SCREENSHOTS_DIR, f));
    }
    console.log(`Cleared ${files.length} existing screenshots (prefix: "${prefix || "(none)"}").`);
  } else {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
}

async function capturePages(pages, { viewport, prefix, light }) {
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
      // Set theme before navigation (next-themes reads localStorage on hydration)
      if (light) {
        await page.evaluateOnNewDocument(() => {
          localStorage.setItem("theme", "light");
          // Immediately set data-theme so SSR content renders in light
          document.addEventListener("DOMContentLoaded", () => {
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.style.colorScheme = "light";
          });
        });
      }

      const response = await page.goto(`${BASE}${pg.url}`, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
      const status = response?.status() ?? 0;

      // Ensure theme is fully applied after hydration
      if (light) {
        await page.evaluate(() => {
          document.documentElement.setAttribute("data-theme", "light");
          document.documentElement.style.colorScheme = "light";
        });
        // Wait for React to re-render with theme change
        await new Promise(r => setTimeout(r, 1000));
      }

      if (pg.waitFor) await new Promise(r => setTimeout(r, pg.waitFor));

      const filename = `${prefix}${pg.name}.png`;
      const filepath = path.join(SCREENSHOTS_DIR, filename);
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
  const { mode, light, mobile, noClear } = parseArgs();
  const pages = MODES[mode];

  if (!pages) {
    console.error(`Unknown mode: ${mode}. Available: ${Object.keys(MODES).join(", ")}`);
    process.exit(1);
  }

  const prefix = getPrefix({ light, mobile });
  const viewport = mobile
    ? { width: 390, height: 844 }
    : { width: 1280, height: 900 };
  const label = `${mobile ? "mobile" : "desktop"} ${light ? "light" : "dark"}`;

  console.log(`\n=== Screenshot Verification (mode: ${mode}, ${label}) ===\n`);

  // 1. 기존 스크린샷 삭제
  if (!noClear) {
    await clearScreenshots(prefix);
  }

  // 2. 캡처
  console.log(`Capturing ${pages.length} pages (${label} ${viewport.width}x${viewport.height})...\n`);
  const results = await capturePages(pages, { viewport, prefix, light });

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
