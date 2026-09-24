// components/menu/ProductSlider.tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Product, Category, Review } from '../menu.types';

interface ProductSliderProps {
  products: Product[];
  categories: Category[];
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  reviews: Review[];
}

const computeProductStats = (productId: string, reviews: Review[]) => {
  const productReviews = reviews.filter((r) => r.productId === productId);
  const total = productReviews.length;
  const avg = total > 0 ? productReviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  return { total, avg };
};

export const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  categories,
  selectedProductId,
  onSelectProduct,
  reviews,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow, products]);

  const scrollStep = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = direction === 'left' ? -180 : 180;
    el.scrollBy({ left: step, behavior: 'smooth' });
    setTimeout(checkOverflow, 100);
  };

  const startContinuousScroll = (direction: 'left' | 'right') => {
    if (intervalRef.current) return;
    scrollStep(direction);
    intervalRef.current = window.setInterval(() => scrollStep(direction), 200);
  };

  const stopContinuousScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeout(checkOverflow, 150);
  };

  return (
    <div className="relative w-full py-2">
      <div className="relative flex items-center">
        {/* Left arrow */}
        {showLeft && (
          <button
            onMouseDown={() => startContinuousScroll('left')}
            onMouseUp={stopContinuousScroll}
            onMouseLeave={stopContinuousScroll}
            onTouchStart={() => startContinuousScroll('left')}
            onTouchEnd={stopContinuousScroll}
            className="absolute left-0 z-10 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--color-border)] text-[var(--text-secondary)] shadow-lg hover:bg-[var(--card)] hover:text-[var(--text-primary)] hover:shadow-xl transition-all active:scale-90"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="hide-scrollbar flex flex-nowrap gap-3 overflow-x-auto py-3 px-6 scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
          onScroll={checkOverflow}
        >
          {products.map((product) => {
            const isActive = product.id === selectedProductId;
            const { total, avg } = computeProductStats(product.id, reviews);
            const displayRating = total > 0 ? avg : product.rating;
            const displayReviewCount = total > 0 ? total : product.reviewCount;
            const category = categories.find(c => c.id === product.categoryId);

            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className={`
                  group relative flex items-center gap-3 px-4 py-2.5
                  rounded-xl border-2 transition-all duration-300
                  snap-center shrink-0 cursor-pointer
                  min-w-[200px] max-w-[260px]
                  ${
                    isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md scale-105'
                      : 'border-[var(--color-border)]/50 bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-sm hover:scale-105'
                  }
                `}
                aria-pressed={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading={isActive ? 'eager' : 'lazy'}
                  />
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[var(--primary)]/20 to-transparent" />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0 text-left">
                  <span
                    className={`
                      text-sm font-semibold truncate
                      ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-primary)] group-hover:text-[var(--text-primary)]'}
                    `}
                  >
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-[var(--primary)] text-[var(--primary)]" />
                      <span>{displayRating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{displayReviewCount} reviews</span>
                  </div>
                  {category && (
                    <span className="text-[10px] text-[var(--text-muted)] truncate">
                      {category.name}
                    </span>
                  )}
                </div>

                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(22,131,199,0.4)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        {showRight && (
          <button
            onMouseDown={() => startContinuousScroll('right')}
            onMouseUp={stopContinuousScroll}
            onMouseLeave={stopContinuousScroll}
            onTouchStart={() => startContinuousScroll('right')}
            onTouchEnd={stopContinuousScroll}
            className="absolute right-0 z-10 flex h-8 w-8 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--color-border)] text-[var(--text-secondary)] shadow-lg hover:bg-[var(--card)] hover:text-[var(--text-primary)] hover:shadow-xl transition-all active:scale-90"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};