/**
 * intro — señal global "la intro terminó, ya se puede animar el hero".
 *
 * IntroCurtain llama markIntroReady() cuando la cortina sale (o de una si se
 * saltea por reduced-motion / ya vista). El Hero se suscribe con onIntroReady
 * para arrancar su cascada. Singleton a nivel módulo para evitar carreras:
 * si el ready ya pasó antes de que el Hero monte, el callback corre al toque.
 */

let ready = false;
const listeners = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function isIntroReady() {
  return ready;
}

/** Devuelve un cleanup. Si ya está ready, ejecuta cb sincrónicamente. */
export function onIntroReady(cb: () => void): () => void {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => listeners.delete(cb);
}
