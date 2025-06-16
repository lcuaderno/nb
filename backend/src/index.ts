import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/product.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import pool from './config/database';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/api/products', productRoutes);

// Start server
const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    await app.listen(port);
    console.log(`Server is running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(); 