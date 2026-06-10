"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme";

export default function ThemeToggle() {
  const { theme, toggle, isAnimating, wipeColor } = useTheme();

  return (
    <>
      {/* Half black / half white circle */}
      <button
        onClick={toggle}
        disabled={isAnimating}
        aria-label="Toggle light/dark mode"
        className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(to right, #000 50%, #fff 50%)"
              : "linear-gradient(to right, #fff 50%, #000 50%)",
          border: "1px solid rgba(128,128,128,0.35)",
          outline: "none",
        }}
      />

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
