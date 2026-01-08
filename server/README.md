# Freshcart Backend API

Backend server for Freshcart that integrates with external APIs to provide product data.

> **Note**: For detailed API integration documentation, see `docs/API_INTEGRATION.md` in the project root.

## Features

- **USDA FoodData Central Integration**: Fetches nutrition data (calories, protein, carbs, fat)
- **Open Food Facts Integration**: Fetches product information and images
- **Data Merging**: Combines data from multiple sources into unified product model
- **Caching**: In-memory caching to reduce external API calls
- **RESTful API**: Clean endpoints for products and categories

## Setup

1. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure environment**:
   ```bash
   # Create a local .env file (not committed)
   cp env.example .env
   ```
   
   Edit `.env` and add your USDA API key:
   ```
   USDA_API_KEY=your_api_key_here
   ```
   
   Get a free API key at: `https://fdc.nal.usda.gov/api-key-signup/`

   **Alternative (no .env file):** you can export the key in your shell before starting the server:
   ```bash
   export USDA_API_KEY="YOUR_KEY_HERE"
   export PORT=3001
   export CORS_ORIGIN="http://localhost:5173"
   npm run dev
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=slug` - Get products by category
- `GET /api/products?subcategory=name` - Get products by subcategory
- `GET /api/products?search=query` - Search products
- `GET /api/products/:id` - Get product by ID

## Response Format

### Product Response
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "subcategory": "string | null",
  "image": "string (URL)",
  "nutrition": {
    "calories": number | null,
    "protein": number | null,
    "carbs": number | null,
    "fat": number | null
  },
  "unit": "string",
  "price": number
}
```

## External API Integration

### USDA FoodData Central
- **Purpose**: Nutrition data
- **Requires**: API key (free)
- **Rate Limits**: Be respectful, cache responses
- **Data**: Calories, protein, carbs, fat per 100g

### Open Food Facts
- **Purpose**: Product info & images (fallback)
- **Requires**: No API key
- **Rate Limits**: Be respectful, cache responses
- **Data**: Product name, categories, images
- **Documentation**: https://openfoodfacts.github.io/openfoodfacts-server/api/

### UPCitemdb
- **Purpose**: High-quality product images (primary source)
- **Requires**: No API key (free tier: 100 requests/day)
- **Rate Limits**: 100 requests/day on free tier
- **Data**: Product images, titles, descriptions
- **Documentation**: https://www.upcitemdb.com/api

For detailed API integration documentation, see `API_INTEGRATION.md` in this directory.

## Caching

- Products are cached in memory for 1 hour
- External API calls are minimized
- Cache can be cleared by restarting the server

## Notes

- External APIs may have rate limits
- Some products may not have perfect matches in external APIs
- Missing data is handled gracefully (returns null)
- Images fall back to placeholder if not available

