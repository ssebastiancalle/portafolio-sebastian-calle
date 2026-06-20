"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import type { AlbumSlim } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/blur";

const SWIPE_THRESHOLD = 50;
const SLIDE_VW = 80;
const PEEK_VW  = 8;
const GAP_VW   = 4;
const STEP_VW  = SLIDE_VW + GAP_VW;

interface Props {
  albums?: AlbumSlim[];
}

export default function HomeCarousel({ albums }: Props) {
  const [index, setIndex]       = useState(0);
  const [dir, setDir]           = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const swipeStartX = useRef(0);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const items: AlbumSlim[] = albums && albums.length > 0 ? albums : [];

  const total = items.length;

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + total) % total);
  };

  if (total === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-4)" }}>
          Sin álbumes
        </p>
      </div>
    );
  }

  /* ── Mobile ── */
  if (isMobile) {
    const prevItem = items[(index - 1 + total) % total];
    const currItem = items[index];
    const nextItem = items[(index + 1) % total];

    return (
      <div className="relative w-full flex flex-col bg-black" style={{ height: "100svh", paddingTop: "64px" }}>
        <div
          className="relative flex-1 overflow-hidden"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => { swipeStartX.current = e.clientX; }}
          onPointerUp={(e) => {
            const diff = e.clientX - swipeStartX.current;
            if (diff < -SWIPE_THRESHOLD) go(1);
            else if (diff > SWIPE_THRESHOLD) go(-1);
          }}
        >
          {/* Prev peek */}
          <div className="absolute top-0 h-full overflow-hidden opacity-40" style={{ width: `${SLIDE_VW}vw`, left: `${PEEK_VW - STEP_VW}vw` }}>
            <Image src={prevItem.coverUrl} alt={prevItem.label} fill sizes="80vw" className="object-contain" draggable={false} placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          </div>

          {/* Current */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="absolute top-0 h-full overflow-hidden"
              style={{ width: `${SLIDE_VW}vw`, left: `${PEEK_VW}vw` }}
              initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image src={currItem.coverUrl} alt={currItem.label} fill sizes="80vw" className="object-contain" draggable={false} priority placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              <Link href={`/album/${currItem.id}`} className="absolute inset-0 z-10" aria-label={currItem.label} />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-20 pointer-events-none" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-4)" }}>
                  {String(currItem.photoCount).padStart(2, "0")} IMAGES
                </p>
                <p className="font-mono text-base tracking-widest uppercase font-bold" style={{ color: "var(--text)" }}>
                  {currItem.label}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Next peek */}
          <div className="absolute top-0 h-full overflow-hidden opacity-40" style={{ width: `${SLIDE_VW}vw`, left: `${PEEK_VW + STEP_VW}vw` }}>
            <Image src={nextItem.coverUrl} alt={nextItem.label} fill sizes="80vw" className="object-contain" draggable={false} placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          </div>
        </div>

        <div className="flex flex-col items-center pb-4 pt-2 gap-1" style={{ background: "var(--bg)" }}>
          <div className="flex items-center gap-10">
            <button onClick={() => go(-1)} aria-label="Previous" className="carousel-arrow touch-manipulation transition-opacity hover:opacity-60" style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><polygon points="16,4 8,12 16,20" fill="currentColor" /></svg>
            </button>
            <button onClick={() => go(1)} aria-label="Next" className="carousel-arrow touch-manipulation transition-opacity hover:opacity-60" style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><polygon points="8,4 16,12 8,20" fill="currentColor" /></svg>
            </button>
          </div>
          <span className="font-mono text-[12px] font-bold tracking-[0.3em] uppercase select-none" style={{ color: "var(--text)" }}>
            {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }

  /* ── Desktop ── */
  const leftItem  = items[(index - 1 + total) % total];
  const mainItem  = items[index];
  const rightItem = items[(index + 1) % total];

  function handleDesktopDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  }

  return (
    <motion.div
      className="relative w-full h-screen flex items-center overflow-hidden"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.04}
      onDragEnd={handleDesktopDragEnd}
      style={{ touchAction: "pan-y", cursor: "default" }}
    >
      <div className="grid px-12 w-full items-center gap-4" style={{ gridTemplateColumns: "1fr 2.4fr 1fr" }}>

        {/* Left — previous album */}
        <div className="flex justify-end">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={leftItem.id + "-left"}
              className="relative w-full group cursor-pointer overflow-hidden"
              style={{ height: "48vh" }}
              initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
              animate={{ opacity: 0.45, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => go(-1)}
            >
              <Image src={leftItem.coverUrl} alt={leftItem.label} fill sizes="22vw" className="object-contain transition-transform duration-700 group-hover:scale-105" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center — active album */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mainItem.id}
            className="relative w-full group cursor-pointer overflow-hidden"
            style={{ height: "76vh" }}
            initial={{ opacity: 0, scale: 0.97, x: dir > 0 ? 60 : -60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: dir > 0 ? -60 : 60 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/album/${mainItem.id}`} className="block w-full h-full">
              <Image src={mainItem.coverUrl} alt={mainItem.label} fill sizes="50vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.03]" priority placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 40%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-4)" }}>
                  {String(mainItem.photoCount).padStart(2, "0")} IMAGES
                </p>
                <p className="font-mono text-xl tracking-widest uppercase font-bold" style={{ color: "var(--text)" }}>
                  {mainItem.label}
                </p>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Right — next album */}
        <div className="flex justify-start">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={rightItem.id + "-right"}
              className="relative w-full group cursor-pointer overflow-hidden"
              style={{ height: "48vh" }}
              initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
              animate={{ opacity: 0.45, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => go(1)}
            >
              <Image src={rightItem.coverUrl} alt={rightItem.label} fill sizes="22vw" className="object-contain transition-transform duration-700 group-hover:scale-105" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left arrow — gradient panel */}
      <div
        className="absolute left-0 top-0 h-full flex items-center pl-4 z-20 pointer-events-none"
        style={{ width: 90, background: "linear-gradient(to right, var(--bg) 30%, transparent)" }}
      >
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className="carousel-arrow pointer-events-auto transition-opacity hover:opacity-60"
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="16,4 8,12 16,20" fill="currentColor" /></svg>
        </button>
      </div>

      {/* Right arrow — gradient panel */}
      <div
        className="absolute right-0 top-0 h-full flex items-center justify-end pr-4 z-20 pointer-events-none"
        style={{ width: 90, background: "linear-gradient(to left, var(--bg) 30%, transparent)" }}
      >
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="carousel-arrow pointer-events-auto transition-opacity hover:opacity-60"
          style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><polygon points="8,4 16,12 8,20" fill="currentColor" /></svg>
        </button>
      </div>

      {/* Counter — bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase select-none" style={{ color: "rgba(var(--header-border), 0.3)" }}>
          {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}
