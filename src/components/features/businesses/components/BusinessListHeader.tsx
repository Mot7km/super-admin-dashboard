import { memo, type FC } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  DownloadCloud,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Business, BusinessStatus } from '../businesses.types';
import { TelemetryKpiCard } from '../../../common/kpi';

type BusinessListHeaderProps = {
  businesses: Business[];
  onOnboardClick?: () => void;
  onExportClick?: () => void;
  activeStatus?: 'all' | BusinessStatus;
  onStatusSelect?: (status: 'all' | BusinessStatus) => void;
};

const BusinessListHeader: FC<BusinessListHeaderProps> = ({
  businesses,
  onOnboardClick,
  onExportClick,
  activeStatus = 'all',
  onStatusSelect,
}) => {
  const { t } = useTranslation();

  const totalCount = businesses.length;
  const activeCount = businesses.filter((b) => b.status === 'active').length;
  const trialCount = businesses.filter((b) => b.status === 'trial').length;
  const suspendedCount = businesses.filter(
    (b) => b.status === 'suspended' || b.status === 'disabled',
  ).length;

  // Aggregate telemetry
  const totalMrr = businesses.reduce((sum, b) => sum + b.mrr, 0);
  const activeMrr = businesses
    .filter((b) => b.status === 'active')
    .reduce((sum, b) => sum + b.mrr, 0);
  const trialMrr = businesses
    .filter((b) => b.status === 'trial')
    .reduce((sum, b) => sum + b.mrr, 0);
  const suspendedMrr = businesses
    .filter((b) => b.status === 'suspended' || b.status === 'disabled')
    .reduce((sum, b) => sum + b.mrr, 0);

  const totalBranches = businesses.reduce((sum, b) => sum + b.branchesCount, 0);
  const activeBranches = businesses
    .filter((b) => b.status === 'active')
    .reduce((sum, b) => sum + b.branchesCount, 0);

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const trialPercent = totalCount > 0 ? Math.round((trialCount / totalCount) * 100) : 0;
  const suspendedPercent = totalCount > 0 ? Math.round((suspendedCount / totalCount) * 100) : 0;

  const handleCardClick = (statusKey: 'all' | BusinessStatus) => {
    if (!onStatusSelect) return;
    // Toggle back to 'all' if already selected
    if (activeStatus === statusKey && statusKey !== 'all') {
      onStatusSelect('all');
    } else {
      onStatusSelect(statusKey);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Title & Top Sovereign Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('businesses.title')}
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary font-mono flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {totalCount} {t('businesses.tenantsActiveBadge')}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
            {t('businesses.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExportClick}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-surface-subtle transition-all duration-200 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none hover:-translate-y-0.5"
          >
            <DownloadCloud className="h-4 w-4 text-primary" />
            <span>{t('businesses.exportList')}</span>
          </button>

          <button
            type="button"
            onClick={onOnboardClick}
            className="group flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>{t('businesses.onboardNew')}</span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Telemetry Grid (Interactive Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Tenants */}
        <TelemetryKpiCard
          title={t('businesses.kpiTotal')}
          value={totalCount}
          subValue={`${totalBranches} ${t('businesses.branchesLabel')}`}
          icon={Building2}
          variant="primary"
          badge={{ text: t('businesses.kpiTotalTrend'), trend: 'up' }}
          progress={{ value: 100 }}
          footer={{
            label: t('businesses.kpiTotalSubtitle'),
            value: `$${totalMrr.toLocaleString()} /mo`,
          }}
          isActive={activeStatus === 'all'}
          onClick={() => handleCardClick('all')}
        />

        {/* Card 2: Active Platforms */}
        <TelemetryKpiCard
          title={t('businesses.kpiActive')}
          value={activeCount}
          subValue={`${activeBranches} ${t('businesses.branchesLabel')} (${activePercent}%)`}
          icon={CheckCircle2}
          variant="success"
          badge={{ text: t('businesses.kpiActiveUptime'), icon: Activity }}
          progress={{ value: activePercent }}
          footer={{
            label: t('businesses.kpiActiveSubtitle'),
            value: `$${activeMrr.toLocaleString()} /mo`,
          }}
          isActive={activeStatus === 'active'}
          onClick={() => handleCardClick('active')}
        />

        {/* Card 3: In Evaluation (Trial) */}
        <TelemetryKpiCard
          title={t('businesses.kpiTrial')}
          value={trialCount}
          subValue={`${trialPercent}% Pipeline`}
          icon={Clock}
          variant="cyan"
          badge={{ text: t('businesses.kpiTrialAvg'), icon: ArrowUpRight }}
          progress={{ value: Math.max(trialPercent, 12) }}
          footer={{
            label: t('businesses.kpiTrialSubtitle'),
            value: `$${trialMrr.toLocaleString()} /mo`,
          }}
          isActive={activeStatus === 'trial'}
          onClick={() => handleCardClick('trial')}
        />

        {/* Card 4: Suspended / Frozen */}
        <TelemetryKpiCard
          title={t('businesses.kpiSuspended')}
          value={suspendedCount}
          subValue={`${suspendedPercent}% Churn Risk`}
          icon={AlertTriangle}
          variant="destructive"
          badge={{
            text: t('businesses.kpiSuspendedAction'),
            isLive: suspendedCount > 0,
          }}
          progress={{ value: Math.max(suspendedPercent * 2, 10) }}
          footer={{
            label: t('businesses.kpiSuspendedSubtitle'),
            value: `$${suspendedMrr.toLocaleString()} /mo`,
          }}
          isActive={activeStatus === 'suspended'}
          onClick={() => handleCardClick('suspended')}
        />
      </div>
    </div>
  );
};

export default memo(BusinessListHeader);
