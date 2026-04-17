/**
 * Products API Routes
 */

import { Router } from 'express';
import { ProductService } from '../services/productService.js';
import { CategoryService } from '../services/categoryService.js';
import type { BackendProduct } from '../types/product.js';

// Product source data - in production, this would come from a database
// For now, we'll use a simplified version that can be populated from mocks
const PRODUCT_SOURCES = [
    // Fruits and Vegetables
    { name: 'Økologiske Bananer', category: 'Frukt og grønt', subcategory: 'Frukt', unit: 'kg', price: 29.9 },
    { name: 'Norske Gulrøtter', category: 'Frukt og grønt', subcategory: 'Grønnsaker', unit: 'kg', price: 24.9 },
    { name: 'Ferske Avokadoer', category: 'Frukt og grønt', subcategory: 'Frukt', unit: '2 stk', price: 39.9 },
    { name: 'Røde Epler', category: 'Frukt og grønt', subcategory: 'Frukt', unit: 'kg', price: 34.9 },
    { name: 'Ferske Tomater', category: 'Frukt og grønt', subcategory: 'Grønnsaker', unit: 'kg', price: 49.9 },
    
    // Dairy
    { name: 'Helmelk 3,9%', category: 'Meieri, ost og egg', subcategory: 'Melk', unit: '1 liter', price: 24.9 },
    { name: 'Frittgående Høns Egg', category: 'Meieri, ost og egg', subcategory: 'Egg', unit: '12 stk', price: 49.9 },
    { name: 'Gulost', category: 'Meieri, ost og egg', subcategory: 'Ost', unit: 'kg', price: 89.9 },
    { name: 'Yoghurt Naturell', category: 'Meieri, ost og egg', subcategory: 'Yoghurt', unit: '500g', price: 29.9 },
    
    // Bakery
    { name: 'Håndlaget Surdeigsbrød', category: 'Bakeri og konditori', subcategory: 'Brød', unit: '1 stk', price: 45.0 },
    { name: 'Kneippbrød', category: 'Bakeri og konditori', subcategory: 'Brød', unit: '500g', price: 32.9 },
    
    // Fish
    { name: 'Norsk Laks Filet', category: 'Fisk og sjømat', subcategory: 'Laks', unit: 'kg', price: 189.0 },
    { name: 'Torskefilet', category: 'Fisk og sjømat', subcategory: 'Hvit fisk', unit: 'kg', price: 149.0 },
    
    // Plant-based
    { name: 'Havre Melk Original', category: 'Plantebasert', subcategory: 'Melkealternativer', unit: '1 liter', price: 32.9 },
    { name: 'Mandelmelk', category: 'Plantebasert', subcategory: 'Melkealternativer', unit: '1 liter', price: 36.9 },
    
    // Drinks
    { name: 'Norsk Mineralvann', category: 'Drikke', subcategory: 'Vann', unit: '1,5 liter', price: 19.9 },
    
    // Snacks
    { name: 'Mørk Sjokolade 70%', category: 'Sjokolade, snacks og godteri', subcategory: 'Sjokolade', unit: '100g', price: 39.9 },
];

export function createProductsRouter(
    productService: ProductService,
    categoryService: CategoryService
): Router {
    const router = Router();
    
    // In-memory product cache (in production, use a database)
    let productsCache: BackendProduct[] | null = null;
    let productsCacheTime = 0;
    const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

    /**
     * Initialize products from source data
     * This would typically run once on server startup
     */
    async function initializeProducts(): Promise<BackendProduct[]> {
        if (productsCache && Date.now() - productsCacheTime < CACHE_DURATION) {
            return productsCache;
        }

        console.log('Initializing products from external APIs...');
        const products = await productService.createProducts(PRODUCT_SOURCES);
        
        // Update category counts
        products.forEach(product => {
            const category = categoryService.getCategoryByName(product.category);
            if (category) {
                category.productCount = products.filter(p => p.category === product.category).length;
            }
        });

        productsCache = products;
        productsCacheTime = Date.now();
        
        return products;
    }

    /**
     * GET /api/products
     * Get all products, optionally filtered by category
     */
    router.get('/', async (req, res) => {
        try {
            const { category, subcategory, search } = req.query;
            
            let products = await initializeProducts();
            
            // Filter by category
            if (category && typeof category === 'string') {
                const categoryObj = categoryService.getCategoryBySlug(category);
                if (categoryObj) {
                    products = products.filter(p => {
                        const productCategory = categoryService.getCategoryByName(p.category);
                        return productCategory?.slug === category;
                    });
                }
            }
            
            // Filter by subcategory
            if (subcategory && typeof subcategory === 'string') {
                products = products.filter(p => p.subcategory === subcategory);
            }
            
            // Search filter
            if (search && typeof search === 'string') {
                const searchLower = search.toLowerCase();
                products = products.filter(p => 
                    p.name.toLowerCase().includes(searchLower) ||
                    p.description?.toLowerCase().includes(searchLower)
                );
            }
            
            res.json({
                products,
                total: products.length,
                category: category || undefined,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    });

    /**
     * GET /api/products/:id
     * Get a single product by ID
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const products = await initializeProducts();
            const product = products.find(p => p.id === id);
            
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json({ product });
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    });

    return router;
}

