import { create } from "zustand";

type Theme = {
  theme: string;
  setTheme: (data: string) => void;
};

export const useThemeStore = create<Theme>((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",
  setTheme: (theme: string) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
