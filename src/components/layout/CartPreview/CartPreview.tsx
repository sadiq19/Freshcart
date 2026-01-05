import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../state/CartContext';
import './CartPreview.css';

interface CartPreviewProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartPreview({ isOpen, onClose }: CartPreviewProps) {
    const navigate = useNavigate();
    const {
        items,
        totalItems,
        totalPrice,
        deliveryFee,
        minimumOrderAmount,
        updateQuantity,
        removeFromCart
    } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const amountUntilFreeDelivery = 500 - totalPrice;
    const hasMinimumOrder = totalPrice >= minimumOrderAmount;

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            <div
                className={`cart-preview-backdrop ${isOpen ? 'cart-preview-backdrop--open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                className={`cart-preview-panel ${isOpen ? 'cart-preview-panel--open' : ''}`}
                aria-label="Handlekurv"
            >
                <div className="cart-preview__header">
                    <h2 className="cart-preview__title">
                        Handlekurv
                        {totalItems > 0 && (
                            <span className="cart-preview__count">({totalItems})</span>
                        )}
                    </h2>
                    <button
                        type="button"
                        className="cart-preview__close-btn"
                        onClick={onClose}
                        aria-label="Lukk handlekurv"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-preview__empty">
                        <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
                            <path
                                d="M6 6h15l-1.5 9h-12z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 6L5 3H2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                            <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                        </svg>
                        <p className="cart-preview__empty-title">Handlekurven er tom</p>
                        <p className="cart-preview__empty-text">
                            Legg til varer for å komme i gang
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Delivery progress bar */}
                        {amountUntilFreeDelivery > 0 && (
                            <div className="cart-preview__delivery-progress">
                                <div className="delivery-progress__text">
                                    <span>Gratis levering om {formatPrice(amountUntilFreeDelivery)}</span>
                                </div>
                                <div className="delivery-progress__bar">
                                    <div
                                        className="delivery-progress__fill"
                                        style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {amountUntilFreeDelivery <= 0 && (
                            <div className="cart-preview__free-delivery">
                                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                    <path
                                        d="M9 12l2 2 4-4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                                <span>Du har gratis levering!</span>
                            </div>
                        )}

                        {/* Cart items */}
                        <ul className="cart-preview__items">
                            {items.map((item) => (
                                <li key={item.product.id} className="cart-item">
                                    <div className="cart-item__image">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="cart-item__details">
                                        <h4 className="cart-item__name">{item.product.name}</h4>
                                        <span className="cart-item__unit">{item.product.unit}</span>
                                        <span className="cart-item__price">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                    <div className="cart-item__actions">
                                        <button
                                            type="button"
                                            className="cart-item__qty-btn"
                                            onClick={() => {
                                                if (item.quantity === 1) {
                                                    removeFromCart(item.product.id);
                                                } else {
                                                    updateQuantity(item.product.id, item.quantity - 1);
                                                }
                                            }}
                                            aria-label={item.quantity === 1 ? 'Fjern fra kurv' : 'Reduser antall'}
                                        >
                                            {item.quantity === 1 ? (
                                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                                    <path
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                                    <path
                                                        d="M5 12h14"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                        <span className="cart-item__quantity">{item.quantity}</span>
                                        <button
                                            type="button"
                                            className="cart-item__qty-btn"
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            aria-label="Øk antall"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                                                <path
                                                    d="M12 5v14M5 12h14"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Cart footer */}
                        <div className="cart-preview__footer">
                            <div className="cart-preview__summary">
                                <div className="cart-summary__row">
                                    <span>Varer ({totalItems})</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Levering</span>
                                    <span>{deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee)}</span>
                                </div>
                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Totalt</span>
                                    <span>{formatPrice(totalPrice + deliveryFee)}</span>
                                </div>
                            </div>

                            {!hasMinimumOrder && (
                                <p className="cart-preview__minimum">
                                    Minimumsordre: {formatPrice(minimumOrderAmount)}.
                                    Du trenger {formatPrice(minimumOrderAmount - totalPrice)} til.
                                </p>
                            )}

                            <button
                                type="button"
                                className="cart-preview__checkout-btn"
                                onClick={handleCheckout}
                                disabled={!hasMinimumOrder}
                            >
                                Gå til kassen
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}