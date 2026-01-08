/**
 * USDA FoodData Central API Service
 * Fetches nutrition data for products
 * 
 * Official API Documentation: https://fdc.nal.usda.gov/api-guide.html
 * Base URL: https://api.nal.usda.gov/fdc/v1
 * Requires API key (free registration)
 */

/**
 * USDA Food Nutrient Interface
 * Based on official API response structure
 */
interface USDANutrient {
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
    derivationCode?: string;
    derivationDescription?: string;
}

/**
 * USDA Food Search Result
 * Based on official API response structure
 */
export interface USDASearchResult {
    fdcId: number;
    description: string;
    dataType?: string;
    foodCode?: string;
    publishedDate?: string;
    foodNutrients?: USDANutrient[];
    brandOwner?: string;
    ingredients?: string;
    servingSize?: number;
    servingSizeUnit?: string;
}

/**
 * USDA Food Search Response
 * Based on official API v1 search endpoint
 */
interface USDASearchResponse {
    foods: USDASearchResult[];
    totalHits: number;
    currentPage?: number;
    totalPages?: number;
}

/**
 * USDA Food Detail Response
 * Based on official API v1 food detail endpoint
 */
interface USDAFoodDetailResponse extends USDASearchResult {
    // Additional fields available in detail endpoint
    scientificName?: string;
    foodCategory?: {
        id: number;
        code: string;
        description: string;
    };
    foodComponents?: Array<{
        id: number;
        name: string;
        value: number;
        unitName: string;
    }>;
    foodAttributes?: Array<{
        id: number;
        name: string;
        value: string;
    }>;
}

/**
 * USDA Nutrient IDs (per 100g)
 * Based on official USDA FoodData Central nutrient database
 * Documentation: https://fdc.nal.usda.gov/api-guide.html#nutrients
 */
const NUTRIENT_IDS = {
    // Energy (kcal)
    CALORIES: 1008,
    // Protein
    PROTEIN: 1003,
    // Carbohydrate, by difference
    CARBS: 1005,
    // Total lipid (fat)
    FAT: 1004,
    // Fiber
    FIBER: 1079,
    // Sugars
    SUGARS: 2000,
} as const;

export class USDAService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.nal.usda.gov/fdc/v1';

    constructor(apiKey: string) {
        if (!apiKey) {
            console.warn('USDA API key not provided. Nutrition data will be limited.');
        }
        this.apiKey = apiKey;
    }

    /**
     * Search for food items using the official USDA FoodData Central search endpoint
     * 
     * Official endpoint: GET /foods/search
     * Documentation: https://fdc.nal.usda.gov/api-guide.html#foods-search
     * 
     * @param query - Search query (food name, description, etc.)
     * @param pageSize - Number of results per page (default: 1)
     * @param pageNumber - Page number (default: 1)
     * @param dataType - Filter by data type (optional)
     * @returns Search results with foods array
     */
    async searchFoods(
        query: string,
        pageSize: number = 1,
        pageNumber: number = 1,
        dataType?: string
    ): Promise<USDASearchResult[]> {
        if (!this.apiKey) {
            console.warn('USDA API key not configured. Cannot search foods.');
            return [];
        }

        try {
            // Official search endpoint with documented parameters
            const url = new URL(`${this.baseUrl}/foods/search`);
            url.searchParams.append('api_key', this.apiKey);
            url.searchParams.append('query', query);
            url.searchParams.append('pageSize', pageSize.toString());
            url.searchParams.append('pageNumber', pageNumber.toString());
            
            // Optional: filter by data type (Foundation, SR Legacy, Branded, etc.)
            if (dataType) {
                url.searchParams.append('dataType', dataType);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`USDA API error: ${response.status} ${response.statusText} - ${errorText}`);
                return [];
            }

            const data: USDASearchResponse = await response.json();

            if (!data.foods || !Array.isArray(data.foods)) {
                return [];
            }

            return data.foods;
        } catch (error) {
            console.error('USDA API error:', error);
            return [];
        }
    }

    /**
     * Get detailed food information using the official USDA FoodData Central food detail endpoint
     * 
     * Official endpoint: GET /food/{fdcId}
     * Documentation: https://fdc.nal.usda.gov/api-guide.html#food-detail
     * 
     * @param fdcId - FoodData Central ID
     * @param nutrients - Optional array of nutrient IDs to include
     * @returns Detailed food information
     */
    async getFoodDetails(
        fdcId: number,
        nutrients?: number[]
    ): Promise<USDAFoodDetailResponse | null> {
        if (!this.apiKey) {
            console.warn('USDA API key not configured. Cannot get food details.');
            return null;
        }

        try {
            // Official food detail endpoint
            const url = new URL(`${this.baseUrl}/food/${fdcId}`);
            url.searchParams.append('api_key', this.apiKey);
            
            // Optional: specify nutrients to include
            if (nutrients && nutrients.length > 0) {
                url.searchParams.append('nutrients', nutrients.join(','));
            }

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                const errorText = await response.text();
                console.warn(`USDA API error: ${response.status} ${response.statusText} - ${errorText}`);
                return null;
            }

            const data: USDAFoodDetailResponse = await response.json();
            return data;
        } catch (error) {
            console.error('USDA API error:', error);
            return null;
        }
    }

    /**
     * Extract nutrition values from USDA food data
     * Uses official nutrient IDs from USDA FoodData Central
     * 
     * @param food - USDA food data
     * @returns Normalized nutrition values (per 100g)
     */
    extractNutrition(food: USDASearchResult | null): {
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
    } {
        if (!food || !food.foodNutrients || food.foodNutrients.length === 0) {
            return {
                calories: null,
                protein: null,
                carbs: null,
                fat: null,
            };
        }

        /**
         * Helper to find nutrient by ID
         * Handles multiple nutrients with same ID (takes first non-null value)
         */
        const getNutrient = (nutrientId: number): number | null => {
            const nutrients = food.foodNutrients?.filter(n => n.nutrientId === nutrientId) || [];
            
            // Find first nutrient with a valid value
            for (const nutrient of nutrients) {
                if (nutrient.value !== null && nutrient.value !== undefined) {
                    return nutrient.value;
                }
            }
            
            return null;
        };

        return {
            calories: getNutrient(NUTRIENT_IDS.CALORIES),
            protein: getNutrient(NUTRIENT_IDS.PROTEIN),
            carbs: getNutrient(NUTRIENT_IDS.CARBS),
            fat: getNutrient(NUTRIENT_IDS.FAT),
        };
    }

    /**
     * Get nutrition for a product using manual linking strategy
     * 
     * Strategy:
     * 1. Try exact product name match
     * 2. Try generic category-based search
     * 3. Try normalized/fuzzy matching
     * 
     * @param productName - Product name to search for
     * @param category - Product category for context
     * @returns Nutrition data or null values if not found
     */
    async getNutritionForProduct(
        productName: string,
        category: string
    ): Promise<{
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
    }> {
        if (!this.apiKey) {
            return {
                calories: null,
                protein: null,
                carbs: null,
                fat: null,
            };
        }

        // Strategy 1: Try exact product name search
        let foods = await this.searchFoods(productName, 5);
        
        if (foods.length > 0) {
            // Try to find best match by description similarity
            const normalizedName = this.normalizeFoodName(productName);
            const bestMatch = foods.find(food => {
                const normalizedDescription = this.normalizeFoodName(food.description);
                return normalizedDescription === normalizedName ||
                       normalizedDescription.includes(normalizedName) ||
                       normalizedName.includes(normalizedDescription);
            });

            const selectedFood = bestMatch || foods[0];
            
            // Get detailed nutrition if we have fdcId
            if (selectedFood.fdcId) {
                const details = await this.getFoodDetails(selectedFood.fdcId);
                if (details) {
                    return this.extractNutrition(details);
                }
            }
            
            return this.extractNutrition(selectedFood);
        }

        // Strategy 2: Try generic category-based search
        const categoryMapping: Record<string, string> = {
            'Frukt og grønt': 'fresh fruit',
            'Kylling og kjøtt': 'chicken',
            'Fisk og sjømat': 'fish',
            'Meieri, ost og egg': 'milk',
            'Drikke': 'beverage',
            'Bakeri og konditori': 'bread',
            'Plantebasert': 'plant based',
        };

        const genericTerm = categoryMapping[category] || 'food';
        foods = await this.searchFoods(genericTerm, 3);

        if (foods.length > 0) {
            const selectedFood = foods[0];
            
            // Get detailed nutrition
            if (selectedFood.fdcId) {
                const details = await this.getFoodDetails(selectedFood.fdcId);
                if (details) {
                    return this.extractNutrition(details);
                }
            }
            
            return this.extractNutrition(selectedFood);
        }

        // Strategy 3: Return null values if nothing found
        return {
            calories: null,
            protein: null,
            carbs: null,
            fat: null,
        };
    }

    /**
     * Normalize food name for comparison
     * Removes special characters, handles common food name variations
     * 
     * @param name - Food name to normalize
     * @returns Normalized name
     */
    private normalizeFoodName(name: string): string {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[åä]/g, 'a')
            .replace(/ø/g, 'o')
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, ' ')
            .trim();
    }
}
