import { memo, useState, useTransition, useMemo, type FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  ArrowUpRight,
  Zap,
  Clock,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { RecentTenant, SystemEvent, TransactionVolumePoint } from '../home.types';

type HomeLowerPanelsProps = {
  transactionVolumeData: TransactionVolumePoint[];
  recentTenants: RecentTenant[];
  systemEvents: SystemEvent[];
};

type BarTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; payload: TransactionVolumePoint }>;
  label?: string;
};

// Memoized Bar Chart Tooltip
const TransactionBarTooltip: FC<BarTooltipProps> = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-3 shadow-dropdown text-xs min-w-[160px] animate-fade-in">
      <div className="flex items-center justify-between border-b border-border/60 pb-1 mb-2 text-muted-foreground">
        <span className="font-semibold text-[11px]">Time: {label}</span>
        <span className="h-2 w-2 rounded-full bg-primary" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Orders:</span>
          <span className="font-extrabold text-foreground font-mono tabular-nums">
            {data.orders.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Volume:</span>
          <span className="font-extrabold text-success-text font-mono tabular-nums">
            ${data.volume.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
});

TransactionBarTooltip.displayName = 'TransactionBarTooltip';

const HomeLowerPanels: FC<HomeLowerPanelsProps> = ({
  transactionVolumeData,
  recentTenants,
  systemEvents,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'tenants' | 'audit'>('tenants');
  const [, startTransition] = useTransition();

  // Peak orders threshold to highlight busy periods
  const peakOrdersValue = useMemo(() => {
    return Math.max(...transactionVolumeData.map((d) => d.orders));
  }, [transactionVolumeData]);

  const handleTabSwitch = (tab: 'tenants' | 'audit') => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  return (
    <section aria-label="Operational Telemetry & Logs" className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ========================================================================= */}
      {/* 1. Global Orders & Transaction Velocity Stream (6 cols)                   */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-ambient lg:col-span-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground">
                  {t('dashboard.ordersVolumeTitle')}
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-pill bg-success-bg border border-success/30 text-[10px] font-extrabold text-success-text shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
                  <span>Live Feed</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('dashboard.ordersVolumeSubtitle')}
              </p>
            </div>

            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          {/* Quick Real-Time Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 my-3.5">
            <div className="p-2.5 rounded-xl bg-surface-subtle/80 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                {t('dashboard.ordersProcessedToday')}
              </span>
              <span className="text-sm sm:text-base font-black text-foreground font-mono tabular-nums">
                24,890
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-subtle/80 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                {t('dashboard.processedVolumeToday')}
              </span>
              <span className="text-sm sm:text-base font-black text-foreground font-mono tabular-nums">
                $482,400
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-subtle/80 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                {t('dashboard.slaSuccess')}
              </span>
              <span className="text-sm sm:text-base font-black text-success-text font-mono tabular-nums">
                99.98%
              </span>
            </div>
          </div>

          {/* Transaction Bar Chart */}
          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transactionVolumeData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<TransactionBarTooltip />} />
                <Bar dataKey="orders" radius={[5, 5, 0, 0]} maxBarSize={34}>
                  {transactionVolumeData.map((entry) => {
                    const isPeak = entry.orders === peakOrdersValue;
                    return (
                      <Cell
                        key={`cell-${entry.time}`}
                        fill={isPeak ? 'var(--secondary)' : 'var(--primary)'}
                        className="transition-colors duration-200 hover:opacity-80"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            Peak Throughput: <strong className="font-mono text-foreground">4,650 orders/hr</strong> at 21:00
          </span>
          <NavLink
            to="/payments"
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline hover:text-primary-dark transition-colors"
          >
            <span>{t('dashboard.viewAllTransactions')}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </NavLink>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Recent Tenants & Audit Stream Panel (6 cols)                          */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-ambient lg:col-span-6 flex flex-col justify-between">
        <div>
          {/* Header with Switcher Tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <div
              role="tablist"
              aria-label="Switch feed view"
              className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'tenants'}
                onClick={() => handleTabSwitch('tenants')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === 'tenants'
                    ? 'bg-card text-primary shadow-xs ring-1 ring-border font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{t('dashboard.recentTenantsTab')}</span>
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] rounded-pill bg-primary/10 text-primary font-mono">
                  {recentTenants.length}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'audit'}
                onClick={() => handleTabSwitch('audit')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-card text-primary shadow-xs ring-1 ring-border font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{t('dashboard.systemAuditTab')}</span>
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] rounded-pill bg-success-bg text-success-text font-mono">
                  Live
                </span>
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Real-Time Sync</span>
            </span>
          </div>

          {/* ================= Tab 1: Recent Tenants ================= */}
          {activeTab === 'tenants' ? (
            <div className="mt-3 divide-y divide-border/60">
              {recentTenants.map((tenant) => {
                // Get initials for avatar
                const initials = tenant.name
                  .split(' ')
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                const planBadgeStyle = {
                  Enterprise: 'bg-primary/15 text-primary border-primary/30',
                  Pro: 'bg-secondary/15 text-secondary border-secondary/30',
                  Starter: 'bg-muted text-muted-foreground border-border',
                }[tenant.plan];

                return (
                  <div
                    key={tenant.id}
                    className="group py-2.5 flex items-center justify-between hover:bg-surface-subtle/70 px-2 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Monogram Avatar */}
                      <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 font-black text-xs group-hover:scale-105 transition-transform duration-200">
                        {initials || <Building2 className="h-4 w-4" />}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {tenant.name}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-pill border ${planBadgeStyle} font-mono`}
                          >
                            {tenant.plan}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate block">
                          {tenant.category} • {tenant.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <div className="text-right">
                        <span className="text-xs font-black text-foreground font-mono tabular-nums block">
                          {tenant.mrr}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {t(tenant.joinedAtKey)}
                        </span>
                      </div>

                      {/* Quick Inspect Tenant Button */}
                      <NavLink
                        to={`/businesses/${tenant.id}`}
                        aria-label={`Inspect ${tenant.name}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
                        title={t('dashboard.inspectTenant')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </NavLink>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* ================= Tab 2: Live Audit Stream ================= */}
          {activeTab === 'audit' ? (
            <div className="mt-3 divide-y divide-border/60">
              {systemEvents.map((event) => {
                const levelConfig = {
                  success: {
                    bg: 'bg-success-bg text-success-text border-success/30',
                    tag: 'VERIFIED',
                  },
                  warning: {
                    bg: 'bg-warning-bg text-warning-text border-warning/30',
                    tag: 'ALERT',
                  },
                  error: {
                    bg: 'bg-destructive-bg text-destructive-text border-destructive/30',
                    tag: 'CRITICAL',
                  },
                  info: {
                    bg: 'bg-primary/10 text-primary border-primary/30',
                    tag: 'SYSTEM',
                  },
                }[event.level];

                return (
                  <div
                    key={event.id}
                    className="group py-2.5 flex items-start gap-3 hover:bg-surface-subtle/70 px-2 rounded-xl transition-all duration-200"
                  >
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${levelConfig.bg}`}
                    >
                      <event.icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground truncate">
                            {t(event.titleKey)}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-surface-subtle border border-border/80 text-muted-foreground font-semibold">
                            {levelConfig.tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          {t(event.timeKey)}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate leading-tight">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {activeTab === 'tenants' ? `${recentTenants.length} active tenants listed` : 'Automated immutable security ledger'}
          </span>
          <NavLink
            to={activeTab === 'tenants' ? '/businesses' : '/audit-logs'}
            className="inline-flex items-center gap-1 font-bold text-primary hover:underline hover:text-primary-dark transition-colors"
          >
            <span>
              {activeTab === 'tenants'
                ? t('dashboard.viewAllBusinesses')
                : t('dashboard.viewFullAuditLogs')}
            </span>
            <ExternalLink className="h-3.5 w-3.5" />
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default memo(HomeLowerPanels);