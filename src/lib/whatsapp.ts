/**
 * Generadores de URL WhatsApp + mensajes pre-armados.
 *
 * Número viene de NEXT_PUBLIC_WHATSAPP_NUMBER (sin "+", formato internacional).
 * Si está vacío, se usa un placeholder y el botón flota igual pero el href
 * no llevará a ningún chat.
 */

import type { CartItem, CheckoutData, Product } from "@/lib/store/types";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Construye el link de WhatsApp. El número es opcional: si no se pasa, usa el
 * del env (compatibilidad). En la app, pasá el número dinámico del store.
 */
export function whatsappLink(message: string, number?: string): string {
  const num = (number ?? WHATSAPP_NUMBER).trim();
  const base = num ? `https://wa.me/${num}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Botón flotante global — mensaje genérico. */
export function genericInquiry(): string {
  return "¡Hola! Estoy mirando la tienda y tengo una consulta.";
}

/** Botón "Consultar por WhatsApp" en página de producto. */
export function productInquiry(p: Product): string {
  return [
    "¡Hola! Tengo una consulta sobre este producto:",
    "",
    `*${p.nombre}*`,
    `Precio: $${p.precio.toLocaleString("es-AR")}`,
    `Categoría: ${p.categoria}`,
    "",
    `Link: ${typeof window !== "undefined" ? window.location.href : ""}`,
  ].join("\n");
}

/** Mensaje completo del checkout. */
export function checkoutMessage(
  data: CheckoutData,
  items: Array<{ product: Product; qty: number }>,
  total: number,
): string {
  const lines: string[] = [];
  lines.push("🛒 *NUEVO PEDIDO*");
  lines.push("");
  lines.push("👤 *Datos del cliente:*");
  lines.push(`Nombre: ${data.nombre}`);
  lines.push(`Teléfono: ${data.telefono}`);
  lines.push("");
  // "retiro" ya no significa retiro en local físico (pedido del cliente):
  // ahora es "a coordinar por WhatsApp". Reactivar "Retiro en local" si abren sucursal.
  lines.push(`📦 *Forma de entrega:* ${data.entrega === "retiro" ? "A coordinar por WhatsApp" : "Envío a domicilio"}`);
  if (data.entrega === "envio") {
    lines.push(`📍 Dirección: ${data.direccion ?? ""}`);
    if (data.ciudad) lines.push(`Ciudad: ${data.ciudad}`);
    if (data.provincia) lines.push(`Provincia: ${data.provincia}`);
  }
  lines.push("");
  const pagoLabel = data.pago === "efectivo"
    ? "Efectivo"
    : data.pago === "transferencia"
      ? "Transferencia"
      : "Otra";
  lines.push(`💵 *Forma de pago:* ${pagoLabel}`);
  if (data.comentarios) {
    lines.push("");
    lines.push(`📝 *Comentarios:* ${data.comentarios}`);
  }
  lines.push("");
  lines.push("🛍️ *Productos:*");
  items.forEach((it, i) => {
    lines.push(
      `${i + 1}. ${it.product.nombre} (x${it.qty}) - $${(it.product.precio * it.qty).toLocaleString("es-AR")}`,
    );
  });
  lines.push("");
  lines.push(`💰 *TOTAL: $${total.toLocaleString("es-AR")}*`);
  return lines.join("\n");
}

/** Lo mismo pero a partir del cart raw (slug+qty). Útil para tests. */
export function checkoutMessageFromCart(
  data: CheckoutData,
  cart: CartItem[],
  products: Product[],
  total: number,
): string {
  const items = cart
    .map((ci) => {
      const product = products.find((p) => p.slug === ci.slug);
      return product ? { product, qty: ci.qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);
  return checkoutMessage(data, items, total);
}
