/**
 * Product Adapter
 * Converts backend API products to frontend Product format
 * Maintains backward compatibility with existing frontend code
 */

import type { Product } from '../types/product';
import type { ApiProduct } from '../services/api';

/**
 * Convert API product to frontend Product format
 */
export function adaptApiProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        price: apiProduct.price,
        unit: apiProduct.unit,
        image: apiProduct.image,
        category: apiProduct.category,
        subcategory: apiProduct.subcategory || undefined,
        inStock: apiProduct.inStock ?? true,
        description: apiProduct.description,
        nutritionalInfo: {
            calories: apiProduct.nutrition.calories ?? undefined,
            protein: apiProduct.nutrition.protein ?? undefined,
            carbs: apiProduct.nutrition.carbs ?? undefined,
            fat: apiProduct.nutrition.fat ?? undefined,
        },
        isOrganic: apiProduct.isOrganic,
        isLocal: apiProduct.isLocal,
    };
}

/**
 * Convert multiple API products to frontend Product format
 */
export function adaptApiProducts(apiProducts: ApiProduct[]): Product[] {
    return apiProducts.map(adaptApiProduct);
}

