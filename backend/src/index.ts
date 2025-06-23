import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/product.routes';
import { initializeDatabase, checkDatabaseConnection } from './config/database';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import type { Request, Response, NextFunction } from 'express';

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
app.get('/health', async (req, res) => {
  const dbOk = await checkDatabaseConnection();
  if (dbOk) {
    res.json({ status: 'ok', db: 'up' });
  } else {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

// Initialize database and start server
const start = async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Do not exit; start server anyway
  }
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
  });
};

start();

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
}); 