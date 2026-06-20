"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";

const LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/ssebastiancalle/", sub: "@ssebastiancalle" },
  { label: "E-mail",    href: "mailto:hello@sebastiancalle.com",            sub: "hello@sebastiancalle.com" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center px-6 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
        <div className="w-full">
          <motion.p
            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-8"
            style={{ color: "var(--text-4)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Contact
          </motion.p>

          <div className="flex flex-col items-center">
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group py-3 border-b w-full text-center transition-colors duration-300"
                style={{ borderColor: "var(--border)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="font-mono text-2xl md:text-4xl tracking-tighter uppercase font-bold group-hover:tracking-widest transition-all duration-300 inline-block"
                  style={{ color: "var(--text)" }}
                >
                  {link.label}
                </span>
                <p className="font-mono text-[11px] tracking-[0.2em] mt-1" style={{ color: "var(--text-4)" }}>
                  {link.sub}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
