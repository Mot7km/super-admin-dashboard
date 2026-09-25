import { memo, type FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type BusinessPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const BusinessPagination: FC<BusinessPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const { isRtl } = useTranslation();

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 py-3 text-xs text-muted-foreground border-t border-border/60">
      {/* Showing entries & Page Size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-foreground font-mono">{startItem}</strong> to{' '}
          <strong className="text-foreground font-mono">{endItem}</strong> of{' '}
          <strong className="text-foreground font-mono">{totalItems}</strong> businesses
        </span>

        <div className="flex items-center gap-1.5 ml-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border/80 bg-card px-2 py-1 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-border/80 hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Previous Page"
        >
          {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer font-mono ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'hover:bg-surface-subtle text-foreground'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-border/80 hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Next Page"
        >
          {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default memo(BusinessPagination);
