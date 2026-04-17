/**
 * Category Service
 * Manages product categories and subcategories
 */

import type { Category } from '../types/product.js';

// Main grocery categories
export const GROCERY_CATEGORIES: Category[] = [
    {
        id: 'frukt-og-gront',
        name: 'Frukt og grønt',
        slug: 'frukt-og-gront',
        subcategories: ['Frukt', 'Grønnsaker', 'Salat', 'Krydderurter'],
        productCount: 0,
    },
    {
        id: 'kylling-og-kjott',
        name: 'Kylling og kjøtt',
        slug: 'kylling-og-kjott',
        subcategories: ['Kylling', 'Storfekjøtt', 'Svinekjøtt', 'Lam', 'Kjøttdeig'],
        productCount: 0,
    },
    {
        id: 'fisk-og-sjomat',
        name: 'Fisk og sjømat',
        slug: 'fisk-og-sjomat',
        subcategories: ['Laks', 'Torsk', 'Hvit fisk', 'Skalldyr', 'Røkt fisk'],
        productCount: 0,
    },
    {
        id: 'meieri-ost-og-egg',
        name: 'Meieri, ost og egg',
        slug: 'meieri-ost-og-egg',
        subcategories: ['Melk', 'Ost', 'Yoghurt', 'Egg', 'Smør'],
        productCount: 0,
    },
    {
        id: 'drikke',
        name: 'Drikke',
        slug: 'drikke',
        subcategories: ['Vann', 'Juice', 'Brus', 'Melkealternativer', 'Kaffe'],
        productCount: 0,
    },
    {
        id: 'bakeri-og-konditori',
        name: 'Bakeri og konditori',
        slug: 'bakeri-og-konditori',
        subcategories: ['Brød', 'Boller', 'Kaker', 'Kjeks'],
        productCount: 0,
    },
    {
        id: 'bakeingredienser',
        name: 'Bakeingredienser',
        slug: 'bakeingredienser',
        subcategories: ['Mel', 'Sukker', 'Egg', 'Smør', 'Sjokolade'],
        productCount: 0,
    },
    {
        id: 'sjokolade-snacks-og-godteri',
        name: 'Sjokolade, snacks og godteri',
        slug: 'sjokolade-snacks-og-godteri',
        subcategories: ['Sjokolade', 'Chips', 'Nøtter', 'Godteri'],
        productCount: 0,
    },
    {
        id: 'plantebasert',
        name: 'Plantebasert',
        slug: 'plantebasert',
        subcategories: ['Melkealternativer', 'Kjøttalternativer', 'Tofu', 'Tempeh'],
        productCount: 0,
    },
];

export class CategoryService {
    /**
     * Get all categories
     */
    getAllCategories(): Category[] {
        return GROCERY_CATEGORIES;
    }

    /**
     * Get category by slug
     */
    getCategoryBySlug(slug: string): Category | null {
        return GROCERY_CATEGORIES.find(cat => cat.slug === slug) || null;
    }

    /**
     * Get category by name
     */
    getCategoryByName(name: string): Category | null {
        return GROCERY_CATEGORIES.find(cat => cat.name === name) || null;
    }

    /**
     * Update product count for a category
     */
    updateProductCount(slug: string, count: number): void {
        const category = this.getCategoryBySlug(slug);
        if (category) {
            category.productCount = count;
        }
    }
}

