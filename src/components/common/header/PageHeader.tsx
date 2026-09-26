import { memo, useTransition, type FC, type ReactNode, type ComponentType } from 'react';
import { RefreshCw, DownloadCloud, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';

export type HeaderBadgeVariant = 'success' | 'primary' | 'warning' | 'destructive' | 'info' | 'purple' | 'cyan' | 'neutral';

export type PageHeaderBadge = {
  text: string;
  variant?: HeaderBadgeVariant;
  isLive?: boolean;
  icon?: ComponentType<{ className?: string }>;
  tooltip?: string | ReactNode;
};

export type PageHeaderAction = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  badge?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
};

export type TimeFilterOption = {
  value: string;
  label: string;
};

export type PageHeaderProps = {
  // Title & Icon
  title: string;
  subtitle?: string | ReactNode;
  icon?: ComponentType<{ className?: string }>;
  iconVariant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'purple' | 'cyan';

  // Breadcrumbs & Status Badges
  breadcrumb?: string | ReactNode;
  badges?: PageHeaderBadge[];

  // Timeframe Segmented Selector
  timeFilter?: {
    value: string;
    options: TimeFilterOption[];
    onChange: (value: string) => void;
    ariaLabel?: string;
  };

  // Quick Action Utilities
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExport?: () => void;
  exportLabel?: string;

  // Primary Call to Action
  primaryAction?: PageHeaderAction;

  // Custom Extra Controls Slot
  children?: ReactNode;
  className?: string;
};

const BADGE_STYLES: Record<
  HeaderBadgeVariant,
  {
    bg: string;
    text: string;
    border: string;
    dotBg: string;
  }
> = {
  primary: {
    bg: 'bg-primary/10 dark:bg-primary/15',
    text: 'text-primary',
    border: 'border-primary/25',
    dotBg: 'bg-primary',
  },
  success: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/25',
    dotBg: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/25',
    dotBg: 'bg-amber-500',
  },
  destructive: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/25',
    dotBg: 'bg-rose-500',
  },
  info: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/25',
    dotBg: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/25',
    dotBg: 'bg-purple-500',
  },
  cyan: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/25',
    dotBg: 'bg-cyan-500',
  },
  neutral: {
    bg: 'bg-surface-subtle border-border/80',
    text: 'text-muted-foreground',
    border: 'border-border/80',
    dotBg: 'bg-muted-foreground',
  },
};

const ICON_VARIANTS = {
  primary: 'from-primary/20 via-primary/10 to-transparent border-primary/25 text-primary',
  secondary: 'from-secondary/20 via-secondary/10 to-transparent border-secondary/25 text-secondary',
  emerald: 'from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-500/25 text-emerald-500 dark:text-emerald-400',
  amber: 'from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/25 text-amber-500 dark:text-amber-400',
  purple: 'from-purple-500/20 via-purple-500/10 to-transparent border-purple-500/25 text-purple-500 dark:text-purple-400',
  cyan: 'from-cyan-500/20 via-cyan-500/10 to-transparent border-cyan-500/25 text-cyan-500 dark:text-cyan-400',
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconVariant = 'primary',
  breadcrumb,
  badges = [],
  timeFilter,
  onRefresh,
  isRefreshing = false,
  onExport,
  exportLabel,
  primaryAction,
  children,
  className = '',
}) => {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();

  const handlePeriodChange = (val: string) => {
    if (timeFilter) {
      startTransition(() => {
        timeFilter.onChange(val);
      });
    }
  };

  return (
    <header
      className={`relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-border/70 dark:border-white/[0.08] pb-5 pt-1 ${className}`}
    >
      {/* 1. Left Tier: Identity, Title, Badges & Subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3.5">
          {Icon && (
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-br ${ICON_VARIANTS[iconVariant]} border flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {/* Title Row with Breadcrumb & Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight truncate">
                {title}
              </h1>

              {/* Breadcrumb Badge */}
              {breadcrumb && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 rtl:rotate-180 shrink-0" />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    {breadcrumb}
                  </span>
                </>
              )}

              {/* Status Badges */}
              {badges.map((badge, idx) => {
                const bStyle = BADGE_STYLES[badge.variant || 'success'];
                const BadgeIcon = badge.icon;

                return (
                  <div key={idx} className="group relative inline-flex items-center">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg ${bStyle.bg} border ${bStyle.border} px-2.5 py-0.5 text-xs font-bold ${bStyle.text} shadow-2xs font-mono tracking-tight cursor-default transition-all`}
                    >
                      {badge.isLive ? (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bStyle.dotBg}`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${bStyle.dotBg}`} />
                        </span>
                      ) : BadgeIcon ? (
                        <BadgeIcon className="h-3.5 w-3.5 shrink-0" />
                      ) : null}

                      <span>{badge.text}</span>
                    </div>

                    {/* Optional Tooltip Card */}
                    {badge.tooltip && (
                      <div className="pointer-events-none absolute left-0 rtl:left-auto rtl:right-0 top-full mt-2 hidden group-hover:flex flex-col gap-1 w-56 p-2.5 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-dialog text-[11px] text-foreground z-50 animate-in fade-in zoom-in-95 duration-200">
                        {typeof badge.tooltip === 'string' ? (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs leading-relaxed">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{badge.tooltip}</span>
                          </div>
                        ) : (
                          badge.tooltip
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Right Tier: Controls Toolbar & Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Modern Segmented Timeframe Switcher */}
        {timeFilter && (
          <div
            role="tablist"
            aria-label={timeFilter.ariaLabel || 'Select timeframe'}
            className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80 shadow-inner"
          >
            {timeFilter.options.map((opt) => {
              const isActive = timeFilter.value === opt.value;
              return (
                <button
                  key={opt.value}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handlePeriodChange(opt.value)}
                  className={`relative px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-card text-primary shadow-xs ring-1 ring-border/80 font-extrabold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Telemetry Refresh Button with live spinning feedback */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={t('common.refresh')}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            title={t('common.refresh')}
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
        )}

        {/* Export Telemetry Quick Action */}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            aria-label={exportLabel || t('common.export')}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
            title={exportLabel || t('common.export')}
          >
            <DownloadCloud className="h-3.5 w-3.5 text-primary" />
            <span className="hidden lg:inline">{exportLabel || t('common.export')}</span>
          </button>
        )}

        {/* Primary Call to Action */}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            aria-label={primaryAction.label}
            title={primaryAction.title || primaryAction.label}
            className="group flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark active:scale-95 px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {primaryAction.icon && (
              <primaryAction.icon className="h-4 w-4 transition-transform group-hover:scale-110 duration-200 shrink-0" />
            )}
            <span>{primaryAction.label}</span>
            {primaryAction.badge && (
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono font-bold">
                {primaryAction.badge}
              </span>
            )}
          </button>
        )}

        {/* Additional custom controls injected through children */}
        {children}
      </div>
    </header>
  );
};

export default memo(PageHeader);
