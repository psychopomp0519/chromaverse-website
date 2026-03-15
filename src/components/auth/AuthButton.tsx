"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-(--color-text-secondary) transition-colors hover:border-white/20 hover:text-(--color-text-primary)"
        >
          로그아웃
        </button>
      </form>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-(--color-text-secondary) transition-colors hover:border-white/20 hover:text-(--color-text-primary)"
    >
      로그인
    </Link>
  );
}
