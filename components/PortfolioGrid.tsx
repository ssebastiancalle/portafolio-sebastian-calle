"use client";

import { useState, useEffect, useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);
  const ratio = album.coverAspectRatio ?? 1.5;

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div style={{ breakInside: "avoid", marginBottom: 12 }}>
      <Link href={`/album/${album.id}`} className="block w-full overflow-hidden group cursor-pointer">
        <div style={{ position: "relative", paddingBottom: `${(1 / ratio) * 100}%` }}>
          {/* Skeleton */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "var(--skeleton-bg, #1c1c1c)", opacity: loaded ? 0 : 1 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={album.coverUrl}
            alt={album.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}
            loading={index < 4 ? "eager" : "lazy"}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Link>
    </div>
  );
}
