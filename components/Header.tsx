"use client";

import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-5 backdrop-blur-md bg-black/60 border-b border-white/[0.04]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-[10px] md:text-xs tracking-widest text-white font-mono uppercase whitespace-nowrap">
        [ S. CALLE ]
      </span>

      <div className="flex items-center gap-3 md:gap-5">
        <span className="hidden md:inline text-xs tracking-widest text-[#555] font-mono uppercase whitespace-nowrap">
          [ 2026 PORTFOLIO ]
        </span>
        <span className="md:hidden text-[10px] tracking-widest text-[#555] font-mono uppercase">
          2026
        </span>
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
