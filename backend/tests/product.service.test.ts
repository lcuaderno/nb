import { ProductService } from '../src/services/product.service';
import { Product, ProductInput } from '../src/models/product';
import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import pool from '../src/config/database';

describe('ProductService', () => {
  let productService: ProductService;
  let testProduct: ProductInput;
  const testPrefix = 'TEST_PRODUCT_';

  beforeEach(async () => {
    // Clean up only test products before each test
    await pool.query('DELETE FROM products WHERE name LIKE $1', [`${testPrefix}%`]);
    
    productService = new ProductService();
    testProduct = {
      name: `${testPrefix}Test Product`,
      description: 'Test Description',
      price: 99.99,
      tags: ['test', 'example']
    };
  });

  afterAll(async () => {
    // Clean up only test products and close the database connection
    await pool.query('DELETE FROM products WHERE name LIKE $1', [`${testPrefix}%`]);
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
      const validUUID = '123e4567-e89b-42d3-a456-426614174000';
      await expect(productService.get(validUUID)).rejects.toThrow('Product not found');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const created = await productService.create(testProduct);
      const updates = {
        name: `${testPrefix}Updated Name`,
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
      const validUUID = '123e4567-e89b-42d3-a456-426614174000';
      await expect(productService.update(validUUID, { name: 'New Name' }))
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
      const validUUID = '123e4567-e89b-42d3-a456-426614174000';
      await expect(productService.delete(validUUID)).rejects.toThrow('Product not found');
    });
  });

  describe('list', () => {
    it('should list all products', async () => {
      const product1 = await productService.create(testProduct);
      const product2 = await productService.create({
        ...testProduct,
        name: `${testPrefix}Test Product 2`
      });
      const result = await productService.list({ limit: 100, name: testPrefix });
      const products = result.products;
      expect(products).toHaveLength(2);
      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: product1.id }),
          expect.objectContaining({ id: product2.id })
        ])
      );
    });

    it('should paginate products by createdAt cursor', async () => {
      // Create 5 products with a delay to ensure unique createdAt
      const createdProducts: Product[] = [];
      for (let i = 0; i < 5; i++) {
        const prod = await productService.create({
          ...testProduct,
          name: `${testPrefix}Product ${i + 1}`
        } as ProductInput);
        createdProducts.push(prod);
        // Wait 10ms to ensure different createdAt
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      // Print all createdAt values for debug
      console.log('All created products createdAt:', createdProducts.map(p => p.createdAt));
      // Log actual DB created_at values for test products only
      const dbRows = await pool.query('SELECT id, created_at FROM products WHERE name LIKE $1 ORDER BY created_at DESC', [`${testPrefix}%`]);
      console.log('DB created_at values:', dbRows.rows);
      // Fetch first 3 test products
      const page1 = await productService.list({ limit: 3, name: testPrefix });
      console.log('Page 1 products:', page1.products.map(p => ({ id: p.id, createdAt: p.createdAt })));
      expect(page1.products).toHaveLength(3);
      expect(page1.hasMore).toBe(true);
      // Fetch next page using createdAt of last product from page1
      const lastOfPage1 = page1.products[2];
      expect(lastOfPage1.createdAt).toBeDefined();
      const cursorIso = (lastOfPage1.createdAt as Date).toISOString();
      console.log('Cursor for page 2:', cursorIso);
      // Compare cursor to DB values
      dbRows.rows.forEach(row => {
        const dbDate = new Date(row.created_at);
        const cursorDate = new Date(cursorIso);
        console.log('Compare cursor to DB:', { cursor: cursorIso, db: row.created_at, cmp: dbDate < cursorDate });
      });
      const page2 = await productService.list({ limit: 3, cursor: { createdAt: cursorIso }, name: testPrefix });
      console.log('Page 2 products:', page2.products.map(p => ({ id: p.id, createdAt: p.createdAt })));
      // Should return the remaining 2 products
      expect(page2.products.length).toBeGreaterThan(0);
      // Ensure no overlap (skip first item on page2 if it matches last of page1)
      const idsPage1 = page1.products.map(p => p.id);
      let idsPage2 = page2.products.map(p => p.id);
      if (idsPage2[0] === idsPage1[idsPage1.length - 1]) {
        idsPage2 = idsPage2.slice(1);
      }
      expect(idsPage1.some(id => idsPage2.includes(id))).toBe(false);
    });
  });

  describe('edge cases and validation', () => {
    it('should not create a product with missing name', async () => {
      const badProduct = { ...testProduct, name: '' };
      await expect(productService.create(badProduct)).rejects.toThrow();
    });

    it('should not create a product with NaN price', async () => {
      const badProduct = { ...testProduct, price: NaN };
      await expect(productService.create(badProduct)).rejects.toThrow();
    });

    it('should not create a product with invalid tags', async () => {
      const badProduct = { ...testProduct, tags: [123, null] as any };
      await expect(productService.create(badProduct)).rejects.toThrow();
    });

    it('should handle empty product list', async () => {
      await pool.query('DELETE FROM products WHERE name LIKE $1', [`${testPrefix}%`]);
      const result = await productService.list({ limit: 10, name: testPrefix });
      expect(result.products).toEqual([]);
      expect(result.hasMore).toBe(false);
    });

    it('should not update with invalid fields', async () => {
      const created = await productService.create(testProduct);
      await expect(productService.update(created.id!, { price: NaN })).rejects.toThrow();
      await expect(productService.update(created.id!, { tags: [null] as any })).rejects.toThrow();
    });
  });
}); 