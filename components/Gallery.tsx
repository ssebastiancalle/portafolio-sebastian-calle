"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Category } from "@/data/categories";

interface GalleryProps {
  category: Category;
}

export default function Gallery({ category }: GalleryProps) {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={category.id}
          className="grid grid-cols-3 gap-[3px] w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {category.photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="relative aspect-square overflow-hidden group"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 33vw, 15vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Category label overlay */}
      <motion.div
        key={`label-${category.id}`}
        className="mt-4 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-[#444] font-mono uppercase">
          {category.photos.length} images
        </span>
        <span className="w-8 h-px bg-[#333]" />
        <span className="text-[10px] tracking-[0.3em] text-[#444] font-mono uppercase">
          {category.label}
        </span>
      </motion.div>
    </div>
  );
}
