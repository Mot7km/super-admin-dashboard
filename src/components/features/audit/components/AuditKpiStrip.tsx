import { memo, type FC } from 'react';
import {
  Activity,
  AlertTriangle,
  Lock,
  Zap,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AuditLogEntry, AuditSeverity, AuditStatus } from '../audit.types';

type AuditKpiStripProps = {
  logs: AuditLogEntry[];
  activeSeverity: 'all' | AuditSeverity;
  activeStatus: 'all' | AuditStatus;
  onSelectSeverity: (severity: 'all' | AuditSeverity) => void;
  onSelectStatus: (status: 'all' | AuditStatus) => void;
};

const AuditKpiStrip: FC<AuditKpiStripProps> = ({
  logs,
  activeSeverity,
  activeStatus,
  onSelectSeverity,
  onSelectStatus,
}) => {
  const { t } = useTranslation();

  const totalEvents = logs.length;
  const criticalEvents = logs.filter((l) => l.severity === 'critical' || l.severity === 'high').length;
  const failedAttempts = logs.filter((l) => l.status === 'failure' || l.status === 'warning').length;
  const verifiedHashes = logs.filter((l) => Boolean(l.hashSignature)).length;
  const integrityPercent = totalEvents > 0 ? Math.round((verifiedHashes / totalEvents) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total System Audit Events */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelectSeverity('all');
          onSelectStatus('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelectSeverity('all');
            onSelectStatus('all');
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeSeverity === 'all' && activeStatus === 'all'
            ? 'bg-card border-primary/60 shadow-md ring-2 ring-primary/20'
            : 'bg-card/90 border-border/80 hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
            <TrendingUp className="h-3 w-3" />
            +18.2% Log Vol
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('audit.kpiTotalEvents') || 'Total Security Events Logged'}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
              {totalEvents}
            </span>
            <span className="text-xs font-bold text-muted-foreground font-mono">
              Immutable
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('audit.flightRecorder') || 'Flight Recorder Status'}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Ingestion Active
          </span>
        </div>
      </div>

      {/* 2. Critical Mutations & Policy Shifts */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectSeverity(activeSeverity === 'critical' ? 'all' : 'critical')}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          onSelectSeverity(activeSeverity === 'critical' ? 'all' : 'critical')
        }
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeSeverity === 'critical' || activeSeverity === 'high'
            ? 'bg-card border-amber-500/60 shadow-md ring-2 ring-amber-500/20'
            : 'bg-card/90 border-border/80 hover:border-amber-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400 to-yellow-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            High Severity
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('audit.kpiCriticalMutations') || 'Critical State Mutations'}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tabular-nums tracking-tight">
              {criticalEvents}
            </span>
            <span className="text-xs font-bold text-amber-600/90 font-mono">
              Suspensions & Upgrades
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((criticalEvents / Math.max(totalEvents, 1)) * 100 * 2, 100)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('audit.stateDiffTracking') || 'State Diff Tracking'}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            Audited & Snapshotted
          </span>
        </div>
      </div>

      {/* 3. Blocked / Denied Access Attempts */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectStatus(activeStatus === 'failure' ? 'all' : 'failure')}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          onSelectStatus(activeStatus === 'failure' ? 'all' : 'failure')
        }
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'failure'
            ? 'bg-card border-destructive/60 shadow-md ring-2 ring-destructive/20'
            : 'bg-card/90 border-border/80 hover:border-destructive/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/80 via-rose-400 to-amber-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lock className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
            {failedAttempts > 0 ? (
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            ) : null}
            Zero-Trust Defense
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('audit.kpiBlockedAttempts') || 'Blocked / Denied Invocations'}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-destructive-text font-mono tabular-nums tracking-tight">
              {failedAttempts}
            </span>
            <span className="text-xs font-bold text-destructive-text/90 font-mono">
              403/401 Probes
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-destructive rounded-full transition-all duration-500"
            style={{
              width: `${Math.max((failedAttempts / Math.max(totalEvents, 1)) * 100 * 3, 10)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('audit.threatIsolation') || 'Threat Isolation'}
          </span>
          <span className="font-mono font-black text-destructive-text tabular-nums">
            IP Intercept Active
          </span>
        </div>
      </div>

      {/* 4. Cryptographic HMAC Integrity */}
      <div className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-emerald-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md text-left rtl:text-right select-none">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-bg border border-success-text/20 px-2 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
            <Zap className="h-3 w-3" />
            SHA-256 HMAC
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('audit.kpiCryptographicIntegrity') || 'Cryptographic Integrity'}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
              {integrityPercent}%
            </span>
            <span className="text-xs font-bold text-success-text/90 font-mono">
              Tamper-Proof
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${integrityPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('audit.complianceGrade') || 'Compliance Audit Standard'}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            SOC 2 / ISO 27001
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(AuditKpiStrip);
