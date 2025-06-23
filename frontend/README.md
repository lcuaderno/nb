# Product Admin Frontend

A modern admin panel for managing products, built with React, TypeScript, and TailwindCSS.

## Features

- Responsive design for mobile, tablet, and desktop
- Product listing with pagination, search, and filtering
- Create, edit, and delete products
- Advanced form validation with error handling
- Token-based authentication
- Real-time updates using React Query
- Tag suggestion integration with AI-powered service
- Cursor-based pagination for efficient data loading

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3011

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components (Layout)
│   ├── hooks/         # Custom React hooks (useAuth)
│   ├── pages/         # Page components (Login, ProductList, ProductForm)
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## Authentication

For demo purposes, use the following credentials:
- Username: admin
- Password: admin

## API Integration

The frontend communicates with the backend API at http://localhost:3010. The API endpoints are:

- `GET /api/products` - List all products with pagination and filtering
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Soft delete a product

### Query Parameters for Product List

- `limit` (optional): Number of items per page (default: 10, max: 100)
- `cursor` (optional): Cursor for pagination (timestamp in ISO format)
- `name` (optional): Filter products by name (partial match)
- `tag` (optional): Filter products by tag (exact match)

### Product Data Structure

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}
```

## Tag Suggestion Integration

The frontend integrates with the tag suggestion service (running on port 8000) to provide AI-powered tag suggestions:

- **Suggest Tags Button**: Available in the product form when both name and description are filled
- **LLM Method**: Uses local LLM (Ollama) for intelligent tag generation
- **Automatic Integration**: Suggested tags are automatically added to the form without duplicates

### Tag Suggestion API

- `POST http://localhost:8000/suggest-tags?method=llm` - Get AI-suggested tags

## Features in Detail

### Product List Page
- **Pagination**: Cursor-based pagination with "Load More" functionality
- **Search**: Real-time search by product name
- **Filtering**: Filter by specific tags
- **Responsive Design**: Optimized for all screen sizes

### Product Form
- **Validation**: Comprehensive form validation with error messages
- **Tag Management**: Add/remove tags with autocomplete
- **Tag Suggestions**: AI-powered tag suggestions from product name and description
- **Category & Brand**: Additional metadata fields for better organization

### Error Handling
- **Network Errors**: Graceful handling of API failures
- **Validation Errors**: Clear error messages for form validation
- **Loading States**: Visual feedback during API calls

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

### Environment Variables

The frontend uses the following environment variables:
- `VITE_API_URL`: Backend API URL (default: http://localhost:3010)

## Docker Support

The frontend can be run in a Docker container as part of the full application stack:

```bash
# Run the entire application stack
docker-compose up --build

# Access the frontend at http://localhost:3011
```

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure the backend is running on port 3010
   - Check CORS configuration if running locally

2. **Tag Suggestion Issues**
   - Ensure the tag suggestion service is running on port 8000
   - Verify Ollama is running for LLM-based suggestions

3. **Pagination Issues**
   - Check that the cursor format is correct
   - Verify the backend pagination logic

## License

MIT 