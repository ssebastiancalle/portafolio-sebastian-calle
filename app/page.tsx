import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Divider */}
        <div className="mx-8 border-t border-[#111]" />

        <AboutSection />
        <Footer />
      </main>
    </>
  );
}
