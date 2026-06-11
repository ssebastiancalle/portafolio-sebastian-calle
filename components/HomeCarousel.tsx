"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import type { AlbumSlim } from "@/lib/types";

const HEIGHTS = [420, 340, 520, 360, 440, 300, 480, 390];
const SWIPE_THRESHOLD = 50;

// Mobile: vw constants for peek layout
const SLIDE_VW = 80; // current slide width
const PEEK_VW  = 8;  // adjacent slide visible on each side
const GAP_VW   = 4;  // gap between slides
const STEP_VW  = SLIDE_VW + GAP_VW; // 84 — offset per slide step

interface Props {
  albums?: AlbumSlim[];
}

export default function HomeCarousel({ albums }: Props) {
  const [index, setIndex]       = useState(0);
  const [dir, setDir]           = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Normalise: prefer Supabase albums, fall back to hardcoded categories
  const items: AlbumSlim[] = albums && albums.length > 0
    ? albums
    : categories.map((c) => ({
        id: c.id,
        label: c.label,
        coverUrl: c.photos[0].url,
        photoCount: c.photos.length,
      }));

  const total        = items.length;
  const visibleCount = isMobile ? 1 : 4;
  const canPrev      = index > 0;
  const canNext      = index + visibleCount < total;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => Math.max(0, Math.min(i + d, total - visibleCount)));
  };

  /* ── Mobile: peek track carousel ── */
  if (isMobile) {
    return (
      <div className="relative w-full flex flex-col bg-black" style={{ height: "100svh", paddingTop: "64px" }}>

        {/* Track — all slides in a row, spring-animated */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 flex h-full"
            animate={{ x: `${PEEK_VW - index * STEP_VW}vw` }}
            transition={{ type: "spring", stiffness: 360, damping: 36, mass: 0.85 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.06}
            style={{ touchAction: "pan-y", gap: `${GAP_VW}vw` }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD && canNext) go(1);
              else if (info.offset.x > SWIPE_THRESHOLD && canPrev) go(-1);
            }}
          >
            {items.map((item, i) => {
              const isCurrent = i === index;
              return (
                <motion.div
                  key={item.id}
                  className="relative flex-shrink-0 h-full overflow-hidden"
                  style={{ width: `${SLIDE_VW}vw` }}
                  animate={{
                    opacity: isCurrent ? 1 : 0.4,
                    scale:   isCurrent ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.3 }}
                  onClick={() => !isCurrent && go(i > index ? 1 : -1)}
                >
                  <Image
                    src={item.coverUrl}
                    alt={item.label}
                    fill
                    sizes="80vw"
                    className="object-cover"
                    draggable={false}
                    priority={isCurrent}
                  />

                  {/* Current slide: link + name overlay */}
                  {isCurrent && (
                    <>
                      <Link
                        href={`/album/${item.id}`}
                        className="absolute inset-0 z-10"
                        aria-label={item.label}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 to-transparent z-20 pointer-events-none">
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1"
                           style={{ color: "rgba(255,255,255,0.4)" }}>
                          {String(item.photoCount).padStart(2, "0")} IMAGES
                        </p>
                        <p className="font-mono text-base tracking-widest uppercase font-bold"
                           style={{ color: "#ffffff" }}>
                          {item.label}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Controls: arrows + counter */}
        <div className="flex flex-col items-center pb-4 pt-2 gap-1" style={{ background: "var(--bg)" }}>
          <div className="flex items-center gap-10">
            <button
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous"
              className="carousel-arrow font-mono text-sm tracking-widest touch-manipulation"
              style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next"
              className="carousel-arrow font-mono text-sm tracking-widest touch-manipulation"
              style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              →
            </button>
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase select-none"
            style={{ color: "rgba(var(--header-border), 0.3)" }}
          >
            {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }

  /* ── Desktop: original staggered height carousel ── */
  const visible = items.slice(index, index + 4);

  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
      <div className="flex items-end gap-3 px-16 w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => {
            const h = HEIGHTS[(index + i) % HEIGHTS.length];
            return (
              <motion.div
                key={item.id}
                className="relative flex-1 group cursor-pointer overflow-hidden"
                style={{ height: h }}
                initial={{ opacity: 0, x: dir > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir > 0 ? -80 : 80 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <Link href={`/album/${item.id}`} className="block w-full h-full">
                  <Image
                    src={item.coverUrl}
                    alt={item.label}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.25em] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Arrows + counter — centered bottom group */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button
            onClick={() => go(-1)}
            disabled={!canPrev}
            aria-label="Previous"
            className="carousel-arrow font-mono text-xs tracking-widest cursor-pointer"
            style={{ minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ←
          </button>
          <button
            onClick={() => go(1)}
            disabled={!canNext}
            aria-label="Next"
            className="carousel-arrow font-mono text-xs tracking-widest cursor-pointer"
            style={{ minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            →
          </button>
        </div>
        <span
          className="font-mono text-[10px] tracking-[0.3em] uppercase select-none"
          style={{ color: "rgba(var(--header-border), 0.3)" }}
        >
          {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
