"use client";

/**
 * Auto-abre el LoginModal al montar la página /login.
 * Útil para el flujo "ir a /login → abrir modal automáticamente".
 */

import { useEffect } from "react";
import { useAuth } from "@/lib/store/useAuth";
import { MagicButton } from "@/components/ui/MagicButton";

export function LoginAutoOpen() {
  const { open, isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) open();
  }, [isAdmin, open]);

  return (
    <div className="mt-6 flex justify-center">
      <MagicButton variant="primary" onClick={open}>
        Abrir formulario
      </MagicButton>
    </div>
  );
}
