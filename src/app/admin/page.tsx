"use client";

/**
 * Admin dashboard — quick stats + shortcuts.
 */

import Link from "next/link";
import { useMemo } from "react";
import { useProducts } from "@/lib/store/useProducts";
import { resetStore } from "@/lib/store/adapter";

export default function AdminDashboardPage() {
  const { all, visible, categories } = useProducts();

  const stats = useMemo(() => {
    const onSale = all.filter((p) => p.onSale).length;
    const inactive = all.filter((p) => !p.active).length;
    const totalValue = all.reduce((a, p) => a + p.price, 0);
    return { total: all.length, visible: visible.length, onSale, inactive, totalValue, categories: categories.length };
  }, [all, visible, categories]);

  const handleReset = async () => {
    if (!confirm("¿Restaurar catálogo a la semilla original? Se pierden tus cambios.")) return;
    await resetStore();
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Inicio · Panel admin</span>
          <h1 className="display text-4xl md:text-5xl mt-2">Dashboard</h1>
          <p className="mt-2 text-[var(--color-ivory-dim)]">Resumen del catálogo y acceso rápido a la gestión.</p>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-mono uppercase tracking-widest text-[var(--color-ivory-mute)] hover:text-[var(--color-pink)] transition-colors"
        >
          ↺ Restaurar catálogo
        </button>
      </div>

      {/* stats grid */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Stat label="Productos totales" value={stats.total} accent="#4DA8FF" />
        <Stat label="Visibles" value={stats.visible} accent="#60A5FA" />
        <Stat label="En oferta" value={stats.onSale} accent="#FFD66B" />
        <Stat label="Inactivos" value={stats.inactive} accent="#FF5FA2" />
      </div>

      {/* shortcuts */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Shortcut href="/admin/productos" title="Gestionar productos" sub="Crear, editar, ofertar" icon="◐" />
        <Shortcut href="/admin/productos/nuevo" title="Nuevo producto" sub="Agregar al catálogo" icon="+" />
        <Shortcut href="/admin/categorias" title="Categorías" sub={`${stats.categories} secciones`} icon="◆" />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="glass rounded-[var(--radius-lg)] p-5 relative overflow-hidden">
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl"
        style={{ background: accent }}
      />
      <span className="block text-[0.65rem] font-mono uppercase tracking-widest text-[var(--color-ivory-mute)]">
        {label}
      </span>
      <div className="mt-2 font-display text-4xl" style={{ fontFamily: "var(--font-display)", color: accent }}>
        {value}
      </div>
    </div>
  );
}

function Shortcut({ href, title, sub, icon }: { href: string; title: string; sub: string; icon: string }) {
  return (
    <Link
      href={href}
      className="glass rounded-[var(--radius-lg)] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(77,168,255,0.5)] transition-all"
    >
      <span className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-violet)] grid place-items-center text-xl shadow-[0_8px_24px_-8px_rgba(77,168,255,0.6)]">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-[var(--color-ivory-mute)]">{sub}</span>
      </div>
      <span className="text-[var(--color-ivory-mute)]">→</span>
    </Link>
  );
}
