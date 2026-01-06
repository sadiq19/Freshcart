import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: product.price % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(product.price);

    // Calculate unit price for display (price per kg/l when applicable)
    const getUnitPrice = () => {
        if (product.unit.includes('kg') || product.unit.includes('liter') || product.unit.includes('l')) {
            return `${formattedPrice}/${product.unit.includes('kg') ? 'kg' : product.unit.includes('liter') ? 'l' : 'l'}`;
        }
        return null;
    };

    const unitPrice = getUnitPrice();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart?.(product);
    };

    return (
        <article className="product-card">
            <Link to={`/product/${product.id}`} className="product-card__link">
                <div className="product-card__image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__image"
                        loading="lazy"
                    />
                    {product.isOrganic && (
                        <span className="product-card__badge product-card__badge--organic">
                            Økologisk
                        </span>
                    )}
                    {product.isLocal && (
                        <span className="product-card__badge product-card__badge--local">
                            Norsk
                        </span>
                    )}
                    {!product.inStock && (
                        <span className="product-card__badge product-card__badge--out-of-stock">
                            Utsolgt
                        </span>
                    )}
                </div>

                <div className="product-card__content">
                    <div className="product-card__pricing">
                        <span className="product-card__price">{formattedPrice}</span>
                        {unitPrice && (
                            <span className="product-card__unit-price">{unitPrice}</span>
                        )}
                    </div>
                    <h3 className="product-card__name">{product.name}</h3>
                    <span className="product-card__unit">{product.unit}</span>
                </div>
            </Link>

            <button
                type="button"
                className="product-card__add-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-label={`Legg ${product.name} i handlekurv`}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    aria-hidden="true"
                >
                    <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </article>
    );
}
