"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const HEIGHTS = [420, 340, 520, 360, 440, 300, 480, 390];
const SWIPE_THRESHOLD = 50;

export default function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const total = categories.length;
  const visibleCount = isMobile ? 1 : 4;
  const canPrev = index > 0;
  const canNext = index + visibleCount < total;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => Math.max(0, Math.min(i + d, total - visibleCount)));
  };

  const visible = categories.slice(index, index + visibleCount);

  /* ── Mobile layout ── */
  if (isMobile) {
    const cat = visible[0];
    const cover = cat.photos[0];
    return (
      <div className="relative w-full flex flex-col bg-black" style={{ height: "100svh" }}>
        {/* Swipeable photo */}
        <motion.div
          className="relative flex-1 overflow-hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          style={{ touchAction: "pan-y" }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD && canNext) go(1);
            else if (info.offset.x > SWIPE_THRESHOLD && canPrev) go(-1);
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={cat.id}
              className="absolute inset-0"
              initial={{ opacity: 0, x: dir > 0 ? 200 : -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -200 : 200 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/album/${cat.id}`} className="block w-full h-full">
                <Image
                  src={cover.url}
                  alt={cat.label}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 to-transparent">
                  <p
                    className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {String(cat.photos.length).padStart(2, "0")} IMAGES
                  </p>
                  <p
                    className="font-mono text-base tracking-widest uppercase font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {cat.label}
                  </p>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Controls: arrows + counter below */}
        <div
          className="flex flex-col px-6 pb-4 pt-2"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous"
              className="carousel-arrow font-mono text-sm tracking-widest touch-manipulation"
              style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center" }}
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next"
              className="carousel-arrow font-mono text-sm tracking-widest touch-manipulation"
              style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "flex-end" }}
            >
              →
            </button>
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase select-none text-center"
            style={{ color: "rgba(var(--header-border), 0.3)" }}
          >
            {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }

  /* ── Desktop layout ── */
  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
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

      <button
        onClick={() => go(-1)}
        disabled={!canPrev}
        aria-label="Previous"
        className="carousel-arrow absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest cursor-pointer z-10"
        style={{ minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        ←
      </button>

      <button
        onClick={() => go(1)}
        disabled={!canNext}
        aria-label="Next"
        className="carousel-arrow absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest cursor-pointer z-10"
        style={{ minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        →
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] uppercase select-none"
           style={{ color: "rgba(var(--header-border), 0.3)" }}>
        {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
