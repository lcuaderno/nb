import requests
from typing import List
import os

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_URL = f"http://{OLLAMA_HOST}:11434/api/generate"
OLLAMA_MODEL = "phi"  #llama3 # Changed to phi which is smaller and requires less memory

PROMPT_TEMPLATE = (
    "You are an assistant that suggests up to 3 relevant product tags for a product. "
    "Given the product name and description, return a JSON array of up to 3 short tags (single words or short phrases, no explanations).\n"
    "Product name: {name}\n"
    "Product description: {description}\n"
    "Tags:"
)

def suggest_tags_llm(name: str, description: str) -> List[str]:
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
    # The LLM response is in result['response']
    # Try to extract a JSON array of tags
    import json
    import re
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
    tags = [t.strip(' ",') for t in re.split(r'[\n,]', text) if t.strip()]
    return tags[:3] 