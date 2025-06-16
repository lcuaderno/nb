import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/product.routes';
import { initializeDatabase } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
const start = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start(); 