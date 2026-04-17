/**
 * Backend Product Model
 * This is the internal product structure that combines data from
 * Open Food Facts and USDA FoodData Central
 */

export interface ProductNutrition {
    calories: number | null;
    protein: number | null; // grams per 100g
    carbs: number | null; // grams per 100g
    fat: number | null; // grams per 100g
}

export interface BackendProduct {
    id: string;
    name: string;
    category: string;
    subcategory: string | null;
    image: string; // URL from Open Food Facts or placeholder
    nutrition: ProductNutrition;
    unit: string;
    price: number;
    description?: string;
    inStock?: boolean;
    isOrganic?: boolean;
    isLocal?: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    subcategories: string[];
    productCount: number;
}

export interface ProductsResponse {
    products: BackendProduct[];
    total: number;
    category?: string;
}

export interface ProductDetailResponse {
    product: BackendProduct;
}

