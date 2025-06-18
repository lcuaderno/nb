from typing import List
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

COMMON_TAGS = [
    "electronics", "clothing", "home", "kitchen", "beauty", "sports", "books",
    "toys", "garden", "office", "automotive", "health", "food", "beverages",
    "furniture", "jewelry", "pet", "baby", "outdoor", "indoor", "digital",
    "physical", "premium", "budget", "eco-friendly", "sustainable", "vintage",
    "modern", "classic", "luxury", "casual"
]

_model = None
def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def suggest_tags_semantic(name: str, description: str) -> List[str]:
    model = get_model()
    input_text = f"{name} {description}"
    input_emb = model.encode([input_text])
    tag_embs = model.encode(COMMON_TAGS)
    sims = cosine_similarity(input_emb, tag_embs)[0]
    top_indices = np.argsort(sims)[::-1][:3]
    return [COMMON_TAGS[i] for i in top_indices] 