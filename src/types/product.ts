export interface Product {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    category: string;
    subcategory?: string;
    inStock: boolean;
    description?: string;
    ingredients?: string[];
    nutritionalInfo?: NutritionalInfo;
    sustainability?: SustainabilityInfo;
    freshness?: FreshnessInfo;
    origin?: string;
    isOrganic?: boolean;
    isLocal?: boolean;
    temperatureZone?: 'ambient' | 'chilled' | 'frozen';
    bulkDiscount?: BulkDiscount;
    tags?: string[];
}

export interface NutritionalInfo {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    allergens?: string[];
}

export interface SustainabilityInfo {
    carbonFootprint: number; // kg CO2 equivalent
    sustainabilityScore: 1 | 2 | 3 | 4 | 5; // 1 = lowest impact, 5 = highest impact
    packaging: 'minimal' | 'recyclable' | 'biodegradable' | 'standard';
    locallySourced: boolean;
}

export interface FreshnessInfo {
    harvestedDate?: string;
    bestBefore?: string;
    freshnessRating: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
    storageConditions: string;
}

export interface BulkDiscount {
    minQuantity: number;
    discountPercentage: number;
    maxQuantity?: number;
}
