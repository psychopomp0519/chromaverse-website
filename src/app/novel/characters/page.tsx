import type { Metadata } from "next";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CharacterCard } from "@/components/novel/CharacterCard";
import { SpoilerGuard } from "@/components/novel/SpoilerGuard";
import kai from "@/content/characters/kai.json";
import coda from "@/content/characters/coda.json";
import nix from "@/content/characters/nix.json";
import ray from "@/content/characters/ray.json";
import flint from "@/content/characters/flint.json";
import saila from "@/content/characters/saila.json";
import bigil from "@/content/characters/bigil.json";
import gilt from "@/content/characters/gilt.json";
import dusk from "@/content/characters/dusk.json";
import nil from "@/content/characters/nil.json";
import blanc from "@/content/characters/blanc.json";
import umbra from "@/content/characters/umbra.json";
import prism from "@/content/characters/prism.json";

export const metadata: Metadata = {
  title: "캐릭터 프로필",
  description: "노이즈 파티 4인 + 주요 조연 9인.",
};

const mainCharacters = [kai, coda, nix, ray];
const supportingCharacters = [flint, saila, bigil, gilt, dusk, nil, blanc, umbra, prism];

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeader
        title="캐릭터 프로필"
        subtitle="노이즈 파티"
        description="세계를 바꾼 네 사람. 기록관, 조율자, 경계의 존재, 빈 설계도."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {mainCharacters.map((char) => {
          const content = <CharacterCard key={char.id} character={char} />;
          if ("spoilerAfter" in char && char.spoilerAfter) {
            return (
              <SpoilerGuard
                key={char.id}
                visibleAfter={char.spoilerAfter}
                placeholder={`이 캐릭터는 소설 ${char.spoilerAfter}화 이후에 공개됩니다.`}
              >
                {content}
              </SpoilerGuard>
            );
          }
          return content;
        })}
      </div>

      {/* 조연 */}
      <div className="mt-16">
        <h2 className="mb-2 text-2xl font-bold">주요 조연</h2>
        <p className="mb-8 text-sm text-(--color-text-secondary)">
          노이즈의 여정에서 만나는 동맹과 적대자들.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {supportingCharacters.map((char) => {
            const content = <CharacterCard key={char.id} character={char} />;
            if ("spoilerAfter" in char && char.spoilerAfter) {
              return (
                <SpoilerGuard
                  key={char.id}
                  visibleAfter={char.spoilerAfter}
                  placeholder={`이 캐릭터는 소설 ${char.spoilerAfter}화 이후에 공개됩니다.`}
                >
                  {content}
                </SpoilerGuard>
              );
            }
            return content;
          })}
        </div>
      </div>
    </div>
  );
}
