# Supabase — guía de migración

El proyecto está diseñado para correr **client-only con localStorage** hasta que conectes Supabase. Toda la persistencia pasa por **un solo adapter** (`src/lib/store/adapter.ts`), por lo que migrar es cambiar **un archivo**.

---

## 1. Crear el proyecto en Supabase

1. https://supabase.com → New project.
2. Anotá `Project URL` y `anon public key`.
3. Sección **SQL Editor** → pegá el contenido de `src/lib/supabase/schema.sql` y ejecutá.
4. Sección **Storage** → crear bucket `product-images` público (para imágenes de productos).
5. Sección **Authentication** → habilitar email/password (o el provider que prefieras) y crear el usuario admin.

---

## 2. Variables de entorno

Crear `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 3. Instalar dependencia

```bash
npm install @supabase/supabase-js
```

---

## 4. Activar el client

Editar `src/lib/supabase/client.ts` — descomentar el bloque que usa `createClient`.

---

## 5. Implementar SupabaseAdapter

Crear `src/lib/supabase/SupabaseAdapter.ts`:

```ts
import type { Adapter } from "@/lib/store/adapter";
import type { Product, Category, CartItem, AdminSession } from "@/lib/store/types";
import { supabase } from "./client";

const fromRow = (row: any): Product => ({
  slug: row.slug,
  name: row.name,
  category: row.category,
  categorySlug: row.category_slug,
  price: Number(row.price),
  oldPrice: row.old_price ? Number(row.old_price) : undefined,
  rating: row.rating ?? 5,
  badges: row.badges ?? [],
  icon: row.icon ?? "✦",
  accent: row.accent ?? "#4DA8FF",
  description: row.description ?? "",
  details: row.details ?? [],
  images: row.images ?? [],
  active: row.active ?? true,
  onSale: row.on_sale ?? false,
});

const toRow = (p: Product) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  category_slug: p.categorySlug,
  price: p.price,
  old_price: p.oldPrice ?? null,
  rating: p.rating,
  badges: p.badges ?? [],
  icon: p.icon,
  accent: p.accent,
  description: p.description,
  details: p.details,
  images: p.images,
  active: p.active,
  on_sale: p.onSale,
});

export class SupabaseAdapter implements Adapter {
  async listProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from("productos").select("*");
    if (error) throw error;
    return (data ?? []).map(fromRow);
  }

  async saveProducts(products: Product[]): Promise<void> {
    // upsert + remove deleted (left as exercise — for partial syncs see useProducts mutators)
    const { error } = await supabase.from("productos").upsert(products.map(toRow));
    if (error) throw error;
  }

  async listCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from("categorias").select("*");
    if (error) throw error;
    return data ?? [];
  }
  async saveCategories(cats: Category[]): Promise<void> {
    const { error } = await supabase.from("categorias").upsert(cats);
    if (error) throw error;
  }

  // --- Cart: por sesión anónima o user_id ---
  async loadCart(): Promise<CartItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    let q = supabase.from("cart_items").select("product_slug, qty");
    q = user ? q.eq("user_id", user.id) : q.eq("session_id", localSessionId());
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map((r) => ({ slug: r.product_slug, qty: r.qty }));
  }
  async saveCart(items: CartItem[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const owner = user ? { user_id: user.id } : { session_id: localSessionId() };
    // delete + reinsert por simplicidad
    await supabase.from("cart_items").delete().match(owner);
    if (items.length) {
      await supabase.from("cart_items").insert(items.map((it) => ({ ...owner, product_slug: it.slug, qty: it.qty })));
    }
  }

  async loadSession(): Promise<AdminSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return { user: user.email ?? "admin", loggedAt: Date.now() };
  }
  async saveSession(s: AdminSession | null): Promise<void> {
    if (s === null) await supabase.auth.signOut();
    // login → manejado por el formulario directamente con supabase.auth.signInWithPassword
  }
}

function localSessionId(): string {
  const k = "magic.session.id";
  let v = window.localStorage.getItem(k);
  if (!v) {
    v = crypto.randomUUID();
    window.localStorage.setItem(k, v);
  }
  return v;
}
```

---

## 6. Conectar el adapter

Editar `src/lib/store/adapter.ts`:

```ts
import { SupabaseAdapter } from "@/lib/supabase/SupabaseAdapter";
export const adapter: Adapter = new SupabaseAdapter();
```

Listo — toda la app usa Supabase. No hace falta tocar componentes ni hooks.

---

## 7. Reemplazar el login demo

`src/lib/store/useAuth.ts` actualmente acepta `admin/admin`. Para Supabase:

```ts
const login = useCallback(async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) return { ok: false, error: error.message };
  await setSession({ user: data.user.email ?? "admin", loggedAt: Date.now() });
  return { ok: true };
}, [setSession]);
```

---

## 8. Imágenes con Storage

Para subir imágenes desde el admin panel (en lugar de pegar URLs), reemplaza el input URL en `src/components/admin/ProductForm.tsx → Card "Imágenes"`:

```tsx
const onUpload = async (file: File) => {
  const path = `${draft.slug}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) return alert(error.message);
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  setField("images", [...draft.images, data.publicUrl]);
};
```

Y un `<input type="file" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />`.

---

## 9. Pagos (Mercado Pago) — pendiente

Ver `AGENTS.md → Future work`. Resumen:

- API route `/api/mp/preference` que crea preferencia con SDK `mercadopago`.
- Webhook `/api/mp/webhook` que confirma pago y descuenta stock vía Supabase.
- Botón Checkout Pro en `<CartDrawer>` que abre la URL devuelta por la preferencia.

---

## Lo importante

- Toda la abstracción está en **`src/lib/store/adapter.ts`**. Nunca importes Supabase directo desde un componente.
- Los hooks (`useProducts`, `useCart`, `useAuth`) son adapter-agnósticos.
- Las RLS del schema son una base — refinalas según tu modelo de roles.
