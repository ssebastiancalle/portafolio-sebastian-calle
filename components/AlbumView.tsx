"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Lightbox from "@/components/Lightbox";
import type { LightboxPhoto } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/blur";

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

const CANVAS_W = 1200;
const CANVAS_H = 800;

function hasCanvasLayout(photos: LightboxPhoto[]): boolean {
  return photos.length > 0 && photos[0].canvas_x != null;
}

export default function AlbumView({ label, description, albumIndex, totalAlbums, photos, prev, next }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isCanvas = hasCanvasLayout(photos);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
          className="px-6 md:px-10 pt-6 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase mb-4 transition-opacity hover:opacity-60"
            style={{ color: "var(--text-4)" }}
          >
            ← PORTFOLIO
          </Link>
          <p className="font-mono text-xs tracking-[0.35em] uppercase mb-1" style={{ color: "var(--text-3)" }}>
            {String(albumIndex + 1).padStart(2, "0")} / {String(totalAlbums).padStart(2, "0")}
          </p>
          <h1 className="font-mono text-3xl md:text-5xl tracking-tighter uppercase font-bold" style={{ color: "var(--text)" }}>
            {label}
          </h1>
          {description && (
            <div
              className="font-mono text-sm leading-relaxed mt-2"
              style={{ color: "var(--text-3)", wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{
                __html: description.replace(/\n/g, "<br>").replace(/@([\w.]+)/g, (_, h) =>
                  `<a href="https://instagram.com/${h}" target="_blank" rel="noopener noreferrer" style="color:#e1aa6e;text-decoration:underline;text-underline-offset:3px;font-weight:600;cursor:pointer">@${h}</a>`
                )
              }}
            />
          )}
        </motion.div>

        {isMobile ? (
          /* ── Mobile: vertical stack, full photos, no crop ── */
          <div className="px-4 pb-24 flex flex-col gap-3">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setLightboxIndex(i)}
                className="cursor-pointer w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.alt} className="w-full h-auto block" loading={i < 3 ? "eager" : "lazy"} />
              </motion.div>
            ))}
          </div>
        ) : isCanvas ? (
          /* ── Canvas layout (desktop only) ── */
          <motion.div
            className="px-6 md:px-10 pb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: `${(CANVAS_H / CANVAS_W) * 100}%`,
              }}
            >
              {photos.map((photo, i) => {
                const cx = photo.canvas_x ?? 0;
                const cy = photo.canvas_y ?? 0;
                const cw = photo.canvas_w ?? 200;
                const ch = photo.canvas_h ?? 150;
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * i }}
                    onClick={() => setLightboxIndex(i)}
                    className="cursor-pointer group overflow-hidden"
                    style={{
                      position: "absolute",
                      left: `${(cx / CANVAS_W) * 100}%`,
                      top: `${(cy / CANVAS_H) * 100}%`,
                      width: `${(cw / CANVAS_W) * 100}%`,
                      height: `${(ch / CANVAS_H) * 100}%`,
                    }}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ── Original grid layout (fallback) ── */
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 px-6 md:px-10 pb-24">
            <motion.div
              className="relative cursor-pointer overflow-hidden group"
              style={{ height: "clamp(400px, 70vh, 700px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onClick={() => setLightboxIndex(0)}
            >
              <Image
                src={photos[0].url}
                alt={photos[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-2 md:gap-3 md:pl-3 pt-3 md:pt-0 content-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {photos.slice(1).map((photo, i) => (
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
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom nav */}
        <div
          className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-2 backdrop-blur-md border-t"
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
