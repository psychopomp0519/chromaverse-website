import glossary from "@/content/world/glossary.json";
import type { GlossaryEntry } from "@/types/world";

const glossaryByTerm = new Map<string, GlossaryEntry>();
const glossaryById = new Map<string, GlossaryEntry>();

for (const entry of glossary as GlossaryEntry[]) {
  glossaryByTerm.set(entry.term, entry);
  glossaryById.set(entry.id, entry);
}

export function lookupGlossaryEntry(termOrId: string): GlossaryEntry | undefined {
  return glossaryByTerm.get(termOrId) ?? glossaryById.get(termOrId);
}

export function getGlossaryEntries(): GlossaryEntry[] {
  return glossary as GlossaryEntry[];
}
