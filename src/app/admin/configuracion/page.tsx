"use client";

/**
 * Admin — Configuración de la tienda.
 * Por ahora: número de WhatsApp (editable, guardado en la DB).
 * Al guardar, valida/normaliza el formato argentino y actualiza el número
 * que usan el botón flotante, el carrito, el checkout, el footer, etc.
 */

import { useEffect, useState } from "react";
import { normalizeArgentinePhone, prettyArgentine } from "@/lib/phone";

export default function AdminSettingsPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Cargar el número actual
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as { whatsappNumber?: string };
          setValue(json.whatsappNumber ?? "");
        }
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Preview en vivo de cómo quedará normalizado
  const preview = value.trim() ? normalizeArgentinePhone(value) : null;

  const handleSave = async () => {
    setMsg(null);
    const normalized = normalizeArgentinePhone(value);
    if (!normalized.valid) {
      setMsg({ type: "err", text: normalized.error ?? "Número inválido." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: value }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: json.error ?? "No se pudo guardar." });
      } else {
        setValue(json.whatsappNumber ?? normalized.value);
        setMsg({
          type: "ok",
          text: `Guardado. Número activo: ${json.pretty ?? prettyArgentine(json.whatsappNumber)}`,
        });
      }
    } catch {
      setMsg({ type: "err", text: "Error de red al guardar." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-[var(--color-ink)] mb-1">Configuración</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-6">
        Número de WhatsApp que usa toda la tienda (botón flotante, carrito, checkout, footer).
      </p>

      <div className="rounded-2xl border border-[var(--color-rule)] bg-white p-5">
        <label htmlFor="wa" className="block text-sm font-semibold text-[var(--color-ink)] mb-1">
          Número de WhatsApp
        </label>
        <p className="text-xs text-[var(--color-ink-soft)] mb-2">
          Podés escribirlo como quieras (con +54, con 0, con 15, con espacios). Se normaliza solo.
          Ejemplo: <code>11 2345-6789</code> o <code>+54 9 11 2345 6789</code>.
        </p>
        <input
          id="wa"
          type="tel"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setMsg(null);
          }}
          disabled={loading}
          placeholder={loading ? "Cargando…" : "Ej: 11 2345-6789"}
          className="w-full rounded-xl border border-[var(--color-rule)] px-3 py-2.5 text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sky)]"
        />

        {/* Preview de normalización */}
        {preview && (
          <div className="mt-2 text-xs">
            {preview.valid ? (
              <span className="text-[var(--color-mint-deep,#3a9d5d)]">
                ✓ Se guardará como: <strong>{preview.pretty}</strong>{" "}
                <span className="text-[var(--color-ink-soft)]">({preview.value})</span>
              </span>
            ) : (
              <span className="text-red-500">{preview.error}</span>
            )}
          </div>
        )}

        {msg && (
          <div
            className={`mt-3 text-sm rounded-lg px-3 py-2 ${
              msg.type === "ok"
                ? "bg-[var(--color-mint-tint,#e8f7ee)] text-[var(--color-mint-deep,#2f7d4a)]"
                : "bg-red-50 text-red-600"
            }`}
          >
            {msg.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || loading || (preview ? !preview.valid : true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] text-white font-semibold px-5 py-2.5 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {saving ? "Guardando…" : "Guardar número"}
        </button>
      </div>
    </div>
  );
}
