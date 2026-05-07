import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CatalogView } from "@/components/sections/CatalogView";

export const metadata = {
  title: "Catálogo — Magic",
  description: "Explora todos nuestros productos: juguetes, Marvel, Disney, gaming y más.",
};

export default function CatalogPage() {
  return (
    <>
      <Nav />
      <main className="pt-32">
        <CatalogView />
      </main>
      <Footer />
    </>
  );
}
