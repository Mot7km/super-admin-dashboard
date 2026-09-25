import { memo, type FC } from 'react';
import {
  PackageCheck,
  Calendar,
  Zap,
  RotateCw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  SUBSCRIPTION_PLANS_DATA,
  BILLING_CYCLES_DATA,
  SUBSCRIPTION_CADENCE_DATA,
} from '../../analytics.mock';

export const PlanBillingDistributionCard: FC = memo(() => {
  const { t } = useTranslation();

  const plans = SUBSCRIPTION_PLANS_DATA;
  const cycles = BILLING_CYCLES_DATA;
  const cadence = SUBSCRIPTION_CADENCE_DATA;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Subscription Plans Tier Distribution */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('analytics.plans.distributionTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.plans.distributionSubtitle')}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-foreground">
              934 {t('analytics.plans.paidTenants')}
            </span>
          </div>

          {/* Proportional Stacked Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted p-0.5">
              {plans.map((p) => (
                <div
                  key={p.id}
                  title={`${t(p.nameKey)}: ${p.subscribersCount} (${p.percent}%)`}
                  className={`h-full first:rounded-s-full last:rounded-e-full ${p.color} transition-all duration-300`}
                  style={{ width: `${p.percent}%` }}
                />
              ))}
            </div>
          </div>

          {/* Plan Breakdown Items */}
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:bg-background/80"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${plan.color}`} />
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {t(plan.nameKey)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      EGP {plan.priceMonthly} / {t('analytics.plans.month')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-end">
                    <span className="font-mono font-bold text-foreground">
                      {plan.subscribersCount}
                    </span>
                    <span className="text-[11px] text-muted-foreground ms-1">
                      ({plan.percent}%)
                    </span>
                  </div>

                  <div className="w-24 text-end">
                    <div className="font-mono font-bold text-primary">
                      EGP {plan.mrrAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {plan.mrrPercent}% MRR
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>{t('analytics.plans.enterpriseContribution')}</span>
          <span className="font-bold text-foreground">25.3% of Total MRR</span>
        </div>
      </div>

      {/* 2. Billing Cycles & Upgrade Momentum */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('analytics.plans.cyclesTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.plans.cyclesSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              <Zap className="h-3.5 w-3.5" />
              <span>32% Annual Share</span>
            </div>
          </div>

          {/* Monthly vs Annual Split Visual */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {cycles.map((c) => {
              const isAnnual = c.cycle === 'annual';
              return (
                <div
                  key={c.cycle}
                  className={`rounded-xl border p-4 space-y-1.5 ${
                    isAnnual
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-border/60 bg-background/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {t(c.labelKey)}
                    </span>
                    <span
                      className={`font-extrabold ${
                        isAnnual ? 'text-emerald-500' : 'text-primary'
                      }`}
                    >
                      {c.percent}%
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-foreground">
                    {c.subscribersCount}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.annualDiscountNote}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cadence Velocity Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {/* Upgrades vs Downgrades */}
            <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-2">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {t('analytics.plans.netCadenceMomentum')}
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                  <ArrowUp className="h-4 w-4" />
                  <span>+{cadence.monthlyUpgrades} {t('analytics.plans.upgrades')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                  <ArrowDown className="h-4 w-4" />
                  <span>-{cadence.monthlyDowngrades} {t('analytics.plans.downgrades')}</span>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                Ratio: 5.3x positive expansion
              </div>
            </div>

            {/* Auto-renew rate */}
            <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-2">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                {t('analytics.plans.autoRenewStatus')}
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <RotateCw className="h-4 w-4" />
                  <span>{cadence.autoRenewPercent}% Active</span>
                </div>
                <div className="text-muted-foreground font-semibold">
                  {cadence.upcomingRenewals7d} in 7D
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                Scheduled gateway collection
              </div>
            </div>
          </div>
        </div>

        {/* Footer Insight */}
        <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>{t('analytics.plans.retentionInsight')}</span>
          <span className="font-semibold text-emerald-500">Auto-Debit Health: 99.4%</span>
        </div>
      </div>
    </div>
  );
});

PlanBillingDistributionCard.displayName = 'PlanBillingDistributionCard';
