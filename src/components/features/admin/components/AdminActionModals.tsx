import { useState, type FC } from 'react';
import {
  X,
  Plus,
  Shield,
  LogOut,
  UserX,
  AlertTriangle,
  Mail,
  User,
  KeyRound
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  AdminModalAction,
  RoleDefinition,
  AdminUser,
  AdminRoleKey,
  ClearanceLevel
} from '../admin.types';

type AdminActionModalsProps = {
  modalAction: AdminModalAction;
  roles: RoleDefinition[];
  onClose: () => void;
  onInviteAdmin: (newAdmin: Partial<AdminUser>) => void;
  onUpdateAdmin: (adminId: string, updates: Partial<AdminUser>) => void;
  onRevokeSessions: (adminId: string) => void;
  onSuspendAdmin: (adminId: string) => void;
  onCreateRole: (newRole: Partial<RoleDefinition>) => void;
};

export const AdminActionModals: FC<AdminActionModalsProps> = ({
  modalAction,
  roles,
  onClose,
  onInviteAdmin,
  onUpdateAdmin,
  onRevokeSessions,
  onSuspendAdmin,
  onCreateRole,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleKey, setRoleKey] = useState<AdminRoleKey>('support_admin');
  const [roleName, setRoleName] = useState('');
  const [roleNameAr, setRoleNameAr] = useState('');
  const [department, setDepartment] = useState('');
  const [departmentAr, setDepartmentAr] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState<ClearanceLevel>(2);

  if (!modalAction) return null;

  // 1. Invite New Admin Modal
  if (modalAction.type === 'invite_admin') {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim()) return;

      onInviteAdmin({
        name,
        email,
        roleKey,
        status: 'active',
        twoFactorEnabled: true,
        twoFactorMethod: 'authenticator_app',
        location: 'Cairo, Egypt',
        activeSessionsCount: 0,
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>{t('adminManagement.modal.inviteTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('adminManagement.modal.fullName')}
              </label>
              <div className="relative">
                <User className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mostafa Mahmoud"
                  className={`w-full rounded-xl border border-border bg-surface-subtle py-2 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('adminManagement.modal.corpEmail')}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mot7km.io"
                  className={`w-full rounded-xl border border-border bg-surface-subtle py-2 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('adminManagement.modal.assignRole')}
              </label>
              <select
                value={roleKey}
                onChange={(e) => setRoleKey(e.target.value as AdminRoleKey)}
                className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {isAr ? r.nameAr : r.name} (Clearance L{r.clearanceLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-xs text-foreground">
              <KeyRound className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{t('adminManagement.modal.securityNoteTitle')}</span>
                <span className="text-muted-foreground text-[11px]">
                  {t('adminManagement.modal.securityNoteDesc')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl text-xs text-muted-foreground">
                {t('adminManagement.action.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95"
              >
                {t('adminManagement.action.sendInvitation')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Change Role Modal
  if (modalAction.type === 'change_role') {
    const admin = modalAction.admin;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>{t('adminManagement.modal.changeRoleTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            {t('adminManagement.modal.changeRoleFor')} <strong className="text-foreground">{admin.name}</strong> ({admin.email}).
          </p>

          <div className="space-y-2 mb-4">
            {roles.map((r) => (
              <label
                key={r.key}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  admin.roleKey === r.key
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface-subtle/50 hover:bg-surface-subtle'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="adminRole"
                    value={r.key}
                    defaultChecked={admin.roleKey === r.key}
                    onChange={() => {
                      onUpdateAdmin(admin.id, { roleKey: r.key });
                      onClose();
                    }}
                    className="accent-primary"
                  />
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      {isAr ? r.nameAr : r.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isAr ? r.departmentAr : r.department}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-border">
                  L{r.clearanceLevel}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-end border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground">
              {t('adminManagement.action.cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Edit Admin Modal
  if (modalAction.type === 'edit_admin') {
    const admin = modalAction.admin;

    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateAdmin(admin.id, {
        name: name || admin.name,
        email: email || admin.email,
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span>{t('adminManagement.action.editAdmin')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('adminManagement.modal.fullName')}
              </label>
              <input
                type="text"
                defaultValue={admin.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('adminManagement.modal.corpEmail')}
              </label>
              <input
                type="email"
                defaultValue={admin.email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground">
                {t('adminManagement.action.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
              >
                {t('adminManagement.action.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 4. Revoke Sessions Modal
  if (modalAction.type === 'revoke_sessions') {
    const admin = modalAction.admin;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <LogOut className="h-5 w-5 text-rose-500" />
              <span>{t('adminManagement.modal.revokeSessionsTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            {t('adminManagement.modal.revokeSessionsDesc')} <strong className="text-foreground">{admin.name}</strong> ({admin.activeSessionsCount} active sessions)?
          </p>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>{t('adminManagement.modal.revokeSessionsWarning')}</span>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground">
              {t('adminManagement.action.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                onRevokeSessions(admin.id);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600"
            >
              {t('adminManagement.action.confirmRevocation')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Suspend Admin Modal
  if (modalAction.type === 'suspend_admin') {
    const admin = modalAction.admin;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserX className="h-5 w-5 text-rose-500" />
              <span>{t('adminManagement.modal.suspendTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            {t('adminManagement.modal.suspendDesc')} <strong className="text-foreground">{admin.name}</strong>?
          </p>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground">
              {t('adminManagement.action.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                onSuspendAdmin(admin.id);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-500 text-white shadow-sm hover:bg-rose-600"
            >
              {t('adminManagement.action.confirmSuspend')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Create New Role Modal
  if (modalAction.type === 'create_role') {
    const handleRoleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!roleName.trim()) return;

      onCreateRole({
        name: roleName,
        nameAr: roleNameAr || roleName,
        department: department || 'Operations',
        departmentAr: departmentAr || 'العمليات',
        clearanceLevel,
        isSystem: false,
        memberCount: 0,
        badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
        permissions: {
          tenants: ['view'],
          subscriptions: ['view'],
          finance: [],
          platform_users: ['view'],
          support: ['view'],
          notifications: ['view'],
          audit_logs: [],
          admin_management: [],
          system_infrastructure: [],
        },
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>{t('adminManagement.modal.createRoleTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleRoleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Role Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Compliance Auditor"
                  className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  اسم الدور (بالعربية)
                </label>
                <input
                  type="text"
                  value={roleNameAr}
                  onChange={(e) => setRoleNameAr(e.target.value)}
                  placeholder="مثلاً: مدقق الامتثال والأمان"
                  className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Legal & Security"
                  className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  القسم (بالعربية)
                </label>
                <input
                  type="text"
                  value={departmentAr}
                  onChange={(e) => setDepartmentAr(e.target.value)}
                  placeholder="مثلاً: الشؤون القانونية والأمن"
                  className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Security Clearance Level
              </label>
              <select
                value={clearanceLevel}
                onChange={(e) => setClearanceLevel(Number(e.target.value) as ClearanceLevel)}
                className="w-full rounded-xl border border-border bg-surface-subtle p-2 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value={1}>L1 - Department Lead (Elevated)</option>
                <option value={2}>L2 - Operational Specialist (Standard)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl text-xs text-muted-foreground">
                {t('adminManagement.action.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
              >
                {t('adminManagement.action.createRoleBtn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
};
