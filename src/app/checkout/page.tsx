import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { CheckoutForm } from "@/components/sections/CheckoutForm";

export const metadata = {
  title: "Finalizar compra — Magic",
  description: "Completá tus datos para coordinar el pedido por WhatsApp.",
};

export default function CheckoutPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-16 px-[var(--gutter)]" style={{ ["--gutter" as string]: "clamp(1.25rem, 4vw, 3rem)" } as React.CSSProperties}>
        <CheckoutForm />
      </main>
      <Footer />
    </>
  );
}
