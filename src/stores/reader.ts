import { create } from "zustand";

export type ReaderTheme = "dark" | "light" | "sepia";

interface ReaderStore {
  fontSize: number;
  readerTheme: ReaderTheme;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setReaderTheme: (theme: ReaderTheme) => void;
}

export const useReaderStore = create<ReaderStore>((set) => ({
  fontSize: 18,
  readerTheme: "dark",
  setFontSize: (size) => set({ fontSize: Math.min(28, Math.max(14, size)) }),
  increaseFontSize: () =>
    set((state) => ({ fontSize: Math.min(28, state.fontSize + 2) })),
  decreaseFontSize: () =>
    set((state) => ({ fontSize: Math.max(14, state.fontSize - 2) })),
  setReaderTheme: (theme) => set({ readerTheme: theme }),
}));
