import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductSchema } from '../models/product';
import { ZodError } from 'zod';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Create a new product
  async create(req: Request, res: Response) {
    try {
      const productData = ProductSchema.parse(req.body);
      const product = await this.productService.create(productData);
      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Invalid product data', details: error.errors });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get a product by ID
  async get(req: Request, res: Response) {
    try {
      const product = await this.productService.get(req.params.id);
      return res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update a product
  async update(req: Request, res: Response) {
    try {
      const productData = ProductSchema.partial().parse(req.body);
      const product = await this.productService.update(req.params.id, productData);
      return res.json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: 'Invalid product data', details: error.errors });
      }
      if (error instanceof Error && error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete a product
  async delete(req: Request, res: Response) {
    try {
      await this.productService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // List all products
  async list(req: Request, res: Response) {
    try {
      const products = await this.productService.list();
      return res.json(products);
    } catch (error) {
      console.error('Error in list controller:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
} 