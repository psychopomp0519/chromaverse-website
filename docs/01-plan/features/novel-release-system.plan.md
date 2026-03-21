# Novel Release System — Plan

> **Feature**: novel-release-system
> **Date**: 2026-03-21
> **Level**: Dynamic

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 현재 1화만 게시. 수동 배포 외 연재 관리 수단 없음 |
| **Solution** | 2~10화 신규 집필 + 연재 스케줄 시스템 + 웹사이트 신규 기능 추가 |
| **Function/UX** | 스케줄 기반 자동 공개, 다음 화 카운트다운, 연재 현황 대시보드 |
| **Core Value** | "정해진 날, 새로운 이야기가 열린다" — 독자 기대감과 재방문 유도 |

---

## 1. 배경

- 소설 700화 중 웹에는 1화만 게시 (archive-v1 원고는 별도 보관, 미사용)
- 2~10화를 새로 집필하여 chapters/ JSON으로 직접 생성
- 현재 시스템: JSON 파일이 `chapters/`에 존재하면 즉시 공개
- 연재 스케줄, 공개 예정 안내, 다음 화 대기 등의 기능 없음
- Cloudflare Pages (static export) 환경 — 서버 사이드 제어 불가

## 2. 목표

### 2.1 핵심 기능 (Must Have)
1. **2~10화 신규 집필**: 플롯 기반으로 소설 원고 작성 → chapters/ JSON 직접 생성
2. **연재 스케줄 시스템**: 챕터별 공개일 설정, 공개일 이전 접근 차단
3. **다음 화 카운트다운**: 미공개 화의 예정 일시 표시
4. **연재 현황 표시**: Novel Hub에 "N화 연재 중 / 다음 화 D-일" 표시

### 2.2 추가 기능 (Should Have)
5. **초반 일괄 공개**: 1~5화 즉시 공개, 6화부터 스케줄 적용
6. **새 화 알림 배지**: 최근 공개된 화에 "NEW" 배지
7. **이전 화 요약**: 새 화 진입 시 이전 화 한줄 요약 표시

### 2.3 향후 고려 (Nice to Have)
8. 이메일/푸시 알림 (Supabase Edge Function)
9. 독자 코멘트 활성화 시점 연동

## 3. 기술 설계 방향

### 3.1 스케줄 구현 방식

**선택: 클라이언트 사이드 날짜 체크**

Static export 환경이므로 서버에서 동적 제어가 불가능하다. 대신:

1. **모든 챕터 JSON을 빌드에 포함** (2~11화 모두 `chapters/`에 배치)
2. **release-schedule.json** 파일에 챕터별 공개일 정의
3. `content.ts`의 `getAllChapterNumbers()`에서 공개일 필터링
4. 클라이언트에서도 이중 체크 — 미공개 화 접근 시 카운트다운 페이지 표시

```json
// src/content/novel/release-schedule.json
{
  "schedule": [
    { "chapter": 1, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 2, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 3, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 4, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 5, "releaseDate": "2026-03-01T00:00:00+09:00" },
    { "chapter": 6, "releaseDate": "2026-04-01T00:00:00+09:00" },
    { "chapter": 7, "releaseDate": "2026-04-04T00:00:00+09:00" },
    { "chapter": 8, "releaseDate": "2026-04-07T00:00:00+09:00" }
  ],
  "defaultInterval": "3days",
  "timezone": "Asia/Seoul"
}
```

**장점**: 빌드 한 번으로 미래 챕터까지 포함 가능, 재배포 불필요
**한계**: 클라이언트 시간 조작으로 우회 가능 (허용 가능한 수준)

### 3.2 영향받는 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/content/novel/release-schedule.json` | 신규 — 연재 스케줄 정의 |
| `src/lib/content.ts` | 스케줄 기반 필터링 추가 |
| `src/app/novel/[chapter]/page.tsx` | 미공개 화 접근 시 카운트다운 표시 |
| `src/app/novel/page.tsx` | 연재 현황 + 다음 화 정보 전달 |
| `src/components/novel/NovelTOC.tsx` | 예정 화 표시 + NEW 배지 |
| `src/components/novel/CountdownCard.tsx` | 신규 — 다음 화 카운트다운 위젯 |
| `src/components/novel/NewBadge.tsx` | 신규 — NEW 배지 컴포넌트 |
| `src/content/novel/chapters/002~010.json` | 신규 — 플롯 기반 직접 집필 |

### 3.3 Static Export 호환성

- `generateStaticParams`는 모든 챕터(공개+미공개)에 대해 페이지 생성
- 미공개 챕터 페이지는 빌드 시 생성되지만, 클라이언트에서 날짜 체크 후 카운트다운 UI 표시
- `getAllChapterNumbers()`는 빌드 타임에는 전체 반환, 클라이언트에서는 공개분만 필터
- 이를 위해 별도 클라이언트 유틸 `getReleasedChapters()` 추가

## 4. 구현 순서

1. **2~10화 소설 집필** (모드 2 — 플롯 참조, 화별 7000~9000자)
2. `release-schedule.json` 생성 (1~5화 즉시, 6~10화 스케줄)
3. `content.ts` 스케줄 로직 추가 + 클라이언트 유틸
4. 챕터 페이지 미공개 화 카운트다운 UI
5. Novel Hub 연재 현황 + 다음 화 정보
6. NovelTOC 예정 화 표시 + NEW 배지
7. 스크린샷 검증

## 5. 성공 기준

- [ ] 2~10화 JSON 파일 집필 완료 (각 7000~9000자)
- [ ] 1~5화 즉시 접근 가능
- [ ] 6화+ 접근 시 카운트다운 페이지 표시
- [ ] Novel Hub에 연재 현황 + 다음 화 D-일 표시
- [ ] 최근 공개 화에 NEW 배지
- [ ] 빌드 성공 (static export 호환)
- [ ] 다크/라이트/모바일 검증 통과
