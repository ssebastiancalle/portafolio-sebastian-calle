"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@/data/categories";

interface CategoryListProps {
  categories: Category[];
  active: string;
  onHover: (id: string) => void;
}

export default function CategoryList({ categories, active, onHover }: CategoryListProps) {
  return (
    <div className="flex flex-col justify-center h-full">
      <motion.p
        className="text-[11px] tracking-[0.3em] text-[#444] font-mono mb-6 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        portfolio:
      </motion.p>

      <nav>
        {categories.map((cat, i) => {
          const isActive = cat.id === active;
          return (
            <motion.div
              key={cat.id}
              className="overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={`/album/${cat.id}`}>
                <motion.span
                  className={`
                    block w-full text-left font-mono uppercase leading-none py-[0.18em] pr-4
                    transition-all duration-200 select-none
                    text-[clamp(1.6rem,3.2vw,3rem)] tracking-tight
                    ${isActive
                      ? "text-white font-bold"
                      : "text-[#555] hover:text-[#bbb]"
                    }
                  `}
                  onMouseEnter={() => onHover(cat.id)}
                  onTouchStart={() => onHover(cat.id)}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {isActive && (
                    <motion.span
                      className="inline-block w-2 h-2 rounded-full bg-white mr-3 align-middle mb-[2px]"
                      layoutId="activeDot"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {cat.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}
