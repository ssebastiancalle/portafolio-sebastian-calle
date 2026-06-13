"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Lightbox from "@/components/Lightbox";
import type { LightboxPhoto } from "@/lib/types";

export interface AlbumNavItem {
  id: string;
  label: string;
}

interface Props {
  label: string;
  description?: string;
  albumIndex: number;
  totalAlbums: number;
  photos: LightboxPhoto[];
  prev: AlbumNavItem | null;
  next: AlbumNavItem | null;
}

const ROW_HEIGHT = 320;
const GAP = 4;

export default function AlbumView({ label, description, albumIndex, totalAlbums, photos, prev, next }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onChange={setLightboxIndex}
            description={description}
          />
        )}
      </AnimatePresence>

      <Header />

      <main className="min-h-screen bg-black pt-20">
        <motion.div
          className="px-6 md:px-10 pt-6 pb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase mb-4 transition-opacity hover:opacity-60"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ← PORTFOLIO
          </Link>
          <p className="font-mono text-[10px] tracking-[0.35em] text-[#444] uppercase mb-1">
            {String(albumIndex + 1).padStart(2, "0")} / {String(totalAlbums).padStart(2, "0")}
          </p>
          <h1 className="font-mono text-2xl md:text-4xl tracking-tighter text-white uppercase font-bold">
            {label}
          </h1>
          {description && (
            <p className="font-mono text-[11px] leading-relaxed mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
              {description}
            </p>
          )}
        </motion.div>

        {/* Justified gallery */}
        <div className="px-6 md:px-10 pb-28">
          <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
            {photos.map((photo, i) => {
              const ratio = photo.width && photo.height ? photo.width / photo.height : 3 / 2;
              const scale = photo.scale ?? 1;
              return (
                <motion.div
                  key={photo.id}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{
                    flex: `${ratio * scale} 1 ${ROW_HEIGHT * ratio * scale}px`,
                    height: ROW_HEIGHT,
                    minWidth: 120,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  onClick={() => setLightboxIndex(i)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              );
            })}
            {/* Prevents last-row stretch */}
            <div style={{ flex: "9999 1 0px", height: ROW_HEIGHT, maxHeight: ROW_HEIGHT }} />
          </div>
        </div>

        {/* Bottom nav */}
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-md border-t"
          style={{
            background: "rgba(var(--header-bg), 0.92)",
            borderColor: "rgba(var(--header-border), 0.06)",
          }}
        >
          {prev ? (
            <Link href={`/album/${prev.id}`} className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 touch-manipulation" style={{ minHeight: 44 }}>
              ← {prev.label}
            </Link>
          ) : (
            <Link href="/portfolio" className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center touch-manipulation" style={{ minHeight: 44 }}>
              ← PORTFOLIO
            </Link>
          )}
          {next ? (
            <Link href={`/album/${next.id}`} className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 touch-manipulation" style={{ minHeight: 44 }}>
              {next.label} →
            </Link>
          ) : (
            <Link href="/portfolio" className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center touch-manipulation" style={{ minHeight: 44 }}>
              PORTFOLIO →
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
