/**
 * Freshcart Backend API Server
 * 
 * Integrates with:
 * - USDA FoodData Central (nutrition data)
 * - Open Food Facts (product info & images)
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ProductService } from './services/productService.js';
import { CategoryService } from './services/categoryService.js';
import { createProductsRouter } from './routes/products.js';
import { createCategoriesRouter } from './routes/categories.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());

// Initialize services
const usdaApiKey = process.env.USDA_API_KEY || '';
if (!usdaApiKey) {
    console.warn('⚠️  USDA_API_KEY not set. Nutrition data will be limited.');
}

const productService = new ProductService(usdaApiKey);
const categoryService = new CategoryService();

// API Routes
app.use('/api/products', createProductsRouter(productService, categoryService));
app.use('/api/categories', createCategoriesRouter(categoryService));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Freshcart Backend API running on http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
    if (usdaApiKey) {
        console.log('✅ USDA API key configured');
    } else {
        console.log('⚠️  USDA API key not configured - nutrition data will be limited');
    }
});

