import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Zap } from 'lucide-react';
import { recipeCategories, mockRecipes } from '../mocks/recipes';
import { useCart } from '../state/CartContext';
import { mockProducts } from '../mocks/products';

function RecipeCard({ recipe }: { recipe: typeof mockRecipes[0] }) {
    const { addRecipeToCart } = useCart();
    
    const handleAddToCart = () => {
        // Add all recipe ingredients to cart
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.productId) {
                const product = mockProducts.find(p => p.id === ingredient.productId);
                if (product) {
                    addRecipeToCart(recipe.id, recipe.servings);
                }
            }
        });
    };

    const difficultyColor = {
        easy: '#10b981',
        medium: '#f59e0b', 
        hard: '#ef4444'
    }[recipe.difficulty];

    return (
        <div className="recipe-card">
            <Link to={`/recipes/${recipe.id}`}>
                <div className="recipe-card__image">
                    <img src={recipe.image} alt={recipe.name} />
                    <div className="recipe-card__difficulty" style={{ backgroundColor: difficultyColor }}>
                        {recipe.difficulty === 'easy' ? 'Lett' : recipe.difficulty === 'medium' ? 'Middels' : 'Vanskelig'}
                    </div>
                </div>
            </Link>
            <div className="recipe-card__content">
                <h3 className="recipe-card__title">
                    <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                </h3>
                <p className="recipe-card__description">{recipe.description}</p>
                
                <div className="recipe-card__meta">
                    <div className="recipe-meta__item">
                        <Clock size={16} />
                        <span>{recipe.prepTime + recipe.cookingTime} min</span>
                    </div>
                    <div className="recipe-meta__item">
                        <Users size={16} />
                        <span>{recipe.servings} porsjoner</span>
                    </div>
                    <div className="recipe-meta__item">
                        <Zap size={16} />
                        <span>{recipe.nutritionalInfo?.calories || 0} kcal</span>
                    </div>
                </div>

                <div className="recipe-card__sustainability">
                    <span className="sustainability-score">🌱 CO2: {recipe.sustainability?.carbonFootprint.toFixed(1)}kg</span>
                </div>

                <div className="recipe-card__tags">
                    {recipe.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="recipe-tag">{tag}</span>
                    ))}
                </div>

                <button 
                    className="recipe-card__add-button"
                    onClick={handleAddToCart}
                >
                    Legg ingredienser i kurv
                </button>
            </div>
        </div>
    );
}

function CategoryCard({ category }: { category: typeof recipeCategories[0] }) {
    return (
        <div className="category-card">
            <div className="category-card__image">
                <img src={category.image} alt={category.name} />
            </div>
            <div className="category-card__content">
                <h3 className="category-card__title">{category.name}</h3>
                <p className="category-card__description">{category.description}</p>
                <span className="category-card__count">{category.recipeCount} oppskrifter</span>
            </div>
        </div>
    );
}

export function RecipesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecipes = mockRecipes.filter(recipe => {
        const matchesSearch = searchQuery === '' || 
            recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // For now, show all recipes regardless of category
        return matchesSearch;
    });

    return (
        <div className="recipes-page">
            <div className="container">
                {/* Header */}
                <div className="recipes-header">
                    <h1>Oppskrifter</h1>
                    <p>Oppdag deilige oppskrifter og kjøp alle ingrediensene med ett klikk</p>
                    
                    <div className="recipes-search">
                        <input
                            type="search"
                            placeholder="Søk oppskrifter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="recipes-search__input"
                        />
                    </div>
                </div>

                {/* Categories */}
                <section className="recipe-categories">
                    <h2>Kategorier</h2>
                    <div className="categories-grid">
                        {recipeCategories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </section>

                {/* Featured/Popular Recipes */}
                <section className="featured-recipes">
                    <h2>Populære oppskrifter</h2>
                    <div className="recipes-grid">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
