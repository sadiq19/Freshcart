import type { Recipe, RecipeCategory } from '../types/recipe';

export const recipeCategories: RecipeCategory[] = [
    {
        id: '1',
        name: 'Rask middag',
        description: 'Deilige middager klare på under 30 minutter',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        recipeCount: 24,
    },
    {
        id: '2',
        name: 'Vegetarisk',
        description: 'Vegetariske retter fulle av smak',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        recipeCount: 18,
    },
    {
        id: '3',
        name: 'Fisk og sjømat',
        description: 'Ferske retter fra havet',
        image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop',
        recipeCount: 15,
    },
    {
        id: '4',
        name: 'Norsk tradisjon',
        description: 'Klassiske norske retter',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        recipeCount: 12,
    },
];

export const mockRecipes: Recipe[] = [
    {
        id: '1',
        name: 'Grillet laks med avokadosalat',
        description: 'En sunn og deilig middag med norsk laks og fersk avokado',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop',
        cookingTime: 20,
        prepTime: 15,
        difficulty: 'easy',
        servings: 4,
        tags: ['sunt', 'rask', 'protein', 'omega-3'],
        nutritionalInfo: {
            calories: 420,
            protein: 35,
            carbs: 8,
            fat: 28,
        },
        sustainability: {
            carbonFootprint: 3.2,
            sustainabilityScore: 2,
        },
        ingredients: [
            {
                productId: '7', // Norsk Laks Filet
                name: 'Norsk laks filet',
                quantity: 600,
                unit: 'g',
            },
            {
                productId: '3', // Ferske Avokadoer
                name: 'Avokado',
                quantity: 2,
                unit: 'stk',
            },
            {
                productId: '2', // Norske Gulrøtter
                name: 'Gulrot',
                quantity: 2,
                unit: 'stk',
            },
            {
                name: 'Sitron',
                quantity: 1,
                unit: 'stk',
            },
            {
                name: 'Olivenolje',
                quantity: 3,
                unit: 'ss',
            },
            {
                name: 'Salt og pepper',
                quantity: 1,
                unit: 'ts',
            },
        ],
        instructions: [
            'Forvarm grillen til middels høy temperatur.',
            'Pensle laksefiletene med olivenolje og krydre med salt og pepper.',
            'Grill laksen i 4-5 minutter på hver side til den er gjennomstekt.',
            'Skjær avokado og gulrøtter i terninger.',
            'Bland avokado og gulrøtter med sitronsjuice og olivenolje.',
            'Server den grillede laksen med avokadosalaten.',
        ],
    },
    {
        id: '2',
        name: 'Surdeigsbrød med havresmør',
        description: 'Hjemmelaget surdeigsbrød servert med kremete havresmør',
        image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop',
        cookingTime: 30,
        prepTime: 10,
        difficulty: 'easy',
        servings: 4,
        tags: ['vegetarisk', 'frokost', 'plantebasert'],
        nutritionalInfo: {
            calories: 280,
            protein: 8,
            carbs: 45,
            fat: 8,
        },
        sustainability: {
            carbonFootprint: 0.6,
            sustainabilityScore: 1,
        },
        ingredients: [
            {
                productId: '6', // Håndlaget Surdeigsbrød
                name: 'Surdeigsbrød',
                quantity: 4,
                unit: 'skiver',
            },
            {
                productId: '8', // Havre Melk Original
                name: 'Havremelk',
                quantity: 200,
                unit: 'ml',
            },
            {
                name: 'Cashewnøtter',
                quantity: 100,
                unit: 'g',
            },
            {
                name: 'Salt',
                quantity: 1,
                unit: 'ts',
            },
        ],
        instructions: [
            'Bløtlegg cashewnøttene i vann i 2 timer.',
            'Bland cashewnøtter, havremelk og salt i en blender til det blir kremete.',
            'Rist brødskivene til de er gyllne.',
            'Smør havresmøret på det varme brødet.',
            'Server umiddelbart.',
        ],
    },
    {
        id: '3',
        name: 'Klassisk norsk fiskepudding',
        description: 'Tradisjonell norsk fiskepudding med hvit saus og gulrøtter',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
        cookingTime: 45,
        prepTime: 20,
        difficulty: 'medium',
        servings: 6,
        tags: ['norsk', 'tradisjon', 'familie', 'protein'],
        nutritionalInfo: {
            calories: 320,
            protein: 25,
            carbs: 18,
            fat: 16,
        },
        sustainability: {
            carbonFootprint: 2.8,
            sustainabilityScore: 2,
        },
        ingredients: [
            {
                productId: '7', // Norsk Laks Filet (can be substituted with white fish)
                name: 'Hvit fisk filet',
                quantity: 800,
                unit: 'g',
                alternatives: ['torsk', 'sei', 'hyse'],
            },
            {
                productId: '4', // Helmelk 3,9%
                name: 'Helmelk',
                quantity: 400,
                unit: 'ml',
            },
            {
                productId: '5', // Frittgående Høns Egg
                name: 'Egg',
                quantity: 2,
                unit: 'stk',
            },
            {
                productId: '2', // Norske Gulrøtter
                name: 'Gulrøtter',
                quantity: 500,
                unit: 'g',
            },
            {
                name: 'Hvetemel',
                quantity: 3,
                unit: 'ss',
            },
            {
                name: 'Smør',
                quantity: 50,
                unit: 'g',
            },
            {
                name: 'Salt, hvit pepper, muskatnøtt',
                quantity: 1,
                unit: 'ts hver',
            },
        ],
        instructions: [
            'Forvarm ovnen til 180°C.',
            'Kutt fisken i biter og mal den i foodprocessor med egg og krydder.',
            'Tilsett melken gradvis mens du blander.',
            'Hell røren i smurt form og stek i vandbad i 45 minutter.',
            'Kok gulrøttene til de er møre.',
            'Lag hvit saus av smør, mel og melk.',
            'Server fiskepuddingen varm med saus og gulrøtter.',
        ],
    },
    {
        id: '4',
        name: 'Sjokoladekake med bær',
        description: 'Rik sjokoladekake med sesongens ferske bær',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
        cookingTime: 50,
        prepTime: 25,
        difficulty: 'medium',
        servings: 8,
        tags: ['dessert', 'fest', 'sjokolade', 'bær'],
        nutritionalInfo: {
            calories: 450,
            protein: 6,
            carbs: 55,
            fat: 24,
        },
        sustainability: {
            carbonFootprint: 1.8,
            sustainabilityScore: 3,
        },
        ingredients: [
            {
                productId: '9', // Mørk Sjokolade 70%
                name: 'Mørk sjokolade',
                quantity: 200,
                unit: 'g',
            },
            {
                productId: '5', // Frittgående Høns Egg
                name: 'Egg',
                quantity: 4,
                unit: 'stk',
            },
            {
                productId: '4', // Helmelk 3,9%
                name: 'Melk',
                quantity: 200,
                unit: 'ml',
            },
            {
                name: 'Hvetemel',
                quantity: 200,
                unit: 'g',
            },
            {
                name: 'Sukker',
                quantity: 180,
                unit: 'g',
            },
            {
                name: 'Smør',
                quantity: 100,
                unit: 'g',
            },
            {
                name: 'Blandede bær',
                quantity: 300,
                unit: 'g',
            },
            {
                name: 'Bakepulver',
                quantity: 2,
                unit: 'ts',
            },
        ],
        instructions: [
            'Forvarm ovnen til 175°C.',
            'Smelt sjokolade og smør forsiktig i vannbad.',
            'Visp egg og sukker luftig.',
            'Rør inn den smeltede sjokoladen.',
            'Sikt mel og bakepulver sammen og rør inn.',
            'Tilsett melken og bland godt.',
            'Hell røren i smurt form og strø bær på toppen.',
            'Stek i 45-50 minutter til kaken er gjennomstekt.',
        ],
    },
    {
        id: '5',
        name: 'Frisk smoothie bowl',
        description: 'Næringsrik smoothie bowl med toppings',
        image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=400&fit=crop',
        cookingTime: 0,
        prepTime: 10,
        difficulty: 'easy',
        servings: 2,
        tags: ['sunt', 'vegansk', 'frokost', 'rask'],
        nutritionalInfo: {
            calories: 285,
            protein: 8,
            carbs: 45,
            fat: 12,
        },
        sustainability: {
            carbonFootprint: 0.8,
            sustainabilityScore: 1,
        },
        ingredients: [
            {
                productId: '1', // Økologiske Bananer
                name: 'Banan',
                quantity: 2,
                unit: 'stk',
            },
            {
                productId: '8', // Havre Melk Original
                name: 'Havremelk',
                quantity: 300,
                unit: 'ml',
            },
            {
                name: 'Frosne bær',
                quantity: 200,
                unit: 'g',
            },
            {
                name: 'Havregryn',
                quantity: 4,
                unit: 'ss',
            },
            {
                name: 'Chiafr\u00f8',
                quantity: 2,
                unit: 'ss',
            },
            {
                name: 'N\u00f8tter',
                quantity: 50,
                unit: 'g',
            },
        ],
        instructions: [
            'Bland banan, havremelk og frosne b\u00e6r i blender til det blir kremete.',
            'Hell smoothien i sk\u00e5ler.',
            'Topp med havregryn, chiafr\u00f8 og n\u00f8tter.',
            'Server umiddelbart.',
        ],
    },
];