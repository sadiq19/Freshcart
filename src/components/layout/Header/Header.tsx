import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../state/CartContext';
import { useUser } from '../../../state/UserContext';
import { CartPreview } from '../CartPreview';
import './Header.css';

export function Header() {
    const { totalItems, totalPrice } = useCart();
    const { user, isAuthenticated, logout } = useUser();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCartClick = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to products page with search query
            // The search will be handled by the AllProductsPage or CategoryPage
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <header className="header">
                <div className="header__container">
                    {/* Logo */}
                    <Link to="/products" className="header__logo" aria-label="FreshCart - Alle produkter">
                        <img
                            src="/freshcart-Logo.jpg"
                            alt="FreshCart logo"
                            className="header__logo-img"
                        />
                    </Link>

                    {/* Search */}
                    <form
                        className={`header__search ${isSearchFocused ? 'header__search--focused' : ''}`}
                        onSubmit={handleSearch}
                    >
                        <svg
                            className="header__search-icon"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="search"
                            className="header__search-input"
                            placeholder="Søk etter varer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            aria-label="Søk etter produkter"
                        />
                    </form>

                    {/* Navigation */}
                    <nav className="header__nav">
                        <Link to="/" className="header__nav-link">Hjem</Link>
                        <Link to="/products" className="header__nav-link">Produkter</Link>
                        <Link to="/recipes" className="header__nav-link">Oppskrifter</Link>
                    </nav>

                    {/* Actions */}
                    <div className="header__actions">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="header__action-link">
                                    Logg inn
                                </Link>
                                <Link to="/register" className="header__action-btn">
                                    Bli kunde
                                </Link>
                            </>
                        ) : (
                            <div className="header__user-menu" ref={userMenuRef}>
                                <button
                                    className="header__user-button"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    aria-expanded={showUserMenu}
                                    aria-haspopup="true"
                                >
                                    <span className="header__user-avatar">
                                        {user?.firstName?.charAt(0) || 'U'}
                                    </span>
                                    <span className="header__user-name">
                                        {user?.firstName || 'Bruker'}
                                    </span>
                                    <svg
                                        className={`header__user-chevron ${showUserMenu ? 'open' : ''}`}
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                    >
                                        <path
                                            d="M6 9l6 6 6-6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                {showUserMenu && (
                                    <div className="header__user-dropdown">
                                        <div className="header__dropdown-header">
                                            <span className="header__dropdown-name">
                                                {user?.firstName} {user?.lastName}
                                            </span>
                                            <span className="header__dropdown-email">
                                                {user?.email}
                                            </span>
                                        </div>
                                        <div className="header__dropdown-divider" />
                                        <Link
                                            to="/profile"
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                            </svg>
                                            Min profil
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Mine bestillinger
                                        </Link>
                                        <Link
                                            to="/addresses"
                                            className="header__dropdown-item"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none" />
                                                <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                            Adresser
                                        </Link>
                                        <div className="header__dropdown-divider" />
                                        <button
                                            className="header__dropdown-item header__dropdown-item--danger"
                                            onClick={handleLogout}
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Logg ut
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cart button */}
                        <button
                            type="button"
                            className="header__cart"
                            onClick={handleCartClick}
                            aria-label={`Handlekurv, ${totalItems} ${totalItems === 1 ? 'vare' : 'varer'}`}
                        >
                            <svg
                                className="header__cart-icon"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M6 6h15l-1.5 9h-12z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M6 6L5 3H2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle cx="9" cy="20" r="1.5" fill="currentColor" />
                                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="header__cart-badge">{totalItems}</span>
                            )}
                            {totalItems > 0 && (
                                <span className="header__cart-total">
                                    {formatPrice(totalPrice)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>
            <CartPreview
                isOpen={isCartOpen}
                onClose={handleCloseCart}
            />
        </>
    );
}
