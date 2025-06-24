import requests
from typing import List
import os
import json
import re

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_URL = f"http://{OLLAMA_HOST}:11434/api/generate"
OLLAMA_MODEL = "phi"  #llama3 # Changed to phi which is smaller and requires less memory

PROMPT_TEMPLATE = (
    "You are a product tag generator. Given a product name and description, return ONLY a JSON array of exactly 3 relevant tags.\n"
    "Rules:\n"
    "- Return ONLY the JSON array, no explanations, no text before or after, no numbers, no bullet points.\n"
    "- Use short, relevant tags (1-3 words max).\n"
    "- Make tags specific to the product.\n"
    "- Format: [\"tag1\", \"tag2\", \"tag3\"]\n"
    "- Do NOT return anything except the JSON array.\n"
    "\n"
    "Example (GOOD):\n"
    "Product name: Vintage Television\n"
    "Product description: An old black and white TV from the 1950s\n"
    "Output: [\"antique\", \"classic\", \"retro\"]\n"
    "\n"
    "Example (BAD):\n"
    "Product name: Vintage Television\n"
    "Product description: An old black and white TV from the 1950s\n"
    "Output: Here are three relevant product tags for the given product:\n"
    "1. \"TV - Old\"\n"
    "2. \"Antique - Vintage\"\n"
    "3. \"Black and White\"\n"
    "\n"
    "Product name: {name}\n"
    "Product description: {description}\n"
    "Output:"
)

def suggest_tags_llm(name: str, description: str) -> List[str]:
    """
    Suggest up to 3 tags for a product using a local LLM via Ollama.
    Returns a list of tags. Falls back to splitting if JSON parse fails.
    """
    prompt = PROMPT_TEMPLATE.format(name=name, description=description)
    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=30
    )
    response.raise_for_status()
    result = response.json()
    text = result.get('response', '').strip()
    # Try to find a JSON array in the response
    match = re.search(r'\[.*?\]', text, re.DOTALL)
    if match:
        try:
            tags = json.loads(match.group(0))
            if isinstance(tags, list):
                return [str(tag).strip() for tag in tags if isinstance(tag, str)]
        except Exception:
            pass
    # Fallback: split by commas or newlines
    tags = [t.strip(' "') for t in re.split(r'[\n,]', text) if t.strip()]
    return tags[:3]

def is_ollama_available() -> bool:
    try:
        r = requests.get(f"http://{OLLAMA_HOST}:11434/api/tags", timeout=2)
        return r.status_code == 200
    except Exception:
        return False

__all__ = ["suggest_tags_llm", "is_ollama_available"] 