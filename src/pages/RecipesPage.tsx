import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Zap, Search } from 'lucide-react';
import { recipeCategories, mockRecipes } from '../mocks/recipes';
import { useCart } from '../state/CartContext';
import { mockProducts } from '../mocks/products';
import './RecipesPage.css';

function RecipeCard({ recipe }: { recipe: typeof mockRecipes[0] }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Add all recipe ingredients to cart
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.productId) {
                const product = mockProducts.find(p => p.id === ingredient.productId);
                if (product) {
                    addToCart(product, 1);
                }
            }
        });
    };

    const difficultyConfig = {
        easy: { label: 'Lett', color: '#10b981', bgColor: '#d1fae5' },
        medium: { label: 'Middels', color: '#f59e0b', bgColor: '#fef3c7' },
        hard: { label: 'Vanskelig', color: '#ef4444', bgColor: '#fee2e2' }
    }[recipe.difficulty];

    return (
        <Link to={`/recipes/${recipe.id}`} className="recipe-card">
            <div className="recipe-card__image-wrapper">
                <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="recipe-card__image"
                    loading="lazy"
                />
                <div className="recipe-card__badge" style={{
                    backgroundColor: difficultyConfig.bgColor,
                    color: difficultyConfig.color
                }}>
                    {difficultyConfig.label}
                </div>
            </div>
            <div className="recipe-card__content">
                <h3 className="recipe-card__title">{recipe.name}</h3>
                <p className="recipe-card__description">{recipe.description}</p>

                <div className="recipe-card__meta">
                    <div className="recipe-meta__item">
                        <Clock size={16} />
                        <span>{recipe.prepTime + recipe.cookingTime} min</span>
                    </div>
                    <div className="recipe-meta__item">
                        <Users size={16} />
                        <span>{recipe.servings}</span>
                    </div>
                    <div className="recipe-meta__item">
                        <Zap size={16} />
                        <span>{recipe.nutritionalInfo?.calories || 0} kcal</span>
                    </div>
                </div>

                {recipe.sustainability && (
                    <div className="recipe-card__sustainability">
                        <span className="sustainability-icon">🌱</span>
                        <span className="sustainability-text">
                            {recipe.sustainability.carbonFootprint.toFixed(1)} kg CO₂
                        </span>
                    </div>
                )}

                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="recipe-card__tags">
                        {recipe.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="recipe-tag">{tag}</span>
                        ))}
                    </div>
                )}

                <button
                    className="recipe-card__add-button"
                    onClick={handleAddToCart}
                    type="button"
                >
                    Legg ingredienser i kurv
                </button>
            </div>
        </Link>
    );
}

function CategoryCard({ category }: { category: typeof recipeCategories[0] }) {
    return (
        <Link to={`/recipes?category=${category.id}`} className="category-card">
            <div className="category-card__image-wrapper">
                <img
                    src={category.image}
                    alt={category.name}
                    className="category-card__image"
                    loading="lazy"
                />
                <div className="category-card__overlay" />
            </div>
            <div className="category-card__content">
                <h3 className="category-card__title">{category.name}</h3>
                <p className="category-card__description">{category.description}</p>
                <span className="category-card__count">{category.recipeCount} oppskrifter</span>
            </div>
        </Link>
    );
}

export function RecipesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecipes = mockRecipes.filter(recipe => {
        const matchesSearch = searchQuery === '' ||
            recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSearch;
    });

    return (
        <div className="recipes-page">
            {/* Hero Header */}
            <div className="recipes-hero">
                <div className="container">
                    <div className="recipes-hero__content">
                        <h1 className="recipes-hero__title">Oppskrifter</h1>
                        <p className="recipes-hero__subtitle">
                            Oppdag deilige oppskrifter og kjøp alle ingrediensene med ett klikk
                        </p>

                        <div className="recipes-search">
                            <div className="recipes-search__wrapper">
                                <Search className="recipes-search__icon" size={20} />
                                <input
                                    type="search"
                                    placeholder="Søk oppskrifter..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="recipes-search__input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Categories Section */}
                <section className="recipe-categories-section">
                    <h2 className="section-title">Kategorier</h2>
                    <div className="categories-grid">
                        {recipeCategories.map(category => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                </section>

                {/* Recipes Section */}
                <section className="featured-recipes-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            {searchQuery ? 'Søkeresultater' : 'Populære oppskrifter'}
                        </h2>
                        {searchQuery && (
                            <p className="section-subtitle">
                                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'oppskrift funnet' : 'oppskrifter funnet'}
                            </p>
                        )}
                    </div>

                    {filteredRecipes.length > 0 ? (
                        <div className="recipes-grid">
                            {filteredRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="recipes-empty">
                            <p className="recipes-empty__text">
                                Ingen oppskrifter funnet. Prøv et annet søkeord.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
