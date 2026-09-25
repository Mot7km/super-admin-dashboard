import { memo, type FC } from 'react';
import {
  Search,
  Plus,
  FilterX,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FlagFilterState } from '../feature-flags.types';

type FeatureFlagsFiltersProps = {
  filters: FlagFilterState;
  onFilterChange: (newFilters: Partial<FlagFilterState>) => void;
  onResetFilters: () => void;
  onOpenCreateModal: () => void;
};

export const FeatureFlagsFilters: FC<FeatureFlagsFiltersProps> = memo(({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenCreateModal,
}) => {
  const { t } = useTranslation();

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.scope !== 'all' ||
    filters.environment !== 'all';

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm">
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder={t('featureFlags.filters.searchPlaceholder')}
            className="w-full ps-10 pe-4 py-2 text-sm rounded-xl bg-background/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value as FlagFilterState['status'] })}
          className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">{t('featureFlags.filters.allStatuses')}</option>
          <option value="enabled">{t('featureFlags.filters.enabledOnly')}</option>
          <option value="disabled">{t('featureFlags.filters.disabledOnly')}</option>
        </select>

        {/* Scope Filter */}
        <select
          value={filters.scope}
          onChange={(e) => onFilterChange({ scope: e.target.value as FlagFilterState['scope'] })}
          className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">{t('featureFlags.filters.allScopes')}</option>
          <option value="everyone">🌐 {t('featureFlags.scopes.everyone')}</option>
          <option value="plans">👑 {t('featureFlags.scopes.plans')}</option>
          <option value="businesses">🏢 {t('featureFlags.scopes.businesses')}</option>
          <option value="percentage">📊 {t('featureFlags.scopes.percentage')}</option>
        </select>

        {/* Environment Filter */}
        <select
          value={filters.environment}
          onChange={(e) => onFilterChange({ environment: e.target.value as FlagFilterState['environment'] })}
          className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="all">{t('featureFlags.filters.allEnvironments')}</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
        </select>

        {/* Clear Filters */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            title={t('featureFlags.filters.reset')}
          >
            <FilterX className="h-3.5 w-3.5" />
            <span>{t('featureFlags.filters.reset')}</span>
          </button>
        )}
      </div>

      {/* Right side: Create New Flag Button */}
      <button
        onClick={onOpenCreateModal}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all whitespace-nowrap"
      >
        <Plus className="h-4 w-4" />
        <span>{t('featureFlags.actions.createFlag')}</span>
      </button>
    </div>
  );
});

FeatureFlagsFilters.displayName = 'FeatureFlagsFilters';
