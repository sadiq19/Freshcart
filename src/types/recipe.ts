export interface Recipe {
    id: string;
    name: string;
    description: string;
    image: string;
    cookingTime: number; // minutes
    prepTime: number; // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;
    ingredients: RecipeIngredient[];
    instructions: string[];
    tags: string[];
    nutritionalInfo?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    sustainability?: {
        carbonFootprint: number;
        sustainabilityScore: 1 | 2 | 3 | 4 | 5;
    };
}

export interface RecipeIngredient {
    productId?: string; // Link to actual product
    name: string;
    quantity: number;
    unit: string;
    isOptional?: boolean;
    alternatives?: string[]; // Alternative ingredient names
}

export interface RecipeCategory {
    id: string;
    name: string;
    description: string;
    image: string;
    recipeCount: number;
}