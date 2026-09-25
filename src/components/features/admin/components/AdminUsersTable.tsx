import { memo, useState, useMemo, type FC } from 'react';
import {
  Search,
  X,
  Plus,
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  LogOut,
  Edit,
  UserX,
  UserCheck
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  AdminUser,
  RoleDefinition,
  AdminModalAction,
  AdminStatus
} from '../admin.types';

type AdminUsersTableProps = {
  admins: AdminUser[];
  roles: RoleDefinition[];
  onOpenModal: (action: AdminModalAction) => void;
  onToggleStatus: (adminId: string) => void;
};

export const AdminUsersTable: FC<AdminUsersTableProps> = memo(({
  admins,
  roles,
  onOpenModal,
  onToggleStatus,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [twoFaFilter, setTwoFaFilter] = useState<string>('all');
  const [activeMenuAdminId, setActiveMenuAdminId] = useState<string | null>(null);

  const rolesMap = useMemo(() => {
    return new Map(roles.map((r) => [r.key, r]));
  }, [roles]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = a.name.toLowerCase().includes(q);
        const matchEmail = a.email.toLowerCase().includes(q);
        const matchId = a.id.toLowerCase().includes(q);
        const matchLoc = a.location.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchId && !matchLoc) return false;
      }

      if (roleFilter !== 'all' && a.roleKey !== roleFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (twoFaFilter !== 'all') {
        const is2Fa = twoFaFilter === 'enabled';
        if (a.twoFactorEnabled !== is2Fa) return false;
      }

      return true;
    });
  }, [admins, search, roleFilter, statusFilter, twoFaFilter]);

  const formatLastActive = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatusBadge = (status: AdminStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t('adminManagement.status.active')}
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <UserX className="h-3 w-3" />
            {t('adminManagement.status.suspended')}
          </span>
        );
      case 'pending_invite':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" />
            {t('adminManagement.status.pendingInvite')}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
      {/* Top Filter and Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('adminManagement.filter.searchPlaceholder')}
            className={`w-full rounded-xl border border-border/80 bg-surface-subtle/80 py-2 ${
              isAr ? 'pr-9 pl-8' : 'pl-9 pr-8'
            } text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40`}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className={`absolute ${isAr ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-surface-subtle/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">{t('adminManagement.filter.allRoles')}</option>
            {roles.map((r) => (
              <option key={r.key} value={r.key}>
                {isAr ? r.nameAr : r.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-surface-subtle/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">{t('adminManagement.filter.allStatuses')}</option>
            <option value="active">{t('adminManagement.status.active')}</option>
            <option value="suspended">{t('adminManagement.status.suspended')}</option>
            <option value="pending_invite">{t('adminManagement.status.pendingInvite')}</option>
          </select>

          {/* 2FA Filter */}
          <select
            value={twoFaFilter}
            onChange={(e) => setTwoFaFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-surface-subtle/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">{t('adminManagement.filter.allTwoFactor')}</option>
            <option value="enabled">{t('adminManagement.filter.mfaEnabled')}</option>
            <option value="disabled">{t('adminManagement.filter.mfaDisabled')}</option>
          </select>

          {/* Invite Admin Button */}
          <button
            type="button"
            onClick={() => onOpenModal({ type: 'invite_admin' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95 transition-opacity shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t('adminManagement.action.inviteAdmin')}</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/50 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colOperator')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colRoleClearance')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colSecurityMfa')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colSessionsGeo')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colLastActive')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.table.colStatus')}</th>
              <th scope="col" className="py-3 px-4 text-right">{t('adminManagement.table.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredAdmins.map((admin) => {
              const role = rolesMap.get(admin.roleKey);
              const lastActiveFormatted = formatLastActive(admin.lastActive);
              const isMenuOpen = activeMenuAdminId === admin.id;

              return (
                <tr
                  key={admin.id}
                  className="group hover:bg-surface-subtle/70 transition-colors"
                >
                  {/* Operator */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="h-10 w-10 rounded-full object-cover border border-border shadow-sm"
                        />
                        {admin.status === 'active' && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span>{admin.name}</span>
                          {admin.roleKey === 'super_admin' && (
                            <Shield className="h-3.5 w-3.5 text-amber-400" />
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {admin.email}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          ID: {admin.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role & Clearance */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${role?.badgeColor || 'border-border text-foreground'}`}>
                        {isAr ? role?.nameAr || admin.roleKey : role?.name || admin.roleKey}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {isAr ? role?.departmentAr : role?.department}
                      </span>
                      <span className="text-[10px] font-mono text-primary font-bold">
                        Clearance L{role?.clearanceLevel ?? 2}
                      </span>
                    </div>
                  </td>

                  {/* Security & MFA */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {admin.twoFactorEnabled ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 font-mono">
                          <Lock className="h-3 w-3" />
                          {t('adminManagement.mfa.active')}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                          {admin.twoFactorMethod === 'security_key' ? (
                            <>
                              <KeyRound className="h-3 w-3 text-amber-400" />
                              <span>Hardware Key</span>
                            </>
                          ) : (
                            <>
                              <Smartphone className="h-3 w-3 text-cyan-400" />
                              <span>Authenticator</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 font-mono">
                        <AlertCircle className="h-3 w-3" />
                        {t('adminManagement.mfa.pending')}
                      </span>
                    )}
                  </td>

                  {/* Sessions & Geolocation */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${admin.activeSessionsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        <span className="font-mono font-bold text-foreground text-xs">
                          {admin.activeSessionsCount} {t('adminManagement.table.activeSessions')}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {admin.location}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        IP: {admin.lastLoginIp}
                      </span>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-xs font-mono text-foreground font-bold">
                      {lastActiveFormatted.date}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {lastActiveFormatted.time}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(admin.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap relative">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenModal({ type: 'edit_admin', admin })}
                        title={t('adminManagement.action.editAdmin')}
                        className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenModal({ type: 'change_role', admin })}
                        title={t('adminManagement.action.changeRole')}
                        className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5" />
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuAdminId(isMenuOpen ? null : admin.id)}
                          className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div
                            className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-1 w-44 rounded-xl border border-border bg-card shadow-xl p-1 z-30 animate-fadeIn`}
                            onMouseLeave={() => setActiveMenuAdminId(null)}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuAdminId(null);
                                onOpenModal({ type: 'revoke_sessions', admin });
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 font-bold"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              <span>{t('adminManagement.action.revokeSessions')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuAdminId(null);
                                onToggleStatus(admin.id);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 text-foreground hover:bg-surface-subtle"
                            >
                              {admin.status === 'active' ? (
                                <>
                                  <UserX className="h-3.5 w-3.5 text-amber-500" />
                                  <span>{t('adminManagement.action.suspend')}</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>{t('adminManagement.action.activate')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="py-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">
              {t('adminManagement.table.noAdminsFound')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('adminManagement.table.noAdminsDesc')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

AdminUsersTable.displayName = 'AdminUsersTable';
