import { memo, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HeroKpi, SentinelMetric } from '../home.types';
import { SparklineKpiCard, type SparklineVariant } from '../../../common/kpi';

type HomeStatsProps = {
  heroKpis: HeroKpi[];
  sentinelMetrics: SentinelMetric[];
};

const KPI_VARIANT_MAP: Record<string, SparklineVariant> = {
  'mrr-revenue': 'primary',
  'total-businesses': 'secondary',
  'platform-orders-volume': 'emerald',
  'active-users': 'purple',
};

const HomeStats: FC<HomeStatsProps> = ({ heroKpis, sentinelMetrics }) => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();

  // Navigation route mapping for Hero KPIs
  const kpiRouteMap: Record<string, string> = useMemo(() => ({
    'mrr-revenue': '/analytics/subscriptions',
    'total-businesses': '/businesses',
    'platform-orders-volume': '/payments',
    'active-users': '/users',
  }), []);

  // Navigation route mapping for Sentinel Alert Strip
  const sentinelRouteMap: Record<string, string> = useMemo(() => ({
    'expiring-subscriptions': '/subscriptions',
    'churned-businesses': '/businesses',
    'support-tickets': '/support',
    'api-throughput-errors': '/system/health',
  }), []);

  return (
    <section aria-label="Key Performance Indicators" className="space-y-4">
      {/* ========================================================================= */}
      {/* TIER 1: The 4 Strategic Headline KPIs (Sparkline Micro-Chart Cards)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {heroKpis.map((kpi) => (
          <SparklineKpiCard
            key={kpi.id}
            title={t(kpi.titleKey)}
            value={kpi.value}
            change={kpi.change}
            changeTrend="up"
            subValue={kpi.subValue}
            icon={kpi.icon}
            variant={KPI_VARIANT_MAP[kpi.id] || 'primary'}
            data={kpi.data}
            dataKey="v"
            formatTooltip={(val: number) => kpi.formatVal(val)}
            onClick={() => navigate(kpiRouteMap[kpi.id] || '/')}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: Aero-Sentinel Tactical Telemetry Strip (Distinctive Alert Probes)  */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        {/* Subtle Sentinel Telemetry Sub-header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground font-sans">
              {t('dashboard.sentinel.sectionTitle')}
            </h2>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/70 hidden sm:inline">
            4 Sentinel Probes Active • Multi-Cluster Telemetry
          </span>
        </div>

        {/* 4 Precision Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {sentinelMetrics.map((item) => {
            const theme = {
              warning: {
                laserColor: '#f59e0b',
                ambientSpot: 'bg-amber-500/20',
                iconGradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
                iconBorder: 'border-amber-500/30',
                iconColor: 'text-amber-500 dark:text-amber-400',
                iconGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
                badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
                badgeBorder: 'border-amber-500/30',
                badgeText: 'text-amber-600 dark:text-amber-400',
                hoverBorder: 'hover:border-amber-500/50',
                actionBtn: 'group-hover:bg-amber-500/15 group-hover:text-amber-500 group-hover:border-amber-500/30',
              },
              error: {
                laserColor: '#f43f5e',
                ambientSpot: 'bg-rose-500/20',
                iconGradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
                iconBorder: 'border-rose-500/30',
                iconColor: 'text-rose-500 dark:text-rose-400',
                iconGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]',
                badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
                badgeBorder: 'border-rose-500/30',
                badgeText: 'text-rose-600 dark:text-rose-400',
                hoverBorder: 'hover:border-rose-500/50',
                actionBtn: 'group-hover:bg-rose-500/15 group-hover:text-rose-500 group-hover:border-rose-500/30',
              },
              default: {
                laserColor: '#06b6d4',
                ambientSpot: 'bg-cyan-500/20',
                iconGradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
                iconBorder: 'border-cyan-500/30',
                iconColor: 'text-cyan-500 dark:text-cyan-400',
                iconGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
                badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
                badgeBorder: 'border-cyan-500/30',
                badgeText: 'text-cyan-600 dark:text-cyan-400',
                hoverBorder: 'hover:border-cyan-500/50',
                actionBtn: 'group-hover:bg-cyan-500/15 group-hover:text-cyan-500 group-hover:border-cyan-500/30',
              },
              success: {
                laserColor: '#10b981',
                ambientSpot: 'bg-emerald-500/20',
                iconGradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
                iconBorder: 'border-emerald-500/30',
                iconColor: 'text-emerald-500 dark:text-emerald-400',
                iconGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
                badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
                badgeBorder: 'border-emerald-500/30',
                badgeText: 'text-emerald-600 dark:text-emerald-400',
                hoverBorder: 'hover:border-emerald-500/50',
                actionBtn: 'group-hover:bg-emerald-500/15 group-hover:text-emerald-500 group-hover:border-emerald-500/30',
              },
            }[item.variant];

            const route = sentinelRouteMap[item.id] || '/';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(route)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl p-4 sm:p-5 transition-all duration-300 text-left rtl:text-right select-none ${
                  'bg-gradient-to-br from-card/95 via-card/85 to-card/75 dark:from-card/90 dark:via-card/70 dark:to-card/50 backdrop-blur-xl'
                } ${
                  'shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                } border border-border/80 dark:border-white/[0.08] ${theme.hoverBorder} hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer`}
              >
                {/* 1. Atmospheric Ambient Flare in Corner */}
                <div
                  className={`pointer-events-none absolute -top-10 -right-10 rtl:-right-auto rtl:-left-10 h-32 w-32 rounded-full blur-3xl opacity-20 dark:opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${theme.ambientSpot}`}
                />

                {/* 2. Top Razor Laser Beam */}
                <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
                  <div
                    className="h-full w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${theme.laserColor} 50%, transparent 100%)`,
                    }}
                  />
                </div>
                <div
                  className="absolute top-0 inset-x-8 h-[2px] blur-[2px] opacity-35 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: theme.laserColor }}
                />

                {/* 3. Top Row: Tactile Icon Squircle + Live Radar Beacon */}
                <div className="relative flex items-center justify-between gap-2 z-10 w-full mb-3">
                  <div
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${theme.iconGradient} border ${theme.iconBorder} ${theme.iconColor} ${theme.iconGlow} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:rotate-1 transition-all duration-300`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>

                  {item.badge && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} px-2.5 py-0.5 text-[11px] font-extrabold ${theme.badgeText} font-mono tracking-tight shadow-2xs backdrop-blur-sm`}
                    >
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span
                          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                          style={{ backgroundColor: theme.laserColor }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-1.5 w-1.5"
                          style={{ backgroundColor: theme.laserColor }}
                        />
                      </span>
                      <span>{item.badge}</span>
                    </span>
                  )}
                </div>

                {/* 4. Middle Section: Label & Large Tabular Numerals */}
                <div className="relative z-10 w-full">
                  <span className="text-[11px] font-extrabold text-muted-foreground/90 uppercase tracking-widest block font-sans truncate">
                    {t(item.labelKey)}
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono tabular-nums tracking-tight text-foreground block mt-1 leading-none">
                    {item.value}
                  </span>
                </div>

                {/* 5. Bottom Row: Context Subtitle & Interactive Jump Pill */}
                <div className="relative mt-3.5 pt-2.5 border-t border-border/50 dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs z-10 w-full">
                  <span className="text-[11px] text-muted-foreground truncate leading-relaxed">
                    {t(item.subtextKey)}
                  </span>

                  <div
                    className={`h-7 w-7 rounded-lg border border-border/70 dark:border-white/[0.08] bg-surface-subtle/80 flex items-center justify-center shrink-0 text-muted-foreground transition-all duration-200 shadow-2xs ${theme.actionBtn}`}
                  >
                    {isRtl ? (
                      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                    )}
                  </div>
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