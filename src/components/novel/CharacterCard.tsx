"use client";

import Image from "next/image";
import { ChromaDisplay } from "./ChromaDisplay";

const CHARACTER_IMAGES: Record<string, string> = {
  kai: "/images/characters/kai.webp",
  coda: "/images/characters/coda.webp",
  nix: "/images/characters/nix.webp",
  ray: "/images/characters/ray.webp",
};

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    quote: string;
    race: string;
    chromaValues: Record<string, number> & { total: number };
    tier: string;
    iromon: string;
    role: string;
    personality: string;
    partyRole: string;
  };
}

export function CharacterCard({ character }: CharacterCardProps) {
  const imageSrc = CHARACTER_IMAGES[character.id];

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-bg-elevated) overflow-hidden transition-colors hover:border-(--color-border-hover)">
      {/* Character portrait */}
      {imageSrc && (
        <div className="relative h-56 w-full overflow-hidden sm:h-64">
          <Image
            src={imageSrc}
            alt={character.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 50vw"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-(--color-bg-elevated) via-transparent to-transparent" />
          {/* Name overlay */}
          <div className="absolute bottom-3 left-4">
            <h2 className="text-2xl font-bold text-(--color-text-primary) drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {character.name}
            </h2>
            <p className="text-xs text-(--color-text-secondary) drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {character.race}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Name (only if no image) */}
        {!imageSrc && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{character.name}</h2>
            <p className="text-xs text-(--color-text-muted)">{character.race}</p>
          </div>
        )}

        <blockquote className="mb-4 border-l-2 border-(--color-border-hover) pl-3 text-sm italic text-(--color-text-secondary) font-(family-name:--font-novel)">
          &ldquo;{character.quote}&rdquo;
        </blockquote>

        <div className="mb-4">
          <ChromaDisplay values={character.chromaValues} />
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-(--color-text-muted)">계층: </span>
            <span className="text-(--color-text-secondary)">{character.tier}</span>
          </p>
          <p>
            <span className="text-(--color-text-muted)">역할: </span>
            <span className="text-(--color-text-secondary)">{character.role}</span>
          </p>
          <p>
            <span className="text-(--color-text-muted)">성격: </span>
            <span className="text-(--color-text-secondary)">{character.personality}</span>
          </p>
          <p>
            <span className="text-(--color-text-muted)">파티: </span>
            <span className="text-(--color-text-secondary)">{character.partyRole}</span>
          </p>
        </div>

        <div className="mt-4 rounded-lg bg-(--color-bg-surface) p-3">
          <p className="text-xs text-(--color-text-muted)">이로몬</p>
          <p className="mt-1 text-sm text-(--color-text-secondary) leading-relaxed">
            {character.iromon}
          </p>
        </div>
      </div>
    </div>
  );
}
