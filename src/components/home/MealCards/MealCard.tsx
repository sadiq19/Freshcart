import { Link } from 'react-router-dom';
import './MealCard.css';

interface MealCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    link?: string;
}

export function MealCard({ id, title, description, image, link = '#' }: MealCardProps) {
    return (
        <Link to={link} className="meal-card">
            <div className="meal-card__image-wrapper">
                <img 
                    src={image} 
                    alt={title}
                    className="meal-card__image"
                    loading="lazy"
                />
                <div className="meal-card__overlay" />
            </div>
            <div className="meal-card__content">
                <h3 className="meal-card__title">{title}</h3>
                <p className="meal-card__description">{description}</p>
            </div>
        </Link>
    );
}

