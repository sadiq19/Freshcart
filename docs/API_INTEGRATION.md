# API Integration Guide

This document details the external API integrations used in Freshcart.

## Overview

Freshcart integrates with three external APIs to provide comprehensive product data:
1. **USDA FoodData Central** - Nutrition data
2. **Open Food Facts** - Product metadata & images
3. **UPCitemdb** - High-quality product images

## USDA FoodData Central

**Documentation**: https://fdc.nal.usda.gov/api-guide.html

### Configuration
- Base URL: `https://api.nal.usda.gov/fdc/v1`
- Authentication: API key (free registration)
- Rate Limits: Be respectful

### Implementation
- Service: `server/src/services/usdaService.ts`
- Endpoints Used:
  - `GET /foods/search` - Search foods
  - `GET /food/{fdcId}` - Get food details

### Data Extracted
- Calories (per 100g)
- Protein (per 100g)
- Carbohydrates (per 100g)
- Fat (per 100g)

## Open Food Facts

**Documentation**: https://openfoodfacts.github.io/openfoodfacts-server/api/

### Configuration
- Base URL: `https://world.openfoodfacts.org`
- Authentication: None required
- Rate Limits: Be respectful

### Implementation
- Service: `server/src/services/openFoodFactsService.ts`
- Endpoints Used:
  - `GET /cgi/search.pl` - Search products
  - `GET /api/v0/product/{barcode}.json` - Get product by barcode

### Data Extracted
- Product name
- Product images
- Categories
- Brand information

## UPCitemdb

**Documentation**: https://www.upcitemdb.com/api

### Configuration
- Base URL: `https://api.upcitemdb.com/prod/trial`
- Authentication: None required
- Free Tier: 100 requests/day

### Implementation
- Service: `server/src/services/upcitemdbService.ts`
- Endpoints Used:
  - `GET /lookup?upc={barcode}` - Lookup by barcode
  - `GET /search?s={query}` - Search products

### Data Extracted
- Product images (high quality)
- Product titles
- Product descriptions

## Data Merging Strategy

The `ProductService` merges data from all sources:

1. **Primary Source**: Internal product catalog (name, price, unit)
2. **Images**: UPCitemdb → Open Food Facts → Placeholder
3. **Nutrition**: USDA FoodData Central
4. **Metadata**: Open Food Facts

### Manual Linking
Since there's no direct 1-to-1 mapping between APIs:
- Product name normalization
- Category-based fallback
- Fuzzy matching algorithms

## Error Handling

All API integrations include:
- Try-catch blocks
- Graceful fallbacks
- Null value handling
- User-friendly error messages

## Caching

- Products cached for 1 hour
- Reduces external API calls
- Improves response times

## Rate Limiting

- Batch processing (5 products at a time)
- 500ms delay between batches
- Respects API rate limits

