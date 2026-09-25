import { memo, type FC } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  DownloadCloud,
  TrendingUp,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Business, BusinessStatus } from '../businesses.types';

type BusinessListHeaderProps = {
  businesses: Business[];
  onOnboardClick?: () => void;
  onExportClick?: () => void;
  activeStatus?: 'all' | BusinessStatus;
  onStatusSelect?: (status: 'all' | BusinessStatus) => void;
};

const BusinessListHeader: FC<BusinessListHeaderProps> = ({
  businesses,
  onOnboardClick,
  onExportClick,
  activeStatus = 'all',
  onStatusSelect,
}) => {
  const { t } = useTranslation();

  const totalCount = businesses.length;
  const activeCount = businesses.filter((b) => b.status === 'active').length;
  const trialCount = businesses.filter((b) => b.status === 'trial').length;
  const suspendedCount = businesses.filter(
    (b) => b.status === 'suspended' || b.status === 'disabled',
  ).length;

  // Aggregate telemetry
  const totalMrr = businesses.reduce((sum, b) => sum + b.mrr, 0);
  const activeMrr = businesses
    .filter((b) => b.status === 'active')
    .reduce((sum, b) => sum + b.mrr, 0);
  const trialMrr = businesses
    .filter((b) => b.status === 'trial')
    .reduce((sum, b) => sum + b.mrr, 0);
  const suspendedMrr = businesses
    .filter((b) => b.status === 'suspended' || b.status === 'disabled')
    .reduce((sum, b) => sum + b.mrr, 0);

  const totalBranches = businesses.reduce((sum, b) => sum + b.branchesCount, 0);
  const activeBranches = businesses
    .filter((b) => b.status === 'active')
    .reduce((sum, b) => sum + b.branchesCount, 0);

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const trialPercent = totalCount > 0 ? Math.round((trialCount / totalCount) * 100) : 0;
  const suspendedPercent = totalCount > 0 ? Math.round((suspendedCount / totalCount) * 100) : 0;

  const handleCardClick = (statusKey: 'all' | BusinessStatus) => {
    if (!onStatusSelect) return;
    // Toggle back to 'all' if already selected
    if (activeStatus === statusKey && statusKey !== 'all') {
      onStatusSelect('all');
    } else {
      onStatusSelect(statusKey);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Title & Top Sovereign Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('businesses.title')}
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary font-mono flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {totalCount} {t('businesses.tenantsActiveBadge')}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
            {t('businesses.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExportClick}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none hover:-translate-y-0.5"
          >
            <DownloadCloud className="h-4 w-4 text-primary" />
            <span>{t('businesses.exportList')}</span>
          </button>

          <button
            type="button"
            onClick={onOnboardClick}
            className="group flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>{t('businesses.onboardNew')}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Telemetry Grid (Interactive Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Tenants */}
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
          {/* Subtle top indicator glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

          {/* Top row: Icon + Trend Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
              <TrendingUp className="h-3 w-3" />
              {t('businesses.kpiTotalTrend')}
            </span>
          </div>

          {/* Middle: Title & Big Number */}
          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('businesses.kpiTotal')}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
                {totalCount}
              </span>
              <span className="text-xs font-bold text-muted-foreground font-mono">
                {totalBranches} {t('businesses.branchesLabel')}
              </span>
            </div>
          </div>

          {/* Telemetry Progress Bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div className="h-full bg-primary rounded-full w-full" />
          </div>

          {/* Bottom Telemetry: Total MRR */}
          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('businesses.kpiTotalSubtitle')}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums flex items-center gap-0.5">
              ${totalMrr.toLocaleString()}
              <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Card 2: Active Platforms */}
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
          {/* Subtle top indicator glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

          {/* Top row: Icon + Health Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-bg border border-success-text/20 px-2 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
              <Activity className="h-3 w-3" />
              {t('businesses.kpiActiveUptime')}
            </span>
          </div>

          {/* Middle: Title & Big Number */}
          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('businesses.kpiActive')}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
                {activeCount}
              </span>
              <span className="text-xs font-bold text-success-text/90 font-mono">
                {activeBranches} {t('businesses.branchesLabel')} ({activePercent}%)
              </span>
            </div>
          </div>

          {/* Telemetry Progress Bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${activePercent}%` }}
            />
          </div>

          {/* Bottom Telemetry: Active MRR */}
          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('businesses.kpiActiveSubtitle')}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums flex items-center gap-0.5">
              ${activeMrr.toLocaleString()}
              <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Card 3: In Evaluation (Trial) */}
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
          {/* Subtle top indicator glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/80 via-sky-400 to-blue-500/40" />

          {/* Top row: Icon + SLA Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-info-bg border border-info-text/20 text-info-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-info-bg border border-info-text/20 px-2 py-0.5 text-[11px] font-extrabold text-info-text font-mono">
              <ArrowUpRight className="h-3 w-3" />
              {t('businesses.kpiTrialAvg')}
            </span>
          </div>

          {/* Middle: Title & Big Number */}
          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('businesses.kpiTrial')}
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

          {/* Telemetry Progress Bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(trialPercent, 12)}%` }}
            />
          </div>

          {/* Bottom Telemetry: Pipeline Value */}
          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('businesses.kpiTrialSubtitle')}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums flex items-center gap-0.5">
              ${trialMrr.toLocaleString()}
              <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
        </div>

        {/* Card 4: Suspended / Frozen */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick('suspended')}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick('suspended')}
          className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
            activeStatus === 'suspended'
              ? 'bg-card border-destructive/60 shadow-md ring-2 ring-destructive/20'
              : 'bg-card/90 border-border/80 hover:border-destructive/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
          }`}
        >
          {/* Subtle top indicator glow bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/80 via-rose-400 to-amber-500/40" />

          {/* Top row: Icon + Attention Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
              {suspendedCount > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
              )}
              {t('businesses.kpiSuspendedAction')}
            </span>
          </div>

          {/* Middle: Title & Big Number */}
          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('businesses.kpiSuspended')}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-destructive-text font-mono tabular-nums tracking-tight">
                {suspendedCount}
              </span>
              <span className="text-xs font-bold text-destructive-text/90 font-mono">
                {suspendedPercent}% Churn Risk
              </span>
            </div>
          </div>

          {/* Telemetry Progress Bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-destructive rounded-full transition-all duration-500"
              style={{ width: `${Math.max(suspendedPercent, 10)}%` }}
            />
          </div>

          {/* Bottom Telemetry: Revenue at Risk */}
          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('businesses.kpiSuspendedSubtitle')}
            </span>
            <span className="font-mono font-black text-destructive-text tabular-nums flex items-center gap-0.5">
              ${suspendedMrr.toLocaleString()}
              <span className="text-[10px] text-muted-foreground font-normal">/mo</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BusinessListHeader);
