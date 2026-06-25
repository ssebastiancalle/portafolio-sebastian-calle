"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type { AlbumSlim } from "@/lib/types";

export default function PortfolioGrid({ albums }: { albums: AlbumSlim[] }) {
  return (
    <main className="min-h-screen pt-24 px-6 md:px-10 pb-16" style={{ background: "var(--bg)" }}>
      <h1 className="font-mono text-[10px] tracking-[0.35em] uppercase mb-8" style={{ color: "var(--text)" }}>
        Photography Portfolio
      </h1>
      <div className="[column-count:1] sm:[column-count:2] lg:[column-count:3] [column-gap:12px]">
        {albums.map((album, i) => (
          <AlbumCard key={album.id} album={album} index={i} />
        ))}
      </div>
    </main>
  );
}

function AlbumCard({ album, index }: { album: AlbumSlim; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const visible = loaded && inView;

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden group cursor-pointer"
      style={{ breakInside: "avoid", marginBottom: 12 }}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/album/${album.id}`} className="block w-full relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={album.coverUrl}
          alt={album.label}
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
        />
      </Link>
    </motion.div>
  );
}
