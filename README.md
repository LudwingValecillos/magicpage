# Magic

Premium toy/kids ecommerce frontend. Cinematic, magical, dark-with-glow.
Next.js 15 · React 19 · Tailwind v4 · anime.js v4 · TypeScript.

> **Design-only scaffold.** No backend wired yet. All data is mock data
> in `src/content/site.ts`. Supabase + Mercado Pago come next.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's inside

- **Home** with: floating navbar, cinematic hero (particles + floating product orbs + gradient mesh), brand marquee, editorial category grid, featured products, full-bleed promo banner, horizontal top-sellers carousel, store storytelling, glassy newsletter, premium footer.
- **Catalog** at `/catalogo` with sidebar category filters, search, sort, animated grid.
- **Product detail** at `/producto/[slug]` with cinematic gallery, info panel, details list, shipping chips, related products.
- **Visual primitives**: `GradientMesh`, `ParticleField` (canvas), `GlowOrb`, `FloatingItem`.
- **UI atoms**: `MagicButton`, `Badge`, `ProductCard`, `CategoryCard`.
- **Motion primitives**: `Reveal` (scroll), `ParallaxText`, `playHeroIntro` (mount).

## Where to look

The entry point for any new contributor (human or AI) is **[AGENTS.md](./AGENTS.md)**.
It maps the entire repository, names the conventions, and freezes the aesthetic.

## Scripts

```
npm run dev          start dev server
npm run build        production build
npm run start        serve production build
npm run typecheck    tsc --noEmit
npm run lint         next lint
```
