"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { categories } from "@/data/categories";

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-24 px-6 md:px-10 pb-16">
        {/* Top row: 1 large landscape + 1 portrait */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3 mb-3">
          {categories.slice(0, 2).map((cat, i) => (
            <AlbumCard key={cat.id} cat={cat} index={i} tall={i === 1} />
          ))}
        </div>

        {/* Bottom rows: 3 per row */}
        {[categories.slice(2, 5), categories.slice(5, 8), categories.slice(8, 11), categories.slice(11)].map((row, ri) => (
          row.length > 0 && (
            <div key={ri} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {row.map((cat, i) => (
                <AlbumCard key={cat.id} cat={cat} index={ri * 3 + 2 + i} />
              ))}
            </div>
          )
        ))}
      </main>
    </>
  );
}

function AlbumCard({ cat, index, tall }: { cat: typeof categories[0]; index: number; tall?: boolean }) {
  return (
    <motion.div
      className={`relative overflow-hidden group cursor-pointer ${tall ? "h-[480px]" : "h-[320px] md:h-[380px]"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/album/${cat.id}`} className="block w-full h-full">
        <Image
          src={cat.photos[0].url}
          alt={cat.label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay — always visible at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {String(cat.photos.length).padStart(2, "0")} IMAGES
          </p>
          <p className="font-mono text-sm md:text-base tracking-widest uppercase font-bold" style={{ color: "#ffffff" }}>
            {cat.label}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
