"use client";

/**
 * CheckoutForm — datos del cliente + entrega + pago → arma mensaje y abre WhatsApp.
 * No procesa pago. Se confirma todo por WhatsApp con el negocio.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store/useCart";
import { checkoutMessage, whatsappLink, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import type { CheckoutData } from "@/lib/store/types";
import { MagicButton } from "@/components/ui/MagicButton";

type Done = { nombre: string; count: number; total: number; url: string };

export function CheckoutForm() {
  const { items, count, subtotal, clear } = useCart();

  const [data, setData] = useState<CheckoutData>({
    nombre: "",
    telefono: "",
    entrega: "retiro",
    direccion: "",
    ciudad: "",
    provincia: "",
    pago: "transferencia",
    comentarios: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const setField = <K extends keyof CheckoutData>(k: K, v: CheckoutData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const message = useMemo(
    () => checkoutMessage(data, items, subtotal),
    [data, items, subtotal],
  );

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 md:py-20 flex flex-col items-center">
        <div className="relative grid place-items-center w-24 h-24 rounded-full bg-[var(--color-mint)]/15 [animation:fade-img_.5s_var(--ease-out-quart)]">
          <span className="absolute inset-0 rounded-full bg-[var(--color-mint)]/20 pulse-soft" />
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-mint)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative"
          >
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <h1 className="display text-3xl md:text-4xl mt-6 text-[var(--color-ink)]">
          ¡Listo, {done.nombre.split(" ")[0] || "gracias"}! 🎉
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)] max-w-md">
          Te abrimos WhatsApp con tu pedido de{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {done.count} {done.count === 1 ? "producto" : "productos"}
          </span>{" "}
          por{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            ${done.total.toLocaleString("es-AR")}
          </span>
          . Coordinamos pago y entrega por chat.
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-mute)]">
          ¿No se abrió el chat? Tocá el botón de abajo.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={done.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-[#25D366] shadow-[0_10px_24px_-10px_rgba(37,211,102,0.55)] hover:bg-[#1ebe57] [transition:background-color_.2s,transform_.2s]"
          >
            📱 Abrir WhatsApp
          </a>
          <MagicButton href="/catalogo" variant="ghost">
            Seguir comprando
          </MagicButton>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <span className="text-6xl float-soft inline-block">🛍️</span>
        <h1 className="display text-3xl md:text-4xl mt-4 text-[var(--color-ink)]">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Agregá algunos productos antes de finalizar la compra.
        </p>
        <div className="mt-8">
          <MagicButton href="/catalogo" variant="primary" icon={<span aria-hidden>→</span>}>
            Ir al catálogo
          </MagicButton>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!data.nombre.trim()) return setError("Tu nombre es obligatorio.");
    if (!data.telefono.trim()) return setError("Necesitamos tu teléfono.");
    if (data.entrega === "envio" && !data.direccion?.trim()) {
      return setError("Indicá la dirección de envío.");
    }
    if (!WHATSAPP_NUMBER) {
      return setError("El número de WhatsApp del negocio no está configurado.");
    }
    const url = whatsappLink(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setDone({ nombre: data.nombre, count, total: subtotal, url });
    clear();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="text-xs uppercase tracking-widest text-[var(--color-ink-mute)] hover:text-[var(--color-sky-deep)] transition-colors"
      >
        ← Volver a la tienda
      </Link>
      <div className="mt-3">
        <span className="eyebrow">Finalizar compra</span>
        <h1 className="display text-3xl md:text-4xl mt-2 text-[var(--color-ink)]">
          Confirmamos el pedido por WhatsApp.
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)] max-w-2xl">
          Completá los datos y te abrimos WhatsApp con el pedido pre-armado.
          Coordinamos pago y entrega por chat — no se procesa ninguna tarjeta acá.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
        <div className="flex flex-col gap-5">
          <Section title="Tus datos">
            <Field label="Nombre y apellido">
              <input
                type="text"
                required
                value={data.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                className="co-input"
                placeholder="Ej. Lucía Pérez"
              />
            </Field>
            <Field label="Teléfono / WhatsApp">
              <input
                type="tel"
                required
                value={data.telefono}
                onChange={(e) => setField("telefono", e.target.value)}
                className="co-input"
                placeholder="11 1234 5678"
              />
            </Field>
          </Section>

          <Section title="Entrega">
            <div className="flex gap-2">
              {/* --- RETIRO EN LOCAL OCULTO (pedido del cliente) -------------
                  Se reemplazó "Retiro en local · Shopping Devoto" por
                  "Coordinar por WhatsApp": no se expone ubicación física, el
                  retiro (si aplica) lo maneja el vendedor por chat. El valor
                  interno sigue siendo "retiro". Reactivar cuando haya sucursal:
              <RadioCard
                checked={data.entrega === "retiro"}
                onClick={() => setField("entrega", "retiro")}
                icon="🏬"
                title="Retiro en local"
                sub="Shopping Devoto"
              />
                  -------------------------------------------------------------- */}
              <RadioCard
                checked={data.entrega === "retiro"}
                onClick={() => setField("entrega", "retiro")}
                icon="💬"
                title="Coordinar por WhatsApp"
                sub="Lo arreglamos por chat"
              />
              <RadioCard
                checked={data.entrega === "envio"}
                onClick={() => setField("entrega", "envio")}
                icon="🚚"
                title="Envío a domicilio"
                sub="Coordinado"
              />
            </div>

            {data.entrega === "envio" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <Field label="Dirección" full>
                  <input
                    type="text"
                    value={data.direccion ?? ""}
                    onChange={(e) => setField("direccion", e.target.value)}
                    className="co-input"
                    placeholder="Calle, número, depto..."
                  />
                </Field>
                <Field label="Ciudad">
                  <input
                    type="text"
                    value={data.ciudad ?? ""}
                    onChange={(e) => setField("ciudad", e.target.value)}
                    className="co-input"
                  />
                </Field>
                <Field label="Provincia">
                  <input
                    type="text"
                    value={data.provincia ?? ""}
                    onChange={(e) => setField("provincia", e.target.value)}
                    className="co-input"
                  />
                </Field>
              </div>
            )}
          </Section>

          <Section title="Forma de pago preferida">
            <div className="grid grid-cols-3 gap-2">
              <PaymentCard
                checked={data.pago === "efectivo"}
                onClick={() => setField("pago", "efectivo")}
                icon="💵"
                label="Efectivo"
              />
              <PaymentCard
                checked={data.pago === "transferencia"}
                onClick={() => setField("pago", "transferencia")}
                icon="🏦"
                label="Transferencia"
              />
              <PaymentCard
                checked={data.pago === "otra"}
                onClick={() => setField("pago", "otra")}
                icon="💬"
                label="A coordinar"
              />
            </div>
            <p className="text-xs text-[var(--color-ink-mute)] mt-2">
              Es preferencia. El medio final lo terminamos de definir por WhatsApp.
            </p>
          </Section>

          <Section title="Comentarios (opcional)">
            <textarea
              rows={3}
              value={data.comentarios ?? ""}
              onChange={(e) => setField("comentarios", e.target.value)}
              className="co-input"
              placeholder="Talles, colores, fecha de entrega esperada..."
            />
          </Section>

          {error && (
            <div className="px-5 py-3 rounded-2xl bg-[var(--color-pink-tint)] border border-[var(--color-pink-soft)] text-sm text-[var(--color-pink-deep)]">
              {error}
            </div>
          )}
        </div>

        {/* resumen */}
        <aside className="card p-5 h-fit lg:sticky lg:top-32">
          <h3 className="text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
            Resumen del pedido
          </h3>
          <ul className="mt-3 flex flex-col gap-2 max-h-72 overflow-y-auto">
            {items.map(({ product, qty }) => (
              <li
                key={product.slug}
                className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)]"
              >
                <span className="shrink-0 w-2 h-2 rounded-full bg-[var(--color-sky)]" />
                <span className="flex-1 truncate">
                  {product.nombre}{" "}
                  <span className="text-[var(--color-ink-mute)]">× {qty}</span>
                </span>
                <span className="font-semibold text-[var(--color-ink)]">
                  ${(product.precio * qty).toLocaleString("es-AR")}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-[var(--color-rule)] flex items-end justify-between">
            <span className="text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
              Total
            </span>
            <span className="font-display text-2xl text-[var(--color-ink)] tracking-tight">
              ${subtotal.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            type="submit"
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-[#25D366] shadow-[0_10px_24px_-10px_rgba(37,211,102,0.55)] hover:bg-[#1ebe57] transition-colors"
          >
            📱 Confirmar por WhatsApp
          </button>
          <p className="mt-2 text-[0.65rem] text-[var(--color-ink-mute)] text-center uppercase tracking-widest">
            Te abrimos un chat con el pedido pre-armado
          </p>
        </aside>
      </form>

      <style jsx>{`
        :global(.co-input) {
          width: 100%;
          background: white;
          border: 1px solid var(--color-rule);
          border-radius: 0.875rem;
          padding: 0.625rem 0.875rem;
          color: var(--color-ink);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        :global(.co-input::placeholder) {
          color: var(--color-ink-mute);
        }
        :global(.co-input:focus) {
          border-color: var(--color-sky);
          box-shadow: 0 0 0 3px var(--color-sky-tint);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <h3 className="text-[0.7rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs text-[var(--color-ink-soft)] font-semibold">{label}</span>
      {children}
    </label>
  );
}

function RadioCard({
  checked,
  onClick,
  icon,
  title,
  sub,
}: {
  checked: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`relative flex-1 p-3 rounded-2xl border-2 text-left [transition:background-color_.2s,border-color_.2s] ${
        checked
          ? "bg-[var(--color-sky-tint)] border-[var(--color-sky)]"
          : "bg-white border-[var(--color-rule)] hover:border-[var(--color-sky-soft)]"
      }`}
    >
      {checked && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[var(--color-sky)] text-white grid place-items-center text-[0.6rem] font-bold">
          ✓
        </span>
      )}
      <span className="text-2xl block">{icon}</span>
      <span className="block font-semibold text-[var(--color-ink)] mt-1">{title}</span>
      <span className="block text-xs text-[var(--color-ink-mute)]">{sub}</span>
    </button>
  );
}

function PaymentCard({
  checked,
  onClick,
  icon,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`p-3 rounded-2xl border-2 text-center [transition:background-color_.2s,border-color_.2s] ${
        checked
          ? "bg-[var(--color-sky-tint)] border-[var(--color-sky)]"
          : "bg-white border-[var(--color-rule)] hover:border-[var(--color-sky-soft)]"
      }`}
    >
      <span className="text-xl block">{icon}</span>
      <span className="block text-xs font-semibold text-[var(--color-ink)] mt-1">
        {label}
      </span>
    </button>
  );
}
