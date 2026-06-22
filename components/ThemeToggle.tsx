"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme";

export default function ThemeToggle() {
  const { theme, toggle, isAnimating, wipeColor } = useTheme();

  return (
    <>
      <button
        onClick={toggle}
        disabled={isAnimating}
        aria-label="Toggle light/dark mode"
        className="relative w-7 h-7 flex items-center justify-center flex-shrink-0 cursor-pointer transition-opacity hover:opacity-60"
        style={{ outline: "none", color: "var(--text)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.svg
              key="moon"
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18" viewBox="0 0 24 24"
              fill="currentColor"
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18" viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      {/* Diagonal wipe overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="wipe"
            className="fixed top-0 h-[120vh] pointer-events-none"
            style={{
              width: "180vw",
              left: "-40vw",
              top: "-10vh",
              zIndex: 9997,
              background: wipeColor,
              skewX: "-10deg",
              originX: 0.5,
              originY: 0.5,
            }}
            initial={{ x: "-110%" }}
            animate={{ x: "110%" }}
            transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
