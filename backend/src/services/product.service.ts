import pool from '../config/database';
import { Product, ProductInput, ProductUpdate } from '../models/product';
import { v4 as uuidv4 } from 'uuid';

export class ProductService {
  // Create a new product
  async create(input: ProductInput): Promise<Product> {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO products (id, name, description, price, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, input.name, input.description, input.price, input.tags]
    );
    return this.rowToProduct(result.rows[0]);
  }

  // Get a product by ID
  async get(id: string): Promise<Product> {
    if (!this.isValidUUID(id)) {
      throw new Error('Product not found');
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }
    
    return this.rowToProduct(result.rows[0]);
  }

  // Update a product
  async update(id: string, updates: ProductUpdate): Promise<Product> {
    if (!this.isValidUUID(id)) {
      throw new Error('Product not found');
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

    if (fields.length === 0) {
      return this.get(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }

    return this.rowToProduct(result.rows[0]);
  }

  // Delete a product
  async delete(id: string): Promise<void> {
    if (!this.isValidUUID(id)) {
      throw new Error('Product not found');
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }
  }

  // List all products
  async list(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows.map(this.rowToProduct);
  }

  // Helper method to convert database row to Product
  private rowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      tags: row.tags || [],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  // Helper method to validate UUID
  private isValidUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
} 