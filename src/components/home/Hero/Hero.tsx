import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.png';
import './Hero.css';

interface HeroProps {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
}

export function Hero({
    title = 'Fresh groceries, delivered with care',
    subtitle = 'Simple, honest, everyday.',
    imageUrl = heroBg,
}: HeroProps) {
    return (
        <section className="hero">
            <div
                className="hero__background"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden="true"
            />
            <div className="hero__overlay" aria-hidden="true" />
            <div className="hero__content">
                <h1 className="hero__title">{title}</h1>
                <p className="hero__subtitle">{subtitle}</p>
                <div className="hero__cta">
                    <Link to="/products" className="hero__button">
                        Start å handle
                    </Link>
                </div>
            </div>
        </section>
    );
}
