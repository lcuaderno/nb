import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import pytest
try:
    from src.llm import suggest_tags_llm, is_ollama_available
except ImportError:
    is_ollama_available = lambda: False

_skipif = pytest.mark.skipif(not is_ollama_available(), reason="Ollama not available")

@_skipif
def test_llm_tag_suggestion_basic():
    tags = suggest_tags_llm("Organic Cotton T-Shirt", "Eco-friendly t-shirt made from 100% organic cotton")
    assert isinstance(tags, list)
    assert len(tags) == 3
    assert all(isinstance(tag, str) for tag in tags)

@_skipif
def test_llm_tag_suggestion_empty():
    tags = suggest_tags_llm("", "")
    assert isinstance(tags, list)
    assert len(tags) == 3 or len(tags) == 0 