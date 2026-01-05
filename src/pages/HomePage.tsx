import { useState, useMemo } from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryNav } from '../components/home/CategoryNav';
import { ProductGrid } from '../components/product/ProductGrid';
import { useCart } from '../state/CartContext';
import { mockProducts, PRODUCT_CATEGORIES } from '../mocks/products';
import type { Product } from '../types/product';

const CATEGORIES = ['Alle', ...PRODUCT_CATEGORIES.slice(0, 8)]; // Show first 8 categories plus 'All'

function filterProducts(products: Product[], query: string, category: string): Product[] {
    let filteredProducts = products;

    // Filter by category first (if not 'Alle' and not empty)
    if (category && category !== 'Alle') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Then filter by search query (if provided)
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery) {
        filteredProducts = filteredProducts.filter((product) => {
            const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
            const categoryMatch = product.category.toLowerCase().includes(normalizedQuery);
            const descriptionMatch = product.description?.toLowerCase().includes(normalizedQuery);
            const tagsMatch = product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery));
            return nameMatch || categoryMatch || descriptionMatch || tagsMatch;
        });
    }

    return filteredProducts;
}

export function HomePage() {
    const { addToCart } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Alle');

    const filteredProducts = useMemo(
        () => filterProducts(mockProducts, searchQuery, activeCategory),
        [searchQuery, activeCategory]
    );

    const handleCategorySelect = (category: string) => {
        setActiveCategory(category);
        if (category === 'Alle') {
            setSearchQuery('');
        } else {
            // Don't set searchQuery to category name, let filtering happen via activeCategory
            setSearchQuery('');
        }
    };


    return (
        <>
            <Hero />
            <div className="container">
                <CategoryNav
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onCategorySelect={handleCategorySelect}
                />
                <section className="products-section">
                    {searchQuery || activeCategory !== 'Alle' ? (
                        <>
                            <h2 className="products-section__title">
                                {activeCategory && activeCategory !== 'Alle'
                                    ? activeCategory
                                    : 'Søkeresultater'}
                            </h2>
                            <ProductGrid
                                products={filteredProducts}
                                onAddToCart={addToCart}
                            />
                        </>
                    ) : (
                        <>
                            <div className="editorial-section">
                                <h2 className="products-section__title">
                                    Populært denne uken
                                </h2>
                                <ProductGrid
                                    products={mockProducts.slice(0, 4)}
                                    onAddToCart={addToCart}
                                />
                            </div>
                            <div className="editorial-section">
                                <h2 className="products-section__title">
                                    Fersk fra gården
                                </h2>
                                <ProductGrid
                                    products={mockProducts.filter((p) =>
                                        ['Frukt og grønt'].includes(p.category)
                                    ).slice(0, 4)}
                                    onAddToCart={addToCart}
                                />
                            </div>
                            <div className="editorial-section">
                                <h2 className="products-section__title">
                                    Frokost essentials
                                </h2>
                                <ProductGrid
                                    products={mockProducts.filter((p) =>
                                        ['Meieri, ost og egg', 'Bakeri og konditori'].includes(p.category)
                                    ).slice(0, 4)}
                                    onAddToCart={addToCart}
                                />
                            </div>
                            <div className="editorial-section">
                                <h2 className="products-section__title">
                                    Bærekraftig
                                </h2>
                                <ProductGrid
                                    products={mockProducts.filter((p) =>
                                        p.sustainability && p.sustainability.sustainabilityScore <= 2
                                    ).slice(0, 4)}
                                    onAddToCart={addToCart}
                                />
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
}