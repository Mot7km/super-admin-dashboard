import { memo, type FC } from 'react';
import {
  Megaphone,
  Radio,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemAnnouncement, ApiEndpointHealth } from '../announcements.types';

type AnnouncementsKpiStripProps = {
  announcements: SystemAnnouncement[];
  apiEndpoints: ApiEndpointHealth[];
};

export const AnnouncementsKpiStrip: FC<AnnouncementsKpiStripProps> = memo(({
  announcements,
  apiEndpoints,
}) => {
  const { t } = useTranslation();

  const total = announcements.length;
  const activeCount = announcements.filter((a) => a.isActive).length;
  const criticalCount = announcements.filter((a) => a.type === 'critical' && a.isActive).length;

  const avgUptime =
    apiEndpoints.length > 0
      ? (
          apiEndpoints.reduce((acc, curr) => acc + curr.uptimePercentage, 0) /
          apiEndpoints.length
        ).toFixed(2)
      : '100.00';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total System Announcements */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('announcements.kpi.totalAnnouncements')}
          </span>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
            <Megaphone className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {total}
          </span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {t('announcements.kpi.broadcastRules')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {total - activeCount} {t('announcements.kpi.archivedOrDraft')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Active Broadcast Banners */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('announcements.kpi.activeBanners')}
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-500 font-mono">
            {activeCount}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            LIVE
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('announcements.kpi.visibleInCustomerCockpits')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Critical Urgent Alerts */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('announcements.kpi.criticalAlerts')}
          </span>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-500 font-mono">
            {criticalCount}
          </span>
          <span className="text-xs font-semibold text-rose-400">
            {criticalCount > 0 ? t('announcements.kpi.immediateAction') : t('announcements.kpi.noneActive')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('announcements.kpi.emergencyDisruptions')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-rose-500/50 via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. API Fleet Health Uptime */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('announcements.kpi.apiAvailability')}
          </span>
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {avgUptime}%
          </span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Healthy
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {apiEndpoints.length} {t('announcements.kpi.coreTelemetryEndpoints')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-sky-500/50 via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});

AnnouncementsKpiStrip.displayName = 'AnnouncementsKpiStrip';
