# Chromaverse Website Design Document

> **Summary**: 크로마주 세계관 백과사전 + 소설 연재 웹 플랫폼 상세 설계
>
> **Project**: Chromaverse
> **Version**: 0.1.0
> **Author**: Claude + User
> **Date**: 2026-03-15
> **Status**: Draft
> **Planning Doc**: [chromaverse-website.plan.md](../../01-plan/features/chromaverse-website.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 세계관설정집 v2.3.4의 11개 챕터를 인터랙티브 웹 페이지로 변환
- 소설 1~10화(docx)를 쾌적하게 읽을 수 있는 리더 UI 제공
- RGB/CMYK 색채 체계를 디자인 시스템에 직접 반영하여 세계관 몰입감 극대화
- 소설↔세계관 양방향 링크 + 스포일러 가드 시스템

### 1.2 Design Principles

- **콘텐츠 우선**: 화려한 효과보다 세계관 정보의 가독성과 탐색성 우선
- **세계관 일체감**: UI 색상/패턴/용어가 세계관과 일치 (부록 A 용어만 사용)
- **점진적 공개**: 스포일러 가드로 소설 진행에 맞춰 정보 노출
- **정적 우선**: Phase 1~3은 SSG 위주. 동적 기능은 Phase 4에서 추가

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│               Cloudflare Pages (Hosting)                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Next.js 15 (App Router)                │   │
│  │                                                    │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  │   │
│  │  │ Landing │  │ World  │  │ Novel  │  │ About  │  │   │
│  │  │  Page   │  │ Pages  │  │ Pages  │  │  Page  │  │   │
│  │  └────────┘  └───┬────┘  └───┬────┘  └────────┘  │   │
│  │                  │           │                     │   │
│  │            ┌─────┴───────────┴─────┐              │   │
│  │            │   content/ (Static)    │              │   │
│  │            │  JSON + MDX 데이터     │              │   │
│  │            └───────────────────────┘              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Phase 4: ┌──────────────┐                              │
│           │   Supabase    │  Auth ✅, 이어읽기, 잠금해제  │
│           └──────────────┘                              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
빌드 시:
  content/world/*.json ──→ SSG ──→ /world/* 정적 페이지
  content/novel/*.mdx  ──→ SSG ──→ /novel/[chapter] 정적 페이지
  content/characters/*.json ──→ SSG ──→ /novel/characters 정적 페이지

런타임 (Phase 4):
  User Action ──→ Zustand Store ──→ Supabase API ──→ DB
  (북마크/진행률)    (로컬 상태)       (서버 저장)
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| World Pages | `content/world/*.json` | 세계관 데이터 렌더링 |
| Novel Reader | `content/novel/*.mdx` | 소설 콘텐츠 렌더링 |
| GlossaryPopup | `content/world/glossary.json` | 용어 팝업 |
| SpoilerGuard | `content/world/spoiler-map.json` | 스포일러 제어 |
| InteractiveMap | `content/world/geography.json` | 지도 데이터 |
| Timeline | `content/world/history.json` | 연표 데이터 |

---

## 3. Data Model

### 3.1 세계관 데이터 (content/world/)

```typescript
// content/world/glossary.json 의 각 항목
interface GlossaryEntry {
  id: string;              // "ren", "mokuren", "code" 등
  term: string;            // "렌"
  kanji: string;           // "煉"
  category: GlossaryCategory; // "종족" | "신화" | "사회" | ...
  shortDesc: string;       // 한 줄 설명
  fullDesc: string;        // 상세 설명
  relatedTerms: string[];  // 관련 용어 id 배열
  spoilerAfter?: number;   // 이 화 이후 노출 (없으면 항상 노출)
}

type GlossaryCategory =
  | "신화" | "종족" | "신체" | "생물" | "사회"
  | "종교" | "성장" | "경제" | "지리" | "전투";

// content/world/geography.json
interface WorldRegion {
  id: string;              // "hakuten", "enji", "seiji" 등
  name: string;            // "하쿠텐"
  kanji: string;           // "白点"
  group: "center" | "primary" | "blend" | "border" | "deep";
  color: string;           // CSS 색상값
  description: string;     // 설명
  characteristics: string; // 특성
  dominantChannel?: string; // "R" | "G" | "B" | "R+G" 등
  saturationRange?: string; // "25~50%" 등
}

// content/world/history.json
interface HistoryEvent {
  id: string;
  year: number;            // 프리즈마력 연도 (0~1500)
  yearLabel: string;       // "약 780년"
  title: string;           // 사건 제목
  description: string;     // 사건 설명
  inNovel: boolean;        // 소설에서 다루는 사건 여부 (★ 표시)
  gameVisibility: string;  // 게임 내 공개도
  spoilerAfter?: number;   // 스포일러 가드
}

// content/world/power.json - 힘의 체계
interface PowerChannel {
  id: string;              // "r", "g", "b", "c", "m", "y", "k"
  system: "rgb" | "cmyk";
  name: string;            // "아도르"
  kanji: string;           // "熱"
  domain: string;          // 능력 영역
  physicalBasis: string;   // 물리적 근거
  counterpart?: string;    // 상쇄 대상 채널 id
  ranges: PowerRange[];    // 수치 구간별 능력
}

interface PowerRange {
  min: number;
  max: number;
  description: string;
}

// content/world/society.json - 사회 계층
interface SocialTier {
  id: string;
  system: "rgb" | "cmyk";
  name: string;            // "키하쿠"
  kanji: string;           // "輝白"
  totalRange: string;      // "700~765"
  socialPosition: string;
  lifespan: string;
  notes: string;
}

// content/world/spoiler-map.json - 스포일러 가드 설정
interface SpoilerMap {
  // 글로벌 공개 범위 (현재 연재 최신화)
  currentMaxChapter: number;  // 현재 10
  // 용어별 공개 시점
  terms: Record<string, number>;  // { "쿠로겐": 16, "프리즈마폴": 16 }
  // 캐릭터별 공개 시점
  characters: Record<string, number>; // { "코다": 30, "닉스": 14 }
  // 세계관 섹션별 스포일러 구간
  sections: Record<string, SpoilerSection[]>;
}

interface SpoilerSection {
  contentId: string;       // 해당 콘텐츠 블록 ID
  visibleAfter: number;    // N화 이후 노출
  placeholder: string;     // 가려질 때 대체 텍스트
}
```

### 3.2 소설 데이터 (content/novel/)

```typescript
// content/novel/meta.json - 소설 메타 정보
interface NovelMeta {
  title: string;           // "크로마버스"
  arcs: NovelArc[];        // 7대막
}

interface NovelArc {
  id: number;              // 1~7
  title: string;           // "디소넌스의 시대"
  chapters: string;        // "1~80화"
  volumes: NovelVolume[];
  keywords: string;        // "일상, 만남, 파티 결성"
  synopsis: string;        // 스포일러 없는 소개
}

interface NovelVolume {
  id: number;              // 1~35
  title: string;           // "서기관의 하루"
  chapters: [number, number]; // [1, 20]
}

// content/novel/chapters/001.mdx - 각 화 (MDX 파일)
// frontmatter:
interface ChapterFrontmatter {
  chapter: number;         // 1
  title: string;           // "빛이 흐르는 아침"
  arc: number;             // 1
  volume: number;          // 1
  wordCount: number;       // 약 5500
  glossaryTerms: string[]; // ["렌", "이로몬", "코드", "크로마스크라이브"]
}

// content/characters/*.json
interface Character {
  id: string;              // "kai", "coda", "nix", "ray"
  name: string;            // "카이"
  quote: string;           // "나는 기록관이지, 모험가가 아니다."
  race: string;            // "렌 (RGB)"
  chromaValues: {
    r: number; g: number; b: number;
    k?: number;            // 닉스만
    total: number;
  };
  dominantColor: string;   // "B 미세 우세"
  tier: string;            // "탄사이"
  iromon: string;          // 이로몬 설명
  role: string;            // 직업/역할
  personality: string;     // 성격 요약
  partyRole: string;       // 파티 내 역할
  spoilerAfter?: number;   // 이 화 이후 프로필 공개
  arcSummary: Record<number, string>; // 대막별 성장 요약
}
```

### 3.3 Entity Relationships

```
[GlossaryEntry] N ←──── N [ChapterFrontmatter.glossaryTerms]
       │
       └── spoilerAfter ──→ [SpoilerMap]

[WorldRegion] 1 ←──── N [HistoryEvent] (지역별 사건)

[Character] 1 ←──── N [NovelArc] (등장 대막)
     │
     └── spoilerAfter ──→ [SpoilerMap]

[NovelArc] 1 ──── N [NovelVolume] 1 ──── N [Chapter MDX]
```

---

## 4. Component Architecture

### 4.1 Layout Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `RootLayout` | `src/app/layout.tsx` | 공통 레이아웃, 테마 프로바이더, 폰트 |
| `Header` | `src/components/layout/Header.tsx` | 네비게이션, 로고, 테마 토글 |
| `Footer` | `src/components/layout/Footer.tsx` | 사이트 정보, 링크 |
| `Navigation` | `src/components/layout/Navigation.tsx` | 주요 섹션 링크 (World, Novel, About) |
| `MobileMenu` | `src/components/layout/MobileMenu.tsx` | 모바일 햄버거 메뉴 |

### 4.2 World Components (세계관)

| Component | Location | FR | Responsibility |
|-----------|----------|----|----------------|
| `WorldHub` | `src/app/world/page.tsx` | - | 세계관 섹션 진입 허브 |
| `CreationStory` | `src/app/world/creation/page.tsx` | FR-03 | 프리즈마폴 스토리 |
| `RaceCard` | `src/components/world/RaceCard.tsx` | FR-04 | 종족 정보 카드 |
| `PowerSystem` | `src/components/world/PowerSystem.tsx` | FR-05 | RGB/CMYK 채널 설명 |
| `PowerRangeTable` | `src/components/world/PowerRangeTable.tsx` | FR-05 | 수치 구간별 능력표 |
| `InteractiveMap` | `src/components/world/InteractiveMap.tsx` | FR-08 | SVG 기반 세계 지도 |
| `RegionDetail` | `src/components/world/RegionDetail.tsx` | FR-08 | 지역 상세 패널 |
| `Timeline` | `src/components/world/Timeline.tsx` | FR-09 | 스크롤 연표 |
| `TimelineEvent` | `src/components/world/TimelineEvent.tsx` | FR-09 | 연표 개별 사건 |
| `GlossarySearch` | `src/components/world/GlossarySearch.tsx` | FR-10 | 용어 검색/필터 |
| `GlossaryCard` | `src/components/world/GlossaryCard.tsx` | FR-10 | 용어 카드 |
| `SocialTierChart` | `src/components/world/SocialTierChart.tsx` | FR-06 | 계층 비교 차트 |
| `ReligionCompare` | `src/components/world/ReligionCompare.tsx` | FR-07 | 삼파 비교표 |
| `ChromaSimulator` | `src/components/world/ChromaSimulator.tsx` | FR-16 | R/G/B 슬라이더 시뮬레이터 |

### 4.3 Novel Components (소설)

| Component | Location | FR | Responsibility |
|-----------|----------|----|----------------|
| `NovelHub` | `src/app/novel/page.tsx` | FR-17,18 | 7대막 개요 + 목차 |
| `ArcOverview` | `src/components/novel/ArcOverview.tsx` | FR-17 | 대막별 소개 카드 |
| `ChapterList` | `src/components/novel/ChapterList.tsx` | FR-18 | 권/화 목차 |
| `NovelReader` | `src/components/novel/NovelReader.tsx` | FR-19 | 본문 리더 |
| `ReaderControls` | `src/components/novel/ReaderControls.tsx` | FR-19 | 글자 크기, 테마 조절 |
| `ChapterNav` | `src/components/novel/ChapterNav.tsx` | FR-18 | 이전/다음 화 네비게이션 |
| `GlossaryPopup` | `src/components/novel/GlossaryPopup.tsx` | FR-20 | 용어 클릭 시 팝업 |
| `SpoilerGuard` | `src/components/novel/SpoilerGuard.tsx` | FR-20,21 | 스포일러 블러/가림 |
| `CharacterCard` | `src/components/novel/CharacterCard.tsx` | FR-21 | 캐릭터 프로필 카드 |
| `ChromaDisplay` | `src/components/novel/ChromaDisplay.tsx` | FR-21 | R/G/B 수치 시각화 |

### 4.4 Shared UI Components (shadcn/ui 기반)

| Component | Purpose |
|-----------|---------|
| `Button` | 공통 버튼 |
| `Card` | 정보 카드 레이아웃 |
| `Dialog` | 모달/팝업 |
| `Tabs` | 탭 UI (힘의 체계 RGB/CMYK 전환) |
| `Tooltip` | 용어 툴팁 |
| `Badge` | 카테고리 뱃지 |
| `Input` | 검색 입력 |
| `ScrollArea` | 스크롤 영역 |
| `Separator` | 구분선 |

---

## 5. UI/UX Design

### 5.1 Page Layouts

#### Landing Page
```
┌──────────────────────────────────────────┐
│  Header (투명, 스크롤 시 불투명)          │
├──────────────────────────────────────────┤
│                                          │
│  Hero Section                            │
│  "빛이 있었고, 어둠이 있었고"             │
│  RGB 파티클 애니메이션 배경               │
│                                          │
├──────────────────────────────────────────┤
│  섹션 카드 (3열)                         │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │세계관 │  │ 소설  │  │소개  │           │
│  └──────┘  └──────┘  └──────┘           │
├──────────────────────────────────────────┤
│  Footer                                  │
└──────────────────────────────────────────┘
```

#### World Page (세계관 허브)
```
┌──────────────────────────────────────────┐
│  Header                                  │
├──────────────────────────────────────────┤
│  World Hub Title                         │
│  "크로마라 — 빛과 어둠의 세계"            │
├──────────────────────────────────────────┤
│  카테고리 그리드 (4x3 또는 반응형)        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │창세 │ │종족│ │힘  │ │사회│            │
│  ├────┤ ├────┤ ├────┤ ├────┤            │
│  │종교 │ │지리│ │역사│ │경제│            │
│  ├────┤ ├────┤ ├────┤ ├────┤            │
│  │성장 │ │스톰│ │특수│ │사전│            │
│  └────┘ └────┘ └────┘ └────┘            │
├──────────────────────────────────────────┤
│  Footer                                  │
└──────────────────────────────────────────┘
```

#### Novel Reader
```
┌──────────────────────────────────────────┐
│  Slim Header (소설 제목 + 화 번호)        │
├──────────────────────────────────────────┤
│  ┌─ ReaderControls ──────────────────┐   │
│  │ [글자-] [글자+] [테마] [목차]       │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ 본문 영역 (max-width: 720px) ────┐  │
│  │                                    │  │
│  │  크로마버스                         │  │
│  │  대막 1: 디소넌스의 시대            │  │
│  │  1화. 빛이 흐르는 아침              │  │
│  │                                    │  │
│  │  이 기록을 시작한 이유는            │  │
│  │  나중에 쓰겠다.                     │  │
│  │                                    │  │
│  │  (용어 하이라이트 예시)             │  │
│  │  "나는 [렌]이지, 모험가가 아니다"   │  │
│  │       ↑ 클릭 시 GlossaryPopup      │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌─ ChapterNav ──────────────────────┐   │
│  │ [← 이전 화]          [다음 화 →]   │   │
│  └───────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

### 5.2 User Flows

```
메인 플로우:
  Landing ──→ World Hub ──→ 세계관 섹션 ──→ 다른 섹션 탐색
                │
                └──→ Novel Hub ──→ 목차 ──→ 화 선택 ──→ 리더
                                                        │
                                              용어 클릭 ──→ 팝업 ──→ 세계관 페이지로 이동
```

### 5.3 Spoiler Guard Flow

```
소설 용어 링크 클릭:
  1. GlossaryPopup 표시
  2. spoiler-map.json 확인
  3. currentMaxChapter >= spoilerAfter?
     YES → 전체 내용 표시
     NO  → "이 내용은 소설 N화 이후에 공개됩니다" + 블러

세계관 페이지 접근:
  1. 페이지 렌더링
  2. SpoilerGuard가 각 콘텐츠 블록의 spoilerAfter 확인
  3. 미공개 블록은 블러 + placeholder 표시
  4. 사용자가 "스포일러 보기" 클릭 시 해제 가능 (자발적 선택)
```

---

## 6. Styling System

### 6.1 Tailwind Config

```typescript
// tailwind.config.ts 핵심 설정
{
  theme: {
    extend: {
      colors: {
        // RGB 체계
        ador: { DEFAULT: '#E63946', light: '#FF6B6B', dark: '#A62D37' },
        vitalis: { DEFAULT: '#2D6A4F', light: '#52B788', dark: '#1B4332' },
        cognis: { DEFAULT: '#457B9D', light: '#6BAED6', dark: '#2C5F7C' },
        // CMYK 체계
        suppress: { DEFAULT: '#1D3557', light: '#2D4A7A', dark: '#0D1B2A' },
        erode: { DEFAULT: '#6B2737', light: '#8B3A4A', dark: '#4A1A27' },
        distort: { DEFAULT: '#B5838D', light: '#D4A5AD', dark: '#8B636D' },
        void: { DEFAULT: '#0B0B0B', light: '#1A1A1A', dark: '#000000' },
        // 지역
        enji: '#FF6B35',
        seiji: '#43AA8B',
        meichi: '#577590',
        koji: '#F4A261',
        shiji: '#9B5DE5',
        aochi: '#00B4D8',
        border: '#6C757D',
        // Neutral
        hakuten: '#F1FAEE',
        deep: '#0D1117',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
}
```

### 6.2 Typography

| 용도 | 폰트 | 크기 |
|------|------|------|
| Heading (한글) | Pretendard | 2xl~4xl |
| Body (한글) | Pretendard | base~lg |
| 소설 본문 | Noto Serif KR | lg (조절 가능: sm~xl) |
| 코드/수치 | JetBrains Mono | sm |

### 6.3 Dark Mode

- 기본: 다크 모드 (`deep` 배경)
- 토글: 라이트 모드 (`hakuten` 배경)
- 소설 리더: 별도 테마 (세피아 추가 가능)
- `next-themes` 사용, Zustand `theme` store와 동기화

---

## 7. Implementation Guide

### 7.1 File Structure (확장)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                     # Landing
│   ├── world/
│   │   ├── page.tsx                 # World Hub
│   │   ├── layout.tsx               # World 공통 레이아웃 (사이드바)
│   │   ├── creation/page.tsx        # FR-03
│   │   ├── races/page.tsx           # FR-04
│   │   ├── power/page.tsx           # FR-05
│   │   ├── society/page.tsx         # FR-06, FR-14
│   │   ├── religion/page.tsx        # FR-07
│   │   ├── geography/page.tsx       # FR-08
│   │   ├── history/page.tsx         # FR-09
│   │   ├── glossary/page.tsx        # FR-10
│   │   ├── economy/page.tsx         # FR-11
│   │   ├── growth/page.tsx          # FR-12
│   │   ├── chromastorm/page.tsx     # FR-13
│   │   └── special-beings/page.tsx  # FR-15
│   ├── novel/
│   │   ├── page.tsx                 # FR-17, FR-18
│   │   ├── [chapter]/page.tsx       # FR-19, FR-20
│   │   └── characters/page.tsx      # FR-21
│   ├── auth/
│   │   ├── actions.ts               # Server Actions (signIn, signUp, signOut)
│   │   ├── login/page.tsx           # FR-22 로그인
│   │   └── signup/page.tsx          # FR-22 회원가입
│   └── about/page.tsx               # FR-25
├── components/
│   ├── auth/
│   │   └── AuthButton.tsx           # 로그인/로그아웃 버튼 (헤더 통합)
│   ├── ui/                          # 커스텀 컴포넌트 (shadcn/ui 대체)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── world/
│   │   ├── InteractiveMap.tsx
│   │   ├── RegionDetail.tsx
│   │   ├── Timeline.tsx
│   │   ├── TimelineEvent.tsx
│   │   ├── GlossarySearch.tsx
│   │   ├── GlossaryCard.tsx
│   │   ├── RaceCard.tsx
│   │   ├── PowerSystem.tsx
│   │   ├── PowerRangeTable.tsx
│   │   ├── SocialTierChart.tsx
│   │   ├── ReligionCompare.tsx
│   │   └── ChromaSimulator.tsx
│   ├── novel/
│   │   ├── NovelReader.tsx
│   │   ├── ReaderControls.tsx
│   │   ├── ChapterList.tsx
│   │   ├── ChapterNav.tsx
│   │   ├── ArcOverview.tsx
│   │   ├── GlossaryPopup.tsx
│   │   ├── SpoilerGuard.tsx
│   │   ├── CharacterCard.tsx
│   │   └── ChromaDisplay.tsx
│   └── common/
│       ├── SectionHeader.tsx
│       └── ColorBadge.tsx
├── content/
│   ├── world/
│   │   ├── glossary.json
│   │   ├── geography.json
│   │   ├── history.json
│   │   ├── power.json
│   │   ├── society.json
│   │   ├── religion.json
│   │   ├── economy.json
│   │   ├── growth.json
│   │   ├── chromastorm.json
│   │   ├── races.json
│   │   ├── creation.json
│   │   ├── special-beings.json
│   │   └── spoiler-map.json
│   ├── novel/
│   │   ├── meta.json
│   │   └── chapters/
│   │       ├── 001.mdx
│   │       ├── 002.mdx
│   │       └── ...010.mdx
│   └── characters/
│       ├── kai.json
│       ├── coda.json
│       ├── nix.json
│       ├── ray.json
│       └── ...supporting.json
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Supabase 브라우저 클라이언트
│   │   ├── server.ts            # Supabase 서버 클라이언트
│   │   └── middleware.ts        # Supabase 세션 갱신
│   ├── content.ts               # 콘텐츠 로딩 유틸
│   ├── glossary.ts              # 용어 매칭/하이라이트 유틸
│   ├── spoiler.ts               # 스포일러 가드 유틸
│   └── utils.ts                 # 공통 유틸
├── stores/
│   ├── theme.ts                 # 테마/다크모드
│   └── reader.ts               # 소설 리더 상태 (글자 크기, 진행률)
├── styles/
│   └── globals.css
└── types/
    ├── world.ts
    ├── novel.ts
    └── common.ts
```

### 7.2 Implementation Order

#### Phase 1 (1주차) ✅
1. [x] Next.js 15 프로젝트 초기화 (`create-next-app`)
2. [x] Tailwind CSS v4 + 커스텀 컴포넌트 설정
3. [x] 폰트 설정 (Pretendard 로컬, Noto Serif KR Google)
4. [x] `globals.css` 색채 토큰 정의
5. [x] `RootLayout` + `Header` + `Footer` + `Navigation`
6. [x] `MobileMenu` (반응형)
7. [x] 다크/라이트 테마 토글 (`next-themes`)
8. [x] 랜딩 페이지 구현
9. [x] Cloudflare Pages 배포

#### Phase 2-A (2~3주차) ✅
10. [x] `content/world/` JSON 데이터 구조화 (세계관설정집 → JSON 변환)
11. [x] `content/world/spoiler-map.json` 초기 설정
12. [x] `WorldHub` 허브 페이지
13. [x] `CreationStory` 창세 신화 페이지
14. [x] `RaceCard` + 종족 페이지
15. [x] `PowerSystem` + 힘의 체계 페이지 (PowerRangeTable은 PowerSystem에 통합)
16. [x] `InteractiveMap` + `RegionDetail` + 지리 페이지 (SVG 동심원 맵)
17. [x] `Timeline` + `TimelineEvent` + 역사 페이지
18. [x] `GlossarySearch` + `GlossaryCard` + 용어 사전 페이지

#### Phase 2-B (4주차) ✅
19. [x] `SocialTierChart` + 사회/코드 체계 페이지
20. [x] `ReligionCompare` + 종교 페이지
21. [x] 경제 페이지
22. [x] 성장 체계 페이지
23. [x] 크로마스톰 페이지
24. [x] 특수 존재 페이지
25. [x] `ChromaSimulator` (R/G/B 슬라이더, 계층/능력 표시)

#### Phase 3 (5~6주차) ✅
26. [x] docx → JSON 변환 (MDX 대신 JSON 채택)
27. [x] `content/novel/meta.json` + `content/characters/*.json` (13인) 작성
28. [x] `ArcOverview` + 7대막 개요 페이지
29. [x] `ChapterList` + 목차 페이지
30. [x] `ReaderContent` (NovelReader + ReaderControls + ChapterNav 통합, 다크/라이트/세피아 3모드)
31. [x] `GlossaryPopup` (용어 하이라이트 + 팝업 + "용어 사전에서 보기" 링크)
32. [x] `SpoilerGuard` 컴포넌트
33. [x] `CharacterCard` + `ChromaDisplay` (CMYK 지원) + 캐릭터 프로필 페이지 (13인)
34. [x] About 페이지 (확장 작품 로드맵)

#### Phase 4-A (인증) ✅
35. [x] Supabase 클라이언트 설정 (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
36. [x] Middleware (`middleware.ts` - 세션 갱신)
37. [x] Server Actions (`auth/actions.ts` - signIn, signUp, signOut)
38. [x] 로그인/회원가입 페이지 (`auth/login`, `auth/signup`)
39. [x] `AuthButton` 컴포넌트 (헤더 통합)

#### Phase 4-B~D (미구현)
40. [ ] 이어읽기 (읽은 화수 DB 저장, 마지막 위치 이어읽기)
41. [ ] 세계관 잠금해제 (읽은 분량 기반 점진적 해제)
42. [ ] 댓글 시스템

---

## 8. Error Handling

| 상황 | 처리 |
|------|------|
| 존재하지 않는 화 번호 접근 | `notFound()` → 커스텀 404 페이지 |
| 스포일러 콘텐츠 접근 | `SpoilerGuard` 블러 + 안내 메시지 |
| 용어 검색 결과 없음 | "검색 결과가 없습니다" + 관련 용어 추천 |
| 이미지 로딩 실패 | placeholder 이미지 + alt 텍스트 |
| MDX 파싱 에러 | 빌드 타임 에러 → 해당 화 스킵 경고 |

---

## 9. SEO Strategy

| 페이지 | title | description | OG Image |
|--------|-------|-------------|----------|
| Landing | 크로마버스 — 빛과 어둠의 세계 | 크로마주 세계관 백과사전과 소설 연재 플랫폼 | 히어로 이미지 |
| World Hub | 크로마라 — 세계관 | 렌과 묵렌이 사는 빛과 어둠의 세계 | 세계 지도 |
| Novel Hub | 크로마버스 소설 | 카이의 기록 — 700화 대하 판타지 | 소설 커버 |
| 각 화 | 크로마버스 N화: {제목} | 1화 첫 문장 발췌 | 소설 커버 |
| 용어 사전 | 크로마주 용어 사전 | 크로마주 세계의 모든 용어 | 용어 사전 아이콘 |

모든 페이지에 `generateMetadata()` 적용. 세계관/소설 페이지는 SSG로 빌드하여 크롤러 최적화. Cloudflare Pages CDN으로 글로벌 배포.

---

## 10. Test Plan

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| 빌드 검증 | 전체 SSG 빌드 성공 | `next build` | 매 Phase |
| TypeScript | 타입 검증 | `tsc --noEmit` | 매 Phase |
| Lint | 코드 품질 | ESLint | 매 Phase |
| Lighthouse | 성능/접근성/SEO | Chrome Lighthouse | Phase 1 이후 |
| 반응형 | 모바일/태블릿/데스크톱 | 수동 (DevTools) | Phase 1 이후 |
| 콘텐츠 | 용어 일관성 (부록 A/B) | 커스텀 스크립트 | Phase 2 |
| 스포일러 | 가드 정상 작동 | 수동 | Phase 3 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-15 | Initial draft | Claude + User |
| 0.2 | 2026-03-15 | 최신화: Cloudflare Pages 배포, Phase 4-A 인증 구현 반영, 캐릭터 13인, Supabase 클라이언트 구조, 구현 상태 체크, 의도적 편차 문서화 (커스텀 컴포넌트, JSON 포맷, ReaderContent 통합) | Claude + User |
