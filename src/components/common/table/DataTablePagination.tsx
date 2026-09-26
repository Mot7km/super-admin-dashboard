import { memo, type FC } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const DataTablePagination: FC<DataTablePaginationProps> = memo(({
  page,
  pageSize,
  total,
  onChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const { isRtl } = useTranslation();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const fromIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex = Math.min(page * pageSize, total);

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const FirstIcon = isRtl ? ChevronsRight : ChevronsLeft;
  const LastIcon = isRtl ? ChevronsLeft : ChevronsRight;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1 text-xs">
      {/* Telemetry info & Page Size */}
      <div className="flex items-center gap-3 text-muted-foreground order-2 sm:order-1">
        <span>
          {isRtl ? (
            <>
              عرض <strong className="font-mono text-foreground font-bold">{fromIndex}</strong> إلى{' '}
              <strong className="font-mono text-foreground font-bold">{toIndex}</strong> من إجمالي{' '}
              <strong className="font-mono text-foreground font-bold">{total}</strong> عنصر
            </>
          ) : (
            <>
              Showing <strong className="font-mono text-foreground font-bold">{fromIndex}</strong> to{' '}
              <strong className="font-mono text-foreground font-bold">{toIndex}</strong> of{' '}
              <strong className="font-mono text-foreground font-bold">{total}</strong> entries
            </>
          )}
        </span>

        <span className="text-border">•</span>

        {/* Page size dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground/80">
            {isRtl ? 'لكل صفحة:' : 'Per page:'}
          </span>
          <select
            value={pageSize}
            onChange={(e) => onChange(1, Number(e.target.value))}
            className="rounded-lg border border-border/80 bg-surface-subtle/80 px-2 py-1 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* First Page */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(1, pageSize)}
          className="p-1.5 rounded-lg border border-border/70 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="First page"
        >
          <FirstIcon className="h-3.5 w-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1, pageSize)}
          className="p-1.5 rounded-lg border border-border/70 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="Previous page"
        >
          <PrevIcon className="h-3.5 w-3.5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((pNum, idx) => {
            if (pNum === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 text-muted-foreground/60">
                  ...
                </span>
              );
            }

            const isCurrent = pNum === page;
            return (
              <button
                key={`page-${pNum}`}
                type="button"
                onClick={() => onChange(Number(pNum), pageSize)}
                className={`h-7 w-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground border border-border/60 bg-card'
                }`}
              >
                {pNum}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1, pageSize)}
          className="p-1.5 rounded-lg border border-border/70 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="Next page"
        >
          <NextIcon className="h-3.5 w-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(totalPages, pageSize)}
          className="p-1.5 rounded-lg border border-border/70 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
          aria-label="Last page"
        >
          <LastIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

DataTablePagination.displayName = 'DataTablePagination';
