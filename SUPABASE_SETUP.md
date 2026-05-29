# SUPABASE_SETUP.md

Estado actual del backend Supabase en el proyecto Magic.

---

## 1. Estado

- ✅ Tablas creadas en Supabase (`productos` + enums + indexes + RLS)
- ✅ Bucket `productos` creado para imágenes
- ✅ Clientes Supabase wireados (`src/lib/supabase/`)
- ✅ `SupabaseAdapter` listo (`src/lib/store/supabaseAdapter.ts`)
- ✅ Endpoint admin `/api/admin/products` (upsert + delete)
- ✅ Login con cookie HttpOnly (`/api/admin/login`, `/api/admin/logout`)
- ✅ `.env.local` con credenciales
- ⏳ **Adapter activo sigue siendo `LocalStorageAdapter`** (swap manual cuando estés listo)

---

## 2. Cómo activar Supabase

Editar `src/lib/store/adapter.ts`, línea final:

```ts
// Cambiar:
export const adapter: Adapter = new LocalStorageAdapter();

// Por:
import { SupabaseAdapter } from "./supabaseAdapter";
export const adapter: Adapter = new SupabaseAdapter();
```

Listo. La app empieza a leer/escribir contra Supabase.

---

## 3. Archivos creados / modificados

```
supabase/                              (nuevo — no committeable, solo refs)
  └─ (sin archivos locales, schema corre en cloud)

src/lib/supabase/
  ├─ client.ts                         Cliente browser (anon key, RLS aplica)
  └─ admin.ts                          Cliente server (service_role, bypassa RLS)

src/lib/store/
  ├─ adapter.ts                        Comentario actualizado a Supabase
  └─ supabaseAdapter.ts                Implementa Adapter contra DB + Storage

src/app/api/admin/
  ├─ login/route.ts                    Setea cookie HttpOnly
  ├─ logout/route.ts                   Limpia cookie
  └─ products/route.ts                 POST upsert + delete (requiere cookie)

.env.local                             Credenciales (NO se committea)
.env.example                           Template
package.json                           +@supabase/supabase-js
```

---

## 4. Schema en Supabase

```
public.productos
  slug            text PK
  nombre          text
  precio          numeric
  categoria       enum (ropa | juguetes | accesorios)
  marca           enum (disney | marvel | otra)
  imagenes        jsonb            [{url, storagePath}]
  descripcion     text             nullable
  oferta          boolean
  precio_anterior numeric          nullable (req si oferta=true)
  activo          boolean
  created_at      timestamptz
  updated_at      timestamptz      (trigger auto)

storage.buckets
  productos       public read, write via service_role
```

**RLS:**
- `anon` y `authenticated`: SELECT all
- `INSERT/UPDATE/DELETE`: solo `service_role` (via `/api/admin/products`)

---

## 5. Variables de entorno

`.env.local` (NUNCA committear):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

ADMIN_USER=admin
ADMIN_PASS=...
ADMIN_SESSION_TOKEN=... (64 chars hex)

NEXT_PUBLIC_BRAND_NAME=Magic
NEXT_PUBLIC_WHATSAPP_NUMBER=549...
```

Regenerar token random:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Flujo de uso

**Público (lectura):**
1. Browser → `SupabaseAdapter.listProducts()` → anon client → SELECT directo
2. RLS permite SELECT all, `useProducts.visibles` filtra activo client-side

**Admin (escritura):**
1. Login: `POST /api/admin/login` con `{user, pass}` → setea cookie `admin_session`
2. Crear/editar producto: `useProducts.create/update/remove` → `setProducts(next)` → `SupabaseAdapter.saveProducts(next)` → `POST /api/admin/products` → server valida cookie → service_role hace upsert + delete

---

## 7. Pendiente (futuras fases)

- [ ] UI admin para CRUD de productos (página `/admin`)
- [ ] Upload de imágenes a Storage `productos/` con path determinístico (`productos/<slug>/<nombre>.jpg`)
- [ ] Si en algún momento se quiere multi-usuario, migrar admin login a Supabase Auth
- [ ] Si se quiere checkout real, agregar tabla `pedidos` + Mercado Pago
