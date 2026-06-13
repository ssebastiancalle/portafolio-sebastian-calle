"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { AlbumSlim } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/blur";

export default function PortfolioGrid({ albums }: { albums: AlbumSlim[] }) {
  const top = albums.slice(0, 2);
  const rows = [albums.slice(2, 5), albums.slice(5, 8), albums.slice(8, 11), albums.slice(11)];

  return (
    <main className="min-h-screen pt-24 px-6 md:px-10 pb-16" style={{ background: "var(--bg)" }}>
      {/* Top row: 1 large + 1 portrait */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 mb-3">
        {top.map((album, i) => (
          <AlbumCard key={album.id} album={album} index={i} tall={i === 1} />
        ))}
      </div>

      {rows.map((row, ri) =>
        row.length > 0 ? (
          <div key={ri} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {row.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={ri * 3 + 2 + i} />
            ))}
          </div>
        ) : null
      )}
    </main>
  );
}

function AlbumCard({ album, index, tall }: { album: AlbumSlim; index: number; tall?: boolean }) {
  return (
    <motion.div
      className={`relative overflow-hidden group cursor-pointer ${tall ? "h-[480px]" : "h-[320px] md:h-[380px]"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/album/${album.id}`} className="block w-full h-full">
        <Image
          src={album.coverUrl}
          alt={album.label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {String(album.photoCount).padStart(2, "0")} IMAGES
          </p>
          <p className="font-mono text-sm md:text-base tracking-widest uppercase font-bold" style={{ color: "#ffffff" }}>
            {album.label}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
