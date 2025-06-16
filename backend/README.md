# Product Metadata Microservice

A TypeScript-based microservice for managing product metadata, built with Node.js, Express, and PostgreSQL.

## Features

- Full CRUD operations for products
- Input validation using Zod
- OpenAPI/Swagger documentation
- SQLite database
- Docker support
- Comprehensive test suite

## Tech Stack

- Node.js + TypeScript
- Fastify.js
- SQLite
- Jest
- Docker

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker and Docker Compose (optional, for containerized setup)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── models/         # Data models
│   ├── services/       # Business logic
│   └── index.ts        # Application entry point
├── tests/              # Test files
├── package.json        # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   NODE_ENV=development
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=product_metadata
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `product_metadata`
   - The database schema will be automatically created when you run the application

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Using Docker
```bash
# Build and start the containers
docker-compose up --build

# To run in detached mode
docker-compose up -d
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Example Product Object
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "tags": ["tag1", "tag2"]
}
```

## Development

### Code Style
The project uses ESLint and Prettier for code formatting. To check your code:
```bash
npm run lint
```

### TypeScript
The project is written in TypeScript. To check types:
```bash
npm run type-check
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env`
   - Check if the database exists

2. **Port Conflicts**
   - Change the PORT in `.env` if 3000 is already in use

3. **TypeScript Compilation Errors**
   - Run `npm run type-check` to see detailed errors
   - Ensure all dependencies are installed

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write or update tests
4. Submit a pull request

## License

MIT 