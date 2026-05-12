/**
 * Copy + datos estáticos del sitio.
 *
 * Los productos NO viven acá — vienen de Firestore (vía StoreProvider).
 * Acá solo: brand, nav, hero copy, categorías fijas, footer, FAQ.
 *
 * Variables como `whatsappNumero`, `direccion`, `mapsEmbedSrc` se leen de
 * env vars / Firestore config para que el cliente pueda cambiarlas.
 */

import type { CategoriaInfo, MarcaInfo } from "@/lib/store/types";

export const site = {
  brand: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Magic",
  tagline: "Productos oficiales Disney y Marvel — ropa, juguetes y accesorios",

  nav: [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Ofertas", href: "/catalogo?oferta=1" },
    { label: "Local", href: "/#local" },
  ],

  hero: {
    eyebrow: "Tienda Magic · Shopping Devoto",
    headline: ["Productos oficiales", "Disney y Marvel."],
    sub: "Ropa, juguetes y accesorios para los más chicos. Curado con cariño.",
    primaryCta: { label: "Ver catálogo", href: "/catalogo" },
    secondaryCta: { label: "Ver ofertas", href: "/catalogo?oferta=1" },
  },

  /** Categorías fijas del cliente — NO se editan desde admin. */
  categorias: [
    { slug: "ropa", nombre: "Ropa", emoji: "👕", color: "#3DB5E0" },
    { slug: "juguetes", nombre: "Juguetes", emoji: "🧸", color: "#FF6BAA" },
    { slug: "accesorios", nombre: "Accesorios", emoji: "🎒", color: "#FFD93D" },
  ] satisfies CategoriaInfo[],

  /** Marcas — filtro secundario opcional. */
  marcas: [
    { slug: "disney", nombre: "Disney" },
    { slug: "marvel", nombre: "Marvel" },
    { slug: "otra", nombre: "Otros" },
  ] satisfies MarcaInfo[],

  local: {
    direccion: "Quevedo 3365, C1417 CABA — Shopping Devoto",
    horarios: "Lun a Sáb 10:00 – 22:00 · Dom 12:00 – 21:00",
    instagram: "https://instagram.com/magic.devoto",
    facebook: "",
    tiktok: "",
    /** Solo la URL dentro de src="..." del iframe de Google Maps. */
    mapsEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.703005379882!2d-58.51998072339833!3d-34.61167085791968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb7006daa6a61%3A0x8fa434faca93bc2d!2sMagic%20Store%20Devoto%20Shopping!5e0!3m2!1ses!2sar!4v1778604170714!5m2!1ses!2sar",
  },

  faq: [
    {
      q: "¿Hacen envíos?",
      a: "Sí, coordinamos envío a domicilio por mensajería. También podés retirar gratis en el local del Shopping Devoto.",
    },
    {
      q: "¿Qué formas de pago aceptan?",
      a: "Efectivo, transferencia bancaria y otros medios. La forma final la confirmamos por WhatsApp cuando coordinamos el pedido.",
    },
    {
      q: "¿Cómo compro?",
      a: "Elegí los productos, agregalos al carrito y cuando finalices la compra te abrimos WhatsApp con el pedido pre-armado. Confirmamos disponibilidad y coordinamos pago + entrega.",
    },
    {
      q: "¿Los productos son originales?",
      a: "Sí. Trabajamos con productos oficiales y licenciados de Disney y Marvel.",
    },
    {
      q: "¿Tienen cambios o devoluciones?",
      a: "Sí, escribinos por WhatsApp dentro de los días posteriores a la compra y te coordinamos el cambio.",
    },
  ],

  footer: {
    legal: `© ${new Date().getFullYear()} · Tienda Magic Shopping Devoto`,
  },
} as const;

export type Site = typeof site;
