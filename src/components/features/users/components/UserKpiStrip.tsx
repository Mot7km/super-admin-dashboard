import { memo, type FC } from 'react';
import {
  Users,
  Radio,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Lock,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GlobalUser, UserStatus } from '../users.types';

type UserKpiStripProps = {
  users: GlobalUser[];
  activeStatus: 'all' | UserStatus;
  onStatusSelect: (status: 'all' | UserStatus) => void;
};

const UserKpiStrip: FC<UserKpiStripProps> = ({
  users,
  activeStatus,
  onStatusSelect,
}) => {
  const { t } = useTranslation();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const lockedUsers = users.filter((u) => u.status === 'locked' || u.status === 'disabled').length;

  const totalSessions = users.reduce((sum, u) => sum + u.sessions.length, 0);
  const mfaUsersCount = users.filter((u) => u.mfaEnabled).length;
  const mfaPercent = totalUsers > 0 ? Math.round((mfaUsersCount / totalUsers) * 100) : 0;

  const handleCardClick = (statusKey: 'all' | UserStatus) => {
    if (activeStatus === statusKey && statusKey !== 'all') {
      onStatusSelect('all');
    } else {
      onStatusSelect(statusKey);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Total System Identities */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('all')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('all')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'all'
            ? 'bg-card border-primary/60 shadow-md ring-2 ring-primary/20'
            : 'bg-card/90 border-border/80 hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
            <TrendingUp className="h-3 w-3" />
            +19.4% MoM
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('users.kpiTotalUsers')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
              {totalUsers}
            </span>
            <span className="text-xs font-bold text-muted-foreground font-mono">
              Across all tenants
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div className="h-full bg-primary rounded-full w-full" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('users.activeStatusRate')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            {activeUsers} / {totalUsers} Active
          </span>
        </div>
      </div>

      {/* 2. Active Sessions & Connected Devices */}
      <div
        className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-emerald-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md text-left rtl:text-right select-none"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Radio className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg border border-success-text/20 px-2.5 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('users.kpiActiveSessions')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
              {totalSessions}
            </span>
            <span className="text-xs font-bold text-success-text/90 font-mono">
              Live Devices
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-full" />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('users.deviceBreakdown')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            Web & POS Connected
          </span>
        </div>
      </div>

      {/* 3. MFA Shield Protection Rate */}
      <div
        className="group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-card/90 border-border/80 hover:border-info-text/40 hover:bg-card hover:-translate-y-1 hover:shadow-md text-left rtl:text-right select-none"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500/80 via-sky-400 to-blue-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-info-bg border border-info-text/20 text-info-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-info-bg border border-info-text/20 px-2 py-0.5 text-[11px] font-extrabold text-info-text font-mono">
            <Activity className="h-3 w-3" />
            Zero-Trust
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('users.kpiMfaScore')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-info-text font-mono tabular-nums tracking-tight">
              {mfaPercent}%
            </span>
            <span className="text-xs font-bold text-info-text/90 font-mono">
              {mfaUsersCount} / {totalUsers} 2FA
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${mfaPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('users.identityHealth')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            High Security Grade
          </span>
        </div>
      </div>

      {/* 4. Locked & Disabled Accounts */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleCardClick('locked')}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick('locked')}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'locked' || activeStatus === 'disabled'
            ? 'bg-card border-destructive/60 shadow-md ring-2 ring-destructive/20'
            : 'bg-card/90 border-border/80 hover:border-destructive/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500/80 via-rose-400 to-amber-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lock className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
            {lockedUsers > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            )}
            {lockedUsers > 0 ? 'Requires Review' : '0 Lockouts'}
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('users.kpiLockedUsers')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-destructive-text font-mono tabular-nums tracking-tight">
              {lockedUsers}
            </span>
            <span className="text-xs font-bold text-destructive-text/90 font-mono">
              Suspended
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-destructive rounded-full transition-all duration-500"
            style={{ width: `${Math.max(lockedUsers * 25, 10)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('users.securityFlag')}
          </span>
          <span className="font-mono font-black text-destructive-text tabular-nums flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Action Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(UserKpiStrip);
