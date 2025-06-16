import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from '../services/product.service';
import { ProductSchema } from '../models/product';
import { ZodError } from 'zod';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Create a new product
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const productData = ProductSchema.parse(request.body);
      const product = await this.productService.create(productData);
      return reply.code(201).send(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ error: 'Invalid product data', details: error.errors });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  // Get a product by ID
  async get(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const product = await this.productService.get(request.params.id);
      return reply.send(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  // Update a product
  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const productData = ProductSchema.partial().parse(request.body);
      const product = await this.productService.update(request.params.id, productData);
      return reply.send(product);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ error: 'Invalid product data', details: error.errors });
      }
      if (error instanceof Error && error.message === 'Product not found') {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  // Delete a product
  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await this.productService.delete(request.params.id);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return reply.code(404).send({ error: 'Product not found' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  // List all products
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await this.productService.list();
      return reply.send(products);
    } catch (error) {
      console.error('Error in list controller:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
} 