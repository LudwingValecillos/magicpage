"use client";

/**
 * Admin dashboard — stats + shortcuts.
 */

import Link from "next/link";
import { useMemo } from "react";
import { useProducts } from "@/lib/store/useProducts";
import { resetStore } from "@/lib/store/adapter";

export default function AdminDashboardPage() {
  const { all, visibles } = useProducts();

  const stats = useMemo(() => {
    const oferta = all.filter((p) => p.oferta).length;
    const inactivos = all.filter((p) => !p.activo).length;
    return {
      total: all.length,
      visibles: visibles.length,
      oferta,
      inactivos,
    };
  }, [all, visibles]);

  const handleReset = async () => {
    if (!confirm("¿Borrar TODO el catálogo del navegador? Acción irreversible.")) return;
    await resetStore();
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Inicio · Panel admin</span>
          <h1 className="display text-3xl md:text-4xl mt-2 text-[var(--color-ink)]">
            Dashboard
          </h1>
          <p className="mt-2 text-[var(--color-ink-soft)]">
            Resumen del catálogo y accesos rápidos.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs uppercase tracking-widest text-[var(--color-ink-mute)] hover:text-[var(--color-pink-deep)] transition-colors"
        >
          ↺ Vaciar catálogo
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Stat label="Productos totales" value={stats.total} accent="var(--color-sky)" />
        <Stat label="Visibles" value={stats.visibles} accent="var(--color-mint)" />
        <Stat label="En oferta" value={stats.oferta} accent="var(--color-coral)" />
        <Stat label="Inactivos" value={stats.inactivos} accent="var(--color-pink)" />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Shortcut href="/admin/productos" title="Gestionar productos" sub="Crear, editar, ofertar" icon="🛍️" />
        <Shortcut href="/admin/productos/nuevo" title="Nuevo producto" sub="Agregar al catálogo" icon="➕" />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <span className="block text-[0.65rem] uppercase tracking-widest text-[var(--color-ink-mute)] font-semibold">
        {label}
      </span>
      <div className="mt-2 font-display text-3xl" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function Shortcut({ href, title, sub, icon }: { href: string; title: string; sub: string; icon: string }) {
  return (
    <Link
      href={href}
      className="card card-hover p-5 flex items-center gap-4"
    >
      <span className="w-12 h-12 rounded-2xl bg-[var(--color-sky-tint)] grid place-items-center text-2xl">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="block font-semibold text-[var(--color-ink)]">{title}</span>
        <span className="block text-xs text-[var(--color-ink-mute)]">{sub}</span>
      </div>
      <span className="text-[var(--color-ink-mute)]">→</span>
    </Link>
  );
}
