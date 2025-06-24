import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import pytest
pytestmark = pytest.mark.filterwarnings('ignore::RuntimeWarning')
try:
    from src.semantic import suggest_tags_semantic, SEMANTIC_TEST_AVAILABLE
except ImportError:
    SEMANTIC_TEST_AVAILABLE = False

_skipif = pytest.mark.skipif(not SEMANTIC_TEST_AVAILABLE, reason="sentence-transformers or scikit-learn not available")

@_skipif
def test_semantic_tag_suggestion_basic():
    tags = suggest_tags_semantic("Organic Cotton T-Shirt", "Eco-friendly t-shirt made from 100% organic cotton")
    assert isinstance(tags, list)
    assert len(tags) == 3
    assert all(isinstance(tag, str) for tag in tags)

@_skipif
def test_semantic_tag_suggestion_empty():
    tags = suggest_tags_semantic("", "")
    assert isinstance(tags, list)
    assert tags == [] 