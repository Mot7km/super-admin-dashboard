import { useState, useCallback, type FC } from 'react';
import {
  ShieldCheck,
  Users,
  Sliders,
  GitFork,
  ScrollText,
  Plus
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import type {
  AdminUser,
  RoleDefinition,
  AdminAccessLog,
  AdminModalAction,
  AdminTab,
  PermissionScope,
  PermissionAction
} from './admin.types';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ROLES,
  INITIAL_ACCESS_LOGS
} from './admin.mock';
import { AdminKpiStrip } from './components/AdminKpiStrip';
import { AdminUsersTable } from './components/AdminUsersTable';
import { RolePermissionsMatrix } from './components/RolePermissionsMatrix';
import { AdminHierarchyTree } from './components/AdminHierarchyTree';
import { AdminAccessLogsStream } from './components/AdminAccessLogsStream';
import { AdminActionModals } from './components/AdminActionModals';

export const AdminManagementDashboard: FC = () => {
  const { t } = useTranslation();

  // Primary States
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [accessLogs, setAccessLogs] = useState<AdminAccessLog[]>(INITIAL_ACCESS_LOGS);
  const [modalAction, setModalAction] = useState<AdminModalAction>(null);
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<string>('finance_admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Handlers
  const handleInviteAdmin = useCallback((newAdminData: Partial<AdminUser>) => {
    const newId = `adm-${String(admins.length + 1).padStart(3, '0')}`;
    const newAdmin: AdminUser = {
      id: newId,
      name: newAdminData.name || 'New Admin',
      email: newAdminData.email || 'admin@mot7km.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      roleKey: newAdminData.roleKey || 'support_admin',
      status: 'active',
      twoFactorEnabled: true,
      twoFactorMethod: 'authenticator_app',
      lastActive: new Date().toISOString(),
      lastLoginIp: '197.165.10.1',
      location: 'Cairo, Egypt',
      activeSessionsCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setAdmins((prev) => [newAdmin, ...prev]);

    // Record access log
    const newLog: AdminAccessLog = {
      id: `log-${Date.now()}`,
      adminId: 'adm-001',
      adminName: 'Ahmed El-Sayed',
      adminRole: 'super_admin',
      action: `Invited new operator ${newAdmin.name} (${newAdmin.email}) with role ${newAdmin.roleKey}`,
      actionAr: `دعوة المشرف الجديد ${newAdmin.name} وتعيين دور ${newAdmin.roleKey}`,
      scope: 'admin_management',
      resourceTarget: `User: ${newId}`,
      timestamp: new Date().toISOString(),
      ipAddress: '197.165.22.84',
      location: 'Cairo, Egypt',
      userAgent: 'Mozilla/5.0 (Admin Console)',
      mfaVerified: true,
      status: 'success',
      riskScore: 'medium',
    };
    setAccessLogs((prev) => [newLog, ...prev]);

    showToast(`${t('adminManagement.toast.invitedSuccessfully')}: ${newAdmin.name}`);
  }, [admins.length, showToast, t]);

  const handleUpdateAdmin = useCallback((adminId: string, updates: Partial<AdminUser>) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, ...updates } : a))
    );
    showToast(t('adminManagement.toast.updatedSuccessfully'));
  }, [showToast, t]);

  const handleRevokeSessions = useCallback((adminId: string) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, activeSessionsCount: 0 } : a))
    );

    const targetAdmin = admins.find((a) => a.id === adminId);

    const newLog: AdminAccessLog = {
      id: `log-${Date.now()}`,
      adminId: 'adm-001',
      adminName: 'Ahmed El-Sayed',
      adminRole: 'super_admin',
      action: `Forced emergency session revocation for operator ${targetAdmin?.name || adminId}`,
      actionAr: `إنهاء وإبطال كافة الجلسات النشطة للمشرف ${targetAdmin?.name || adminId}`,
      scope: 'admin_management',
      resourceTarget: `User: ${adminId}`,
      timestamp: new Date().toISOString(),
      ipAddress: '197.165.22.84',
      location: 'Cairo, Egypt',
      userAgent: 'Mozilla/5.0 (Admin Console)',
      mfaVerified: true,
      status: 'success',
      riskScore: 'high',
    };
    setAccessLogs((prev) => [newLog, ...prev]);

    showToast(t('adminManagement.toast.sessionsRevoked'));
  }, [admins, showToast, t]);

  const handleSuspendAdmin = useCallback((adminId: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, status: 'suspended', activeSessionsCount: 0 }
          : a
      )
    );
    showToast(t('adminManagement.toast.adminSuspended'));
  }, [showToast, t]);

  const handleToggleStatus = useCallback((adminId: string) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id !== adminId) return a;
        const nextStatus = a.status === 'active' ? 'suspended' : 'active';
        return {
          ...a,
          status: nextStatus,
          activeSessionsCount: nextStatus === 'active' ? 1 : 0,
        };
      })
    );
    showToast(t('adminManagement.toast.statusToggled'));
  }, [showToast, t]);

  const handleCreateRole = useCallback((newRoleData: Partial<RoleDefinition>) => {
    const newId = `role-${Date.now()}`;
    const newRole: RoleDefinition = {
      id: newId,
      key: 'custom',
      name: newRoleData.name || 'Custom Operator Role',
      nameAr: newRoleData.nameAr || 'دور إشرافي مخصص',
      description: newRoleData.description || 'Custom administrative permissions',
      descriptionAr: newRoleData.descriptionAr || 'صلاحيات إدارية مخصصة حسب الحاجة',
      department: newRoleData.department || 'Operations',
      departmentAr: newRoleData.departmentAr || 'العمليات',
      clearanceLevel: newRoleData.clearanceLevel ?? 2,
      memberCount: 0,
      badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      isSystem: false,
      permissions: newRoleData.permissions || {
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
    };

    setRoles((prev) => [...prev, newRole]);
    showToast(`${t('adminManagement.toast.roleCreated')}: ${newRole.name}`);
  }, [showToast, t]);

  const handleUpdateRolePermissions = useCallback((
    roleId: string,
    updatedPermissions: Record<PermissionScope, PermissionAction[]>
  ) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: updatedPermissions } : r))
    );
    showToast(t('adminManagement.toast.permissionsSaved'));
  }, [showToast, t]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <span className="text-xs font-bold text-foreground">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span>{t('adminManagement.page.title')}</span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              L0 Sovereign Root
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t('adminManagement.page.subtitle')}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalAction({ type: 'create_role' })}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-border bg-card hover:bg-surface-subtle text-foreground shadow-sm transition-colors"
          >
            <Sliders className="h-4 w-4 text-muted-foreground" />
            <span>{t('adminManagement.action.createNewRole')}</span>
          </button>

          <button
            type="button"
            onClick={() => setModalAction({ type: 'invite_admin' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>{t('adminManagement.action.inviteAdmin')}</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <AdminKpiStrip admins={admins} roles={roles} />

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        {/* Tab 1: Users Directory */}
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-subtle'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{t('adminManagement.tabs.users')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'users' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-surface-subtle text-muted-foreground'
          }`}>
            {admins.length}
          </span>
        </button>

        {/* Tab 2: Permissions Matrix */}
        <button
          type="button"
          onClick={() => setActiveTab('roles_matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles_matrix'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-subtle'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>{t('adminManagement.tabs.rolesMatrix')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'roles_matrix' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-surface-subtle text-muted-foreground'
          }`}>
            9 Scopes
          </span>
        </button>

        {/* Tab 3: Hierarchy Tree */}
        <button
          type="button"
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hierarchy'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-subtle'
          }`}
        >
          <GitFork className="h-4 w-4" />
          <span>{t('adminManagement.tabs.hierarchy')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'hierarchy' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-surface-subtle text-muted-foreground'
          }`}>
            5 Tiers
          </span>
        </button>

        {/* Tab 4: Access Logs */}
        <button
          type="button"
          onClick={() => setActiveTab('access_logs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'access_logs'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface-subtle'
          }`}
        >
          <ScrollText className="h-4 w-4" />
          <span>{t('adminManagement.tabs.accessLogs')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            activeTab === 'access_logs' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-surface-subtle text-muted-foreground'
          }`}>
            Live
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'users' && (
        <AdminUsersTable
          admins={admins}
          roles={roles}
          onOpenModal={setModalAction}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {activeTab === 'roles_matrix' && (
        <RolePermissionsMatrix
          roles={roles}
          selectedRoleKey={selectedRoleForMatrix}
          onUpdateRolePermissions={handleUpdateRolePermissions}
        />
      )}

      {activeTab === 'hierarchy' && (
        <AdminHierarchyTree
          roles={roles}
          admins={admins}
          onOpenModal={setModalAction}
          onSelectRoleForMatrix={(key) => {
            setSelectedRoleForMatrix(key);
            setActiveTab('roles_matrix');
          }}
        />
      )}

      {activeTab === 'access_logs' && (
        <AdminAccessLogsStream logs={accessLogs} />
      )}

      {/* Action Modals */}
      <AdminActionModals
        modalAction={modalAction}
        roles={roles}
        onClose={() => setModalAction(null)}
        onInviteAdmin={handleInviteAdmin}
        onUpdateAdmin={handleUpdateAdmin}
        onRevokeSessions={handleRevokeSessions}
        onSuspendAdmin={handleSuspendAdmin}
        onCreateRole={handleCreateRole}
      />
    </div>
  );
};
