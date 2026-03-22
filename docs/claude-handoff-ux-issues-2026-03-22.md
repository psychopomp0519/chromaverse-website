# Chromaverse Website UX/Functional Issue Handoff

Date checked: 2026-03-22 UTC  
Target site: `https://chromaverse-website.pages.dev`

## Scope and method

This document is a handoff report for Claude Code. The goal is not to propose code changes here, but to capture as many confirmed or highly likely user-facing issues as possible.

What was checked:

- Live deployment route responses for:
  - `/`
  - `/world`
  - `/world/creation`
  - `/world/geography`
  - `/world/history`
  - `/world/power`
  - `/world/races`
  - `/world/religion`
  - `/world/society`
  - `/world/economy`
  - `/world/growth`
  - `/world/chromastorm`
  - `/world/glossary`
  - `/world/special-beings`
  - `/novel`
  - `/novel/1`
  - `/novel/characters`
  - `/about`
  - `/auth/login`
  - `/auth/signup`
  - `/profile`
- Internal links and static assets referenced from live pages
- Source code for routing, world pages, novel pages, auth, profile, comments, menu/navigation, and reading-progress logic

Important limitation:

- A real headless browser session could not be fully launched in this environment because the system is missing required shared libraries for Chromium (`libatk-1.0.so.0` missing).  
- That means this report combines:
  - issues directly visible in live HTML/JS responses
  - issues confirmed from source code that will necessarily affect users
  - issues strongly implied by current implementation patterns

## High-level summary

The deployment is not obviously broken in a "site is down / links are 404" sense. Main routes return `200`, and a sampled set of internal assets and links also returned successfully.

The bigger problems are in these categories:

- wrong or inconsistent state shown to the user
- navigation discoverability problems
- auth/profile path problems
- reading/progress/comment flows that can silently fail or confuse users
- accessibility and interaction-model gaps
- heavy dependence on client-only hydration/animation causing empty or misleading initial UI

## Verification notes

Confirmed from live deployment:

- `https://chromaverse-website.pages.dev` returned `HTTP/2 200`
- sampled internal links/assets checked from deployment HTML: 52 items, no `4xx` in the sampled set
- route pages above returned `200`

Important date-sensitive context:

- Current environment date at time of review: 2026-03-22 UTC
- Release schedule file says:
  - chapter 1 to 5 released on 2026-03-01 00:00 +09:00
  - chapter 6 releases on 2026-04-01 00:00 +09:00
  - chapter 7 releases on 2026-04-04 00:00 +09:00
  - chapter 8 releases on 2026-04-07 00:00 +09:00
  - chapter 9 releases on 2026-04-10 00:00 +09:00
  - chapter 10 releases on 2026-04-14 00:00 +09:00

As of 2026-03-22 UTC, users should effectively see chapters 1 through 5 as released.

## Issue list

The list below is intentionally detailed and includes small issues.

---

## 1. Profile page progress math is incorrect

Severity: high

User impact:

- Users can see incorrect reading progress percentage
- Users can see incorrect total chapter count
- Users can see incorrect "completed chapters" display
- Users may lose trust in the profile/progress system immediately

Details:

- `src/app/profile/page.tsx` hardcodes:
  - `const totalChapters = 1;`
- This is inconsistent with the release schedule, which indicates chapters 1 to 5 are already released as of the review date.
- Because of this:
  - `progressPercent` becomes wrong
  - `completed.length / totalChapters` can exceed reality
  - the displayed completion grid only renders `1` slot even though more chapters are publicly available

Source:

- `/workspaces/chromaverse-website/src/app/profile/page.tsx`
- `/workspaces/chromaverse-website/src/content/novel/release-schedule.json`

---

## 2. Logged-in users have no clear path to their profile

Severity: high

User impact:

- Users may not discover the profile page at all
- Users may not know their reading history, unlocks, or profile features even exist
- Users may feel the account system is incomplete

Details:

- The site header shows only auth and theme controls
- When logged in, the auth area becomes only a `로그아웃` button
- There is no visible `프로필`, `내 정보`, `마이페이지`, or avatar-style entry point in the main header
- The radial menu also does not include profile access

Source:

- `/workspaces/chromaverse-website/src/components/layout/CinemaHeader.tsx`
- `/workspaces/chromaverse-website/src/components/auth/AuthButton.tsx`
- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`

---

## 3. Profile page first-load experience is poor for logged-out users

Severity: medium

User impact:

- Direct visitors to `/profile` first see a loading state instead of a clear auth requirement
- This feels slow and uncertain

Details:

- Profile auth status is checked only in a client-side effect
- Until that completes, the page renders `로딩 중...`
- For unauthenticated users, this creates an unnecessary intermediate state instead of immediately showing the login requirement

Source:

- `/workspaces/chromaverse-website/src/app/profile/page.tsx`

---

## 4. Released chapter pages still show a temporary loading gate

Severity: medium

User impact:

- Opening a released chapter can briefly show `로딩 중...`
- Reading flow feels less direct and less polished
- Perceived performance is worse than necessary

Details:

- `ChapterGate` computes release access in `useEffect`
- Initial render has `allowed === null`
- Until the effect runs, the user sees a loading state even for already released content

Source:

- `/workspaces/chromaverse-website/src/components/novel/ChapterGate.tsx`

---

## 5. Unlock rules are inconsistent between logged-out and logged-in states

Severity: high

User impact:

- The unlock system can feel unfair or broken
- A logged-out user can apparently access everything
- A logged-in user can see content become restricted
- This feels backwards and undermines motivation to create an account

Details:

- In `ConstellationMap`, if the user is not logged in, all nodes are treated as unlocked
- If the user is logged in, unlocks depend on completed chapter state
- This means logging in can reduce visible access

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 6. Current release schedule and unlock design are misaligned

Severity: high

User impact:

- Logged-in readers may be blocked from unlocks that are impossible to reach yet
- Logged-out users may see more than logged-in users
- Users can become confused about the purpose of progression

Details:

- Current unlock thresholds:
  - base: `creation`, `races`, `glossary`
  - 1 chapter: `power`, `society`
  - 3 chapters: `religion`, `geography`
  - 5 chapters: `chromastorm`, `economy`
  - 7 chapters: `growth`, `history`
  - 10 chapters: `special-beings`
- But as of review time only chapters 1 to 5 are released
- Therefore:
  - `growth`
  - `history`
  - `special-beings`
  are not yet realistically unlockable for a legitimate logged-in user
- However, logged-out users can see everything on the hub

Source:

- `/workspaces/chromaverse-website/src/lib/content-unlock.ts`
- `/workspaces/chromaverse-website/src/content/novel/release-schedule.json`
- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 7. Home hero subtitle appears empty on first paint

Severity: medium

User impact:

- The top of the homepage can feel unfinished or blank
- First impression is weaker

Details:

- Hero subtitle starts empty
- Typing begins only after a 1.5 second delay
- Live HTML shows the subtitle area as empty at initial render

Source:

- `/workspaces/chromaverse-website/src/components/landing/HeroScene.tsx`

---

## 8. Home novel quote section initially appears mostly empty

Severity: medium

User impact:

- Users can interpret the section as missing content
- On slower devices or quick scrolling, the quote can feel like it never properly appears

Details:

- The quote text is only typed after the section enters the viewport
- Initial live HTML shows mostly empty quote content
- This creates another "empty shell before hydration/animation" moment

Source:

- `/workspaces/chromaverse-website/src/components/landing/NovelScene.tsx`

---

## 9. Home statistics render as zero on first paint

Severity: medium

User impact:

- The site appears to have no content or no world scale at first glance
- This hurts trust and marketing clarity

Details:

- Counters animate from `0` only after entering view
- Initial HTML showed:
  - `0 화의 대서사`
  - `0 개 지역`
  - `0 개 종족`
  - `0 대막`
- This is misleading before hydration

Source:

- `/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx`

---

## 10. Header auth area can look empty on first load

Severity: low to medium

User impact:

- Users can momentarily think login controls are missing

Details:

- `AuthButton` returns `null` while loading current user state
- Live HTML showed a blank placeholder area in the header

Source:

- `/workspaces/chromaverse-website/src/components/auth/AuthButton.tsx`

---

## 11. Main navigation relies too much on a hidden floating menu

Severity: medium

User impact:

- First-time visitors may not notice the main site navigation
- Important destinations are hidden behind a plus-shaped floating button

Details:

- The radial menu is the primary extra navigation surface
- It contains only:
  - world
  - novel
  - about
- It does not include:
  - profile
  - auth context
  - help
  - current progress

Source:

- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`

---

## 12. World interactive map is mouse-centric and weak for keyboard users

Severity: high for accessibility

User impact:

- Keyboard-only users may not be able to use the map meaningfully
- Screen reader users may get poor or no usable semantics

Details:

- Map regions are SVG `path`/`circle` elements with mouse handlers only
- No keyboard focus support
- No Enter/Space activation logic
- No semantic button/link structure
- No clear per-region accessible labeling visible in code

Source:

- `/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx`

---

## 13. World constellation map has the same accessibility weakness

Severity: high for accessibility

User impact:

- Desktop map appears interactive but is not robustly keyboard-usable

Details:

- Node interaction is hover/click driven
- Text labels are pointer-events none
- The main desktop experience is visual and hover-based

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 14. Unlock explanation is hard to understand from the UI

Severity: medium

User impact:

- Users may not understand why things are locked
- Users may not understand what login changes
- Progression motivation becomes fuzzy

Details:

- On the hub, lock labels are shown, but the overall rule system is not clearly explained
- Since logged-out state shows everything, the meaning of unlocking is further diluted

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`
- `/workspaces/chromaverse-website/src/lib/content-unlock.ts`

---

## 15. Comment loading errors can appear to users as “there are no comments”

Severity: high

User impact:

- Users can be misled into thinking a chapter has no comments when the actual issue is a backend/auth/query failure
- This hides operational failures

Details:

- `getComments` ignores query errors
- It returns empty comments if `data` is absent
- The component then renders “아직 댓글이 없습니다”
- This is silent failure masquerading as a normal empty state

Source:

- `/workspaces/chromaverse-website/src/lib/comments.ts`
- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 16. Comment count displays loaded count, not total count

Severity: low to medium

User impact:

- Users can misunderstand how many comments exist

Details:

- Header shows `댓글 (${comments.length})`
- With pagination, this is only the currently loaded list length, not total system count

Source:

- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 17. Logged-out comment CTA uses plain anchor instead of app navigation

Severity: low

User impact:

- Clicking login from comments likely causes a full page navigation rather than smooth app routing
- Feels less polished

Details:

- Logged-out message uses `<a href="/auth/login">`
- Not using Next `Link`

Source:

- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 18. Login and signup always redirect users to the homepage

Severity: high

User impact:

- Users lose context after authentication
- This is especially frustrating when auth was triggered from:
  - a chapter
  - a comment action
  - profile access
  - a deep-linked page

Details:

- Both login and signup pages call:
  - `router.push("/")`
- No return URL or context restoration

Source:

- `/workspaces/chromaverse-website/src/app/auth/login/page.tsx`
- `/workspaces/chromaverse-website/src/app/auth/signup/page.tsx`

---

## 19. Auth and profile pages appear to use generic page titles in deployment

Severity: low to medium

User impact:

- Browser tabs are less distinguishable
- Bookmarks/history entries are less useful

Details:

- In live route checks, `/auth/login`, `/auth/signup`, and `/profile` returned the generic site title rather than dedicated page titles
- This suggests missing route metadata for these pages

Observed live titles:

- `/auth/login` -> `크로마버스 — 빛과 어둠의 세계`
- `/auth/signup` -> `크로마버스 — 빛과 어둠의 세계`
- `/profile` -> `크로마버스 — 빛과 어둠의 세계`

---

## 20. Release countdown depends on client clock

Severity: low to medium

User impact:

- If a user's device clock is wrong, release countdowns can be inaccurate
- Time-sensitive users may see misleading unlock/release timing

Details:

- Countdown logic relies on `new Date()` in the browser
- No server-verified time source is used

Source:

- `/workspaces/chromaverse-website/src/components/novel/NextReleaseCard.tsx`
- `/workspaces/chromaverse-website/src/components/novel/ChapterGate.tsx`

---

## 21. The home page is highly hydration/animation dependent

Severity: medium

User impact:

- On slow devices or slow hydration, the site can feel empty, delayed, or unstable

Details:

- Multiple hero sections rely on delayed client-side animation for core meaning:
  - subtitle typing
  - quote typing
  - stat counters
  - fade-in callouts
- This increases the risk that the site looks incomplete before client code takes over

Source:

- `/workspaces/chromaverse-website/src/components/landing/HeroScene.tsx`
- `/workspaces/chromaverse-website/src/components/landing/NovelScene.tsx`
- `/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx`

---

## 22. The site is more “technically reachable” than “operationally trustworthy”

Severity: summary issue

User impact:

- Users may not hit obvious 404s, but they can still feel the site is inconsistent or unfinished

Details:

- Links work
- Routes load
- But state, auth visibility, progression logic, and loading semantics are often unclear or inconsistent

---

## 23. World interactive map selection model is not obvious

Severity: low to medium

User impact:

- Users may not understand how to dismiss a selected region detail

Details:

- Region detail opens by clicking a region
- The toggling logic closes only by selecting the same region again or using detail close UI if present
- There is no visible evidence in the map component of outside-click-to-close behavior
- The interaction may feel sticky or confusing

Source:

- `/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx`

---

## 24. World map label contrast may be inconsistent across colored regions

Severity: low to medium

User impact:

- Some labels may be hard to read depending on region color/background

Details:

- Labels are hardcoded black or white with text shadow
- Since region colors vary, this can produce inconsistent contrast quality

Source:

- `/workspaces/chromaverse-website/src/components/world/InteractiveMap.tsx`

---

## 25. SVG link/hit-area behavior in constellation map may be fragile

Severity: medium

User impact:

- Click targets can feel inconsistent or smaller than expected

Details:

- Desktop world nodes are built as `Link` wrapping SVG group content
- This pattern can be less predictable than standard semantic buttons/links in some interaction/accessibility scenarios

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 26. Mobile world hub loses structural relationship information

Severity: low to medium

User impact:

- Mobile users get a flatter, less explanatory experience than desktop users
- Understanding the relationship among world nodes is harder

Details:

- Desktop uses a connected constellation map
- Mobile falls back to a plain list of entries
- The conceptual structure of the world network is reduced

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 27. Floating radial menu can physically compete with lower-page controls on mobile

Severity: medium

User impact:

- Buttons near the bottom center or bottom right may feel crowded or harder to tap

Details:

- Radial menu is fixed near the bottom
- On pages with CTAs, reading settings, comments, or navigation buttons, this can interfere with thumb-space and visual clarity

Source:

- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`
- `/workspaces/chromaverse-website/src/app/novel/[chapter]/ReaderContent.tsx`

---

## 28. Floating menu meaning is ambiguous for first-time users

Severity: low to medium

User impact:

- Users may not know whether the plus button is:
  - main nav
  - settings
  - add action
  - quick actions

Details:

- The open-state overlay and radial animation are visually distinctive
- But the control meaning itself is not immediately obvious from the button icon alone

Source:

- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`

---

## 29. Unused mobile radius constant suggests incomplete mobile tuning

Severity: low

User impact:

- Not directly visible as a bug by itself, but it indicates mobile radial layout may not have been fully tuned

Details:

- `MOBILE_RADIUS` is declared but unused

Source:

- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`

---

## 30. Header auto-hide behavior may feel too aggressive

Severity: low to medium

User impact:

- Users trying to navigate back upward can lose orientation
- It can feel like the page chrome is moving too much

Details:

- Header visibility changes based on scroll direction
- This can be elegant when tuned well, but currently may be too eager for a content-heavy site

Source:

- `/workspaces/chromaverse-website/src/components/layout/CinemaHeader.tsx`

---

## 31. Reader UI auto-hide may reduce navigation discoverability

Severity: medium

User impact:

- Users may not easily notice chapter navigation or controls once they start scrolling

Details:

- Reader UI visibility decreases based on scroll behavior
- Good for immersion, but can hide practical actions from unfamiliar users

Source:

- `/workspaces/chromaverse-website/src/app/novel/[chapter]/ReaderContent.tsx`

---

## 32. Reader settings button and global floating menu may compete visually/spatially

Severity: medium

User impact:

- Two floating controls in similar regions can cause confusion and clutter

Details:

- Reader settings button is fixed at the lower right area
- Global radial menu also lives in a lower floating position
- On reading pages this can create overlapping control zones or cognitive competition

Source:

- `/workspaces/chromaverse-website/src/app/novel/[chapter]/ReaderContent.tsx`
- `/workspaces/chromaverse-website/src/components/core/RadialMenu.tsx`

---

## 33. Chapter completion based on 95 percent scroll can be unintuitive

Severity: medium

User impact:

- Users may feel a chapter should count as completed but it does not
- Or a chapter may become completed after browsing comments/extra content rather than intentional reading

Details:

- Completion trigger is tied to scroll percentage
- This is a proxy, not actual reader intent
- Document height can vary due to comments and dynamic content

Source:

- `/workspaces/chromaverse-website/src/app/novel/[chapter]/ReaderContent.tsx`

---

## 34. Reader progress and completion may be influenced by comments section length

Severity: medium

User impact:

- Scroll-based completion/progress becomes inconsistent between chapters
- Heavier discussion can alter completion threshold behavior

Details:

- Comments live below the chapter content in the same page flow
- Total page scroll height includes more than just story content

Source:

- `/workspaces/chromaverse-website/src/app/novel/[chapter]/ReaderContent.tsx`

---

## 35. Reading progress storage operations fail silently

Severity: high

User impact:

- Continue reading can be wrong
- Progress can appear not to save
- Completed chapters can feel unreliable
- Users receive no helpful explanation

Details:

- Many reading-related Supabase operations do not surface errors to the user
- If backend writes fail, the UI can drift from reality without clear error reporting

Source:

- `/workspaces/chromaverse-website/src/lib/reading.ts`

---

## 36. Comment create/delete operations can also fail in under-explained ways

Severity: medium

User impact:

- Users can get raw backend errors
- Or data may simply not refresh as expected

Details:

- Some error strings are passed through directly
- There is no richer recovery guidance or consistent UX around failure states

Source:

- `/workspaces/chromaverse-website/src/lib/comments.ts`
- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 37. Auth-dependent features are tightly coupled to client-side Supabase init

Severity: medium to high operationally

User impact:

- If Supabase env configuration is missing or wrong, many user-facing features can degrade at once:
  - login
  - signup
  - profile
  - progress
  - comments
  - continue reading

Details:

- `createClient()` uses non-null assertions for public env values
- There is no graceful fallback path in the client helper itself

Source:

- `/workspaces/chromaverse-website/src/lib/supabase/client.ts`

---

## 38. Live deployment auth bundle contains Supabase project URL

Severity: informational

User impact:

- Not a secret leak by itself, but worth noting for operational awareness

Details:

- Live login bundle contains the public Supabase URL
- This is expected for a browser client in many setups, but it confirms auth is client-visible and client-initialized

Observed in deployment bundle:

- `https://ubsbbvokpffkwoajzkcs.supabase.co`

---

## 39. About page lacks strong onward navigation

Severity: low to medium

User impact:

- Users can read the page and then stall
- There is little momentum to continue deeper into the product

Details:

- The page introduces the project and roadmap
- But does not clearly route the user onward to:
  - start reading
  - explore world pages
  - view current release

Source:

- `/workspaces/chromaverse-website/src/app/about/page.tsx`

---

## 40. World tab bar is long and mobile-scrolly

Severity: low to medium

User impact:

- Mobile users may lose awareness of where they are relative to all world sections
- Navigation can feel crowded

Details:

- World nav contains 12 items
- All items are placed in a horizontally scrollable sticky tab row
- This is workable, but not especially easy to scan

Source:

- `/workspaces/chromaverse-website/src/app/world/layout.tsx`

---

## 41. Auth pages provide minimal recovery/help UX

Severity: medium

User impact:

- Users who fail login or need support get little assistance

Details:

- No password reset path visible
- No email verification explanation visible
- No success-state next-step guidance visible
- No remembered return destination

Source:

- `/workspaces/chromaverse-website/src/app/auth/login/page.tsx`
- `/workspaces/chromaverse-website/src/app/auth/signup/page.tsx`

---

## 42. Marketing promise vs currently accessible content may feel mismatched

Severity: medium

User impact:

- Users may feel the site over-promises relative to what they can actually read now

Details:

- Messaging strongly emphasizes:
  - `700화의 대서사`
  - large world scale
- But currently released/readable content is limited
- This is not inherently wrong, but it can create expectation disappointment if not framed carefully

Source:

- `/workspaces/chromaverse-website/src/content/novel/meta.json`
- `/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx`

---

## 43. Chapter files exist beyond currently released content, which can create edge-case confusion

Severity: low

User impact:

- Users guessing URL patterns may reach content-gate states that feel odd

Details:

- There are currently 6 chapter JSON files in the repo
- But only chapters 1 to 5 are released as of the review date
- This means:
  - content exists in the build for unreleased chapter 6
  - users can potentially infer routes and hit a locked gate

Source:

- `/workspaces/chromaverse-website/src/lib/content.ts`
- `/workspaces/chromaverse-website/src/content/novel/release-schedule.json`

---

## 44. World page live HTML includes many links, but semantic route hierarchy may still be overwhelming

Severity: low

User impact:

- The world section is rich, but can feel dense

Details:

- Live HTML for `/world` showed many accessible links
- This means functionality exists, but the amount of destination density may still produce choice overload, especially on first visit

Observed on live `/world`:

- tab links for all world subsections
- constellation node links
- mobile list links

---

## 45. Generic loading placeholders are overused

Severity: medium

User impact:

- Several flows use plain `로딩 중...` with little context
- This makes the product feel less intentional

Details:

- Observed or confirmed in:
  - profile auth loading
  - chapter gate loading
  - comments loading
- These states often lack:
  - what is being loaded
  - what the user should expect
  - whether action is needed

Source:

- `/workspaces/chromaverse-website/src/app/profile/page.tsx`
- `/workspaces/chromaverse-website/src/components/novel/ChapterGate.tsx`
- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 46. The site’s state model depends heavily on client-side fetches after render

Severity: medium

User impact:

- Initial UI can differ materially from hydrated UI
- This creates flicker, contradiction, or delayed clarity

Details:

- Auth state
- profile state
- reading progress
- comment state
- unlock state
- continue-reading state
  all depend significantly on client-side effects after render

Consequence:

- users may see blank states, generic placeholders, incorrect initial values, or sudden access changes

---

## 47. Continue reading is invisible to logged-out users even when a first-run CTA could still help

Severity: low

User impact:

- Logged-out users do not get personalized continue-reading, which is expected
- But the fallback is simply null until the component decides target state
- The transition between logged-out and logged-in states may feel inconsistent

Details:

- `ContinueReading` loads only after auth check
- If no target chapter is derived, the component returns null

Source:

- `/workspaces/chromaverse-website/src/components/novel/ContinueReading.tsx`

---

## 48. Reading progress card is completely absent for logged-out users

Severity: low

User impact:

- This is not inherently wrong, but it removes an opportunity to teach the value of having an account

Details:

- If not logged in, the reading progress component simply returns null
- No onboarding nudge or explanation is shown

Source:

- `/workspaces/chromaverse-website/src/components/novel/ReadingProgress.tsx`

---

## 49. Comments use masked email display, but data model may not guarantee that email is present

Severity: low

User impact:

- Comment identity can appear as `익명` unexpectedly
- Social trust in comments may be weaker

Details:

- UI expects optional `email`
- Query uses `select("*")`, but code does not clearly show where `email` is guaranteed from
- In UI, missing email becomes `익명`

Source:

- `/workspaces/chromaverse-website/src/lib/comments.ts`
- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 50. Comments pagination implementation is fragile

Severity: low to medium

User impact:

- Repeated load-more actions may be harder to reason about or maintain reliably

Details:

- `loadComments` uses `page` state
- Load-more button separately increments page and directly fetches with `page + 1`
- This is not necessarily broken right now, but it is easy for pagination state to drift or become subtly buggy

Source:

- `/workspaces/chromaverse-website/src/components/novel/Comments.tsx`

---

## 51. World hub progress text appears only for logged-in users

Severity: low

User impact:

- Logged-out users do not see the progression framework clearly
- They see all content, but not the logic behind it

Details:

- `unlockedCount / totalNodes` is only shown when logged in
- Combined with the “logged out shows all unlocked” rule, this weakens the learning model

Source:

- `/workspaces/chromaverse-website/src/components/world/ConstellationMap.tsx`

---

## 52. Home CTA section can show a personalized continue-reading button only after auth and progress load

Severity: low

User impact:

- Another place where initial state can visually change after hydration

Details:

- CTA scene initially cannot know `lastChapter`
- It switches between `소설 읽기` and `n화 이어 읽기` only after client auth/progress checks

Source:

- `/workspaces/chromaverse-website/src/components/landing/CTAScene.tsx`

---

## 53. World tab labels are short in some places but longer in others, which may reduce scan consistency

Severity: low

User impact:

- Slight cognitive friction when scanning tabs quickly

Details:

- Examples:
  - `허브`
  - `창세`
  - `힘의 체계`
  - `특수 존재`
  - `스톰`
- Mixed label length and abbreviation style can reduce quick orientation

Source:

- `/workspaces/chromaverse-website/src/app/world/layout.tsx`

---

## 54. Some user-facing states are too implementation-shaped rather than product-shaped

Severity: low to medium

User impact:

- The site can feel like a prototype in certain flows

Examples:

- generic `로딩 중...`
- silent null rendering
- direct backend error string display
- empty initial animated slots
- redirect to home after auth regardless of context

---

## 55. Some page sections appear to prioritize visual effect over immediate clarity

Severity: low to medium

User impact:

- The site may impress visually but still confuse first-time users

Details:

- home hero
- quote scene
- radial menu
- scroll-reactive header
- auto-hiding reader UI

This is not one bug, but a recurring product experience pattern.

## Route status appendix

The following routes returned `200` during checks:

- `/`
- `/world`
- `/world/creation`
- `/world/geography`
- `/world/history`
- `/world/power`
- `/world/races`
- `/world/religion`
- `/world/society`
- `/world/economy`
- `/world/growth`
- `/world/chromastorm`
- `/world/glossary`
- `/world/special-beings`
- `/novel`
- `/novel/1`
- `/novel/characters`
- `/about`
- `/auth/login`
- `/auth/signup`
- `/profile`

## Internal asset/link appendix

Sampled internal links and assets referenced from live deployment pages:

- checked count: 52
- `4xx` found in sampled set: 0

This means the main problems are not currently broken links, but rather UX consistency, state correctness, discoverability, and accessibility.

## Recommended use of this handoff

Claude Code should use this document as:

- a bug/UX debt inventory
- a prioritization input
- a checklist for reproduction and validation

Best next pass would be:

1. classify each issue into:
   - confirmed bug
   - UX weakness
   - accessibility issue
   - product inconsistency
2. prioritize:
   - high impact / low effort
   - high impact / medium effort
   - structural refactor candidates
3. verify with an actual browser run on an environment with working Chromium dependencies
