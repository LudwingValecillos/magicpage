import { LoginAutoOpen } from "@/components/sections/LoginAutoOpen";
import { Nav } from "@/components/sections/Nav";
import { site } from "@/content/site";

export const metadata = {
  title: `Acceso — ${site.brand}`,
  description: "Acceso restringido al panel de administración.",
};

export default function LoginPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-32 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <span className="eyebrow">{site.brand} · Admin</span>
          <h1 className="display text-5xl mt-3">Iniciar sesión</h1>
          <p className="mt-4 text-[var(--color-ivory-dim)]">
            El formulario debería abrirse automáticamente. Si no, tocá el botón.
          </p>
          <LoginAutoOpen />
        </div>
      </main>
    </>
  );
}
