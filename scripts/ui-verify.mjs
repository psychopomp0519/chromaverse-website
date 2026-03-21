/**
 * UI Interaction Verification Script v2
 *
 * 7-Category Systematic Verification:
 *   1. Page Health    — HTTP status, console errors, broken images
 *   2. Visual Render  — Desktop + Mobile full-page capture
 *   3. Navigation     — Internal links, mobile menu, theme toggle
 *   4. Scroll         — Snap scroll, lazy load, scroll position
 *   5. Forms          — Input focus, validation, submit
 *   6. Interactive    — Tabs, buttons, hover states, modals
 *   7. Responsive     — Overflow, horizontal scroll, touch targets
 *
 * Usage: node scripts/ui-verify.mjs [category|all]
 * Requires: npm run dev (port 3099) running
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3099';
const DIR = '/home/user/chromageprelude/screenshots';
const REPORT_PATH = '/home/user/chromageprelude/screenshots/verify-report.json';

const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
};

const PAGES = [
  { id: 'landing',           path: '/' },
  { id: 'about',             path: '/about' },
  { id: 'novel-hub',         path: '/novel' },
  { id: 'novel-ch1',         path: '/novel/1' },
  { id: 'novel-characters',  path: '/novel/characters' },
  { id: 'world-hub',         path: '/world' },
  { id: 'world-creation',    path: '/world/creation' },
  { id: 'world-races',       path: '/world/races' },
  { id: 'world-power',       path: '/world/power' },
  { id: 'world-society',     path: '/world/society' },
  { id: 'world-religion',    path: '/world/religion' },
  { id: 'world-geography',   path: '/world/geography' },
  { id: 'world-history',     path: '/world/history' },
  { id: 'world-economy',     path: '/world/economy' },
  { id: 'world-chromastorm', path: '/world/chromastorm' },
  { id: 'world-glossary',    path: '/world/glossary' },
  { id: 'world-growth',      path: '/world/growth' },
  { id: 'world-special',     path: '/world/special-beings' },
  { id: 'auth-login',        path: '/auth/login' },
  { id: 'auth-signup',       path: '/auth/signup' },
  { id: 'profile',           path: '/profile' },
];

// ─── Utilities ───────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function clearDir(dir) {
  if (!fs.existsSync(dir)) { ensureDir(dir); return 0; }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.json'));
  files.forEach(f => fs.unlinkSync(path.join(dir, f)));
  return files.length;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function shot(page, name) {
  const fp = path.join(DIR, `${name}.png`);
  try { await page.screenshot({ path: fp, fullPage: false }); } catch { /* page destroyed */ }
  return fp;
}

async function shotFull(page, name) {
  const fp = path.join(DIR, `${name}.png`);
  try { await page.screenshot({ path: fp, fullPage: true }); } catch { /* page destroyed */ }
  return fp;
}

async function launchBrowser() {
  return puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    headless: true,
  });
}

/** Safe goto — returns true on success, false on failure. Handles 500/ERR_ABORTED gracefully. */
async function safeGoto(page, url, timeout = 15000) {
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    await sleep(800);
    return { ok: (resp?.status() ?? 0) === 200, status: resp?.status() ?? 0 };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** Create a fresh page with viewport — use when previous page might be destroyed */
async function freshPage(browser, viewport = VIEWPORTS.desktop) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  return page;
}

function issue(category, severity, pageId, message, screenshot = null) {
  return { category, severity, pageId, message, screenshot, timestamp: Date.now() };
}

// ─── Category 1: Page Health ─────────────────

async function checkPageHealth(browser) {
  console.log('\n━━━ 1/7 PAGE HEALTH ━━━');
  const issues = [];
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS.desktop);

  for (const pg of PAGES) {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), reason: req.failure()?.errorText });
    });

    try {
      const resp = await page.goto(`${BASE}${pg.path}`, {
        waitUntil: 'networkidle2', timeout: 20000,
      });
      await sleep(1500);
      const status = resp?.status() ?? 0;

      // HTTP status
      if (status !== 200) {
        issues.push(issue('health', 'critical', pg.id, `HTTP ${status}`));
        console.log(`  ✗ ${pg.id} — HTTP ${status}`);
      } else {
        console.log(`  ✓ ${pg.id} — HTTP 200`);
      }

      // Console errors
      const realErrors = consoleErrors.filter(e =>
        !e.includes('favicon') && !e.includes('HMR') && !e.includes('Fast Refresh')
      );
      if (realErrors.length > 0) {
        issues.push(issue('health', 'high', pg.id,
          `Console errors (${realErrors.length}): ${realErrors[0].slice(0, 120)}`));
        console.log(`    ⚠ ${realErrors.length} console error(s)`);
      }

      // Failed network requests
      const realFails = failedRequests.filter(r =>
        !r.url.includes('favicon') && !r.url.includes('_next/webpack')
      );
      if (realFails.length > 0) {
        issues.push(issue('health', 'high', pg.id,
          `Failed requests (${realFails.length}): ${realFails.map(r => r.url).join(', ').slice(0, 200)}`));
        console.log(`    ⚠ ${realFails.length} failed request(s)`);
      }

      // Broken images
      const brokenImgs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).filter(img => {
          if (!img.src || img.src.startsWith('data:')) return false;
          return !img.complete || img.naturalWidth === 0;
        }).map(img => img.src);
      });
      if (brokenImgs.length > 0) {
        issues.push(issue('health', 'high', pg.id,
          `Broken images (${brokenImgs.length}): ${brokenImgs.join(', ').slice(0, 200)}`));
        console.log(`    ⚠ ${brokenImgs.length} broken image(s)`);
      }
    } catch (e) {
      issues.push(issue('health', 'critical', pg.id, `Load failed: ${e.message}`));
      console.log(`  ✗ ${pg.id} — LOAD FAILED: ${e.message.slice(0, 80)}`);
    }

    // Remove listeners for next page
    page.removeAllListeners('console');
    page.removeAllListeners('requestfailed');
  }

  await page.close();
  return issues;
}

// ─── Category 2: Visual Render ───────────────

async function checkVisualRender(browser) {
  console.log('\n━━━ 2/7 VISUAL RENDER ━━━');
  const issues = [];

  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    const prefix = vpName === 'desktop' ? 'd' : 'm';
    const page = await browser.newPage();
    await page.setViewport(vp);

    console.log(`  [${vpName} ${vp.width}x${vp.height}]`);

    for (const pg of PAGES) {
      try {
        await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(1200);
        await shotFull(page, `${prefix}-${pg.id}`);

        // Check for empty page (very small height = nothing rendered)
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        if (bodyHeight < 200) {
          issues.push(issue('visual', 'critical', pg.id,
            `${vpName}: Page appears empty (height=${bodyHeight}px)`));
          console.log(`    ✗ ${pg.id} — empty (${bodyHeight}px)`);
        } else {
          console.log(`    ✓ ${pg.id}`);
        }
      } catch (e) {
        issues.push(issue('visual', 'high', pg.id, `${vpName}: Capture failed — ${e.message}`));
        console.log(`    ✗ ${pg.id} — ${e.message.slice(0, 60)}`);
      }
    }
    await page.close();
  }

  return issues;
}

// ─── Category 3: Navigation ─────────────────

async function checkNavigation(browser) {
  console.log('\n━━━ 3/7 NAVIGATION ━━━');
  const issues = [];

  // 3a. Desktop internal links — collect from multiple pages
  console.log('  [Desktop link check]');
  let dPage = await freshPage(browser);
  let { ok } = await safeGoto(dPage, `${BASE}/`);
  if (!ok) { console.log('    ✗ Landing failed to load'); await dPage.close(); return issues; }

  // Collect links from landing, world hub, novel hub
  const collectPages = ['/', '/world', '/novel'];
  const allHrefs = new Set();
  for (const cp of collectPages) {
    const nav = await safeGoto(dPage, `${BASE}${cp}`);
    if (!nav.ok) continue;
    const links = await dPage.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.getAttribute('href'))
        .filter(h => h && h.startsWith('/'))
    ).catch(() => []);
    links.forEach(h => allHrefs.add(h));
  }

  const uniqueLinks = [...allHrefs];
  console.log(`    Found ${uniqueLinks.length} unique internal links across 3 pages`);

  // Test each internal link
  let brokenLinks = [];
  for (const href of uniqueLinks) {
    const r = await safeGoto(dPage, `${BASE}${href}`, 12000);
    if (!r.ok) brokenLinks.push({ href, status: r.status });
  }
  if (brokenLinks.length > 0) {
    issues.push(issue('navigation', 'high', 'global',
      `Broken internal links: ${brokenLinks.map(l => `${l.href}(${l.status})`).join(', ')}`));
    console.log(`    ✗ ${brokenLinks.length} broken link(s)`);
    brokenLinks.forEach(l => console.log(`      → ${l.href} (${l.status})`));
  } else {
    console.log(`    ✓ All ${uniqueLinks.length} links OK`);
  }
  await dPage.close();

  // 3b. Theme toggle
  console.log('  [Theme toggle]');
  dPage = await freshPage(browser);
  const themeNav = await safeGoto(dPage, `${BASE}/`);
  if (themeNav.ok) {
    const themeBtn = await dPage.$('button[aria-label*="theme"], button[aria-label*="Theme"], button[aria-label*="모드"], button[aria-label*="다크"], [data-testid="theme-toggle"], button:has(svg[class*="sun"]), button:has(svg[class*="moon"])');
    if (themeBtn) {
      await shot(dPage, 'nav-theme-before');
      await themeBtn.click().catch(() => {});
      await sleep(800);
      await shot(dPage, 'nav-theme-after');
      const htmlClass = await dPage.evaluate(() => document.documentElement.className).catch(() => '');
      console.log(`    ✓ Theme toggled — html class: "${htmlClass}"`);
    } else {
      const anyToggle = await dPage.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.filter(b => {
          const svg = b.querySelector('svg');
          if (!svg) return false;
          const html = b.innerHTML.toLowerCase();
          return html.includes('sun') || html.includes('moon') || html.includes('theme');
        }).length;
      }).catch(() => 0);
      if (anyToggle > 0) {
        console.log(`    ⚠ Theme toggle found via SVG scan but no aria-label`);
        issues.push(issue('navigation', 'medium', 'global', 'Theme toggle button missing aria-label'));
      } else {
        console.log(`    — No theme toggle detected`);
      }
    }
  }
  await dPage.close();

  // 3c. Mobile hamburger menu
  console.log('  [Mobile hamburger menu]');
  const mPage = await freshPage(browser, VIEWPORTS.mobile);
  const mobileNav = await safeGoto(mPage, `${BASE}/`);

  const menuSelectors = [
    'button[aria-label*="menu"]', 'button[aria-label*="Menu"]',
    'button[aria-label*="메뉴"]', 'button[aria-label*="탐색"]',
    '[class*="hamburger"]', '[class*="mobile-menu"]',
    'header button', 'nav button',
  ];

  let menuFound = false;
  for (const sel of menuSelectors) {
    const btn = await mPage.$(sel);
    if (btn) {
      const isVisible = await mPage.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }, btn);

      if (isVisible) {
        await shot(mPage, 'm-nav-closed');
        await btn.click();
        await sleep(600);
        await shot(mPage, 'm-nav-open');

        // Check if menu actually opened (new elements visible)
        const menuOpen = await mPage.evaluate(() => {
          const overlays = document.querySelectorAll('[class*="overlay"], [class*="drawer"], [class*="sheet"], [role="dialog"], [class*="mobile-nav"], nav[class*="open"]');
          return overlays.length > 0 || document.querySelectorAll('nav a:not([tabindex="-1"])').length > 3;
        });

        if (menuOpen) {
          console.log(`    ✓ Mobile menu opens (selector: ${sel})`);
        } else {
          console.log(`    ⚠ Button clicked but menu may not have opened`);
          issues.push(issue('navigation', 'medium', 'global',
            'Mobile menu button click did not visibly open navigation'));
        }
        menuFound = true;
        break;
      }
    }
  }

  if (!menuFound) {
    issues.push(issue('navigation', 'high', 'global',
      'No mobile hamburger menu button found'));
    console.log(`    ✗ No mobile menu button found`);
    await shot(mPage, 'm-nav-nomenu');
  }

  // 3d. Back navigation from subpages
  console.log('  [Back navigation from world subpages]');
  const backPage = await freshPage(browser);
  const backNav = await safeGoto(backPage, `${BASE}/world/creation`);
  if (backNav.ok) {
    const backLink = await backPage.$('a[href="/world"], a[href*="world"][class*="back"], button[class*="back"]');
    if (backLink) {
      console.log(`    ✓ Back link to /world found`);
    } else {
      issues.push(issue('navigation', 'low', 'world-creation',
        'No visible back link to world hub'));
      console.log(`    ⚠ No back link to /world from subpage`);
    }
  } else {
    console.log(`    — /world/creation not accessible (status: ${backNav.status})`);
  }
  await backPage.close();

  await mPage.close();
  return issues;
}

// ─── Category 4: Scroll ─────────────────────

async function checkScroll(browser) {
  console.log('\n━━━ 4/7 SCROLL BEHAVIOR ━━━');
  const issues = [];
  let page = await freshPage(browser);

  // 4a. Landing page snap scroll sections
  console.log('  [Landing scroll sections]');
  let nav = await safeGoto(page, `${BASE}/`);
  if (!nav.ok) { console.log('    ✗ Landing failed'); await page.close(); return issues; }
  await sleep(1200);

  const totalH = await page.evaluate(() => document.body.scrollHeight);
  const vpH = VIEWPORTS.desktop.height;
  const sections = Math.min(Math.ceil(totalH / vpH), 8);
  console.log(`    Total height: ${totalH}px, capturing ${sections} sections`);

  for (let i = 0; i < sections; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * vpH);
    await sleep(600);
    await shot(page, `scroll-landing-s${i}`);
  }

  // Check if snap scroll is working
  const hasSnapScroll = await page.evaluate(() => {
    const html = document.documentElement;
    const style = getComputedStyle(html);
    const main = document.querySelector('main, [class*="snap"]');
    const mainStyle = main ? getComputedStyle(main) : null;
    return {
      htmlSnap: style.scrollSnapType,
      mainSnap: mainStyle?.scrollSnapType,
      snapChildren: document.querySelectorAll('[class*="snap"], [style*="snap"]').length,
    };
  });
  console.log(`    Snap: html="${hasSnapScroll.htmlSnap}", main="${hasSnapScroll.mainSnap}", snap-children=${hasSnapScroll.snapChildren}`);

  // 4b. Novel chapter scroll + reading progress
  console.log('  [Novel chapter scroll]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/novel/1`);
  if (nav.ok) {
    await sleep(700);
    const novelH = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);

    // Scroll to middle
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.floor(novelH / 2)).catch(() => {});
    await sleep(800);
    await shot(page, 'scroll-novel-mid');

    // Check for progress indicator
    const hasProgress = await page.evaluate(() => {
      const bar = document.querySelector('[class*="progress"], [role="progressbar"], [class*="reading-progress"]');
      return !!bar;
    }).catch(() => false);
    console.log(`    Reading progress indicator: ${hasProgress ? '✓' : '✗'}`);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })).catch(() => {});
    await sleep(800);
    await shot(page, 'scroll-novel-end');
  } else {
    console.log('    ✗ Novel ch1 failed to load');
  }

  // 4c. World subpage scroll (long content)
  console.log('  [World page scroll]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/world/history`);
  if (!nav.ok) { console.log('    — /world/history not accessible'); await page.close(); return issues; }
  const worldH = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
  if (worldH > vpH * 2) {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await sleep(600);
    await shot(page, 'scroll-world-history-end');

    // Check footer visibility at bottom
    const footerVisible = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return false;
      const rect = footer.getBoundingClientRect();
      return rect.top < window.innerHeight;
    });
    console.log(`    Footer visible at bottom: ${footerVisible ? '✓' : '✗'}`);
    if (!footerVisible) {
      issues.push(issue('scroll', 'medium', 'world-history',
        'Footer not visible when scrolled to bottom'));
    }
  }

  await page.close();
  return issues;
}

// ─── Category 5: Forms ──────────────────────

async function checkForms(browser) {
  console.log('\n━━━ 5/7 FORMS & INPUT ━━━');
  const issues = [];
  let page = await freshPage(browser);

  // 5a. Login form
  console.log('  [Login form]');
  let nav = await safeGoto(page, `${BASE}/auth/login`);
  if (!nav.ok) { console.log('    ✗ Login page failed'); await page.close(); return issues; }

  const loginFields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    return inputs.map(i => ({
      type: i.type, name: i.name, placeholder: i.placeholder,
      id: i.id, required: i.required,
    }));
  });
  console.log(`    Inputs found: ${loginFields.length} — ${loginFields.map(f => f.type || f.name).join(', ')}`);

  // Try filling login form
  const emailInput = await page.$('input[type="email"], input[name="email"]');
  const passInput = await page.$('input[type="password"], input[name="password"]');

  if (emailInput && passInput) {
    // Focus state
    await emailInput.click();
    await sleep(300);
    await shot(page, 'form-login-focus');

    // Fill
    await emailInput.type('test@chromaverse.com');
    await passInput.click();
    await passInput.type('TestPassword123');
    await sleep(300);
    await shot(page, 'form-login-filled');

    // Try submit with empty fields first (validation test)
    await page.evaluate(() => {
      document.querySelectorAll('input').forEach(i => { i.value = ''; });
    });

    const submitBtn = await page.$('button[type="submit"], button:has-text("로그인"), button:has-text("Login"), form button');
    if (submitBtn) {
      await submitBtn.click();
      await sleep(500);
      await shot(page, 'form-login-empty-submit');

      // Check for validation messages
      const validationMsgs = await page.evaluate(() => {
        const msgs = document.querySelectorAll('[class*="error"], [class*="validation"], [role="alert"], .text-red, [class*="invalid"]');
        return msgs.length;
      });
      console.log(`    Validation messages after empty submit: ${validationMsgs}`);
    } else {
      issues.push(issue('forms', 'medium', 'auth-login', 'No submit button found'));
      console.log(`    ⚠ No submit button found`);
    }
  } else {
    issues.push(issue('forms', 'high', 'auth-login',
      `Missing form fields: email=${!!emailInput}, password=${!!passInput}`));
    console.log(`    ✗ Missing fields: email=${!!emailInput}, password=${!!passInput}`);
  }

  // 5b. Signup form
  console.log('  [Signup form]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/auth/signup`);
  if (nav.ok) {
    const signupFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder }));
    }).catch(() => []);
    console.log(`    Inputs found: ${signupFields.length} — ${signupFields.map(f => f.type || f.name).join(', ')}`);
  }

  // Check login ↔ signup navigation
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/auth/login`);
  if (nav.ok) {
    const signupLink = await page.$('a[href*="signup"], a[href*="sign-up"]');
    if (signupLink) {
      console.log(`    ✓ Login → Signup link exists`);
    } else {
      issues.push(issue('forms', 'medium', 'auth-login', 'No link to signup from login page'));
      console.log(`    ⚠ No signup link on login page`);
    }
  }

  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/auth/signup`);
  if (nav.ok) {
    const loginLink = await page.$('a[href*="login"], a[href*="sign-in"]');
    if (loginLink) {
      console.log(`    ✓ Signup → Login link exists`);
    } else {
      issues.push(issue('forms', 'medium', 'auth-signup', 'No link to login from signup page'));
      console.log(`    ⚠ No login link on signup page`);
    }
  }

  await page.close();
  return issues;
}

// ─── Category 6: Interactive Elements ───────

async function checkInteractive(browser) {
  console.log('\n━━━ 6/7 INTERACTIVE ELEMENTS ━━━');
  const issues = [];
  let page = await freshPage(browser);

  // 6a. Novel hub tabs
  console.log('  [Novel hub tabs]');
  let nav = await safeGoto(page, `${BASE}/novel`);
  if (!nav.ok) { console.log('    ✗ Novel hub failed'); }
  await sleep(400);
  await shot(page, 'interact-novel-default');

  const tabs = await page.$$('button[role="tab"], [class*="tab-trigger"], [data-state]');
  console.log(`    Tab buttons found: ${tabs.length}`);

  for (let i = 0; i < tabs.length; i++) {
    try {
      const label = await page.evaluate(el => el.textContent?.trim().slice(0, 20), tabs[i]);
      await tabs[i].click();
      await sleep(600);
      await shot(page, `interact-novel-tab${i}`);
      console.log(`    ✓ Tab ${i}: "${label}"`);
    } catch (e) {
      issues.push(issue('interactive', 'medium', 'novel-hub', `Tab ${i} click failed: ${e.message}`));
      console.log(`    ✗ Tab ${i} failed`);
    }
  }

  // 6b. World hub cards — hover/click
  console.log('  [World hub card interactions]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/world`);
  if (nav.ok) {
    await sleep(700);
    await shot(page, 'interact-world-default');

    const worldCards = await page.$$('a[href*="/world/"], [class*="card"] a, [class*="Card"]');
    console.log(`    World cards found: ${worldCards.length}`);

    if (worldCards.length > 0) {
      try {
        await worldCards[0].hover();
        await sleep(400);
        await shot(page, 'interact-world-hover');
        console.log(`    ✓ Card hover captured`);
      } catch (e) {
        console.log(`    ⚠ Card hover failed`);
      }
    }
  }

  // 6c. Character cards
  console.log('  [Character cards]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/novel/characters`);
  if (nav.ok) {
    await sleep(400);
    await shot(page, 'interact-chars-default');

    const charCards = await page.$$('[class*="character"], [class*="Character"], [class*="card"]');
    console.log(`    Character cards found: ${charCards.length}`);

    if (charCards.length > 0) {
      try {
        await charCards[0].click();
        await sleep(600);
        await shot(page, 'interact-chars-click');

        const expanded = await page.evaluate(() => {
          return document.querySelectorAll('[class*="expanded"], [class*="detail"], [class*="modal"], [class*="open"], [role="dialog"]').length > 0;
        }).catch(() => false);
        console.log(`    ${expanded ? '✓ Card expanded/opened' : '— No expansion detected (may be intended)'}`);
      } catch (e) {
        console.log(`    ⚠ Card click failed`);
      }
    }
  }

  // 6d. Footer interaction (rotating teasers)
  console.log('  [Footer teasers]');
  await page.close();
  page = await freshPage(browser);
  nav = await safeGoto(page, `${BASE}/`);
  if (nav.ok) {
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })).catch(() => {});
    await sleep(1000);

    const footerText1 = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return footer?.textContent?.trim().slice(0, 100);
    }).catch(() => '');
    console.log(`    Footer text sample: "${footerText1?.slice(0, 60)}…"`);
    await shot(page, 'interact-footer');
  }

  // 6e. Buttons — find all clickable elements without proper cursor
  console.log('  [Button accessibility scan]');
  // Reuse current page if still on landing, otherwise fresh
  if (!nav.ok) { await page.close(); page = await freshPage(browser); await safeGoto(page, `${BASE}/`); }

  const clickableIssues = await page.evaluate(() => {
    const problems = [];
    // Clickable divs without role
    const clickableDivs = document.querySelectorAll('div[onclick], span[onclick]');
    if (clickableDivs.length > 0) {
      problems.push(`${clickableDivs.length} div/span with onclick but no button role`);
    }
    // Buttons without accessible name
    const buttons = document.querySelectorAll('button');
    const noLabel = Array.from(buttons).filter(b => {
      const text = b.textContent?.trim();
      const aria = b.getAttribute('aria-label');
      const title = b.getAttribute('title');
      return !text && !aria && !title;
    });
    if (noLabel.length > 0) {
      problems.push(`${noLabel.length} button(s) without accessible name`);
    }
    // Links without href
    const emptyLinks = document.querySelectorAll('a:not([href])');
    if (emptyLinks.length > 0) {
      problems.push(`${emptyLinks.length} <a> without href`);
    }
    return problems;
  });

  if (clickableIssues.length > 0) {
    clickableIssues.forEach(p => {
      issues.push(issue('interactive', 'medium', 'landing', p));
      console.log(`    ⚠ ${p}`);
    });
  } else {
    console.log(`    ✓ No button accessibility issues found`);
  }

  await page.close();
  return issues;
}

// ─── Category 7: Responsive ─────────────────

async function checkResponsive(browser) {
  console.log('\n━━━ 7/7 RESPONSIVE LAYOUT ━━━');
  const issues = [];

  // Key pages to test responsive
  const testPages = ['landing', 'world-hub', 'novel-hub', 'novel-ch1', 'auth-login', 'about'];
  const breakpoints = [
    { name: 'mobile-s', width: 320, height: 568 },
    { name: 'mobile',   width: 390, height: 844 },
    { name: 'tablet',   width: 768, height: 1024 },
    { name: 'desktop',  width: 1280, height: 900 },
    { name: 'wide',     width: 1920, height: 1080 },
  ];

  let page = await browser.newPage();

  for (const pg of PAGES.filter(p => testPages.includes(p.id))) {
    console.log(`  [${pg.id}]`);
    for (const bp of breakpoints) {
      await page.setViewport({ width: bp.width, height: bp.height });
      const rNav = await safeGoto(page, `${BASE}${pg.path}`, 12000);
      if (!rNav.ok) {
        // Fresh page on failure to avoid stuck context
        await page.close();
        page = await browser.newPage();
        continue;
      }

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      }).catch(() => false);
      if (overflow) {
        issues.push(issue('responsive', 'high', pg.id,
          `Horizontal overflow at ${bp.name} (${bp.width}px)`));
        console.log(`    ✗ ${bp.name} (${bp.width}px) — HORIZONTAL OVERFLOW`);
        await shot(page, `resp-${pg.id}-${bp.name}-overflow`);
      }

      // Check touch target sizes on mobile
      if (bp.width < 500) {
        const smallTargets = await page.evaluate(() => {
          const clickables = document.querySelectorAll('a, button, input, [role="button"]');
          let small = 0;
          for (const el of clickables) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
              small++;
            }
          }
          return small;
        }).catch(() => 0);
        if (smallTargets > 3) {
          issues.push(issue('responsive', 'medium', pg.id,
            `${smallTargets} touch targets < 32px at ${bp.name}`));
          console.log(`    ⚠ ${bp.name} — ${smallTargets} small touch targets`);
        }
      }

      // Check text overflow / clipping
      const textOverflow = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, p, span, a');
        let clipped = 0;
        for (const el of elements) {
          try { var style = getComputedStyle(el); } catch { continue; }
          if (el.scrollWidth > el.clientWidth + 2 && style.overflow !== 'hidden' && style.textOverflow !== 'ellipsis') {
            clipped++;
          }
        }
        return clipped;
      }).catch(() => 0);
      if (textOverflow > 2) {
        issues.push(issue('responsive', 'medium', pg.id,
          `${textOverflow} text elements overflowing at ${bp.name}`));
        console.log(`    ⚠ ${bp.name} — ${textOverflow} text overflows`);
      }
    }
    console.log(`    ✓ ${pg.id} responsive check done`);
  }

  await page.close();
  return issues;
}

// ─── Main ────────────────────────────────────

async function main() {
  const category = process.argv[2] || 'all';
  const cleared = clearDir(DIR);
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  UI Interaction Verification v2          ║`);
  console.log(`║  Mode: ${category.padEnd(33)}║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`Cleared ${cleared} old files from screenshots/\n`);

  const browser = await launchBrowser();
  let allIssues = [];

  const categories = {
    health:      checkPageHealth,
    visual:      checkVisualRender,
    navigation:  checkNavigation,
    scroll:      checkScroll,
    forms:       checkForms,
    interactive: checkInteractive,
    responsive:  checkResponsive,
  };

  const toRun = category === 'all'
    ? Object.entries(categories)
    : [[category, categories[category]]];

  if (!toRun.every(([, fn]) => fn)) {
    console.error(`Unknown category: ${category}. Available: ${Object.keys(categories).join(', ')}, all`);
    process.exit(1);
  }

  for (const [name, fn] of toRun) {
    try {
      const issues = await fn(browser);
      allIssues.push(...issues);
    } catch (e) {
      console.error(`\n  ✗ Category "${name}" crashed: ${e.message}`);
      allIssues.push(issue(name, 'critical', 'global', `Category crashed: ${e.message}`));
    }
  }

  await browser.close();

  // ─── Summary Report ───────────────────────
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  VERIFICATION SUMMARY                    ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const bySeverity = { critical: [], high: [], medium: [], low: [] };
  allIssues.forEach(i => bySeverity[i.severity]?.push(i));

  const total = allIssues.length;
  console.log(`Total issues: ${total}`);
  console.log(`  🔴 Critical: ${bySeverity.critical.length}`);
  console.log(`  🟠 High:     ${bySeverity.high.length}`);
  console.log(`  🟡 Medium:   ${bySeverity.medium.length}`);
  console.log(`  🔵 Low:      ${bySeverity.low.length}\n`);

  if (bySeverity.critical.length > 0) {
    console.log('── CRITICAL ──');
    bySeverity.critical.forEach(i => console.log(`  [${i.category}] ${i.pageId}: ${i.message}`));
  }
  if (bySeverity.high.length > 0) {
    console.log('── HIGH ──');
    bySeverity.high.forEach(i => console.log(`  [${i.category}] ${i.pageId}: ${i.message}`));
  }
  if (bySeverity.medium.length > 0) {
    console.log('── MEDIUM ──');
    bySeverity.medium.forEach(i => console.log(`  [${i.category}] ${i.pageId}: ${i.message}`));
  }
  if (bySeverity.low.length > 0) {
    console.log('── LOW ──');
    bySeverity.low.forEach(i => console.log(`  [${i.category}] ${i.pageId}: ${i.message}`));
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    category,
    totalIssues: total,
    summary: {
      critical: bySeverity.critical.length,
      high: bySeverity.high.length,
      medium: bySeverity.medium.length,
      low: bySeverity.low.length,
    },
    issues: allIssues,
    screenshots: fs.readdirSync(DIR).filter(f => f.endsWith('.png')),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport saved: ${REPORT_PATH}`);
  console.log(`Screenshots: ${report.screenshots.length} files in ${DIR}/\n`);

  process.exit(bySeverity.critical.length > 0 ? 2 : total > 0 ? 1 : 0);
}

main().catch(e => { console.error('Fatal:', e); process.exit(99); });
