"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "ABOUT",     href: "/about"     },
  { label: "CONTACT",   href: "/contact"   },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md${pathname !== "/" ? " border-b" : ""}`}
        style={{
          background: "rgba(var(--header-bg), 0.75)",
          borderColor: "rgba(var(--header-border), 0.06)",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {pathname === "/" ? (
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-widest uppercase text-white"
                  style={{ fontSize: "clamp(1rem, 3vw, 1.75rem)", fontFamily: "var(--font-playfair), serif" }}>
              Sebastian Calle
            </span>
            <span className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: "clamp(0.65rem, 1vw, 0.75rem)", color: "var(--text)" }}>
              Photographer &amp; Retoucher
            </span>
          </div>
        ) : (
          <Link
            href="/"
            className="text-xs md:text-sm tracking-widest text-white uppercase hover:text-white/70 transition-colors whitespace-nowrap"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            SEBASTIAN CALLE
          </Link>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-sm tracking-widest uppercase transition-colors duration-200 relative"
                style={{ color: active ? "var(--text)" : "var(--text-3)" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
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

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="transition-colors touch-manipulation"
            style={{
              color: "var(--text)",
              minWidth: 44,
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center px-10 md:hidden"
            style={{ background: "rgba(var(--header-bg), 0.97)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col gap-6">
              {NAV.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-mono text-4xl tracking-tighter uppercase font-bold transition-colors block"
                      style={{
                        color: active
                          ? "var(--text)"
                          : "rgba(var(--header-border), 0.45)",
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <p className="absolute bottom-10 left-10 font-mono text-[9px] tracking-[0.3em] uppercase"
               style={{ color: "rgba(var(--header-border), 0.15)" }}>
              SEBASTIAN CALLE
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
