"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col items-center justify-center px-4">
      <h1 className="mb-8 text-2xl font-bold">회원가입</h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-(--color-text-muted)">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-2.5 text-sm text-(--color-text-primary) outline-none transition-colors focus:border-(--color-border-active)"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-(--color-text-muted)">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-(--color-border) bg-(--color-bg-surface) px-4 py-2.5 text-sm text-(--color-text-primary) outline-none transition-colors focus:border-(--color-border-active)"
            placeholder="6자 이상"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-r from-ador/20 via-vitalis/20 to-cognis/20 px-4 py-2.5 text-sm font-semibold transition-all hover:from-ador/30 hover:via-vitalis/30 hover:to-cognis/30 disabled:opacity-50"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-sm text-(--color-text-muted)">
        이미 계정이 있으신가요?{" "}
        <Link href={`/auth/login${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`} className="text-(--color-text-primary) underline">
          로그인
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><p className="text-sm text-(--color-text-muted)">로딩 중...</p></div>}>
      <SignUpForm />
    </Suspense>
  );
}
