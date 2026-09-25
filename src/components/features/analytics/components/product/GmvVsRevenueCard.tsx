import { memo, type FC } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Percent,
  Receipt,
  Store,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { GMV_INTELLIGENCE_DATA } from '../../analytics.mock';

export const GmvVsRevenueCard: FC = memo(() => {
  const { t } = useTranslation();

  const data = GMV_INTELLIGENCE_DATA;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.gmv.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.gmv.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Take Rate: {data.takeRatePercent}%</span>
          </div>
        </div>
      </div>

      {/* Two Macro Panels: GMV vs SaaS Revenue */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* GMV Card */}
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card/50 to-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-500">
              {t('analytics.gmv.grossMerchandiseTitle')}
            </span>
            <Store className="h-5 w-5 text-amber-500" />
          </div>

          <div>
            <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
              EGP {(data.totalGmv / 1000000).toFixed(2)}M
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('analytics.gmv.grossMerchandiseDesc')}
            </p>
          </div>

          <div className="border-t border-border/50 pt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{data.totalOrders.toLocaleString()} orders</span>
            <span className="font-mono font-semibold text-foreground">AOV: EGP {data.aov}</span>
          </div>
        </div>

        {/* Mot7km SaaS Revenue Card */}
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/50 to-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-500">
              {t('analytics.gmv.saasRevenueTitle')}
            </span>
            <Receipt className="h-5 w-5 text-emerald-500" />
          </div>

          <div>
            <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
              EGP {data.platformRevenue.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('analytics.gmv.saasRevenueDesc')}
            </p>
          </div>

          <div className="border-t border-border/50 pt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Subscriptions & add-on licenses</span>
            <span className="font-mono font-semibold text-emerald-500">100% Platform Margin</span>
          </div>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5 text-primary" />
            {t('analytics.gmv.sectorTitle')}
          </span>
          <span className="text-muted-foreground font-normal">
            Egyptian merchant market verticals
          </span>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted p-0.5 flex">
          {data.businessTypeShares.map((sec) => (
            <div
              key={sec.typeKey}
              title={`${t(sec.nameKey)}: ${sec.percent}%`}
              className={`h-full first:rounded-s-full last:rounded-e-full ${sec.color} transition-all duration-300`}
              style={{ width: `${sec.percent}%` }}
            />
          ))}
        </div>

        {/* Sector Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.businessTypeShares.map((sec) => (
            <div
              key={sec.typeKey}
              className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${sec.color}`} />
                  <span className="font-bold text-foreground">
                    {t(sec.nameKey)}
                  </span>
                </div>
                <span className="font-extrabold text-primary">
                  {sec.percent}%
                </span>
              </div>

              <div className="text-base font-extrabold text-foreground">
                EGP {sec.gmvAmount.toLocaleString()}
              </div>

              <div className="text-[11px] text-muted-foreground">
                {sec.ordersCount.toLocaleString()} {t('analytics.gmv.ordersProcessed')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

GmvVsRevenueCard.displayName = 'GmvVsRevenueCard';
