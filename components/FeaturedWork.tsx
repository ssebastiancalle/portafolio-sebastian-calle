"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { projects } from "@/data/projects";

export default function FeaturedWork() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="px-8 py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12"
      >
        <p className="text-[11px] tracking-[0.35em] text-[#444] font-mono uppercase">
          featured work
        </p>
        <p className="text-[10px] tracking-[0.2em] text-[#333] font-mono uppercase">
          selected projects
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111]">
        {projects.map((project, i) => (
          <motion.article
            key={project.id}
            className="relative overflow-hidden bg-black group"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                <span className="font-mono text-[10px] tracking-[0.4em] text-white uppercase border border-white/30 px-4 py-2">
                  View Project
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-[#111]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-mono text-sm text-white tracking-wide mb-1">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase">
                    {project.subtitle}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#444]">
                  {project.year}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
