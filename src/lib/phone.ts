/**
 * Normalización y validación de números de WhatsApp, con foco en Argentina.
 *
 * WhatsApp (wa.me) requiere el número en formato internacional SIN "+", sin
 * espacios ni guiones: solo dígitos. Ej: 5491123456789
 *
 * Particularidad argentina:
 *  - Código de país: 54
 *  - WhatsApp usa el "9" después del 54 para celulares (móvil): 54 9 XXXX...
 *  - El "15" que se usa localmente NO va en el formato internacional.
 *
 * Esta función es tolerante: acepta que el usuario escriba el número de varias
 * formas (con +, con 0, con 15, con espacios/guiones/paréntesis) y lo lleva al
 * formato que wa.me necesita.
 */

export interface NormalizedPhone {
  /** Solo dígitos, formato internacional para wa.me (ej. 5491123456789). */
  value: string;
  /** true si parece un número válido utilizable. */
  valid: boolean;
  /** Mensaje de error legible si no es válido (para el form del admin). */
  error?: string;
  /** Versión legible para mostrar (ej. +54 9 11 2345-6789). */
  pretty?: string;
}

/**
 * Normaliza un número ingresado a formato wa.me (Argentina-aware).
 * No es exhaustivo para todos los países, pero maneja AR correctamente y
 * deja pasar números internacionales ya bien formados.
 */
export function normalizeArgentinePhone(input: string): NormalizedPhone {
  if (!input || !input.trim()) {
    return { value: "", valid: false, error: "Ingresá un número." };
  }

  // 1) Dejar solo dígitos (descarta +, espacios, guiones, paréntesis, etc.)
  let digits = input.replace(/\D/g, "");

  if (!digits) {
    return { value: "", valid: false, error: "El número solo puede contener dígitos." };
  }

  // 2) Sacar 00 inicial (prefijo internacional de salida) -> queda el país
  if (digits.startsWith("00")) digits = digits.slice(2);

  // 3) Casos Argentina
  if (digits.startsWith("54")) {
    let rest = digits.slice(2);
    // sacar un 0 inicial de característica (ej. 011 -> 11)
    rest = rest.replace(/^0+/, "");
    // sacar el "15" ANTES de tocar el 9: área(2-4) + 15 + resto(6-8)
    rest = rest.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
    // insertar el 9 de celular si no está
    if (!rest.startsWith("9")) {
      rest = "9" + rest;
    } else {
      // si ya tenía 9, revisar 15 tras el 9: 9 + área + 15 + resto
      rest = rest.replace(/^(9\d{2,4})15(\d{6,8})$/, "$1$2");
    }
    digits = "54" + rest;
  } else if (digits.startsWith("9") && digits.length >= 11) {
    // vino sin país pero con el 9 de celular
    digits = "54" + digits;
  } else if (digits.startsWith("0")) {
    // número nacional con 0 inicial (ej. 011...) sin país; quitar 0 y 15
    let rest = digits.replace(/^0+/, "");
    rest = rest.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
    digits = "549" + rest;
  } else if (digits.length >= 10 && digits.length <= 13) {
    // parece un número argentino sin país ni 9 (ej. 1123456789)
    // quitar 15 intermedio si está: area(2-4)+15+resto
    const noFifteen = digits.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2");
    digits = "549" + noFifteen;
  }
  // (si empieza con otro código de país distinto de 54, se deja tal cual)

  // 4) Validación de longitud razonable para AR (54 + 9 + 10 = 13) o internacional
  const isArg = digits.startsWith("549");
  if (isArg) {
    // 549 + 10 dígitos = 13
    if (digits.length < 12 || digits.length > 14) {
      return {
        value: digits,
        valid: false,
        error: "El número argentino no parece completo. Revisá el código de área y el número (sin el 15).",
      };
    }
  } else {
    // internacional genérico
    if (digits.length < 8 || digits.length > 15) {
      return { value: digits, valid: false, error: "El número no tiene una longitud válida." };
    }
  }

  return { value: digits, valid: true, pretty: prettyArgentine(digits) };
}

/** Formatea para mostrar: +54 9 11 2345-6789 (solo estético). */
export function prettyArgentine(digits: string): string {
  if (digits.startsWith("549") && digits.length >= 12) {
    const area = digits.slice(3, 5);
    const mid = digits.slice(5, 9);
    const end = digits.slice(9);
    return `+54 9 ${area} ${mid}-${end}`;
  }
  return "+" + digits;
}
