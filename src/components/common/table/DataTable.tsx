import { useState, useMemo, useCallback, type FC } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  Check,
  Minus,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTablePagination } from './DataTablePagination';
import { DataTableSkeleton } from './DataTableSkeleton';
import type {
  DataTableProps,
  DataTableSortDirection,
  DataTableDensity,
} from './table.types';

export const DataTable = <TData,>({
  data,
  columns,
  keyExtractor,
  title,
  subtitle,
  search,
  hideToolbar = false,
  filters = [],
  primaryAction,
  secondaryActions,
  enableSelection = false,
  selectedRowKeys: controlledSelectedKeys,
  onSelectionChange,
  batchActions = [],
  sortKey: controlledSortKey,
  sortDirection: controlledSortDirection,
  onSortChange,
  pagination = {
    page: 1,
    pageSize: 10,
    onChange: () => {},
  },
  isLoading = false,
  emptyState,
  onRowClick,
  rowClassName,
  onExport,
  enableDensitySwitcher = true,
  initialDensity = 'normal',
  totalCountBadge,
}: DataTableProps<TData>): ReturnType<FC> => {
  const { isRtl } = useTranslation();

  // Internal states when uncontrolled
  const [internalSearch, setInternalSearch] = useState('');
  const [internalDensity, setInternalDensity] = useState<DataTableDensity>(initialDensity);
  const [internalSortKey, setInternalSortKey] = useState<string | undefined>(undefined);
  const [internalSortDir, setInternalSortDir] = useState<DataTableSortDirection>('asc');
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState<number>(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(10);

  // Search query resolution
  const isSearchConfigObject = typeof search === 'object' && search !== null;
  const isSearchControlled = isSearchConfigObject && search.value !== undefined && search.onChange !== undefined;
  const currentSearch = (isSearchControlled && isSearchConfigObject ? search.value : internalSearch) || '';
  const handleSearchChange = useCallback((val: string) => {
    if (isSearchControlled && isSearchConfigObject) {
      search.onChange?.(val);
    } else {
      setInternalSearch(val);
      setInternalPage(1);
    }
  }, [isSearchControlled, isSearchConfigObject, search]);

  // Sorting resolution
  const isSortControlled = controlledSortKey !== undefined;
  const activeSortKey = isSortControlled ? controlledSortKey : internalSortKey;
  const activeSortDir = isSortControlled ? (controlledSortDirection || 'asc') : internalSortDir;

  const handleSortToggle = (colId: string) => {
    let nextDir: DataTableSortDirection = 'asc';
    if (activeSortKey === colId) {
      nextDir = activeSortDir === 'asc' ? 'desc' : 'asc';
    }

    if (isSortControlled) {
      onSortChange?.(colId, nextDir);
    } else {
      setInternalSortKey(colId);
      setInternalSortDir(nextDir);
    }
  };

  // Selection resolution
  const isSelectionControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isSelectionControlled ? controlledSelectedKeys : internalSelectedKeys;

  const setSelectedKeysInternal = useCallback((newKeys: string[]) => {
    if (isSelectionControlled) {
      const selectedRows = data.filter((row) => newKeys.includes(keyExtractor(row)));
      onSelectionChange?.(newKeys, selectedRows);
    } else {
      setInternalSelectedKeys(newKeys);
      const selectedRows = data.filter((row) => newKeys.includes(keyExtractor(row)));
      onSelectionChange?.(newKeys, selectedRows);
    }
  }, [isSelectionControlled, data, keyExtractor, onSelectionChange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.some((f) => f.value !== 'all' && f.value !== '') || currentSearch.trim().length > 0;
  }, [filters, currentSearch]);

  const handleClearAllFilters = useCallback(() => {
    filters.forEach((f) => f.onChange('all'));
    handleSearchChange('');
  }, [filters, handleSearchChange]);

  // Density padding configuration
  const cellPaddingClass = {
    compact: 'py-2 px-3.5',
    normal: 'py-3.5 px-4',
    spacious: 'py-5 px-5',
  }[internalDensity];

  // Automatic client-side filtering (if search is not externally controlled)
  const processedData = useMemo(() => {
    let list = [...data];

    // Client-side search filtering if not externally controlled
    if (!isSearchControlled && currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter((row) => {
        return columns.some((col) => {
          if (!col.accessorKey) return false;
          const val = row[col.accessorKey];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Client-side sorting if not externally controlled
    if (!isSortControlled && activeSortKey) {
      const col = columns.find((c) => c.id === activeSortKey);
      if (col && col.accessorKey) {
        const key = col.accessorKey;
        list.sort((a, b) => {
          const valA = a[key];
          const valB = b[key];
          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;

          let comp = 0;
          if (typeof valA === 'number' && typeof valB === 'number') {
            comp = valA - valB;
          } else {
            comp = String(valA).localeCompare(String(valB));
          }
          return activeSortDir === 'asc' ? comp : -comp;
        });
      }
    }

    return list;
  }, [data, columns, isSearchControlled, currentSearch, isSortControlled, activeSortKey, activeSortDir]);

  // Pagination resolution
  const isPaginationEnabled = pagination !== false;
  const isPaginationObject = typeof pagination === 'object' && pagination !== null;

  const currentPage = isPaginationEnabled && isPaginationObject && pagination.page !== undefined
    ? pagination.page
    : internalPage;
  const currentPageSize = isPaginationEnabled && isPaginationObject && pagination.pageSize !== undefined
    ? pagination.pageSize
    : internalPageSize;

  const totalRows = isPaginationEnabled && isPaginationObject && pagination.total !== undefined
    ? pagination.total
    : processedData.length;

  const paginatedData = useMemo(() => {
    if (!isPaginationEnabled) return processedData;
    // If total was passed externally, assumed server-side paginated
    if (isPaginationObject && pagination.total !== undefined) {
      return processedData;
    }
    const start = (currentPage - 1) * currentPageSize;
    return processedData.slice(start, start + currentPageSize);
  }, [isPaginationEnabled, isPaginationObject, pagination, processedData, currentPage, currentPageSize]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number, newPageSize: number) => {
    if (isPaginationEnabled && isPaginationObject && pagination.onChange) {
      pagination.onChange(newPage, newPageSize);
    }
    setInternalPage(newPage);
    setInternalPageSize(newPageSize);
  }, [isPaginationEnabled, isPaginationObject, pagination]);

  // Selected Rows List
  const selectedRows = useMemo(() => {
    return data.filter((row) => selectedKeys.includes(keyExtractor(row)));
  }, [data, selectedKeys, keyExtractor]);

  // Master checkbox selection on current page
  const pageRowKeys = useMemo(() => {
    return paginatedData.map((row) => keyExtractor(row));
  }, [paginatedData, keyExtractor]);

  const isAllPageSelected = pageRowKeys.length > 0 && pageRowKeys.every((k) => selectedKeys.includes(k));
  const isSomePageSelected = pageRowKeys.some((k) => selectedKeys.includes(k)) && !isAllPageSelected;

  const handleToggleSelectAll = () => {
    if (isAllPageSelected) {
      setSelectedKeysInternal(selectedKeys.filter((k) => !pageRowKeys.includes(k)));
    } else {
      const merged = Array.from(new Set([...selectedKeys, ...pageRowKeys]));
      setSelectedKeysInternal(merged);
    }
  };

  const handleToggleRow = (rowKey: string) => {
    if (selectedKeys.includes(rowKey)) {
      setSelectedKeysInternal(selectedKeys.filter((k) => k !== rowKey));
    } else {
      setSelectedKeysInternal([...selectedKeys, rowKey]);
    }
  };

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-ambient space-y-3">
      {/* 1. Rich Toolbar */}
      {!hideToolbar && (
        <DataTableToolbar
          search={search}
          searchValue={currentSearch}
          onSearchChange={handleSearchChange}
          filters={filters}
          onClearAllFilters={handleClearAllFilters}
          hasActiveFilters={hasActiveFilters}
          primaryAction={primaryAction}
          secondaryActions={secondaryActions}
          selectedRows={selectedRows}
          onClearSelection={() => setSelectedKeysInternal([])}
          batchActions={batchActions}
          density={internalDensity}
          onDensityChange={setInternalDensity}
          enableDensitySwitcher={enableDensitySwitcher}
          onExport={onExport}
          totalCountBadge={totalCountBadge}
          title={title}
          subtitle={subtitle}
        />
      )}

      {/* 2. Responsive Scrollable Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/50">
        <table className="w-full text-left rtl:text-right border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border/80 bg-surface-subtle/70 text-muted-foreground text-[11px] font-mono uppercase tracking-wider select-none">
              {/* Master Checkbox */}
              {enableSelection && (
                <th scope="col" className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition cursor-pointer ${
                      isAllPageSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isSomePageSelected
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'border-border/80 hover:border-foreground/60 bg-surface'
                    }`}
                    aria-label="Select all rows"
                  >
                    {isAllPageSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    {isSomePageSelected && <Minus className="h-3 w-3 stroke-[3]" />}
                  </button>
                </th>
              )}

              {/* Column Headers */}
              {columns.map((col) => {
                const isSortable = col.sortable ?? false;
                const isSorted = activeSortKey === col.id;
                const alignClass = {
                  start: 'text-start',
                  center: 'text-center',
                  end: 'text-end',
                }[col.align || 'start'];

                const renderHeaderContent = () => {
                  if (typeof col.header === 'function') {
                    return col.header({
                      column: col,
                      isSorted,
                      sortDirection: isSorted ? activeSortDir : undefined,
                    });
                  }
                  return col.header;
                };

                return (
                  <th
                    key={col.id}
                    scope="col"
                    style={{ width: col.width, minWidth: col.minWidth }}
                    className={`py-3 px-4 ${alignClass} ${col.className || ''}`}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSortToggle(col.id)}
                        className="group/sort inline-flex items-center gap-1.5 hover:text-foreground font-mono transition cursor-pointer"
                      >
                        <span>{renderHeaderContent()}</span>
                        <span className="shrink-0 text-muted-foreground/60 group-hover/sort:text-foreground transition-colors">
                          {isSorted ? (
                            activeSortDir === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-40 group-hover/sort:opacity-100" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span>{renderHeaderContent()}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          {isLoading ? (
            <DataTableSkeleton
              columns={columns}
              density={internalDensity}
              enableSelection={enableSelection}
            />
          ) : (
            <tbody className="divide-y divide-border/50">
              {paginatedData.map((row, rIdx) => {
                const rowKey = keyExtractor(row);
                const isSelected = selectedKeys.includes(rowKey);
                const customClass = rowClassName ? rowClassName(row, rIdx) : '';

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row, rIdx)}
                    className={`group transition-all duration-150 ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      isSelected
                        ? 'bg-primary/10 hover:bg-primary/15'
                        : 'hover:bg-surface-subtle/70'
                    } ${customClass}`}
                  >
                    {/* Row Checkbox */}
                    {enableSelection && (
                      <td
                        className={`${cellPaddingClass} w-10 text-center`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleRow(rowKey)}
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border/80 hover:border-foreground/60 bg-surface'
                          }`}
                          aria-label={`Select row ${rowKey}`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </button>
                      </td>
                    )}

                    {/* Column Cells */}
                    {columns.map((col) => {
                      const alignClass = {
                        start: 'text-start',
                        center: 'text-center',
                        end: 'text-end',
                      }[col.align || 'start'];

                      const cellValue = col.accessorKey ? row[col.accessorKey] : undefined;

                      return (
                        <td
                          key={`cell-${rowKey}-${col.id}`}
                          style={{ width: col.width, minWidth: col.minWidth }}
                          className={`${cellPaddingClass} ${alignClass} whitespace-nowrap ${col.className || ''}`}
                        >
                          {col.cell ? (
                            col.cell({ row, index: rIdx, value: cellValue })
                          ) : (
                            <span className="text-foreground font-medium">
                              {cellValue !== undefined && cellValue !== null ? String(cellValue) : '—'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>

        {/* Empty State */}
        {!isLoading && paginatedData.length === 0 && (
          <div className="py-14 px-4 text-center">
            {emptyState?.icon ? (
              <emptyState.icon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2.5" />
            ) : (
              <Inbox className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2.5" />
            )}
            <p className="text-sm font-bold text-foreground">
              {emptyState?.title || (isRtl ? 'لا توجد بيانات مطابقة' : 'No matching records found')}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {emptyState?.description ||
                (isRtl
                  ? 'لم يتم العثور على سجلات تطابق الفلاتر المحددة، جرب تعديل البحث أو الفلتر.'
                  : 'Try adjusting your search query, clearing filters, or switching categories.')}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-surface-subtle text-xs font-bold text-primary hover:bg-surface transition cursor-pointer"
              >
                <span>{isRtl ? 'إعادة ضبط كل الفلاتر' : 'Reset all filters'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Localized Pagination Bar */}
      {isPaginationEnabled && !isLoading && totalRows > 0 && (
        <DataTablePagination
          page={currentPage}
          pageSize={currentPageSize}
          total={totalRows}
          onChange={handlePageChange}
          pageSizeOptions={
            isPaginationObject && pagination.pageSizeOptions
              ? pagination.pageSizeOptions
              : [10, 25, 50, 100]
          }
        />
      )}
    </div>
  );
};
