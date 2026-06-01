import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartDrawer } from "@/components/overlays/CartDrawer";
import { SearchModal } from "@/components/overlays/SearchModal";
import { LoginModal } from "@/components/overlays/LoginModal";
import { FloatingWhatsapp } from "@/components/sections/FloatingWhatsapp";
import { site } from "@/content/site";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — ${site.tagline}`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <StoreProvider>
          <SmoothScroll />
          {children}
          <CartDrawer />
          <SearchModal />
          <LoginModal />
          <FloatingWhatsapp />
        </StoreProvider>
      </body>
    </html>
  );
}
