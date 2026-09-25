import { memo, useState, useEffect, type FC } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  Headphones,
  Briefcase,
  GitBranch,
  Calculator,
  KeyRound,
  Copy,
  Check,
  LogOut,
  Lock,
  UserX,
  UserCheck,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  Monitor,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  GlobalUser,
  UserModalAction,
  UserRole,
  UserStatus,
  DeviceType,
} from '../users.types';

type UserActionModalsProps = {
  modalState: UserModalAction;
  onClose: () => void;
  onConfirmRoleChange: (userId: string, newRole: UserRole) => void;
  onConfirmResetPassword: (
    userId: string,
    tempPass: string,
    requireChange: boolean,
  ) => void;
  onConfirmForceLogout: (userId: string) => void;
  onConfirmToggleStatus: (userId: string, newStatus: UserStatus) => void;
  onRevokeSession: (userId: string, sessionId: string) => void;
  onRevokeAllSessions: (userId: string) => void;
  onCreateUser: (newUser: Omit<GlobalUser, 'id' | 'createdAt' | 'sessions'>) => void;
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

const generateSecurePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pass = '';
  for (let i = 0; i < 14; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const ROLES_INFO: {
  role: UserRole;
  labelKey: string;
  defaultLabel: string;
  icon: FC<{ className?: string }>;
  description: string;
  colorClass: string;
}[] = [
  {
    role: 'super_admin',
    labelKey: 'users.roles.superAdmin',
    defaultLabel: 'Super Admin',
    icon: ShieldAlert,
    description:
      'Full sovereign platform control. Bypass tenant isolation, view audit logs, manage all subscriptions, and configure global system policies.',
    colorClass: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
  },
  {
    role: 'support_staff',
    labelKey: 'users.roles.supportStaff',
    defaultLabel: 'Support Staff',
    icon: Headphones,
    description:
      'Global customer care. Impersonate business accounts for debugging, view diagnostics, handle support tickets, and review tenant health.',
    colorClass: 'text-sky-500 border-sky-500/20 bg-sky-500/10',
  },
  {
    role: 'business_owner',
    labelKey: 'users.roles.businessOwner',
    defaultLabel: 'Business Owner',
    icon: Briefcase,
    description:
      'Tenant root administrator. Full authority over billing, branches, staff accounts, POS terminals, and operational settings for their enterprise.',
    colorClass: 'text-primary border-primary/20 bg-primary/10',
  },
  {
    role: 'branch_manager',
    labelKey: 'users.roles.branchManager',
    defaultLabel: 'Branch Manager',
    icon: GitBranch,
    description:
      'Branch-level supervisor. Oversee local inventory, shift rosters, cashier daily reconciliation, and local branch order dispatch.',
    colorClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
  },
  {
    role: 'cashier',
    labelKey: 'users.roles.cashier',
    defaultLabel: 'Cashier / POS',
    icon: Calculator,
    description:
      'Point-of-sale operator. Process register sales, scan items, apply authorized coupons, take customer payments, and close daily cash drawers.',
    colorClass: 'text-teal-600 border-teal-500/20 bg-teal-500/10',
  },
];

const UserActionModals: FC<UserActionModalsProps> = ({
  modalState,
  onClose,
  onConfirmRoleChange,
  onConfirmResetPassword,
  onConfirmForceLogout,
  onConfirmToggleStatus,
  onRevokeSession,
  onRevokeAllSessions,
  onCreateUser,
}) => {
  const { t } = useTranslation();

  // Internal states for sub-modals
  const [selectedRole, setSelectedRole] = useState<UserRole>('branch_manager');
  const [tempPassword, setTempPassword] = useState('');
  const [requirePassChange, setRequirePassChange] = useState(true);
  const [copiedPass, setCopiedPass] = useState(false);

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'branch_manager' as UserRole,
    businessName: 'Al-Ahram Hospitality',
    businessId: 't-101',
    branchName: 'Zamalek Grand',
    status: 'active' as UserStatus,
    mfaEnabled: true,
  });

  // Sync state whenever modalState opens
  useEffect(() => {
    if (modalState?.type === 'change_role') {
      setSelectedRole(modalState.user.role);
    } else if (modalState?.type === 'reset_password') {
      setTempPassword(generateSecurePassword());
      setCopiedPass(false);
      setRequirePassChange(true);
    }
  }, [modalState]);

  if (!modalState) return null;

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl p-6 transition-all duration-200 text-left rtl:text-right">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 h-8 w-8 rounded-xl bg-surface-subtle hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. Change Role Modal */}
        {modalState.type === 'change_role' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('users.actions.changeRole') || 'Elevate or Modify User Role'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.user.name} ({modalState.user.email})
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border/70 mb-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold">
                {t('users.currentRole') || 'Current System Role'}:
              </span>
              <span className="font-mono font-bold text-foreground uppercase">
                {modalState.user.role.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-muted-foreground block">
                {t('users.selectNewRole') || 'Select New Role & Capability Tier'}:
              </label>
              <div className="space-y-2">
                {ROLES_INFO.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;
                  return (
                    <div
                      key={r.role}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedRole(r.role)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedRole(r.role)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border/80 hover:border-primary/40 bg-card/60'
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${r.colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {t(r.labelKey) || r.defaultLabel}
                          </span>
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedRole === 'super_admin' && (
              <div className="p-3 rounded-xl bg-warning-bg/40 border border-warning-text/30 flex items-start gap-2.5 mb-5 text-xs text-warning-text">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning-text" />
                <span>
                  {t('users.superAdminWarning') ||
                    'Caution: Elevating a user to Super Admin grants full root access across all business entities, financial logs, and tenant isolation policies.'}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmRoleChange(modalState.user.id, selectedRole);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                {t('users.confirmRoleChange') || 'Apply Role Change'}
              </button>
            </div>
          </div>
        )}

        {/* 2. Reset Password Modal */}
        {modalState.type === 'reset_password' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('users.actions.resetPassword') || 'Reset Security Credentials'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.user.name} ({modalState.user.email})
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground">
                  {t('users.generatedTempPassword') || 'High-Entropy Temporary Key'}:
                </span>
                <button
                  type="button"
                  onClick={() => setTempPassword(generateSecurePassword())}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{t('users.regenerate') || 'Regenerate'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={tempPassword}
                  className="flex-1 h-10 px-3 rounded-xl bg-card border border-border font-mono font-bold text-sm text-foreground focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className={`h-10 px-3.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
                    copiedPass
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-card border-border hover:bg-surface-elevated text-foreground'
                  }`}
                >
                  {copiedPass ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{t('common.copied') || 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>{t('common.copy') || 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <label className="mt-4 flex items-center gap-2.5 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={requirePassChange}
                  onChange={(e) => setRequirePassChange(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="font-semibold text-foreground">
                  {t('users.requirePasswordChangePrompt') ||
                    'Enforce password change on next login'}
                </span>
              </label>
            </div>

            <div className="p-3 rounded-xl bg-info-bg/30 border border-info-text/20 text-xs text-info-text mb-6">
              {t('users.resetNotificationNotice') ||
                'A secure notification with login instructions will also be dispatched to the user’s registered email.'}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmResetPassword(
                    modalState.user.id,
                    tempPassword,
                    requirePassChange,
                  );
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                {t('users.applyResetPassword') || 'Confirm & Set Password'}
              </button>
            </div>
          </div>
        )}

        {/* 3. Force Logout Modal */}
        {modalState.type === 'force_logout' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-warning-bg border border-warning-text/20 text-warning-text flex items-center justify-center shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('users.actions.forceLogout') || 'Revoke All Active Sessions'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.user.name} ({modalState.user.email})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-warning-bg/30 border border-warning-text/30 text-xs text-warning-text mb-4 leading-relaxed">
              <p className="font-bold mb-1">
                {t('users.forceLogoutWarningTitle') || 'Root Session Termination'}
              </p>
              <p>
                {t('users.forceLogoutWarningBody') ||
                  'This action will instantly revoke all JWT refresh tokens, disconnect active POS terminals, and log out mobile and web browsers across all active locations.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border/70 mb-6">
              <div className="text-xs font-bold text-muted-foreground mb-2">
                {t('users.activeSessionsToTerminate') || 'Active Sessions to Terminate'} (
                {modalState.user.sessions.length}):
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {modalState.user.sessions.map((sess) => {
                  const DevIcon = getDeviceIcon(sess.deviceType);
                  return (
                    <div
                      key={sess.id}
                      className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <DevIcon className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold text-foreground font-mono">
                          {sess.deviceModel}
                        </span>
                      </div>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {sess.ipAddress} • {sess.location}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmForceLogout(modalState.user.id);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-warning-bg text-warning-text border border-warning-text/30 text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                {t('users.confirmForceLogout') || 'Terminate All Sessions Now'}
              </button>
            </div>
          </div>
        )}

        {/* 4. Toggle Status (Lock / Unlock or Disable / Enable) Modal */}
        {modalState.type === 'toggle_status' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  modalState.targetStatus === 'active'
                    ? 'bg-success-bg border-success-text/20 text-success-text'
                    : modalState.targetStatus === 'locked'
                    ? 'bg-warning-bg border-warning-text/20 text-warning-text'
                    : 'bg-destructive-bg border-destructive-text/20 text-destructive-text'
                }`}
              >
                {modalState.targetStatus === 'active' ? (
                  <UserCheck className="h-5 w-5" />
                ) : modalState.targetStatus === 'locked' ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <UserX className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {modalState.targetStatus === 'active'
                    ? t('users.reinstateAccount') || 'Activate / Unlock User Identity'
                    : modalState.targetStatus === 'locked'
                    ? t('users.lockAccountTitle') || 'Lock Account Security Access'
                    : t('users.disableAccountTitle') || 'Disable Account Access'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.user.name} ({modalState.user.email})
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-border/80 mb-6 text-xs text-muted-foreground leading-relaxed">
              {modalState.targetStatus === 'locked' && (
                <p>
                  {t('users.lockExplanation') ||
                    'Locking this user prevents all login attempts and API access immediately. Active sessions will be terminated and MFA keys paused until an administrator unlocks the account.'}
                </p>
              )}
              {modalState.targetStatus === 'disabled' && (
                <p>
                  {t('users.disableExplanation') ||
                    'Disabling this identity indefinitely suspends platform access, deactivates linked POS terminal keys, and hides the operator from branch dispatch rosters.'}
                </p>
              )}
              {modalState.targetStatus === 'active' && (
                <p>
                  {t('users.activateExplanation') ||
                    'Re-activating this user restores normal login capabilities, unfreezes credentials, and allows connection of new POS terminals.'}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmToggleStatus(modalState.user.id, modalState.targetStatus);
                  onClose();
                }}
                className={`px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                  modalState.targetStatus === 'active'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : modalState.targetStatus === 'locked'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-destructive text-destructive-foreground hover:brightness-105'
                }`}
              >
                {modalState.targetStatus === 'active'
                  ? t('users.confirmActivate') || 'Restore & Activate'
                  : modalState.targetStatus === 'locked'
                  ? t('users.confirmLock') || 'Lock Account'
                  : t('users.confirmDisable') || 'Disable Account'}
              </button>
            </div>
          </div>
        )}

        {/* 5. Sessions & Connected Devices Management Modal */}
        {modalState.type === 'manage_sessions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {t('users.actions.manageSessions') || 'Active Devices & Sessions'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {modalState.user.name} • {modalState.user.sessions.length} live
                    endpoints
                  </p>
                </div>
              </div>

              {modalState.user.sessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRevokeAllSessions(modalState.user.id)}
                  className="px-3 py-1.5 rounded-xl bg-destructive-bg text-destructive-text border border-destructive-text/20 text-xs font-bold hover:brightness-105 transition-all"
                >
                  {t('users.revokeAll') || 'Revoke All Devices'}
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
              {modalState.user.sessions.map((sess) => {
                const DevIcon = getDeviceIcon(sess.deviceType);
                return (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-2xl border border-border/80 bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs mt-0.5">
                        <DevIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-xs">
                            {sess.deviceModel}
                          </span>
                          {sess.isCurrent && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black font-mono">
                              Current Node
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {sess.browser}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin className="h-2.5 w-2.5" />
                            {sess.ipAddress} ({sess.location})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            Active: {sess.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRevokeSession(modalState.user.id, sess.id)}
                      className="px-3 py-1.5 rounded-xl border border-border/80 hover:border-destructive/40 bg-card hover:bg-destructive-bg text-muted-foreground hover:text-destructive-text text-xs font-bold transition-all shrink-0 self-end sm:self-center"
                    >
                      {t('users.revokeSession') || 'Revoke'}
                    </button>
                  </div>
                );
              })}

              {modalState.user.sessions.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
                  {t('users.noActiveSessions') || 'No active device sessions currently registered.'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.done') || 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* 6. Create / Invite User Modal */}
        {modalState.type === 'create_user' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('users.createNewUserTitle') || 'Create System Identity or Invite Staff'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('users.createNewUserSub') ||
                    'Provision credentials and assign enterprise role & organizational scope.'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.fullName') || 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Tarek Mansour"
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.email') || 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="e.g. t.mansour@alahram.com"
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.phone') || 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+20 10 9876 5432"
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.role') || 'Assigned Role'}
                  </label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, role: e.target.value as UserRole }))
                    }
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value="super_admin">Super Admin (System Root)</option>
                    <option value="support_staff">Support Staff (Tier-3)</option>
                    <option value="business_owner">Business Owner (Tenant Head)</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="cashier">Cashier & POS Operator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.businessScope') || 'Organization / Business'}
                  </label>
                  <input
                    type="text"
                    value={createForm.businessName}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, businessName: e.target.value }))
                    }
                    placeholder="e.g. Al-Ahram Hospitality"
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    {t('users.branchScope') || 'Branch (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={createForm.branchName}
                    onChange={(e) =>
                      setCreateForm((p) => ({ ...p, branchName: e.target.value }))
                    }
                    placeholder="e.g. Zamalek Grand"
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <div>
                    <span className="font-bold text-foreground block text-xs">
                      {t('users.enforceMfaTitle') || 'Enforce Two-Factor Authentication'}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {t('users.enforceMfaSub') ||
                        'Requires authenticator app QR scan upon initial onboarding.'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={createForm.mfaEnabled}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, mfaEnabled: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!createForm.name || !createForm.email}
                onClick={() => {
                  onCreateUser({
                    name: createForm.name,
                    email: createForm.email,
                    phone: createForm.phone || '+20 10 0000 0000',
                    role: createForm.role,
                    businessId: createForm.businessId,
                    businessName: createForm.businessName,
                    branchName: createForm.branchName || undefined,
                    status: 'active',
                    mfaEnabled: createForm.mfaEnabled,
                    lastLogin: new Date().toISOString(),
                  });
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {t('users.provisionUserBtn') || 'Provision & Send Invite'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(UserActionModals);
