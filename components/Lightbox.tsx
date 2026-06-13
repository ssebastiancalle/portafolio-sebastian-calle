"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import type { LightboxPhoto } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/blur";

interface LightboxProps {
  photos: LightboxPhoto[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
  description?: string;
}

const SWIPE_THRESHOLD = 60;

function linkifyDescription(html: string): string {
  return html.replace(/@([\w.]+)/g, (_, h) =>
    `<a href="https://instagram.com/${h}" target="_blank" rel="noopener noreferrer" style="color:#e1aa6e;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(225,170,110,0.45);font-weight:600;letter-spacing:0.04em;cursor:pointer">@${h}</a>`
  );
}

const COLLAPSED_H = 44;

export default function Lightbox({ photos, index, onClose, onChange, description }: LightboxProps) {
  const photo = photos[index];
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.4, 1, 0.4]);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setExpanded(false); }, [index]);

  useEffect(() => {
    if (descRef.current) setFullHeight(descRef.current.scrollHeight);
  }, [description]);

  const prev = useCallback(() => {
    if (index > 0) onChange(index - 1);
  }, [index, onChange]);

  const next = useCallback(() => {
    if (index < photos.length - 1) onChange(index + 1);
  }, [index, photos.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] bg-black flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
        <span className="font-mono text-[11px] tracking-[0.3em] text-[#444] uppercase select-none">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          onClick={onClose}
          className="font-mono text-[11px] tracking-[0.3em] text-[#444] uppercase hover:text-white transition-colors duration-200 cursor-pointer py-2 px-1"
          style={{ minHeight: 44, minWidth: 44 }}
          aria-label="Close"
        >
          [ ESC ]
        </button>
      </div>

      {/* Photo area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="relative w-full h-full"
            style={{ x, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) next();
              else if (info.offset.x > SWIPE_THRESHOLD) prev();
              x.set(0);
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="100vw"
              className="object-contain select-none"
              draggable={false}
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next tap zones — desktop */}
        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center pl-6 group"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-white/60 group-hover:text-white transition-colors"><polygon points="16,4 8,12 16,20" fill="currentColor" /></svg>
          </button>
        )}
        {index < photos.length - 1 && (
          <button
            onClick={next}
            className="absolute right-0 top-0 h-full w-1/4 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-end pr-6 group"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-white/60 group-hover:text-white transition-colors"><polygon points="8,4 16,12 8,20" fill="currentColor" /></svg>
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 px-6 py-5">
        <div className="flex items-end justify-between gap-4">
          {/* Left: album description */}
          {description ? (
            <div style={{ maxWidth: 360 }}>
              <motion.div
                animate={{ height: expanded ? fullHeight : COLLAPSED_H }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div
                  ref={descRef}
                  className="font-mono text-[13px] tracking-[0.08em] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  dangerouslySetInnerHTML={{ __html: linkifyDescription(description) }}
                />
              </motion.div>
              {fullHeight > COLLAPSED_H && (
                <motion.button
                  onClick={() => setExpanded(v => !v)}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase mt-1 transition-colors duration-200"
                  style={{ color: "#555", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  whileHover={{ color: "#aaa" }}
                >
                  {expanded ? "ver menos" : "... ver más"}
                </motion.button>
              )}
            </div>
          ) : <div />}

          {/* Right: counter */}
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase select-none flex-shrink-0" style={{ color: "#444" }}>
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
