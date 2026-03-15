# Chromaverse Website Planning Document

> **Summary**: 크로마주 세계관 통합 웹 플랫폼 — 세계관 백과사전 + 소설 연재
>
> **Project**: Chromaverse
> **Version**: 0.1.0
> **Author**: Claude + User
> **Date**: 2026-03-15
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 크로마주/크로마버스 세계관의 방대한 콘텐츠(세계관설정집, 소설 700화)가 분산되어 있어 독자가 통합적으로 경험할 수 없음 |
| **Solution** | Next.js 기반 통합 웹 플랫폼으로 세계관 탐색과 소설 연재를 원스톱으로 제공 |
| **Function/UX Effect** | RGB/CMYK 색채 기반 인터랙티브 UI로 세계관을 시각적으로 체험. 소설↔세계관 양방향 링크로 몰입 극대화 |
| **Core Value** | "알고 → 읽는" 크로마버스 통합 경험. 독자를 세계관에 몰입시켜 팬덤 구축 |

---

## 1. Overview

### 1.1 Purpose

크로마주 세계관의 모든 콘텐츠를 하나의 웹사이트에서 제공하는 통합 플랫폼 구축.

- 세계관 정보를 인터랙티브하게 탐색할 수 있는 백과사전
- 크로마버스 소설을 쾌적하게 읽을 수 있는 연재 플랫폼

### 1.2 Background

- 세계관설정집 v2.3.3: 11장 + 부록, 1,000줄 이상의 상세 설정
- 소설설계서 v2.3: 700화/35권 체제, 7대막 구조
- 소설 원고: 1~10화 집필 완료
- 현재 이 콘텐츠를 통합 제공하는 플랫폼이 없음

### 1.3 Related Documents

- `project-assets/01_크로마주_세계관설정집_v2_3_3.md`

- `project-assets/03_크로마버스_소설설계서_v2_3.md`
- `project-assets/크로마버스_대막1_화별플롯_1-80화.md`
- `project-assets/크로마버스_1권_상세플롯_1-20화.md`
- `project-assets/크로마버스_*화_*.docx` (소설 원고 1~10화)

---

## 2. Scope

### 2.1 In Scope (Phase 1~3 MVP) — ✅ 완료

- [x] Phase 1: 프로젝트 셋업 + 디자인 시스템 + 랜딩 페이지
- [x] Phase 2: 세계관 백과사전 (창세, 종족, 힘의 체계, 사회/코드 체계, 종교, 지리, 역사, 경제, 성장 체계, 크로마스톰, 특수 존재, 용어)
- [x] Phase 3: 소설 연재 플랫폼 (리더 UI, 1~10화, 목차, 캐릭터 프로필 13인)

### 2.2 In Scope (Phase 4 확장) — ✅ 완료

- [x] Phase 4-A: Supabase Auth (이메일+비밀번호 회원가입/로그인, 이메일 인증 OFF)
- [x] Phase 4-B: 이어읽기 (읽기 진행률 저장, 이어읽기 버튼, 읽은 화 체크마크)
- [x] Phase 4-C: 세계관 잠금해제 (사용자별 동적 스포일러 가드, 잠금해제 프로그레스)
- [x] Phase 4-D: 댓글 시스템 (화별 댓글, RLS 보안, 페이지네이션)

### 2.3 Out of Scope

- 게임 개발 및 통합 (추후 별도 진행)
- 결제/구독 시스템
- 모바일 네이티브 앱 (반응형 웹으로 대응)
- 다국어 지원 (한국어 단일 언어)
- 커뮤니티/포럼 기능

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Phase |
|----|-------------|----------|-------|
| FR-01 | 랜딩 페이지: 세계관 티저 비주얼, 주요 섹션 진입점 | High | 1 |
| FR-02 | 디자인 시스템: RGB/CMYK 색채 토큰, 타이포, 공통 컴포넌트 | High | 1 |
| FR-03 | 세계관 - 창세 신화: 프리즈마폴 스토리 페이지 | High | 2 |
| FR-04 | 세계관 - 종족: 렌/묵렌/이로쥬/보쿠쥬 정보 카드 | High | 2 |
| FR-05 | 세계관 - 힘의 체계: RGB/CMYK 채널별 능력 설명, 상쇄 관계 | High | 2 |
| FR-06 | 세계관 - 사회: 계층 구조, 코드 시스템 설명 | Medium | 2 |
| FR-07 | 세계관 - 종교: 삼파(광명회/심묵교/균형파) 비교 | Medium | 2 |
| FR-08 | 세계관 - 지리: 인터랙티브 세계 지도 (9개 지역) | High | 2 |
| FR-09 | 세계관 - 역사: 타임라인 (프리즈마력 0~1500년) | Medium | 2 |
| FR-10 | 세계관 - 용어 사전: 검색 가능한 용어집 | Medium | 2 |
| FR-11 | 세계관 - 경제: 레스 체계, 크로마튜너 설명 | Medium | 2 |
| FR-12 | 세계관 - 성장 체계: 사이도/스플릿/크로마시프트/탈색/반전/산포 | Medium | 2 |
| FR-13 | 세계관 - 크로마스톰: 발생 원리, 지역별 차등, 발생 주기 | Medium | 2 |
| FR-14 | 세계관 - 코드 체계: 코드/그랜드 코드/컨덕터/디소넌스 전용 설명 | Medium | 2 |
| FR-15 | 세계관 - 특수 존재: 잠재 현현(경계 현현/잔향 현현), 반전, 렌-묵렌 관계 | Medium | 2 |
| FR-16 | 크로마 시뮬레이터: R/G/B 슬라이더로 계층/능력/혼합 능력 체험 | Low | 2 |
| FR-17 | 소설 - 7대막 개요: 전체 서사 구조 소개 (스포일러 없는 범위) | High | 3 |
| FR-18 | 소설 목차: 대막/권/화 구조 네비게이션 | High | 3 |
| FR-19 | 소설 리더: 세로 스크롤, 다크/라이트 모드, 글자 크기 조절 | High | 3 |
| FR-20 | 소설 용어 링크: 세계관 용어 클릭 시 사전 팝업 + 스포일러 가드 | Medium | 3 |
| FR-21 | 캐릭터 프로필: 노이즈 파티 4인 + 주요 조연 9인 (스포일러 가드 적용) | Medium | 3 |
| FR-22 | 사용자 인증: Supabase Auth (이메일+비밀번호, 이메일 인증 OFF) | Medium | 4-A ✅ |
| FR-23 | 이어읽기 (읽은 화수 저장 + 마지막 위치 이어읽기) | Medium | 4-B |
| FR-24 | 세계관 잠금해제 (읽은 분량 기반 점진적 해제) | Medium | 4-C |
| FR-25-2 | 소설 댓글 시스템 | Low | 4-D |
| FR-25 | 확장 작품 로드맵: 단기 4편 + 장기 6편 소개 (about 페이지) | Low | 3 |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement |
|----------|----------|-------------|
| Performance | LCP < 2.5s, FID < 100ms, CLS < 0.1 | Lighthouse |
| SEO | 세계관/소설 페이지 검색 노출 최적화 | SSG/SSR + meta tags |
| 반응형 | 모바일/태블릿/데스크톱 대응 | 320px ~ 1920px |
| 접근성 | 색각 이상자 고려 (색채 의존 UI에 텍스트 보조) | 수동 검증 |
| 성능 | 소설 페이지 5,000자 기준 렌더링 < 500ms | Chrome DevTools |
| 보안 | Supabase RLS, XSS 방지, CSRF 보호 (Phase 4) | OWASP 체크리스트 |
| 빌드 | 전체 사이트 빌드 5분 이내 (콘텐츠 증가 대비) | Cloudflare Pages 빌드 로그 |

---

## 4. Success Criteria

### 4.1 Phase 1 MVP (랜딩 + 디자인 시스템) ✅

- [x] 랜딩 페이지 완성 (비주얼 + 네비게이션)
- [x] 디자인 시스템 토큰 정의 (색상, 타이포, 간격)
- [x] 공통 레이아웃/네비게이션 컴포넌트
- [x] Cloudflare Pages 배포 완료

### 4.2 Phase 2 MVP (세계관) ✅

- [x] 세계관 13개 섹션 페이지 완성
- [x] 인터랙티브 세계 지도 작동 (SVG 동심원 맵)
- [x] 역사 타임라인 작동
- [x] 용어 사전 검색 작동
- [x] 크로마 시뮬레이터 작동 (RGB 슬라이더)

### 4.3 Phase 3 MVP (소설) ✅

- [x] 소설 리더 UI 완성 (다크/라이트/세피아 3모드)
- [x] 1~10화 읽기 가능
- [x] 목차 네비게이션 작동
- [x] 캐릭터 프로필 13인 (주인공 4 + 조연 9)

### 4.4 Phase 4-A (인증) ✅

- [x] Supabase Auth 연동 (이메일+비밀번호)
- [x] 로그인/회원가입 페이지
- [x] AuthButton 컴포넌트 (헤더 통합)
- [x] Middleware (세션 갱신)

### 4.5 Quality Criteria

- [ ] Lighthouse Performance 90+
- [x] 모바일 반응형 정상 작동
- [x] 빌드 에러 없음
- [x] TypeScript strict mode 통과

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 세계관 콘텐츠 양이 방대하여 Phase 2가 장기화 | Medium | High | 핵심 페이지(창세/종족/지리) 우선 구현, 나머지는 점진적 추가 |
| 인터랙티브 지도/시뮬레이터 구현 복잡도 | Medium | Medium | 초기에는 정적 이미지+호버 효과로 시작, 점진적 개선 |
| .docx 소설 원고 파싱 | Low | Low | mammoth.js로 변환 후 MDX/JSON으로 관리 |
| Supabase 무료 티어 한계 (Phase 4) | Low | Low | 초기 트래픽에서는 충분, 성장 시 유료 전환 |
| 소설↔세계관 양방향 링크 시 스포일러 노출 | High | High | 스포일러 가드 시스템 구현 — 연재 진행률에 따라 세계관 페이지 노출 범위 제어. "이 내용은 소설 X화 이후에 공개됩니다" 처리 |
| MDX 빌드 성능 (세계관 + 소설 700화 분량) | High | Medium | 초기에는 집필 완료분만 포함. ISR(Incremental Static Regeneration)로 점진적 빌드 |
| 세계관 데이터 구조 변경 시 전체 페이지 영향 | Medium | High | JSON 스키마 버전 관리. 세계관설정집 버전과 데이터 버전 매핑 |
| 인터랙티브 맵 접근성 (키보드/스크린리더) | Medium | High | 정적 대안 텍스트 + 지역 목록 제공 |
| Cloudflare Pages 빌드 제한 | Low | Low | SSG 위주로 빌드 시간 최소화. CLI 직접 배포로 제한 회피 가능 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS | ☑ |
| **Enterprise** | Strict layer separation, microservices | High-traffic systems | ☐ |

**선택 근거**: 소설 연재/사용자 인증/댓글 등 백엔드 기능이 필요하나, 대규모 트래픽은 아직 예상하지 않음. Supabase BaaS로 백엔드 처리.

### 6.1.1 프로젝트 독립성

이 웹사이트는 **독립 프로젝트**로 구성한다. 현재 디렉토리(`chromageprelude/`)를 루트로 사용하며, 독립적인 개발/배포 파이프라인을 운영한다.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / Astro / Remix | **Next.js 15 (App Router)** | SSG+SSR 혼합, 확장 유연성, 생태계 |
| Styling | Tailwind / CSS Modules / styled-components | **Tailwind CSS + shadcn/ui** | 다크 테마/색채 커스텀 용이, 빠른 개발 |
| Animation | Framer Motion / GSAP / CSS | **Framer Motion** | React 네이티브 통합, 색채 파티클 효과 |
| State | Context / Zustand / Jotai | **Zustand** | 경량, 소설 읽기 상태/테마 관리에 적합 |
| DB/Auth | Supabase / Firebase | **Supabase** | 이미 MCP 연결됨, PostgreSQL 기반 |
| CMS/Content | MDX / Contentlayer / Supabase | **MDX + static** | 세계관은 정적, 소설은 MDX/JSON 관리 |
| Deploy | Vercel / CF Pages / Netlify | **Cloudflare Pages** | 빠른 글로벌 CDN, 무료 티어 충분 |
| Package Manager | npm / pnpm | **npm** | 단순 프로젝트, 추가 도구 불필요 |

### 6.3 Folder Structure

```
Selected Level: Dynamic

src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (네비게이션, 푸터)
│   ├── page.tsx              # 랜딩 페이지
│   ├── world/                # 세계관 백과사전
│   │   ├── page.tsx          # 세계관 허브
│   │   ├── creation/         # 창세 신화
│   │   ├── races/            # 종족
│   │   ├── power/            # 힘의 체계
│   │   ├── society/          # 사회
│   │   ├── religion/         # 종교
│   │   ├── geography/        # 지리 (인터랙티브 맵)
│   │   ├── history/          # 역사 타임라인
│   │   └── glossary/         # 용어 사전
│   ├── novel/                # 소설 연재
│   │   ├── page.tsx          # 소설 목차
│   │   ├── [chapter]/        # 각 화 리더
│   │   └── characters/       # 캐릭터 프로필
│   └── about/                # 프로젝트 소개 (확장 작품 로드맵 포함)
├── components/               # 공유 컴포넌트
│   ├── ui/                   # shadcn/ui 기반
│   ├── layout/               # Header, Footer, Navigation
│   ├── world/                # 세계관 전용 (Map, Timeline, Simulator)
│   └── novel/                # 소설 전용 (Reader, TOC, GlossaryPopup)
├── content/                  # 정적 콘텐츠
│   ├── world/                # 세계관 데이터 (JSON/MDX)
│   ├── novel/                # 소설 원고 (MDX)
│   └── characters/           # 캐릭터 데이터 (JSON)
├── lib/                      # 유틸리티
│   ├── supabase.ts           # Supabase 클라이언트 (Phase 4)
│   └── utils.ts              # 공통 유틸
├── stores/                   # Zustand stores
│   ├── theme.ts              # 테마/다크모드
│   └── reader.ts             # 소설 리더 상태
├── styles/                   # 글로벌 스타일
│   └── globals.css           # Tailwind + 커스텀 CSS 변수
└── types/                    # TypeScript 타입
    ├── world.ts              # 세계관 관련 타입
    └── novel.ts              # 소설 관련 타입
```

### 6.4 디자인 시스템 — 색채 토큰 (세계관 기반)

```
Core Colors (RGB 체계):
  --color-ador:       #E63946   (R, 아도르, 열/물리)
  --color-vitalis:    #2D6A4F   (G, 비탈리스, 생명)
  --color-cognis:     #457B9D   (B, 코그니스, 인지)

Dark Colors (CMYK 체계):
  --color-suppress:   #1D3557   (C, 서프레스, 억제)
  --color-erode:      #6B2737   (M, 이로드, 침식)
  --color-distort:    #B5838D   (Y, 디스토트, 왜곡)
  --color-void:       #0B0B0B   (K, 보이드, 허공)

Neutral:
  --color-hakuten:    #F1FAEE   (하쿠텐, 백색 배경)
  --color-deep:       #0D1117   (다크 모드 배경)

Regional (지역별 액센트):
  --color-enji:       #FF6B35   (엔지, 화산/사막)
  --color-seiji:      #43AA8B   (세이지, 삼림/습지)
  --color-meichi:     #577590   (메이치, 고산/수정)
  --color-koji:       #F4A261   (코지, 황금 초원)
  --color-shiji:      #9B5DE5   (시지, 보라빛 안개)
  --color-aochi:      #00B4D8   (아오치, 발광 해안)
  --color-border:     #6C757D   (보더, 전이 지대)
```

---

## 7. Convention Prerequisites

### 7.1 Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| 컴포넌트 | PascalCase | `WorldMap.tsx`, `NovelReader.tsx` |
| 파일/폴더 | kebab-case | `world-map/`, `novel-reader/` |
| 함수/변수 | camelCase | `getChapterData()`, `currentChapter` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CHAPTERS`, `COLOR_ADOR` |
| 타입 | PascalCase | `WorldRegion`, `NovelChapter` |
| CSS 변수 | kebab-case with prefix | `--color-ador`, `--font-heading` |

### 7.2 세계관 용어 일관성

- 세계관설정집 부록 A의 확정 용어만 사용
- 부록 B의 사용 금지 용어 절대 미사용
- 코드 내 주석/변수명에도 확정 표기 적용

### 7.3 Environment Variables

| Variable | Purpose | Scope | Phase |
|----------|---------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | Client | 1 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Client | 4-A ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | Client | 4-A ✅ |

---

## 8. Implementation Phases

### Phase 1: 기초 셋업 + 랜딩 (1주차)

1. Next.js 15 프로젝트 초기화
2. Tailwind CSS + shadcn/ui 설정
3. 색채 토큰 정의 (globals.css)
4. 공통 레이아웃 (Header, Footer, Navigation)
5. 랜딩 페이지 (디자인 안 2~3개 → 사용자 선택)
6. Cloudflare Pages 배포

### Phase 2: 세계관 백과사전 (2~4주차)

**2-A 핵심 (2~3주차):**
1. 세계관 데이터 구조화 (JSON/MDX)
2. 창세 신화 페이지 (프리즈마폴)
3. 종족 페이지 (렌/묵렌/이로쥬/보쿠쥬, 특수 존재 포함)
4. 힘의 체계 페이지 (RGB/CMYK, 채널별 수치 구간, 혼합 능력, 상쇄 관계)
5. 인터랙티브 세계 지도 (9개 지역)
6. 역사 타임라인 (프리즈마력 0~1500년)
7. 용어 사전

**2-B 확장 (4주차):**
8. 사회/코드 체계 페이지 (계층, 코드/그랜드 코드/컨덕터/디소넌스)
9. 종교 페이지 (광명회/심묵교/균형파)
10. 경제 페이지 (레스 체계)
11. 성장 체계 페이지 (사이도/스플릿/크로마시프트/탈색/반전/산포)
12. 크로마스톰 페이지
13. 크로마 시뮬레이터 (선택)

### Phase 3: 소설 연재 (5~6주차)

1. 소설 원고 변환 (docx → MDX)
2. 7대막 서사 구조 개요 페이지 (스포일러 없는 범위)
3. 소설 리더 UI (세로 스크롤, 다크/라이트, 글자 크기)
4. 목차/네비게이션 (대막/권/화)
5. 용어 하이라이트 + 사전 팝업 + 스포일러 가드
6. 캐릭터 프로필 페이지 (4인 + 조연 9인, 스포일러 가드)
7. 확장 작품 로드맵 (about 페이지)

### Phase 4-A: 인증 (완료) ✅

1. Supabase Auth 연동 (이메일+비밀번호, 이메일 인증 OFF)
2. 로그인/회원가입 UI 페이지
3. AuthButton 컴포넌트 + 헤더 통합
4. Middleware (세션 갱신)
5. Server Actions (signIn, signUp, signOut)

### Phase 4-B~D: 이어읽기/잠금해제/댓글 (미구현)

1. 이어읽기 (읽은 화수 DB 저장 + 마지막 위치에서 이어읽기)
2. 세계관 잠금해제 (읽은 분량에 따라 세계관 페이지 점진적 해제)
3. 댓글 시스템

---

## 9. Next Steps

1. [x] Plan 문서 확정
2. [x] Design 문서 작성 (`chromaverse-website.design.md`)
3. [x] Phase 1~3 구현 완료 (97% 매치율)
4. [x] Phase 4-A 인증 구현 완료 (Supabase Auth)
5. [x] Phase 4-B: 이어읽기 기능
6. [x] Phase 4-C: 세계관 잠금해제 기능
7. [x] Phase 4-D: 댓글 시스템
8. [ ] 소설 11화~ 연재 지속

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-15 | Initial draft | Claude + User |
| 0.2 | 2026-03-15 | 검증 반영: 누락 FR 5건 추가, 스포일러 가드 전략, 리스크 6건 추가, 게임 관련 내용 제거, Phase 타임라인 보정 | Claude + User |
| 0.3 | 2026-03-15 | 최신화: 배포 Cloudflare Pages로 변경, Phase 4-A 인증 구현 반영, Phase 4 세분화(B~D), 캐릭터 13인 반영, 매치율 97%, 성공 기준 체크 반영 | Claude + User |
