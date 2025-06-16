import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Metadata API',
      version: '1.0.0',
      description: 'API documentation for the Product Metadata service',
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'description', 'price'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The product ID',
            },
            name: {
              type: 'string',
              description: 'The product name',
            },
            description: {
              type: 'string',
              description: 'The product description',
            },
            price: {
              type: 'number',
              description: 'The product price',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Product tags',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
            error: {
              type: 'string',
              description: 'Error type',
            },
            statusCode: {
              type: 'number',
              description: 'HTTP status code',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 