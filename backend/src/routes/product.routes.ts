import { FastifyInstance } from 'fastify';
import { ProductController } from '../controllers/product.controller';

export async function productRoutes(fastify: FastifyInstance) {
  const productController = new ProductController();

  // Register routes with OpenAPI documentation
  fastify.post('/products', {
    schema: {
      description: 'Create a new product',
      tags: ['products'],
      body: {
        type: 'object',
        required: ['name', 'description', 'price', 'tags'],
        properties: {
          name: { type: 'string', maxLength: 255 },
          description: { type: 'string', maxLength: 2000 },
          price: { type: 'number', minimum: 0 },
          tags: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        201: {
          description: 'Product created successfully',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, productController.create.bind(productController));

  fastify.get('/products/:id', {
    schema: {
      description: 'Get a product by ID',
      tags: ['products'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Product found',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, productController.get.bind(productController));

  fastify.put('/products/:id', {
    schema: {
      description: 'Update a product',
      tags: ['products'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 255 },
          description: { type: 'string', maxLength: 2000 },
          price: { type: 'number', minimum: 0 },
          tags: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        200: {
          description: 'Product updated successfully',
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, productController.update.bind(productController));

  fastify.delete('/products/:id', {
    schema: {
      description: 'Delete a product',
      tags: ['products'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        204: {
          description: 'Product deleted successfully',
          type: 'null'
        }
      }
    }
  }, productController.delete.bind(productController));

  fastify.get('/products', {
    schema: {
      description: 'List all products',
      tags: ['products'],
      response: {
        200: {
          description: 'List of products',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              tags: { type: 'array', items: { type: 'string' } },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  }, productController.list.bind(productController));
} 