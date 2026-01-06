import { Link } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { MealCard } from '../components/home/MealCards';
import { inspirationMeals } from '../mocks/meals';
import { PRODUCT_CATEGORIES } from '../mocks/products';
import './HomePage.css';

export function HomePage() {
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
                    <div className="home-categories-grid">
                        {PRODUCT_CATEGORIES.slice(0, 8).map((category) => {
                            const slug = category.toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[åä]/g, 'a')
                                .replace(/ø/g, 'o');
                            return (
                                <Link
                                    key={category}
                                    to={`/products/${slug}`}
                                    className="home-category-card"
                                >
                                    <div className="home-category-card__content">
                                        <h3 className="home-category-card__title">{category}</h3>
                                        <span className="home-category-card__arrow">→</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="home-categories-cta">
                        <Link to="/products" className="home-categories-cta__button">
                            Se alle produkter
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}