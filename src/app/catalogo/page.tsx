import { Suspense } from "react";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CatalogView } from "@/components/sections/CatalogView";

export const metadata = {
  title: "Catálogo — Magic",
  description: "Productos oficiales Disney y Marvel: ropa, juguetes y accesorios.",
};

export default function CatalogPage() {
  return (
    <>
      <Nav />
      <main className="pt-32">
        <Suspense fallback={<div className="px-6 py-20 text-center text-[var(--color-ink-mute)]">Cargando catálogo...</div>}>
          <CatalogView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
