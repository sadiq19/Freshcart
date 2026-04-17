/**
 * Open Food Facts API Service
 * Fetches product information and images
 * 
 * Official API Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/
 * Base URL: https://world.openfoodfacts.org
 * No API key required
 */

/**
 * Open Food Facts Product Interface
 * Based on official API response structure
 */
export interface OFFProduct {
    code: string;
    product_name?: string;
    product_name_en?: string;
    product_name_no?: string;
    categories?: string;
    categories_tags?: string[];
    image_url?: string;
    image_front_url?: string;
    image_front_small_url?: string;
    image_small_url?: string;
    images?: {
        front?: {
            small?: { [key: string]: string };
            display?: { [key: string]: string };
        };
    };
    brands?: string;
    brands_tags?: string[];
    quantity?: string;
    nutriments?: {
        energy_kcal_100g?: number;
        proteins_100g?: number;
        carbohydrates_100g?: number;
        fat_100g?: number;
    };
    ingredients_text?: string;
    ingredients_text_en?: string;
    ingredients_text_no?: string;
}

/**
 * Open Food Facts Search Response
 * Based on official API response structure
 */
interface OFFSearchResponse {
    products: OFFProduct[];
    count: number;
    page: number;
    page_size: number;
    page_count: number;
}

/**
 * Open Food Facts Product Response
 * Based on official API v0 product endpoint
 */
interface OFFProductResponse {
    status: number;
    status_verbose: string;
    product?: OFFProduct;
}

export class OpenFoodFactsService {
    private readonly baseUrl = 'https://world.openfoodfacts.org';
    private readonly apiVersion = 'v0';

    /**
     * Search for products using the official Open Food Facts search endpoint
     * 
     * Official endpoint: /cgi/search.pl
     * Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/#search
     * 
     * @param query - Search query (product name, brand, category, etc.)
     * @param pageSize - Number of results per page (default: 5)
     * @param page - Page number (default: 1)
     * @returns Array of products matching the search
     */
    async searchProducts(
        query: string,
        pageSize: number = 5,
        page: number = 1
    ): Promise<OFFProduct[]> {
        try {
            // Official search endpoint with documented parameters
            const url = new URL(`${this.baseUrl}/cgi/search.pl`);
            url.searchParams.append('search_terms', query);
            url.searchParams.append('search_simple', '1');
            url.searchParams.append('action', 'process');
            url.searchParams.append('json', '1');
            url.searchParams.append('page_size', pageSize.toString());
            url.searchParams.append('page', page.toString());
            url.searchParams.append('fields', 'code,product_name,product_name_en,product_name_no,categories,categories_tags,image_url,image_front_url,image_front_small_url,image_small_url,images,brands,brands_tags,quantity,nutriments,ingredients_text,ingredients_text_en,ingredients_text_no');

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                console.warn(`Open Food Facts API error: ${response.status} ${response.statusText}`);
                return [];
            }

            const data: OFFSearchResponse = await response.json();

            if (!data.products || !Array.isArray(data.products)) {
                return [];
            }

            // Filter out products without required fields
            return data.products.filter(p => p.code && (p.product_name || p.product_name_en));
        } catch (error) {
            console.error('Open Food Facts API error:', error);
            return [];
        }
    }

    /**
     * Get product by barcode using the official Open Food Facts product endpoint
     * 
     * Official endpoint: /api/v0/product/{barcode}.json
     * Documentation: https://openfoodfacts.github.io/openfoodfacts-server/api/#get-product
     * 
     * @param barcode - Product barcode (EAN-13, UPC-A, etc.)
     * @returns Product data or null if not found
     */
    async getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
        try {
            // Official product endpoint
            const url = `${this.baseUrl}/api/${this.apiVersion}/product/${barcode}.json`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                console.warn(`Open Food Facts API error: ${response.status} ${response.statusText}`);
                return null;
            }

            const data: OFFProductResponse = await response.json();

            if (data.status !== 1 || !data.product) {
                return null;
            }

            return data.product;
        } catch (error) {
            console.error('Open Food Facts API error:', error);
            return null;
        }
    }

    /**
     * Search products by category using official category search
     * 
     * @param category - Category name (e.g., "fruits", "dairy")
     * @param pageSize - Number of results
     * @returns Array of products in the category
     */
    async searchByCategory(category: string, pageSize: number = 5): Promise<OFFProduct[]> {
        // Use category tag format: en:category-name
        const categoryTag = `en:${category.toLowerCase().replace(/\s+/g, '-')}`;
        return this.searchProducts(categoryTag, pageSize);
    }

    /**
     * Get product image URL following official image priority
     * 
     * Priority order (as per Open Food Facts documentation):
     * 1. image_front_url (front-facing product image)
     * 2. image_front_small_url (smaller front image)
     * 3. image_url (generic product image)
     * 4. image_small_url (smaller generic image)
     * 5. Placeholder
     * 
     * @param product - Open Food Facts product
     * @returns Image URL or placeholder
     */
    getProductImage(product: OFFProduct | null): string {
        if (!product) {
            return this.getPlaceholderImage();
        }

        // Official image priority order
        if (product.image_front_url) {
            return product.image_front_url;
        }
        if (product.image_front_small_url) {
            return product.image_front_small_url;
        }
        if (product.image_url) {
            return product.image_url;
        }
        if (product.image_small_url) {
            return product.image_small_url;
        }

        // Try images object structure
        if (product.images?.front?.display) {
            const displayKeys = Object.keys(product.images.front.display);
            if (displayKeys.length > 0) {
                const imageId = displayKeys[0];
                return `${this.baseUrl}/images/products/${product.code}/${imageId}.jpg`;
            }
        }

        return this.getPlaceholderImage();
    }

    /**
     * Get product name with language fallback
     * Priority: English > Norwegian > Generic
     * 
     * @param product - Open Food Facts product
     * @returns Product name or null
     */
    getProductName(product: OFFProduct | null): string | null {
        if (!product) return null;

        return product.product_name_en || 
               product.product_name_no || 
               product.product_name || 
               null;
    }

    /**
     * Extract category from Open Food Facts product
     * Uses categories_tags array (official format: "en:category-name")
     * 
     * @param product - Open Food Facts product
     * @returns Category name or null
     */
    getCategory(product: OFFProduct | null): string | null {
        if (!product || !product.categories_tags || product.categories_tags.length === 0) {
            return null;
        }

        // Get first category tag and convert from "en:category-name" format
        const categoryTag = product.categories_tags[0];
        if (!categoryTag) return null;

        // Remove language prefix (e.g., "en:")
        const categoryName = categoryTag.replace(/^[a-z]{2}:/, '');
        
        // Convert from kebab-case to Title Case
        return categoryName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Get brand from product
     * 
     * @param product - Open Food Facts product
     * @returns Brand name or null
     */
    getBrand(product: OFFProduct | null): string | null {
        if (!product) return null;

        if (product.brands_tags && product.brands_tags.length > 0) {
            return product.brands_tags[0];
        }

        return product.brands || null;
    }

    /**
     * Find best matching product using multiple search strategies
     * Implements manual linking logic for product matching
     * 
     * @param productName - Product name to search for
     * @param category - Product category for context
     * @returns Best matching product or null
     */
    async findProduct(productName: string, category: string): Promise<OFFProduct | null> {
        // Strategy 1: Exact product name search
        let products = await this.searchProducts(productName, 10);
        
        if (products.length > 0) {
            // Find best match by name similarity
            const normalizedName = this.normalizeProductName(productName);
            const bestMatch = products.find(p => {
                const name = this.getProductName(p);
                if (!name) return false;
                const normalizedProductName = this.normalizeProductName(name);
                return normalizedProductName === normalizedName || 
                       normalizedProductName.includes(normalizedName) ||
                       normalizedName.includes(normalizedProductName);
            });
            
            if (bestMatch) {
                return bestMatch;
            }
            // Return first result if no exact match
            return products[0];
        }

        // Strategy 2: Category-based search
        const categoryProducts = await this.searchByCategory(category, 10);
        if (categoryProducts.length > 0) {
            // Try to find product with similar name in category
            const normalizedName = this.normalizeProductName(productName);
            const categoryMatch = categoryProducts.find(p => {
                const name = this.getProductName(p);
                if (!name) return false;
                const normalizedProductName = this.normalizeProductName(name);
                return normalizedProductName.includes(normalizedName) ||
                       normalizedName.includes(normalizedProductName);
            });
            
            if (categoryMatch) {
                return categoryMatch;
            }
            // Return first category product as fallback
            return categoryProducts[0];
        }

        return null;
    }

    /**
     * Normalize product name for comparison
     * Removes special characters, converts to lowercase, handles Norwegian characters
     * 
     * @param name - Product name to normalize
     * @returns Normalized name
     */
    private normalizeProductName(name: string): string {
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

    /**
     * Get placeholder image URL
     * Returns a neutral placeholder when no image is available
     * 
     * @returns Placeholder image URL
     */
    private getPlaceholderImage(): string {
        // Use a simple placeholder service
        return 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Product+Image';
    }
}
