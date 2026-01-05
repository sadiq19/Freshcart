import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { mockProducts } from '../mocks/products';
import { ProductGrid } from '../components/product/ProductGrid';
import './ProductDetailPage.css';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = mockProducts.find(p => p.id === id);

    if (!product) {
        return (
            <div className="container">
                <div className="product-not-found">
                    <h1>Produkt ikke funnet</h1>
                    <p>Beklager, vi kunne ikke finne dette produktet.</p>
                    <Link to="/" className="product-not-found__link">
                        Tilbake til forsiden
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: price % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setQuantity(1);
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    // Get related products (same category, excluding current)
    const relatedProducts = mockProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // Sustainability score visual
    const getSustainabilityLabel = (score: number) => {
        if (score <= 2) return { label: 'Lavt klimaavtrykk', color: '#16a34a' };
        if (score <= 3) return { label: 'Middels klimaavtrykk', color: '#ca8a04' };
        return { label: 'Høyt klimaavtrykk', color: '#dc2626' };
    };

    const sustainability = product.sustainability
        ? getSustainabilityLabel(product.sustainability.sustainabilityScore)
        : null;

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Brødsmuler">
                    <Link to="/">Hjem</Link>
                    <span className="breadcrumb__separator">/</span>
                    <Link to={`/?category=${encodeURIComponent(product.category)}`}>
                        {product.category}
                    </Link>
                    <span className="breadcrumb__separator">/</span>
                    <span className="breadcrumb__current">{product.name}</span>
                </nav>

                {/* Product main section */}
                <div className="product-detail">
                    {/* Product image */}
                    <div className="product-detail__image-section">
                        <div className="product-detail__image-wrapper">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-detail__image"
                            />
                            {product.isOrganic && (
                                <span className="product-detail__badge product-detail__badge--organic">
                                    Økologisk
                                </span>
                            )}
                            {product.isLocal && (
                                <span className="product-detail__badge product-detail__badge--local">
                                    Norsk
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="product-detail__info-section">
                        <div className="product-detail__header">
                            <span className="product-detail__category">{product.category}</span>
                            <h1 className="product-detail__name">{product.name}</h1>
                            <span className="product-detail__unit">{product.unit}</span>
                        </div>

                        <div className="product-detail__price-section">
                            <span className="product-detail__price">{formatPrice(product.price)}</span>
                            {product.bulkDiscount && (
                                <span className="product-detail__discount">
                                    Kjøp {product.bulkDiscount.minQuantity}+ og spar {product.bulkDiscount.discountPercentage}%
                                </span>
                            )}
                        </div>

                        {product.description && (
                            <p className="product-detail__description">{product.description}</p>
                        )}

                        {/* Add to cart section */}
                        <div className="product-detail__cart-section">
                            <div className="product-detail__quantity">
                                <button
                                    type="button"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    aria-label="Reduser antall"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    type="button"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(1)}
                                    aria-label="Øk antall"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                type="button"
                                className="product-detail__add-btn"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                {product.inStock ? (
                                    <>
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Legg i handlekurv - {formatPrice(product.price * quantity)}
                                    </>
                                ) : (
                                    'Utsolgt'
                                )}
                            </button>
                        </div>

                        {/* Product details accordion-like sections */}
                        <div className="product-detail__sections">
                            {/* Sustainability info */}
                            {product.sustainability && (
                                <div className="product-section">
                                    <h3 className="product-section__title">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
                                        </svg>
                                        Bærekraft
                                    </h3>
                                    <div className="product-section__content">
                                        <div className="sustainability-info">
                                            <div className="sustainability-item">
                                                <span className="sustainability-label">Klimaavtrykk:</span>
                                                <span
                                                    className="sustainability-value"
                                                    style={{ color: sustainability?.color }}
                                                >
                                                    {product.sustainability.carbonFootprint} kg CO₂ - {sustainability?.label}
                                                </span>
                                            </div>
                                            <div className="sustainability-item">
                                                <span className="sustainability-label">Emballasje:</span>
                                                <span className="sustainability-value">
                                                    {product.sustainability.packaging === 'minimal' && 'Minimal'}
                                                    {product.sustainability.packaging === 'recyclable' && 'Resirkulerbar'}
                                                    {product.sustainability.packaging === 'biodegradable' && 'Biologisk nedbrytbar'}
                                                    {product.sustainability.packaging === 'standard' && 'Standard'}
                                                </span>
                                            </div>
                                            {product.sustainability.locallySourced && (
                                                <div className="sustainability-item">
                                                    <span className="sustainability-badge">🇳🇴 Lokalt produsert</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nutritional info */}
                            {product.nutritionalInfo && (
                                <div className="product-section">
                                    <h3 className="product-section__title">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor" />
                                            <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z" fill="currentColor" />
                                        </svg>
                                        Næringsinnhold
                                    </h3>
                                    <div className="product-section__content">
                                        <div className="nutrition-grid">
                                            {product.nutritionalInfo.calories !== undefined && (
                                                <div className="nutrition-item">
                                                    <span className="nutrition-value">{product.nutritionalInfo.calories}</span>
                                                    <span className="nutrition-label">kcal</span>
                                                </div>
                                            )}
                                            {product.nutritionalInfo.protein !== undefined && (
                                                <div className="nutrition-item">
                                                    <span className="nutrition-value">{product.nutritionalInfo.protein}g</span>
                                                    <span className="nutrition-label">Protein</span>
                                                </div>
                                            )}
                                            {product.nutritionalInfo.carbs !== undefined && (
                                                <div className="nutrition-item">
                                                    <span className="nutrition-value">{product.nutritionalInfo.carbs}g</span>
                                                    <span className="nutrition-label">Karbohydrater</span>
                                                </div>
                                            )}
                                            {product.nutritionalInfo.fat !== undefined && (
                                                <div className="nutrition-item">
                                                    <span className="nutrition-value">{product.nutritionalInfo.fat}g</span>
                                                    <span className="nutrition-label">Fett</span>
                                                </div>
                                            )}
                                            {product.nutritionalInfo.fiber !== undefined && (
                                                <div className="nutrition-item">
                                                    <span className="nutrition-value">{product.nutritionalInfo.fiber}g</span>
                                                    <span className="nutrition-label">Fiber</span>
                                                </div>
                                            )}
                                        </div>
                                        {product.nutritionalInfo.allergens && product.nutritionalInfo.allergens.length > 0 && (
                                            <div className="allergens">
                                                <span className="allergens-label">Allergener:</span>
                                                <span className="allergens-list">
                                                    {product.nutritionalInfo.allergens.join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Storage info */}
                            {product.freshness && (
                                <div className="product-section">
                                    <h3 className="product-section__title">
                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor" />
                                            <path d="M12 18c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z" fill="currentColor" />
                                        </svg>
                                        Oppbevaring
                                    </h3>
                                    <div className="product-section__content">
                                        <p>{product.freshness.storageConditions}</p>
                                        {product.freshness.bestBefore && (
                                            <p className="best-before">
                                                Best før: {new Date(product.freshness.bestBefore).toLocaleDateString('nb-NO')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="product-detail__tags">
                                {product.tags.map(tag => (
                                    <span key={tag} className="product-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2 className="related-products__title">Lignende produkter</h2>
                        <ProductGrid
                            products={relatedProducts}
                            onAddToCart={addToCart}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}
