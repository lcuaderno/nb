import { Pool } from 'pg';

// Determine if we're running in Docker
const isDocker = process.env.NODE_ENV === 'production';

// Initialize database connection
const pool = new Pool({
  host: isDocker ? 'db' : 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'products',
});

// Initialize database
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to database');
    
    // Create products table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    client.release();
    return pool;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Initialize database before exporting
initializeDatabase();

export default pool; 