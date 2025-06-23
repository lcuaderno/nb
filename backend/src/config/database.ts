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
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to database');
      
      // Check if table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'products'
        );
      `);

      if (!tableExists.rows[0].exists) {
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
        console.log('Products table created successfully');
      } else {
        console.log('Products table already exists');
      }
      
      client.release();
      return pool;
    } catch (error) {
      console.error(`Error connecting to database (retries left: ${retries}):`, error);
      retries--;
      if (retries === 0) {
        throw error;
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Initialize database before exporting
initializeDatabase();

// Listen for pool errors to prevent unhandled exceptions from crashing the app
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err);
  // Do not exit the process
});

// Function to check DB connectivity
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
};

export default pool; 