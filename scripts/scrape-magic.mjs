/**
 * Scraper magicstore.com.ar — versión 3 (combina 3 matchers).
 *
 * Joinea PEDIDO + LISTA DE PRECIOS por ARTICULO, después matchea contra el
 * sitio probando en orden:
 *   1. slug(NOMBRE) → site.slug          (más confiable cuando NOMBRE es público)
 *   2. ARTICULO → site.sku prefix        (atrapa códigos de fábrica)
 *   3. fuzzy Jaccard de nombre + marca   (último recurso)
 *
 * Output: matches.json + report.csv con imagen + descripción del sitio.
 */

import xlsx from "xlsx";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "STOCK DISPONIBLE DE MAGIC.xlsx");
const OUT_DIR = path.join(ROOT, "scraped");

const API_BASE = "https://magicstore.com.ar/wp-json/wc/store/v1/products";
const PER_PAGE = 100;
const MAX_PAGES = 50;
const SITE = "https://magicstore.com.ar";

// ============================================
// Helpers
// ============================================

function slugify(s) {
  return (s ?? "").toString()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html) {
  return (html ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ").trim();
}

function esc(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function normalize(s) {
  return (s ?? "").toString().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function tokens(s) {
  return new Set(normalize(s).split(" ").filter((t) => t.length >= 3));
}

function jaccard(a, b) {
  const inter = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

// ============================================
// Fetch Woo API
// ============================================

async function fetchAllProducts() {
  const all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${API_BASE}?per_page=${PER_PAGE}&page=${page}`;
    process.stdout.write(`  Fetching page ${page}... `);
    const res = await fetch(url, { headers: { "User-Agent": "magic-scraper/3.0" } });
    if (!res.ok) { console.log(`HTTP ${res.status}`); break; }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) { console.log("done"); break; }
    all.push(...batch);
    console.log(`+${batch.length} (total ${all.length})`);
    if (batch.length < PER_PAGE) break;
  }
  return all;
}

function normalizeProduct(p) {
  const images = (p.images ?? []).map((i) => i?.src).filter(Boolean);
  const skuStr = (p.sku ?? "").toString();
  const skuNumMatch = skuStr.match(/^(\d+)/);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: skuStr,
    skuNumber: skuNumMatch ? skuNumMatch[1] : null,
    permalink: p.permalink,
    images,
    mainImage: images[0] ?? null,
    description: stripHtml(p.description ?? ""),
    shortDescription: stripHtml(p.short_description ?? ""),
    price: p.prices?.price ?? null,
    brands: (p.brands ?? []).map((b) => b.name),
    categories: (p.categories ?? []).map((c) => c.name),
  };
}

// ============================================
// Read Excel — JOIN PEDIDO + LISTA DE PRECIOS por ARTICULO
// ============================================

function readExcel() {
  const wb = xlsx.readFile(XLSX_PATH);

  // PEDIDO: header en row 4 (idx 4). Cols: ARTICULO, DESCRIPCION(=marca), NOMBRE, OBSERVACION
  const pedidoRaw = xlsx.utils.sheet_to_json(wb.Sheets["PEDIDO"], {
    header: ["articulo", "marca", "nombre", "observacion"],
    range: 5, defval: null, raw: false,
  });
  const pedido = pedidoRaw
    .filter((r) => r.articulo != null && r.nombre)
    .map((r) => ({
      articulo: String(r.articulo).trim(),
      marca: r.marca ?? null,
      nombre: String(r.nombre).trim(),
      observacion: r.observacion,
    }));

  // LISTA DE PRECIOS
  const lpRaw = xlsx.utils.sheet_to_json(wb.Sheets["LISTA DE PRECIOS"], {
    defval: null, raw: false,
  });
  const lp = lpRaw
    .filter((r) => r["ART."] != null && r["Descripcion"])
    .map((r) => ({
      articulo: String(r["ART."]).trim(),
      tipo: r["TIPO"] ?? null,
      descripcionLP: String(r["Descripcion"]).trim(),
      talles: r["TALLES"] ?? null,
      curva: r["CURVA"] ?? null,
      precio: r["Actual"] != null ? Number(String(r["Actual"]).replace(/,/g, "")) : null,
    }));

  // Join — ARTICULO es la clave. Unimos en outer join.
  const pedidoByArt = new Map(pedido.map((p) => [p.articulo, p]));
  const lpByArt = new Map(lp.map((p) => [p.articulo, p]));
  const allArts = new Set([...pedidoByArt.keys(), ...lpByArt.keys()]);

  const joined = [];
  for (const art of allArts) {
    const p = pedidoByArt.get(art);
    const l = lpByArt.get(art);
    joined.push({
      articulo: art,
      nombre: p?.nombre ?? l?.descripcionLP ?? null,
      marca: p?.marca ?? l?.tipo ?? null,
      descripcionLP: l?.descripcionLP ?? null,
      talles: l?.talles ?? null,
      curva: l?.curva ?? null,
      precio: l?.precio ?? null,
      observacion: p?.observacion ?? null,
      _inPedido: !!p,
      _inLP: !!l,
    });
  }
  return { joined, pedido, lp };
}

// ============================================
// Match (3 estrategias)
// ============================================

function buildIndexes(products) {
  const bySlug = new Map();
  const bySku = new Map();
  for (const p of products) {
    bySlug.set(p.slug, p);
    if (p.skuNumber) {
      if (!bySku.has(p.skuNumber)) bySku.set(p.skuNumber, []);
      bySku.get(p.skuNumber).push(p);
    }
  }
  return { bySlug, bySku };
}

function matchRow(row, idx, products) {
  // 1. Slug match (slugify NOMBRE → site.slug)
  if (row.nombre) {
    const slug = slugify(row.nombre);
    if (idx.bySlug.has(slug)) {
      return { strategy: "slug", products: [idx.bySlug.get(slug)], score: 1 };
    }
  }
  // 2. SKU match (ARTICULO → site.sku prefix)
  if (idx.bySku.has(row.articulo)) {
    return { strategy: "sku", products: idx.bySku.get(row.articulo), score: 1 };
  }
  // 3. Fuzzy name
  const query = (row.nombre ?? row.descripcionLP ?? "") + " " + (row.marca ?? "");
  const qTokens = tokens(query);
  if (qTokens.size >= 2) {
    let best = { score: 0, products: [] };
    for (const p of products) {
      const sim = jaccard(qTokens, tokens(p.name));
      if (sim > best.score) best = { score: sim, products: [p] };
      else if (sim > 0 && sim === best.score) best.products.push(p);
    }
    if (best.score >= 0.5) {
      return { strategy: "fuzzy", products: best.products.slice(0, 3), score: best.score };
    }
  }
  return { strategy: "none", products: [], score: 0 };
}

// ============================================
// Main
// ============================================

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("[1/4] Leyendo Excel y joineando PEDIDO + LISTA DE PRECIOS por ARTICULO...");
  const { joined, pedido, lp } = readExcel();
  console.log(`  PEDIDO:           ${pedido.length} filas`);
  console.log(`  LISTA DE PRECIOS: ${lp.length} filas`);
  console.log(`  Joineado total:   ${joined.length} ARTICULOs únicos`);

  console.log("[2/4] Bajando productos del sitio (WooCommerce Store API)...");
  const raw = await fetchAllProducts();
  const products = raw.map(normalizeProduct);
  console.log(`  Total productos en sitio: ${products.length}`);
  await fs.writeFile(
    path.join(OUT_DIR, "products.json"),
    JSON.stringify(products, null, 2),
  );

  console.log("[3/4] Matcheando con 3 estrategias (slug → sku → fuzzy)...");
  const idx = buildIndexes(products);
  const enriched = [];
  const unmatched = [];
  const stats = { slug: 0, sku: 0, fuzzy: 0, none: 0 };

  for (const row of joined) {
    const m = matchRow(row, idx, products);
    stats[m.strategy]++;
    const site = m.products[0] ?? null;
    const entry = {
      articulo: row.articulo,
      nombre: row.nombre,
      marca: row.marca,
      descripcionLP: row.descripcionLP,
      talles: row.talles,
      curva: row.curva,
      precioExcel: row.precio,
      observacion: row.observacion,
      matchStrategy: m.strategy,
      matchScore: m.score,
      alternateMatches: m.products.length > 1 ? m.products.slice(1).map((p) => ({
        name: p.name, slug: p.slug, sku: p.sku, permalink: p.permalink,
      })) : [],
      enSitio: !!site,
      sitio: site ? {
        name: site.name,
        slug: site.slug,
        sku: site.sku,
        permalink: site.permalink,
        mainImage: site.mainImage,
        allImages: site.images,
        shortDescription: site.shortDescription,
        description: site.description,
        priceSite: site.price,
        brands: site.brands,
        categories: site.categories,
      } : null,
    };
    if (site) enriched.push(entry);
    else unmatched.push(entry);
  }

  await fs.writeFile(
    path.join(OUT_DIR, "matches.json"),
    JSON.stringify(enriched, null, 2),
  );
  await fs.writeFile(
    path.join(OUT_DIR, "unmatched.json"),
    JSON.stringify(unmatched, null, 2),
  );

  // CSV plano
  const header = [
    "articulo", "marca", "nombre", "descripcion_lp", "talles", "curva", "precio_excel",
    "match", "score", "en_sitio",
    "sitio_nombre", "sitio_sku", "sitio_imagen", "sitio_descripcion_corta",
    "sitio_precio", "sitio_url",
  ];
  const csvLines = [header.join(",")];
  for (const e of [...enriched, ...unmatched]) {
    csvLines.push([
      e.articulo, esc(e.marca), esc(e.nombre), esc(e.descripcionLP),
      esc(e.talles), esc(e.curva), e.precioExcel ?? "",
      e.matchStrategy, e.matchScore.toFixed(2),
      e.enSitio ? "si" : "no",
      esc(e.sitio?.name), esc(e.sitio?.sku),
      esc(e.sitio?.mainImage), esc(e.sitio?.shortDescription),
      e.sitio?.priceSite ?? "", esc(e.sitio?.permalink),
    ].join(","));
  }
  await fs.writeFile(path.join(OUT_DIR, "report.csv"), csvLines.join("\n"));

  console.log("[4/4] Listo. Stats:");
  console.log(`  slug:   ${stats.slug}`);
  console.log(`  sku:    ${stats.sku}`);
  console.log(`  fuzzy:  ${stats.fuzzy}`);
  console.log(`  ❌none: ${stats.none}`);
  const total = enriched.length + unmatched.length;
  console.log(`\n  Matched: ${enriched.length}/${total} (${((enriched.length/total)*100).toFixed(1)}%)`);
  console.log(`\n  → scraped/products.json   (${products.length} productos crudos)`);
  console.log(`  → scraped/matches.json    (${enriched.length} matched + imagen + descripción)`);
  console.log(`  → scraped/unmatched.json  (${unmatched.length} sin match)`);
  console.log(`  → scraped/report.csv      (todo, abrible en Excel)`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
