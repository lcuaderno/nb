import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import pytest
from src.simple import suggest_tags_simple

def test_tag_suggestion_basic():
    tags = suggest_tags_simple("Organic Cotton T-Shirt", "Eco-friendly t-shirt made from 100% organic cotton")
    assert isinstance(tags, list)
    assert len(tags) > 0
    assert all(isinstance(tag, str) for tag in tags)

def test_tag_suggestion_empty():
    tags = suggest_tags_simple("", "")
    assert tags == []

def test_tag_suggestion_case_insensitive():
    tags1 = suggest_tags_simple("ELECTRONICS", "A digital gadget")
    tags2 = suggest_tags_simple("electronics", "a digital gadget")
    assert tags1 == tags2

def test_tag_suggestion_max_three():
    tags = suggest_tags_simple("Modern Eco-Friendly Luxury Car", "A premium, sustainable, high-end vehicle")
    assert len(tags) <= 3

def test_tag_suggestion_no_match():
    tags = suggest_tags_simple("Unrelated", "No matching keywords here")
    assert tags == [] 