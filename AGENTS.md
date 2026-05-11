# AGENTS.md — navigation map for AI agents

Entry point for any AI agent working in this repo. Read this first.

---

## Project

**Magic** — visual scaffold for a premium toy/kids ecommerce.
Categories: juguetes, Marvel, Disney, ropa, coleccionables, gaming, peluches, escolares.

Current state: **design-only, no backend wired** (no Supabase, no Mercado Pago yet).
All data is mock data in `src/content/site.ts`.

---

## Stack

- **Framework**: Next.js 15 (App Router, React 19, RSC by default)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (CSS-first config in `globals.css`, no `tailwind.config.ts`)
- **Animation**: anime.js v4 (ESM — `animate`, `onScroll`, `stagger`)
- **Fonts**: Outfit (display), Plus Jakarta Sans (UI), JetBrains Mono (labels)

---

## Directory map

```
magic/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                  Root layout. Loads fonts.
│  │  ├─ page.tsx                    Homepage. Composes Nav + sections + Footer.
│  │  ├─ globals.css                 Tailwind import + tokens + utilities.
│  │  ├─ catalogo/
│  │  │  └─ page.tsx                 /catalogo — mounts <CatalogView>.
│  │  └─ producto/[slug]/
│  │     └─ page.tsx                 /producto/[slug] — mounts <ProductDetail>.
│  │
│  ├─ components/
│  │  ├─ Reveal.tsx                  PRIMITIVE: scroll-triggered reveal (anime.js).
│  │  ├─ ParallaxText.tsx            PRIMITIVE: scroll-synced transform.
│  │  │
│  │  ├─ visual/                     Atmospheric layers.
│  │  │  ├─ GradientMesh.tsx         Blurred multi-color nebula backdrop.
│  │  │  ├─ ParticleField.tsx        Canvas drifting sparkles.
│  │  │  ├─ GlowOrb.tsx              Single colored blurred sphere.
│  │  │  └─ FloatingItem.tsx         Float + parallax wrapper for hero items.
│  │  │
│  │  ├─ ui/                         Reusable atoms.
│  │  │  ├─ MagicButton.tsx          CTA button (primary / ghost / link).
│  │  │  ├─ Badge.tsx                Pill (new / hot / sale / exclusive).
│  │  │  ├─ ProductCard.tsx          Product tile for grids and carousels.
│  │  │  └─ CategoryCard.tsx         Large editorial category tile.
│  │  │
│  │  └─ sections/                   Page-level sections.
│  │     ├─ Nav.tsx                  Floating glass navbar.
│  │     ├─ Hero.tsx                 Fullscreen cinematic hero.
│  │     ├─ Marquee.tsx              Brand ticker.
│  │     ├─ Categories.tsx           Editorial category grid (8 universal cats).
│  │     ├─ Brands.tsx               Licensed brand showcase (Marvel/Disney/Stitch/Frozen).
│  │     ├─ Featured.tsx             6-product highlight grid.
│  │     ├─ TopSellers.tsx           Horizontal snap carousel.
│  │     ├─ PromoBanner.tsx          Cinematic full-width promo.
│  │     ├─ Seasons.tsx              Halloween/Navidad/Verano/Colegio cards.
│  │     ├─ StoreLocation.tsx        Physical-store storytelling block.
│  │     ├─ Newsletter.tsx           Glass form.
│  │     ├─ Footer.tsx               Premium colophon.
│  │     ├─ CatalogView.tsx          Sidebar filters + product grid.
│  │     └─ ProductDetail.tsx        Cinematic product page.
│  │
│  ├─ lib/
│  │  ├─ tokens.ts                   Design tokens (mirrors CSS vars).
│  │  └─ anime/
│  │     ├─ scroll.ts                revealOnScroll() + parallaxOnScroll().
│  │     ├─ easings.ts               Named cubic-beziers.
│  │     └─ sequences.ts             Mount-time sequences (e.g. playHeroIntro).
│  │
│  └─ content/
│     └─ site.ts                     ALL copy + mock product/category data.
│                                    Types exported: Product, Category, BadgeKind.
│
├─ AGENTS.md                         (this file)
├─ README.md                         Human-facing intro.
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ postcss.config.mjs
└─ .claude/                          claude-code-templates skill cache.
```

---

## Conventions

### Components
- Every component file starts with a top comment describing purpose + behavior.
- Section components in `components/sections/` are `"use client"` (they hook anime.js).
- Atoms in `components/ui/` are `"use client"` only when interactive.
- Visuals in `components/visual/` are `"use client"` only if they use refs or canvas.
- Pull copy + product data from `@/content/site.ts`. Never hard-code strings inside JSX.

### Animation
- **Scroll reveals** → `<Reveal>` (`stagger` for child lists).
- **Scroll-synced transforms** → `<ParallaxText>` or `<FloatingItem>`.
- **Mount sequences** → add to `lib/anime/sequences.ts`, call from `useEffect`.
- Don't call `animate()` inline if a primitive already covers the case.

### Styling
- Use Tailwind utilities for layout.
- Colors come from CSS variables in `globals.css` (`var(--color-pink)` etc.). To add a token, edit BOTH `globals.css` (in `@theme`) AND `lib/tokens.ts`.
- Custom utility classes: `.display`, `.label`, `.eyebrow`, `.glass`, `.glass-strong`, `.gradient-text`, `.gradient-border`, `.glow-pink|blue|violet`, `.float`, `.float-slow`, `.spin-slow`, `.mesh-shift`, `.pulse-glow`, `.marquee`.
- Section padding pattern: `px-[var(--gutter)] py-[var(--section)]` set inline as CSS custom props.

### Adding a new section
1. Create `src/components/sections/YourSection.tsx` (`"use client"`).
2. Add copy to `src/content/site.ts`.
3. Wrap reveals in `<Reveal>`.
4. Import + place in `src/app/page.tsx` (or your route).
5. Update this file's directory map.

### Adding a new product
1. Append to `site.products` in `src/content/site.ts`.
2. Choose an existing `categorySlug` (or add a category first).
3. Provide `accent` (hex) and `icon` (emoji or symbol).
4. Static routes regenerate via `generateStaticParams` in `app/producto/[slug]/page.tsx`.

### Adding a design token
1. Add CSS var to `@theme { ... }` in `src/app/globals.css`.
2. Add matching constant to `src/lib/tokens.ts`.
3. Reference via `var(--color-foo)` in CSS or `colors.foo` in TS.

---

## Aesthetic — "Magic Premium Infantil"

Do not break this without an explicit instruction.

- **Background**: deep navy ink `#0B1020` → `#111827`, NEVER pure black. Body uses a fixed nebula gradient (blue + violet + pink radials).
- **Text**: warm white `#F8FAFC`, NEVER pure white. Dim `#C7CEDF`, mute `#7E889F`.
- **PRIMARY (dominant)**: electric blue `#4DA8FF` (`--color-blue`), deep `#3B82F6`, soft `#60A5FA`. Used for CTAs, highlights, default brand glow.
- **ACCENT (sparingly)**: vibrant pink `#FF5FA2`, soft `#FF77C8`. Reserved for "hot"/promo/fantasy moments. Never dominant.
- **Supporting**: violet `#8B5CF6`, gold `#FFD66B`.
- **Brand glows** per licensed character (`tokens.ts → brandGlow`): Marvel `#FF3B3B`, Disney `#4DA8FF`, Stitch `#5BC0EB`, Frozen `#9DD0FF`, Pixar `#FFB84D`, LEGO `#FFD93D`, Nintendo `#E60012`.
- **Surfaces**: glassmorphism (`.glass`, `.glass-strong`, `.glass-blue`).
- **Lighting**: blurred `<GlowOrb>` + animated `<GradientMesh>` + canvas `<ParticleField>`.
- **Typography**: Outfit display bold/cinematic against Plus Jakarta sans body + tiny JetBrains mono labels. Headlines should be giant, tightly tracked.
- **Motion**: smooth, premium, never bouncy. Float for hero items. Parallax for emotional accents. One scroll-reveal per section. No micro-interactions on every hover — only on cards, CTAs, nav.

Reference brand tone: Disney+ / Nike Kids / LEGO modern / Nintendo / Pixar. **Never** generic Shopify, never plain white background, never bare cards.

---

## Routes

- `/` → Home (Nav + Hero + Marquee + Categories + Brands + Featured + PromoBanner + TopSellers + Seasons + StoreLocation + Newsletter + Footer)
- `/catalogo` → CatalogView (filterable grid)
- `/producto/[slug]` → ProductDetail (gallery + info + related)

---

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run typecheck    # tsc --noEmit
npm run lint
```

---

## Future work (not yet implemented)

Per user spec but explicitly deferred:
- Supabase wiring (products, categories, auth, storage)
- Mercado Pago checkout
- Admin CMS panel
- Real product images (currently emoji + gradient orbs)
