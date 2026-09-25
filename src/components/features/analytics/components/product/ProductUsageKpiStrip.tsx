import { memo, type FC } from 'react';
import {
  Users,
  Zap,
  ShoppingBag,
  Receipt,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { USER_ACTIVITY_DATA, GMV_INTELLIGENCE_DATA } from '../../analytics.mock';

export const ProductUsageKpiStrip: FC = memo(() => {
  const { t, isRtl } = useTranslation();

  const userActivity = USER_ACTIVITY_DATA;
  const gmvData = GMV_INTELLIGENCE_DATA;

  const kpis = [
    {
      key: 'activeUsers',
      titleKey: 'analytics.product.activeUsersTitle',
      value: userActivity.activeUsers.toLocaleString(),
      change: '+10.1%',
      isPositive: true,
      sublabelKey: 'analytics.product.dauRatioSubtitle',
      sublabelValue: `${userActivity.dau.toLocaleString()} DAU (${userActivity.stickinessRatio}% Stickiness)`,
      icon: Users,
      color: 'text-primary',
      border: 'border-primary/20',
      bg: 'from-primary/10',
    },
    {
      key: 'stickiness',
      titleKey: 'analytics.product.stickinessTitle',
      value: `${userActivity.stickinessRatio}%`,
      change: '+3.4%',
      isPositive: true,
      sublabelKey: 'analytics.product.stickinessSubtitle',
      sublabelValue: 'DAU / MAU ratio (High Engagement)',
      icon: Zap,
      color: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-500/10',
    },
    {
      key: 'totalGmv',
      titleKey: 'analytics.product.gmvTitle',
      value: `EGP ${(gmvData.totalGmv / 1000000).toFixed(2)}M`,
      change: '+18.5%',
      isPositive: true,
      sublabelKey: 'analytics.product.gmvSubtitle',
      sublabelValue: `${gmvData.totalOrders.toLocaleString()} platform orders`,
      icon: ShoppingBag,
      color: 'text-amber-500',
      border: 'border-amber-500/20',
      bg: 'from-amber-500/10',
    },
    {
      key: 'aov',
      titleKey: 'analytics.product.aovTitle',
      value: `EGP ${gmvData.aov}`,
      change: '+4.2%',
      isPositive: true,
      sublabelKey: 'analytics.product.aovSubtitle',
      sublabelValue: 'avg ticket per order',
      icon: Receipt,
      color: 'text-indigo-500',
      border: 'border-indigo-500/20',
      bg: 'from-indigo-500/10',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('analytics.product.sectionTitle')}
        </h3>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>{t('analytics.product.sectionSubtitle')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} via-card/50 to-card p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t(item.titleKey)}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/80 shadow-sm ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {item.value}
                </span>
                <span className={`flex items-center text-xs font-bold ${item.color}`}>
                  <ArrowUpRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-90' : ''}`} />
                  {item.change}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{t(item.sublabelKey)}</span>
                <span className="font-mono font-semibold text-foreground/80">
                  {item.sublabelValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ProductUsageKpiStrip.displayName = 'ProductUsageKpiStrip';
