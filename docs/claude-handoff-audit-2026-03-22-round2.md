# Chromaverse Live Audit Handoff

Date: 2026-03-22 UTC  
Target: `https://chromaverse-website.pages.dev`

## Purpose

This document is intended to be handed directly to Claude Code so Claude can start fixing issues without needing additional context.

This pass focuses on:

- user experience
- functional bugs
- user-triggered failure cases
- responsive/mobile risks
- accessibility
- security and abuse risk
- SEO / metadata / deployment polish

## Verification method

### Live deployment checks performed

- Route status/title checks on:
  - `/`
  - `/auth/login`
  - `/auth/signup`
  - `/profile`
  - `/novel`
  - `/novel/1`
  - `/world/power`
- Live homepage HTML inspection for:
  - initial hero content
  - initial quote content
  - initial stat counters
  - initial header controls
  - meta/link tags
- Live HTTP header inspection for:
  - security headers
  - cache headers
- Live asset/meta-file checks for:
  - `robots.txt`
  - `favicon.ico`
  - `manifest.webmanifest`

### Code review performed

- App routes
- auth/login/signup flows
- profile flow
- comments flow
- world interactive components
- novel reading/spoiler logic
- theme and animation components
- schedule/progress logic
- global CSS and responsive behavior

## Important limitation

I attempted browser automation, but this environment cannot launch Chromium because required system libraries are missing (`libatk-1.0.so.0`).

Implication:

- desktop/mobile visual findings are a mix of:
  - live HTML confirmation
  - code-confirmed behavior
  - responsive behavior inferred from actual responsive classes and event handling

For issues below, I explicitly distinguish:

- `Live-confirmed`: observed from deployment response/headers/HTML
- `Code-confirmed`: guaranteed or highly likely from source
- `Responsive-inferred`: based on current mobile/desktop code paths

## Quick live findings

### Live route status

These routes returned `200` during this audit:

- `/auth/login`
- `/auth/signup`
- `/profile`
- `/novel`
- `/novel/1`
- `/world/power`

### Live title checks

- `/auth/login` -> `로그인 — 크로마버스 | 크로마버스`
- `/auth/signup` -> `회원가입 — 크로마버스 | 크로마버스`
- `/profile` -> `프로필 — 크로마버스 | 크로마버스`
- `/novel` -> `소설 — 크로마버스 | 크로마버스`
- `/novel/1` -> `1화: 빛이 흐르는 아침 | 크로마버스`
- `/world/power` -> `힘의 체계 — RGB · CMYK | 크로마버스`

### Live security/header findings

Observed response headers on `/`:

- present:
  - `referrer-policy: strict-origin-when-cross-origin`
  - `x-content-type-options: nosniff`
- missing:
  - `Content-Security-Policy`
  - `Permissions-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options`

Also present on HTML:

- `access-control-allow-origin: *`

### Live meta/link findings

Homepage HTML currently does **not** include:

- `og:title`
- `og:description`
- `og:image`
- `twitter:card`
- `canonical`
- `theme-color`

Homepage HTML link tags currently do **not** include:

- favicon
- app icon
- manifest

### Live static-file findings

These returned `404`:

- `/robots.txt`
- `/favicon.ico`
- `/manifest.webmanifest`

### Live first-paint HTML findings on homepage

These are still true in deployment HTML:

- hero subtitle area is empty before hydration
- quote block is effectively empty before hydration
- stat counters render as `0 / 0 / 0 / 0` before hydration
- header login/theme controls are absent in initial HTML

## Issue inventory

---

## A1. Login and signup have an open redirect risk through `returnTo`

Severity: high  
Type: security  
Status: code-confirmed

What happens:

- Both login and signup read `returnTo` from the query string
- After auth success, they call `router.push(returnTo)` with no validation
- If `returnTo` is an absolute external URL or a crafted path, this can become an open redirect or at minimum an unsafe redirect surface

Evidence:

- [login/page.tsx](/workspaces/chromaverse-website/src/app/auth/login/page.tsx#L13)
- [login/page.tsx](/workspaces/chromaverse-website/src/app/auth/login/page.tsx#L34)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L13)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L34)

Notes for Claude:

- Validate `returnTo`
- Allow only same-origin internal paths
- Reject absolute URLs and malformed values

---

## A2. No CSP / frame protection / permissions policy on live deployment

Severity: high  
Type: security  
Status: live-confirmed

Why this matters:

- No CSP means weaker protection against XSS impact if any injection point appears later
- No `X-Frame-Options` or `frame-ancestors` equivalent means the site is more exposed to clickjacking
- No `Permissions-Policy` leaves browser feature access less tightly constrained than necessary
- No `Strict-Transport-Security` means weaker HTTPS hardening policy

Evidence:

- live `/` response headers
- [next.config.ts](/workspaces/chromaverse-website/next.config.ts#L3)
  - no custom security headers configured

Notes for Claude:

- Since this is `output: "export"`, header strategy may need Cloudflare / Pages config or alternate deployment-layer config

---

## A3. Public comment fetch pulls `select("*")`, exposing more than needed

Severity: high  
Type: security / privacy  
Status: code-confirmed

What happens:

- Public comment loading fetches `*` from `comments`
- UI only needs a subset, but network payload can include:
  - `user_id`
  - `email` if stored
  - any future added columns

Why this matters:

- Privacy surface is larger than needed
- If RLS/policies are ever too permissive, this amplifies exposure
- Even if UI masks email, raw browser responses can still contain full data

Evidence:

- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L23)
- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L25)
- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L3)

Notes for Claude:

- Restrict selected columns
- Re-check actual Supabase schema and RLS

---

## A4. Comment write/delete/progress systems rely entirely on client-side Supabase + unseen RLS

Severity: high  
Type: security / operational risk  
Status: code-confirmed

Why this matters:

- `comments` and `reading_progress` are written directly from the browser
- Safety depends entirely on Supabase RLS policies, which are not visible in this repo review

Risk:

- If RLS is wrong, users could:
  - read other users' data
  - overwrite or delete others' records
  - spam content at scale

Evidence:

- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L40)
- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L63)
- [reading.ts](/workspaces/chromaverse-website/src/lib/reading.ts#L3)
- [reading.ts](/workspaces/chromaverse-website/src/lib/reading.ts#L47)
- [supabase/client.ts](/workspaces/chromaverse-website/src/lib/supabase/client.ts)

Notes for Claude:

- Verify RLS for `comments`
- Verify RLS for `reading_progress`
- Confirm anon-key permissions are least-privilege

---

## A5. No anti-abuse protection is visible for comments

Severity: medium to high  
Type: security / abuse  
Status: code-confirmed

What is missing:

- no CAPTCHA
- no client throttle
- no moderation gate
- no visible spam control
- no per-user cooldown

User/business impact:

- spam comments
- abuse from newly created accounts
- noisy or hostile public discussion

Evidence:

- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L40)
- [Comments.tsx](/workspaces/chromaverse-website/src/components/novel/Comments.tsx#L62)

---

## A6. Live deployment is missing basic web metadata assets

Severity: medium  
Type: SEO / polish / deployment  
Status: live-confirmed

Observed missing files:

- `robots.txt` -> `404`
- `favicon.ico` -> `404`
- `manifest.webmanifest` -> `404`

Impact:

- no favicon in tabs/bookmarks
- weaker crawl/index guidance
- no installable/PWA metadata surface

Evidence:

- live `curl -I` checks
- `public/` contains no favicon, no manifest, no robots file

---

## A7. Homepage lacks canonical/OG/Twitter/theme-color metadata

Severity: medium  
Type: SEO / sharing  
Status: live-confirmed

Missing in live homepage HTML:

- canonical URL
- Open Graph title/description/image
- Twitter card
- theme-color

Impact:

- poor social preview quality
- weaker SEO signal hygiene
- less polished mobile browser tab theming

Evidence:

- live homepage HTML meta inspection
- [layout.tsx](/workspaces/chromaverse-website/src/app/layout.tsx#L23)
  - only base metadata shown in code here

---

## A8. Header controls are missing from initial HTML

Severity: medium  
Type: UX / hydration  
Status: live-confirmed + code-confirmed

What happens:

- On first HTML response, header login and theme controls are absent
- They appear only after client mount/hydration

Impact:

- header looks incomplete on first paint
- first-time users can wonder where login/settings are

Evidence:

- live homepage HTML: no `로그인`, no theme toggle label/button
- [AuthButton.tsx](/workspaces/chromaverse-website/src/components/auth/AuthButton.tsx#L31)
- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L36)

---

## A9. Homepage hero subtitle is empty on first paint

Severity: medium  
Type: UX / hydration  
Status: live-confirmed + code-confirmed

What happens:

- Hero subtitle starts empty
- Typing begins only after a 1.5 second delay

Impact:

- hero feels partially blank
- key message is delayed

Evidence:

- live homepage HTML still contains empty subtitle slot
- [HeroScene.tsx](/workspaces/chromaverse-website/src/components/landing/HeroScene.tsx#L15)
- [HeroScene.tsx](/workspaces/chromaverse-website/src/components/landing/HeroScene.tsx#L62)

---

## A10. Homepage quote block is empty on first paint

Severity: medium  
Type: UX / hydration  
Status: live-confirmed + code-confirmed

What happens:

- Quote text only starts after the section enters view
- Server HTML contains only the opening quote shell

Impact:

- section looks broken or unfinished before hydration/scroll activation

Evidence:

- live homepage HTML quote block is effectively empty
- [NovelScene.tsx](/workspaces/chromaverse-website/src/components/landing/NovelScene.tsx#L16)
- [NovelScene.tsx](/workspaces/chromaverse-website/src/components/landing/NovelScene.tsx#L63)

---

## A11. Homepage stats still render as zeros on first paint

Severity: medium  
Type: UX / hydration  
Status: live-confirmed + code-confirmed

Observed live HTML:

- `0` 화의 대서사
- `0` 개 지역
- `0` 개 종족
- `0` 대막

Impact:

- world scale appears fake or missing before hydration

Evidence:

- live homepage HTML inspection
- [CTAScene.tsx](/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx#L26)
- [CTAScene.tsx](/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx#L81)

---

## A12. Landing page uses a nested full-height snap scroll container

Severity: medium to high  
Type: UX / accessibility / mobile behavior  
Status: code-confirmed, responsive-inferred

What happens:

- Homepage content scrolls inside an inner `.snap-container`
- It is `height: 100vh` and `overflow-y: auto`
- Outer page still has global header/footer

Why this is risky:

- nested scroll context can confuse users
- browser scroll restoration can feel off
- mobile address-bar behavior can feel awkward
- keyboard/page-down/assistive navigation can be less predictable
- reaching footer or exiting the inner scroll model can feel strange

Evidence:

- [page.tsx](/workspaces/chromaverse-website/src/app/page.tsx#L51)
- [globals.css](/workspaces/chromaverse-website/src/styles/globals.css#L160)

---

## A13. ColorScene animation loop leaks after unmount

Severity: high  
Type: bug / performance  
Status: code-confirmed

What happens:

- `draw()` calls `requestAnimationFrame(draw)` every frame
- effect cleanup cancels only the first scheduled frame
- the self-scheduling loop is not actually stopped

Impact:

- animation can continue after unmount
- wasted CPU/GPU
- possible battery drain
- possible duplicated animation loops after remounts

Evidence:

- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L23)
- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L72)
- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L90)
- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L92)

---

## A14. ColorScene is effectively desktop-hover-only

Severity: medium  
Type: responsive / mobile UX / accessibility  
Status: code-confirmed, responsive-inferred

What happens:

- canvas reacts only to mouse movement
- channel descriptions appear only on mouse enter
- no touch handler
- no keyboard handler

Impact:

- mobile users cannot discover channel descriptions
- keyboard users get little or no value from the interaction

Evidence:

- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L98)
- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L141)

---

## A15. World interactive map is not keyboard accessible

Severity: high  
Type: accessibility  
Status: code-confirmed

What happens:

- SVG regions use mouse enter/leave/click
- no focus handling
- no keyboard activation
- no semantic button/link structure per region

Impact:

- keyboard-only users cannot properly operate the map

Evidence:

- [InteractiveMap.tsx](/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx#L136)
- [InteractiveMap.tsx](/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx#L145)
- [InteractiveMap.tsx](/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx#L190)

---

## A16. World constellation map is also not keyboard accessible

Severity: high  
Type: accessibility  
Status: code-confirmed

What happens:

- Desktop map depends on hover and pointer interaction
- key data is visual and pointer-based
- SVG node pattern is not robustly keyboard-friendly

Evidence:

- [ConstellationMap.tsx](/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx#L158)
- [ConstellationMap.tsx](/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx#L166)
- [ConstellationMap.tsx](/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx#L215)

---

## A17. Comments “load more” logic is likely broken/resetting due to hook dependency coupling

Severity: high  
Type: functional bug  
Status: code-confirmed

Why this is a bug:

- `loadComments` depends on `page`
- `useEffect(init)` depends on `loadComments`
- clicking “댓글 더 보기” updates `page`
- that recreates `loadComments`
- which retriggers `init()`
- which calls `loadComments()` with `reset = true`
- which can reset the comment list back to page 0

Impact:

- “load more” can behave inconsistently
- comments can jump/reset
- duplicate fetches happen
- extra auth lookup runs unnecessarily

Evidence:

- [Comments.tsx](/workspaces/chromaverse-website/src/components/novel/Comments.tsx#L29)
- [Comments.tsx](/workspaces/chromaverse-website/src/components/novel/Comments.tsx#L50)
- [Comments.tsx](/workspaces/chromaverse-website/src/components/novel/Comments.tsx#L185)

---

## A18. Comment pagination query has an off-by-one pattern

Severity: low to medium  
Type: bug / inefficiency  
Status: code-confirmed

What happens:

- Supabase range uses inclusive bounds
- code sets:
  - `from = page * PAGE_SIZE`
  - `to = from + PAGE_SIZE`
- For page size 20, that requests 21 rows

Current behavior:

- then slices back to 20
- uses row 21 only to infer `hasMore`

This is not catastrophic, but:

- it is easy to misunderstand
- it does extra work
- it makes pagination logic harder to reason about

Evidence:

- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L20)
- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L28)
- [comments.ts](/workspaces/chromaverse-website/src/lib/comments.ts#L34)

---

## A19. Comment count shows loaded count, not total count

Severity: low  
Type: UX accuracy  
Status: code-confirmed

What happens:

- Header uses `comments.length`
- With pagination, this is not the real total comment count

Evidence:

- [Comments.tsx](/workspaces/chromaverse-website/src/components/novel/Comments.tsx#L110)

---

## A20. Login/signup inputs are missing autofill-friendly attributes and input normalization

Severity: medium  
Type: UX / user input failure  
Status: code-confirmed

Missing:

- `autoComplete="email"`
- `autoComplete="current-password"` on login
- `autoComplete="new-password"` on signup
- trimming/normalization for email input

Impact:

- worse password manager support
- easier user typo failure
- leading/trailing spaces in email can cause avoidable auth errors

Evidence:

- [login/page.tsx](/workspaces/chromaverse-website/src/app/auth/login/page.tsx#L47)
- [login/page.tsx](/workspaces/chromaverse-website/src/app/auth/login/page.tsx#L61)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L47)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L61)

---

## A21. Signup has no password confirmation and no email-confirmation guidance

Severity: medium  
Type: UX / user error handling  
Status: code-confirmed

Impact:

- password typos are easy
- if Supabase requires email verification, users get little clarity
- after signup success, redirect happens with no “check your email” state

Evidence:

- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L15)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L34)

---

## A22. Auth pages show raw backend error messages

Severity: medium  
Type: UX / information exposure  
Status: code-confirmed

What happens:

- Supabase `error.message` is rendered directly

Impact:

- inconsistent language
- low-quality user messaging
- unnecessary backend phrasing exposed directly to end users

Evidence:

- [login/page.tsx](/workspaces/chromaverse-website/src/app/auth/login/page.tsx#L28)
- [signup/page.tsx](/workspaces/chromaverse-website/src/app/auth/signup/page.tsx#L28)

---

## A23. SpoilerGuard is not actually a strong spoiler guard

Severity: high  
Type: spoiler-control bug / product consistency  
Status: code-confirmed

Problems:

1. default user progress is seeded from global spoiler map current max  
2. anonymous users inherit that global chapter baseline  
3. hidden spoiler content can be revealed by pressing `스포일러 보기`

Impact:

- spoiler protection is mostly cosmetic
- anonymous users can see more than intended
- users can bypass hidden content immediately

Evidence:

- [SpoilerGuard.tsx](/workspaces/chromaverse-website/src/components/novel/SpoilerGuard.tsx#L22)
- [SpoilerGuard.tsx](/workspaces/chromaverse-website/src/components/novel/SpoilerGuard.tsx#L53)
- [spoiler-map.json](/workspaces/chromaverse-website/src/content/world/spoiler-map.json#L2)

---

## A24. Spoiler utility exists but is not actually wired into world pages/components

Severity: high  
Type: bug / incomplete feature  
Status: code-confirmed

What exists:

- spoiler utility for terms/characters/sections
- spoiler map with gated sections

What is missing:

- no actual uses found in app/components for:
  - `getSectionSpoilers`
  - `isTermVisible`
  - `isCharacterVisible`

Impact:

- spoiler rules may exist in data but not be enforced

Evidence:

- [spoiler.ts](/workspaces/chromaverse-website/src/lib/spoiler.ts#L6)
- search across app/components found no usage

---

## A25. Main character cards leak spoiler-tagged character data

Severity: high  
Type: spoiler-control bug  
Status: code-confirmed

What happens:

- `coda`, `nix`, and `ray` have `spoilerAfter` in content data
- but `mainCharacters` are always rendered directly without `SpoilerGuard`
- only supporting characters are conditionally guarded

Impact:

- character spoilers are exposed earlier than the data model implies

Evidence:

- [characters/page.tsx](/workspaces/chromaverse-website/src/app/novel/characters/page.tsx#L24)
- [characters/page.tsx](/workspaces/chromaverse-website/src/app/novel/characters/page.tsx#L36)
- [coda.json](/workspaces/chromaverse-website/src/content/characters/coda.json#L19)
- [nix.json](/workspaces/chromaverse-website/src/content/characters/nix.json#L19)
- [ray.json](/workspaces/chromaverse-website/src/content/characters/ray.json#L18)

---

## A26. Profile released-chapter count can diverge from actual available content in future

Severity: medium  
Type: functional bug / future inconsistency  
Status: code-confirmed

Why:

- Profile uses `getReleasedChapterCount()`
- That counts entries in release schedule
- Novel page availability is file-backed and schedule-filtered

Current repo state observed:

- chapter files present: `001.json` to `006.json`
- release schedule already lists chapters `1` to `10`

Future impact:

- once schedule passes chapter 7+, profile totals can exceed actual available content files
- profile progress and chapter grid can diverge from novel page

Evidence:

- [profile/page.tsx](/workspaces/chromaverse-website/src/app/profile/page.tsx#L58)
- [schedule.ts](/workspaces/chromaverse-website/src/lib/schedule.ts#L79)
- [novel/page.tsx](/workspaces/chromaverse-website/src/app/novel/page.tsx#L18)
- [content.ts](/workspaces/chromaverse-website/src/lib/content.ts#L27)

---

## A27. Glossary search has no no-results state

Severity: low to medium  
Type: UX  
Status: code-confirmed

What happens:

- if search/category produces zero matches, user gets a blank result area
- only count changes

Impact:

- feels broken or uncertain

Evidence:

- [GlossarySearch.tsx](/workspaces/chromaverse-website/src/components/world/GlossarySearch.tsx#L70)
- [GlossarySearch.tsx](/workspaces/chromaverse-website/src/components/world/GlossarySearch.tsx#L72)

---

## A28. Glossary search input has no visible label or programmatic label

Severity: medium  
Type: accessibility  
Status: code-confirmed

What happens:

- input relies only on placeholder
- placeholder is not a substitute for an accessible label

Evidence:

- [GlossarySearch.tsx](/workspaces/chromaverse-website/src/components/world/GlossarySearch.tsx#L45)

---

## A29. Glossary popup lacks keyboard and viewport management

Severity: medium  
Type: accessibility / mobile UX  
Status: code-confirmed, responsive-inferred

Problems:

- no `aria-expanded`
- no Escape-to-close
- no focus management
- no viewport flip logic
- always opens `bottom-full left-1/2`

Impact:

- keyboard users get a poorer experience
- on small/mobile viewports the popup can clip offscreen

Evidence:

- [GlossaryPopup.tsx](/workspaces/chromaverse-website/src/components/novel/GlossaryPopup.tsx#L45)
- [GlossaryPopup.tsx](/workspaces/chromaverse-website/src/components/novel/GlossaryPopup.tsx#L52)

---

## A30. Reduced-motion support is incomplete

Severity: medium  
Type: accessibility / motion sensitivity  
Status: code-confirmed

What exists:

- CSS reduces animation duration
- CSS disables scroll snap in reduced motion mode

What is still missing:

- JS timers and RAF loops still run
- typing animations still run
- particle animation still runs
- color scene still animates
- global smooth scroll is still enabled

Impact:

- users with motion sensitivity still experience motion-heavy behavior

Evidence:

- [globals.css](/workspaces/chromaverse-website/src/styles/globals.css#L97)
- [globals.css](/workspaces/chromaverse-website/src/styles/globals.css#L334)
- [HeroScene.tsx](/workspaces/chromaverse-website/src/components/landing/HeroScene.tsx#L15)
- [NovelScene.tsx](/workspaces/chromaverse-website/src/components/landing/NovelScene.tsx#L29)
- [ParticleBackground.tsx](/workspaces/chromaverse-website/src/components/core/ParticleBackground.tsx#L87)
- [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L72)

---

## A31. Theme toggle can be spam-clicked during transition

Severity: low to medium  
Type: UX / state race  
Status: code-confirmed

What happens:

- theme button stays clickable during transition
- multiple timeouts can be queued
- no cleanup for pending timeouts on unmount

Impact:

- flicker
- inconsistent final theme state
- possible state update after unmount

Evidence:

- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L21)
- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L27)
- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L31)
- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L62)

---

## A32. Chroma simulator sliders are not properly labeled for assistive tech

Severity: medium  
Type: accessibility  
Status: code-confirmed

What happens:

- sliders are visually described by nearby text
- but no explicit `label` or `aria-label` is attached to each range input

Evidence:

- [ChromaSimulator.tsx](/workspaces/chromaverse-website/src/components/world/ChromaSimulator.tsx#L123)

---

## A33. Header scroll listener is rebound repeatedly

Severity: low  
Type: performance / maintainability  
Status: code-confirmed

Why:

- effect depends on `lastScrollY`
- listener is torn down and re-added whenever that state changes

Impact:

- unnecessary listener churn
- potential subtle jank on scroll-heavy pages

Evidence:

- [CinemaHeader.tsx](/workspaces/chromaverse-website/src/components/layout/CinemaHeader.tsx#L15)
- [CinemaHeader.tsx](/workspaces/chromaverse-website/src/components/layout/CinemaHeader.tsx#L30)

---

## A34. `npm run lint` is not usable non-interactively

Severity: low  
Type: developer workflow / quality gate  
Status: command-confirmed

What happened:

- running `npm run lint` triggers `next lint`
- Next asks interactive ESLint setup questions instead of running checks

Impact:

- CI/local verification is blocked
- quality gate is effectively missing

Evidence:

- `npm run lint` execution during this audit prompted interactive setup instead of linting

---

## A35. Header/radial menu still depend on client-only state for first impression

Severity: low to medium  
Type: UX / hydration  
Status: live-confirmed + code-confirmed

Details:

- header auth control absent on first HTML
- theme toggle placeholder returns empty shell until mounted
- radial menu is visible, but its expanded semantics are hidden until client interaction

Evidence:

- [AuthButton.tsx](/workspaces/chromaverse-website/src/components/auth/AuthButton.tsx#L31)
- [ThemeToggle.tsx](/workspaces/chromaverse-website/src/components/core/ThemeToggle.tsx#L36)
- live homepage HTML control absence

## Mobile / responsive emphasis

These are the most important mobile-specific issues from this pass:

1. ColorScene descriptions are effectively unavailable on touch devices  
   Evidence: [ColorScene.tsx](/workspaces/chromaverse-website/src/components/landing/ColorScene.tsx#L141)

2. Glossary popups can clip offscreen because they only open upward and centered  
   Evidence: [GlossaryPopup.tsx](/workspaces/chromaverse-website/src/components/novel/GlossaryPopup.tsx#L52)

3. Nested `100vh` snap scrolling on landing is risky on mobile browser chrome/address-bar behavior  
   Evidence: [page.tsx](/workspaces/chromaverse-website/src/app/page.tsx#L51), [globals.css](/workspaces/chromaverse-website/src/styles/globals.css#L160)

4. World interactive desktop map is inaccessible without pointer semantics; mobile fallback exists for constellation map but not for all interactive affordances  
   Evidence: [InteractiveMap.tsx](/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx#L130)

## Suggested fixing order for Claude

1. A1 open redirect in auth
2. A2/A3/A4 security and data exposure surface
3. A17 comment pagination reset bug
4. A23/A24/A25 spoiler-control failures
5. A13 animation leak in ColorScene
6. A12 landing nested-scroll model review
7. A15/A16/A28/A29/A30/A32 accessibility gaps
8. A6/A7 metadata/SEO/deployment polish
9. A20/A21/A22 auth input/error UX
10. A26 future schedule/content divergence

## Notes for next audit pass

If a working browser environment is available next time, re-check:

- real mobile layouts at:
  - 390x844
  - 375x667
  - 768x1024
  - 1280x800
  - 1440x900
- focus order
- tap target overlap
- popup clipping
- keyboard navigation
- comment pagination behavior
- auth redirect behavior with crafted `returnTo`
