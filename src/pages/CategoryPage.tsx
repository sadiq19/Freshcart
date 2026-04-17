import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ProductGrid } from '../components/product/ProductGrid';
import { useCart } from '../state/CartContext';
import { apiService, type ApiCategory, type ApiProduct } from '../services/api';
import { adaptApiProducts } from '../utils/productAdapter';
import type { Product } from '../types/product';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import './CategoryPage.css';
import './SubcategoryNav.css';

export function CategoryPage() {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
    const [category, setCategory] = useState<ApiCategory | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategoryAndProducts() {
            if (!categorySlug) return;

            try {
                setIsLoading(true);
                setError(null);

                // Fetch category and products in parallel
                const [categoryData, productsData] = await Promise.all([
                    apiService.getCategory(categorySlug),
                    apiService.getProducts({ category: categorySlug }),
                ]);

                setCategory(categoryData);
                setProducts(adaptApiProducts(productsData));
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError('Kunne ikke laste kategoridata. Prøv igjen senere.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategoryAndProducts();
    }, [categorySlug]);

    // Handle search query from URL
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery && categorySlug) {
            async function searchProducts() {
                try {
                    setIsLoading(true);
                    const productsData = await apiService.getProducts({
                        category: categorySlug,
                        search: searchQuery,
                    });
                    setProducts(adaptApiProducts(productsData));
                } catch (err) {
                    console.error('Error searching products:', err);
                } finally {
                    setIsLoading(false);
                }
            }
            searchProducts();
        }
    }, [searchParams, categorySlug]);

    // Get unique subcategories
    const subcategories = Array.from(
        new Set(products.map(p => p.subcategory).filter(Boolean))
    ) as string[];

    // Filter products by subcategory if selected
    const filteredProducts = activeSubcategory
        ? products.filter(p => p.subcategory === activeSubcategory)
        : products;

    if (isLoading) {
        return (
            <div className="category-page">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Spinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="category-page">
                <div className="container">
                    <div className="category-not-found">
                        <h1>Kategori ikke funnet</h1>
                        <p>{error || 'Beklager, vi kunne ikke finne denne kategorien.'}</p>
                        <Link to="/products" className="category-not-found__link">
                            Se alle kategorier
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <div className="container">
                {/* Category Header */}
                <div className="category-header">
                    <nav className="category-breadcrumb">
                        <Link to="/">Hjem</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link to="/products">Alle produkter</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{category.name}</span>
                    </nav>
                    <h1 className="category-title">{category.name}</h1>
                    <p className="category-description">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'produkt' : 'produkter'}
                        {activeSubcategory && ` i ${activeSubcategory}`}
                    </p>
                </div>

                {/* Subcategory Filter */}
                {subcategories.length > 0 && (
                    <nav className="subcategory-nav" aria-label="Subcategories">
                        <ul className="subcategory-nav__list">
                            <li className="subcategory-nav__item">
                                <button
                                    type="button"
                                    className={`subcategory-nav__link ${activeSubcategory === null ? 'subcategory-nav__link--active' : ''}`}
                                    onClick={() => setActiveSubcategory(null)}
                                >
                                    Alle
                                </button>
                            </li>
                            {subcategories.map((subcategory) => (
                                <li key={subcategory} className="subcategory-nav__item">
                                    <button
                                        type="button"
                                        className={`subcategory-nav__link ${activeSubcategory === subcategory ? 'subcategory-nav__link--active' : ''}`}
                                        onClick={() => setActiveSubcategory(subcategory)}
                                    >
                                        {subcategory}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                {/* Products Grid */}
                <div className="category-products">
                    {filteredProducts.length > 0 ? (
                        <ProductGrid
                            products={filteredProducts}
                            onAddToCart={addToCart}
                        />
                    ) : (
                        <div className="category-empty">
                            <p className="category-empty__text">
                                Ingen produkter funnet i denne kategorien.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

