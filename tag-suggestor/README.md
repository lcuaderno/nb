# Tag Suggestion Service

A service that suggests product tags based on product name and description. Supports three methods: basic keyword-matching, semantic matching (sentence-transformers), and a local LLM (Ollama) method.

## Features

- **Simple method:** Uses keyword and tag matching (no extra dependencies, see `src/simple.py`)
- **Semantic method:** Uses sentence-transformers (all-MiniLM-L6-v2) for semantic similarity, see `src/semantic.py`
- **LLM method:** Uses a local LLM (e.g., Phi, Llama2, or Mistral via Ollama, see `src/llm.py`)
- Modular: Easily switch between methods via a query parameter
- FastAPI-based REST API with CORS support
- Returns up to 3 most relevant tags
- Integration with the full product management application stack

## Modular Structure

- The service is now modular: each tag suggestion method is implemented in its own module.
    - `src/simple.py`: Simple keyword/tag-based suggestion logic
    - `src/semantic.py`: Semantic similarity using sentence-transformers
    - `src/llm.py`: LLM-based suggestion logic (calls Ollama)
- The FastAPI app in `src/service.py` routes requests to the appropriate module based on the `method` query parameter.
- You can add more methods by creating new modules and updating `service.py`.

## Setup

### Option 1: Docker Setup (Recommended)

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the services:
```bash
docker-compose up --build
```

This will start:
- Tag suggestor service on port 8000
- Ollama service on port 11434

### Option 2: Standalone Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install Ollama:
- Download from [Ollama's website](https://ollama.com/download)
- Follow the installation instructions for your OS

4. Start Ollama:
```bash
# Stop any existing Ollama processes
pkill ollama

# Start Ollama in the background
ollama serve
```

5. Verify Ollama is running:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If you get a response, Ollama is running correctly
```

6. Pull a model (choose one):
```bash
ollama pull phi      # Smallest, fastest
ollama pull llama2   # Medium size
ollama pull mistral  # Larger, more capable
```

7. Start the tag suggestor service:
```bash
uvicorn src.service:app --host 0.0.0.0 --port 8000
```

## Running the Service

### Docker Mode

1. Start the services:
```bash
docker-compose up --build
```

2. Pull a model in the Ollama container:
```bash
docker exec -it tag-suggestor-ollama-1 ollama pull phi
```

3. Test the service:
```bash
# Test the simple method
curl -X POST 'http://localhost:8000/suggest-tags' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'

# Test the semantic method
curl -X POST 'http://localhost:8000/suggest-tags?method=semantic' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'

# Test the LLM method
curl -X POST 'http://localhost:8000/suggest-tags?method=llm' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'
```

### Standalone Mode

1. Start Ollama:
```bash
# Stop any existing Ollama processes
pkill ollama

# Start Ollama in the background
ollama serve
```

2. Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

3. In a new terminal, start the tag suggestor:
```bash
uvicorn src.service:app --host 0.0.0.0 --port 8000
```

4. Test the service:
```bash
# Test the simple method
curl -X POST 'http://localhost:8000/suggest-tags' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'

# Test the semantic method
curl -X POST 'http://localhost:8000/suggest-tags?method=semantic' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'

# Test the LLM method
curl -X POST 'http://localhost:8000/suggest-tags?method=llm' \
  -H "Content-Type: application/json" \
  -d '{"name": "Organic Cotton T-Shirt", "description": "Eco-friendly t-shirt made from 100% organic cotton"}'
```

## Managing Ollama Models

### List Available Models
```bash
ollama list
```

### Show Model Details
```bash
ollama show phi
```

### Run Model Interactively
```bash
ollama run phi
```

### Pull New Model
```bash
ollama pull phi
```

### Delete Model
```bash
# Delete a specific model
ollama rm phi

# Delete multiple models
ollama rm phi llama2 mistral

# Delete all models
ollama rm $(ollama list | awk '{print $1}')
```

### Clean Up
```bash
# Remove all unused models and free up disk space
ollama prune
```

## API Usage

### Suggest Tags

**Endpoint:** `POST /suggest-tags`

**Query Parameter:**
- `method=simple` (default): Use the simple keyword-based method
- `method=semantic`: Use the sentence-transformers semantic method
- `method=llm`: Use the local LLM via Ollama

**Request Body:**
```json
{
    "name": "Product Name",
    "description": "Product Description"
}
```

**Response:**
```json
{
    "suggestedTags": ["tag1", "tag2", "tag3"]
}
```

## Integration with Product Management System

The tag suggestion service is integrated with the full product management application stack:

- **Frontend Integration**: The React frontend calls this service to get AI-powered tag suggestions
- **CORS Support**: Configured to accept requests from the frontend (http://localhost:3011)
- **Docker Integration**: Runs as part of the complete application stack via docker-compose

### Frontend Usage

The frontend automatically calls this service when the "Suggest Tags" button is clicked in the product form:

```javascript
// Example frontend call
const response = await fetch('http://localhost:8000/suggest-tags?method=llm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, description })
});
```

## LLM Method Improvements

The LLM method has been enhanced with:

- **Improved Prompts**: Clear instructions with examples for better tag generation
- **Response Cleaning**: Automatic cleaning of LLM responses to extract only valid tags
- **Error Handling**: Graceful handling of LLM failures and malformed responses
- **CORS Support**: Proper CORS configuration for frontend integration

## Troubleshooting

1. **Ollama Connection Issues:**
   - Make sure Ollama is running: `ps aux | grep ollama`
   - Stop any existing Ollama processes: `pkill ollama`
   - Start Ollama fresh: `ollama serve`
   - Verify Ollama is accessible: `curl http://localhost:11434/api/tags`
   - Check if the model is downloaded: `ollama list`

2. **Semantic Method ImportError:**
   - If you see an error about `cached_download` from `huggingface_hub`, ensure you have `huggingface_hub>=0.10,<0.17` in your `requirements.txt`.
   - Rebuild your Docker image after updating requirements.

3. **Memory Issues:**
   - If you get memory errors, try using a smaller model like `phi`
   - Adjust Docker memory limits if using Docker

4. **Model Issues:**
   - Try pulling the model again: `ollama pull phi`
   - Check model compatibility: `ollama show phi`
   - Make sure you're using a model that's actually downloaded

5. **Port Conflicts:**
   - Check if port 11434 is already in use: `lsof -i :11434`
   - Check if port 8000 is already in use: `lsof -i :8000`
   - Stop any conflicting services

6. **CORS Issues:**
   - Ensure the service is running with CORS enabled
   - Check that the frontend is making requests from the correct origin
   - Verify the CORS configuration in `src/service.py`

## Modularity
- The service is modular: you can add more methods or swap out the LLM or matching logic easily.
- See `src/simple.py`, `src/semantic.py`, and `src/llm.py` for details.

## License

MIT 