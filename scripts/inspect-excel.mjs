/**
 * Re-inspecciona STOCK DISPONIBLE DE MAGIC.xlsx — raw, mostrando primeras filas
 * incluso si son headers/títulos. Busca columna NOMBRE.
 */

import xlsx from "xlsx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xlsxPath = path.resolve(__dirname, "..", "STOCK DISPONIBLE DE MAGIC.xlsx");

const wb = xlsx.readFile(xlsxPath);

for (const name of wb.SheetNames) {
  console.log(`\n========================================`);
  console.log(`Sheet: "${name}"`);
  console.log(`========================================`);
  const sheet = wb.Sheets[name];
  // raw: as 2D array
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: false });
  console.log(`Total filas: ${rows.length}`);
  console.log(`Range: ${sheet["!ref"]}`);
  console.log(`Primeras 10 filas (raw):`);
  rows.slice(0, 10).forEach((row, i) => {
    console.log(`  [${i}]`, JSON.stringify(row));
  });

  // Buscar fila donde alguna celda contenga "NOMBRE"
  const nombreRowIdx = rows.findIndex((r) =>
    r.some((c) => typeof c === "string" && /nombre/i.test(c)),
  );
  if (nombreRowIdx >= 0) {
    console.log(`\n*** Fila con "NOMBRE" detectada en idx ${nombreRowIdx}:`);
    console.log("  ", rows[nombreRowIdx]);
    console.log(`\nMuestra 3 filas siguientes:`);
    rows.slice(nombreRowIdx + 1, nombreRowIdx + 4).forEach((r, i) => {
      console.log(`  [+${i + 1}]`, JSON.stringify(r));
    });
  }
}
