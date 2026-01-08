/**
 * Frontend API Service
 * Handles all communication with the backend API
 */

// Use Vite proxy in development, or direct URL if specified
// Vite proxy sends /api/* to http://localhost:3001 automatically
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiProduct {
    id: string;
    name: string;
    category: string;
    subcategory: string | null;
    image: string;
    nutrition: {
        calories: number | null;
        protein: number | null;
        carbs: number | null;
        fat: number | null;
    };
    unit: string;
    price: number;
    description?: string;
    inStock?: boolean;
    isOrganic?: boolean;
    isLocal?: boolean;
}

export interface ApiCategory {
    id: string;
    name: string;
    slug: string;
    subcategories: string[];
    productCount: number;
}

export interface ProductsResponse {
    products: ApiProduct[];
    total: number;
    category?: string;
}

export interface ProductDetailResponse {
    product: ApiProduct;
}

export interface CategoriesResponse {
    categories: ApiCategory[];
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API error: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            // Network error or fetch failed
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error(`Network error: Could not connect to API at ${url}`);
                throw new Error(`Kunne ikke koble til backend API. Sjekk at backend kjører på http://localhost:3001`);
            }
            throw error;
        }
    }

    async getCategories(): Promise<ApiCategory[]> {
        const data = await this.fetchJson<CategoriesResponse>('/categories');
        return data.categories;
    }

    async getCategory(slug: string): Promise<ApiCategory> {
        const data = await this.fetchJson<{ category: ApiCategory }>(`/categories/${slug}`);
        return data.category;
    }

    async getProducts(params?: {
        category?: string;
        subcategory?: string;
        search?: string;
    }): Promise<ApiProduct[]> {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.subcategory) queryParams.append('subcategory', params.subcategory);
        if (params?.search) queryParams.append('search', params.search);

        const queryString = queryParams.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

        const data = await this.fetchJson<ProductsResponse>(endpoint);
        return data.products;
    }

    async getProduct(id: string): Promise<ApiProduct> {
        const data = await this.fetchJson<ProductDetailResponse>(`/products/${id}`);
        return data.product;
    }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);

