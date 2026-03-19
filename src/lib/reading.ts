import { createClient } from "@/lib/supabase/client";

export async function upsertReadingProgress(chapter: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("reading_progress")
    .upsert(
      { user_id: user.id, chapter, read_at: new Date().toISOString() },
      { onConflict: "user_id,chapter" }
    );
}

export async function getReadChapters(): Promise<number[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("reading_progress")
    .select("chapter")
    .eq("user_id", user.id)
    .order("chapter", { ascending: true });

  return data?.map((r) => r.chapter) ?? [];
}

export async function getMaxReadChapter(): Promise<number> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("reading_progress")
    .select("chapter")
    .eq("user_id", user.id)
    .order("chapter", { ascending: false })
    .limit(1);

  return data?.[0]?.chapter ?? 0;
}

export async function markChapterCompleted(chapter: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: user.id,
        chapter,
        read_at: new Date().toISOString(),
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter" }
    );
}

export async function getCompletedChapters(): Promise<number[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("reading_progress")
    .select("chapter")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("chapter", { ascending: true });

  return data?.map((r) => r.chapter) ?? [];
}

export async function getLastReadChapter(): Promise<{
  chapter: number;
  readAt: string;
} | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("reading_progress")
    .select("chapter, read_at")
    .eq("user_id", user.id)
    .order("read_at", { ascending: false })
    .limit(1);

  if (!data?.[0]) return null;
  return { chapter: data[0].chapter, readAt: data[0].read_at };
}

export async function saveScrollPosition(chapter: number, position: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("reading_progress")
    .upsert(
      {
        user_id: user.id,
        chapter,
        scroll_position: position,
        read_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter" }
    );
}

export async function getScrollPosition(chapter: number): Promise<number> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data } = await supabase
    .from("reading_progress")
    .select("scroll_position")
    .eq("user_id", user.id)
    .eq("chapter", chapter)
    .single();

  return data?.scroll_position ?? 0;
}
