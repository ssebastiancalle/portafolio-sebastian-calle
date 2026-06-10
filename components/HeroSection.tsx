"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Gallery from "./Gallery";
import CategoryList from "./CategoryList";
import { categories } from "@/data/categories";

export default function HeroSection() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const activeCategory = categories.find((c) => c.id === activeId) ?? categories[0];
  const bgPhoto = activeCategory.photos[0];

  return (
    <section className="min-h-screen flex flex-col pt-28 relative overflow-hidden">
      {/* Blurred background — first photo of hovered category */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src={bgPhoto.url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "blur(24px)", transform: "scale(1.08)", opacity: 0.5 }}
            aria-hidden
          />
          {/* Extra dark veil so text stays readable */}
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>
      {/* Hero title row */}
      <motion.div
        className="px-8 py-10 flex flex-col gap-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-mono text-[clamp(2.2rem,6vw,5rem)] leading-none tracking-tighter text-white uppercase">
          Sebastian Calle
        </h1>
        <p className="font-mono text-[clamp(0.75rem,1.2vw,1rem)] text-[#444] tracking-[0.2em] uppercase mt-1">
          Capturing stories through light.
        </p>
      </motion.div>

      {/* Split layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0">
        {/* Left — gallery */}
        <motion.div
          className="px-8 pb-8 lg:sticky lg:top-20 lg:self-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Gallery category={activeCategory} />
        </motion.div>

        {/* Right — category list */}
        <div className="px-8 pb-8 lg:pl-4 lg:pr-16 flex items-start lg:items-center min-h-[60vh]">
          <CategoryList
            categories={categories}
            active={activeId}
            onHover={setActiveId}
          />
        </div>
      </div>
    </section>
  );
}
