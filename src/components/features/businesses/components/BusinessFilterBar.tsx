import { memo, type FC } from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  RotateCcw,
  Crown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  BusinessFilterState,
  BusinessPlan,
  BusinessSortField,
  BusinessStatus,
} from '../businesses.types';

type PresetType = 'all' | 'active' | 'enterprise' | 'trial' | 'suspended';

type BusinessFilterBarProps = {
  filters: BusinessFilterState;
  onFilterChange: <K extends keyof BusinessFilterState>(
    key: K,
    value: BusinessFilterState[K],
  ) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalTenants?: number;
  totalFilteredMrr?: number;
  counts?: {
    all: number;
    active: number;
    enterprise: number;
    trial: number;
    suspended: number;
  };
};

const BusinessFilterBar: FC<BusinessFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  totalTenants = totalFiltered,
  totalFilteredMrr,
  counts,
}) => {
  const { t } = useTranslation();

  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.plan !== 'all' ||
    filters.sortBy !== 'mrr_desc';

  const activeFiltersCount =
    (filters.search.trim() !== '' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.plan !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'mrr_desc' ? 1 : 0);

  const statusOptions: Array<{ value: 'all' | BusinessStatus; label: string }> = [
    { value: 'all', label: t('businesses.filterAllStatus') },
    { value: 'active', label: t('businesses.statusActive') },
    { value: 'trial', label: t('businesses.statusTrial') },
    { value: 'suspended', label: t('businesses.statusSuspended') },
    { value: 'disabled', label: t('businesses.statusDisabled') },
  ];

  const planOptions: Array<{ value: 'all' | BusinessPlan; label: string }> = [
    { value: 'all', label: t('businesses.filterAllPlans') },
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Pro', label: 'Professional' },
    { value: 'Starter', label: 'Starter' },
  ];

  const sortOptions: Array<{ value: BusinessSortField; label: string }> = [
    { value: 'mrr_desc', label: t('businesses.sortMrrHigh') },
    { value: 'mrr_asc', label: t('businesses.sortMrrLow') },
    { value: 'created_desc', label: t('businesses.sortNewest') },
    { value: 'orders_desc', label: t('businesses.sortOrdersHigh') },
    { value: 'storage_desc', label: t('businesses.sortStorageHigh') },
  ];

  // Preset match detection
  const isAll = filters.status === 'all' && filters.plan === 'all';
  const isActive = filters.status === 'active' && filters.plan === 'all';
  const isEnterprise = filters.plan === 'Enterprise';
  const isTrial = filters.status === 'trial';
  const isSuspended = filters.status === 'suspended' || filters.status === 'disabled';

  const selectPreset = (type: PresetType) => {
    if (type === 'all') {
      onFilterChange('status', 'all');
      onFilterChange('plan', 'all');
    } else if (type === 'active') {
      onFilterChange('status', 'active');
      onFilterChange('plan', 'all');
    } else if (type === 'enterprise') {
      onFilterChange('plan', 'Enterprise');
      onFilterChange('status', 'all');
    } else if (type === 'trial') {
      onFilterChange('status', 'trial');
      onFilterChange('plan', 'all');
    } else if (type === 'suspended') {
      onFilterChange('status', 'suspended');
      onFilterChange('plan', 'all');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
      {/* 1. Top Bar: Segmented Preset Lenses & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
        {/* Preset Tabs with numeric badges & SVG icons */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-surface-subtle/90 border border-border/70 overflow-x-auto max-w-full">
          {/* All Tenants */}
          <button
            type="button"
            onClick={() => selectPreset('all')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isAll
                ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <span>{t('businesses.presetAll')}</span>
            {counts && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isAll ? 'bg-primary/15 text-primary' : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {counts.all}
              </span>
            )}
          </button>

          {/* Active Platforms */}
          <button
            type="button"
            onClick={() => selectPreset('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-card text-success-text shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t('businesses.presetActive')}</span>
            {counts && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-emerald-500/15 text-success-text'
                    : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {counts.active}
              </span>
            )}
          </button>

          {/* Enterprise Tier */}
          <button
            type="button"
            onClick={() => selectPreset('enterprise')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isEnterprise
                ? 'bg-card text-amber-500 shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>{t('businesses.presetEnterprise')}</span>
            {counts && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isEnterprise
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {counts.enterprise}
              </span>
            )}
          </button>

          {/* Evaluation Trials */}
          <button
            type="button"
            onClick={() => selectPreset('trial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isTrial
                ? 'bg-card text-info-text shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>{t('businesses.presetTrial')}</span>
            {counts && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isTrial
                    ? 'bg-sky-500/15 text-info-text'
                    : 'bg-surface-subtle text-muted-foreground'
                }`}
              >
                {counts.trial}
              </span>
            )}
          </button>

          {/* Requires Review */}
          <button
            type="button"
            onClick={() => selectPreset('suspended')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isSuspended
                ? 'bg-card text-destructive shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-destructive hover:bg-card/50'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span>{t('businesses.presetReview')}</span>
            {counts && counts.suspended > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-destructive/15 text-destructive font-bold">
                {counts.suspended}
              </span>
            )}
          </button>
        </div>

        {/* View Mode Switcher (Table vs Grid) */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80 shrink-0">
            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                filters.viewMode === 'table'
                  ? 'bg-card text-primary shadow-xs ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                filters.viewMode === 'grid'
                  ? 'bg-card text-primary shadow-xs ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Dimension Filters Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-0.5">
        {/* Search Input with Shortcut and Clear */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={t('businesses.searchPlaceholder')}
            className="w-full rounded-xl border border-border/80 bg-surface-subtle/60 pl-10 pr-16 rtl:pl-16 rtl:pr-10 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
          <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-subtle cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-subtle border border-border/70 text-[10px] font-mono text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Dropdown */}
          <div className="relative inline-flex items-center">
            <Activity className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value as 'all' | BusinessStatus)}
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Dropdown */}
          <div className="relative inline-flex items-center">
            <Layers className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.plan}
              onChange={(e) => onFilterChange('plan', e.target.value as 'all' | BusinessPlan)}
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {planOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange('sortBy', e.target.value as BusinessSortField)}
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters CTA */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive-bg/80 border border-destructive/30 transition-all cursor-pointer shadow-xs"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('businesses.clearAll')}</span>
              <span className="h-4 w-4 rounded-full bg-destructive/15 text-destructive text-[10px] font-mono flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Active Chips Row (When any filter/search is active) */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 rtl:mr-0 rtl:ml-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {t('businesses.activeFilters')}
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <span>Query: &quot;{filters.search}&quot;</span>
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-xs font-medium text-foreground">
              <span>Status: {filters.status}</span>
              <button
                type="button"
                onClick={() => onFilterChange('status', 'all')}
                className="hover:opacity-75 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.plan !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-500">
              <span>Plan: {filters.plan}</span>
              <button
                type="button"
                onClick={() => onFilterChange('plan', 'all')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.sortBy !== 'mrr_desc' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-xs font-medium text-muted-foreground">
              <span>Sorted</span>
              <button
                type="button"
                onClick={() => onFilterChange('sortBy', 'mrr_desc')}
                className="hover:opacity-75 cursor-pointer hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 4. Elegant Telemetry Result Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5 px-0.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-foreground">
            {t('businesses.showingResults')
              .replace('{count}', String(totalFiltered))
              .replace('{total}', String(totalTenants))}
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground">{t('businesses.liveDirectory')}</span>
        </div>

        {totalFilteredMrr !== undefined && (
          <div className="flex items-center gap-3 font-mono font-medium">
            <span>
              {t('businesses.filteredVolume')}:{' '}
              <strong className="text-foreground font-black">
                ${totalFilteredMrr.toLocaleString()}
              </strong>{' '}
              <span className="text-muted-foreground/80">/mo</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BusinessFilterBar);
