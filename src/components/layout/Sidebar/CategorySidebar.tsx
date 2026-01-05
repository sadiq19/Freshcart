import { useState } from 'react';
import { PRODUCT_CATEGORIES, mockProducts } from '../../../mocks/products';
import './CategorySidebar.css';

interface CategorySidebarProps {
    activeCategory: string;
    onCategorySelect: (category: string) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

// Count products per category
const getCategoryCount = (category: string): number => {
    if (category === 'Alle') {
        return mockProducts.length;
    }
    return mockProducts.filter(p => p.category === category).length;
};

export function CategorySidebar({ 
    activeCategory, 
    onCategorySelect, 
    isOpen = true,
    onClose 
}: CategorySidebarProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const handleCategoryClick = (category: string) => {
        onCategorySelect(category);
        if (onClose) {
            onClose();
        }
    };

    const toggleExpand = (category: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const allCategories = ['Alle', ...PRODUCT_CATEGORIES];

    return (
        <>
            {/* Mobile backdrop */}
            <div 
                className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            
            <aside className={`category-sidebar ${isOpen ? 'category-sidebar--open' : ''}`}>
                <div className="category-sidebar__header">
                    <h2 className="category-sidebar__title">Kategorier</h2>
                    {onClose && (
                        <button 
                            type="button" 
                            className="category-sidebar__close"
                            onClick={onClose}
                            aria-label="Lukk kategorimeny"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path 
                                    d="M18 6L6 18M6 6l12 12" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                <nav className="category-sidebar__nav">
                    <ul className="category-list">
                        {allCategories.map((category) => {
                            const count = getCategoryCount(category);
                            const isActive = activeCategory === category;
                            const hasSubcategories = category !== 'Alle' && count > 5;
                            const isExpanded = expandedCategories.includes(category);

                            return (
                                <li key={category} className="category-list__item">
                                    <button
                                        type="button"
                                        className={`category-list__link ${isActive ? 'category-list__link--active' : ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        <span className="category-list__name">{category}</span>
                                        <span className="category-list__count">{count}</span>
                                        {hasSubcategories && (
                                            <button
                                                type="button"
                                                className={`category-list__expand ${isExpanded ? 'expanded' : ''}`}
                                                onClick={(e) => toggleExpand(category, e)}
                                                aria-label={isExpanded ? 'Skjul underkategorier' : 'Vis underkategorier'}
                                            >
                                                <svg viewBox="0 0 24 24" width="16" height="16">
                                                    <path 
                                                        d="M9 18l6-6-6-6" 
                                                        stroke="currentColor" 
                                                        strokeWidth="2" 
                                                        fill="none"
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Quick filters */}
                <div className="category-sidebar__filters">
                    <h3 className="category-sidebar__subtitle">Filtrer</h3>
                    <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span className="filter-checkbox__mark" />
                        <span className="filter-checkbox__label">Økologisk</span>
                    </label>
                    <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span className="filter-checkbox__mark" />
                        <span className="filter-checkbox__label">Norsk</span>
                    </label>
                    <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span className="filter-checkbox__mark" />
                        <span className="filter-checkbox__label">På tilbud</span>
                    </label>
                    <label className="filter-checkbox">
                        <input type="checkbox" />
                        <span className="filter-checkbox__mark" />
                        <span className="filter-checkbox__label">Lavt klimaavtrykk</span>
                    </label>
                </div>
            </aside>
        </>
    );
}

