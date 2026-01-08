import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { MealCard } from '../components/home/MealCards';
import { inspirationMeals } from '../mocks/meals';
import { apiService, type ApiCategory } from '../services/api';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import './HomePage.css';

export function HomePage() {
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

    return (
        <>
            <Hero />
            <div className="container">
                {/* Inspiration Meal Cards Section */}
                <section className="home-meals-section">
                    <h2 className="home-section__title">Inspirasjon til middag</h2>
                    <p className="home-section__subtitle">
                        Oppdag nye smaker og oppskrifter
                    </p>
                    <div className="home-meals-grid">
                        {inspirationMeals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                id={meal.id}
                                title={meal.title}
                                description={meal.description}
                                image={meal.image}
                                link={meal.link}
                            />
                        ))}
                    </div>
                </section>

                {/* Category Entry Points */}
                <section className="home-categories-section">
                    <div className="section-header">
                        <h2 className="home-section__title">Utforsk våre kategorier</h2>
                        <p className="home-section__subtitle">
                            Alt du trenger for et godt måltid
                        </p>
                    </div>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Spinner size="lg" />
                        </div>
                    ) : error ? (
                        <ErrorState message={error} onRetry={() => window.location.reload()} />
                    ) : (
                        <>
                            <div className="home-categories-grid">
                                {categories.slice(0, 8).map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/products/${category.slug}`}
                                        className="home-category-card"
                                    >
                                        <div className="home-category-card__content">
                                            <h3 className="home-category-card__title">{category.name}</h3>
                                            <span className="home-category-card__arrow">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="home-categories-cta">
                                <Link to="/products" className="home-categories-cta__button">
                                    Se alle produkter
                                </Link>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}