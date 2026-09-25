import { memo, type FC } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { RevenuePeriod, RevenueSummary } from '../payments.types';

type RevenueCockpitProps = {
  summary: RevenueSummary;
  selectedPeriod: RevenuePeriod;
  onSelectPeriod: (period: RevenuePeriod) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomDateChange: (start: string, end: string) => void;
  onQuickFilterStatus?: (status: 'successful' | 'failed' | 'refunded' | 'all') => void;
};

const RevenueCockpit: FC<RevenueCockpitProps> = ({
  summary,
  selectedPeriod,
  onSelectPeriod,
  customStartDate,
  customEndDate,
  onCustomDateChange,
  onQuickFilterStatus,
}) => {
  const { t, locale } = useTranslation();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const PERIOD_OPTIONS: { id: RevenuePeriod; labelKey: string; defaultLabel: string }[] = [
    { id: 'today', labelKey: 'payments.periodToday', defaultLabel: 'Today' },
    { id: 'month', labelKey: 'payments.periodMonth', defaultLabel: 'This Month' },
    { id: 'year', labelKey: 'payments.periodYear', defaultLabel: 'This Year' },
    { id: 'custom', labelKey: 'payments.periodCustom', defaultLabel: 'Custom Range' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Timeframe Scope Switcher & Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/90 border border-border/80 p-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-foreground block">
              {t('payments.revenueScope') || 'Revenue Velocity Scope'}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              {t('payments.revenueScopeSub') || 'Multi-tenant liquidity and processing telemetry'}
            </span>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-surface-subtle p-1 rounded-xl border border-border/70 self-start sm:self-center">
          {PERIOD_OPTIONS.map((opt) => {
            const isSelected = selectedPeriod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectPeriod(opt.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
                  isSelected
                    ? 'bg-card text-foreground shadow-xs font-black'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{t(opt.labelKey) || opt.defaultLabel}</span>
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Date Range Inputs (Visible when Custom is selected) */}
      {selectedPeriod === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-card border border-primary/30 shadow-xs animate-in fade-in duration-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{t('payments.selectRange') || 'Custom Temporal Window'}:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{t('payments.from') || 'From'}:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
                className="h-8 px-2.5 rounded-lg bg-surface-subtle border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{t('payments.to') || 'To'}:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
                className="h-8 px-2.5 rounded-lg bg-surface-subtle border border-border font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Executive KPI Cards (Gross Volume, Success, Failed, Refunds) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Gross Platform Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-md text-left rtl:text-right select-none">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
              <TrendingUp className="h-3 w-3" />
              +{summary.growthVsPrevious}%
            </span>
          </div>

          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('payments.kpiGrossRevenue') || 'Gross Platform Volume'}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
                {formatCurrency(summary.grossVolume)}
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div className="h-full bg-primary rounded-full w-full" />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('payments.netCollected') || 'Net Processed'}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums">
              {formatCurrency(summary.netRevenue)}
            </span>
          </div>
        </div>

        {/* Card 2: Successful Payments & Conversion */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onQuickFilterStatus?.('successful')}
          onKeyDown={(e) => e.key === 'Enter' && onQuickFilterStatus?.('successful')}
          className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-emerald-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md cursor-pointer text-left rtl:text-right select-none"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-bg border border-success-text/20 px-2 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
              <ArrowUpRight className="h-3 w-3" />
              {summary.successRate}% Rate
            </span>
          </div>

          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('payments.kpiSuccessful') || 'Successful Payments'}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
                {summary.successfulCount}
              </span>
              <span className="text-xs font-bold text-success-text/90 font-mono">
                {t('payments.cleared') || 'Cleared'}
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${summary.successRate}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('payments.avgTicket') || 'Avg Ticket Size'}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums">
              {formatCurrency(summary.avgOrderValue)}
            </span>
          </div>
        </div>

        {/* Card 3: Failed Payments & Recoverable Loss */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onQuickFilterStatus?.('failed')}
          onKeyDown={(e) => e.key === 'Enter' && onQuickFilterStatus?.('failed')}
          className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-destructive/40 hover:bg-card hover:-translate-y-1 hover:shadow-md cursor-pointer text-left rtl:text-right select-none"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/80 via-rose-400 to-amber-500/40" />

          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
              Action Ready
            </span>
          </div>

          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('payments.kpiFailed') || 'Failed Charges'}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-destructive-text font-mono tabular-nums tracking-tight">
                {summary.failedCount}
              </span>
              <span className="text-xs font-bold text-destructive-text/90 font-mono">
                {t('payments.declined') || 'Declined'}
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-destructive rounded-full transition-all duration-500"
              style={{
                width: `${Math.max((summary.failedCount / Math.max(summary.totalTransactionsCount, 1)) * 100, 10)}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('payments.retryPotential') || 'Retry Recovery'}
            </span>
            <span className="font-mono font-bold text-destructive-text tabular-nums">
              Click to Filter
            </span>
          </div>
        </div>

        {/* Card 4: Refunds & Disputed Capital */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onQuickFilterStatus?.('refunded')}
          onKeyDown={(e) => e.key === 'Enter' && onQuickFilterStatus?.('refunded')}
          className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-amber-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md cursor-pointer text-left rtl:text-right select-none"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/80 via-orange-400 to-yellow-500/40" />

          <div className="flex items-center justify-between gap-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <RotateCcw className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 font-mono">
              {summary.refundCount} {summary.refundCount === 1 ? 'Case' : 'Cases'}
            </span>
          </div>

          <div className="mt-3.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              {t('payments.kpiRefunds') || 'Refunds & Disputes'}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tabular-nums tracking-tight">
                {formatCurrency(summary.refundedVolume)}
              </span>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((summary.refundedVolume / Math.max(summary.grossVolume, 1)) * 100 * 5, 100)}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
            <span className="text-muted-foreground font-medium">
              {t('payments.refundRatio') || 'Refund Ratio'}
            </span>
            <span className="font-mono font-black text-foreground tabular-nums">
              {(
                (summary.refundedVolume / Math.max(summary.grossVolume, 1)) *
                100
              ).toFixed(1)}
              % of Volume
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RevenueCockpit);
