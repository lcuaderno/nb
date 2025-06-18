from fastapi import FastAPI, Query
from pydantic import BaseModel
from .simple import suggest_tags_simple
from .llm import suggest_tags_llm
from .semantic import suggest_tags_semantic
import os

app = FastAPI()

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
        tags = suggest_tags_semantic(req.name, req.description)
    else:
        tags = suggest_tags_simple(req.name, req.description)
    return {"suggestedTags": tags} 