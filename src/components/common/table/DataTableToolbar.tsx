import { type ReactNode, type FC } from 'react';
import {
  Search,
  X,
  Download,
  FilterX,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import type {
  DataTableSearchConfig,
  DataTableFilterConfig,
  DataTablePrimaryAction,
  DataTableSecondaryAction,
  DataTableBatchAction,
  DataTableDensity,
} from './table.types';

interface DataTableToolbarProps<TData> {
  search?: DataTableSearchConfig;
  searchValue: string;
  onSearchChange: (val: string) => void;
  filters?: DataTableFilterConfig[];
  onClearAllFilters?: () => void;
  hasActiveFilters?: boolean;
  primaryAction?: DataTablePrimaryAction;
  secondaryActions?: DataTableSecondaryAction[];
  selectedRows: TData[];
  onClearSelection?: () => void;
  batchActions?: DataTableBatchAction<TData>[];
  density: DataTableDensity;
  onDensityChange?: (d: DataTableDensity) => void;
  enableDensitySwitcher?: boolean;
  onExport?: (format: 'csv' | 'json') => void;
  totalCountBadge?: string;
  title?: string;
  subtitle?: string;
  customFilterSlot?: ReactNode;
}

export const DataTableToolbar = <TData,>({
  search,
  searchValue,
  onSearchChange,
  filters = [],
  onClearAllFilters,
  hasActiveFilters = false,
  primaryAction,
  secondaryActions = [],
  selectedRows,
  onClearSelection,
  batchActions = [],
  density,
  onDensityChange,
  enableDensitySwitcher = true,
  onExport,
  totalCountBadge,
  title,
  subtitle,
  customFilterSlot,
}: DataTableToolbarProps<TData>): ReturnType<FC> => {
  const { isRtl } = useTranslation();
  const selectedCount = selectedRows.length;

  return (
    <div className="space-y-3 pb-3">
      {/* Optional Title Row */}
      {(title || subtitle || totalCountBadge) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-foreground tracking-tight">
                  {title}
                </h3>
                {totalCountBadge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-primary/10 text-primary border border-primary/20">
                    {totalCountBadge}
                  </span>
                )}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Floating Batch Actions Bar (Renders when rows are selected) */}
      {selectedCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-primary/10 border border-primary/25 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {isRtl ? (
                <>تم تحديد <strong className="font-mono text-primary font-black">{selectedCount}</strong> عنصر</>
              ) : (
                <><strong className="font-mono text-primary font-black">{selectedCount}</strong> row{selectedCount > 1 ? 's' : ''} selected</>
              )}
            </span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer ms-1"
              >
                {isRtl ? 'إلغاء التحديد' : 'Deselect all'}
              </button>
            )}
          </div>

          {/* Batch Action Buttons */}
          <div className="flex items-center gap-2">
            {batchActions.map((action) => {
              const Icon = action.icon;
              const isDanger = action.variant === 'danger';
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => action.onClick(selectedRows)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isDanger
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-card border border-border/80 text-foreground hover:bg-surface-subtle'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Main Filter & Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${
              isRtl ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={search?.placeholder || (isRtl ? 'بحث في السجلات...' : 'Search records...')}
            className={`w-full rounded-lg border border-border/80 bg-surface-subtle/80 py-2 ${
              isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
            } text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all`}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer ${
                isRtl ? 'left-2.5' : 'right-2.5'
              }`}
              title={isRtl ? 'مسح البحث' : 'Clear search'}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom filters */}
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isFilterActive = filter.value !== 'all' && filter.value !== '';
            return (
              <div key={filter.id} className="relative inline-flex items-center">
                {Icon && (
                  <Icon
                    className={`absolute pointer-events-none h-3.5 w-3.5 text-muted-foreground ${
                      isRtl ? 'right-2.5' : 'left-2.5'
                    }`}
                  />
                )}
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={`appearance-none rounded-lg border bg-surface-subtle/80 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all ${
                    Icon ? (isRtl ? 'pr-8 pl-7' : 'pl-8 pr-7') : (isRtl ? 'pr-3 pl-7' : 'pl-3 pr-7')
                  } ${
                    isFilterActive
                      ? 'border-primary/40 bg-primary/5 text-primary font-bold ring-1 ring-primary/20'
                      : 'border-border/80'
                  }`}
                >
                  <option value="all">{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} {opt.count !== undefined ? `(${opt.count})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground ${
                    isRtl ? 'left-2' : 'right-2'
                  }`}
                />
              </div>
            );
          })}

          {customFilterSlot}

          {/* Reset All Filters button */}
          {hasActiveFilters && onClearAllFilters && (
            <button
              type="button"
              onClick={onClearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-border/80 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground text-xs font-semibold transition cursor-pointer"
              title={isRtl ? 'إعادة ضبط كل التصنيفات' : 'Reset all filters'}
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>{isRtl ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          )}

          {/* Density Switcher */}
          {enableDensitySwitcher && onDensityChange && (
            <div className="relative inline-flex items-center p-0.5 rounded-lg border border-border/70 bg-surface-subtle/70">
              <button
                type="button"
                onClick={() => onDensityChange('compact')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                  density === 'compact'
                    ? 'bg-card text-primary shadow-2xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Compact density"
              >
                {isRtl ? 'مضغوط' : 'Compact'}
              </button>
              <button
                type="button"
                onClick={() => onDensityChange('normal')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${
                  density === 'normal'
                    ? 'bg-card text-primary shadow-2xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Normal density"
              >
                {isRtl ? 'عادي' : 'Normal'}
              </button>
            </div>
          )}

          {/* Export Button */}
          {onExport && (
            <button
              type="button"
              onClick={() => onExport('csv')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-card hover:bg-surface-subtle text-foreground text-xs font-bold transition shadow-2xs cursor-pointer"
              title={isRtl ? 'تصدير كملف CSV' : 'Export to CSV'}
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{isRtl ? 'تصدير' : 'Export'}</span>
            </button>
          )}

          {/* Secondary Actions */}
          {secondaryActions.map((sec, idx) => {
            const SecIcon = sec.icon;
            return (
              <button
                key={`sec-act-${idx}`}
                type="button"
                onClick={sec.onClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/80 bg-card hover:bg-surface-subtle text-foreground text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                {SecIcon && <SecIcon className="h-3.5 w-3.5" />}
                <span>{sec.label}</span>
              </button>
            );
          })}

          {/* Primary Action Button */}
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95 transition cursor-pointer shrink-0"
            >
              {primaryAction.icon ? (
                <primaryAction.icon className="h-4 w-4" />
              ) : (
                <SlidersHorizontal className="h-4 w-4" />
              )}
              <span>{primaryAction.label}</span>
              {primaryAction.badge && (
                <span className="ms-1 px-1.5 py-0.2 text-[10px] rounded-md bg-white/20 text-white font-mono font-bold">
                  {primaryAction.badge}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
