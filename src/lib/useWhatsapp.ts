"use client";

/**
 * Hook que expone el número de WhatsApp activo (del store, con fallback al env)
 * y helpers para construir links usándolo. Reemplaza el uso directo de la
 * constante estática WHATSAPP_NUMBER en los componentes.
 */

import { useCallback } from "react";
import { useStore } from "@/lib/store/StoreProvider";
import { whatsappLink } from "@/lib/whatsapp";

export function useWhatsapp() {
  const { whatsappNumber } = useStore();

  const link = useCallback(
    (message: string) => whatsappLink(message, whatsappNumber),
    [whatsappNumber],
  );

  return { whatsappNumber, link, hasNumber: Boolean(whatsappNumber?.trim()) };
}
