"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-8 py-32 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] tracking-[0.35em] text-[#444] font-mono uppercase mb-10">
          about
        </p>
        <p className="font-mono text-[clamp(1.1rem,2.2vw,1.6rem)] leading-relaxed text-[#888] max-w-2xl">
          We create photography that transforms{" "}
          <span className="text-white">moments</span> into timeless visual{" "}
          <span className="text-white">narratives.</span>
        </p>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { n: "12+", label: "Years" },
            { n: "800+", label: "Projects" },
            { n: "40+", label: "Countries" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-3xl text-white mb-1">{stat.n}</p>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#444] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
