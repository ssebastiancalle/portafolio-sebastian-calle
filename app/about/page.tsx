"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-24 px-6 md:px-10 pb-16 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 max-w-5xl mx-auto">
          {/* Photo */}
          <motion.div
            className="relative w-full aspect-[3/4] overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&q=80"
              alt="Sebastian Calle"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Bio */}
          <motion.div
            className="flex flex-col justify-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] text-[#444] uppercase mb-3">
                About
              </p>
              <h1 className="font-mono text-2xl md:text-3xl tracking-tighter text-white uppercase font-bold leading-tight">
                Sebastian Calle
              </h1>
              <p className="font-mono text-[11px] tracking-[0.2em] text-[#555] uppercase mt-1">
                Photographer & Retoucher
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="font-mono text-[11px] leading-relaxed text-[#666]">
                I'm Sebastian Calle, a fashion, portrait, and editorial photographer. Born in Buenos Aires and currently based in Barcelona, I view photography as a medium to build unique visual universes.
              </p>
              <p className="font-mono text-[11px] leading-relaxed text-[#666]">
                My work navigates between nostalgia and vanguard aesthetics. I am passionate about bold contrasts, deep shadows, and vibrant colors that demand attention. For me, every shoot is a perfect opportunity to blend my own visual identity with the inner world of the subject, resulting in images with cinematic strength and a sharp editorial edge.
              </p>
              <p className="font-mono text-[11px] leading-relaxed text-[#666]">
                Throughout my career, I've had the opportunity to cover runway shows, showcase my work in exhibitions, and see my photography published in various fashion magazines.
              </p>
              <p className="font-mono text-[11px] leading-relaxed text-[#666]">
                When I'm not behind the lens, you'll likely find me traveling or exploring new places to inspire my next project. I am available for both local and international assignments.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[#111]">
              {[
                ["Based in",   "Barcelona, ES"],
                ["Available",  "Worldwide"],
                ["Contact",    "sebastiancalle@gmail.com"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#333] uppercase w-20 flex-shrink-0">{label}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-[#666] uppercase">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
