import { memo, type FC } from 'react';
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Activity,
  Layers,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  SubscriptionFilterState,
  SubscriptionStatus,
  PlanTier,
  BillingCycle,
} from '../subscriptions.types';

type SubscriptionFilterBarProps = {
  filters: SubscriptionFilterState;
  onFilterChange: <K extends keyof SubscriptionFilterState>(
    key: K,
    value: SubscriptionFilterState[K],
  ) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalSubscribers: number;
  totalFilteredMrr: number;
  statusCounts: {
    all: number;
    active: number;
    trial: number;
    pending_renewal: number;
    expired: number;
    cancelled: number;
  };
};

const SubscriptionFilterBar: FC<SubscriptionFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  totalSubscribers,
  totalFilteredMrr,
  statusCounts,
}) => {
  const { t } = useTranslation();

  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.tier !== 'all' ||
    filters.billingCycle !== 'all' ||
    filters.sortBy !== 'mrr_desc';

  const activeFiltersCount =
    (filters.search.trim() !== '' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.tier !== 'all' ? 1 : 0) +
    (filters.billingCycle !== 'all' ? 1 : 0) +
    (filters.sortBy !== 'mrr_desc' ? 1 : 0);

  const statusOptions: Array<{ value: 'all' | SubscriptionStatus; label: string }> = [
    { value: 'all', label: t('subscriptions.filterAllStatus') },
    { value: 'active', label: t('subscriptions.statusActive') },
    { value: 'trial', label: t('subscriptions.statusTrial') },
    { value: 'pending_renewal', label: t('subscriptions.statusPendingRenewal') },
    { value: 'expired', label: t('subscriptions.statusExpired') },
    { value: 'cancelled', label: t('subscriptions.statusCancelled') },
  ];

  const tierOptions: Array<{ value: 'all' | PlanTier; label: string }> = [
    { value: 'all', label: t('subscriptions.filterAllTiers') },
    { value: 'Free', label: 'Free Forever' },
    { value: 'Basic', label: 'Basic' },
    { value: 'Pro', label: 'Pro Business' },
    { value: 'Enterprise', label: 'Enterprise' },
  ];

  const cycleOptions: Array<{ value: 'all' | BillingCycle; label: string }> = [
    { value: 'all', label: t('subscriptions.filterAllCycles') },
    { value: 'monthly', label: t('subscriptions.monthlyBilling') },
    { value: 'annual', label: t('subscriptions.annualBilling') },
  ];

  const sortOptions: Array<{ value: SubscriptionFilterState['sortBy']; label: string }> = [
    { value: 'mrr_desc', label: t('subscriptions.sortMrrHigh') },
    { value: 'mrr_asc', label: t('subscriptions.sortMrrLow') },
    { value: 'renewal_asc', label: t('subscriptions.sortRenewalSoon') },
    { value: 'created_desc', label: t('subscriptions.sortNewest') },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
      {/* 1. Quick Status Presets Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60 overflow-x-auto gap-2">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-surface-subtle/90 border border-border/70 overflow-x-auto">
          {/* All */}
          <button
            type="button"
            onClick={() => onFilterChange('status', 'all')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filters.status === 'all'
                ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{t('subscriptions.presetAll')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-primary/10 text-primary">
              {statusCounts.all}
            </span>
          </button>

          {/* Active */}
          <button
            type="button"
            onClick={() => onFilterChange('status', 'active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filters.status === 'active'
                ? 'bg-card text-success-text shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t('subscriptions.statusActive')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/15 text-success-text">
              {statusCounts.active}
            </span>
          </button>

          {/* Trial */}
          <button
            type="button"
            onClick={() => onFilterChange('status', 'trial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filters.status === 'trial'
                ? 'bg-card text-info-text shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-sky-400" />
            <span>{t('subscriptions.statusTrial')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-sky-500/15 text-info-text">
              {statusCounts.trial}
            </span>
          </button>

          {/* Pending Renewal */}
          <button
            type="button"
            onClick={() => onFilterChange('status', 'pending_renewal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filters.status === 'pending_renewal'
                ? 'bg-card text-amber-500 shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t('subscriptions.statusPendingRenewal')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-500">
              {statusCounts.pending_renewal}
            </span>
          </button>

          {/* Expired / Cancelled */}
          <button
            type="button"
            onClick={() => onFilterChange('status', 'expired')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filters.status === 'expired' || filters.status === 'cancelled'
                ? 'bg-card text-destructive shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5 text-destructive" />
            <span>{t('subscriptions.statusExpired')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-destructive/15 text-destructive">
              {statusCounts.expired + statusCounts.cancelled}
            </span>
          </button>
        </div>

        {/* Total Quick Stat */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MRR: ${totalFilteredMrr.toLocaleString()} /mo</span>
        </div>
      </div>

      {/* 2. Search & Select Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-0.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={t('subscriptions.searchPlaceholder')}
            className="w-full rounded-xl border border-border/80 bg-surface-subtle/60 pl-10 pr-16 rtl:pl-16 rtl:pr-10 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
          <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-subtle cursor-pointer"
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Select */}
          <div className="relative inline-flex items-center">
            <Activity className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.status}
              onChange={(e) =>
                onFilterChange('status', e.target.value as 'all' | SubscriptionStatus)
              }
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Select */}
          <div className="relative inline-flex items-center">
            <Layers className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.tier}
              onChange={(e) => onFilterChange('tier', e.target.value as 'all' | PlanTier)}
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {tierOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Billing Cycle Select */}
          <div className="relative inline-flex items-center">
            <Calendar className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.billingCycle}
              onChange={(e) =>
                onFilterChange('billingCycle', e.target.value as 'all' | BillingCycle)
              }
              className="appearance-none rounded-xl border border-border/80 bg-card pl-9 pr-7 rtl:pl-7 rtl:pr-9 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs hover:border-primary/50 transition-colors"
            >
              {cycleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="absolute left-3 rtl:left-auto rtl:right-3 pointer-events-none h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange('sortBy', e.target.value as SubscriptionFilterState['sortBy'])
              }
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
              <span>{t('subscriptions.clearAll')}</span>
              <span className="h-4 w-4 rounded-full bg-destructive/15 text-destructive text-[10px] font-mono flex items-center justify-center font-black">
                {activeFiltersCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Active Chips Row */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 rtl:mr-0 rtl:ml-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {t('subscriptions.activeFilters')}
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

          {filters.tier !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-500">
              <span>Tier: {filters.tier}</span>
              <button
                type="button"
                onClick={() => onFilterChange('tier', 'all')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.billingCycle !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <span>Cycle: {filters.billingCycle}</span>
              <button
                type="button"
                onClick={() => onFilterChange('billingCycle', 'all')}
                className="hover:opacity-75 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* 4. Telemetry Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5 px-0.5 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-foreground">
            {t('subscriptions.showingResults')
              .replace('{count}', String(totalFiltered))
              .replace('{total}', String(totalSubscribers))}
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span>{t('subscriptions.liveDirectory')}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            {t('subscriptions.filteredVolume')}:{' '}
            <strong className="text-foreground font-black">
              ${totalFilteredMrr.toLocaleString()}
            </strong>{' '}
            /mo
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SubscriptionFilterBar);
