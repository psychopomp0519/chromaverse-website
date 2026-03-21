# Novel Release System — Design

> **Feature**: novel-release-system
> **Date**: 2026-03-21
> **Plan Reference**: `docs/01-plan/features/novel-release-system.plan.md`

---

## 1. 데이터 모델

### 1.1 release-schedule.json

```
src/content/novel/release-schedule.json
```

```json
{
  "schedule": [
    { "chapter": 1, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 2, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 3, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 4, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 5, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 6, "releaseDate": "2026-04-01T00:00:00+09:00" },
    { "chapter": 7, "releaseDate": "2026-04-04T00:00:00+09:00" },
    { "chapter": 8, "releaseDate": "2026-04-07T00:00:00+09:00" },
    { "chapter": 9, "releaseDate": "2026-04-10T00:00:00+09:00" },
    { "chapter": 10, "releaseDate": "2026-04-14T00:00:00+09:00" }
  ],
  "timezone": "Asia/Seoul"
}
```

- 1~5화: 즉시 공개 (과거 날짜)
- 6~10화: 3~4일 간격 스케줄
- 스케줄에 없는 챕터는 JSON 파일 존재 시 즉시 공개 (하위 호환)

### 1.2 ChapterData 확장 (변경 없음)

기존 `ChapterData` 인터페이스는 변경하지 않는다. 스케줄 정보는 별도 JSON에서 관리.

```ts
// 기존 유지
export interface ChapterData {
  chapter: number;
  title: string;
  arc: number;
  volume: number;
  content: string;
  glossaryTerms: string[];
}
```

### 1.3 스케줄 유틸 타입

```ts
// src/lib/schedule.ts (신규)
export interface ReleaseEntry {
  chapter: number;
  releaseDate: string; // ISO 8601
}

export interface ReleaseSchedule {
  schedule: ReleaseEntry[];
  timezone: string;
}

export interface ChapterStatus {
  chapter: number;
  released: boolean;
  releaseDate: Date | null;
  isNew: boolean;       // 공개 후 3일 이내
}
```

---

## 2. 핵심 로직

### 2.1 src/lib/schedule.ts (신규)

```
역할: 스케줄 데이터 로드 + 공개 여부 판정 + 다음 화 정보
사용처: content.ts, [chapter]/page.tsx, NovelTOC, Novel Hub
```

| 함수 | 반환 | 설명 |
|------|------|------|
| `getSchedule()` | `ReleaseSchedule` | release-schedule.json 로드 (서버/클라이언트 공용) |
| `isReleased(chapter, now?)` | `boolean` | 해당 화의 공개 여부 |
| `getChapterStatus(chapter, now?)` | `ChapterStatus` | 공개 여부 + 신규 여부 |
| `getReleasedChapters(allChapters, now?)` | `number[]` | 공개된 챕터 목록 |
| `getNextRelease(now?)` | `{ chapter, releaseDate, daysLeft } \| null` | 다음 공개 예정 화 |
| `getAllChapterStatuses(allChapters, now?)` | `ChapterStatus[]` | 전체 상태 목록 |

**isNew 판정 기준**: `releaseDate` 이후 3일(72시간) 이내

### 2.2 src/lib/content.ts (수정)

```diff
+ import { getReleasedChapters as filterBySchedule } from "./schedule";

  export function getAllChapterNumbers(): number[] {
    // 파일시스템에서 모든 챕터 번호 읽기 (기존 로직 유지)
  }

+ // 클라이언트/서버 공용: 공개된 챕터만 반환
+ export function getAvailableChapterNumbers(): number[] {
+   const all = getAllChapterNumbers();
+   return filterBySchedule(all);
+ }
```

- `getAllChapterNumbers()`: 기존 유지 — 빌드 타임에 모든 챕터 반환 (generateStaticParams용)
- `getAvailableChapterNumbers()`: 신규 — 공개된 챕터만 반환 (UI 표시용)

### 2.3 generateStaticParams 영향

```ts
// src/app/novel/[chapter]/page.tsx
export function generateStaticParams() {
  // 변경 없음 — 모든 챕터(공개+미공개)에 대해 정적 페이지 생성
  return getAllChapterNumbers().map((ch) => ({ chapter: String(ch) }));
}
```

미공개 챕터 URL 접근 시 → 페이지는 존재하지만, 클라이언트 컴포넌트가 날짜 체크 후 카운트다운 표시.

---

## 3. 컴포넌트 설계

### 3.1 수정 컴포넌트

#### src/app/novel/[chapter]/page.tsx
- `getChapter(num)` 호출 후, **스케줄 정보도 함께 전달**
- `<ReaderContent>` 또는 `<ChapterGate>` 분기

```tsx
export default async function ChapterPage({ params }) {
  const { chapter } = await params;
  const num = Number(chapter);
  const data = getChapter(num);
  if (!data) return notFound();

  const allChapters = getAllChapterNumbers();
  // 스케줄 정보를 props로 전달 (클라이언트에서 날짜 체크)
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <ChapterGate chapter={num} allChapters={allChapters}>
        <ReaderContent
          chapter={data}
          chapterNum={num}
          hasPrev={allChapters.includes(num - 1)}
          hasNext={allChapters.includes(num + 1)}
        />
      </ChapterGate>
    </div>
  );
}
```

#### src/app/novel/page.tsx
- `getAvailableChapterNumbers()` 사용하여 공개분만 표시
- `getNextRelease()` 호출하여 다음 화 정보 전달

```tsx
export default function NovelPage() {
  const allChapters = getAllChapterNumbers();
  const availableChapters = getAvailableChapterNumbers();
  const summaries = getAllChapterSummaries();

  return (
    // ...
    <NovelTOC
      chapterSummaries={summaries}
      availableChapters={availableChapters}
      allChapters={allChapters}  // 예정 화 표시용
    />
    <NextReleaseCard />  // 클라이언트 컴포넌트
  );
}
```

#### src/components/novel/NovelTOC.tsx
- `availableChapters`에 포함된 화: 기존 링크
- `allChapters`에만 있는 화: 잠금 아이콘 + "D-N" 표시
- 최근 공개 화: `<NewBadge />` 표시

### 3.2 신규 컴포넌트

#### src/components/novel/ChapterGate.tsx
```
"use client"
역할: 챕터 접근 시 공개 여부 클라이언트 체크
미공개 시: 카운트다운 UI 표시
공개 시: children(ReaderContent) 렌더
```

| Props | 타입 | 설명 |
|-------|------|------|
| `chapter` | `number` | 현재 챕터 번호 |
| `allChapters` | `number[]` | 전체 챕터 목록 |
| `children` | `ReactNode` | ReaderContent |

**미공개 시 UI**:
- 챕터 제목 (흐리게)
- "이 화는 아직 공개되지 않았습니다"
- 카운트다운 타이머 (D-일 H시간 M분)
- 이전 화로 돌아가기 링크
- 다크/라이트 테마 호환

#### src/components/novel/NextReleaseCard.tsx
```
"use client"
역할: Novel Hub에 표시되는 다음 화 카운트다운 카드
위치: 목차 위 또는 아래
```

| 표시 내용 |
|-----------|
| "다음 화: N화 · 제목" |
| "D-일 H시간 후 공개" |
| 프로그레스 바 (공개까지 남은 시간 비율) |

- 다음 공개 예정이 없으면 렌더하지 않음
- 1분마다 카운트다운 갱신 (`setInterval`)

#### src/components/novel/NewBadge.tsx
```
역할: "NEW" 배지 (공개 후 3일 이내)
크기: text-xs, 인라인
```

```tsx
export function NewBadge() {
  return (
    <span className="ml-1.5 rounded-full bg-ador/20 px-1.5 py-0.5 text-[10px] font-bold text-ador">
      NEW
    </span>
  );
}
```

### 3.3 컴포넌트 트리

```
/novel (Hub)
├── SectionHeader ("N화 연재 중")
├── NextReleaseCard (다음 화 카운트다운)
├── NovelTOC
│   ├── ArcTab
│   └── ChapterList
│       ├── 공개 화 → Link + [NewBadge]
│       ├── 미공개 화 → 잠금 아이콘 + D-일
│       └── 미존재 화 → "연재 예정"
├── ContinueReading
└── 캐릭터 프로필 링크

/novel/[chapter] (Reader)
├── ChapterGate
│   ├── 미공개 → CountdownView
│   └── 공개 → ReaderContent (기존)
```

---

## 4. 스타일 가이드

### 4.1 카운트다운 UI
- 배경: `bg-(--color-bg-elevated)`
- 테두리: `border-(--color-border)`
- 타이머 숫자: `text-2xl font-bold tabular-nums`
- 단위 라벨: `text-xs text-(--color-text-muted)`
- 프로그레스: `bg-cognis/20` 트랙 + `bg-cognis` 바

### 4.2 NEW 배지
- 배경: `bg-ador/20`
- 텍스트: `text-ador text-[10px] font-bold`
- 모양: `rounded-full px-1.5 py-0.5`

### 4.3 잠금 챕터 (NovelTOC)
- 아이콘: 🔒 (기존 ConstellationMap 패턴 재활용)
- 텍스트: `text-(--color-text-muted) opacity-60`
- D-일 표시: `text-xs text-cognis`

---

## 5. 구현 순서

| 단계 | 파일 | 작업 |
|------|------|------|
| **1** | `src/content/novel/chapters/002~010.json` | 2~10화 소설 집필 (별도 세션, 모드 2) |
| **2** | `src/content/novel/release-schedule.json` | 스케줄 데이터 파일 생성 |
| **3** | `src/lib/schedule.ts` | 스케줄 유틸 함수 구현 |
| **4** | `src/lib/content.ts` | `getAvailableChapterNumbers()` 추가 |
| **5** | `src/components/novel/ChapterGate.tsx` | 챕터 게이트 컴포넌트 |
| **6** | `src/components/novel/NextReleaseCard.tsx` | 카운트다운 카드 |
| **7** | `src/components/novel/NewBadge.tsx` | NEW 배지 |
| **8** | `src/app/novel/[chapter]/page.tsx` | ChapterGate 연동 |
| **9** | `src/app/novel/page.tsx` | Hub에 NextReleaseCard + 연재 현황 |
| **10** | `src/components/novel/NovelTOC.tsx` | 잠금 화 표시 + NEW 배지 |
| **11** | 스크린샷 검증 | 다크/라이트/모바일 |

> 단계 1(소설 집필)은 별도 세션에서 모드 2로 진행.
> 단계 2~11은 웹 기능 구현으로 한 세션에서 순차 진행.

---

## 6. 검증 시나리오

| # | 시나리오 | 예상 결과 |
|---|---------|----------|
| V1 | 1~5화 접근 | 즉시 본문 표시 |
| V2 | 6화 접근 (공개 전) | 카운트다운 UI 표시, 본문 숨김 |
| V3 | 6화 접근 (공개 후) | 정상 본문 표시 + NEW 배지 |
| V4 | Novel Hub 방문 | 연재 현황 + 다음 화 카운트다운 카드 |
| V5 | NovelTOC 미공개 화 | 잠금 아이콘 + D-일 표시 |
| V6 | 모바일 카운트다운 | 레이아웃 정상, 터치 타겟 확보 |
| V7 | 라이트 모드 전체 | 카운트다운/배지/잠금 스타일 정상 |
| V8 | 빌드 성공 | `next build` 에러 없음, static export 정상 |
