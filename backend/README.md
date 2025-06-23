# Product Metadata Microservice

A TypeScript-based microservice for managing product metadata, built with Node.js, Express, and PostgreSQL.

## Features

- Full CRUD operations for products
- Input validation using Zod
- OpenAPI/Swagger documentation
- PostgreSQL database with soft deletes
- Cursor-based pagination
- Search and filtering by name and tags
- Comprehensive error handling with custom error classes
- Docker support
- Comprehensive test suite
- Integration with tag suggestion service

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL
- Jest
- Docker
- Zod for validation
- Winston for logging

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Docker and Docker Compose (optional, for containerized setup)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files (database, swagger)
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
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
   PORT=3010
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=products
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `products`
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

- `GET /api/products` - List all products with pagination and filtering
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Soft delete a product

### Query Parameters for List Endpoint

- `limit` (optional): Number of items per page (default: 10, max: 100)
- `cursor` (optional): Cursor for pagination (timestamp in ISO format)
- `name` (optional): Filter products by name (partial match)
- `tag` (optional): Filter products by tag (exact match)

### Example Product Object
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Electronics",
  "brand": "Brand Name",
  "tags": ["tag1", "tag2"]
}
```

### Pagination Response Format
```json
{
  "data": [...],
  "pagination": {
    "hasNextPage": true,
    "nextCursor": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Handling

The service uses custom error classes for better error management:

- `NotFoundError`: When a resource is not found
- `ValidationError`: When input validation fails
- `DatabaseError`: When database operations fail

All errors return consistent JSON responses with appropriate HTTP status codes.

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

## Integration with Tag Suggestion Service

The backend integrates with the tag suggestion service for automatic tag generation. The frontend can call the tag suggestion service directly to get suggested tags based on product name and description.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Verify database credentials in `.env`
   - Check if the database exists

2. **Port Conflicts**
   - Change the PORT in `.env` if 3010 is already in use

3. **TypeScript Compilation Errors**
   - Run `npm run type-check` to see detailed errors
   - Ensure all dependencies are installed

4. **Pagination Issues**
   - Ensure cursor format is correct (ISO timestamp)
   - Check that the cursor corresponds to an existing record

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write or update tests
4. Submit a pull request

## License

MIT 