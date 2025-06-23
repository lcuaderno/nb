import { z } from 'zod';

// Product validation schema
export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  tags: z.array(z.string()),
  price: z.number().positive(),
  category: z.string().max(255).optional(),
  brand: z.string().max(255).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().nullable().optional(),
});

// Type inference from schema
export type Product = z.infer<typeof ProductSchema>;

// Database row type
export interface ProductRow {
  id: string;
  name: string;
  description: string;
  tags: string[];
  price: number;
  category?: string | null;
  brand?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Convert database row to Product
export const rowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  tags: row.tags || [], // PostgreSQL returns null for empty arrays
  price: Number(row.price),
  category: row.category ?? undefined,
  brand: row.brand ?? undefined,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
});

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>; 