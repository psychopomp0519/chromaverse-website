-- reading_progress 테이블 생성
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter integer NOT NULL,
  read_at timestamptz NOT NULL DEFAULT now(),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  scroll_position integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, chapter)
);

-- RLS 활성화
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

-- 자기 데이터만 읽기
CREATE POLICY "Users can read own reading progress"
  ON public.reading_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- 자기 데이터만 쓰기
CREATE POLICY "Users can insert own reading progress"
  ON public.reading_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 자기 데이터만 수정
CREATE POLICY "Users can update own reading progress"
  ON public.reading_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_chapter ON public.reading_progress(user_id, chapter);
