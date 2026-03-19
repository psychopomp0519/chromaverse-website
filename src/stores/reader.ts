import { create } from "zustand";

export type ReaderTheme = "dark" | "light" | "sepia";
export type ReadingMode = "scroll" | "page";

const LINE_HEIGHTS = [1.5, 1.8, 2.2] as const;

interface ReaderStore {
  fontSize: number;
  lineHeight: number;
  readerTheme: ReaderTheme;
  readingMode: ReadingMode;
  scrollPosition: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  cycleLineHeight: () => void;
  setReaderTheme: (theme: ReaderTheme) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setScrollPosition: (pos: number) => void;
}

export const useReaderStore = create<ReaderStore>((set) => ({
  fontSize: 18,
  lineHeight: 1.8,
  readerTheme: "dark",
  readingMode: "scroll",
  scrollPosition: 0,
  setFontSize: (size) => set({ fontSize: Math.min(28, Math.max(14, size)) }),
  increaseFontSize: () =>
    set((state) => ({ fontSize: Math.min(28, state.fontSize + 2) })),
  decreaseFontSize: () =>
    set((state) => ({ fontSize: Math.max(14, state.fontSize - 2) })),
  cycleLineHeight: () =>
    set((state) => {
      const idx = LINE_HEIGHTS.indexOf(state.lineHeight as typeof LINE_HEIGHTS[number]);
      const next = LINE_HEIGHTS[(idx + 1) % LINE_HEIGHTS.length];
      return { lineHeight: next };
    }),
  setReaderTheme: (theme) => set({ readerTheme: theme }),
  setReadingMode: (mode) => set({ readingMode: mode }),
  setScrollPosition: (pos) => set({ scrollPosition: pos }),
}));
