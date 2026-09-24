// components/menu/CategorySlider.tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '../menu.types';

interface CategorySliderProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
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
  }, [checkOverflow]);

  const scrollStep = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = direction === 'left' ? -150 : 150;
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
    <div className="relative w-full">
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
          {categories.map((category) => {
            const isActive = category.id === selectedCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`
                  group relative flex items-center gap-3 px-3 py-2
                  rounded-xl border-2 transition-all duration-300
                  snap-center shrink-0 cursor-pointer
                  ${
                    isActive
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md scale-105'
                      : 'border-[var(--color-border)]/50 bg-[var(--surface)] hover:border-[var(--primary)]/40 hover:shadow-sm hover:scale-105'
                  }
                `}
                aria-pressed={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative h-8 w-8 rounded-md overflow-hidden shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    loading={isActive ? 'eager' : 'lazy'}
                  />
                </div>

                <span
                  className={`
                    text-sm font-semibold whitespace-nowrap
                    ${
                      isActive
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  {category.name}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(22,131,199,0.4)]" />
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