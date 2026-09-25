import { memo, type FC } from 'react';
import {
  HardDrive,
  Database,
  PieChart,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PlatformStorageOverview } from '../storage.types';

type StorageKpiStripProps = {
  overview: PlatformStorageOverview;
};

export const StorageKpiStrip: FC<StorageKpiStripProps> = memo(({ overview }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Platform Storage */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('storage.kpi.totalCapacity')}
          </span>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {overview.totalCapacityGB}
          </span>
          <span className="text-xs font-bold text-muted-foreground font-mono">GB S3 POOL</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-primary" />
          <span>+{overview.monthlyGrowthGB} GB {t('storage.kpi.thisMonth')}</span>
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Used Storage */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('storage.kpi.usedStorage')}
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Database className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-400 font-mono">
            {overview.usedCapacityGB}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            {overview.usagePercentage}%
          </span>
        </div>
        {/* Visual progress bar */}
        <div className="mt-2 h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${overview.usagePercentage}%` }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500/50 via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Available Free Space */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('storage.kpi.availableSpace')}
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <PieChart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
            {overview.availableCapacityGB}
          </span>
          <span className="text-xs font-bold text-muted-foreground font-mono">GB FREE</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {(100 - overview.usagePercentage).toFixed(1)}% {t('storage.kpi.headroomRemaining')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Critical Quotas (>80%) */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('storage.kpi.criticalQuotas')}
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500 font-mono">
            {overview.criticalTenantsCount}
          </span>
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            &gt; 80% Quota
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('storage.kpi.businessesNearLimit')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});

StorageKpiStrip.displayName = 'StorageKpiStrip';
