import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { site } from "@/content/site";

export function generateStaticParams() {
  return site.products.map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = site.products.find((p) => p.slug === slug);
  if (!product) return { title: "Producto — Magic" };
  return {
    title: `${product.name} — Magic`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = site.products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = site.products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <Nav />
      <main className="pt-32">
        <ProductDetail product={product} related={related} />
      </main>
      <Footer />
    </>
  );
}
