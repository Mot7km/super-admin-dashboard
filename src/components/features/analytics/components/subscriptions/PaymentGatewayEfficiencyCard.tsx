import { memo, type FC } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  PAYMENT_GATEWAYS_DATA,
  PAYMENT_FAILURE_REASONS,
} from '../../analytics.mock';

export const PaymentGatewayEfficiencyCard: FC = memo(() => {
  const { t } = useTranslation();

  const gateways = PAYMENT_GATEWAYS_DATA;
  const failureReasons = PAYMENT_FAILURE_REASONS;

  const totalGmv = gateways.reduce((sum, g) => sum + g.volumeEgp, 0);
  const totalTxs = gateways.reduce((sum, g) => sum + g.txCount, 0);
  const avgSuccessRate = (
    gateways.reduce((sum, g) => sum + g.successRate * g.sharePercent, 0) / 100
  ).toFixed(1);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.payments.efficiencyTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.payments.efficiencySubtitle')}
            </p>
          </div>
        </div>

        {/* Global Success Rate Badge */}
        <div className="flex items-center gap-3">
          <div className="text-end">
            <span className="text-[11px] font-semibold uppercase text-muted-foreground">
              {t('analytics.payments.totalGmvVolume')}
            </span>
            <div className="text-sm font-extrabold text-foreground">
              EGP {totalGmv.toLocaleString()} ({totalTxs.toLocaleString()} txs)
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-emerald-500 text-xs font-bold shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>{avgSuccessRate}% {t('analytics.payments.successRate')}</span>
          </div>
        </div>
      </div>

      {/* Dual Section: Gateways Rails on Left, Failure Reasons on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Payment Gateways & Rails Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" />
              {t('analytics.payments.railsBreakdown')}
            </span>
            <span className="text-muted-foreground font-normal">
              {gateways.length} active payment rails
            </span>
          </div>

          <div className="space-y-3">
            {gateways.map((gw) => (
              <div
                key={gw.id}
                className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-2 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${gw.color}`} />
                    <span className="font-bold text-foreground">
                      {t(gw.methodKey)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">
                      EGP {gw.volumeEgp.toLocaleString()}
                    </span>
                    <span className="font-bold text-emerald-500">
                      {gw.successRate}% {t('analytics.payments.success')}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${gw.color} transition-all duration-500`}
                    style={{ width: `${gw.sharePercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{gw.txCount.toLocaleString()} transactions</span>
                  <span>{gw.sharePercent}% volume share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment Failure Diagnostic Radar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="flex items-center gap-1.5 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
              {t('analytics.payments.failureTitle')}
            </span>
            <span className="text-muted-foreground font-normal">
              4.1% rejected transactions
            </span>
          </div>

          <div className="space-y-3">
            {failureReasons.map((fail) => (
              <div
                key={fail.id}
                className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {t(fail.labelKey)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-500">
                      {fail.count} {t('analytics.payments.declines')}
                    </span>
                    <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                      {fail.percent}%
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-500"
                    style={{ width: `${fail.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Smart Recovery Note */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex items-center gap-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span>{t('analytics.payments.smartDunningNotice')}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentGatewayEfficiencyCard.displayName = 'PaymentGatewayEfficiencyCard';
