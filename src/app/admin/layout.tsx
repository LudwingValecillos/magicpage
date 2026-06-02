import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.brand} — Panel admin`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
