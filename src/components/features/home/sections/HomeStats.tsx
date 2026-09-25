import { memo, useMemo, type FC } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HeroKpi, SentinelMetric } from '../home.types';

type HomeStatsProps = {
  heroKpis: HeroKpi[];
  sentinelMetrics: SentinelMetric[];
};

// Distinct visual accents for the 4 Tier-1 KPIs
const KPI_THEMES: Record<string, {
  accentText: string;
  iconBg: string;
  iconRing: string;
  gradientStop: string;
  borderColor: string;
}> = {
  'mrr-revenue': {
    accentText: 'text-primary',
    iconBg: 'bg-primary/10 text-primary',
    iconRing: 'ring-primary/20',
    gradientStop: 'var(--primary)',
    borderColor: 'hover:border-primary/50',
  },
  'total-businesses': {
    accentText: 'text-secondary',
    iconBg: 'bg-secondary/10 text-secondary',
    iconRing: 'ring-secondary/20',
    gradientStop: 'var(--secondary)',
    borderColor: 'hover:border-secondary/50',
  },
  'platform-orders-volume': {
    accentText: 'text-chart-2',
    iconBg: 'bg-chart-2/10 text-chart-2',
    iconRing: 'ring-chart-2/20',
    gradientStop: 'var(--chart-2)',
    borderColor: 'hover:border-chart-2/50',
  },
  'active-users': {
    accentText: 'text-chart-4',
    iconBg: 'bg-chart-4/10 text-chart-4',
    iconRing: 'ring-chart-4/20',
    gradientStop: 'var(--chart-4)',
    borderColor: 'hover:border-chart-4/50',
  },
};

const HomeStats: FC<HomeStatsProps> = ({ heroKpis, sentinelMetrics }) => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();

  // Navigation route mapping for Sentinel Alert Strip
  const sentinelRouteMap: Record<string, string> = useMemo(() => ({
    'expiring-subscriptions': '/subscriptions',
    'churned-businesses': '/businesses',
    'support-tickets': '/support',
    'api-throughput-errors': '/system/system-health',
  }), []);

  return (
    <section aria-label="Key Performance Indicators" className="space-y-4">
      {/* ========================================================================= */}
      {/* TIER 1: The 4 Strategic Headline KPIs                                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {heroKpis.map((kpi) => {
          const theme = KPI_THEMES[kpi.id] || KPI_THEMES['mrr-revenue'];

          return (
            <div
              key={kpi.id}
              className={`group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-ambient transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.borderColor} overflow-hidden`}
            >
              {/* Subtle top edge glow bar */}
              <div
                className="absolute top-0 inset-x-0 h-1 opacity-40 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: theme.gradientStop }}
              />

              {/* Row 1: Label & Themed Icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground tracking-wide">
                  {t(kpi.titleKey)}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme.iconBg} ring-1 ${theme.iconRing} group-hover:scale-110 transition-transform duration-300`}
                >
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>

              {/* Row 2: Value & Delta */}
              <div className="mt-3.5">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono tabular-nums">
                    {kpi.value}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-success-text bg-success-bg/90 border border-success/20 px-2 py-0.5 rounded-pill shadow-xs">
                    <TrendingUp className="h-3 w-3" />
                    <span>{kpi.change}</span>
                  </span>
                </div>

                {kpi.subValue ? (
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {kpi.subValue}
                  </p>
                ) : null}
              </div>

              {/* Row 3: Sparkline Micro Chart */}
              <div className="mt-4 h-12 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.data} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.gradientStop} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={theme.gradientStop} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      cursor={{ stroke: theme.gradientStop, strokeWidth: 1, strokeDasharray: '2 2' }}
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '10px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--foreground)',
                        boxShadow: 'var(--shadow-dropdown)',
                      }}
                      formatter={(val: unknown) => [kpi.formatVal(Number(val || 0)), t(kpi.titleKey)]}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={theme.gradientStop}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${kpi.id})`}
                      activeDot={{
                        r: 4,
                        fill: theme.gradientStop,
                        stroke: '#FFFFFF',
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Operational Sentinel Alert Strip (Actionable Cards)              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sentinelMetrics.map((item) => {
            const variantStyles = {
              warning: {
                text: 'text-warning-text',
                bg: 'bg-warning-bg',
                border: 'border-warning/30',
                badgeBg: 'bg-warning/15 text-warning-text border-warning/30',
              },
              error: {
                text: 'text-destructive-text',
                bg: 'bg-destructive-bg',
                border: 'border-destructive/30',
                badgeBg: 'bg-destructive/15 text-destructive-text border-destructive/30',
              },
              success: {
                text: 'text-success-text',
                bg: 'bg-success-bg',
                border: 'border-success/30',
                badgeBg: 'bg-success/15 text-success-text border-success/30',
              },
              default: {
                text: 'text-primary',
                bg: 'bg-primary/10',
                border: 'border-primary/30',
                badgeBg: 'bg-primary/15 text-primary border-primary/30',
              },
            }[item.variant];

            const route = sentinelRouteMap[item.id] || '/';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(route)}
                className={`group flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-surface-subtle/80 transition-all duration-200 cursor-pointer text-start w-full focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none`}
                title={`Click to view ${t(item.labelKey)}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-xl ${variantStyles.bg} ${variantStyles.text} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-muted-foreground block truncate">
                      {t(item.labelKey)}
                    </span>
                    <span className="text-sm font-extrabold text-foreground font-mono tabular-nums block">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 block truncate">
                      {t(item.subtextKey)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  {item.badge ? (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-pill border ${variantStyles.badgeBg} font-mono`}
                    >
                      {item.badge}
                    </span>
                  ) : null}

                  <span className="text-muted-foreground/60 group-hover:text-primary transition-colors">
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(HomeStats);