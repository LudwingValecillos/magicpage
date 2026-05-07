/**
 * All site copy + mock data lives here.
 * - Brand & nav
 * - Hero
 * - Categories
 * - Products (used by home, catalog, product detail)
 * - Promo banner, store, newsletter, footer
 *
 * To add a product: append to `products`. The slug is the URL key.
 * To add a category: append to `categories` and ensure products reference its slug.
 */

export type BadgeKind = "new" | "hot" | "sale" | "exclusive";

export interface Category {
  slug: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badges?: BadgeKind[];
  icon: string;
  accent: string;
  description: string;
  details: string[];
}

export const site = {
  brand: "MAGIC",
  tagline: "Juguetería mágica",

  nav: [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/catalogo" },
    { label: "Marvel", href: "/catalogo?cat=marvel" },
    { label: "Disney", href: "/catalogo?cat=disney" },
    { label: "Local", href: "/#local" },
  ],

  hero: {
    eyebrow: "Una tienda · una experiencia",
    headline: ["La magia", "que crece", "contigo."],
    sub: "Juguetes, Marvel, Disney, coleccionables, ropa y todo lo que un universo infantil necesita. Curado con cariño, presentado con magia.",
    primaryCta: { label: "Explorar catálogo", href: "/catalogo" },
    secondaryCta: { label: "Ver lo nuevo", href: "/catalogo?filter=nuevo" },
    stats: [
      { k: "+2K", v: "Productos" },
      { k: "30+", v: "Marcas" },
      { k: "10★", v: "Curadoras" },
    ],
  },

  categories: [
    { slug: "juguetes", name: "Juguetes", count: 312, icon: "🪄", color: "#FF3D9A" },
    { slug: "marvel", name: "Marvel", count: 184, icon: "🛡️", color: "#FF5252" },
    { slug: "disney", name: "Disney", count: 226, icon: "🏰", color: "#3DCBFF" },
    { slug: "ropa", name: "Ropa", count: 158, icon: "👕", color: "#FF7AC0" },
    { slug: "coleccionables", name: "Coleccionables", count: 92, icon: "💎", color: "#8A5BFF" },
    { slug: "gaming", name: "Gaming", count: 74, icon: "🎮", color: "#7BE0FF" },
    { slug: "peluches", name: "Peluches", count: 121, icon: "🧸", color: "#FFD66B" },
    { slug: "escolares", name: "Escolares", count: 88, icon: "🎒", color: "#A4F3A4" },
  ] satisfies Category[],

  products: [
    { slug: "iron-cube", name: "Cubo Iron", category: "Marvel", categorySlug: "marvel", price: 24990, oldPrice: 29990, rating: 5, badges: ["hot", "sale"], icon: "🛡️", accent: "#FF5252", description: "Réplica oficial coleccionable con luz LED y sonido de activación.", details: ["Edad +6", "Materiales premium", "Edición limitada"] },
    { slug: "castillo-magico", name: "Castillo Mágico", category: "Disney", categorySlug: "disney", price: 89990, rating: 5, badges: ["new", "exclusive"], icon: "🏰", accent: "#3DCBFF", description: "Castillo con luces, música y figuritas de tus personajes favoritos.", details: ["Más de 200 piezas", "Sonido envolvente", "Edad +5"] },
    { slug: "stitch-jumbo", name: "Stitch Jumbo", category: "Peluches", categorySlug: "peluches", price: 19990, rating: 5, badges: ["hot"], icon: "🧸", accent: "#7BE0FF", description: "Peluche XXL ultra suave, ideal para abrazos y siestas mágicas.", details: ["80 cm", "Hipoalergénico", "Lavable"] },
    { slug: "spider-web", name: "Lanza-redes Spider", category: "Marvel", categorySlug: "marvel", price: 12990, rating: 4, badges: ["new"], icon: "🕸️", accent: "#FF3D9A", description: "Réplica funcional con luz, dispara redes de espuma seguras.", details: ["Edad +4", "Recargable", "Incluye 12 redes"] },
    { slug: "varita-elder", name: "Varita Elder", category: "Coleccionables", categorySlug: "coleccionables", price: 34990, rating: 5, badges: ["exclusive"], icon: "🪄", accent: "#8A5BFF", description: "Réplica fiel con caja Ollivander y certificado.", details: ["Resina premium", "Edición numerada", "Caja exhibidora"] },
    { slug: "switch-edition", name: "Switch Magic Edition", category: "Gaming", categorySlug: "gaming", price: 449990, rating: 5, badges: ["hot", "exclusive"], icon: "🎮", accent: "#7BE0FF", description: "Edición especial con joycons rosa y celeste, juego incluido.", details: ["Pantalla OLED", "Garantía oficial", "Bolsa de viaje"] },
    { slug: "mochila-galaxia", name: "Mochila Galaxia", category: "Escolares", categorySlug: "escolares", price: 18990, oldPrice: 23990, rating: 4, badges: ["sale"], icon: "🎒", accent: "#A4F3A4", description: "Mochila premium con detalles holográficos y compartimentos para todo.", details: ["3 compartimentos", "Acolchada", "Impermeable"] },
    { slug: "camiseta-elsa", name: "Camiseta Elsa", category: "Ropa", categorySlug: "ropa", price: 9990, rating: 4, badges: ["new"], icon: "👗", accent: "#FF7AC0", description: "Camiseta con estampado holográfico y detalles bordados.", details: ["Algodón orgánico", "Tallas 4-12", "Edición invierno"] },
    { slug: "lego-castillo", name: "LEGO Castillo Encantado", category: "Juguetes", categorySlug: "juguetes", price: 159990, rating: 5, badges: ["hot"], icon: "🏯", accent: "#FF3D9A", description: "Set premium con 1.200+ piezas, 4 minifiguras y dragón.", details: ["1.247 piezas", "Edad +8", "Manual ilustrado"] },
    { slug: "thor-hammer", name: "Mjölnir Réplica", category: "Marvel", categorySlug: "marvel", price: 39990, rating: 5, badges: ["exclusive"], icon: "🔨", accent: "#FFD66B", description: "Martillo de Thor con base, luces y sonido de relámpago.", details: ["Tamaño real", "Sonido envolvente", "Soporte de pared"] },
    { slug: "minnie-set", name: "Set Minnie Mouse", category: "Disney", categorySlug: "disney", price: 14990, rating: 4, badges: ["new"], icon: "🎀", accent: "#FF7AC0", description: "Set con peluche, accesorios y libro mágico de cuentos.", details: ["3 piezas", "Caja regalo", "Edad +3"] },
    { slug: "dino-roar", name: "Dino Roar", category: "Juguetes", categorySlug: "juguetes", price: 22990, rating: 4, badges: ["hot"], icon: "🦕", accent: "#A4F3A4", description: "Dinosaurio interactivo con sonidos, movimiento y luces realistas.", details: ["3 modos de juego", "Pilas incluidas", "Edad +5"] },
  ] satisfies Product[],

  promo: {
    eyebrow: "Edición limitada",
    title: "Universo Magic",
    sub: "30 productos exclusivos llegaron a la galaxia. Brillan, vuelan, conquistan.",
    cta: { label: "Ver colección", href: "/catalogo?filter=exclusivo" },
    poster: "🌌",
  },

  store: {
    label: "Visítanos",
    title: "Un local que también es un viaje.",
    body: "Estamos en pleno centro: vitrinas iluminadas, estantes interactivos y un rincón de magia donde los más chicos pueden probar antes de elegir. Te esperamos con una experiencia tan cuidada como nuestros productos.",
    address: "Av. Principal 1234, Centro",
    hours: "Lun a Sáb · 10:00 — 21:00",
    phone: "+54 11 0000-0000",
    cta: { label: "Cómo llegar", href: "https://maps.google.com" },
  },

  newsletter: {
    eyebrow: "Carta mágica",
    title: "Suscríbete y recibe novedades, promos y rituales exclusivos.",
    placeholder: "tu@email.com",
    cta: "Unirme",
    note: "Sin spam. Solo magia.",
  },

  footer: {
    cols: [
      {
        title: "Tienda",
        links: [
          { label: "Catálogo", href: "/catalogo" },
          { label: "Novedades", href: "/catalogo?filter=nuevo" },
          { label: "Ofertas", href: "/catalogo?filter=oferta" },
          { label: "Exclusivos", href: "/catalogo?filter=exclusivo" },
        ],
      },
      {
        title: "Categorías",
        links: [
          { label: "Marvel", href: "/catalogo?cat=marvel" },
          { label: "Disney", href: "/catalogo?cat=disney" },
          { label: "Gaming", href: "/catalogo?cat=gaming" },
          { label: "Peluches", href: "/catalogo?cat=peluches" },
        ],
      },
      {
        title: "Compañía",
        links: [
          { label: "Nuestra historia", href: "#" },
          { label: "Local", href: "#local" },
          { label: "Contacto", href: "#" },
          { label: "Trabajá con nosotros", href: "#" },
        ],
      },
      {
        title: "Ayuda",
        links: [
          { label: "Envíos", href: "#" },
          { label: "Cambios y devoluciones", href: "#" },
          { label: "Términos", href: "#" },
          { label: "Privacidad", href: "#" },
        ],
      },
    ],
    socials: [
      { label: "IG", href: "#" },
      { label: "TT", href: "#" },
      { label: "YT", href: "#" },
      { label: "FB", href: "#" },
    ],
    legal: "© 2026 Magic. Todos los derechos reservados.",
  },
} as const;

export type Site = typeof site;
