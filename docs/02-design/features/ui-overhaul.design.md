# UI Overhaul Design Document

> **Summary**: 크로마버스 웹사이트 전면 UI 개편 — Cinematic Immersive 상세 설계
>
> **Project**: Chromaverse
> **Version**: 1.0.0
> **Author**: Claude + User
> **Date**: 2026-03-18
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/ui-overhaul.plan.md`

---

## 1. Architecture Overview

### 1.1 기술 스택 (변경 없음)

| 항목 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 15 (App Router, static export) | 유지 |
| Styling | Tailwind CSS v4 + CSS Custom Properties | 듀얼 팔레트 확장 |
| Animation | Framer Motion v12 | 시네마틱 전환 추가 |
| State | Zustand v5 | 읽기 진행/테마 상태 확장 |
| Theme | next-themes v0.4 | 빛/어둠 모드 |
| Auth/DB | Supabase (Auth + DB) | 읽기 진행률 저장 |
| Font | Pretendard (UI) + Noto Serif KR (소설) | 유지 |
| Deploy | Cloudflare Pages | 유지 |

### 1.2 디렉토리 구조 변경

```
src/
├── app/
│   ├── page.tsx                    # 랜딩 → Scroll Cinema (전면 재작성)
│   ├── layout.tsx                  # 루트 레이아웃 (RadialMenu/Header 교체)
│   ├── world/
│   │   ├── page.tsx                # 세계관 허브 → Constellation Map (전면 재작성)
│   │   ├── layout.tsx              # 사이드바 레이아웃 → 제거 (Tab Chapters로 대체)
│   │   ├── [기존 12개 페이지]       # Tab Chapters 내 콘텐츠로 재배치
│   │   └── [slug]/page.tsx         # 동적 라우트로 통합 (선택적)
│   ├── novel/
│   │   ├── page.tsx                # 소설 허브 → 시네마틱 TOC (재작성)
│   │   ├── [chapter]/page.tsx      # Immersive Reader (재작성)
│   │   └── characters/page.tsx     # 캐릭터 → 시네마틱 스타일 적용
│   ├── profile/
│   │   └── page.tsx                # 신규: 사용자 프로필/마이페이지
│   ├── about/page.tsx              # 소개 → 시네마틱 재설계
│   └── auth/
│       ├── login/page.tsx          # 로그인 → 시네마틱 통일
│       └── signup/page.tsx         # 회원가입 → 시네마틱 통일
├── components/
│   ├── core/                       # 신규 디자인 시스템 컴포넌트
│   ├── landing/                    # 신규 랜딩 씬 컴포넌트
│   ├── world/                      # 재설계
│   ├── novel/                      # 재설계
│   ├── user/                       # 신규 사용자 연동
│   ├── layout/                     # 재설계
│   └── common/                     # 유지/확장
├── lib/
│   ├── supabase/client.ts          # 유지
│   ├── reading-progress.ts         # 신규: 읽기 진행률 관리
│   ├── content-unlock.ts           # 신규: 콘텐츠 해제 매핑/로직
│   ├── content.ts                  # 유지
│   └── utils.ts                    # 유지 (cn 등)
├── stores/
│   ├── reader.ts                   # 확장: 읽기 진행률 상태
│   ├── theme.ts                    # 신규: 테마 관련 추가 상태
│   └── unlock.ts                   # 신규: 콘텐츠 해제 상태
├── content/                        # 유지 (세계관/소설 JSON)
├── styles/
│   └── globals.css                 # 전면 재설계 (듀얼 팔레트)
└── public/
    └── images/
        ├── landing/                # 신규: 랜딩 씬 이미지
        ├── world/                  # 신규: 세계관 히어로/프리뷰 이미지
        ├── characters/             # 신규: 캐릭터 일러스트
        └── ui/                     # 신규: UI 장식 이미지
```

---

## 2. Component Specifications

### 2.1 Core Components

#### 2.1.1 RadialMenu

```typescript
// src/components/core/RadialMenu.tsx
interface RadialMenuProps {
  className?: string;
}

/*
 * 고정 위치 버튼 (우측 하단, 모바일: 하단 중앙)
 * 클릭 시 동심원으로 메뉴 아이템 펼침
 *
 * 상태:
 * - closed: 48x48px 원형 버튼 (프리즈마 심볼 또는 ◈)
 * - open: 반경 120px 동심원에 3개 메뉴 노드 + 중앙 테마토글
 *
 * 메뉴 노드:
 * 1. 세계관 — 위치: 315° (우상), 색상: cognis(어둠)/suppress(빛)
 * 2. 소설   — 위치: 225° (좌하), 색상: ador(어둠)/erode(빛)
 * 3. 소개   — 위치: 135° (좌상), 색상: vitalis(어둠)/distort(빛)
 * 4. 중앙   — 빛↔어둠 토글 버튼
 *
 * 애니메이션:
 * - 열기: 0.3s spring, 노드가 중심에서 방사형으로 펼침
 * - 닫기: 0.2s ease-out, 노드가 중심으로 모임
 * - 배경: 오버레이 backdrop-blur(8px) + 반투명 배경
 * - 노드 호버: scale(1.15) + glow
 *
 * 모바일:
 * - 위치: 하단 중앙 (safe-area-inset 고려)
 * - 터치 반경: 최소 44px
 * - 열기 방향: 위쪽 반원형 (180° 범위)
 *
 * 접근성:
 * - aria-label="메인 메뉴"
 * - ESC로 닫기
 * - 포커스 트랩 (열린 상태)
 */
```

#### 2.1.2 SceneIndicator

```typescript
// src/components/core/SceneIndicator.tsx
interface SceneIndicatorProps {
  scenes: { id: string; label: string }[];
  activeScene: number;
  onSceneClick: (index: number) => void;
}

/*
 * 우측 세로 도트 네비게이션 (랜딩 페이지 전용)
 * 위치: right: 24px, top: 50% (세로 중앙)
 *
 * 각 도트:
 * - inactive: 8px 원, border만 (테마 색상)
 * - active: 12px 원, fill + glow shadow
 * - hover: 도트 옆에 라벨 텍스트 페이드인
 *
 * 연결선: 도트 사이 1px 라인, active 구간만 glow
 *
 * 모바일: 숨김 (snap scroll 자체의 관성으로 충분)
 */
```

#### 2.1.3 ThemeToggle

```typescript
// src/components/core/ThemeToggle.tsx

/*
 * 빛↔어둠 전환 버튼
 * RadialMenu 중앙 + CinemaHeader 우측에 배치
 *
 * 아이콘:
 * - 어둠(쿠로겐) 모드: 달/별 형상 (밝은 색)
 * - 빛(루미나스) 모드: 태양/빛살 형상 (어두운 색)
 *
 * 전환 애니메이션 (0.6s):
 * 1. 전체 화면에 트랜지션 오버레이 레이어 생성
 * 2. 빛→어둠: 중앙에서 어둠 파동이 퍼지며 빛 입자 흩어짐
 *    어둠→빛: 중앙에서 빛이 폭발하며 어둠이 밀려남
 * 3. CSS 변수 전환 (transition 0.6s ease-in-out)
 * 4. 오버레이 페이드아웃
 *
 * 구현: next-themes setTheme() 호출 + Framer Motion 오버레이
 */
```

#### 2.1.4 ParticleBackground

```typescript
// src/components/core/ParticleBackground.tsx
interface ParticleBackgroundProps {
  variant: 'light' | 'dark' | 'mixed';
  density?: number; // 파티클 수, 기본 50
  speed?: number;   // 이동 속도, 기본 0.5
  interactive?: boolean; // 마우스 반응 여부
}

/*
 * Canvas 기반 빛 입자 배경 효과
 * 랜딩 히어로 + 기타 섹션 배경에 사용
 *
 * 파티클:
 * - 크기: 2~6px, 랜덤
 * - 색상: 테마 accent 색상 (RGB계열/CMYK계열)
 * - 움직임: 느린 브라운 운동 + 위로 부유
 * - 불투명도: 0.2~0.6, 깜빡임 효과
 *
 * interactive=true:
 * - 마우스 근처 파티클이 밀려남 (반발 효과)
 * - 마우스 클릭 시 파티클 폭발 효과
 *
 * 성능:
 * - requestAnimationFrame 사용
 * - 탭 비활성 시 일시정지
 * - 모바일: density 50% 감소, interactive 비활성
 * - will-change: transform 사용
 */
```

#### 2.1.5 GlowBar

```typescript
// src/components/core/GlowBar.tsx
interface GlowBarProps {
  progress: number; // 0~1
  color?: string;   // CSS 색상, 기본 테마 accent
  height?: number;  // px, 기본 3
}

/*
 * 진행률 glow 바 (소설 리더 상단)
 * 위치: fixed top, z-index 50
 *
 * 스타일:
 * - 배경: 투명
 * - 바: 그라데이션 (accent-light → accent → accent-dark)
 * - Glow: box-shadow 0 0 8px accent/50, 0 0 24px accent/20
 * - 높이: 3px (기본), 호버 시 5px로 확장
 *
 * 애니메이션:
 * - progress 변화: transition width 0.3s ease
 * - glow 맥동: 미세한 opacity 펄스 (2s 주기)
 */
```

### 2.2 Landing Components

#### 2.2.1 ScrollCinema (랜딩 컨테이너)

```typescript
// src/app/page.tsx (전면 재작성)

/*
 * CSS scroll-snap 기반 풀스크린 세로 스크롤
 *
 * 구조:
 * <main className="h-screen overflow-y-auto snap-y snap-mandatory">
 *   <HeroScene />      {/* snap-start, 100vh */}
 *   <GenesisScene />    {/* snap-start, 100vh */}
 *   <NovelScene />      {/* snap-start, 100vh */}
 *   <ColorScene />      {/* snap-start, 100vh */}
 *   <CTAScene />        {/* snap-start, 100vh */}
 * </main>
 *
 * 씬 전환 감지:
 * - IntersectionObserver로 현재 활성 씬 추적
 * - SceneIndicator에 activeScene 전달
 * - 씬 진입 시 해당 씬 애니메이션 트리거
 *
 * 모바일:
 * - snap-y snap-mandatory 유지 (iOS Safari 호환)
 * - 각 씬의 콘텐츠가 화면에 맞도록 반응형
 * - 과도한 애니메이션 간소화 (prefers-reduced-motion 존중)
 */
```

#### 2.2.2 HeroScene

```typescript
// src/components/landing/HeroScene.tsx

/*
 * Scene 1: 히어로 — 100vh 풀스크린
 *
 * 레이어 구성:
 * 1. 배경 이미지: /images/landing/hero.webp (프리즈마폴 빛 장면)
 *    - object-fit: cover
 *    - 쿠로겐: 원본 (어두운 톤)
 *    - 루미나스: CSS filter로 톤 조정 (밝은 환상적 버전)
 * 2. ParticleBackground (interactive, density=80)
 * 3. 그라데이션 오버레이: 하단에서 배경색으로 페이드
 * 4. 콘텐츠:
 *    - "CHROMAVERSE" 로고/타이틀
 *      - 폰트: Pretendard 900, 6rem(desktop)/3rem(mobile)
 *      - letter-spacing: 0.2em
 *      - 애니메이션: 글자 하나씩 페이드인 (stagger 0.05s)
 *      - 효과: text-shadow glow (accent 색)
 *    - 서브타이틀: "빛과 어둠이 만든 세계"
 *      - 타이핑 애니메이션 (기존 TypingQuote 재활용)
 *      - 2s 딜레이 후 시작
 *    - 스크롤 인디케이터: 하단 중앙
 *      - "↓" 또는 커스텀 아이콘, bounce 애니메이션
 *
 * 진입 애니메이션 (페이지 로드 시):
 * 1. 0s: 완전 검은 화면
 * 2. 0.5s: 배경 이미지 페이드인 (1.5s)
 * 3. 1s: 파티클 시작
 * 4. 1.5s: 타이틀 글자 stagger 페이드인
 * 5. 3s: 서브타이틀 타이핑 시작
 * 6. 5s: 스크롤 인디케이터 바운스 시작
 */
```

#### 2.2.3 GenesisScene

```typescript
// src/components/landing/GenesisScene.tsx

/*
 * Scene 2: 창세신화 — 100vh
 *
 * 레이아웃: 좌우 분할 (desktop) / 상하 분할 (mobile)
 *
 * Desktop:
 * ┌─────────────────┬─────────────────┐
 * │   루미나스 영역   │   쿠로겐 영역    │
 * │   (밝은 톤)       │   (어두운 톤)     │
 * │                  │                  │
 * │   빛의 근원       │   어둠의 근원     │
 * │   설명 텍스트     │   설명 텍스트     │
 * │                  │                  │
 * │         프리즈마폴 이미지           │
 * │         (중앙, 양쪽에 걸침)          │
 * └─────────────────┴─────────────────┘
 *
 * 스크롤 진입 애니메이션:
 * 1. 좌우가 화면 바깥에서 슬라이드인
 * 2. 중앙에서 만나며 프리즈마폴 이미지 등장
 * 3. 연결선이 양쪽으로 뻗어나가며 설명 텍스트 페이드인
 *
 * 이미지: /images/landing/genesis.webp
 * 중앙 이미지: /images/landing/prismafall.webp
 */
```

#### 2.2.4 NovelScene

```typescript
// src/components/landing/NovelScene.tsx

/*
 * Scene 3: 소설 소개 — 100vh
 *
 * 배경: /images/landing/novel-silhouettes.webp (4인 실루엣)
 * 오버레이: 하단 그라데이션 (배경색으로)
 *
 * 콘텐츠:
 * - 인용문 (카이의 기록):
 *   "이 기록을 시작한 이유는 나중에 쓰겠다.
 *    지금은 다만, 아무 일도 일어나지 않았던 어느 아침부터 적는다.
 *    나는 기록관이지, 모험가가 아니다."
 *   - Noto Serif KR, italic
 *   - 타이핑 효과 (IntersectionObserver 트리거)
 *
 * - 실루엣 인터랙션 (desktop):
 *   4개 실루엣 각각 hover 시:
 *   - 해당 실루엣만 밝게 glow
 *   - 이름 + 한줄 설명 툴팁
 *   - 카이/코다/닉스/레이
 *
 * - CTA: "이야기 시작하기" 버튼
 *   - glow border 애니메이션
 *   - 클릭 → /novel/1 (1화)
 *
 * 모바일: 실루엣 인터랙션 제거, 인용문 + CTA만
 */
```

#### 2.2.5 ColorScene

```typescript
// src/components/landing/ColorScene.tsx

/*
 * Scene 4: 색채 인터랙티브 — 100vh
 *
 * 인터랙티브 캔버스:
 * - Canvas 전체 화면
 * - 7개 채널 색상이 그라데이션으로 흐름
 * - 마우스 위치에 따라 색 혼합 효과
 *   - 마우스 이동 → radial gradient가 마우스를 따라 이동
 *   - 색상: 가장 가까운 채널 색상 기준
 * - 클릭: 작은 컬러 폭발 파티클
 *
 * 오버레이 텍스트:
 * - "7개의 채널이 세계를 물들인다"
 * - RGB (아도르/비탈리스/코그니스) 간단 소개
 * - CMYK (서프레스/이로드/디스토트/보이드) 간단 소개
 *
 * "세계관 더 알아보기" → /world
 *
 * 모바일: 정적 그라데이션 배경 + 터치 시 리플 효과
 */
```

#### 2.2.6 CTAScene

```typescript
// src/components/landing/CTAScene.tsx

/*
 * Scene 5: CTA — 100vh
 *
 * 배경: /images/landing/cta-prismafall.webp (프리즈마폴 전경)
 * 오버레이: 중앙 비네팅 (가장자리 어둡게)
 *
 * 콘텐츠:
 * - 통계 카운터 (스크롤 진입 시 카운트업 애니메이션):
 *   "700화의 대서사 · 9개 지역 · 4개 종족 · 7대막"
 *
 * - CTA 버튼 2개:
 *   1. "세계관 탐험하기" → /world (primary, glow border)
 *   2. "소설 읽기" → /novel (secondary, outline)
 *
 * - World Teaser 미리보기:
 *   랜덤 세계관 명언/설정 조각 (1개)
 *   3초마다 페이드 전환
 *
 * - 로그인 사용자: "이어 읽기" 버튼 추가 (마지막 읽은 화로)
 */
```

### 2.3 World Components

#### 2.3.1 ConstellationMap

```typescript
// src/components/world/ConstellationMap.tsx
interface ConstellationMapProps {
  unlockedNodes: string[]; // 해제된 노드 ID 목록
  isLoggedIn: boolean;
}

/*
 * SVG 기반 인터랙티브 별자리 맵
 * 뷰포트: 전체 화면 (100vw × calc(100vh - header))
 *
 * 노드 정의 (12개):
 * const NODES = [
 *   { id: 'creation',    label: '창세',      x: 50, y: 8,   color: '#FF4D5E', connections: ['races','power'] },
 *   { id: 'races',       label: '종족',      x: 30, y: 22,  color: '#34D399', connections: ['creation','society','power'] },
 *   { id: 'power',       label: '힘의 체계', x: 70, y: 22,  color: '#60A5FA', connections: ['creation','races','growth'] },
 *   { id: 'society',     label: '사회',      x: 25, y: 38,  color: '#F4A261', connections: ['races','religion','economy'] },
 *   { id: 'religion',    label: '종교',      x: 75, y: 38,  color: '#9B5DE5', connections: ['society','history'] },
 *   { id: 'geography',   label: '지리',      x: 20, y: 55,  color: '#43AA8B', connections: ['society','economy'] },
 *   { id: 'history',     label: '역사',      x: 80, y: 55,  color: '#577590', connections: ['religion','growth'] },
 *   { id: 'economy',     label: '경제',      x: 25, y: 72,  color: '#FF6B35', connections: ['geography','society'] },
 *   { id: 'growth',      label: '성장',      x: 75, y: 72,  color: '#00B4D8', connections: ['power','history'] },
 *   { id: 'glossary',    label: '용어',      x: 35, y: 88,  color: '#8B949E', connections: ['economy'] },
 *   { id: 'chromastorm', label: '크로마스톰', x: 50, y: 85,  color: '#E63946', connections: ['growth','special'] },
 *   { id: 'special',     label: '특수 존재', x: 65, y: 92,  color: '#B5838D', connections: ['chromastorm'] },
 * ];
 *
 * 노드 렌더링:
 * - 해제 상태: 원형(r=20) + glow + 라벨
 * - 잠금 상태: 원형(r=20) + dim opacity(0.3) + 자물쇠 SVG 오버레이
 * - hover (해제): scale(1.2) + 강한 glow + 프리뷰 이미지 팝업
 * - hover (잠금): "N화를 읽으면 해제됩니다" 툴팁
 *
 * 연결선:
 * - SVG <line> 또는 <path> (bezier)
 * - 해제↔해제: 밝은 선 + pulse 애니메이션 (stroke-dashoffset)
 * - 해제↔잠금: dim 선 (opacity 0.15)
 * - 잠금↔잠금: 거의 안 보임 (opacity 0.05)
 *
 * 진입 애니메이션:
 * 1. 0s: 빈 화면
 * 2. 0.3s: 노드가 하나씩 페이드인 (stagger 0.1s, 위에서 아래로)
 * 3. 1.5s: 연결선이 그려짐 (stroke-dasharray 애니메이션)
 * 4. 2.5s: glow 맥동 시작
 *
 * 진행률 표시 (로그인 시):
 * - 하단에 "X/12 해제" 텍스트 + 미니 진행률 바
 *
 * 모바일 (< 768px):
 * - SVG 맵 대신 세로 리스트
 * - 각 항목: 원형 아이콘(해제/잠금) + 라벨 + 설명 1줄
 * - 해제: 탭 → Tab Chapters 이동
 * - 잠금: 탭 → "N화를 읽으면 해제됩니다" 안내
 */
```

#### 2.3.2 TabChapters

```typescript
// src/components/world/TabChapters.tsx
interface TabChaptersProps {
  initialTab?: string;      // 초기 선택 탭 ID
  unlockedTabs: string[];   // 해제된 탭 목록
}

/*
 * 세계관 상세 페이지의 탭 네비게이션 컨테이너
 *
 * 탭 바:
 * - 수평 스크롤 가능 (overflow-x-auto, scrollbar 숨김)
 * - 각 탭: 색상 도트(12px) + 라벨
 * - 활성 탭: 밑줄 glow + 탭 색상 강조
 * - 잠금 탭: dim + 자물쇠 아이콘 (작은 크기)
 * - 탭 전환: 밑줄이 애니메이션으로 이동 (Framer Motion layoutId)
 *
 * 콘텐츠 전환:
 * - AnimatePresence로 exit/enter 관리
 * - exit: opacity 0 + translateY(20px), 0.2s
 * - enter: opacity 1 + translateY(0), 0.3s
 * - 히어로 이미지: crossfade (0.4s)
 *
 * 각 탭 콘텐츠 구조:
 * 1. 히어로 이미지 (aspect-ratio 21:9, object-cover)
 * 2. 섹션 타이틀 + 서브타이틀
 * 3. 본문 (기존 세계관 콘텐츠를 이미지+텍스트 교차 배치로 재구성)
 * 4. 관련 섹션 링크 (다른 탭으로)
 *
 * URL 동기화:
 * - /world?tab=power 형태로 쿼리 파라미터
 * - 브라우저 뒤로가기 시 이전 탭으로 복귀
 */
```

### 2.4 Novel Components

#### 2.4.1 ImmersiveReader

```typescript
// src/components/novel/ImmersiveReader.tsx
interface ImmersiveReaderProps {
  chapter: ChapterData;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

/*
 * 몰입형 소설 리더
 *
 * 레이아웃:
 * - GlowBar (fixed top, 진행률)
 * - 본문 영역: max-w-[680px], mx-auto, px-6
 * - 폰트: Noto Serif KR, 18px(desktop)/16px(mobile)
 * - 줄간격: 1.8 (기본), 사용자 조절 가능 (1.5/1.8/2.2)
 * - 여백: py-20 (상하 충분한 여백)
 *
 * 화 헤더 (진입 시 풀스크린):
 * - 배경: 화별 분위기 이미지 (있으면) 또는 그라데이션
 * - "제N화" + 타이틀 (대형, 중앙)
 * - 페이드인 + scale 애니메이션 (0.8s)
 * - 스크롤 다운 시 헤더가 축소되며 본문 시작
 *
 * 배경 색상 변화:
 * - 챕터 메타데이터에 scenes[] 정의:
 *   { startParagraph: 0, mood: 'morning', color: '#1a1520' }
 *   { startParagraph: 15, mood: 'tension', color: '#1a0a0a' }
 * - 현재 스크롤 위치의 paragraph 기반으로 배경 보간
 * - transition: background-color 3s ease (느리게, 눈치채지 못할 정도)
 *
 * 진행률 추적:
 * - scroll 이벤트 → progress = scrollTop / (scrollHeight - clientHeight)
 * - 디바운스 300ms로 Supabase 저장 (로그인 시)
 * - localStorage에도 동시 저장 (오프라인 대비)
 *
 * 완독 판정:
 * - progress >= 0.95 일 때 완독으로 기록
 * - onComplete() 호출 → 세계관 해제 체크
 *
 * UI 자동 숨김:
 * - 스크롤 다운: 헤더 + 하단 네비 페이드아웃 (1s idle 후)
 * - 스크롤 정지 / 스크롤 업: 페이드인
 * - 터치 (모바일): 탭 시 UI 토글
 *
 * 하단 네비:
 * - "❮ 이전 화" | "N / 전체" | "다음 화 ❯"
 * - 다음 화 없을 시: "완독을 축하합니다!" + 세계관 해제 미리보기
 *
 * 읽기 설정 (FloatingAction, 우하단):
 * - 폰트 크기: 14/16/18/20/22px
 * - 줄간격: 1.5/1.8/2.2
 * - localStorage에 저장
 */
```

### 2.5 User Components

#### 2.5.1 UnlockNotification

```typescript
// src/components/user/UnlockNotification.tsx
interface UnlockNotificationProps {
  unlockedItem: { id: string; label: string; chapter: number };
  onDismiss: () => void;
  onNavigate: () => void;
}

/*
 * 세계관 해제 알림 토스트
 *
 * 위치: 화면 하단 중앙, fixed
 * 크기: max-w-[400px], 자동 너비
 *
 * 디자인:
 * - 배경: glass (backdrop-blur + 반투명)
 * - 테두리: 해제된 노드 색상의 glow border
 * - 아이콘: 🔓 (자물쇠 열림)
 * - 텍스트: "[항목명] 세계관 정보가 해제되었습니다!"
 * - 버튼: "지금 확인하기" (해당 탭으로 이동)
 *
 * 애니메이션:
 * - 진입: 하단에서 슬라이드업 + 페이드인 (0.3s)
 * - 자동 닫힘: 5s 후 페이드아웃
 * - 수동 닫힘: 스와이프 다운 또는 X 버튼
 */
```

### 2.6 Layout Components

#### 2.6.1 CinemaHeader

```typescript
// src/components/layout/CinemaHeader.tsx

/*
 * 미니멀 시네마틱 헤더
 *
 * 구조:
 * ┌─ ◈ CHROMAVERSE ──────────────────────── ☽/☀ ─┐
 *
 * 좌측: 로고 (◈ + "CHROMAVERSE" 텍스트, Pretendard 700)
 *   - 클릭 → / (홈)
 *   - 로고 색상: 현재 테마 accent
 *
 * 우측: ThemeToggle 버튼만
 *
 * 동작:
 * - 초기: 완전 투명 배경
 * - 스크롤 20px+: glass 배경 (backdrop-blur + 반투명)
 * - 읽기 모드: 완전 투명, 스크롤 업 시만 표시
 * - z-index: 40 (RadialMenu보다 아래)
 *
 * 모바일: 동일 (RadialMenu가 메인 네비 역할)
 */
```

#### 2.6.2 WorldTeaser (푸터)

```typescript
// src/components/layout/WorldTeaser.tsx

/*
 * 세계관 티저 푸터
 *
 * 데이터: world-teasers.json
 * [
 *   { quote: "빛이 없으면 색도 없다.", source: "광명회 교리" },
 *   { quote: "모든 것은 프리즈마폴에서 시작되었다.", source: "창세 기록" },
 *   ...
 * ]
 *
 * 레이아웃:
 * ┌─────────────────────────────────────────┐
 * │  ─── 구분선 (accent glow) ───           │
 * │                                         │
 * │  "빛이 없으면 색도 없다."               │
 * │                    — 광명회 교리          │
 * │                                         │
 * │  ◈ CHROMAVERSE · © 2026                 │
 * └─────────────────────────────────────────┘
 *
 * 기능:
 * - 페이지 로드마다 랜덤 인용문 선택
 * - 인용문 페이드인 애니메이션 (IntersectionObserver)
 * - 구분선: 테마 accent 색상의 미세한 glow
 */
```

---

## 3. CSS/Theme Design

### 3.1 globals.css 재설계

```css
@import "tailwindcss";

@theme {
  /* ========== 크로마주 색채 토큰 (공통) ========== */

  /* RGB 체계 */
  --color-ador: #E63946;
  --color-ador-light: #FF6B6B;
  --color-ador-dark: #A62D37;
  --color-vitalis: #2D6A4F;
  --color-vitalis-light: #52B788;
  --color-vitalis-dark: #1B4332;
  --color-cognis: #457B9D;
  --color-cognis-light: #6BAED6;
  --color-cognis-dark: #2C5F7C;

  /* CMYK 체계 */
  --color-suppress: #1D3557;
  --color-erode: #6B2737;
  --color-distort: #B5838D;
  --color-void: #0B0B0B;

  /* 지역 (유지) */
  --color-enji: #FF6B35;
  --color-seiji: #43AA8B;
  --color-meichi: #577590;
  --color-koji: #F4A261;
  --color-shiji: #9B5DE5;
  --color-aochi: #00B4D8;

  /* Font (유지) */
  --font-heading: "Pretendard", system-ui, sans-serif;
  --font-body: "Pretendard", system-ui, sans-serif;
  --font-novel: "Noto Serif KR", serif;

  /* ========== 쿠로겐 모드 (기본 = Dark) ========== */
  --color-bg-deep: #0B0B14;
  --color-bg-surface: #111827;
  --color-bg-elevated: #1C2333;
  --color-bg-overlay: rgba(11, 11, 20, 0.85);

  --color-text-primary: #E8ECF4;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;

  --color-border-default: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.15);
  --color-border-active: rgba(255, 255, 255, 0.25);

  /* 쿠로겐 accent (RGB glow) */
  --color-accent-warm: #FF4D5E;
  --color-accent-cool: #34D399;
  --color-accent-primary: #60A5FA;
}

/* ========== 루미나스 모드 (Light) ========== */
[data-theme="light"] {
  --color-bg-deep: #F5F0E8;
  --color-bg-surface: #FFFFFF;
  --color-bg-elevated: #FFF8F0;
  --color-bg-overlay: rgba(245, 240, 232, 0.9);

  --color-text-primary: #1A1A2E;
  --color-text-secondary: #4A4A6A;
  --color-text-muted: #8A8AA0;

  --color-border-default: rgba(0, 0, 0, 0.08);
  --color-border-hover: rgba(0, 0, 0, 0.15);
  --color-border-active: rgba(0, 0, 0, 0.25);

  /* 루미나스 accent (CMYK ink) */
  --color-accent-warm: #8B2252;
  --color-accent-cool: #1D3557;
  --color-accent-primary: #B8860B;
}
```

### 3.2 유틸리티 클래스

```css
/* 글래스 모피즘 */
.glass {
  background: var(--color-bg-overlay);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-default);
}

/* Glow 효과 */
.glow-accent {
  box-shadow:
    0 0 8px var(--color-accent-primary) / 0.3,
    0 0 24px var(--color-accent-primary) / 0.1;
}

/* 스냅 스크롤 */
.snap-container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100vh;
}
.snap-scene {
  scroll-snap-align: start;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 텍스트 glow */
.text-glow {
  text-shadow: 0 0 20px currentColor / 0.5, 0 0 40px currentColor / 0.2;
}

/* 잠금 오버레이 */
.locked-overlay {
  position: relative;
}
.locked-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-bg-deep) / 0.7;
  backdrop-filter: blur(4px);
}
```

---

## 4. Data Models

### 4.1 읽기 진행률 (Supabase)

```sql
-- user_reading_progress 테이블
CREATE TABLE user_reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  scroll_position FLOAT DEFAULT 0, -- 0.0 ~ 1.0
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_number)
);

-- RLS 정책
ALTER TABLE user_reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_reading_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_reading_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_reading_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### 4.2 콘텐츠 해제 매핑 (클라이언트)

```typescript
// src/lib/content-unlock.ts

export const UNLOCK_MAP: Record<number, string[]> = {
  0:  ['creation', 'races', 'glossary'],         // 기본 해제
  1:  ['power', 'society'],                       // 1화 완독
  3:  ['religion', 'geography'],                  // 3화 완독
  5:  ['chromastorm', 'economy'],                 // 5화 완독
  7:  ['growth', 'history'],                      // 7화 완독
  10: ['special'],                                // 10화 완독
};

export function getUnlockedNodes(completedChapters: number[]): string[] {
  const maxCompleted = Math.max(0, ...completedChapters);
  const unlocked = new Set<string>();
  for (const [chapter, nodes] of Object.entries(UNLOCK_MAP)) {
    if (Number(chapter) <= maxCompleted) {
      nodes.forEach(n => unlocked.add(n));
    }
  }
  return Array.from(unlocked);
}

export function getNextUnlock(completedChapters: number[]): {
  chapter: number;
  nodes: string[];
} | null {
  const maxCompleted = Math.max(0, ...completedChapters);
  const sortedChapters = Object.keys(UNLOCK_MAP)
    .map(Number)
    .sort((a, b) => a - b);
  const next = sortedChapters.find(ch => ch > maxCompleted);
  if (!next) return null;
  return { chapter: next, nodes: UNLOCK_MAP[next] };
}
```

### 4.3 Zustand 스토어

```typescript
// src/stores/unlock.ts
interface UnlockStore {
  unlockedNodes: string[];
  completedChapters: number[];
  isLoggedIn: boolean;
  setCompletedChapters: (chapters: number[]) => void;
  markChapterComplete: (chapter: number) => string[]; // 새로 해제된 노드 반환
}

// src/stores/reader.ts (확장)
interface ReaderStore {
  // 기존
  currentChapter: number;
  fontSize: number;
  lineHeight: number;
  // 추가
  scrollPosition: number;
  readingMode: 'normal' | 'immersive';
  setScrollPosition: (pos: number) => void;
  setReadingMode: (mode: 'normal' | 'immersive') => void;
}
```

---

## 5. Implementation Order (상세)

### Phase 1: 디자인 시스템 & 테마

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 1-1 | globals.css 듀얼 팔레트 재작성 | `src/styles/globals.css` | 없음 |
| 1-2 | 유틸리티 클래스 추가 (glass, glow, snap 등) | `src/styles/globals.css` | 1-1 |
| 1-3 | cn() 유틸리티 확인/유지 | `src/lib/utils.ts` | 없음 |
| 1-4 | 기존 컴포넌트 색상 토큰 마이그레이션 | 전체 컴포넌트 | 1-1 |
| 1-5 | WCAG 대비 검증 (수동 + 자동) | - | 1-1 |

### Phase 2: 네비게이션 & 레이아웃

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 2-1 | RadialMenu 구현 | `src/components/core/RadialMenu.tsx` | 1-1 |
| 2-2 | SceneIndicator 구현 | `src/components/core/SceneIndicator.tsx` | 1-1 |
| 2-3 | ThemeToggle 구현 (전환 애니메이션 포함) | `src/components/core/ThemeToggle.tsx` | 1-1 |
| 2-4 | CinemaHeader 구현 | `src/components/layout/CinemaHeader.tsx` | 2-3 |
| 2-5 | 루트 layout.tsx 재구성 | `src/app/layout.tsx` | 2-1, 2-4 |
| 2-6 | 기존 Header/Navigation/Footer 제거 | - | 2-5 |

### Phase 3: 랜딩 Scroll Cinema

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 3-1 | ParticleBackground 구현 | `src/components/core/ParticleBackground.tsx` | 없음 |
| 3-2 | HeroScene 구현 | `src/components/landing/HeroScene.tsx` | 3-1 |
| 3-3 | GenesisScene 구현 | `src/components/landing/GenesisScene.tsx` | 1-1 |
| 3-4 | NovelScene 구현 | `src/components/landing/NovelScene.tsx` | 1-1 |
| 3-5 | ColorScene 구현 | `src/components/landing/ColorScene.tsx` | 1-1 |
| 3-6 | CTAScene 구현 | `src/components/landing/CTAScene.tsx` | 1-1 |
| 3-7 | page.tsx 전면 재작성 (Scroll Cinema) | `src/app/page.tsx` | 3-2~3-6, 2-2 |
| 3-8 | 이미지 에셋 생성/배치 | `public/images/landing/` | 3-7 |

### Phase 4: 세계관 허브 & Tab Chapters

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 4-1 | ConstellationMap SVG 구현 | `src/components/world/ConstellationMap.tsx` | 1-1 |
| 4-2 | TabChapters 컨테이너 구현 | `src/components/world/TabChapters.tsx` | 1-1 |
| 4-3 | 세계관 허브 page.tsx 재작성 | `src/app/world/page.tsx` | 4-1 |
| 4-4 | 세계관 layout.tsx 재작성 (사이드바→탭) | `src/app/world/layout.tsx` | 4-2 |
| 4-5 | 12개 섹션 콘텐츠를 탭 내 레이아웃으로 재배치 | 세계관 각 페이지 | 4-4 |
| 4-6 | 세계관 이미지 에셋 생성 | `public/images/world/` | 4-5 |

### Phase 5: 소설 리더 & 기타

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 5-1 | GlowBar 구현 | `src/components/core/GlowBar.tsx` | 1-1 |
| 5-2 | ImmersiveReader 구현 | `src/components/novel/ImmersiveReader.tsx` | 5-1 |
| 5-3 | 소설 [chapter]/page.tsx 재작성 | `src/app/novel/[chapter]/page.tsx` | 5-2 |
| 5-4 | 소설 허브 page.tsx 시네마틱 재설계 | `src/app/novel/page.tsx` | 1-1 |
| 5-5 | WorldTeaser 푸터 구현 | `src/components/layout/WorldTeaser.tsx` | 1-1 |
| 5-6 | 소개 페이지 재설계 | `src/app/about/page.tsx` | 1-1 |

### Phase 6: 사용자 연동

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 6-1 | Supabase 마이그레이션 (reading_progress 테이블) | SQL | 없음 |
| 6-2 | reading-progress.ts 유틸리티 | `src/lib/reading-progress.ts` | 6-1 |
| 6-3 | content-unlock.ts 해제 매핑 | `src/lib/content-unlock.ts` | 없음 |
| 6-4 | Zustand unlock 스토어 | `src/stores/unlock.ts` | 6-3 |
| 6-5 | ConstellationMap에 잠금/해제 UI 추가 | `ConstellationMap.tsx` | 4-1, 6-4 |
| 6-6 | TabChapters에 잠금 탭 UI 추가 | `TabChapters.tsx` | 4-2, 6-4 |
| 6-7 | ImmersiveReader에 진행률 저장 연동 | `ImmersiveReader.tsx` | 5-2, 6-2 |
| 6-8 | UnlockNotification 토스트 | `src/components/user/UnlockNotification.tsx` | 6-4 |
| 6-9 | 프로필 페이지 구현 | `src/app/profile/page.tsx` | 6-2, 6-4 |
| 6-10 | 인증 페이지 시네마틱 디자인 | `src/app/auth/*/page.tsx` | 1-1 |

### Phase 7: 검증 & 최적화

| 순서 | 작업 | 파일 | 의존성 |
|------|------|------|--------|
| 7-1 | 빛/어둠 모드 전수 스크린샷 검증 | Puppeteer | 전체 |
| 7-2 | 모바일 반응형 테스트 | Puppeteer (375/768px) | 전체 |
| 7-3 | 이미지 최적화 (WebP, lazy load) | next/image | 전체 |
| 7-4 | 애니메이션 성능 최적화 | - | 전체 |
| 7-5 | 로그인/비로그인 시나리오 검증 | - | 6-* |

---

## 6. Responsive Breakpoints

| Breakpoint | 범위 | 주요 변경 |
|------------|------|----------|
| mobile | < 640px | RadialMenu 하단중앙, 별자리맵→리스트, 단일컬럼, 인터랙션 간소화 |
| tablet | 640~1023px | RadialMenu 우하단, 별자리맵 축소, 2컬럼 가능 |
| desktop | 1024px+ | 전체 인터랙션 활성, 별자리맵 풀사이즈, 호버 효과 |

---

## 7. Accessibility

- 모든 텍스트: WCAG AA (4.5:1) 이상, 주요 텍스트 AAA (7:1) 목표
- RadialMenu: 키보드 탐색 (Tab/Arrow), ESC 닫기, aria-label
- 스냅 스크롤: prefers-reduced-motion 시 일반 스크롤로 fallback
- 이미지: alt 텍스트 (세계관 내용 반영)
- 색상만으로 정보 전달하지 않음 (잠금 = 자물쇠 아이콘 + 텍스트)

---

## 8. Performance Budget

| 항목 | 목표 |
|------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| 이미지 | WebP, lazy load, srcset (responsive) |
| 번들 | 코드 스플리팅 (각 씬/탭 lazy import) |
| 애니메이션 | GPU 가속 (transform, opacity만), 60fps |
| ParticleBackground | Canvas 최적화, 탭 비활성 시 정지 |
