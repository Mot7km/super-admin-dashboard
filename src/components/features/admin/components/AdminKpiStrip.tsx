import { memo, type FC } from 'react';
import {
  Users,
  ShieldCheck,
  KeyRound,
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AdminUser, RoleDefinition } from '../admin.types';

type AdminKpiStripProps = {
  admins: AdminUser[];
  roles: RoleDefinition[];
};

export const AdminKpiStrip: FC<AdminKpiStripProps> = memo(({ admins, roles }) => {
  const { t } = useTranslation();

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.status === 'active').length;
  const superAdminsCount = admins.filter((a) => a.roleKey === 'super_admin').length;
  const twoFaCompliantCount = admins.filter((a) => a.twoFactorEnabled).length;
  const twoFaRate = totalAdmins > 0 ? Math.round((twoFaCompliantCount / totalAdmins) * 100) : 100;
  const totalLiveSessions = admins.reduce((acc, curr) => acc + curr.activeSessionsCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Internal Admins */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('adminManagement.kpi.totalAdmins')}
          </span>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {totalAdmins}
          </span>
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {activeAdmins} {t('adminManagement.kpi.activeOperators')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {roles.length} {t('adminManagement.kpi.governanceRoles')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. L0 Root Sovereign Clearance */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('adminManagement.kpi.rootGatekeepers')}
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {superAdminsCount}
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            L0 Sovereign
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('adminManagement.kpi.unrestrictedAccess')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. 2FA Security Enforcement */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('adminManagement.kpi.mfaEnforcement')}
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {twoFaRate}%
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            ({twoFaCompliantCount}/{totalAdmins})
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
          <Lock className="h-3 w-3" />
          <span>{t('adminManagement.kpi.hardwareEnforced')}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Active Live Sessions */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('adminManagement.kpi.liveSessions')}
          </span>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {totalLiveSessions}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Live
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('adminManagement.kpi.zeroBreaches')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500/50 via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});

AdminKpiStrip.displayName = 'AdminKpiStrip';
