import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { productRoutes } from './routes/product.routes';
import pool from './config/database';

const server = fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: true
});

// Register Swagger
server.register(swagger, {
  openapi: {
    info: {
      title: 'Product Metadata API',
      description: 'API for managing product metadata',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ]
  }
});

server.register(swaggerUi, {
  routePrefix: '/documentation'
});

// Register routes
server.register(productRoutes);

// Start server
const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
    console.log('API documentation available at http://localhost:3000/documentation');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 