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

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBadges />
        <Brands />
        <Categories />
        <Featured />
        <Ofertas />
        <CtaWhatsapp />
        <PaymentMethods />
        <FaqAccordion />
      </main>
      <Footer />
    </>
  );
}
