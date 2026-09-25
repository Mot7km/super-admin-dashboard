import { memo, type FC } from 'react';
import {
  GitBranch,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { MULTI_BRANCH_STATS } from '../../analytics.mock';

export const MultiBranchAnalyticsCard: FC = memo(() => {
  const { t } = useTranslation();

  const data = MULTI_BRANCH_STATS;
  const activePercent = ((data.activeBranches / data.totalBranches) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.branches.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.branches.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-primary text-xs font-bold">
          <span>{data.avgBranchesPerBusiness} {t('analytics.branches.avgPerBusiness')}</span>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.branches.totalBranches')}
          </span>
          <div className="text-xl font-extrabold text-foreground">
            {data.totalBranches.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.branches.registeredSites')}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.branches.activeBranches')}
          </span>
          <div className="text-xl font-extrabold text-emerald-500">
            {data.activeBranches.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>{activePercent}% {t('analytics.branches.operationalRate')}</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.branches.salesPerBranch')}
          </span>
          <div className="text-xl font-extrabold text-indigo-500">
            EGP {data.avgSalesPerBranchDay.toLocaleString()}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.branches.dailyAverage')}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-muted-foreground">
            {t('analytics.branches.ordersPerBranch')}
          </span>
          <div className="text-xl font-extrabold text-amber-500">
            {data.avgOrdersPerBranchDay}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {t('analytics.branches.dailyTickets')}
          </div>
        </div>
      </div>

      {/* Progress Bar of Operational Fleet */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>{t('analytics.branches.fleetUtilization')}</span>
          <span className="font-semibold text-foreground">{data.activeBranches} / {data.totalBranches} ({activePercent}%)</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${activePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
});

MultiBranchAnalyticsCard.displayName = 'MultiBranchAnalyticsCard';
