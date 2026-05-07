import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Categories } from "@/components/sections/Categories";
import { Featured } from "@/components/sections/Featured";
import { TopSellers } from "@/components/sections/TopSellers";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { StoreLocation } from "@/components/sections/StoreLocation";
import { Newsletter } from "@/components/sections/Newsletter";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <Featured />
        <PromoBanner />
        <TopSellers />
        <StoreLocation />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
