import { memo, type FC, useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Headphones,
  Briefcase,
  GitBranch,
  Calculator,
  ShieldCheck,
  ShieldOff,
  MoreVertical,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  UserX,
  UserCheck,
  Shield,
  Monitor,
  Building2,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GlobalUser, UserModalAction, UserRole, UserStatus, DeviceType } from '../users.types';

type UserGridProps = {
  users: GlobalUser[];
  onOpenModal: (action: UserModalAction) => void;
};

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'super_admin':
      return {
        label: 'Super Admin',
        labelKey: 'users.roles.superAdmin',
        icon: ShieldAlert,
        badgeClass:
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-black',
      };
    case 'support_staff':
      return {
        label: 'Support Staff',
        labelKey: 'users.roles.supportStaff',
        icon: Headphones,
        badgeClass:
          'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 font-bold',
      };
    case 'business_owner':
      return {
        label: 'Business Owner',
        labelKey: 'users.roles.businessOwner',
        icon: Briefcase,
        badgeClass: 'bg-primary/10 text-primary border-primary/20 font-bold',
      };
    case 'branch_manager':
      return {
        label: 'Branch Manager',
        labelKey: 'users.roles.branchManager',
        icon: GitBranch,
        badgeClass:
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold',
      };
    case 'cashier':
      return {
        label: 'Cashier / POS',
        labelKey: 'users.roles.cashier',
        icon: Calculator,
        badgeClass:
          'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20 font-bold',
      };
  }
};

const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        labelKey: 'users.statusActive',
        dotClass: 'bg-emerald-500',
        badgeClass: 'bg-success-bg text-success-text border-success-text/20',
      };
    case 'locked':
      return {
        label: 'Locked',
        labelKey: 'users.statusLocked',
        dotClass: 'bg-amber-500',
        badgeClass: 'bg-warning-bg text-warning-text border-warning-text/20',
      };
    case 'disabled':
      return {
        label: 'Disabled',
        labelKey: 'users.statusDisabled',
        dotClass: 'bg-destructive',
        badgeClass: 'bg-destructive-bg text-destructive-text border-destructive-text/20',
      };
    case 'pending':
      return {
        label: 'Pending',
        labelKey: 'users.statusPending',
        dotClass: 'bg-sky-500',
        badgeClass: 'bg-info-bg text-info-text border-info-text/20',
      };
  }
};

const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case 'desktop':
      return Laptop;
    case 'mobile':
      return Smartphone;
    case 'tablet':
      return Tablet;
    case 'pos_terminal':
      return Radio;
    default:
      return Monitor;
  }
};

const UserGrid: FC<UserGridProps> = ({ users, onOpenModal }) => {
  const { t, locale } = useTranslation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) return locale === 'ar' ? 'الآن' : 'Just now';
      if (diffMinutes < 60)
        return locale === 'ar' ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
      if (diffHours < 24)
        return locale === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
      if (diffDays === 1) return locale === 'ar' ? 'أمس' : 'Yesterday';
      return locale === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays}d ago`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => {
        const roleMeta = getRoleBadge(user.role);
        const RoleIcon = roleMeta.icon;
        const statusMeta = getStatusBadge(user.status);
        const isMenuOpen = activeMenuId === user.id;

        return (
          <div
            key={user.id}
            className="group relative rounded-2xl border border-border/80 bg-card/90 hover:bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            {/* Top Row: User Avatar, Name, Role & Status */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center font-bold text-primary text-base shadow-xs">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    {user.sessions.length > 0 && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-card"
                        title="Active device connected"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-foreground text-sm truncate">
                        {user.name}
                      </h4>
                      {user.role === 'super_admin' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase">
                          Root
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] mt-1 ${roleMeta.badgeClass}`}
                    >
                      <RoleIcon className="h-3 w-3" />
                      <span>{t(roleMeta.labelKey) || roleMeta.label}</span>
                    </span>
                  </div>
                </div>

                {/* 3-dots Context Menu */}
                <div className="relative shrink-0" ref={isMenuOpen ? menuRef : null}>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuId((prev) => (prev === user.id ? null : user.id))
                    }
                    className="h-8 w-8 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-48 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-left rtl:text-right"
                      role="menu"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onOpenModal({ type: 'change_role', user });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle hover:text-primary transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5 text-primary" />
                        <span>{t('users.actions.changeRole') || 'Change Role'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onOpenModal({ type: 'reset_password', user });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle hover:text-primary transition-colors"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-sky-500" />
                        <span>{t('users.actions.resetPassword') || 'Reset Password'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          onOpenModal({ type: 'force_logout', user });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-warning-text hover:bg-warning-bg/40 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5 text-warning-text" />
                        <span>{t('users.actions.forceLogout') || 'Force Logout'}</span>
                      </button>

                      <div className="my-1 border-t border-border/60" />

                      {user.status === 'locked' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenModal({
                              type: 'toggle_status',
                              user,
                              targetStatus: 'active',
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-success-text hover:bg-success-bg/40 transition-colors"
                        >
                          <Unlock className="h-3.5 w-3.5 text-success-text" />
                          <span>{t('users.actions.unlockAccount') || 'Unlock Account'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenModal({
                              type: 'toggle_status',
                              user,
                              targetStatus: 'locked',
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-warning-text hover:bg-warning-bg/40 transition-colors"
                        >
                          <Lock className="h-3.5 w-3.5 text-warning-text" />
                          <span>{t('users.actions.lockAccount') || 'Lock Account'}</span>
                        </button>
                      )}

                      {user.status === 'disabled' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenModal({
                              type: 'toggle_status',
                              user,
                              targetStatus: 'active',
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-success-text hover:bg-success-bg/40 transition-colors"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-success-text" />
                          <span>{t('users.actions.enableAccount') || 'Enable Account'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onOpenModal({
                              type: 'toggle_status',
                              user,
                              targetStatus: 'disabled',
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <UserX className="h-3.5 w-3.5 text-destructive" />
                          <span>{t('users.actions.disableAccount') || 'Disable Account'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status and 2FA Badges */}
              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-border/50 pt-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                  <span>{t(statusMeta.labelKey) || statusMeta.label}</span>
                </span>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  {user.mfaEnabled ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      2FA On
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground/80">
                      <ShieldOff className="h-3.5 w-3.5" />
                      2FA Off
                    </span>
                  )}
                </div>
              </div>

              {/* Organization and Contact Information */}
              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-medium truncate">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{user.businessName}</span>
                  {user.branchName && (
                    <span className="text-[11px] text-primary font-mono shrink-0">
                      ({user.branchName})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              </div>

              {/* Connected Devices Strip */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-surface-subtle border border-border/70">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-muted-foreground">
                    {t('users.colSessions') || 'Active Sessions'}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {user.sessions.length} {user.sessions.length === 1 ? 'device' : 'devices'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {user.sessions.map((sess) => {
                    const DevIcon = getDeviceIcon(sess.deviceType);
                    return (
                      <span
                        key={sess.id}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border text-[10px] font-mono text-muted-foreground shrink-0 shadow-2xs"
                        title={`${sess.deviceModel} (${sess.ipAddress}) - ${sess.location}`}
                      >
                        <DevIcon className="h-3 w-3 text-primary" />
                        <span className="truncate max-w-[90px]">{sess.deviceModel}</span>
                      </span>
                    );
                  })}
                  {user.sessions.length === 0 && (
                    <span className="text-[11px] text-muted-foreground italic">
                      No live sessions active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row: Last Active + Quick Actions */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Clock className="h-3 w-3" />
                {getRelativeTime(user.lastLogin)}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenModal({ type: 'manage_sessions', user })}
                  className="px-2.5 py-1 rounded-lg bg-surface-subtle hover:bg-card border border-border text-[11px] font-bold text-foreground hover:border-primary/40 transition-colors"
                >
                  {t('users.inspectSessions') || 'Devices'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenModal({ type: 'change_role', user })}
                  className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[11px] font-bold transition-colors"
                >
                  {t('users.actions.changeRole') || 'Role'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(UserGrid);
