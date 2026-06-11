"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";

const LINKS = [
  { label: "Instagram", href: "https://instagram.com/ssebastiancalle", sub: "@ssebastiancalle" },
  { label: "Behance",   href: "https://behance.net/sebastiancalle",    sub: "behance.net/sebastiancalle" },
  { label: "E-mail",    href: "mailto:sebastiancalle@gmail.com",       sub: "sebastiancalle@gmail.com" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black flex items-center px-6 md:px-10">
        <div className="w-full max-w-lg">
          <motion.p
            className="font-mono text-[10px] tracking-[0.35em] text-[#444] uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Contact
          </motion.p>

          <div className="flex flex-col">
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between py-6 border-b border-[#111] hover:border-white/10 transition-colors duration-300"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-2xl md:text-4xl tracking-tighter text-white uppercase font-bold group-hover:translate-x-2 transition-transform duration-300 inline-block">
                  {link.label}
                </span>
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#333] uppercase group-hover:text-[#666] transition-colors duration-300">
                  {link.sub}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
