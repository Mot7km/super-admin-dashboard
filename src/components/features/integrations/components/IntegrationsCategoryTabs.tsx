import { memo, type FC } from 'react';
import {
  Layers,
  CreditCard,
  BellRing,
  Cloud,
  Webhook,
  Search,
  FilterX,
  History,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { IntegrationCategory, IntegrationEnvironment } from '../integrations.types';

type IntegrationsCategoryTabsProps = {
  activeCategory: IntegrationCategory;
  onSelectCategory: (category: IntegrationCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  envFilter: 'all' | IntegrationEnvironment;
  onEnvFilterChange: (env: 'all' | IntegrationEnvironment) => void;
  onOpenWebhooksDrawer: () => void;
  countsByCategory: Record<IntegrationCategory, number>;
};

export const IntegrationsCategoryTabs: FC<IntegrationsCategoryTabsProps> = memo(({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  envFilter,
  onEnvFilterChange,
  onOpenWebhooksDrawer,
  countsByCategory,
}) => {
  const { t } = useTranslation();

  const categories: { key: IntegrationCategory; labelKey: string; icon: typeof Layers }[] = [
    { key: 'all', labelKey: 'integrations.tabs.all', icon: Layers },
    { key: 'payment', labelKey: 'integrations.tabs.payment', icon: CreditCard },
    { key: 'messaging', labelKey: 'integrations.tabs.messaging', icon: BellRing },
    { key: 'cloud', labelKey: 'integrations.tabs.cloud', icon: Cloud },
    { key: 'webhooks', labelKey: 'integrations.tabs.webhooks', icon: Webhook },
  ];

  const hasActiveFilters = searchQuery !== '' || envFilter !== 'all' || activeCategory !== 'all';

  return (
    <div className="space-y-4">
      {/* Category Pills & Action Buttons */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/70 bg-card/60 p-1.5 shadow-sm backdrop-blur-sm">
          {categories.map(({ key, labelKey, icon: Icon }) => {
            const isActive = activeCategory === key;
            const count = countsByCategory[key] || 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectCategory(key)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t(labelKey)}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Webhooks Activity Log Trigger */}
        <button
          type="button"
          onClick={onOpenWebhooksDrawer}
          className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary/50 hover:bg-muted/40 transition-all duration-200"
        >
          <History className="h-4 w-4 text-primary" />
          <span>{t('integrations.actions.viewWebhookLogs')}</span>
        </button>
      </div>

      {/* Search & Environment Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('integrations.filters.searchPlaceholder')}
            className="h-9 w-full rounded-xl border border-border/70 bg-background/80 ps-9 pe-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Environment Filter Selector */}
        <div className="flex items-center gap-2">
          <select
            value={envFilter}
            onChange={(e) => onEnvFilterChange(e.target.value as 'all' | IntegrationEnvironment)}
            className="h-9 rounded-xl border border-border/70 bg-background/80 px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">{t('integrations.filters.allEnvironments')}</option>
            <option value="production">{t('integrations.env.production')}</option>
            <option value="sandbox">{t('integrations.env.sandbox')}</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onEnvFilterChange('all');
                onSelectCategory('all');
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>{t('integrations.filters.reset')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

IntegrationsCategoryTabs.displayName = 'IntegrationsCategoryTabs';
