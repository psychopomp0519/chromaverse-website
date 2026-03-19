import { create } from "zustand";

type ThemeMode = "dark" | "light";

interface ThemeStore {
  /** Whether the theme transition overlay is active */
  transitioning: boolean;
  /** The target theme during transition */
  transitionTarget: ThemeMode | null;
  /** Preferred theme (persisted via next-themes, this is a mirror) */
  preferredTheme: ThemeMode;
  setTransitioning: (v: boolean, target?: ThemeMode) => void;
  setPreferredTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  transitioning: false,
  transitionTarget: null,
  preferredTheme: "dark",
  setTransitioning: (v, target) =>
    set({ transitioning: v, transitionTarget: target ?? null }),
  setPreferredTheme: (theme) => set({ preferredTheme: theme }),
}));
