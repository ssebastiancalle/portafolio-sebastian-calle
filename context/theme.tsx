"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  isAnimating: boolean;
  wipeColor: string;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  toggle: () => {},
  isAnimating: false,
  wipeColor: "#F0EBE3",
});

export const useTheme = () => useContext(ThemeContext);

const WIPE_MS = 700;
const SWITCH_AT = 340; // theme switches at ~half the animation

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme]           = useState<Theme>("dark");
  const [isAnimating, setAnimating] = useState(false);
  const [wipeColor, setWipeColor]   = useState("#F0EBE3");
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => {
    if (isAnimating) return;

    const next    = theme === "dark" ? "light" : "dark";
    const toColor = next === "light" ? "#F0EBE3" : "#000000";

    setWipeColor(toColor);
    setAnimating(true);

    switchTimer.current = setTimeout(() => setTheme(next), SWITCH_AT);
    endTimer.current    = setTimeout(() => setAnimating(false), WIPE_MS + 80);
  };

  useEffect(() => () => {
    if (switchTimer.current) clearTimeout(switchTimer.current);
    if (endTimer.current)    clearTimeout(endTimer.current);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isAnimating, wipeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
