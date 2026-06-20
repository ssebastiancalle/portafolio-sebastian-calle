"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import { BLUR_DATA_URL } from "@/lib/blur";

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop&q=80";

export default function AboutContent({ photoUrl }: { photoUrl?: string }) {
  const src = photoUrl || DEFAULT_PHOTO;

  return (
    <>
      <Header />
      <main
        className="min-h-screen pt-24 px-6 md:px-10 pb-16 flex items-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 max-w-5xl mx-auto">
          {/* Photo */}
          <motion.div
            className="relative w-full aspect-[3/4] overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={src}
              alt="Sebastian Calle"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
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
              <p
                className="font-mono text-[10px] tracking-[0.35em] uppercase mb-3"
                style={{ color: "var(--text-4)" }}
              >
                About
              </p>
              <h1
                className="font-mono text-2xl md:text-3xl tracking-tighter uppercase font-bold leading-tight"
                style={{ color: "var(--text)" }}
              >
                Sebastian Calle
              </h1>
              <p
                className="font-mono text-[12px] tracking-[0.2em] uppercase mt-1"
                style={{ color: "var(--text-3)" }}
              >
                Photographer & Retoucher
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {[
                "I'm Sebastian Calle, a fashion, portrait, and editorial photographer. Born in Buenos Aires and currently based in Barcelona, I view photography as a medium to build unique visual universes.",
                "My work navigates between nostalgia and vanguard aesthetics. I am passionate about bold contrasts, deep shadows, and vibrant colors that demand attention—elements I meticulously craft both behind the lens and through high-end retouching. For me, every project is a perfect opportunity to blend my own visual identity with the inner world of the subject, resulting in images with cinematic strength and a sharp editorial edge",
                "Throughout my career, I've had the opportunity to cover runway shows, showcase my work in exhibitions, and see my photography published in various fashion magazines.",
                "When I'm not behind the lens, you'll likely find me traveling or exploring new places to inspire my next project. I am available for both local and international assignments.",
              ].map((text, i) => (
                <p
                  key={i}
                  className="font-mono text-[13px] leading-relaxed"
                  style={{ color: "var(--text-3)" }}
                >
                  {text}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
