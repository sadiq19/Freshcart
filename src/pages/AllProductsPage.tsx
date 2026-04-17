import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, type ApiCategory } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import './AllProductsPage.css';

export function AllProductsPage() {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                setIsLoading(true);
                setError(null);
                const data = await apiService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Kunne ikke laste kategorier. Prøv igjen senere.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="all-products-page">
                <div className="container">
                    <div className="all-products-header">
                        <h1 className="all-products-title">Alle produkter</h1>
                        <p className="all-products-subtitle">
                            Utforsk vårt utvalg av ferske varer og dagligvarer
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Spinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="all-products-page">
                <div className="container">
                    <ErrorState message={error} onRetry={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    return (
        <div className="all-products-page">
            <div className="container">
                <div className="all-products-header">
                    <h1 className="all-products-title">Alle produkter</h1>
                    <p className="all-products-subtitle">
                        Utforsk vårt utvalg av ferske varer og dagligvarer
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/products/${category.slug}`}
                            className="category-card"
                        >
                            <div className="category-card__content">
                                <h2 className="category-card__title">{category.name}</h2>
                                <p className="category-card__count">
                                    {category.productCount} {category.productCount === 1 ? 'produkt' : 'produkter'}
                                </p>
                                <span className="category-card__arrow">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

