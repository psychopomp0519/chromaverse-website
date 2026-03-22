"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex items-center gap-1.5">
        <Link
          href="/profile"
          className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs text-(--color-text-secondary) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
        >
          프로필
        </Link>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.refresh();
          }}
          className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs text-(--color-text-secondary) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="rounded-lg border border-(--color-border) px-3 py-1.5 text-xs text-(--color-text-secondary) transition-colors hover:border-(--color-border-hover) hover:text-(--color-text-primary)"
    >
      로그인
    </Link>
  );
}
