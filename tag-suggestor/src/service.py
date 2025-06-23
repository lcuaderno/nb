from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .simple import suggest_tags_simple
from .llm import suggest_tags_llm

# Try to import semantic, but don't fail if not available
try:
    from .semantic import suggest_tags_semantic
    SEMANTIC_AVAILABLE = True
except ImportError:
    SEMANTIC_AVAILABLE = False

import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductRequest(BaseModel):
    name: str
    description: str

@app.post("/suggest-tags")
def suggest_tags(
    req: ProductRequest,
    method: str = Query("simple", enum=["simple", "llm", "semantic"])
):
    if method == "llm":
        tags = suggest_tags_llm(req.name, req.description)
    elif method == "semantic":
        if SEMANTIC_AVAILABLE:
            tags = suggest_tags_semantic(req.name, req.description)
        else:
            # Fallback to simple method if semantic is not available
            tags = suggest_tags_simple(req.name, req.description)
    else:
        tags = suggest_tags_simple(req.name, req.description)
    return {"suggestedTags": tags} 