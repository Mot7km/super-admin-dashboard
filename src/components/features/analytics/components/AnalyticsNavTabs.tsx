import { memo, type FC } from 'react';
import {
  Layers,
  TrendingUp,
  CreditCard,
  Target,
  Users,
  Cpu,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AnalyticsTab } from '../analytics.types';

type AnalyticsNavTabsProps = {
  activeTab: AnalyticsTab;
  onSelectTab: (tab: AnalyticsTab) => void;
};

export const AnalyticsNavTabs: FC<AnalyticsNavTabsProps> = memo(({
  activeTab,
  onSelectTab,
}) => {
  const { t } = useTranslation();

  const tabs: {
    key: AnalyticsTab;
    labelKey: string;
    icon: typeof Layers;
    phaseBadge?: string;
  }[] = [
    { key: 'overview', labelKey: 'analytics.tabs.overview', icon: Layers },
    { key: 'growth', labelKey: 'analytics.tabs.growth', icon: TrendingUp, phaseBadge: 'P2' },
    { key: 'subscriptions', labelKey: 'analytics.tabs.subscriptions', icon: CreditCard, phaseBadge: 'P3' },
    { key: 'trials', labelKey: 'analytics.tabs.trials', icon: Target, phaseBadge: 'P4' },
    { key: 'product', labelKey: 'analytics.tabs.product', icon: Users, phaseBadge: 'P5' },
    { key: 'operations', labelKey: 'analytics.tabs.operations', icon: Cpu, phaseBadge: 'P6' },
  ];

  return (
    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card/80 p-1.5 shadow-sm backdrop-blur-sm min-w-max">
        {tabs.map(({ key, labelKey, icon: Icon, phaseBadge }) => {
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectTab(key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t(labelKey)}</span>
              {phaseBadge && !isActive && (
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {phaseBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

AnalyticsNavTabs.displayName = 'AnalyticsNavTabs';
