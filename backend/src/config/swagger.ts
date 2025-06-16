import swaggerJsdoc from 'swagger-jsdoc';

const options = {
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
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options); 