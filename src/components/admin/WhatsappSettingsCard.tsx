"use client";

/**
 * Card del dashboard que muestra el número de WhatsApp actual y permite
 * editarlo en un modal. Reemplaza la página /admin/configuracion.
 */

import { useEffect, useState } from "react";
import { normalizeArgentinePhone, prettyArgentine } from "@/lib/phone";

export function WhatsappSettingsCard() {
  const [current, setCurrent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadNumber = async () => {
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as { whatsappNumber?: string };
        setCurrent(json.whatsappNumber ?? "");
      }
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNumber();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="card card-hover p-5 flex items-center gap-4 text-left w-full"
      >
        <span className="w-12 h-12 rounded-2xl bg-[var(--color-mint-tint,#e8f7ee)] grid place-items-center text-2xl shrink-0">
          💬
        </span>
        <div className="flex-1 min-w-0">
          <span className="block font-semibold text-[var(--color-ink)]">
            WhatsApp del negocio
          </span>
          <span className="block text-xs text-[var(--color-ink-mute)]">
            {loading
              ? "Cargando…"
              : current
                ? prettyArgentine(current)
                : "Sin número configurado"}
          </span>
        </div>
        <span className="text-xs uppercase tracking-widest text-[var(--color-sky-deep)] font-semibold shrink-0">
          Editar
        </span>
      </button>

      {open && (
        <WhatsappModal
          initial={current}
          onClose={() => setOpen(false)}
          onSaved={(val) => {
            setCurrent(val);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

function WhatsappModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: string;
  onClose: () => void;
  onSaved: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const preview = value.trim() ? normalizeArgentinePhone(value) : null;

  const handleSave = async () => {
    setError(null);
    const normalized = normalizeArgentinePhone(value);
    if (!normalized.valid) {
      setError(normalized.error ?? "Número inválido.");
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
        setError(json.error ?? "No se pudo guardar.");
      } else {
        onSaved(json.whatsappNumber ?? normalized.value);
      }
    } catch {
      setError("Error de red al guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-2xl bg-[var(--color-mint-tint,#e8f7ee)] grid place-items-center text-xl">
            💬
          </span>
          <h2 className="font-display text-xl text-[var(--color-ink)]">
            Número de WhatsApp
          </h2>
        </div>
        <p className="text-xs text-[var(--color-ink-soft)] mb-4">
          Lo usa toda la tienda: botón flotante, carrito, checkout y footer.
          Escribilo como quieras (con +54, con 0, con 15 o solo el número); se
          ajusta solo.
        </p>

        <input
          type="tel"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="Ej: 11 3792-6301"
          className="w-full rounded-xl border border-[var(--color-rule)] px-3 py-2.5 text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sky)]"
        />

        {preview && (
          <div className="mt-2 text-xs">
            {preview.valid ? (
              <span className="text-[var(--color-mint-deep,#3a9d5d)]">
                ✓ Se guardará como <strong>{preview.pretty}</strong>
              </span>
            ) : (
              <span className="text-red-500">{preview.error}</span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm rounded-lg px-3 py-2 bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-soft)] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || (preview ? !preview.valid : true)}
            className="rounded-full bg-[var(--color-ink)] text-white font-semibold px-5 py-2 text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
