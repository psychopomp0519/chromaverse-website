# Chromaverse Phase 4-B~D Planning Document

> **Summary**: 이어읽기 + 세계관 잠금해제 + 댓글 시스템 구현
>
> **Project**: Chromaverse
> **Version**: 1.0.0
> **Author**: Claude + User
> **Date**: 2026-03-15
> **Status**: Approved

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 회원가입은 가능하지만 읽은 기록이 저장되지 않고, 세계관 페이지가 모든 사용자에게 동일하게 노출되며, 독자 간 소통 수단이 없음 |
| **Solution** | Supabase DB 기반 읽기 진행률 저장, 사용자별 세계관 잠금해제, 화별 댓글 시스템 구현 |
| **Function/UX Effect** | "이어읽기" 버튼으로 즉시 복귀, 소설을 읽을수록 세계관이 열리는 게이미피케이션, 화별 댓글로 독자 커뮤니티 형성 |
| **Core Value** | 독자의 읽기 여정을 개인화하여 재방문율과 몰입도를 극대화 |

---

## 1. Overview

### 1.1 Purpose

Phase 4-A(인증) 완료 후, 로그인한 사용자를 위한 핵심 기능 3종 구현.

### 1.2 Prerequisites

- ✅ Supabase Auth (이메일+비밀번호) 구현 완료
- ✅ `reading_progress` 테이블 존재 (user_id, chapter, read_at)
- ✅ `spoiler-map.json` 기반 스포일러 가드 작동 중

### 1.3 Implementation Order

반드시 **4-B → 4-C → 4-D** 순서 (이전 Phase의 데이터에 의존)

---

## 2. Scope

### 2.1 Phase 4-B: 이어읽기

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B1 | 소설 읽기 시 자동으로 `reading_progress`에 기록 | High |
| FR-B2 | 소설 허브에 "이어읽기" 버튼 (마지막 읽은 화의 다음 화로 이동) | High |
| FR-B3 | 목차에서 읽은 화 시각적 표시 (체크마크/진행률 바) | Medium |
| FR-B4 | 비로그인 사용자에게는 기존 동작 유지 (기능 숨김) | High |

### 2.2 Phase 4-C: 세계관 잠금해제

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C1 | 사용자의 최대 읽은 화수를 기준으로 세계관 스포일러 가드 동적 적용 | High |
| FR-C2 | 비로그인 사용자에게는 `currentMaxChapter`(=10) 기준 적용 유지 | High |
| FR-C3 | 세계관 페이지에 "N화까지 읽으면 잠금 해제" 안내 표시 | Medium |
| FR-C4 | 잠금 해제 진행률 시각화 (세계관 허브에 배지/프로그레스) | Low |

### 2.3 Phase 4-D: 댓글 시스템

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-D1 | 소설 각 화 하단에 댓글 목록 표시 | High |
| FR-D2 | 로그인 사용자만 댓글 작성 가능 | High |
| FR-D3 | 본인 댓글 삭제 가능 | Medium |
| FR-D4 | Supabase RLS로 권한 제어 | High |
| FR-D5 | 댓글 최신순 정렬, 페이지네이션 | Medium |

---

## 3. Technical Design

### 3.1 DB Schema

```sql
-- 이미 존재: reading_progress (user_id, chapter, read_at)
-- 추가 필요: comments 테이블

CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chapter INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS 정책
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- 누구나 읽기 가능
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
-- 로그인 사용자만 작성
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 본인만 삭제
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- reading_progress RLS 확인/추가
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rp_select" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rp_insert" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rp_update" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);
```

### 3.2 New Files

```
src/
├── app/
│   └── novel/
│       └── [chapter]/
│           └── page.tsx          # 댓글 섹션 추가
├── components/
│   ├── novel/
│   │   ├── ContinueReading.tsx   # 이어읽기 버튼
│   │   ├── ReadingProgress.tsx   # 읽은 화 표시
│   │   └── Comments.tsx          # 댓글 시스템
│   └── world/
│       └── UnlockBadge.tsx       # 잠금해제 배지
├── lib/
│   ├── reading.ts                # 읽기 진행률 CRUD
│   └── comments.ts               # 댓글 CRUD
```

### 3.3 Data Flow

```
이어읽기:
  User reads chapter → ReaderContent calls upsertProgress() → Supabase
  User visits /novel → getMaxReadChapter() → ContinueReading 버튼 표시

세계관 잠금해제:
  User visits /world/* → getUserMaxChapter() → SpoilerGuard에 전달
  비로그인 시 → spoiler-map.json의 currentMaxChapter(10) 사용

댓글:
  User visits /novel/[ch] → getComments(ch) → Comments 컴포넌트 렌더
  User submits → addComment() → Supabase → revalidate
```

---

## 4. Success Criteria

- [x] 이어읽기: 로그인 후 소설 읽으면 진행률 저장, "이어읽기" 버튼 작동
- [x] 잠금해제: 읽은 화수 기반으로 세계관 스포일러 동적 해제
- [x] 댓글: 로그인 사용자 댓글 작성/삭제, RLS 정상 작동
- [x] 빌드 에러 없음
- [x] 비로그인 사용자에게 기존 동작 유지

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-15 | Initial plan | Claude + User |
