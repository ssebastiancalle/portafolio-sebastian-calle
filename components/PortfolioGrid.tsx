"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { AlbumSlim } from "@/lib/types";

export default function PortfolioGrid({ albums }: { albums: AlbumSlim[] }) {
  return (
    <main className="min-h-screen pt-24 px-6 md:px-10 pb-16" style={{ background: "var(--bg)" }}>
      <div className="[column-count:1] sm:[column-count:2] lg:[column-count:3] [column-gap:12px]">
        {albums.map((album, i) => (
          <AlbumCard key={album.id} album={album} index={i} />
        ))}
      </div>
    </main>
  );
}

function AlbumCard({ album, index }: { album: AlbumSlim; index: number }) {
  return (
    <motion.div
      className="relative overflow-hidden group cursor-pointer"
      style={{ breakInside: "avoid", marginBottom: 12 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/album/${album.id}`} className="block w-full relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.coverUrl}
          alt={album.label}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-4)" }}>
            {String(album.photoCount).padStart(2, "0")} IMAGES
          </p>
          <p className="font-mono text-sm tracking-widest uppercase font-bold" style={{ color: "var(--text)" }}>
            {album.label}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
