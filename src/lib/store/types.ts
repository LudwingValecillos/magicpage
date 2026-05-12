/**
 * Shared types for the client-side store layer.
 * Schema simplificado al acuerdo con el cliente.
 */

export type CategoriaSlug = "ropa" | "juguetes" | "accesorios";
export type MarcaSlug = "disney" | "marvel" | "otra";

export interface ProductImage {
  url: string;
  /** Path en Firebase Storage (productos/{id}/{nombre}). Vacío si la imagen no fue subida por nosotros. */
  storagePath: string;
}

export interface Product {
  /** URL key (también es el doc id en Firestore). Generado del nombre. */
  slug: string;
  nombre: string;
  precio: number;
  categoria: CategoriaSlug;
  marca: MarcaSlug;
  imagenes: ProductImage[];
  descripcion?: string;
  oferta: boolean;
  /** Requerido si oferta=true; mostrado tachado. */
  precioAnterior?: number;
  /** False = oculto del catálogo público. Default true. */
  activo: boolean;
  /** Timestamp ms — para ordenar por más nuevos. */
  createdAt?: number;
  updatedAt?: number;
}

export interface CategoriaInfo {
  slug: CategoriaSlug;
  nombre: string;
  emoji: string;
  color: string;
}

export interface MarcaInfo {
  slug: MarcaSlug;
  nombre: string;
}

export interface CartItem {
  slug: string;
  qty: number;
}

export interface AdminSession {
  user: string;
  loggedAt: number;
}

/** Datos del checkout que generan el mensaje de WhatsApp. */
export interface CheckoutData {
  nombre: string;
  telefono: string;
  entrega: "retiro" | "envio";
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pago: "efectivo" | "transferencia" | "otra";
  comentarios?: string;
}
