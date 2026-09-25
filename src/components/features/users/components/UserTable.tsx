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
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GlobalUser, UserModalAction, UserRole, UserStatus, DeviceType } from '../users.types';

type UserTableProps = {
  users: GlobalUser[];
  onOpenModal: (action: UserModalAction) => void;
};

// Role styling helper
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
        badgeClass:
          'bg-primary/10 text-primary border-primary/20 font-bold',
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

// Status styling helper
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

// Device icon helper
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

const UserTable: FC<UserTableProps> = ({ users, onOpenModal }) => {
  const { t, locale } = useTranslation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close actions popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

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

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/50">
        <div className="h-12 w-12 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-foreground">
          {t('users.noUsersFound') || 'No users found matching current filters'}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          {t('users.noUsersDescription') ||
            'Try adjusting your search query, role filters, or status selection.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-surface-subtle/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3.5 px-4">{t('users.colIdentity') || 'User Identity'}</th>
              <th className="py-3.5 px-4">{t('users.colRole') || 'Role'}</th>
              <th className="py-3.5 px-4">{t('users.colBusiness') || 'Organization / Branch'}</th>
              <th className="py-3.5 px-4">{t('users.colStatus') || 'Status & 2FA'}</th>
              <th className="py-3.5 px-4">{t('users.colSessions') || 'Active Sessions'}</th>
              <th className="py-3.5 px-4">{t('users.colLastLogin') || 'Last Active / Joined'}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">
                {t('common.actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-xs">
            {users.map((user) => {
              const roleMeta = getRoleBadge(user.role);
              const RoleIcon = roleMeta.icon;
              const statusMeta = getStatusBadge(user.status);
              const isMenuOpen = activeMenuId === user.id;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-surface-subtle/50 transition-colors group"
                >
                  {/* 1. Identity (Avatar, Name, Email, Phone) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-xs">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        {/* Live active indicator if has sessions */}
                        {user.sessions.length > 0 && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card"
                            title="Active session detected"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground truncate text-sm">
                            {user.name}
                          </span>
                          {user.role === 'super_admin' && (
                            <span
                              className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider"
                              title="Root Super Admin Key"
                            >
                              Root
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground truncate font-mono text-[11px]">
                          {user.email}
                        </div>
                        <div className="text-muted-foreground/80 font-mono text-[10px]">
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Role Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${roleMeta.badgeClass}`}
                    >
                      <RoleIcon className="h-3.5 w-3.5" />
                      <span>{t(roleMeta.labelKey) || roleMeta.label}</span>
                    </span>
                  </td>

                  {/* 3. Business & Branch Affiliation */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-[200px]">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground text-xs truncate">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{user.businessName}</span>
                      </div>
                      {user.branchName ? (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 pl-5 rtl:pl-0 rtl:pr-5">
                          <span className="h-1 w-1 rounded-full bg-primary/60" />
                          <span className="truncate">{user.branchName}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground/70 pl-5 rtl:pl-0 rtl:pr-5 font-mono">
                          {user.businessId === 'system'
                            ? 'All Tenancies / Global'
                            : 'All Outlets & HQ'}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 4. Status & MFA Security */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                        <span>{t(statusMeta.labelKey) || statusMeta.label}</span>
                      </span>

                      {/* 2FA Shield badge */}
                      {user.mfaEnabled ? (
                        <span
                          className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0"
                          title="2FA / MFA Enforced & Active"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span
                          className="h-6 w-6 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0"
                          title="MFA Not Enforced"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Connected Devices & Sessions */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onOpenModal({ type: 'manage_sessions', user })}
                      className="group/sess inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-card border border-border/70 hover:border-primary/40 transition-all text-xs"
                      title="Inspect Sessions & Devices"
                    >
                      <div className="flex -space-x-1.5 rtl:space-x-reverse">
                        {user.sessions.slice(0, 3).map((s) => {
                          const DevIcon = getDeviceIcon(s.deviceType);
                          return (
                            <span
                              key={s.id}
                              className="h-5 w-5 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground group-hover/sess:text-primary transition-colors shadow-2xs"
                            >
                              <DevIcon className="h-3 w-3" />
                            </span>
                          );
                        })}
                      </div>

                      <span className="font-mono font-bold text-foreground group-hover/sess:text-primary transition-colors">
                        {user.sessions.length}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {user.sessions.length === 1 ? 'device' : 'devices'}
                        </span>
                      </span>

                      <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover/sess:text-primary transition-colors" />
                    </button>
                  </td>

                  {/* 6. Last Login & Joined */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div
                        className="flex items-center gap-1 text-xs font-semibold text-foreground"
                        title={formatDate(user.lastLogin)}
                      >
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{getRelativeTime(user.lastLogin)}</span>
                      </div>
                      <div
                        className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono"
                        title={`Joined: ${user.createdAt}`}
                      >
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{user.createdAt}</span>
                      </div>
                    </div>
                  </td>

                  {/* 7. Sovereign Root Actions Menu */}
                  <td className="py-3.5 px-4 text-right rtl:text-left relative">
                    <div className="relative inline-block text-left" ref={isMenuOpen ? menuRef : null}>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId((prev) => (prev === user.id ? null : user.id))
                        }
                        className="h-8 w-8 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                        title="User Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-52 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-left rtl:text-right"
                          role="menu"
                        >
                          <div className="px-3 py-1.5 border-b border-border/60 text-[10px] font-bold text-muted-foreground uppercase font-mono">
                            {user.name}
                          </div>

                          {/* 1. Change Role */}
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

                          {/* 2. Reset Password */}
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

                          {/* 3. Manage Sessions / Devices */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenModal({ type: 'manage_sessions', user });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle hover:text-primary transition-colors"
                          >
                            <Monitor className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{t('users.actions.manageSessions') || 'Sessions & Devices'}</span>
                          </button>

                          {/* 4. Force Logout */}
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

                          {/* 5. Lock / Unlock */}
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

                          {/* 6. Disable / Enable */}
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(UserTable);
