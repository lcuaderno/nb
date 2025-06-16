from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List
import re
from llm_suggestor import suggest_tags_llm

app = FastAPI(title="Tag Suggestion Service")

# Common product tags for matching
COMMON_TAGS = [
    "electronics", "clothing", "home", "kitchen", "beauty", "sports", "books",
    "toys", "garden", "office", "automotive", "health", "food", "beverages",
    "furniture", "jewelry", "pet", "baby", "outdoor", "indoor", "digital",
    "physical", "premium", "budget", "eco-friendly", "sustainable", "vintage",
    "modern", "classic", "luxury", "casual"
]

# Tag keywords for matching
TAG_KEYWORDS = {
    "electronics": ["electronic", "digital", "tech", "computer", "phone", "laptop", "gadget"],
    "clothing": ["clothes", "shirt", "dress", "jacket", "pants", "shoes", "fashion"],
    "home": ["home", "house", "apartment", "living", "room", "bedroom"],
    "kitchen": ["kitchen", "cook", "cooking", "utensil", "appliance", "food"],
    "beauty": ["beauty", "cosmetic", "makeup", "skincare", "perfume", "fragrance"],
    "sports": ["sport", "fitness", "exercise", "gym", "athletic", "training"],
    "books": ["book", "reading", "literature", "novel", "textbook", "magazine"],
    "toys": ["toy", "game", "play", "children", "kids", "entertainment"],
    "garden": ["garden", "plant", "flower", "outdoor", "lawn", "yard"],
    "office": ["office", "work", "business", "stationery", "desk", "chair"],
    "automotive": ["car", "vehicle", "auto", "automotive", "tire", "engine"],
    "health": ["health", "medical", "wellness", "fitness", "vitamin", "supplement"],
    "food": ["food", "grocery", "snack", "meal", "ingredient", "recipe"],
    "beverages": ["drink", "beverage", "water", "juice", "coffee", "tea"],
    "furniture": ["furniture", "table", "chair", "sofa", "bed", "cabinet"],
    "jewelry": ["jewelry", "accessory", "necklace", "ring", "bracelet", "watch"],
    "pet": ["pet", "animal", "dog", "cat", "pet food", "pet care"],
    "baby": ["baby", "infant", "child", "toy", "diaper", "stroller"],
    "outdoor": ["outdoor", "camping", "hiking", "sport", "recreation"],
    "indoor": ["indoor", "home", "house", "apartment", "room"],
    "digital": ["digital", "online", "virtual", "software", "app", "download"],
    "physical": ["physical", "tangible", "material", "product", "item"],
    "premium": ["premium", "luxury", "high-end", "exclusive", "quality"],
    "budget": ["budget", "affordable", "cheap", "economical", "value"],
    "eco-friendly": ["eco", "green", "sustainable", "environmental", "recycled"],
    "sustainable": ["sustainable", "eco", "green", "environmental", "recycled"],
    "vintage": ["vintage", "retro", "classic", "antique", "old"],
    "modern": ["modern", "contemporary", "new", "current", "trendy"],
    "classic": ["classic", "traditional", "timeless", "vintage", "retro"],
    "luxury": ["luxury", "premium", "high-end", "exclusive", "quality"],
    "casual": ["casual", "everyday", "informal", "comfortable", "relaxed"]
}

class TagRequest(BaseModel):
    name: str
    description: str

class TagResponse(BaseModel):
    suggestedTags: List[str]

def calculate_tag_score(text: str, tag: str) -> float:
    """Calculate a score for how well a tag matches the text."""
    text = text.lower()
    score = 0.0
    
    # Direct tag match
    if tag.lower() in text:
        score += 2.0
    
    # Keyword matches
    keywords = TAG_KEYWORDS.get(tag, [])
    for keyword in keywords:
        if keyword.lower() in text:
            score += 1.0
    
    # Word boundary matches
    pattern = r'\b' + re.escape(tag.lower()) + r'\b'
    if re.search(pattern, text):
        score += 1.5
    
    return score

@app.post("/suggest-tags", response_model=TagResponse)
async def suggest_tags(request: TagRequest, method: str = Query("simple", enum=["simple", "llm"])):
    try:
        if method == "llm":
            tags = suggest_tags_llm(request.name, request.description)
            return TagResponse(suggestedTags=tags)
        # Default: simple method
        text = f"{request.name} {request.description}"
        
        # Calculate scores for all tags
        tag_scores = [(tag, calculate_tag_score(text, tag)) for tag in COMMON_TAGS]
        
        # Sort by score and get top 3
        tag_scores.sort(key=lambda x: x[1], reverse=True)
        suggested_tags = [tag for tag, score in tag_scores[:3] if score > 0]
        
        return TagResponse(suggestedTags=suggested_tags)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 