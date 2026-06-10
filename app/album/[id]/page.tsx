"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";
import Lightbox from "@/components/Lightbox";

const NUM_SIZES = ["9rem", "14rem", "6rem", "11rem", "8rem", "16rem"];
const Y_OFFSETS = [0, 50, 10, 70, 20, 30, 40, 90, 5, 60, 15, 40];
const FLIP      = [false, false, true, false, true, true];

export default function AlbumPage() {
  const params   = useParams();
  const category = categories.find((c) => c.id === params.id);
  if (!category) notFound();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
    <AnimatePresence>
      {lightboxIndex !== null && (
        <Lightbox
          photos={category.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </AnimatePresence>
    <main className="min-h-screen bg-black px-5 md:px-10 py-24">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <Link
          href="/"
          className="inline-flex items-center py-3 font-mono text-[11px] tracking-[0.3em] text-[#444] uppercase hover:text-white transition-colors duration-200 cursor-pointer"
          style={{ minHeight: 44 }}
        >
          ← BACK
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-mono leading-none tracking-tighter text-white uppercase mb-20"
        style={{ fontSize: "clamp(2.8rem, 9vw, 8rem)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {category.label}
      </motion.h1>

      {/* Items */}
      <div className="columns-1 md:columns-2 gap-0">
        {category.photos.map((photo, i) => {
          const numSize = NUM_SIZES[i % NUM_SIZES.length];
          const yOffset = Y_OFFSETS[i % Y_OFFSETS.length];
          const flip    = FLIP[i % FLIP.length];
          const { meta } = photo;

          return (
            <motion.article
              key={photo.id}
              className="break-inside-avoid mb-2"
              style={{ marginTop: yOffset }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              {/*
               * Mobile:  number+photo stacked vertically, text below
               * Desktop: number left | photo center | text right — all in one row
               */}
              <div className={`
                flex flex-col
                md:flex-row md:items-end md:gap-5
                ${flip ? "md:flex-row-reverse" : ""}
              `}>
                {/* Giant number */}
                <span
                  className="font-mono font-bold leading-none text-white select-none flex-shrink-0"
                  style={{ fontSize: numSize, lineHeight: 0.85 }}
                >
                  {i + 1}
                </span>

                {/* Photo — overlaps number on mobile, side-by-side on desktop */}
                <div
                  className="relative flex-shrink-0 overflow-hidden cursor-pointer group"
                  style={{
                    width: 120,
                    height: 158,
                    marginTop: "-1rem",
                  }}
                  onClick={() => setLightboxIndex(i)}
                  role="button"
                  aria-label={`Open ${photo.alt}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(i)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Editorial text — on desktop sits to the right of photo */}
                <div className="mt-3 md:mt-0 md:pb-1 text-left pl-1 md:pl-0 flex-1 min-w-0">
                  <p className="font-mono text-[11px] font-bold tracking-widest text-white uppercase mb-[3px] leading-snug">
                    {meta.title}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.15em] text-[#555] uppercase mb-2">
                    {meta.publication}
                  </p>
                  <p className="font-mono text-[10px] leading-relaxed text-[#444] mb-3 normal-case italic">
                    {meta.description}
                  </p>
                  <div className="flex flex-col gap-[3px]">
                    {meta.credits.magazine && (
                      <span className="font-mono text-[11px] tracking-[0.1em] text-[#333] uppercase">
                        MAGAZINE {meta.credits.magazine}
                      </span>
                    )}
                    {meta.credits.model && (
                      <span className="font-mono text-[11px] tracking-[0.1em] text-[#333] uppercase">
                        MODEL {meta.credits.model}
                      </span>
                    )}
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#333] uppercase">
                      PHOTOGRAPHER {meta.credits.photographer}
                    </span>
                    {meta.credits.studio && (
                      <span className="font-mono text-[11px] tracking-[0.1em] text-[#333] uppercase">
                        STUDIO {meta.credits.studio}
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </motion.article>
          );
        })}
      </div>
    </main>
    </>
  );
}
