/**
 * Supabase client — STUB.
 *
 * To activate:
 *   1. npm install @supabase/supabase-js
 *   2. Add env vars in .env.local:
 *        NEXT_PUBLIC_SUPABASE_URL=...
 *        NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *   3. Run the SQL in src/lib/supabase/schema.sql against your project.
 *   4. Implement SupabaseAdapter (see TODO at the bottom of this file).
 *   5. In src/lib/store/adapter.ts replace the export:
 *        export const adapter: Adapter = new SupabaseAdapter(supabase);
 *
 * Until then, the app uses LocalStorageAdapter automatically.
 */

// Uncomment once @supabase/supabase-js is installed.
// import { createClient } from "@supabase/supabase-js";
//
// const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
//
// if (!url || !anon) {
//   throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
// }
//
// export const supabase = createClient(url, anon);

// TODO when implementing SupabaseAdapter:
//
// import type { Adapter } from "@/lib/store/adapter";
// import type { Product, Category, CartItem, AdminSession } from "@/lib/store/types";
//
// export class SupabaseAdapter implements Adapter {
//   constructor(private sb: ReturnType<typeof createClient>) {}
//
//   async listProducts(): Promise<Product[]> {
//     const { data, error } = await this.sb.from("productos").select("*");
//     if (error) throw error;
//     return (data ?? []) as Product[];
//   }
//   // ... etc — see schema.sql for column names
// }

export {};
