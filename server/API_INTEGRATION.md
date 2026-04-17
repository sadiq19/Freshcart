# Backend API Integration Documentation

## Overview

This document describes the integration of three external APIs used in Freshcart:
1. **USDA FoodData Central API** - Nutrition data
2. **Open Food Facts API** - Product metadata & images  
3. **UPCitemdb API** - High-quality product images

All APIs are integrated following their official documentation, with manual linking logic to connect product data from multiple sources.

---

## PART 1 — API ACTIVATION & SETUP

### 1. Open Food Facts API

**Status**: ✅ Fully Integrated

**Configuration**:
- **Base URL**: `https://world.openfoodfacts.org`
- **API Version**: `v0`
- **API Key**: Not required (public API)
- **User-Agent**: Required (set to `Freshcart-Backend/1.0`)

**Official Documentation**: https://openfoodfacts.github.io/openfoodfacts-server/api/

**Endpoints Used**:

1. **Search Products** (`/cgi/search.pl`)
   - Method: GET
   - Parameters:
     - `search_terms`: Product name, brand, or category
     - `search_simple`: 1 (simple search mode)
     - `action`: process
     - `json`: 1 (JSON response)
     - `page_size`: Number of results
     - `page`: Page number
     - `fields`: Comma-separated list of fields to return
   - Returns: Array of products with metadata

2. **Get Product by Barcode** (`/api/v0/product/{barcode}.json`)
   - Method: GET
   - Parameters:
     - `barcode`: Product barcode (EAN-13, UPC-A, etc.)
   - Returns: Single product with full details

**Implementation**: `server/src/services/openFoodFactsService.ts`

### 2. USDA FoodData Central API

**Status**: ✅ Fully Integrated

**Configuration**:
- **Base URL**: `https://api.nal.usda.gov/fdc/v1`
- **API Key**: Required (free registration)
- **User-Agent**: Required (set to `Freshcart-Backend/1.0`)

**Official Documentation**: https://fdc.nal.usda.gov/api-guide.html

**API Key Registration**: https://fdc.nal.usda.gov/api-key-signup/

**Endpoints Used**:

1. **Search Foods** (`/foods/search`)
   - Method: GET
   - Parameters:
     - `api_key`: Your API key (required)
     - `query`: Food name or description
     - `pageSize`: Number of results (default: 1)
     - `pageNumber`: Page number (default: 1)
     - `dataType`: Optional filter (Foundation, SR Legacy, Branded, etc.)
   - Returns: Array of foods with basic nutrition data

2. **Get Food Details** (`/food/{fdcId}`)
   - Method: GET
   - Parameters:
     - `api_key`: Your API key (required)
     - `fdcId`: FoodData Central ID
     - `nutrients`: Optional comma-separated nutrient IDs
   - Returns: Detailed food information with full nutrition data

**Nutrient IDs Used** (per 100g):
- `1008`: Energy (kcal)
- `1003`: Protein
- `1005`: Carbohydrate, by difference
- `1004`: Total lipid (fat)
- `1079`: Fiber (optional)
- `2000`: Sugars (optional)

**Implementation**: `server/src/services/usdaService.ts`

---

## PART 2 — MANUAL NORMALIZATION & LINKING

### The Challenge

There is **no direct 1-to-1 mapping** between Open Food Facts products and USDA nutrition data:
- Open Food Facts focuses on **packaged products** (barcodes, brands)
- USDA focuses on **generic foods** (ingredients, raw foods)
- Product names vary between sources
- Categories don't align perfectly

### Manual Linking Strategy

The `ProductService` implements a **multi-strategy manual linking approach**:

#### Strategy 1: Product Name Matching

1. **Normalize product names**:
   - Remove language-specific characters (å, ä, ø → a, a, o)
   - Remove common prefixes (norsk, økologisk, fersk)
   - Convert to lowercase
   - Remove special characters

2. **Search both APIs** with normalized names

3. **Find best match** using similarity algorithms:
   - Exact match
   - Contains match
   - Fuzzy matching

#### Strategy 2: Category-Based Fallback

If exact product match fails:

1. **Map categories** to generic food terms:
   ```typescript
   'Frukt og grønt' → 'fresh fruit'
   'Kylling og kjøtt' → 'chicken'
   'Fisk og sjømat' → 'fish'
   'Meieri, ost og egg' → 'milk'
   ```

2. **Search USDA** with generic category terms

3. **Use first result** as fallback nutrition data

#### Strategy 3: Data Merging

Once data is fetched from both APIs:

1. **Primary data source**: Internal product catalog (name, price, unit)
2. **Metadata source**: Open Food Facts (images, categories, brands)
3. **Nutrition source**: USDA FoodData Central (calories, protein, carbs, fat)

4. **Merge logic**:
   - Use internal name as primary
   - Use UPCitemdb image (priority 1), OFF image (priority 2), or placeholder
   - Use USDA nutrition if available, else null values
   - Detect organic/local from both sources

### Implementation Details

**File**: `server/src/services/productService.ts`

**Key Methods**:

1. `createProduct(source)` - Main method that orchestrates the linking
2. `prepareSearchTerms(source)` - Normalizes queries for each API
3. `detectOrganic()` - Checks both sources for organic indicators
4. `detectLocal()` - Checks both sources for local/Norwegian indicators

**Configuration**:

The service uses a `LinkingConfig` object for manual configuration:

```typescript
{
  categoryMappings: {
    'Frukt og grønt': 'fruits vegetables',
    // ... more mappings
  },
  productNameMappings: {
    'økologisk': 'organic',
    'norsk': 'norwegian',
    // ... more mappings
  }
}
```

This configuration can be updated at runtime to improve linking accuracy.

---

## PART 3 — DATA FLOW

### Request Flow

```
1. Product Source Data (Internal Catalog)
   ↓
2. ProductService.createProduct()
   ↓
3. Prepare Search Terms (Normalize & Map)
   ↓
4. Parallel API Calls
   ├─→ UPCitemdb API
   │   └─→ High-quality product images
   ├─→ Open Food Facts API
   │   └─→ Product metadata & images (fallback)
   └─→ USDA FoodData Central API
       └─→ Nutrition data
   ↓
5. Manual Linking & Merging
   ├─→ Match products by name similarity
   ├─→ Fallback to category-based search
   └─→ Merge data into unified model
   ↓
6. Cache Result
   ↓
7. Return BackendProduct
```

### Response Format

The merged product follows this structure:

```typescript
{
  id: string,                    // Generated from name + category
  name: string,                   // From internal catalog (primary)
  category: string,              // From internal catalog
  subcategory: string | null,   // From internal catalog
  image: string,                 // From UPCitemdb/Open Food Facts (or placeholder)
  nutrition: {
    calories: number | null,     // From USDA (or null)
    protein: number | null,      // From USDA (or null)
    carbs: number | null,        // From USDA (or null)
    fat: number | null,          // From USDA (or null)
  },
  unit: string,                  // From internal catalog
  price: number,                 // From internal catalog
  description?: string,          // From Open Food Facts or internal
  inStock: boolean,              // Default: true
  isOrganic: boolean,            // Detected from both sources
  isLocal: boolean,              // Detected from both sources
}
```

---

## PART 4 — ERROR HANDLING & FALLBACKS

### Missing Data Handling

1. **No Open Food Facts match**:
   - Returns placeholder image
   - Uses internal description if available

2. **No USDA match**:
   - Returns null values for all nutrition fields
   - Frontend handles null gracefully

3. **API errors**:
   - Logged to console
   - Returns partial data (whatever is available)
   - Never crashes the application

### Rate Limiting

- **Batch processing**: Products processed in batches of 5
- **Delays**: 500ms delay between batches
- **Caching**: Results cached for 1 hour
- **User-Agent**: Properly set to identify requests

---

## PART 5 — TESTING & VALIDATION

### Testing Checklist

- [x] Open Food Facts search endpoint works
- [x] Open Food Facts product endpoint works
- [x] USDA search endpoint works
- [x] USDA food detail endpoint works
- [x] Manual linking logic works
- [x] Data merging works correctly
- [x] Error handling works
- [x] Caching works
- [x] Rate limiting respected

### Example Test Cases

1. **Exact Match**: "Banana" → Should find in both APIs
2. **Partial Match**: "Organic Banana" → Should find generic banana nutrition
3. **No Match**: "Unknown Product" → Should return null nutrition, placeholder image
4. **Category Fallback**: "Norwegian Salmon" → Should find fish nutrition

---

## PART 6 — MAINTENANCE & UPDATES

### Monitoring

- Log all API calls
- Track success/failure rates
- Monitor cache hit rates
- Watch for API changes

### Updating Linking Rules

The `LinkingConfig` can be updated at runtime:

```typescript
productService.updateLinkingConfig({
  categoryMappings: {
    'New Category': 'new-search-term',
  },
  productNameMappings: {
    'new-term': 'mapped-term',
  },
});
```

### API Changes

If either API changes:
1. Check official documentation
2. Update endpoint URLs if needed
3. Update request/response interfaces
4. Test thoroughly
5. Update this documentation

---

## Conclusion

The integration follows official API documentation step-by-step, with manual linking logic to connect product data from both sources. The system is designed to be:

- **Resilient**: Handles missing data gracefully
- **Flexible**: Linking rules can be updated
- **Efficient**: Caching and batching reduce API calls
- **Maintainable**: Clear separation of concerns
- **Documented**: This document explains the entire process

All code follows the official API documentation and does not guess endpoints or behavior.

