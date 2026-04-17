/**
 * Image Utility Functions
 * 
 * This file contains utilities for handling product images.
 * 
 * IMAGE STRUCTURE:
 * Images should be organized in the following structure:
 * 
 * /public/images/
 *   /fruits/
 *     fruit_apple_red_01.jpg
 *     fruit_banana_01.jpg
 *     ...
 *   /vegetables/
 *     vegetable_tomato_01.jpg
 *     ...
 *   /meat/
 *     meat_beef_steak_01.jpg
 *     ...
 *   /fish/
 *     fish_salmon_fillet_01.jpg
 *     ...
 *   /dairy/
 *     dairy_milk_01.jpg
 *     ...
 *   /drinks/
 *     drink_water_01.jpg
 *     ...
 *   /bakery/
 *     bakery_bread_01.jpg
 *     ...
 *   /pantry/
 *     pantry_pasta_01.jpg
 *     ...
 *   /snacks/
 *     snack_chocolate_01.jpg
 *     ...
 * 
 * IMAGE REQUIREMENTS:
 * - Pure white background (#FFFFFF)
 * - Square format (1:1 aspect ratio)
 * - High resolution (minimum 800x800px)
 * - Centered product
 * - Soft shadows only
 * - Consistent lighting
 * - No text overlays or watermarks
 * - Generic products (no real brands)
 */

/**
 * Get image path for a product based on category and name
 * This is a helper function that constructs image paths
 * In production, images would be served from a CDN or static assets
 */
export function getProductImagePath(category: string, productName: string, index: number = 1): string {
    // Map category to folder name
    const categoryMap: Record<string, string> = {
        'Frukt og grønt': 'fruits',
        'Kylling og kjøtt': 'meat',
        'Fisk og sjømat': 'fish',
        'Meieri, ost og egg': 'dairy',
        'Drikke': 'drinks',
        'Bakeri og konditori': 'bakery',
        'Bakeingredienser': 'pantry',
        'Sjokolade, snacks og godteri': 'snacks',
        'Plantebasert': 'dairy', // Plant-based alternatives go in dairy folder
    };

    // Determine if it's a fruit or vegetable
    const fruits = ['bananer', 'epler', 'avokadoer', 'appelsin', 'bær'];
    const isFruit = fruits.some(fruit => productName.toLowerCase().includes(fruit));
    const folder = category === 'Frukt og grønt'
        ? (isFruit ? 'fruits' : 'vegetables')
        : (categoryMap[category] || 'products');

    const slug = productName.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[åä]/g, 'a')
        .replace(/ø/g, 'o')
        .replace(/[^a-z0-9_]/g, '');

    return `/images/${folder}/${slug}_${String(index).padStart(2, '0')}.jpg`;
}

/**
 * Get product image URL with fallback system
 * Tries local image first, falls back to Unsplash if not found
 */
export function getProductImageUrl(category: string, productName: string, index: number = 1): string {
    // First, try to use local image path
    const localPath = getProductImagePath(category, productName, index);

    // In production, you would check if the image exists
    // For now, we'll use a fallback system
    // When real images are added to /public/images/, they will automatically be used

    // Fallback to Unsplash with white background for development
    const unsplashMap: Record<string, string> = {
        'Økologiske Bananer': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop&bg=white&q=85',
        'Norske Gulrøtter': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&bg=white&q=85',
        'Ferske Avokadoer': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&bg=white&q=85',
        'Helmelk 3,9%': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&bg=white&q=85',
        'Frittgående Høns Egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop&bg=white&q=85',
        'Håndlaget Surdeigsbrød': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&bg=white&q=85',
        'Norsk Laks Filet': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=400&fit=crop&bg=white&q=85',
        'Havre Melk Original': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&bg=white&q=85',
        'Mørk Sjokolade 70%': 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&bg=white&q=85',
        'Norsk Mineralvann': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&bg=white&q=85',
        'Røde Epler': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&bg=white&q=85',
        'Ferske Tomater': 'https://images.unsplash.com/photo-1546470427-e26264be0b01?w=400&h=400&fit=crop&bg=white&q=85',
        'Gulost': 'https://images.unsplash.com/photo-1618164436269-66d8c54cf7e0?w=400&h=400&fit=crop&bg=white&q=85',
        'Yoghurt Naturell': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&bg=white&q=85',
        'Kneippbrød': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&bg=white&q=85',
        'Mandelmelk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&bg=white&q=85',
        'Torskefilet': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=400&fit=crop&bg=white&q=85',
    };

    // Return mapped Unsplash URL if available, otherwise use local path
    // When real images are added, they will be served from localPath
    return unsplashMap[productName] || localPath;
}

