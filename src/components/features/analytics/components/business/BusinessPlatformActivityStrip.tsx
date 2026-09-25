import { memo, type FC } from 'react';
import {
  ShoppingBag,
  Package,
  Users2,
  GitBranch,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { PLATFORM_ACTIVITY_DATA } from '../../analytics.mock';

export const BusinessPlatformActivityStrip: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const data = PLATFORM_ACTIVITY_DATA;

  const activities = [
    {
      key: 'orders',
      labelKey: 'analytics.activity.orders',
      count: data.totalOrders,
      cadence: '1,413 orders / day',
      icon: ShoppingBag,
      color: 'text-amber-500',
      border: 'border-amber-500/20',
      bg: 'from-amber-500/10',
    },
    {
      key: 'products',
      labelKey: 'analytics.activity.products',
      count: data.productsAdded,
      cadence: '614 items / day',
      icon: Package,
      color: 'text-indigo-500',
      border: 'border-indigo-500/20',
      bg: 'from-indigo-500/10',
    },
    {
      key: 'employees',
      labelKey: 'analytics.activity.employees',
      count: data.employeesAdded,
      cadence: '160 staff / day',
      icon: Users2,
      color: 'text-blue-500',
      border: 'border-blue-500/20',
      bg: 'from-blue-500/10',
    },
    {
      key: 'branches',
      labelKey: 'analytics.activity.branches',
      count: data.branchesCreated,
      cadence: '40 branches / day',
      icon: GitBranch,
      color: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('analytics.activity.title')}
        </h3>
        <span className="text-[11px] text-muted-foreground">
          {t('analytics.activity.subtitle')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t(item.labelKey)}
                </span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/80 shadow-sm ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {item.count.toLocaleString()}
                </span>
                <span className={`flex items-center text-xs font-bold ${item.color}`}>
                  <ArrowUpRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-90' : ''}`} />
                  {t('analytics.activity.highVelocity')}
                </span>
              </div>

              <div className="mt-2 text-xs text-muted-foreground font-mono">
                {item.cadence}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

BusinessPlatformActivityStrip.displayName = 'BusinessPlatformActivityStrip';
