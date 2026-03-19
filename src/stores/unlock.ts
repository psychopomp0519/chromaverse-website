import { create } from "zustand";
import { getUnlockedNodes, getNextUnlock } from "@/lib/content-unlock";

interface UnlockStore {
  completedChapters: number[];
  unlockedNodes: string[];
  isLoggedIn: boolean;
  nextUnlock: { chapter: number; nodes: string[] } | null;
  setCompletedChapters: (chapters: number[]) => void;
  setLoggedIn: (v: boolean) => void;
  markChapterComplete: (chapter: number) => string[]; // 새로 해제된 노드 반환
}

export const useUnlockStore = create<UnlockStore>((set, get) => ({
  completedChapters: [],
  unlockedNodes: getUnlockedNodes([]),
  isLoggedIn: false,
  nextUnlock: getNextUnlock([]),

  setCompletedChapters: (chapters) =>
    set({
      completedChapters: chapters,
      unlockedNodes: getUnlockedNodes(chapters),
      nextUnlock: getNextUnlock(chapters),
    }),

  setLoggedIn: (v) => set({ isLoggedIn: v }),

  markChapterComplete: (chapter) => {
    const prev = get().unlockedNodes;
    const newCompleted = [...new Set([...get().completedChapters, chapter])];
    const newUnlocked = getUnlockedNodes(newCompleted);
    const newlyUnlocked = newUnlocked.filter((n) => !prev.includes(n));

    set({
      completedChapters: newCompleted,
      unlockedNodes: newUnlocked,
      nextUnlock: getNextUnlock(newCompleted),
    });

    return newlyUnlocked;
  },
}));
