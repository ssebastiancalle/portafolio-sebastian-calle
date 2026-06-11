"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const HEIGHTS = [420, 340, 520, 360, 440, 300, 480, 390];

export default function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [visibleCount, setVisibleCount] = useState(1); // mobile-first default

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth >= 768 ? 4 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = categories.length;
  const isMobile = visibleCount === 1;
  const canPrev = index > 0;
  const canNext = index + visibleCount < total;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => Math.max(0, Math.min(i + d, total - visibleCount)));
  };

  const visible = categories.slice(index, index + visibleCount);

  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Photos row */}
      <div
        className="flex items-end gap-3 w-full"
        style={{ paddingLeft: isMobile ? 16 : 64, paddingRight: isMobile ? 16 : 64 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((cat, i) => {
            const desktopH = HEIGHTS[(index + i) % HEIGHTS.length];
            const cover = cat.photos[0];
            return (
              <motion.div
                key={cat.id}
                className="relative flex-1 group cursor-pointer overflow-hidden"
                style={{ height: isMobile ? "clamp(340px, 65vh, 600px)" : desktopH }}
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
                    sizes="(max-width: 767px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Desktop: hover overlay */}
                  {!isMobile && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.25em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {cat.label}
                      </span>
                    </>
                  )}

                  {/* Mobile: always visible name + count */}
                  {isMobile && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 to-transparent">
                      <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {String(cat.photos.length).padStart(2, "0")} IMAGES
                      </p>
                      <p className="font-mono text-base tracking-widest uppercase font-bold" style={{ color: "#ffffff" }}>
                        {cat.label}
                      </p>
                    </div>
                  )}
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
        className="carousel-arrow absolute top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest cursor-pointer z-10 touch-manipulation"
        style={{
          left: isMobile ? 4 : 16,
          minHeight: 44,
          minWidth: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        onClick={() => go(1)}
        disabled={!canNext}
        aria-label="Next"
        className="carousel-arrow absolute top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest cursor-pointer z-10 touch-manipulation"
        style={{
          right: isMobile ? 4 : 16,
          minHeight: 44,
          minWidth: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
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
