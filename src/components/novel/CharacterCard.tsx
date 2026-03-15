import { ChromaDisplay } from "./ChromaDisplay";

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
  return (
    <div className="rounded-2xl border border-white/5 bg-(--color-deep-card) p-6 transition-colors hover:border-white/10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{character.name}</h2>
        <p className="text-xs text-(--color-text-muted)">{character.race}</p>
      </div>

      <blockquote className="mb-4 border-l-2 border-white/10 pl-3 text-sm italic text-(--color-text-secondary) font-(family-name:--font-novel)">
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

      <div className="mt-4 rounded-lg bg-white/[0.03] p-3">
        <p className="text-xs text-(--color-text-muted)">이로몬</p>
        <p className="mt-1 text-sm text-(--color-text-secondary) leading-relaxed">
          {character.iromon}
        </p>
      </div>
    </div>
  );
}
