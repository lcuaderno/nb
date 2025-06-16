# Product Metadata Microservice

A TypeScript-based microservice that exposes a REST API for managing product metadata. This service enables integration with search, recommendation, and AI enrichment services.

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

- Node.js 18 or higher
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will be available at http://localhost:3000
API documentation will be available at http://localhost:3000/documentation

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Docker

Build and run using Docker Compose:
```bash
docker-compose up --build
```

## API Endpoints

### Create Product
- **POST** `/products`
- Body:
  ```json
  {
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "tags": ["tag1", "tag2"]
  }
  ```

### Get Product
- **GET** `/products/:id`

### Update Product
- **PUT** `/products/:id`
- Body: Same as create, but all fields are optional

### Delete Product
- **DELETE** `/products/:id`

### List Products
- **GET** `/products`

## Data Model

### Product
- `id`: UUID (auto-generated)
- `name`: string (max 255, required)
- `description`: string (max 2000, required)
- `tags`: string[]
- `price`: number (positive, required)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 