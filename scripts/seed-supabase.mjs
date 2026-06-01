/**
 * Seeder Supabase — carga scraped/matches.json a tabla `productos`.
 *
 * Mapeos:
 *   marca   ← brands/categorías del sitio → disney | marvel | otra
 *   categoria ← categorías del sitio    → ropa | juguetes | accesorios
 *   imagenes  ← allImages del sitio     → [{url, storagePath: ""}]
 *
 * Uso:
 *   node scripts/seed-supabase.mjs            # carga
 *   node scripts/seed-supabase.mjs --dry      # simula, no escribe
 *   node scripts/seed-supabase.mjs --truncate # borra todos antes de cargar
 */

import { createClient } from "@supabase/supabase-js";
import { decode } from "he";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MATCHES_PATH = path.join(ROOT, "scraped", "matches.json");
const ENV_PATH = path.join(ROOT, ".env.local");

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const TRUNCATE = args.has("--truncate");

// ============================================
// Load .env.local manualmente
// ============================================

async function loadEnv() {
  const txt = await fs.readFile(ENV_PATH, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

// ============================================
// Mapeos
// ============================================

function mapMarca(siteBrands = [], siteCategories = []) {
  const all = [...siteBrands, ...siteCategories].join(" ").toLowerCase();
  if (/marvel|spider|avenger|capitan america|iron man|hulk|black panther|venom/.test(all)) return "marvel";
  if (/disney|pixar|mickey|minnie|stitch|princesas|toy story|cars|frozen|nemo|moana|encanto|simba|rey leon|aladdin/.test(all)) return "disney";
  return "otra";
}

function mapCategoria(siteCategories = []) {
  const all = siteCategories.join(" ").toLowerCase();
  // Accesorios: mochilas, gorras, medias, riñoneras, etc.
  if (/accesorio|mochila|gorra|cartera|riñonera|rinonera|medias|bolso|cinturon|cinturón/.test(all)) return "accesorios";
  // Juguetes: peluches, muñecos, etc.
  if (/juguete|peluche|muneco|muñeco|figura|set juego|jueg/.test(all)) return "juguetes";
  // Default: ropa (es una tienda de ropa)
  return "ropa";
}

function buildImages(allImages = []) {
  return allImages.map((url) => ({ url, storagePath: "" }));
}

function parseTalles(raw) {
  if (!raw) return [];
  // "2-4-6-8" → ["2","4","6","8"]
  // "S-M-L"   → ["S","M","L"]
  // "2,4,6"   → ["2","4","6"]
  return String(raw)
    .split(/[-,\s/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function pickPrice(precioExcel, precioSitio) {
  // Prefer precio del sitio si es número válido
  const n = Number(precioSitio);
  if (Number.isFinite(n) && n > 0) return n;
  return Number.isFinite(precioExcel) ? precioExcel : 0;
}

function truncate(s, max) {
  if (!s) return null;
  // Decodifica entidades HTML del scrape (&amp; &#038; &#8217; ...) antes de cortar.
  const clean = decode(String(s));
  return clean.length > max ? clean.slice(0, max - 1).trim() + "…" : clean;
}

// ============================================
// Main
// ============================================

async function main() {
  console.log(`[seed] DRY=${DRY} TRUNCATE=${TRUNCATE}`);

  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Faltan envs Supabase en .env.local");

  const supa = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("[1/4] Leyendo scraped/matches.json...");
  const matches = JSON.parse(await fs.readFile(MATCHES_PATH, "utf8"));
  console.log(`  ${matches.length} productos matched para insertar`);

  console.log("[2/4] Construyendo rows para DB...");
  const rows = [];
  const stats = { ropa: 0, juguetes: 0, accesorios: 0, disney: 0, marvel: 0, otra: 0, sinImagen: 0, sinPrecio: 0 };
  const seenSlugs = new Set();
  const skipped = [];

  for (const m of matches) {
    const site = m.sitio;
    if (!site) continue;

    const slug = site.slug;
    if (seenSlugs.has(slug)) {
      skipped.push({ slug, reason: "duplicate slug" });
      continue;
    }
    seenSlugs.add(slug);

    const imagenes = buildImages(site.allImages ?? []);
    if (imagenes.length === 0) stats.sinImagen++;

    const precio = pickPrice(m.precioExcel, site.priceSite);
    if (precio === 0) stats.sinPrecio++;

    const marca = mapMarca(site.brands, site.categories);
    const categoria = mapCategoria(site.categories);
    stats[marca]++;
    stats[categoria]++;

    const talles = parseTalles(m.talles);

    rows.push({
      slug,
      nombre: truncate(site.name || m.nombre, 80),
      precio,
      categoria,
      marca,
      imagenes,
      talles,
      descripcion: truncate(site.shortDescription || site.description, 500),
      oferta: false,
      precio_anterior: null,
      activo: true,
    });
  }

  console.log(`  Filas listas:    ${rows.length}`);
  console.log(`  Skipped:         ${skipped.length}`);
  console.log(`  Distribución marca:     disney=${stats.disney}  marvel=${stats.marvel}  otra=${stats.otra}`);
  console.log(`  Distribución categoría: ropa=${stats.ropa}  juguetes=${stats.juguetes}  accesorios=${stats.accesorios}`);
  console.log(`  Sin imagen: ${stats.sinImagen}    Sin precio: ${stats.sinPrecio}`);

  if (DRY) {
    console.log("\n[DRY] No se escribe nada. Sample row:");
    console.log(JSON.stringify(rows[0], null, 2));
    return;
  }

  if (TRUNCATE) {
    console.log("[3/4] Truncando tabla productos...");
    const { error } = await supa.from("productos").delete().neq("slug", "__never__");
    if (error) throw error;
    console.log("  ✓ Tabla vacía");
  } else {
    console.log("[3/4] No truncate — se hace upsert (onConflict slug)");
  }

  console.log("[4/4] Insertando en batches de 100...");
  const BATCH = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
    const { error } = await supa.from("productos").upsert(slice, { onConflict: "slug" });
    if (error) {
      console.error(`  ❌ Batch ${i}-${i + slice.length}:`, error.message);
      // Mostrar primer row del batch para debug
      console.error("  Sample row:", JSON.stringify(slice[0], null, 2));
      throw error;
    }
    inserted += slice.length;
    process.stdout.write(`  ${inserted}/${rows.length}\r`);
  }
  console.log(`\n  ✓ ${inserted} productos cargados`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
