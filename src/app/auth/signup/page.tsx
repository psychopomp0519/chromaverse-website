"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "../actions";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col items-center justify-center px-4">
      <h1 className="mb-8 text-2xl font-bold">회원가입</h1>

      <form action={handleSubmit} className="flex w-full flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-(--color-text-muted)">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-(--color-text-primary) outline-none transition-colors focus:border-white/20"
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
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-(--color-text-primary) outline-none transition-colors focus:border-white/20"
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
        <Link href="/auth/login" className="text-(--color-text-primary) underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
