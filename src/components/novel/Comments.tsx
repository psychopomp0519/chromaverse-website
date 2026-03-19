"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getComments,
  addComment,
  deleteComment,
  type Comment,
} from "@/lib/comments";
import { createClient } from "@/lib/supabase/client";

interface CommentsProps {
  chapter: number;
}

export function Comments({ chapter }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadComments = useCallback(async (reset = true) => {
    const p = reset ? 0 : page;
    const result = await getComments(chapter, p);
    if (reset) {
      setComments(result.comments);
      setPage(0);
    } else {
      setComments((prev) => [...prev, ...result.comments]);
    }
    setHasMore(result.hasMore);
    setLoading(false);
    setLoadingMore(false);
  }, [chapter, page]);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      await loadComments();
    }
    init();
  }, [loadComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setError(null);

    const result = await addComment(chapter, content);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setContent("");
    setSubmitting(false);
    await loadComments();
  }

  async function handleDelete(commentId: string) {
    const result = await deleteComment(commentId);
    if (result.error) {
      setError(result.error);
      return;
    }
    await loadComments();
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function maskEmail(email: string | undefined) {
    if (!email) return "익명";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const masked = local.length > 2 ? local.slice(0, 2) + "***" : local + "***";
    return `${masked}@${domain}`;
  }

  return (
    <div className="mt-16 border-t border-(--color-border) pt-8">
      <h3 className="mb-6 text-lg font-bold">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* 댓글 입력 */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="소설에 대한 감상을 남겨주세요..."
            maxLength={1000}
            rows={3}
            className="w-full resize-none rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-3 text-sm text-(--color-text-primary) outline-none transition-colors placeholder:text-(--color-text-muted) focus:border-(--color-border-active)"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-(--color-text-muted)">
              {content.length}/1000
            </span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-lg bg-(--color-bg-elevated) px-4 py-1.5 text-sm font-medium transition-colors hover:bg-(--color-border-active) disabled:opacity-40"
            >
              {submitting ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </form>
      ) : (
        <div className="mb-8 rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-3 text-center text-sm text-(--color-text-muted)">
          <a href="/auth/login" className="underline hover:text-(--color-text-primary)">
            로그인
          </a>
          하면 댓글을 남길 수 있습니다.
        </div>
      )}

      {/* 댓글 목록 */}
      {loading ? (
        <p className="text-sm text-(--color-text-muted)">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-(--color-text-muted)">
          아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-3"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-(--color-text-muted)">
                <span>{maskEmail(comment.email)}</span>
                <div className="flex items-center gap-3">
                  <span>{formatDate(comment.created_at)}</span>
                  {userId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-400/60 transition-colors hover:text-red-400"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-(--color-text-secondary)">
                {comment.content}
              </p>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={async () => {
                setLoadingMore(true);
                setPage((p) => p + 1);
                const result = await getComments(chapter, page + 1);
                setComments((prev) => [...prev, ...result.comments]);
                setHasMore(result.hasMore);
                setLoadingMore(false);
              }}
              disabled={loadingMore}
              className="w-full rounded-lg border border-(--color-border) py-2 text-sm text-(--color-text-muted) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
            >
              {loadingMore ? "불러오는 중..." : "댓글 더 보기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
