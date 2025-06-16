import { ProductService } from '../src/services/product.service';
import { Product } from '../src/models/product';
import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import pool from '../src/config/database';

describe('ProductService', () => {
  let productService: ProductService;
  let testProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

  beforeEach(async () => {
    // Clean up the database before each test
    await pool.query('DELETE FROM products');
    
    productService = new ProductService();
    testProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      tags: ['test', 'example']
    };
  });

  afterAll(async () => {
    // Clean up and close the database connection
    await pool.query('DELETE FROM products');
    await pool.end();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = await productService.create(testProduct);
      expect(product).toMatchObject({
        name: testProduct.name,
        description: testProduct.description,
        price: testProduct.price,
        tags: testProduct.tags
      });
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
    });
  });

  describe('get', () => {
    it('should get a product by id', async () => {
      const created = await productService.create(testProduct);
      const retrieved = await productService.get(created.id!);
      expect(retrieved).toEqual(created);
    });

    it('should throw error when product not found', async () => {
      await expect(productService.get('non-existent-id')).rejects.toThrow('Product not found');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const created = await productService.create(testProduct);
      const updates = {
        name: 'Updated Name',
        price: 149.99
      };
      const updated = await productService.update(created.id!, updates);
      expect(updated).toMatchObject({
        id: created.id,
        name: updates.name,
        price: updates.price,
        description: created.description,
        tags: created.tags
      });
    });

    it('should throw error when updating non-existent product', async () => {
      await expect(productService.update('non-existent-id', { name: 'New Name' }))
        .rejects.toThrow('Product not found');
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const created = await productService.create(testProduct);
      await expect(productService.delete(created.id!)).resolves.not.toThrow();
      await expect(productService.get(created.id!)).rejects.toThrow('Product not found');
    });

    it('should throw error when deleting non-existent product', async () => {
      await expect(productService.delete('non-existent-id')).rejects.toThrow('Product not found');
    });
  });

  describe('list', () => {
    it('should list all products', async () => {
      const product1 = await productService.create(testProduct);
      const product2 = await productService.create({
        ...testProduct,
        name: 'Test Product 2'
      });
      const products = await productService.list();
      expect(products).toHaveLength(2);
      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: product1.id }),
          expect.objectContaining({ id: product2.id })
        ])
      );
    });
  });
}); 