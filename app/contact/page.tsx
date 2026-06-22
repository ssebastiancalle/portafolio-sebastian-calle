"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";

const LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/ssebastiancalle/",                        sub: "@ssebastiancalle" },
  { label: "E-mail",    href: "mailto:hello@sebastiancalle.com",                                   sub: "hello@sebastiancalle.com" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/ssebastiancalle/",                      sub: "ssebastiancalle" },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center px-6 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
        <div className="w-full">
          <div className="flex flex-col w-full max-w-2xl mx-auto">
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-mono text-2xl md:text-3xl tracking-tighter uppercase font-bold mb-3" style={{ color: "var(--text)" }}>
                Ready to book a session?
              </h1>
              <p className="font-mono text-[11px] tracking-[0.15em]" style={{ color: "var(--text-4)" }}>
                Get in touch via email or social media to discuss bookings, projects, and availability.
              </p>
            </motion.div>
              {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative py-5 w-full flex items-center justify-between gap-[2cm] transition-colors duration-300"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Hover gradient overlay */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(to right, var(--bg) 0%, transparent 20%, transparent 80%, var(--bg) 100%)" }}
                />
                <span
                  className="relative font-mono text-2xl md:text-4xl tracking-tighter uppercase font-bold transition-all duration-300 inline-block group-hover:opacity-50"
                  style={{ color: "var(--text)" }}
                >
                  {link.label}
                </span>
                <span className="relative font-mono text-[11px] tracking-[0.2em]" style={{ color: "var(--text-4)" }}>
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
