/**
 * Categories API Routes
 */

import { Router } from 'express';
import { CategoryService } from '../services/categoryService.js';

export function createCategoriesRouter(categoryService: CategoryService): Router {
    const router = Router();

    /**
     * GET /api/categories
     * Get all categories with subcategories
     */
    router.get('/', (req, res) => {
        try {
            const categories = categoryService.getAllCategories();
            res.json({ categories });
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    });

    /**
     * GET /api/categories/:slug
     * Get a single category by slug
     */
    router.get('/:slug', (req, res) => {
        try {
            const { slug } = req.params;
            const category = categoryService.getCategoryBySlug(slug);

            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            res.json({ category });
        } catch (error) {
            console.error('Error fetching category:', error);
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    });

    return router;
}

