import './CategoryNav.css';

interface CategoryNavProps {
    categories: string[];
    activeCategory: string;
    onCategorySelect: (category: string) => void;
}

export function CategoryNav({
    categories,
    activeCategory,
    onCategorySelect,
}: CategoryNavProps) {
    return (
        <nav className="category-nav" aria-label="Product categories">
            <ul className="category-nav__list">
                {categories.map((category) => (
                    <li key={category} className="category-nav__item">
                        <button
                            type="button"
                            className={`category-nav__link ${activeCategory === category ? 'category-nav__link--active' : ''
                                }`}
                            onClick={() => onCategorySelect(category)}
                            aria-current={activeCategory === category ? 'page' : undefined}
                        >
                            {category}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
