"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "ABOUT",     href: "/about"     },
  { label: "CONTACT",   href: "/contact"   },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md bg-black/70 border-b border-white/[0.04]"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href="/" className="font-mono text-xs md:text-sm tracking-widest text-white uppercase hover:text-white/70 transition-colors whitespace-nowrap">
        SEBASTIAN CALLE
      </Link>

      <nav className="flex items-center gap-6 md:gap-10">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-[11px] md:text-xs tracking-widest uppercase transition-colors duration-200 relative ${
                active ? "text-white" : "text-[#555] hover:text-[#999]"
              }`}
            >
              {item.label}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-[2px] left-0 right-0 h-px bg-white"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </Link>
          );
        })}
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
