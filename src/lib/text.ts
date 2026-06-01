/**
 * Helpers de texto.
 *
 * decodeEntities — los nombres/descripciones vienen de un scrape de WooCommerce
 * y traen entidades HTML crudas (`&amp;`, `&#038;`, `&#8211;`, `&#8217;`...).
 * Se decodifican en la capa de datos (al mapear filas de la DB) para que NINGÚN
 * componente tenga que preocuparse por esto.
 */

import { decode } from "he";

export function decodeEntities(input: string | null | undefined): string {
  if (!input) return "";
  return decode(input);
}
