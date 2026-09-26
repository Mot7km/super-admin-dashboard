import { memo, useId, type FC, type ReactNode, type ComponentType, type KeyboardEvent } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type SparklineVariant =
  | 'primary'
  | 'secondary'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'purple'
  | 'blue';

export type SparklineDataPoint = {
  value?: number;
  label?: string;
  [key: string]: any;
};

export type SparklineKpiCardProps = {
  title: string;
  value: string | number;
  change?: string;
  changeTrend?: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  subValue?: string | ReactNode;
  icon: ComponentType<{ className?: string }>;
  variant?: SparklineVariant;
  data: SparklineDataPoint[] | number[];
  dataKey?: string;
  formatTooltip?: (val: number) => string;
  height?: number;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
};

const VARIANT_CONFIG: Record<
  SparklineVariant,
  {
    gradientStop: string;
    strokeColor: string;
    laserColor: string;
    ambientSpot: string;
    iconBg: string;
    iconRing: string;
    iconColor: string;
    iconGlow: string;
    hoverBorder: string;
  }
> = {
  primary: {
    gradientStop: '#38bdf8',
    strokeColor: '#38bdf8',
    laserColor: '#38bdf8',
    ambientSpot: 'bg-sky-500/20',
    iconBg: 'bg-primary/10 dark:bg-primary/15',
    iconRing: 'ring-primary/25',
    iconColor: 'text-primary',
    iconGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.25)]',
    hoverBorder: 'hover:border-primary/50',
  },
  secondary: {
    gradientStop: '#2dd4bf',
    strokeColor: '#2dd4bf',
    laserColor: '#2dd4bf',
    ambientSpot: 'bg-teal-500/20',
    iconBg: 'bg-secondary/10 dark:bg-secondary/15',
    iconRing: 'ring-secondary/25',
    iconColor: 'text-secondary',
    iconGlow: 'shadow-[0_0_15px_rgba(45,212,191,0.25)]',
    hoverBorder: 'hover:border-secondary/50',
  },
  emerald: {
    gradientStop: '#10b981',
    strokeColor: '#10b981',
    laserColor: '#10b981',
    ambientSpot: 'bg-emerald-500/20',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconRing: 'ring-emerald-500/25',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    iconGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    hoverBorder: 'hover:border-emerald-500/50',
  },
  amber: {
    gradientStop: '#f59e0b',
    strokeColor: '#f59e0b',
    laserColor: '#f59e0b',
    ambientSpot: 'bg-amber-500/20',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconRing: 'ring-amber-500/25',
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    hoverBorder: 'hover:border-amber-500/50',
  },
  rose: {
    gradientStop: '#f43f5e',
    strokeColor: '#f43f5e',
    laserColor: '#f43f5e',
    ambientSpot: 'bg-rose-500/20',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    iconRing: 'ring-rose-500/25',
    iconColor: 'text-rose-500 dark:text-rose-400',
    iconGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    hoverBorder: 'hover:border-rose-500/50',
  },
  purple: {
    gradientStop: '#a855f7',
    strokeColor: '#a855f7',
    laserColor: '#a855f7',
    ambientSpot: 'bg-purple-500/20',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/15',
    iconRing: 'ring-purple-500/25',
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    hoverBorder: 'hover:border-purple-500/50',
  },
  blue: {
    gradientStop: '#3b82f6',
    strokeColor: '#3b82f6',
    laserColor: '#3b82f6',
    ambientSpot: 'bg-blue-500/20',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconRing: 'ring-blue-500/25',
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    hoverBorder: 'hover:border-blue-500/50',
  },
};

export const SparklineKpiCard: FC<SparklineKpiCardProps> = ({
  title,
  value,
  change,
  changeTrend = 'up',
  changeLabel,
  subValue,
  icon: Icon,
  variant = 'primary',
  data,
  dataKey = 'value',
  formatTooltip,
  height = 54,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const chartId = useId().replace(/:/g, '');
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.primary;
  const isInteractive = Boolean(onClick);

  // Normalize data array
  const normalizedData: SparklineDataPoint[] = Array.isArray(data)
    ? data.map((item, index) =>
        typeof item === 'number'
          ? { value: item, label: `Point ${index + 1}` }
          : { ...item, value: item[dataKey] ?? item.value ?? 0 }
      )
    : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  const renderTrendIcon = () => {
    if (changeTrend === 'up') return <TrendingUp className="h-3 w-3 shrink-0" />;
    if (changeTrend === 'down') return <TrendingDown className="h-3 w-3 shrink-0" />;
    return <Minus className="h-3 w-3 shrink-0" />;
  };

  const getTrendBadgeClasses = () => {
    if (changeTrend === 'up') {
      return 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.3)]';
    }
    if (changeTrend === 'down') {
      return 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/25 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.3)]';
    }
    return 'text-muted-foreground bg-surface-subtle/80 border-border/80';
  };

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || title}
      className={`group relative flex flex-col justify-between rounded-xl p-5 transition-all duration-300 select-none overflow-hidden ${
        /* Base Glassmorphic Surface */
        'bg-gradient-to-br from-card/95 via-card/85 to-card/75 dark:from-card/90 dark:via-card/70 dark:to-card/50 backdrop-blur-xl'
      } ${
        /* Specular Bevel Edge */
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
      } ${
        /* Border & Interactive Behavior */
        isInteractive
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
          : 'hover:-translate-y-0.5 hover:shadow-lg'
      } border border-border/80 dark:border-white/[0.08] ${config.hoverBorder} ${className}`}
    >
      {/* 1. Atmospheric Ambient Flare Behind Icon */}
      <div
        className={`pointer-events-none absolute -top-10 -right-10 rtl:-right-auto rtl:-left-10 h-32 w-32 rounded-full blur-3xl opacity-20 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${config.ambientSpot}`}
      />

      {/* 2. Top Laser Beam (Razor Hairline + Blurred Ambient Glow) */}
      <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
        <div
          className="h-full w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${config.laserColor} 50%, transparent 100%)`,
          }}
        />
      </div>
      <div
        className="absolute top-0 inset-x-12 h-[3px] blur-[3px] opacity-30 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: config.laserColor }}
      />

      {/* 3. Row 1: Label & Themed Tactile Icon */}
      <div className="relative flex items-center justify-between gap-2 z-10">
        <span className="text-xs font-extrabold text-muted-foreground/90 tracking-wide truncate font-sans">
          {title}
        </span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.iconBg} ring-1 ${config.iconRing} ${config.iconColor} ${config.iconGlow} shadow-2xs group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shrink-0`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* 4. Row 2: Value & Delta Tag */}
      <div className="relative mt-3.5 z-10">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-foreground font-mono tabular-nums leading-none">
            {value}
          </span>
          {change && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold border px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-2xs font-mono tracking-tight ${getTrendBadgeClasses()}`}
            >
              {renderTrendIcon()}
              <span>{change}</span>
              {changeLabel && (
                <span className="text-[10px] opacity-75 font-normal ml-0.5 rtl:ml-0 rtl:mr-0.5">
                  {changeLabel}
                </span>
              )}
            </span>
          )}
        </div>

        {subValue && (
          <p className="mt-1.5 text-xs font-semibold text-muted-foreground/80 truncate font-mono">
            {subValue}
          </p>
        )}
      </div>

      {/* 5. Row 3: Sparkline Micro Chart */}
      <div className="relative mt-3 w-full pt-1 z-10" style={{ height: `${height}px` }}>
        {normalizedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={normalizedData} margin={{ top: 3, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.gradientStop} stopOpacity={0.45} />
                  <stop offset="60%" stopColor={config.gradientStop} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={config.gradientStop} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: config.gradientStop, strokeWidth: 1.5, strokeDasharray: '2 2' }}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.90)',
                  backdropFilter: 'blur(12px)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#ffffff',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                }}
                formatter={(val: unknown) => [
                  formatTooltip ? formatTooltip(Number(val || 0)) : String(val),
                  title,
                ]}
                labelStyle={{ display: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.strokeColor}
                strokeWidth={2.2}
                fill={`url(#grad-${chartId})`}
                dot={false}
                isAnimationActive={true}
                animationDuration={1100}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center border-t border-dashed border-border/40">
            <span className="text-[10px] text-muted-foreground font-mono">No telemetry data</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SparklineKpiCard);
