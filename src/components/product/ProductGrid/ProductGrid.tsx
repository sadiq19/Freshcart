import type { Product } from '@/types/product';
import { ProductCard } from '../ProductCard';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import './ProductGrid.css';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    error?: string | null;
    onAddToCart?: (product: Product) => void;
    onRetry?: () => void;
}

export function ProductGrid({
    products,
    isLoading = false,
    error = null,
    onAddToCart,
    onRetry,
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="product-grid__state">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-grid__state">
                <ErrorState message={error} onRetry={onRetry} />
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="product-grid__state">
                <EmptyState
                    title="No products found"
                    message="Try adjusting your search or browse our categories."
                />
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}
