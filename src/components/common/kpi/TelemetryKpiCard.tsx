import { memo, type FC, type ReactNode, type ComponentType, type KeyboardEvent } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type KpiVariant = 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'purple' | 'cyan';

export type KpiBadgeConfig = {
  text: string;
  trend?: 'up' | 'down' | 'neutral';
  isLive?: boolean;
  icon?: ComponentType<{ className?: string }>;
  variant?: KpiVariant;
};

export type KpiFooterConfig = {
  label: string;
  value: ReactNode;
  icon?: ComponentType<{ className?: string }>;
};

export type TelemetryKpiCardProps = {
  title: string;
  value: string | number;
  subValue?: string | ReactNode;
  icon: ComponentType<{ className?: string }>;
  variant?: KpiVariant;
  badge?: KpiBadgeConfig;
  progress?: {
    value: number; // 0 to 100
    color?: string;
  };
  footer?: KpiFooterConfig;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
};

const VARIANT_CONFIG: Record<
  KpiVariant,
  {
    laserColor: string;
    ambientSpot: string;
    iconGradient: string;
    iconBorder: string;
    iconColor: string;
    iconGlow: string;
    activeBorder: string;
    activeRing: string;
    activeGlow: string;
    hoverBorder: string;
    progressFill: string;
    valueColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    badgeGlow: string;
  }
> = {
  primary: {
    laserColor: 'var(--primary, #38bdf8)',
    ambientSpot: 'bg-primary/20',
    iconGradient: 'from-primary/20 via-primary/10 to-transparent',
    iconBorder: 'border-primary/30',
    iconColor: 'text-primary',
    iconGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.25)]',
    activeBorder: 'border-primary/70',
    activeRing: 'ring-primary/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(56,189,248,0.30)]',
    hoverBorder: 'hover:border-primary/50',
    progressFill: 'from-primary via-primary to-primary-light',
    valueColor: 'text-foreground',
    badgeBg: 'bg-primary/10 dark:bg-primary/15',
    badgeText: 'text-primary',
    badgeBorder: 'border-primary/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(56,189,248,0.3)]',
  },
  success: {
    laserColor: '#10b981',
    ambientSpot: 'bg-emerald-500/20',
    iconGradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    iconBorder: 'border-emerald-500/30',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    iconGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    activeBorder: 'border-emerald-500/70',
    activeRing: 'ring-emerald-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(16,185,129,0.30)]',
    hoverBorder: 'hover:border-emerald-500/50',
    progressFill: 'from-emerald-500 via-teal-400 to-emerald-300',
    valueColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(16,185,129,0.3)]',
  },
  warning: {
    laserColor: '#f59e0b',
    ambientSpot: 'bg-amber-500/20',
    iconGradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    iconBorder: 'border-amber-500/30',
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    activeBorder: 'border-amber-500/70',
    activeRing: 'ring-amber-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(245,158,11,0.30)]',
    hoverBorder: 'hover:border-amber-500/50',
    progressFill: 'from-amber-500 via-yellow-400 to-amber-300',
    valueColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(245,158,11,0.3)]',
  },
  destructive: {
    laserColor: '#f43f5e',
    ambientSpot: 'bg-rose-500/20',
    iconGradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
    iconBorder: 'border-rose-500/30',
    iconColor: 'text-rose-500 dark:text-rose-400',
    iconGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    activeBorder: 'border-rose-500/70',
    activeRing: 'ring-rose-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(244,63,94,0.30)]',
    hoverBorder: 'hover:border-rose-500/50',
    progressFill: 'from-rose-500 via-red-500 to-orange-400',
    valueColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(244,63,94,0.3)]',
  },
  info: {
    laserColor: '#3b82f6',
    ambientSpot: 'bg-blue-500/20',
    iconGradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
    iconBorder: 'border-blue-500/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    activeBorder: 'border-blue-500/70',
    activeRing: 'ring-blue-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(59,130,246,0.30)]',
    hoverBorder: 'hover:border-blue-500/50',
    progressFill: 'from-blue-500 via-sky-400 to-cyan-300',
    valueColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(59,130,246,0.3)]',
  },
  purple: {
    laserColor: '#a855f7',
    ambientSpot: 'bg-purple-500/20',
    iconGradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
    iconBorder: 'border-purple-500/30',
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    activeBorder: 'border-purple-500/70',
    activeRing: 'ring-purple-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(168,85,247,0.30)]',
    hoverBorder: 'hover:border-purple-500/50',
    progressFill: 'from-purple-500 via-fuchsia-400 to-indigo-300',
    valueColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    badgeText: 'text-purple-600 dark:text-purple-400',
    badgeBorder: 'border-purple-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(168,85,247,0.3)]',
  },
  cyan: {
    laserColor: '#06b6d4',
    ambientSpot: 'bg-cyan-500/20',
    iconGradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
    iconBorder: 'border-cyan-500/30',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    iconGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    activeBorder: 'border-cyan-500/70',
    activeRing: 'ring-cyan-500/30',
    activeGlow: 'shadow-[0_10px_30px_-5px_rgba(6,182,212,0.30)]',
    hoverBorder: 'hover:border-cyan-500/50',
    progressFill: 'from-cyan-500 via-sky-400 to-teal-300',
    valueColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    badgeBorder: 'border-cyan-500/25',
    badgeGlow: 'shadow-[0_2px_8px_-2px_rgba(6,182,212,0.3)]',
  },
};

export const TelemetryKpiCard: FC<TelemetryKpiCardProps> = ({
  title,
  value,
  subValue,
  icon: Icon,
  variant = 'primary',
  badge,
  progress,
  footer,
  isActive = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const styles = VARIANT_CONFIG[variant];
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const badgeConfig = badge?.variant ? VARIANT_CONFIG[badge.variant] : styles;

  const renderBadgeIcon = () => {
    if (badge?.icon) {
      const BadgeCustomIcon = badge.icon;
      return <BadgeCustomIcon className="h-3 w-3 shrink-0" />;
    }
    if (badge?.isLive) {
      return (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: badgeConfig.laserColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: badgeConfig.laserColor }}
          />
        </span>
      );
    }
    if (badge?.trend === 'up') {
      return <TrendingUp className="h-3 w-3 shrink-0" />;
    }
    if (badge?.trend === 'down') {
      return <TrendingDown className="h-3 w-3 shrink-0" />;
    }
    if (badge?.trend === 'neutral') {
      return <Minus className="h-3 w-3 shrink-0" />;
    }
    return null;
  };

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isInteractive ? isActive : undefined}
      aria-label={ariaLabel || title}
      className={`group relative overflow-hidden rounded-xl p-4 sm:p-5 transition-all duration-300 select-none text-left rtl:text-right ${
        /* Base Glassmorphic Surface */
        'bg-gradient-to-br from-card/95 via-card/85 to-card/75 dark:from-card/90 dark:via-card/70 dark:to-card/50 backdrop-blur-xl'
      } ${
        /* Specular Bevel Edge */
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
      } ${
        /* Border & Interactive Behavior */
        isInteractive
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
          : 'shadow-sm'
      } ${
        isActive
          ? `border ${styles.activeBorder} ${styles.activeGlow} ring-2 ${styles.activeRing}`
          : `border border-border/80 dark:border-white/[0.08] ${styles.hoverBorder} hover:shadow-lg`
      } ${className}`}
    >
      {/* 1. Atmospheric Ambient Aura in Corner */}
      <div
        className={`pointer-events-none absolute -top-12 -left-12 rtl:-left-auto rtl:-right-12 h-36 w-36 rounded-full blur-3xl opacity-20 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${styles.ambientSpot}`}
      />

      {/* 2. Top Laser Beam (Razor Hairline + Blurred Ambient Glow) */}
      <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
        <div
          className="h-full w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${styles.laserColor} 50%, transparent 100%)`,
          }}
        />
      </div>
      <div
        className="absolute top-0 inset-x-12 h-[3px] blur-[3px] opacity-30 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: styles.laserColor }}
      />

      {/* 3. Top Row: Tactile Icon Bevel + Frosted Badge */}
      <div className="relative flex items-center justify-between gap-2 z-10">
        <div
          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${styles.iconGradient} border ${styles.iconBorder} ${styles.iconColor} ${styles.iconGlow} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-all duration-300`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {badge && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg ${badgeConfig.badgeBg} border ${badgeConfig.badgeBorder} ${badgeConfig.badgeGlow} px-2.5 py-0.5 text-[11px] font-extrabold ${badgeConfig.badgeText} font-mono tracking-tight backdrop-blur-md shadow-2xs`}
          >
            {renderBadgeIcon()}
            <span>{badge.text}</span>
          </span>
        )}
      </div>

      {/* 4. Middle Section: Title + Large Crisp Metric */}
      <div className="relative mt-3.5 z-10">
        <span className="text-[11px] font-extrabold text-muted-foreground/90 uppercase tracking-widest block font-sans">
          {title}
        </span>
        <div className="flex items-baseline justify-between mt-1 gap-2 flex-wrap">
          <span
            className={`text-2xl sm:text-3xl lg:text-[32px] font-black font-mono tabular-nums tracking-tight leading-none ${styles.valueColor}`}
          >
            {value}
          </span>
          {subValue && (
            <span className="px-2 py-0.5 rounded-md bg-surface-subtle/80 dark:bg-white/[0.04] border border-border/60 dark:border-white/[0.06] text-[11px] font-bold text-muted-foreground font-mono shadow-2xs">
              {subValue}
            </span>
          )}
        </div>
      </div>

      {/* 5. Precision Telemetry Gauge (Groove + Gradient Capsule) */}
      {progress && (
        <div className="relative mt-3.5 z-10">
          <div className="h-2 w-full rounded-md bg-surface-subtle dark:bg-black/30 p-[1.5px] ring-1 ring-border/50 dark:ring-white/[0.05] shadow-inner overflow-hidden">
            <div
              className={`h-full rounded-sm bg-gradient-to-r ${progress.color || styles.progressFill} transition-all duration-700 ease-out relative shadow-xs`}
              style={{ width: `${Math.min(Math.max(progress.value, 0), 100)}%` }}
            >
              {/* Luminous Capsule Leading Sheen */}
              <div className="absolute right-0 top-0 bottom-0 w-2 rounded-sm bg-white/40 shadow-[0_0_6px_#fff]" />
            </div>
          </div>
        </div>
      )}

      {/* 6. Bottom Telemetry Footer Row */}
      {footer && (
        <div className="relative mt-3.5 pt-2.5 border-t border-border/50 dark:border-white/[0.06] flex items-center justify-between text-xs z-10">
          <span className="text-muted-foreground font-medium flex items-center gap-1.5">
            {footer.icon && <footer.icon className="h-3.5 w-3.5 text-muted-foreground/80" />}
            {footer.label}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums tracking-tight">
            {footer.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(TelemetryKpiCard);
