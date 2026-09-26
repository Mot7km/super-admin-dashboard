import {
  memo,
  useState,
  useTransition,
  useMemo,
  type FC,
} from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Crown,
  Zap,
  Rocket,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { RevenuePoint, SubscriptionPlanShare } from '../home.types';

type HomeChartsProps = {
  revenueTrajectoryData: RevenuePoint[];
  subscriptionPlanData: SubscriptionPlanShare[];
};

type MetricMode = 'mrr' | 'revenue' | 'newBusinesses' | 'activeUsers';
type PieMode = 'tenants' | 'mrr';

type TooltipPayloadItem = {
  value: number;
  dataKey: string;
  payload: RevenuePoint;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter: (v: number) => string;
  metricLabel: string;
  color: string;
};

// Memoized Area Chart Tooltip
const CustomChartTooltip: FC<CustomTooltipProps> = memo(({
  active,
  payload,
  label,
  formatter,
  metricLabel,
  color,
}) => {
  if (!active || !payload || !payload.length) return null;

  const currentVal = payload[0].value;

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-dropdown text-xs min-w-[170px] animate-fade-in">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2 text-muted-foreground">
        <span className="font-semibold text-[11px]">{label} 2025</span>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {metricLabel}
        </span>
        <span className="text-base font-black text-foreground font-mono tabular-nums">
          {formatter(currentVal)}
        </span>
      </div>

      <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center gap-1 text-[10px] text-success-text font-bold">
        <TrendingUp className="h-3 w-3" />
        <span>Paced for +14.8% growth</span>
      </div>
    </div>
  );
});

CustomChartTooltip.displayName = 'CustomChartTooltip';

type PieTooltipPayloadItem = {
  name: string;
  value: number;
  payload: SubscriptionPlanShare & { numericMrr: number };
};

type CustomPieTooltipProps = {
  active?: boolean;
  payload?: PieTooltipPayloadItem[];
  mode: PieMode;
};

// Memoized Donut / Pie Tooltip
const CustomPieTooltip: FC<CustomPieTooltipProps> = memo(({ active, payload, mode }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-dropdown text-xs min-w-[160px] animate-fade-in">
      <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 mb-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-extrabold text-foreground">{data.name} Plan</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[11px]">
            {mode === 'tenants' ? 'Tenants:' : 'MRR Share:'}
          </span>
          <span className="font-mono font-bold text-foreground">
            {mode === 'tenants' ? `${data.tenants} (${data.percentage}%)` : data.mrr}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[11px]">
            {mode === 'tenants' ? 'Revenue:' : 'Tenants:'}
          </span>
          <span className="font-mono font-bold text-muted-foreground">
            {mode === 'tenants' ? data.mrr : `${data.tenants} (${data.percentage}%)`}
          </span>
        </div>
      </div>
    </div>
  );
});

CustomPieTooltip.displayName = 'CustomPieTooltip';

// Plan specific luxury styling & iconography
const PLAN_TIER_META: Record<string, {
  icon: typeof Crown;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  color: string;
}> = {
  Enterprise: {
    icon: Crown,
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-500',
    borderColor: 'hover:border-blue-500/50',
    color: '#3B82F6',
  },
  Professional: {
    icon: Zap,
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-500',
    borderColor: 'hover:border-emerald-500/50',
    color: '#10B981',
  },
  Starter: {
    icon: Rocket,
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-500',
    borderColor: 'hover:border-purple-500/50',
    color: '#8B5CF6',
  },
};

const HomeCharts: FC<HomeChartsProps> = ({
  revenueTrajectoryData,
  subscriptionPlanData,
}) => {
  const { t } = useTranslation();
  const [metricMode, setMetricMode] = useState<MetricMode>('mrr');
  const [pieMode, setPieMode] = useState<PieMode>('tenants');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  // Metric configurations for Area Chart
  const modeConfigs = useMemo(() => ({
    mrr: {
      label: t('dashboard.charts.mrrGrowth'),
      dataKey: 'mrr' as const,
      formatter: (v: number) => `$${v.toLocaleString()}`,
      color: '#3B82F6',
    },
    revenue: {
      label: t('dashboard.charts.grossRevenue'),
      dataKey: 'revenue' as const,
      formatter: (v: number) => `$${v.toLocaleString()}`,
      color: '#10B981',
    },
    newBusinesses: {
      label: t('dashboard.charts.newBusinesses'),
      dataKey: 'newBusinesses' as const,
      formatter: (v: number) => `+${v} Businesses`,
      color: '#06B6D4',
    },
    activeUsers: {
      label: t('dashboard.charts.activeUsers'),
      dataKey: 'activeUsers' as const,
      formatter: (v: number) => `${v.toLocaleString()} Users`,
      color: '#8B5CF6',
    },
  }), [t]);

  const activeConfig = modeConfigs[metricMode];

  // Derived Metric Stats for the Active Selected Mode
  const metricStats = useMemo(() => {
    if (!revenueTrajectoryData.length) {
      return { current: '$0', peak: '$0', growth: '+0%' };
    }
    const values = revenueTrajectoryData.map((d) => d[activeConfig.dataKey]);
    const current = values[values.length - 1];
    const peak = Math.max(...values);
    const first = values[0];
    const growth = first > 0 ? (((current - first) / first) * 100).toFixed(1) : '0';

    return {
      current: activeConfig.formatter(current),
      peak: activeConfig.formatter(peak),
      growth: `+${growth}%`,
    };
  }, [revenueTrajectoryData, activeConfig]);

  // Formatted Pie Chart Data with vibrant assigned colors
  const pieChartData = useMemo(() => {
    return subscriptionPlanData.map((plan) => {
      const meta = PLAN_TIER_META[plan.name] || PLAN_TIER_META.Enterprise;
      const numericMrr = Number(plan.mrr.replace(/[^0-9]/g, '')) || 0;
      return {
        ...plan,
        color: meta.color,
        numericMrr,
        value: pieMode === 'tenants' ? plan.tenants : numericMrr,
      };
    });
  }, [subscriptionPlanData, pieMode]);

  // Dynamic HUD readout (changes on hover or stays default)
  const activePlan = activePieIndex !== null ? pieChartData[activePieIndex] : null;

  const hudData = useMemo(() => {
    if (activePlan) {
      return {
        label: `${activePlan.name} Tier`,
        color: activePlan.color,
        value: pieMode === 'tenants' ? `${activePlan.tenants}` : activePlan.mrr,
        badge: `${activePlan.percentage}% Share`,
        badgeColor: 'text-foreground bg-surface-subtle border border-border',
      };
    }

    if (pieMode === 'tenants') {
      const totalTenants = subscriptionPlanData.reduce((acc, p) => acc + p.tenants, 0);
      return {
        label: t('dashboard.charts.totalBase'),
        color: 'var(--muted-foreground)',
        value: totalTenants.toLocaleString(),
        badge: '100% Active',
        badgeColor: 'text-success-text bg-success-bg border border-success/30',
      };
    }

    return {
      label: 'Monthly ARR',
      color: 'var(--muted-foreground)',
      value: '$128,450',
      badge: '100% MRR',
      badgeColor: 'text-primary bg-primary/10 border border-primary/30',
    };
  }, [activePlan, pieMode, subscriptionPlanData, t]);

  const handleMetricChange = (mode: MetricMode) => {
    startTransition(() => {
      setMetricMode(mode);
    });
  };

  const handlePieModeChange = (mode: PieMode) => {
    startTransition(() => {
      setPieMode(mode);
    });
  };

  return (
    <section aria-label="Visual Analytics Studio" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ========================================================================= */}
      {/* 1. Master Trajectory Studio (8 cols)                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-ambient lg:col-span-8">
        <div>
          {/* Top Row: Title, Subtitle, & Metric Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/80 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground">
                  {t('dashboard.charts.trajectoryTitle')}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Pro Forecasting</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('dashboard.charts.trajectorySubtitle')}
              </p>
            </div>

            {/* Metric Mode Switcher Pills */}
            <div
              role="tablist"
              aria-label="Select growth metric"
              className="inline-flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border/80 self-start sm:self-auto"
            >
              {(['mrr', 'revenue', 'newBusinesses', 'activeUsers'] as MetricMode[]).map((mode) => {
                const isSelected = metricMode === mode;
                return (
                  <button
                    key={mode}
                    role="tab"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => handleMetricChange(mode)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-card text-primary shadow-xs ring-1 ring-border font-extrabold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode === 'mrr' && 'MRR'}
                    {mode === 'revenue' && 'Revenue'}
                    {mode === 'newBusinesses' && 'Tenants'}
                    {mode === 'activeUsers' && 'Users'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inline Telemetry Bar (Saves ~65px) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 my-2.5 px-1 py-1.5 rounded-lg bg-surface-subtle/50 border border-border/50 text-xs">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">
                  {t('dashboard.charts.currentValue')}:
                </span>
                <strong className="text-sm font-black text-foreground font-mono tabular-nums">
                  {metricStats.current}
                </strong>
              </span>

              <span className="text-border/80 text-[10px]">•</span>

              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">
                  {t('dashboard.charts.peakMetric')}:
                </span>
                <strong className="text-xs font-black text-foreground/90 font-mono tabular-nums">
                  {metricStats.peak}
                </strong>
              </span>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 dark:text-emerald-400 text-[11px] font-mono font-extrabold shadow-2xs">
              <TrendingUp className="h-3 w-3" />
              <span>{metricStats.growth} {t('dashboard.charts.avgGrowth')}</span>
            </span>
          </div>

          {/* High-Performance Recharts Area Chart (Calibrated to h-44 sm:h-48 for optimal density) */}
          <div className="h-44 sm:h-48 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrajectoryData}
                margin={{ top: 8, right: 12, left: -14, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeConfig.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                />
                <Tooltip
                  content={
                    <CustomChartTooltip
                      formatter={activeConfig.formatter}
                      metricLabel={activeConfig.label}
                      color={activeConfig.color}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey={activeConfig.dataKey}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricGradient)"
                  activeDot={{
                    r: 5,
                    fill: activeConfig.color,
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Executive Subscription Donut / Pie Chart (4 cols)                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-ambient lg:col-span-4">
        <div>
          {/* Header & Lens Mode Switcher */}
          <div className="flex items-center justify-between pb-2.5 border-b border-border/80">
            <div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-base font-extrabold text-foreground">
                  {t('dashboard.charts.subscriptionMatrix')}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('dashboard.charts.matrixSubtitle')}
              </p>
            </div>

            {/* Toggle: By Tenants vs By MRR */}
            <div
              role="tablist"
              aria-label="Switch distribution view"
              className="inline-flex items-center p-0.5 rounded-xl bg-surface-subtle border border-border/80 shadow-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={pieMode === 'tenants'}
                onClick={() => handlePieModeChange('tenants')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  pieMode === 'tenants'
                    ? 'bg-card text-primary shadow-xs ring-1 ring-border font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('dashboard.charts.byTenants')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={pieMode === 'mrr'}
                onClick={() => handlePieModeChange('mrr')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  pieMode === 'mrr'
                    ? 'bg-card text-primary shadow-xs ring-1 ring-border font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('dashboard.charts.byMrr')}
              </button>
            </div>
          </div>

          {/* Luxury Executive Donut Chart with Dynamic Central HUD - Calibrated to h-36 */}
          <div className="relative h-36 w-full flex items-center justify-center my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="var(--card)"
                  strokeWidth={2.5}
                  cornerRadius={4}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  {pieChartData.map((entry, index) => {
                    const isHovered = activePieIndex === index;
                    return (
                      <Cell
                        key={`pie-cell-${entry.name}`}
                        fill={entry.color}
                        opacity={
                          activePieIndex === null || isHovered ? 1 : 0.3
                        }
                        className="transition-all duration-300 cursor-pointer"
                        style={{
                          filter: isHovered ? `drop-shadow(0 0 8px ${entry.color}80)` : 'none',
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomPieTooltip mode={pieMode} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Central Cockpit HUD Dial */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-surface/90 border border-border/80 shadow-xs flex flex-col items-center justify-center p-1 backdrop-blur-sm transition-all duration-300">
                <span
                  className="text-[9px] uppercase font-bold tracking-wider truncate max-w-[65px]"
                  style={{ color: hudData.color }}
                >
                  {hudData.label}
                </span>
                <span className="text-base font-black text-foreground font-mono tabular-nums leading-tight truncate max-w-[72px]">
                  {hudData.value}
                </span>
                <span className={`text-[8px] font-bold px-1 py-0.2 rounded-md mt-0.5 ${hudData.badgeColor}`}>
                  {hudData.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Tier Intelligence List with Direct 2-Way Sync (Compact high-density rows) */}
          <div className="space-y-1.5 mt-1">
            {pieChartData.map((plan, idx) => {
              const meta = PLAN_TIER_META[plan.name] || PLAN_TIER_META.Enterprise;
              const Icon = meta.icon;
              const isHovered = activePieIndex === idx;

              return (
                <div
                  key={plan.name}
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  className={`group relative p-1.5 px-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'bg-surface-subtle shadow-xs -translate-y-0.5'
                      : 'bg-surface-subtle/50 border-border/60 hover:border-border'
                  }`}
                  style={{
                    borderColor: isHovered ? plan.color : undefined,
                  }}
                >
                  {/* Row 1: Icon, Tier Name, Share Tag, and MRR */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${meta.badgeBg} ${meta.badgeText} ring-1 ring-inset ring-current/20`}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-foreground">
                            {plan.name}
                          </span>
                          <span
                            className="text-[9px] font-extrabold px-1 py-0.2 rounded font-mono"
                            style={{
                              backgroundColor: `${plan.color}20`,
                              color: plan.color,
                            }}
                          >
                            {plan.percentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {plan.tenants} Tenants
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-foreground font-mono tabular-nums block">
                        {plan.mrr}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono">
                        ~${Math.round(plan.numericMrr / plan.tenants)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Micro Proportion Progress Bar */}
                  <div className="mt-1 h-0.5 w-full rounded-sm bg-border/50 overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all duration-500"
                      style={{
                        width: `${plan.percentage}%`,
                        backgroundColor: plan.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Link & Context */}
        <div className="mt-2.5 pt-2 border-t border-border/80 flex items-center justify-between text-xs">
          <div className="text-muted-foreground text-[11px]">
            <span>{t('dashboard.charts.avgTenantLtv')}: </span>
            <span className="font-extrabold text-foreground font-mono">$3,450 ARR</span>
          </div>

          <NavLink
            to="/subscriptions"
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline hover:text-primary-dark transition-colors text-[11px]"
          >
            <span>Manage Plans</span>
            <ArrowUpRight className="h-3 w-3" />
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default memo(HomeCharts);