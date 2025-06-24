import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

import pytest
import asyncio
from httpx import AsyncClient
from src.service import app

@pytest.mark.asyncio
async def test_suggest_tags_simple():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "Eco Mug", "description": "Reusable, eco-friendly coffee mug"})
        assert resp.status_code == 200
        data = resp.json()
        assert "suggestedTags" in data
        assert isinstance(data["suggestedTags"], list)

@pytest.mark.asyncio
async def test_suggest_tags_empty():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "", "description": ""})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_invalid_method():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags?method=invalid", json={"name": "Eco Mug", "description": "Reusable, eco-friendly coffee mug"})
        # Should fallback to simple
        assert resp.status_code == 200
        data = resp.json()
        assert "suggestedTags" in data

@pytest.mark.asyncio
async def test_suggest_tags_invalid_name():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "Invalid Name", "description": "Reusable, eco-friendly coffee mug"})
        assert resp.status_code == 200
        data = resp.json()
        assert "suggestedTags" in data

@pytest.mark.asyncio
async def test_suggest_tags_invalid_description():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "Eco Mug", "description": "Invalid Description"})
        assert resp.status_code == 200
        data = resp.json()
        assert "suggestedTags" in data

@pytest.mark.asyncio
async def test_suggest_tags_long_name():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "This is a very long name for a product that should not be suggested" * 5, "description": "Reusable, eco-friendly coffee mug"})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_long_description():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "Eco Mug", "description": "This is a very long description for a product that should not be suggested" * 100})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_no_name():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "", "description": "Reusable, eco-friendly coffee mug"})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_no_description():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "Eco Mug", "description": ""})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_no_name_and_description():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags", json={"name": "", "description": ""})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_no_name_and_description_with_method():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags?method=invalid", json={"name": "", "description": ""})
        assert resp.status_code == 422

@pytest.mark.asyncio
async def test_suggest_tags_no_name_and_description_with_invalid_method():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/suggest-tags?method=invalid", json={"name": "", "description": ""})
        assert resp.status_code == 422 