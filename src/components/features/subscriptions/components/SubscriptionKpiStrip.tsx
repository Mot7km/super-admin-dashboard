import { memo, type FC } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertOctagon,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Subscription, SubscriptionStatus } from '../subscriptions.types';

type SubscriptionKpiStripProps = {
  subscriptions: Subscription[];
  activeStatus: 'all' | SubscriptionStatus;
  onStatusSelect: (status: 'all' | SubscriptionStatus) => void;
};

const SubscriptionKpiStrip: FC<SubscriptionKpiStripProps> = ({
  subscriptions,
  activeStatus,
  onStatusSelect,
}) => {
  const { t } = useTranslation();

  const totalCount = subscriptions.length;
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const trialCount = subscriptions.filter((s) => s.status === 'trial').length;
  const churnedCount = subscriptions.filter(
    (s) => s.status === 'expired' || s.status === 'cancelled',
  ).length;

  const totalMrr = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'pending_renewal')
    .reduce((sum, s) => sum + s.mrrContribution, 0);

  const totalArr = totalMrr * 12;

  const trialPipelineMrr = subscriptions
    .filter((s) => s.status === 'trial')
    .reduce((sum, s) => sum + s.mrrContribution, 0);

  const atRiskMrr = subscriptions
    .filter((s) => s.status === 'expired' || s.status === 'cancelled')
    .reduce((sum, s) => sum + s.mrrContribution, 0);

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const trialPercent = totalCount > 0 ? Math.round((trialCount / totalCount) * 100) : 0;
  const churnPercent = totalCount > 0 ? Math.round((churnedCount / totalCount) * 100) : 0;

  const handleCardClick = (statusKey: 'all' | SubscriptionStatus) => {
    if (activeStatus === statusKey && statusKey !== 'all') {
      onStatusSelect('all');
    } else {
      onStatusSelect(statusKey);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total Recurring Revenue */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('all')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('all')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'all'
            ? 'bg-card border-primary/60 shadow-md ring-2 ring-primary/20'
            : 'bg-card/90 border-border/80 hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
            <TrendingUp className="h-3 w-3" />
            +24.6% YoY
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('subscriptions.kpiTotalMrr')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
              ${totalMrr.toLocaleString()}
              <span className="text-xs text-muted-foreground font-normal"> /mo</span>
            </span>
            <span className="text-xs font-bold text-muted-foreground font-mono">
              ${totalArr.toLocaleString()} ARR
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('subscriptions.totalSubscribers')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            {totalCount} {t('subscriptions.accounts')}
          </span>
        </div>
      </div>

      {/* 2. Active Paid Subscriptions */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('active')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('active')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'active'
            ? 'bg-card border-success-text/60 shadow-md ring-2 ring-success-text/20'
            : 'bg-card/90 border-border/80 hover:border-success-text/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-bg border border-success-text/20 px-2 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
            <Activity className="h-3 w-3" />
            98.8% Health
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('subscriptions.kpiActiveSubs')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
              {activeCount}
            </span>
            <span className="text-xs font-bold text-success-text/90 font-mono">
              {activePercent}% Paid Ratio
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${activePercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('subscriptions.retentionRate')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            97.4% MoM
          </span>
        </div>
      </div>

      {/* 3. In Evaluation / Trials */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('trial')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('trial')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'trial'
            ? 'bg-card border-info-text/60 shadow-md ring-2 ring-info-text/20'
            : 'bg-card/90 border-border/80 hover:border-info-text/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/80 via-sky-400 to-blue-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-info-bg border border-info-text/20 text-info-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-info-bg border border-info-text/20 px-2 py-0.5 text-[11px] font-extrabold text-info-text font-mono">
            <ArrowUpRight className="h-3 w-3" />
            68% Conv. Rate
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('subscriptions.kpiTrials')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-info-text font-mono tabular-nums tracking-tight">
              {trialCount}
            </span>
            <span className="text-xs font-bold text-info-text/90 font-mono">
              {trialPercent}% Pipeline
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(trialPercent, 14)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('subscriptions.pipelineValue')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            ${trialPipelineMrr.toLocaleString()} /mo
          </span>
        </div>
      </div>

      {/* 4. Expired / Churned / At Risk */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('expired')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('expired')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'expired' || activeStatus === 'cancelled'
            ? 'bg-card border-destructive/60 shadow-md ring-2 ring-destructive/20'
            : 'bg-card/90 border-border/80 hover:border-destructive/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/80 via-rose-400 to-amber-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
            {churnedCount > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            )}
            Action Needed
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('subscriptions.kpiChurned')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-destructive-text font-mono tabular-nums tracking-tight">
              {churnedCount}
            </span>
            <span className="text-xs font-bold text-destructive-text/90 font-mono">
              {churnPercent}% Churn Risk
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-destructive rounded-full transition-all duration-500"
            style={{ width: `${Math.max(churnPercent, 12)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('subscriptions.revenueAtRisk')}
          </span>
          <span className="font-mono font-black text-destructive-text tabular-nums">
            ${atRiskMrr.toLocaleString()} /mo
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SubscriptionKpiStrip);
