/**
 * Product Service
 * Manually connects and merges data from Open Food Facts and USDA FoodData Central
 * into a unified product model
 * 
 * This service implements manual linking logic since there is no direct 1-to-1 mapping
 * between Open Food Facts products and USDA nutrition data.
 */

import { USDAService } from './usdaService.js';
import { OpenFoodFactsService } from './openFoodFactsService.js';
import { UPCitemdbService } from './upcitemdbService.js';
import type { BackendProduct, ProductNutrition } from '../types/product.js';

/**
 * Product source data (from internal product catalog)
 */
interface ProductSource {
    name: string;
    category: string;
    subcategory?: string;
    unit: string;
    price: number;
    description?: string;
}

/**
 * Manual linking configuration
 * Maps product names/categories to better search terms for APIs
 */
interface LinkingConfig {
    // Category mappings for better API search results
    categoryMappings: Record<string, string>;
    // Product name normalizations
    productNameMappings: Record<string, string>;
}

export class ProductService {
    private usdaService: USDAService;
    private offService: OpenFoodFactsService;
    private upcService: UPCitemdbService;
    private productCache: Map<string, BackendProduct> = new Map();

    // Manual linking configuration
    private linkingConfig: LinkingConfig = {
        categoryMappings: {
            'Frukt og grønt': 'fruits vegetables',
            'Kylling og kjøtt': 'meat poultry',
            'Fisk og sjømat': 'seafood fish',
            'Meieri, ost og egg': 'dairy cheese',
            'Drikke': 'beverages drinks',
            'Bakeri og konditori': 'bakery bread',
            'Plantebasert': 'plant based',
        },
        productNameMappings: {
            'økologisk': 'organic',
            'norsk': 'norwegian',
            'fersk': 'fresh',
        },
    };

    constructor(usdaApiKey: string) {
        this.usdaService = new USDAService(usdaApiKey);
        this.offService = new OpenFoodFactsService();
        this.upcService = new UPCitemdbService();
    }

    /**
     * Create a product by manually linking data from both APIs
     * 
     * Process:
     * 1. Fetch product metadata from Open Food Facts
     * 2. Fetch nutrition data from USDA FoodData Central
     * 3. Manually merge and normalize the data
     * 4. Return unified product model
     * 
     * @param source - Product source data
     * @returns Merged product with data from both APIs
     */
    async createProduct(source: ProductSource): Promise<BackendProduct> {
        const cacheKey = `${source.name}-${source.category}`;

        // Check cache first
        if (this.productCache.has(cacheKey)) {
            return this.productCache.get(cacheKey)!;
        }

        // Step 1: Prepare search terms for manual linking
        const searchTerms = this.prepareSearchTerms(source);

        // Step 2: Fetch data from multiple APIs in parallel
        // Try UPCitemdb first for better images, then Open Food Facts as fallback
        const [upcProduct, offProduct, nutrition] = await Promise.all([
            this.upcService.searchProducts(source.name).then(items => items.length > 0 ? items[0] : null),
            this.offService.findProduct(searchTerms.offQuery, source.category),
            this.usdaService.getNutritionForProduct(searchTerms.usdaQuery, source.category),
        ]);

        // Step 3: Get best available image (prioritize UPCitemdb, then Open Food Facts)
        const productImage = this.getBestProductImage(upcProduct, offProduct);

        // Step 4: Manually merge and normalize data
        const product: BackendProduct = {
            id: this.generateProductId(source.name, source.category),
            name: source.name, // Use source name as primary
            category: source.category,
            subcategory: source.subcategory || null,
            image: productImage,
            nutrition: {
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat,
            },
            unit: source.unit,
            price: source.price,
            description: source.description ||
                this.upcService.getProductName(upcProduct) ||
                this.offService.getProductName(offProduct) ||
                undefined,
            inStock: true,
            isOrganic: this.detectOrganic(source.name, offProduct),
            isLocal: this.detectLocal(source.name, offProduct),
        };

        // Step 5: Cache the product
        this.productCache.set(cacheKey, product);

        return product;
    }

    /**
     * Get best available product image from multiple sources
     * Priority: UPCitemdb > Open Food Facts > Placeholder
     * 
     * @param upcProduct - Product from UPCitemdb
     * @param offProduct - Product from Open Food Facts
     * @returns Best available image URL
     */
    private getBestProductImage(upcProduct: any, offProduct: any): string {
        // Priority 1: UPCitemdb (usually has better quality product images)
        if (upcProduct) {
            const upcImage = this.upcService.getProductImage(upcProduct);
            if (upcImage && !upcImage.includes('placeholder')) {
                return upcImage;
            }
        }

        // Priority 2: Open Food Facts
        if (offProduct) {
            const offImage = this.offService.getProductImage(offProduct);
            if (offImage && !offImage.includes('placeholder')) {
                return offImage;
            }
        }

        // Priority 3: Placeholder
        return 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Product+Image';
    }

    /**
     * Prepare search terms for manual linking
     * Normalizes and optimizes queries for both APIs
     * 
     * @param source - Product source data
     * @returns Optimized search terms for each API
     */
    private prepareSearchTerms(source: ProductSource): {
        offQuery: string;
        usdaQuery: string;
    } {
        // Normalize product name
        let normalizedName = source.name.toLowerCase();

        // Apply product name mappings
        for (const [key, value] of Object.entries(this.linkingConfig.productNameMappings)) {
            normalizedName = normalizedName.replace(key, value);
        }

        // Remove common prefixes/suffixes that might interfere with search
        normalizedName = normalizedName
            .replace(/^(norsk|norske|økologisk|økologiske|fersk|ferske)\s+/i, '')
            .trim();

        // For Open Food Facts: use original name (better for product matching)
        const offQuery = source.name;

        // For USDA: use normalized name (better for generic food matching)
        const usdaQuery = normalizedName || source.name;

        return { offQuery, usdaQuery };
    }

    /**
     * Detect if product is organic
     * Checks both source name and Open Food Facts data
     * 
     * @param sourceName - Product name from source
     * @param offProduct - Open Food Facts product data
     * @returns True if product is organic
     */
    private detectOrganic(sourceName: string, offProduct: any): boolean {
        const nameLower = sourceName.toLowerCase();

        // Check source name
        if (nameLower.includes('økologisk') || nameLower.includes('organic')) {
            return true;
        }

        // Check Open Food Facts categories/tags
        if (offProduct?.categories_tags) {
            const hasOrganic = offProduct.categories_tags.some((tag: string) =>
                tag.includes('organic') || tag.includes('bio')
            );
            if (hasOrganic) return true;
        }

        return false;
    }

    /**
     * Detect if product is local (Norwegian)
     * Checks both source name and Open Food Facts data
     * 
     * @param sourceName - Product name from source
     * @param offProduct - Open Food Facts product data
     * @returns True if product is local
     */
    private detectLocal(sourceName: string, offProduct: any): boolean {
        const nameLower = sourceName.toLowerCase();

        // Check source name
        if (nameLower.includes('norsk') || nameLower.includes('norwegian')) {
            return true;
        }

        // Check Open Food Facts data
        if (offProduct?.brands_tags) {
            const hasNorwegian = offProduct.brands_tags.some((tag: string) =>
                tag.toLowerCase().includes('norsk') ||
                tag.toLowerCase().includes('norway')
            );
            if (hasNorwegian) return true;
        }

        return false;
    }

    /**
     * Create multiple products from source data
     * Processes in batches to respect API rate limits
     * 
     * @param sources - Array of product source data
     * @returns Array of merged products
     */
    async createProducts(sources: ProductSource[]): Promise<BackendProduct[]> {
        // Process in batches to avoid rate limiting
        const batchSize = 5;
        const products: BackendProduct[] = [];

        for (let i = 0; i < sources.length; i += batchSize) {
            const batch = sources.slice(i, i + batchSize);
            const batchProducts = await Promise.all(
                batch.map(source => this.createProduct(source))
            );
            products.push(...batchProducts);

            // Small delay between batches to respect rate limits
            if (i + batchSize < sources.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return products;
    }

    /**
     * Generate a consistent product ID
     * 
     * @param name - Product name
     * @param category - Product category
     * @returns Product ID
     */
    private generateProductId(name: string, category: string): string {
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[åä]/g, 'a')
            .replace(/ø/g, 'o')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const categorySlug = category
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[åä]/g, 'a')
            .replace(/ø/g, 'o')
            .replace(/\s+/g, '-');

        return `${categorySlug}-${slug}`;
    }

    /**
     * Clear the product cache
     */
    clearCache(): void {
        this.productCache.clear();
    }

    /**
     * Update linking configuration
     * Allows runtime configuration of manual linking rules
     * 
     * @param config - New linking configuration
     */
    updateLinkingConfig(config: Partial<LinkingConfig>): void {
        this.linkingConfig = {
            ...this.linkingConfig,
            ...config,
            categoryMappings: {
                ...this.linkingConfig.categoryMappings,
                ...config.categoryMappings,
            },
            productNameMappings: {
                ...this.linkingConfig.productNameMappings,
                ...config.productNameMappings,
            },
        };
    }
}
