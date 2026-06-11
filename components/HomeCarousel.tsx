"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const HEIGHTS = [420, 340, 520, 360, 440, 300, 480, 390];
const VISIBLE = 4;

export default function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const total = categories.length;
  const canPrev = index > 0;
  const canNext = index + VISIBLE < total;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => Math.max(0, Math.min(i + d, total - VISIBLE)));
  };

  const visible = categories.slice(index, index + VISIBLE);

  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Photos row */}
      <div className="flex items-end gap-3 px-16 w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((cat, i) => {
            const h = HEIGHTS[(index + i) % HEIGHTS.length];
            const cover = cat.photos[0];
            return (
              <motion.div
                key={cat.id}
                className="relative flex-1 group cursor-pointer overflow-hidden"
                style={{ height: h }}
                initial={{ opacity: 0, x: dir > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -80 : 80 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <Link href={`/album/${cat.id}`} className="block w-full h-full">
                  <Image
                    src={cover.url}
                    alt={cat.label}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* name overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.25em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => go(-1)}
        disabled={!canPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest text-white/40 hover:text-white disabled:opacity-0 transition-all duration-200 cursor-pointer z-10"
        style={{ minHeight: 44, minWidth: 44 }}
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        onClick={() => go(1)}
        disabled={!canNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest text-white/40 hover:text-white disabled:opacity-0 transition-all duration-200 cursor-pointer z-10"
        style={{ minHeight: 44, minWidth: 44 }}
      >
        →
      </button>

      {/* Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-[#444] uppercase select-none">
        {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
