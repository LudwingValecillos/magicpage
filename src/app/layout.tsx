import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { CartDrawer } from "@/components/overlays/CartDrawer";
import { SearchModal } from "@/components/overlays/SearchModal";
import { LoginModal } from "@/components/overlays/LoginModal";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magic — Juguetería mágica",
  description: "Juguetes, Marvel, Disney, coleccionables, ropa y más. Una experiencia mágica.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body className="noise antialiased" suppressHydrationWarning>
        <StoreProvider>
          {children}
          <CartDrawer />
          <SearchModal />
          <LoginModal />
        </StoreProvider>
      </body>
    </html>
  );
}
