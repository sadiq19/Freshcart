import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { useUser } from '../state/UserContext';
import './CheckoutPage.css';

type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation';

interface DeliveryFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    deliveryInstructions: string;
}

const DELIVERY_SLOTS = [
    { id: '1', date: 'I dag', time: '18:00 - 21:00', price: 79 },
    { id: '2', date: 'I dag', time: '21:00 - 23:00', price: 49 },
    { id: '3', date: 'I morgen', time: '08:00 - 12:00', price: 0 },
    { id: '4', date: 'I morgen', time: '12:00 - 16:00', price: 0 },
    { id: '5', date: 'I morgen', time: '16:00 - 20:00', price: 0 },
    { id: '6', date: 'Overmorgen', time: '08:00 - 12:00', price: 0 },
];

export function CheckoutPage() {
    const { items, totalItems, totalPrice, deliveryFee, clearCart, minimumOrderAmount, updateQuantity, removeFromCart } = useCart();
    const { user } = useUser();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [formData, setFormData] = useState<DeliveryFormData>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        postalCode: '',
        city: '',
        deliveryInstructions: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'vipps' | 'card' | 'klarna'>('vipps');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const selectedSlotData = DELIVERY_SLOTS.find(s => s.id === selectedSlot);
    const slotPrice = selectedSlotData?.price || 0;
    const finalDeliveryFee = deliveryFee + slotPrice;
    const grandTotal = totalPrice + finalDeliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.firstName && formData.lastName && formData.email &&
            formData.phone && formData.address && formData.postalCode && formData.city;
    };

    const handleNextStep = () => {
        if (currentStep === 'cart') {
            setCurrentStep('delivery');
        } else if (currentStep === 'delivery' && selectedSlot && isFormValid()) {
            setCurrentStep('payment');
        } else if (currentStep === 'payment') {
            handlePlaceOrder();
        }
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newOrderId = `ODA-${Date.now()}`;
        setOrderId(newOrderId);
        clearCart();
        setCurrentStep('confirmation');
        setIsProcessing(false);
    };

    if (items.length === 0 && currentStep !== 'confirmation') {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="checkout-empty">
                        <svg viewBox="0 0 24 24" width="64" height="64">
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
                        <h1>Handlekurven er tom</h1>
                        <p>Legg til varer for å fortsette til kassen</p>
                        <Link to="/" className="checkout-empty__btn">
                            Fortsett å handle
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (currentStep === 'confirmation') {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="checkout-confirmation">
                        <div className="confirmation-icon">
                            <svg viewBox="0 0 24 24" width="64" height="64">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1>Takk for din bestilling!</h1>
                        <p className="confirmation-order-id">Ordrenummer: {orderId}</p>
                        <p className="confirmation-message">
                            Vi har sendt en bekreftelse til {formData.email}.
                            Du kan følge leveringen i sanntid når sjåføren er på vei.
                        </p>
                        <div className="confirmation-delivery">
                            <h3>Leveringsdetaljer</h3>
                            <p>{formData.firstName} {formData.lastName}</p>
                            <p>{formData.address}</p>
                            <p>{formData.postalCode} {formData.city}</p>
                            <p className="delivery-time">
                                {selectedSlotData?.date} kl. {selectedSlotData?.time}
                            </p>
                        </div>
                        <div className="confirmation-actions">
                            <Link to={`/orders/${orderId}`} className="btn btn--primary">
                                Spor leveringen
                            </Link>
                            <Link to="/" className="btn btn--secondary">
                                Fortsett å handle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Progress steps */}
                <div className="checkout-progress">
                    <div className={`progress-step ${currentStep === 'cart' ? 'active' : ''} ${currentStep !== 'cart' ? 'completed' : ''}`}>
                        <span className="progress-step__number">1</span>
                        <span className="progress-step__label">Handlekurv</span>
                    </div>
                    <div className="progress-line" />
                    <div className={`progress-step ${currentStep === 'delivery' ? 'active' : ''} ${currentStep === 'payment' ? 'completed' : ''}`}>
                        <span className="progress-step__number">2</span>
                        <span className="progress-step__label">Levering</span>
                    </div>
                    <div className="progress-line" />
                    <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`}>
                        <span className="progress-step__number">3</span>
                        <span className="progress-step__label">Betaling</span>
                    </div>
                </div>

                <div className="checkout-layout">
                    {/* Main content */}
                    <div className="checkout-main">
                        {/* Step 1: Cart Review */}
                        {currentStep === 'cart' && (
                            <div className="checkout-section">
                                <h2 className="checkout-section__title">Din handlekurv</h2>
                                <ul className="checkout-items">
                                    {items.map(item => (
                                        <li key={item.product.id} className="checkout-item">
                                            <div className="checkout-item__image">
                                                <img src={item.product.image} alt={item.product.name} />
                                            </div>
                                            <div className="checkout-item__details">
                                                <h4>{item.product.name}</h4>
                                                <span className="checkout-item__unit">{item.product.unit}</span>
                                            </div>
                                            <div className="checkout-item__quantity-controls">
                                                <button
                                                    type="button"
                                                    className="checkout-item__qty-btn checkout-item__qty-btn--minus"
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
                                                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
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
                                                        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                                            <path
                                                                d="M5 12h14"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                                <span className="checkout-item__quantity-value">{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    className="checkout-item__qty-btn checkout-item__qty-btn--plus"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    aria-label="Øk antall"
                                                >
                                                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                                        <path
                                                            d="M12 5v14M5 12h14"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="checkout-item__price">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Step 2: Delivery */}
                        {currentStep === 'delivery' && (
                            <>
                                <div className="checkout-section">
                                    <h2 className="checkout-section__title">Leveringsadresse</h2>
                                    <form className="delivery-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="firstName">Fornavn *</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lastName">Etternavn *</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="email">E-post *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Telefon *</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Adresse *</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Gateadresse og husnummer"
                                                required
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group form-group--small">
                                                <label htmlFor="postalCode">Postnummer *</label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    maxLength={4}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="city">Sted *</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="deliveryInstructions">Leveringsinstruksjoner</label>
                                            <textarea
                                                id="deliveryInstructions"
                                                name="deliveryInstructions"
                                                value={formData.deliveryInstructions}
                                                onChange={handleInputChange}
                                                placeholder="F.eks. ringekode, etasje, eller andre instruksjoner"
                                                rows={3}
                                            />
                                        </div>
                                    </form>
                                </div>

                                <div className="checkout-section">
                                    <h2 className="checkout-section__title">Velg leveringstid</h2>
                                    <div className="delivery-slots">
                                        {DELIVERY_SLOTS.map(slot => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                className={`delivery-slot ${selectedSlot === slot.id ? 'selected' : ''}`}
                                                onClick={() => setSelectedSlot(slot.id)}
                                            >
                                                <span className="delivery-slot__date">{slot.date}</span>
                                                <span className="delivery-slot__time">{slot.time}</span>
                                                <span className="delivery-slot__price">
                                                    {slot.price === 0 ? 'Gratis' : `+${formatPrice(slot.price)}`}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3: Payment */}
                        {currentStep === 'payment' && (
                            <div className="checkout-section">
                                <h2 className="checkout-section__title">Velg betalingsmåte</h2>
                                <div className="payment-methods">
                                    <button
                                        type="button"
                                        className={`payment-method ${paymentMethod === 'vipps' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('vipps')}
                                    >
                                        <div className="payment-method__icon payment-method__icon--vipps">
                                            Vipps
                                        </div>
                                        <div className="payment-method__info">
                                            <span className="payment-method__name">Vipps</span>
                                            <span className="payment-method__desc">Betal enkelt med Vipps</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="payment-method__icon payment-method__icon--card">
                                            💳
                                        </div>
                                        <div className="payment-method__info">
                                            <span className="payment-method__name">Kort</span>
                                            <span className="payment-method__desc">Visa, Mastercard</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className={`payment-method ${paymentMethod === 'klarna' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('klarna')}
                                    >
                                        <div className="payment-method__icon payment-method__icon--klarna">
                                            Klarna
                                        </div>
                                        <div className="payment-method__info">
                                            <span className="payment-method__name">Klarna</span>
                                            <span className="payment-method__desc">Betal senere eller del opp</span>
                                        </div>
                                    </button>
                                </div>

                                <div className="order-review">
                                    <h3>Leveringsdetaljer</h3>
                                    <p>{formData.firstName} {formData.lastName}</p>
                                    <p>{formData.address}</p>
                                    <p>{formData.postalCode} {formData.city}</p>
                                    <p className="delivery-time">
                                        {selectedSlotData?.date} kl. {selectedSlotData?.time}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar summary */}
                    <aside className="checkout-sidebar">
                        <div className="checkout-summary">
                            <h3 className="checkout-summary__title">Ordresammendrag</h3>

                            <div className="checkout-summary__row">
                                <span>Varer ({totalItems})</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>

                            <div className="checkout-summary__row">
                                <span>Levering</span>
                                <span>
                                    {finalDeliveryFee === 0 ? 'Gratis' : formatPrice(finalDeliveryFee)}
                                </span>
                            </div>

                            {selectedSlotData && slotPrice > 0 && (
                                <div className="checkout-summary__row checkout-summary__row--sub">
                                    <span>Ekspresslevering</span>
                                    <span>+{formatPrice(slotPrice)}</span>
                                </div>
                            )}

                            <div className="checkout-summary__row checkout-summary__row--total">
                                <span>Totalt</span>
                                <span>{formatPrice(grandTotal)}</span>
                            </div>

                            <button
                                type="button"
                                className="checkout-summary__btn"
                                onClick={handleNextStep}
                                disabled={
                                    (currentStep === 'delivery' && (!selectedSlot || !isFormValid())) ||
                                    (totalPrice < minimumOrderAmount) ||
                                    isProcessing
                                }
                            >
                                {isProcessing ? (
                                    <span className="loading-spinner" />
                                ) : currentStep === 'cart' ? (
                                    'Gå til levering'
                                ) : currentStep === 'delivery' ? (
                                    'Gå til betaling'
                                ) : (
                                    `Betal ${formatPrice(grandTotal)}`
                                )}
                            </button>

                            {totalPrice < minimumOrderAmount && (
                                <p className="checkout-summary__minimum">
                                    Minimumsordre: {formatPrice(minimumOrderAmount)}
                                </p>
                            )}

                            {currentStep !== 'cart' && (
                                <button
                                    type="button"
                                    className="checkout-summary__back"
                                    onClick={() => {
                                        if (currentStep === 'delivery') setCurrentStep('cart');
                                        if (currentStep === 'payment') setCurrentStep('delivery');
                                    }}
                                >
                                    ← Tilbake
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
