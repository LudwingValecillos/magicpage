/**
 * All site copy + mock data lives here.
 *
 * Sections:
 *   - brand & nav
 *   - hero
 *   - categories      (universal categories)
 *   - brands          (licensed brand showcases — Disney/Marvel/Stitch/Frozen)
 *   - seasons         (Halloween, Navidad, Verano, Colegio)
 *   - products        (used by home, catalog, product detail)
 *   - promo, store, newsletter, footer
 *
 * To add a product: append to `products`. Slug is the URL key.
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

export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  bgFrom: string;
  bgTo: string;
}

export interface Season {
  slug: string;
  name: string;
  sub: string;
  icon: string;
  color: string;
  active?: boolean;
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
    { slug: "juguetes", name: "Juguetes", count: 312, icon: "🪄", color: "#4DA8FF" },
    { slug: "marvel", name: "Marvel", count: 184, icon: "🛡️", color: "#FF3B3B" },
    { slug: "disney", name: "Disney", count: 226, icon: "🏰", color: "#4DA8FF" },
    { slug: "ropa", name: "Ropa", count: 158, icon: "👕", color: "#FF5FA2" },
    { slug: "coleccionables", name: "Coleccionables", count: 92, icon: "💎", color: "#8B5CF6" },
    { slug: "gaming", name: "Gaming", count: 74, icon: "🎮", color: "#60A5FA" },
    { slug: "peluches", name: "Peluches", count: 121, icon: "🧸", color: "#FF77C8" },
    { slug: "escolares", name: "Escolares", count: 88, icon: "🎒", color: "#FFD66B" },
  ] satisfies Category[],

  /** Licensed brand showcases — used by <Brands>. */
  brands: [
    { slug: "marvel", name: "Marvel", tagline: "Héroes que inspiran", icon: "🛡️", color: "#FF3B3B", bgFrom: "#1a0e1f", bgTo: "#0B1020" },
    { slug: "disney", name: "Disney", tagline: "Magia clásica", icon: "🏰", color: "#4DA8FF", bgFrom: "#0f1530", bgTo: "#0B1020" },
    { slug: "stitch", name: "Stitch", tagline: "Ohana significa familia", icon: "👽", color: "#5BC0EB", bgFrom: "#0e1f2e", bgTo: "#0B1020" },
    { slug: "frozen", name: "Frozen", tagline: "Suéltalo", icon: "❄️", color: "#9DD0FF", bgFrom: "#0f1a2e", bgTo: "#0B1020" },
  ] satisfies Brand[],

  /** Seasonal collections — used by <Seasons>. */
  seasons: [
    { slug: "colegio", name: "Vuelta al cole", sub: "Mochilas, útiles, lunchera", icon: "🎒", color: "#FFD66B", active: true },
    { slug: "halloween", name: "Halloween", sub: "Disfraces, magia, terror suave", icon: "🎃", color: "#FB923C" },
    { slug: "navidad", name: "Navidad", sub: "Regalos que se recuerdan", icon: "🎄", color: "#FF3B3B" },
    { slug: "verano", name: "Verano", sub: "Pileta, playa, aventuras", icon: "☀️", color: "#FFD66B" },
  ] satisfies Season[],

  products: [
    { slug: "iron-cube", name: "Cubo Iron", category: "Marvel", categorySlug: "marvel", price: 24990, oldPrice: 29990, rating: 5, badges: ["hot", "sale"], icon: "🛡️", accent: "#FF3B3B", description: "Réplica oficial coleccionable con luz LED y sonido de activación.", details: ["Edad +6", "Materiales premium", "Edición limitada"] },
    { slug: "castillo-magico", name: "Castillo Mágico", category: "Disney", categorySlug: "disney", price: 89990, rating: 5, badges: ["new", "exclusive"], icon: "🏰", accent: "#4DA8FF", description: "Castillo con luces, música y figuritas de tus personajes favoritos.", details: ["Más de 200 piezas", "Sonido envolvente", "Edad +5"] },
    { slug: "stitch-jumbo", name: "Stitch Jumbo", category: "Peluches", categorySlug: "peluches", price: 19990, rating: 5, badges: ["hot"], icon: "🧸", accent: "#5BC0EB", description: "Peluche XXL ultra suave, ideal para abrazos y siestas mágicas.", details: ["80 cm", "Hipoalergénico", "Lavable"] },
    { slug: "spider-web", name: "Lanza-redes Spider", category: "Marvel", categorySlug: "marvel", price: 12990, rating: 4, badges: ["new"], icon: "🕸️", accent: "#FF3B3B", description: "Réplica funcional con luz, dispara redes de espuma seguras.", details: ["Edad +4", "Recargable", "Incluye 12 redes"] },
    { slug: "varita-elder", name: "Varita Elder", category: "Coleccionables", categorySlug: "coleccionables", price: 34990, rating: 5, badges: ["exclusive"], icon: "🪄", accent: "#8B5CF6", description: "Réplica fiel con caja Ollivander y certificado.", details: ["Resina premium", "Edición numerada", "Caja exhibidora"] },
    { slug: "switch-edition", name: "Switch Magic Edition", category: "Gaming", categorySlug: "gaming", price: 449990, rating: 5, badges: ["hot", "exclusive"], icon: "🎮", accent: "#60A5FA", description: "Edición especial con joycons celeste y rosa, juego incluido.", details: ["Pantalla OLED", "Garantía oficial", "Bolsa de viaje"] },
    { slug: "mochila-galaxia", name: "Mochila Galaxia", category: "Escolares", categorySlug: "escolares", price: 18990, oldPrice: 23990, rating: 4, badges: ["sale"], icon: "🎒", accent: "#FFD66B", description: "Mochila premium con detalles holográficos y compartimentos para todo.", details: ["3 compartimentos", "Acolchada", "Impermeable"] },
    { slug: "camiseta-elsa", name: "Camiseta Elsa", category: "Ropa", categorySlug: "ropa", price: 9990, rating: 4, badges: ["new"], icon: "👗", accent: "#9DD0FF", description: "Camiseta con estampado holográfico de Frozen y detalles bordados.", details: ["Algodón orgánico", "Tallas 4-12", "Edición invierno"] },
    { slug: "lego-castillo", name: "LEGO Castillo Encantado", category: "Juguetes", categorySlug: "juguetes", price: 159990, rating: 5, badges: ["hot"], icon: "🏯", accent: "#4DA8FF", description: "Set premium con 1.200+ piezas, 4 minifiguras y dragón.", details: ["1.247 piezas", "Edad +8", "Manual ilustrado"] },
    { slug: "thor-hammer", name: "Mjölnir Réplica", category: "Marvel", categorySlug: "marvel", price: 39990, rating: 5, badges: ["exclusive"], icon: "🔨", accent: "#FFD66B", description: "Martillo de Thor con base, luces y sonido de relámpago.", details: ["Tamaño real", "Sonido envolvente", "Soporte de pared"] },
    { slug: "minnie-set", name: "Set Minnie Mouse", category: "Disney", categorySlug: "disney", price: 14990, rating: 4, badges: ["new"], icon: "🎀", accent: "#FF5FA2", description: "Set con peluche, accesorios y libro mágico de cuentos.", details: ["3 piezas", "Caja regalo", "Edad +3"] },
    { slug: "dino-roar", name: "Dino Roar", category: "Juguetes", categorySlug: "juguetes", price: 22990, rating: 4, badges: ["hot"], icon: "🦕", accent: "#4DA8FF", description: "Dinosaurio interactivo con sonidos, movimiento y luces realistas.", details: ["3 modos de juego", "Pilas incluidas", "Edad +5"] },
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
