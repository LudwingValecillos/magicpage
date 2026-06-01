import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { site } from "@/content/site";

/**
 * Product page — fully dynamic so admin-added products work without a rebuild.
 * The actual product lookup happens client-side in <ProductDetail> via useProducts().
 */

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  return { title: `${slug} — ${site.brand}` };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <>
      <Nav />
      <main className="pt-32">
        <ProductDetail slug={slug} />
      </main>
      <Footer />
    </>
  );
}
