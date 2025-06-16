# Product Admin Frontend

A minimalistic admin panel for managing products, built with React, TypeScript, and TailwindCSS.

## Features

- Responsive design for mobile, tablet, and desktop
- Product listing with search and filtering
- Create, edit, and delete products
- Form validation
- Token-based authentication
- Real-time updates using React Query

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

The application will be available at http://localhost:3001

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
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
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

The frontend communicates with the backend API at http://localhost:3000. The API endpoints are:

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

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

## License

MIT 