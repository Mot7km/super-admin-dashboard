import { Star, Trash2, Search } from 'lucide-react';
import type { Review, Product } from '../menu.types';

interface ReviewListProps {
  reviews: Review[];
  selectedProduct: Product | null;
  avgRating: number;
  totalReviews: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDelete: (id: string) => void;
}

const getStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <>
      {[...Array(full)].map((_, i) => (
        <Star key={`full-${i}`} className="h-3 w-3 fill-amber-400 text-amber-400" />
      ))}
      {half === 1 && (
        <Star key="half" className="h-3 w-3 fill-amber-400 text-amber-400" />
      )}
      {[...Array(empty)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-3 w-3 text-amber-400" />
      ))}
    </>
  );
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  selectedProduct,
  avgRating,
  totalReviews,
  searchQuery,
  onSearchChange,
  onDelete,
}) => {
  if (!selectedProduct) return null;

  return (
    <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-3 shadow-sm sm:p-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            {selectedProduct.name} – Reviews
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs sm:text-sm text-[var(--text-muted)]">
            <span>{avgRating.toFixed(1)} ★</span>
            <span>•</span>
            <span>{totalReviews} total</span>
          </div>
        </div>
        <div className="relative w-full sm:w-56 md:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reviews..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-6 text-center text-xs sm:text-sm text-[var(--text-muted)]">
            {searchQuery
              ? 'No reviews match your search.'
              : 'No reviews for this product yet.'}
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-4 transition-all hover:shadow-sm"
            >
              <div className="flex flex-row items-start gap-2 sm:gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate max-w-[100px] sm:max-w-none">
                      {review.userName}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                      • {formatDate(review.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getStars(review.rating)}
                    <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">({review.rating}.0)</span>
                  </div>
                  <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] break-words">
                    {review.comment}
                  </p>
                </div>

                <button
                  onClick={() => onDelete(review.id)}
                  className="mt-1 flex-shrink-0 cursor-pointer rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-500 transition-all hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                  aria-label="Delete review"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};