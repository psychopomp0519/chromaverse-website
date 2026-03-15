"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import glossary from "@/content/world/glossary.json";

// Module-level lookup maps for O(1) access instead of O(n) .find() per render
const glossaryByTerm = new Map<string, (typeof glossary)[number]>();
const glossaryById = new Map<string, (typeof glossary)[number]>();
for (const entry of glossary) {
  glossaryByTerm.set(entry.term, entry);
  glossaryById.set(entry.id, entry);
}

function lookupEntry(term: string) {
  return glossaryByTerm.get(term) ?? glossaryById.get(term);
}

interface GlossaryPopupProps {
  term: string;
  children: React.ReactNode;
}

export function GlossaryPopup({ term, children }: GlossaryPopupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const entry = lookupEntry(term);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!entry) return <>{children}</>;

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="border-b border-dotted border-cognis/40 text-cognis-light transition-colors hover:border-cognis"
      >
        {children}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-(--color-border)/30 bg-(--color-deep-card) p-4 shadow-xl">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
            <span className="font-semibold text-(--color-text-primary)">{entry.term}</span>
            <span className="text-xs text-(--color-text-muted)">{entry.kanji}</span>
            <span className="rounded-full bg-(--color-border)/10 px-2 py-0.5 text-xs text-(--color-text-muted)">
              {entry.category}
            </span>
          </span>
          <span className="block text-sm text-(--color-text-secondary) leading-relaxed">
            {entry.shortDesc}
          </span>
          <span className="mt-2 block text-xs text-(--color-text-muted) leading-relaxed">
            {entry.fullDesc}
          </span>
          <Link
            href="/world/glossary"
            className="mt-3 block text-xs text-cognis-light hover:underline"
            onClick={() => setOpen(false)}
          >
            용어 사전에서 보기 &rarr;
          </Link>
        </span>
      )}
    </span>
  );
}

/**
 * Pre-computed glossary highlight context.
 * Call buildGlossaryContext once, pass result to highlightGlossaryTerms per paragraph.
 */
export interface GlossaryContext {
  pattern: RegExp;
  termMap: Map<string, (typeof glossary)[number]>;
}

export function buildGlossaryContext(terms: string[]): GlossaryContext | null {
  if (!terms.length) return null;

  const entries: (typeof glossary)[number][] = [];
  for (const t of terms) {
    const entry = lookupEntry(t);
    if (entry) entries.push(entry);
  }
  if (!entries.length) return null;

  const termMap = new Map<string, (typeof glossary)[number]>();
  const termNames: string[] = [];
  for (const e of entries) {
    termMap.set(e.term, e);
    termNames.push(escapeRegex(e.term));
  }

  const pattern = new RegExp(`(${termNames.join("|")})`, "g");
  return { pattern, termMap };
}

export function highlightGlossaryTerms(
  text: string,
  ctx: GlossaryContext | null
): React.ReactNode[] {
  if (!ctx) return [text];

  const parts = text.split(ctx.pattern);
  return parts.map((part, i) => {
    const entry = ctx.termMap.get(part);
    if (entry) {
      return (
        <GlossaryPopup key={`${entry.id}-${i}`} term={entry.id}>
          {part}
        </GlossaryPopup>
      );
    }
    return part;
  });
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
