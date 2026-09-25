import { memo, useTransition, type FC } from 'react';
import {
  Shield,
  RefreshCw,
  Plus,
  DownloadCloud,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type HomeHeaderProps = {
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
};

const HomeHeader: FC<HomeHeaderProps> = ({
  timeFilter,
  onTimeFilterChange,
  onRefresh,
  onExport,
  isRefreshing = false,
}) => {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();

  const timeFilterOptions = [
    { value: 'today', label: t('dashboard.periods.today') },
    { value: '7d', label: t('dashboard.periods.last7d') },
    { value: '30d', label: t('dashboard.periods.last30d') },
    { value: 'quarter', label: t('dashboard.periods.quarter') },
    { value: 'ytd', label: t('dashboard.periods.ytd') },
  ];

  const handlePeriodClick = (val: string) => {
    startTransition(() => {
      onTimeFilterChange(val);
    });
  };

  return (
    <header className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-border/80 pb-5 pt-1">
      {/* 1. Title & High-Confidence Status */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl truncate">
            {t('dashboard.title')}
          </h1>

          {/* Live Node Sentinel Pill */}
          <div
            className="group relative inline-flex items-center gap-2 rounded-pill bg-success-bg border border-success/30 px-3 py-1 text-xs font-bold text-success-text shadow-sm cursor-help transition-all hover:bg-success-bg/90"
            title="Cluster Global Status: 4 Nodes Online • 24ms Edge Ping"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="whitespace-nowrap font-mono">{t('dashboard.systemStatusLive')}</span>

            {/* Hover Tooltip Card */}
            <div className="pointer-events-none absolute left-0 top-full mt-2 hidden group-hover:flex flex-col gap-1 w-52 p-2.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-dropdown text-[11px] text-foreground z-50 animate-fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1 text-success-text">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mesh Network Active</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">24ms</span>
              </div>
              <p className="text-muted-foreground text-[10px] leading-tight">
                Zero failovers across Riyadh, Frankfurt, and Virginia data regions.
              </p>
            </div>
          </div>

          {/* Root Sentinel Active Flag */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
            <Shield className="h-3.5 w-3.5" />
            <span>Root Sentinel Active</span>
          </div>
        </div>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* 2. Controls & Fast Action Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
        {/* Modern Segmented Timeframe Switcher */}
        <div
          role="tablist"
          aria-label="Select timeframe"
          className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80 shadow-inner"
        >
          {timeFilterOptions.map((opt) => {
            const isActive = timeFilter === opt.value;
            return (
              <button
                key={opt.value}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => handlePeriodClick(opt.value)}
                className={`relative px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-card text-primary shadow-sm ring-1 ring-border font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Telemetry Refresh Button with live feedback */}
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh telemetry data"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            title="Refresh Telemetry"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 transition-transform ${
                isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'
              }`}
            />
            <span className="hidden md:inline font-medium">
              {isRefreshing ? t('common.loading') : t('common.refresh')}
            </span>
          </button>
        ) : null}

        {/* Export Telemetry Quick Action */}
        <button
          type="button"
          onClick={onExport || (() => alert('Telemetry report generated (CSV/JSON)'))}
          aria-label={t('dashboard.exportTelemetry')}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
          title={t('dashboard.exportTelemetry')}
        >
          <DownloadCloud className="h-3.5 w-3.5 text-primary" />
          <span className="hidden lg:inline">{t('dashboard.exportTelemetry')}</span>
        </button>

        {/* Primary Call to Action: Onboard Business */}
        <button
          type="button"
          onClick={() => alert('Open Onboard Enterprise Tenant Modal')}
          aria-label={t('dashboard.onboardTenant')}
          className="group flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/20 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>{t('dashboard.onboardTenant')}</span>
          <span className="hidden sm:inline-block ml-0.5 px-1.5 py-0.2 text-[10px] rounded bg-white/20 font-mono">
            +N
          </span>
        </button>
      </div>
    </header>
  );
};

export default memo(HomeHeader);