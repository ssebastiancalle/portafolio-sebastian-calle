"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const links = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
  { label: "sebastiancalle@gmail.com", href: "mailto:sebastiancalle@gmail.com" },
  { label: "Buenos Aires, AR", href: "#" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="px-8 py-16 border-t border-[#111]">
      <motion.div
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-[#333] uppercase mb-1">
            Sebastian Calle
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#2a2a2a] uppercase">
            © 2026 All rights reserved
          </p>
        </div>

        <nav className="flex flex-col md:flex-row gap-4 md:gap-10">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.2em] text-[#444] uppercase hover:text-white transition-colors duration-200"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </motion.div>
    </footer>
  );
}
