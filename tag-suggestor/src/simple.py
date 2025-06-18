import re
from typing import List

COMMON_TAGS = [
    "electronics", "clothing", "home", "kitchen", "beauty", "sports", "books",
    "toys", "garden", "office", "automotive", "health", "food", "beverages",
    "furniture", "jewelry", "pet", "baby", "outdoor", "indoor", "digital",
    "physical", "premium", "budget", "eco-friendly", "sustainable", "vintage",
    "modern", "classic", "luxury", "casual"
]

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

def calculate_tag_score(text: str, tag: str) -> float:
    text = text.lower()
    score = 0.0
    if tag.lower() in text:
        score += 2.0
    keywords = TAG_KEYWORDS.get(tag, [])
    for keyword in keywords:
        if keyword.lower() in text:
            score += 1.0
    pattern = r'\b' + re.escape(tag.lower()) + r'\b'
    if re.search(pattern, text):
        score += 1.5
    return score

def suggest_tags_simple(name: str, description: str) -> List[str]:
    text = f"{name} {description}"
    tag_scores = [(tag, calculate_tag_score(text, tag)) for tag in COMMON_TAGS]
    tag_scores.sort(key=lambda x: x[1], reverse=True)
    suggested_tags = [tag for tag, score in tag_scores[:3] if score > 0]
    return suggested_tags 