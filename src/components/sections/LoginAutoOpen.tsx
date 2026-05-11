"use client";

/**
 * LoginAutoOpen — mounts the login modal automatically when /login is visited.
 * If the user is already admin, redirects to /admin.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/useAuth";
import { useStore } from "@/lib/store/StoreProvider";

export function LoginAutoOpen() {
  const { ready } = useStore();
  const { isAdmin, open } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (isAdmin) {
      router.replace("/admin");
      return;
    }
    open();
  }, [ready, isAdmin, open, router]);

  return (
    <button
      onClick={open}
      className="mt-6 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-[var(--color-blue-deep)] via-[var(--color-blue)] to-[var(--color-violet)] shadow-[0_8px_24px_-8px_rgba(77,168,255,0.7)]"
    >
      Abrir formulario →
    </button>
  );
}
