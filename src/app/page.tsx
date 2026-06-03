import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { Brands } from "@/components/sections/Brands";
import { Categories } from "@/components/sections/Categories";
import { Featured } from "@/components/sections/Featured";
import { Ofertas } from "@/components/sections/Ofertas";
import { CtaWhatsapp } from "@/components/sections/CtaWhatsapp";
import { PaymentMethods } from "@/components/sections/PaymentMethods";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Footer } from "@/components/sections/Footer";
import { SideCharacter } from "@/components/SideCharacter";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Brands />
        <Categories />
        {/* Stitch espiando desde la izquierda, entre Categorías y Destacados */}
        <SideCharacter src="/characters/cartoons-stitch-pack.png" side="left" width="w-52 xl:w-72" inset="-3rem" straight mobile mobileSide="right" mobileMirror mobileClassName="-top-16" className="-top-28" delay="0s" />
        <Featured />
        {/* Superman volando desde la derecha, entre Destacados y Ofertas */}
        <SideCharacter src="/characters/Superman_flight_Secret_Origins_no6.webp" side="right" width="w-44 xl:w-60" className="-top-24" delay="-2s" />
        <Ofertas />
        {/* Spider-Man desde la izquierda, entre Ofertas y Confianza */}
        <SideCharacter src="/characters/who-has-better-fanmade-content-v0-as4rnxryw7bf1.png" side="left" className="-top-20" delay="-3s" />
        <TrustBadges />
        {/* Hello Kitty (gif) desde la derecha, entre Confianza y Pagos */}
        <SideCharacter src="/characters/c5248ed334ed6965c2167910024da02d.gif" side="right" className="-top-16" delay="-4s" />
        <PaymentMethods />
        <CtaWhatsapp />
        <FaqAccordion />
      </main>
      <Footer />
    </>
  );
}
