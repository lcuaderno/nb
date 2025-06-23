import pool from '../config/database';
import { Product, ProductInput, ProductUpdate } from '../models/product';
import { v4 as uuidv4 } from 'uuid';

// Custom error classes
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ProductService {
  // Create a new product
  async create(input: ProductInput): Promise<Product> {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO products (id, name, description, price, tags, category, brand) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [id, input.name, input.description, input.price, input.tags, input.category ?? null, input.brand ?? null]
      );
      return this.rowToProduct(result.rows[0]);
    } catch (err: any) {
      throw new DatabaseError('Failed to create product: ' + err.message);
    }
  }

  // Get a product by ID
  async get(id: string): Promise<Product> {
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid product ID');
    }
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL',
        [id]
      );
      if (result.rows.length === 0) {
        throw new NotFoundError('Product not found');
      }
      return this.rowToProduct(result.rows[0]);
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to get product: ' + err.message);
    }
  }

  // Update a product
  async update(id: string, updates: ProductUpdate): Promise<Product> {
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid product ID');
    }
    const fields = [];
    const values = [];
    let paramCount = 1;
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(updates.name);
      paramCount++;
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(updates.description);
      paramCount++;
    }
    if (updates.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(updates.price);
      paramCount++;
    }
    if (updates.tags !== undefined) {
      fields.push(`tags = $${paramCount}`);
      values.push(updates.tags);
      paramCount++;
    }
    if (updates.category !== undefined) {
      fields.push(`category = $${paramCount}`);
      values.push(updates.category);
      paramCount++;
    }
    if (updates.brand !== undefined) {
      fields.push(`brand = $${paramCount}`);
      values.push(updates.brand);
      paramCount++;
    }
    if (fields.length === 0) {
      return this.get(id);
    }
    values.push(id);
    try {
      const result = await pool.query(
        `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} AND deleted_at IS NULL RETURNING *`,
        values
      );
      if (result.rows.length === 0) {
        throw new NotFoundError('Product not found');
      }
      return this.rowToProduct(result.rows[0]);
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to update product: ' + err.message);
    }
  }

  // Delete a product (soft delete)
  async delete(id: string): Promise<void> {
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid product ID');
    }
    try {
      const result = await pool.query(
        'UPDATE products SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
        [id]
      );
      if (result.rows.length === 0) {
        throw new NotFoundError('Product not found');
      }
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to delete product: ' + err.message);
    }
  }

  // List products with optional cursor-based pagination and search
  async list(options?: { limit?: number; cursor?: { createdAt: string }, name?: string, tag?: string }): Promise<{ products: Product[]; nextCursor: { createdAt: string } | null; hasMore: boolean }> {
    try {
      let query = 'SELECT * FROM products WHERE deleted_at IS NULL';
      const values: any[] = [];
      let paramIdx = 1;
      
      if (options?.name) {
        query += ` AND LOWER(name) LIKE $${paramIdx}`;
        values.push(`%${options.name.toLowerCase()}%`);
        paramIdx++;
      }
      if (options?.tag) {
        query += ` AND $${paramIdx} = ANY(tags)`;
        values.push(options.tag);
        paramIdx++;
      }
      if (options?.cursor) {
        query += ` AND created_at <= $${paramIdx}::timestamptz`;
        values.push(options.cursor.createdAt);
        paramIdx++;
      }
      query += ' ORDER BY created_at DESC';
      if (options?.limit) {
        query += ` LIMIT $${paramIdx}`;
        values.push(options.limit + 1); // Fetch one extra to check for next page
      }
      
      const result = await pool.query(query, values);
      
      const limit = options?.limit || result.rows.length;
      const products = result.rows.slice(0, limit).map(this.rowToProduct);
      
      let nextCursor = null;
      let hasMore = false;
      
      if (options?.limit && result.rows.length > limit) {
        const last = result.rows[limit];
        nextCursor = { createdAt: last.created_at };
        hasMore = true;
      }
      
      return { products, nextCursor, hasMore };
    } catch (err: any) {
      throw new DatabaseError('Failed to list products: ' + err.message);
    }
  }

  // Recover a soft-deleted product
  async recover(id: string): Promise<Product> {
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid product ID');
    }
    try {
      // Only recover if currently soft-deleted
      const result = await pool.query(
        `UPDATE products SET deleted_at = NULL, updated_at = NOW() WHERE id = $1 AND deleted_at IS NOT NULL RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        throw new NotFoundError('Product not found or not deleted');
      }
      return this.rowToProduct(result.rows[0]);
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError('Failed to recover product: ' + err.message);
    }
  }

  // Helper method to convert database row to Product
  private rowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      tags: row.tags || [],
      category: row.category ?? undefined,
      brand: row.brand ?? undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
    };
  }

  // Helper method to validate UUID
  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
} 