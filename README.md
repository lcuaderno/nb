# Product Management System

A comprehensive product management system with AI-powered tag suggestions, built with modern web technologies and microservices architecture.

## Overview

This system consists of three main services:

1. **Backend API** (Node.js/Express/PostgreSQL) - Product CRUD operations with pagination and filtering
2. **Frontend** (React/TypeScript/Tailwind) - Modern admin interface with real-time updates
3. **Tag Suggestion Service** (Python/FastAPI/Ollama) - AI-powered tag generation using local LLMs

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │ Tag Suggestion  │
│   (React)       │◄──►│   (Express)     │    │   (FastAPI)     │
│   Port: 3011    │    │   Port: 3010    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │     Ollama      │
                       │   Port: 5432    │    │   Port: 11434   │
                       └─────────────────┘    └─────────────────┘
```

## Features

### Backend API
- Full CRUD operations for products
- Cursor-based pagination for efficient data loading
- Search and filtering by name and tags
- Soft deletes with audit trail
- Comprehensive validation and error handling
- OpenAPI/Swagger documentation
- PostgreSQL with automatic schema creation

### Frontend
- Modern, responsive admin interface
- Real-time product management with React Query
- Advanced form validation and error handling
- Search and filtering capabilities
- AI-powered tag suggestions
- Cursor-based pagination with "Load More" functionality

### Tag Suggestion Service
- Three tag suggestion methods:
  - **Simple**: Keyword-based matching
  - **Semantic**: Sentence-transformers for semantic similarity
  - **LLM**: Local LLM (Ollama) for intelligent tag generation
- Modular architecture for easy extension
- CORS support for frontend integration

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for local development)

### Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nb
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3011
   - Backend API: http://localhost:3010
   - Tag Suggestion Service: http://localhost:8000
   - PostgreSQL: localhost:5432

4. **Set up Ollama for tag suggestions**
   ```bash
   # Pull a model for LLM-based tag suggestions
   docker exec -it nb-ollama-1 ollama pull phi
   ```

5. **Login to the frontend**
   - Username: `admin`
   - Password: `admin`

### Running Locally

See individual service READMEs for detailed local setup instructions:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Tag Suggestion Service README](tag-suggestor/README.md)

## API Documentation

### Backend API Endpoints

- `GET /api/products` - List products with pagination and filtering
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product

### Tag Suggestion API

- `POST /suggest-tags?method=llm` - Get AI-suggested tags

## Development

### Project Structure
```
nb/
├── backend/           # Express.js API service
├── frontend/          # React frontend application
├── tag-suggestor/     # Python FastAPI tag suggestion service
├── docker-compose.yml # Complete application stack
└── README.md         # This file
```

### Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Tag Suggestion Service Development**
   ```bash
   cd tag-suggestor
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn src.service:app --host 0.0.0.0 --port 8000
   ```

### Testing

Each service has its own test suite:

```bash
# Backend tests
cd backend && npm test

# Frontend tests (if configured)
cd frontend && npm test
```

## Configuration

### Environment Variables

The system uses environment variables for configuration. See individual service READMEs for details:

- [Backend Environment Variables](backend/README.md#environment-configuration)
- [Frontend Environment Variables](frontend/README.md#environment-variables)

### Database

The system uses PostgreSQL with automatic schema creation. The database is configured to:
- Create tables automatically on startup
- Use soft deletes (deleted_at column)
- Support pagination with cursor-based queries
- Include audit fields (created_at, updated_at)

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3010, 3011, 8000, and 5432 are available
   - Check for existing services using these ports

2. **Database Connection**
   - Verify PostgreSQL is running and accessible
   - Check database credentials in environment variables

3. **Tag Suggestion Issues**
   - Ensure Ollama is running and accessible
   - Verify the model is downloaded: `ollama list`
   - Check CORS configuration for frontend integration

4. **Docker Issues**
   - Rebuild containers: `docker-compose up --build`
   - Check container logs: `docker-compose logs [service-name]`
   - Ensure Docker has sufficient resources allocated

### Getting Help

- Check individual service READMEs for detailed troubleshooting
- Review Docker logs for service-specific issues
- Ensure all prerequisites are installed and configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT 