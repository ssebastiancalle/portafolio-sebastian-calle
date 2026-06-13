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

export default function AlbumView({ label, description, albumIndex, totalAlbums, photos, prev, next }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const cover = photos[0];
  const rest  = photos.slice(1);

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      <Header />

      <main className="min-h-screen bg-black pt-20">
        <motion.div
          className="px-6 md:px-10 pt-6 pb-4"
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

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 px-6 md:px-10 pb-24">
          {/* Cover photo */}
          <motion.div
            className="relative cursor-pointer overflow-hidden group"
            style={{ height: "clamp(400px, 70vh, 700px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </motion.div>

          {/* Remaining photos grid */}
          <motion.div
            className="grid grid-cols-2 gap-2 md:gap-3 md:pl-3 pt-3 md:pt-0 content-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {rest.map((photo, i) => (
              <motion.div
                key={photo.id}
                className="relative overflow-hidden cursor-pointer group"
                style={{ height: "clamp(160px, 22vh, 240px)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                onClick={() => setLightboxIndex(i + 1)}
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
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
            <Link
              href={`/album/${prev.id}`}
              className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 touch-manipulation"
              style={{ minHeight: 44 }}
            >
              ← {prev.label}
            </Link>
          ) : (
            <Link
              href="/portfolio"
              className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center touch-manipulation"
              style={{ minHeight: 44 }}
            >
              ← PORTFOLIO
            </Link>
          )}

          {next ? (
            <Link
              href={`/album/${next.id}`}
              className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center gap-3 touch-manipulation"
              style={{ minHeight: 44 }}
            >
              {next.label} →
            </Link>
          ) : (
            <Link
              href="/portfolio"
              className="nav-link-dim font-mono text-[11px] tracking-[0.3em] uppercase flex items-center touch-manipulation"
              style={{ minHeight: 44 }}
            >
              PORTFOLIO →
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
