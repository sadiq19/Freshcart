import type { Product } from '../types/product';
import { getProductImageUrl } from '../utils/imageUtils';

// Oda-inspired product categories
export const PRODUCT_CATEGORIES = [
    'Frukt og grønt', // Fruits and Vegetables
    'Bakeri og konditori', // Bakery and Confectionery
    'Frokostblandinger og müsli', // Breakfast cereals and muesli
    'Meieri, ost og egg', // Dairy, cheese and eggs
    'Plantebasert', // Plant-based
    'Kylling og kjøtt', // Chicken and meat
    'Fisk og sjømat', // Fish and seafood
    'Pålegg', // Cold cuts
    'Middager og tilbehør', // Dinners and side dishes
    'Drikke', // Beverages
    'Bakeingredienser', // Baking ingredients
    'Iskrem, dessert og kjeks', // Ice cream, desserts and cookies
    'Sjokolade, snacks og godteri', // Chocolate, snacks and candy
    'Baby og barn', // Baby and children
    'Hygiene og skjønnhet', // Hygiene and beauty
    'Hus og hjem', // House and home
];

export const mockProducts: Product[] = [
    // Fruits and Vegetables
    {
        id: '1',
        name: 'Økologiske Bananer',
        price: 29.9,
        unit: 'kg',
        image: getProductImageUrl('Frukt og grønt', 'Økologiske Bananer'),
        category: 'Frukt og grønt',
        subcategory: 'Frukt',
        inStock: true,
        description: 'Søte og modne økologiske bananer fra Sør-Amerika',
        isOrganic: true,
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 0.7,
            sustainabilityScore: 2,
            packaging: 'minimal',
            locallySourced: false,
        },
        freshness: {
            freshnessRating: 5,
            storageConditions: 'Store at room temperature',
        },
        nutritionalInfo: {
            calories: 89,
            carbs: 23,
            fiber: 2.6,
            allergens: [],
        },
        tags: ['økologisk', 'fairtrade', 'energi'],
    },
    {
        id: '2',
        name: 'Norske Gulrøtter',
        price: 24.9,
        unit: 'kg',
        image: getProductImageUrl('Frukt og grønt', 'Norske Gulrøtter'),
        category: 'Frukt og grønt',
        subcategory: 'Grønnsaker',
        inStock: true,
        description: 'Sprø og søte gulrøtter dyrket i Norge',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 0.3,
            sustainabilityScore: 1,
            packaging: 'biodegradable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            storageConditions: 'Store in refrigerator',
        },
        nutritionalInfo: {
            calories: 41,
            carbs: 10,
            fiber: 2.8,
            allergens: [],
        },
        tags: ['norsk', 'lokal', 'beta-karoten'],
    },
    {
        id: '3',
        name: 'Ferske Avokadoer',
        price: 39.9,
        unit: '2 stk',
        image: getProductImageUrl('Frukt og grønt', 'Ferske Avokadoer'),
        category: 'Frukt og grønt',
        subcategory: 'Frukt',
        inStock: true,
        description: 'Kremete avokadoer perfekt til toast og salater',
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 1.2,
            sustainabilityScore: 3,
            packaging: 'minimal',
            locallySourced: false,
        },
        freshness: {
            freshnessRating: 4,
            storageConditions: 'Ripen at room temperature, then refrigerate',
        },
        nutritionalInfo: {
            calories: 234,
            fat: 21,
            fiber: 10,
            allergens: [],
        },
        tags: ['sunt fett', 'fiber'],
    },

    // Dairy Products
    {
        id: '4',
        name: 'Helmelk 3,9%',
        price: 24.9,
        unit: '1 liter',
        image: getProductImageUrl('Meieri, ost og egg', 'Helmelk 3,9%'),
        category: 'Meieri, ost og egg',
        subcategory: 'Melk',
        inStock: true,
        description: 'Fersk helmelk fra norske gårder',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 1.9,
            sustainabilityScore: 3,
            packaging: 'recyclable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2026-01-15',
            storageConditions: 'Keep refrigerated at 4°C',
        },
        nutritionalInfo: {
            calories: 64,
            protein: 3.4,
            fat: 3.5,
            carbs: 4.8,
            allergens: ['melk'],
        },
        tags: ['norsk', 'protein', 'kalsium'],
    },
    {
        id: '5',
        name: 'Frittgående Høns Egg',
        price: 49.9,
        unit: '12 stk',
        image: getProductImageUrl('Meieri, ost og egg', 'Frittgående Høns Egg'),
        category: 'Meieri, ost og egg',
        subcategory: 'Egg',
        inStock: true,
        description: 'Ferske egg fra frittgående høns med høy dyrevelferd',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 2.5,
            sustainabilityScore: 2,
            packaging: 'recyclable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2026-01-20',
            storageConditions: 'Store in refrigerator',
        },
        nutritionalInfo: {
            calories: 70,
            protein: 6,
            fat: 5,
            allergens: ['egg'],
        },
        tags: ['frittgående', 'dyrevelferd', 'protein'],
    },

    // Bakery
    {
        id: '6',
        name: 'Håndlaget Surdeigsbrød',
        price: 45.0,
        unit: '1 stk',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&bg=white',
        category: 'Bakeri og konditori',
        subcategory: 'Brød',
        inStock: true,
        description: 'Tradisjonelt surdeigsbrød bakt til bestilling',
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 0.8,
            sustainabilityScore: 2,
            packaging: 'biodegradable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            harvestedDate: '2026-01-04',
            bestBefore: '2026-01-08',
            storageConditions: 'Store in bread box or freeze',
        },
        nutritionalInfo: {
            calories: 247,
            protein: 8,
            carbs: 51,
            fiber: 3,
            allergens: ['gluten'],
        },
        tags: ['håndlaget', 'surdeig', 'mindre matsvinn'],
    },

    // Fish and Seafood
    {
        id: '7',
        name: 'Norsk Laks Filet',
        price: 189.0,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=400&fit=crop&bg=white',
        category: 'Fisk og sjømat',
        subcategory: 'Laks',
        inStock: true,
        description: 'Fersk laksefilet fra norsk oppdrett av høyeste kvalitet',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 6.0,
            sustainabilityScore: 3,
            packaging: 'recyclable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2026-01-07',
            storageConditions: 'Keep refrigerated, use within 2 days',
        },
        nutritionalInfo: {
            calories: 208,
            protein: 25,
            fat: 12,
            allergens: ['fisk'],
        },
        tags: ['norsk', 'omega-3', 'protein'],
        bulkDiscount: {
            minQuantity: 2,
            discountPercentage: 10,
        },
    },

    // Plant-based
    {
        id: '8',
        name: 'Havre Melk Original',
        price: 32.9,
        unit: '1 liter',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&bg=white',
        category: 'Plantebasert',
        subcategory: 'Melkealternativer',
        inStock: true,
        description: 'Kremet havremelk uten tilsatte sukker',
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 0.9,
            sustainabilityScore: 1,
            packaging: 'recyclable',
            locallySourced: false,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2026-02-15',
            storageConditions: 'Keep refrigerated after opening',
        },
        nutritionalInfo: {
            calories: 40,
            protein: 1,
            carbs: 6.5,
            fat: 1.5,
            fiber: 0.8,
            allergens: ['havre'],
        },
        tags: ['plantebasert', 'vegan', 'laktosefri'],
    },

    // Snacks and Chocolate
    {
        id: '9',
        name: 'Mørk Sjokolade 70%',
        price: 39.9,
        unit: '100g',
        image: getProductImageUrl('Sjokolade, snacks og godteri', 'Mørk Sjokolade 70%'),
        category: 'Sjokolade, snacks og godteri',
        subcategory: 'Sjokolade',
        inStock: true,
        description: 'Premium mørk sjokolade med 70% kakao',
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 2.3,
            sustainabilityScore: 3,
            packaging: 'recyclable',
            locallySourced: false,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2026-08-15',
            storageConditions: 'Store in cool, dry place',
        },
        nutritionalInfo: {
            calories: 579,
            protein: 8,
            fat: 42,
            carbs: 37,
            allergens: ['melk', 'soya'],
        },
        tags: ['fairtrade', 'antioksidanter'],
    },

    // Beverages
    {
        id: '10',
        name: 'Norsk Mineralvann',
        price: 19.9,
        unit: '1,5 liter',
        image: getProductImageUrl('Drikke', 'Norsk Mineralvann'),
        category: 'Drikke',
        subcategory: 'Vann',
        inStock: true,
        description: 'Rent mineralvann fra norske kilder',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 0.1,
            sustainabilityScore: 1,
            packaging: 'recyclable',
            locallySourced: true,
        },
        freshness: {
            freshnessRating: 5,
            bestBefore: '2027-01-01',
            storageConditions: 'Store in cool place',
        },
        nutritionalInfo: {
            calories: 0,
            allergens: [],
        },
        tags: ['norsk', 'rent', 'mineraler'],
        bulkDiscount: {
            minQuantity: 6,
            discountPercentage: 15,
        },
    },

    // More Fruits and Vegetables
    {
        id: '11',
        name: 'Røde Epler',
        price: 34.9,
        unit: 'kg',
        image: getProductImageUrl('Frukt og grønt', 'Røde Epler'),
        category: 'Frukt og grønt',
        subcategory: 'Frukt',
        inStock: true,
        description: 'Krispe og søte røde epler',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 0.2,
            sustainabilityScore: 1,
            packaging: 'minimal',
            locallySourced: true,
        },
        tags: ['norsk', 'fiber', 'vitaminer'],
    },
    {
        id: '12',
        name: 'Ferske Tomater',
        price: 49.9,
        unit: 'kg',
        image: getProductImageUrl('Frukt og grønt', 'Ferske Tomater'),
        category: 'Frukt og grønt',
        subcategory: 'Grønnsaker',
        inStock: true,
        description: 'Modne og saftige tomater',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 0.4,
            sustainabilityScore: 1,
            packaging: 'minimal',
            locallySourced: true,
        },
        tags: ['norsk', 'fersk', 'lykopen'],
    },

    // More Dairy
    {
        id: '13',
        name: 'Gulost',
        price: 89.9,
        unit: 'kg',
        image: getProductImageUrl('Meieri, ost og egg', 'Gulost'),
        category: 'Meieri, ost og egg',
        subcategory: 'Ost',
        inStock: true,
        description: 'Klassisk norsk gulost',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 2.1,
            sustainabilityScore: 3,
            packaging: 'recyclable',
            locallySourced: true,
        },
        tags: ['norsk', 'protein', 'kalsium'],
    },
    {
        id: '14',
        name: 'Yoghurt Naturell',
        price: 29.9,
        unit: '500g',
        image: getProductImageUrl('Meieri, ost og egg', 'Yoghurt Naturell'),
        category: 'Meieri, ost og egg',
        subcategory: 'Yoghurt',
        inStock: true,
        description: 'Kremet yoghurt uten tilsatt sukker',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 1.5,
            sustainabilityScore: 2,
            packaging: 'recyclable',
            locallySourced: true,
        },
        tags: ['norsk', 'protein', 'probiotika'],
    },

    // More Bakery
    {
        id: '15',
        name: 'Kneippbrød',
        price: 32.9,
        unit: '500g',
        image: getProductImageUrl('Bakeri og konditori', 'Kneippbrød'),
        category: 'Bakeri og konditori',
        subcategory: 'Brød',
        inStock: true,
        description: 'Klassisk kneippbrød med fullkorn',
        temperatureZone: 'ambient',
        sustainability: {
            carbonFootprint: 0.6,
            sustainabilityScore: 2,
            packaging: 'biodegradable',
            locallySourced: true,
        },
        tags: ['fullkorn', 'fiber'],
    },

    // More Plant-based
    {
        id: '16',
        name: 'Mandelmelk',
        price: 36.9,
        unit: '1 liter',
        image: getProductImageUrl('Plantebasert', 'Mandelmelk'),
        category: 'Plantebasert',
        subcategory: 'Melkealternativer',
        inStock: true,
        description: 'Kremet mandelmelk uten tilsatt sukker',
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 1.1,
            sustainabilityScore: 2,
            packaging: 'recyclable',
            locallySourced: false,
        },
        tags: ['plantebasert', 'vegan', 'laktosefri'],
    },

    // More Fish
    {
        id: '17',
        name: 'Torskefilet',
        price: 149.0,
        unit: 'kg',
        image: getProductImageUrl('Fisk og sjømat', 'Torskefilet'),
        category: 'Fisk og sjømat',
        subcategory: 'Hvit fisk',
        inStock: true,
        description: 'Fersk torskefilet fra norske farvann',
        origin: 'Norge',
        isLocal: true,
        temperatureZone: 'chilled',
        sustainability: {
            carbonFootprint: 2.8,
            sustainabilityScore: 2,
            packaging: 'recyclable',
            locallySourced: true,
        },
        tags: ['norsk', 'protein', 'omega-3'],
    },
];
