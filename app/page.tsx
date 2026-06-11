import Header from "@/components/Header";
import HomeCarousel from "@/components/HomeCarousel";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <HomeCarousel />

      {/* Hero title — overlaid on carousel, below header */}
      <div
        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-16"
        style={{ paddingTop: "5rem" }}
      >
        <h1
          className="font-handwriting text-white leading-none mb-3"
          style={{
            fontSize: "clamp(3rem, 10vw, 7.5rem)",
            textShadow: "0 2px 24px rgba(0,0,0,0.7)",
          }}
        >
          Sebastian Calle
        </h1>
        <p
          className="font-mono tracking-[0.3em] uppercase"
          style={{
            fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
            color: "rgba(255,255,255,0.55)",
            textShadow: "0 1px 8px rgba(0,0,0,0.8)",
          }}
        >
          Photographer &amp; Retoucher
        </p>
      </div>
    </div>
  );
}
