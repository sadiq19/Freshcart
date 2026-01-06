import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, Zap, ArrowLeft, ShoppingCart, Check, Leaf } from 'lucide-react';
import { mockRecipes } from '../mocks/recipes';
import { mockProducts } from '../mocks/products';
import { useCart } from '../state/CartContext';
import './RecipeDetailPage.css';

interface IngredientItemProps {
    ingredient: typeof mockRecipes[0]['ingredients'][0];
    servingMultiplier: number;
    onAddToCart: () => void;
    isInCart: boolean;
}

function IngredientItem({ ingredient, servingMultiplier, onAddToCart, isInCart }: IngredientItemProps) {
    const adjustedQuantity = ingredient.quantity * servingMultiplier;
    const product = ingredient.productId ? mockProducts.find(p => p.id === ingredient.productId) : null;

    return (
        <div className="ingredient-item">
            <div className="ingredient-info">
                <span className="ingredient-quantity">
                    {adjustedQuantity} {ingredient.unit}
                </span>
                <span className="ingredient-name">{ingredient.name}</span>
                {ingredient.alternatives && (
                    <span className="ingredient-alternatives">
                        (eller: {ingredient.alternatives.join(', ')})
                    </span>
                )}
            </div>

            {product && (
                <div className="ingredient-product">
                    <div className="ingredient-product-info">
                        <img src={product.image} alt={product.name} className="ingredient-product-image" />
                        <div>
                            <div className="ingredient-product-name">{product.name}</div>
                            <div className="ingredient-product-price">{product.price} kr/{product.unit}</div>
                        </div>
                    </div>

                    <button
                        className={`ingredient-add-button ${isInCart ? 'added' : ''}`}
                        onClick={onAddToCart}
                        disabled={!product.inStock}
                    >
                        {isInCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                        {!product.inStock ? 'Utsolgt' : isInCart ? 'I kurv' : 'Legg til'}
                    </button>
                </div>
            )}
        </div>
    );
}

export function RecipeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart, items } = useCart();
    const [servings, setServings] = useState(4);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

    const recipe = mockRecipes.find(r => r.id === id);

    if (!recipe) {
        return (
            <div className="container">
                <div className="recipe-not-found">
                    <h1>Oppskrift ikke funnet</h1>
                    <Link to="/recipes" className="back-link">
                        <ArrowLeft size={20} /> Tilbake til oppskrifter
                    </Link>
                </div>
            </div>
        );
    }

    const servingMultiplier = servings / recipe.servings;

    const handleAddIngredientToCart = (ingredient: typeof recipe.ingredients[0]) => {
        if (ingredient.productId) {
            const product = mockProducts.find(p => p.id === ingredient.productId);
            if (product) {
                const adjustedQuantity = Math.ceil(ingredient.quantity * servingMultiplier);
                addToCart(product, adjustedQuantity);
            }
        }
    };

    const handleAddAllIngredientsToCart = () => {
        recipe.ingredients.forEach(ingredient => {
            if (ingredient.productId) {
                handleAddIngredientToCart(ingredient);
            }
        });
    };

    const isIngredientInCart = (ingredient: typeof recipe.ingredients[0]) => {
        if (!ingredient.productId) return false;
        return items.some(item => item.product.id === ingredient.productId);
    };

    const difficultyColor = {
        easy: '#10b981',
        medium: '#f59e0b',
        hard: '#ef4444'
    }[recipe.difficulty];

    const adjustedCalories = Math.round((recipe.nutritionalInfo?.calories || 0) * servingMultiplier);
    const adjustedCarbonFootprint = (recipe.sustainability?.carbonFootprint || 0) * servingMultiplier;

    return (
        <div className="recipe-detail">
            <div className="container">
                {/* Header */}
                <div className="recipe-detail__header">
                    <Link to="/recipes" className="back-link">
                        <ArrowLeft size={20} /> Tilbake til oppskrifter
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="recipe-hero">
                    <div className="recipe-hero__image">
                        <img src={recipe.image} alt={recipe.name} />
                        <div className="recipe-difficulty" style={{ backgroundColor: difficultyColor }}>
                            {recipe.difficulty === 'easy' ? 'Lett' : recipe.difficulty === 'medium' ? 'Middels' : 'Vanskelig'}
                        </div>
                    </div>

                    <div className="recipe-hero__content">
                        <h1 className="recipe-title">{recipe.name}</h1>
                        <p className="recipe-description">{recipe.description}</p>

                        <div className="recipe-meta">
                            <div className="recipe-meta__item">
                                <Clock size={20} />
                                <div>
                                    <span className="meta-label">Tilberedningstid</span>
                                    <span className="meta-value">{recipe.prepTime + recipe.cookingTime} min</span>
                                </div>
                            </div>
                            <div className="recipe-meta__item">
                                <Users size={20} />
                                <div>
                                    <span className="meta-label">Porsjoner</span>
                                    <div className="serving-adjuster">
                                        <button
                                            onClick={() => setServings(Math.max(1, servings - 1))}
                                            disabled={servings <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="meta-value">{servings}</span>
                                        <button onClick={() => setServings(servings + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className="recipe-meta__item">
                                <Zap size={20} />
                                <div>
                                    <span className="meta-label">Kalorier</span>
                                    <span className="meta-value">{adjustedCalories} kcal</span>
                                </div>
                            </div>
                        </div>

                        <div className="recipe-sustainability">
                            <div className="sustainability-score">
                                <Leaf size={18} />
                                <span>CO2-avtrykk: {adjustedCarbonFootprint.toFixed(1)}kg</span>
                            </div>
                            <div className="sustainability-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Leaf
                                        key={i}
                                        size={16}
                                        className={i < (recipe.sustainability?.sustainabilityScore || 3) ? 'filled' : ''}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="recipe-tags">
                            {recipe.tags.map(tag => (
                                <span key={tag} className="recipe-tag">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="recipe-content">
                    <div className="recipe-tabs">
                        <button
                            className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ingredients')}
                        >
                            Ingredienser
                        </button>
                        <button
                            className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('instructions')}
                        >
                            Fremgangsmåte
                        </button>
                    </div>

                    {activeTab === 'ingredients' && (
                        <div className="ingredients-section">
                            <div className="ingredients-header">
                                <h2>Ingredienser for {servings} {servings === 1 ? 'porsjon' : 'porsjoner'}</h2>
                                <button
                                    className="add-all-button"
                                    onClick={handleAddAllIngredientsToCart}
                                >
                                    <ShoppingCart size={20} />
                                    Legg alle ingredienser i kurv
                                </button>
                            </div>

                            <div className="ingredients-list">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <IngredientItem
                                        key={index}
                                        ingredient={ingredient}
                                        servingMultiplier={servingMultiplier}
                                        onAddToCart={() => handleAddIngredientToCart(ingredient)}
                                        isInCart={isIngredientInCart(ingredient)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'instructions' && (
                        <div className="instructions-section">
                            <h2>Fremgangsmåte</h2>
                            <ol className="instructions-list">
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index} className="instruction-step">
                                        <span className="step-number">{index + 1}</span>
                                        <span className="step-text">{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
