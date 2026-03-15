import { createClient } from "@/lib/supabase/client";

export interface Comment {
  id: string;
  user_id: string;
  chapter: number;
  content: string;
  created_at: string;
  email?: string;
}

const PAGE_SIZE = 20;

export async function getComments(
  chapter: number,
  page: number = 0
): Promise<{ comments: Comment[]; hasMore: boolean }> {
  const supabase = createClient();

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE;

  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("chapter", chapter)
    .order("created_at", { ascending: false })
    .range(from, to);

  const comments = data?.slice(0, PAGE_SIZE) ?? [];
  const hasMore = (data?.length ?? 0) > PAGE_SIZE;

  return { comments, hasMore };
}

export async function addComment(
  chapter: number,
  content: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const trimmed = content.trim();
  if (!trimmed) return { error: "댓글 내용을 입력해주세요." };
  if (trimmed.length > 1000)
    return { error: "댓글은 1000자 이내로 작성해주세요." };

  const { error } = await supabase
    .from("comments")
    .insert({ user_id: user.id, chapter, content: trimmed });

  if (error) return { error: error.message };
  return {};
}

export async function deleteComment(
  commentId: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return {};
}
