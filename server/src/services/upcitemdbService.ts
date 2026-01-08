/**
 * UPCitemdb API Service
 * Fetches product images and metadata using barcodes
 * 
 * API Documentation: https://www.upcitemdb.com/api
 * Free tier: 100 requests/day
 * No API key required for basic usage
 */

export interface UPCItem {
    code: string;
    title: string;
    description?: string;
    upc?: string;
    ean?: string;
    images?: string[];
    brand?: string;
    model?: string;
    color?: string;
    size?: string;
    dimension?: string;
    weight?: string;
    category?: string;
    currency?: string;
    lowest_recorded_price?: number;
    highest_recorded_price?: number;
}

interface UPCItemDBResponse {
    code: string;
    total: number;
    offset: number;
    items: UPCItem[];
}

export class UPCitemdbService {
    private readonly baseUrl = 'https://api.upcitemdb.com/prod/trial';

    /**
     * Lookup product by barcode (UPC/EAN)
     * 
     * Official endpoint: GET /lookup
     * Documentation: https://www.upcitemdb.com/api
     * 
     * @param barcode - Product barcode (UPC-A, EAN-13, etc.)
     * @returns Product data with images or null
     */
    async lookupByBarcode(barcode: string): Promise<UPCItem | null> {
        try {
            const url = `${this.baseUrl}/lookup?upc=${encodeURIComponent(barcode)}`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                console.warn(`UPCitemdb API error: ${response.status}`);
                return null;
            }

            const data = await response.json() as UPCItemDBResponse;

            if (data.code === 'OK' && data.items && data.items.length > 0) {
                return data.items[0];
            }

            return null;
        } catch (error) {
            console.error('UPCitemdb API error:', error);
            return null;
        }
    }

    /**
     * Search products by name
     * 
     * @param query - Product name or description
     * @returns Array of matching products
     */
    async searchProducts(query: string): Promise<UPCItem[]> {
        try {
            const url = `${this.baseUrl}/search?s=${encodeURIComponent(query)}&type=product`;

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Freshcart-Backend/1.0 (https://github.com/freshcart)',
                },
            });

            if (!response.ok) {
                console.warn(`UPCitemdb API error: ${response.status}`);
                return [];
            }

            const data = await response.json() as UPCItemDBResponse;

            if (data.code === 'OK' && data.items) {
                return data.items;
            }

            return [];
        } catch (error) {
            console.error('UPCitemdb API error:', error);
            return [];
        }
    }

    /**
     * Get product image URL
     * Prioritizes images array, falls back to placeholder
     * 
     * @param item - UPCitemdb product item
     * @returns Image URL or placeholder
     */
    getProductImage(item: UPCItem | null): string {
        if (!item) {
            return this.getPlaceholderImage();
        }

        // UPCitemdb provides images array
        if (item.images && item.images.length > 0) {
            // Return first image (usually highest quality)
            return item.images[0];
        }

        return this.getPlaceholderImage();
    }

    /**
     * Get product name
     * 
     * @param item - UPCitemdb product item
     * @returns Product name or null
     */
    getProductName(item: UPCItem | null): string | null {
        if (!item) return null;
        return item.title || null;
    }

    /**
     * Get placeholder image URL
     * 
     * @returns Placeholder image URL
     */
    private getPlaceholderImage(): string {
        return 'https://via.placeholder.com/400x400/FFFFFF/CCCCCC?text=Product+Image';
    }
}

