/**
 * Shared types for the client-side store layer.
 * Mirrors the seed types in src/content/site.ts but adds fields that
 * become writable through the admin panel.
 */

import type { BadgeKind } from "@/content/site";

export interface Product {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badges?: BadgeKind[];
  icon: string;
  accent: string;
  description: string;
  details: string[];
  /** Image URLs. Empty array means use the emoji glyph fallback. */
  images: string[];
  /** False = product hidden from catalog/home. Default true. */
  active: boolean;
  /** True = show oldPrice & sale badge. Default false. */
  onSale: boolean;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface CartItem {
  slug: string;
  qty: number;
}

export interface AdminSession {
  user: string;
  loggedAt: number;
}

export type { BadgeKind };
