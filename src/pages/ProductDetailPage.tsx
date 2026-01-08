import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { apiService } from '../services/api';
import { adaptApiProduct } from '../utils/productAdapter';
import type { Product } from '../types/product';
import { ProductGrid } from '../components/product/ProductGrid';
import { Spinner } from '../components/common/Spinner';
import './ProductDetailPage.css';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);

                const apiProduct = await apiService.getProduct(id);
                const adaptedProduct = adaptApiProduct(apiProduct);
                setProduct(adaptedProduct);

                // Fetch related products from same category
                const related = await apiService.getProducts({
                    category: adaptedProduct.category.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[åä]/g, 'a')
                        .replace(/ø/g, 'o'),
                });
                const adaptedRelated = related
                    .map(adaptApiProduct)
                    .filter(p => p.id !== adaptedProduct.id)
                    .slice(0, 4);
                setRelatedProducts(adaptedRelated);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Kunne ikke laste produktet. Prøv igjen senere.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Spinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="product-not-found">
                        <h1>Produkt ikke funnet</h1>
                        <p>{error || 'Beklager, vi kunne ikke finne dette produktet.'}</p>
                        <Link to="/products" className="product-not-found__link">
                            Tilbake til produkter
                        </Link>
                    </div>
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

    // Note: Sustainability data is not available from backend API yet
    // This section will be simplified or removed if not needed

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Brødsmuler">
                    <Link to="/">Hjem</Link>
                    <span className="breadcrumb__separator">/</span>
                    <Link to="/products">Alle produkter</Link>
                    <span className="breadcrumb__separator">/</span>
                    <Link to={`/products/${product.category.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[åä]/g, 'a')
                        .replace(/ø/g, 'o')}`}>
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

                        </div>
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
