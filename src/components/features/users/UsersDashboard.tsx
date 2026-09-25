import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  Download,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { INITIAL_GLOBAL_USERS } from './users.mock';
import type {
  GlobalUser,
  UserFilterState,
  UserModalAction,
  UserRole,
  UserStatus,
} from './users.types';
import UserKpiStrip from './components/UserKpiStrip';
import UserFilterBar from './components/UserFilterBar';
import UserTable from './components/UserTable';
import UserGrid from './components/UserGrid';
import UserActionModals from './components/UserActionModals';

const UsersDashboard = () => {
  const { t, locale } = useTranslation();
  const { role } = useParams<{ role?: string }>();

  // State: Global Users list
  const [users, setUsers] = useState<GlobalUser[]>(INITIAL_GLOBAL_USERS);

  // State: Active Modal Action
  const [modalState, setModalState] = useState<UserModalAction>(null);

  // State: Toast feedback
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  // State: Filters
  const [filters, setFilters] = useState<UserFilterState>({
    search: '',
    role: 'all',
    status: 'all',
    business: 'all',
    sortBy: 'last_login_desc',
    page: 1,
    pageSize: 8,
    viewMode: 'table',
  });

  // Sync role from URL param if present
  useEffect(() => {
    const validRoles: ('all' | UserRole)[] = [
      'all',
      'super_admin',
      'support_staff',
      'business_owner',
      'branch_manager',
      'cashier',
    ];
    if (role && validRoles.includes(role as 'all' | UserRole)) {
      setFilters((prev) => ({ ...prev, role: role as 'all' | UserRole, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, role: 'all', page: 1 }));
    }
  }, [role]);

  const getRoleLabel = (r: 'all' | UserRole) => {
    switch (r) {
      case 'super_admin':
        return t('users.roles.superAdmin');
      case 'support_staff':
        return t('users.roles.supportStaff');
      case 'business_owner':
        return t('users.roles.businessOwner');
      case 'branch_manager':
        return t('users.roles.branchManager');
      case 'cashier':
        return t('users.roles.cashier');
      default:
        return t('users.roles.all');
    }
  };

  const handleFilterChange = useCallback(
    <K extends keyof UserFilterState>(key: K, value: UserFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page:
          key === 'search' ||
          key === 'role' ||
          key === 'status' ||
          key === 'business'
            ? 1
            : prev.page,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      role: 'all',
      status: 'all',
      business: 'all',
      page: 1,
    }));
  }, []);

  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Role filter
      if (filters.role !== 'all' && u.role !== filters.role) {
        return false;
      }
      // 2. Status filter
      if (filters.status !== 'all' && u.status !== filters.status) {
        return false;
      }
      // 3. Business filter
      if (filters.business !== 'all' && u.businessId !== filters.business) {
        return false;
      }
      // 4. Search query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesPhone = u.phone.toLowerCase().includes(q);
        const matchesBusiness = u.businessName.toLowerCase().includes(q);
        const matchesBranch = u.branchName?.toLowerCase().includes(q);
        const matchesRole = u.role.toLowerCase().includes(q);
        const matchesSession = u.sessions.some(
          (s) =>
            s.ipAddress.toLowerCase().includes(q) ||
            s.deviceModel.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q),
        );

        if (
          !matchesName &&
          !matchesEmail &&
          !matchesPhone &&
          !matchesBusiness &&
          !matchesBranch &&
          !matchesRole &&
          !matchesSession
        ) {
          return false;
        }
      }
      return true;
    });
  }, [users, filters.role, filters.status, filters.business, filters.search]);

  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    switch (filters.sortBy) {
      case 'last_login_desc':
        return list.sort(
          (a, b) =>
            new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime(),
        );
      case 'created_desc':
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'sessions_desc':
        return list.sort((a, b) => b.sessions.length - a.sessions.length);
      default:
        return list;
    }
  }, [filteredUsers, filters.sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / filters.pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return sortedUsers.slice(start, start + filters.pageSize);
  }, [sortedUsers, filters.page, filters.pageSize]);

  // Sovereign Mutation Actions
  const handleConfirmRoleChange = useCallback(
    (userId: string, newRole: UserRole) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      showToast(
        locale === 'ar'
          ? `تم تحديث دور المستخدم بنجاح إلى ${newRole.replace('_', ' ')}`
          : `User role successfully updated to ${newRole.replace('_', ' ')}`,
        'success',
      );
    },
    [locale, showToast],
  );

  const handleConfirmResetPassword = useCallback(
    (_userId: string, tempPass: string, _requireChange: boolean) => {
      showToast(
        locale === 'ar'
          ? `تم تعيين كلمة مرور مؤقتة: ${tempPass}`
          : `Temporary credentials generated: ${tempPass}`,
        'info',
      );
    },
    [locale, showToast],
  );

  const handleConfirmForceLogout = useCallback(
    (userId: string) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, sessions: [] } : u)),
      );
      showToast(
        locale === 'ar'
          ? 'تم إنهاء جميع الجلسات النشطة وسحب رموز الدخول فورياً'
          : 'All active sessions terminated and access tokens revoked immediately',
        'success',
      );
    },
    [locale, showToast],
  );

  const handleConfirmToggleStatus = useCallback(
    (userId: string, newStatus: UserStatus) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              status: newStatus,
              sessions:
                newStatus === 'locked' || newStatus === 'disabled'
                  ? []
                  : u.sessions,
            };
          }
          return u;
        }),
      );
      showToast(
        locale === 'ar'
          ? `تم تغيير حالة المستخدم إلى ${newStatus}`
          : `User status changed to ${newStatus}`,
        'success',
      );
    },
    [locale, showToast],
  );

  const handleRevokeSession = useCallback(
    (userId: string, sessionId: string) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const updated = u.sessions.filter((s) => s.id !== sessionId);
            return { ...u, sessions: updated };
          }
          return u;
        }),
      );
      // Also update modalState if open
      setModalState((prev) => {
        if (prev?.type === 'manage_sessions' && prev.user.id === userId) {
          return {
            ...prev,
            user: {
              ...prev.user,
              sessions: prev.user.sessions.filter((s) => s.id !== sessionId),
            },
          };
        }
        return prev;
      });
      showToast(
        locale === 'ar'
          ? 'تم إنهاء جلسة الجهاز المحددة'
          : 'Selected device session revoked successfully',
        'info',
      );
    },
    [locale, showToast],
  );

  const handleRevokeAllSessions = useCallback(
    (userId: string) => {
      handleConfirmForceLogout(userId);
      setModalState((prev) => {
        if (prev?.type === 'manage_sessions' && prev.user.id === userId) {
          return {
            ...prev,
            user: { ...prev.user, sessions: [] },
          };
        }
        return prev;
      });
    },
    [handleConfirmForceLogout],
  );

  const handleCreateUser = useCallback(
    (newUser: Omit<GlobalUser, 'id' | 'createdAt' | 'sessions'>) => {
      const created: GlobalUser = {
        ...newUser,
        id: `usr_gen_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        sessions: [],
      };
      setUsers((prev) => [created, ...prev]);
      showToast(
        locale === 'ar'
          ? `تم إنشاء المستخدم ${created.name} وإرسال بيانات الانضمام بنجاح`
          : `User ${created.name} provisioned and invitation dispatched successfully`,
        'success',
      );
    },
    [locale, showToast],
  );

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Name,Email,Phone,Role,Business,Branch,Status,MFA,SessionsCount,LastLogin,CreatedAt',
        ...sortedUsers.map(
          (u) =>
            `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.businessName}","${u.branchName || ''}","${u.status}",${u.mfaEnabled},${u.sessions.length},"${u.lastLogin}","${u.createdAt}"`,
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `system_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(
      locale === 'ar'
        ? 'تم تصدير سجل المستخدمين بنجاح بصيغة CSV'
        : 'User registry exported successfully as CSV',
      'info',
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border animate-in slide-in-from-top duration-300 ${
            toast.type === 'success'
              ? 'bg-success-bg border-success-text/30 text-success-text'
              : toast.type === 'error'
              ? 'bg-destructive-bg border-destructive-text/30 text-destructive-text'
              : 'bg-info-bg border-info-text/30 text-info-text'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section with Page Title, Subtitle, and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {t('users.title') || 'Users & Global Roles'}
                </h1>
                <span className="hidden sm:inline-block text-muted-foreground/40 font-mono">/</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  {getRoleLabel(filters.role)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('users.subtitle') ||
                  'System-wide directory across all enterprises, branch managers, and POS operators'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 hover:bg-surface-subtle text-foreground text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{t('common.export') || 'Export CSV'}</span>
          </button>

          <button
            type="button"
            onClick={() => setModalState({ type: 'create_user' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t('users.createUserBtn') || 'Add / Invite User'}</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Top KPI Strip */}
      <UserKpiStrip
        users={users}
        activeStatus={filters.status}
        onStatusSelect={(status) => handleFilterChange('status', status)}
      />

      {/* 2. Unified Search, Filter & View Controls */}
      <UserFilterBar
        users={users}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Main Data View (Table or Grid) */}
      {filters.viewMode === 'table' ? (
        <UserTable users={paginatedUsers} onOpenModal={setModalState} />
      ) : (
        <UserGrid users={paginatedUsers} onOpenModal={setModalState} />
      )}

      {/* 4. Pagination & Telemetry Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            {t('common.showing') || 'Showing'}{' '}
            <strong className="text-foreground font-mono">
              {sortedUsers.length === 0
                ? 0
                : (filters.page - 1) * filters.pageSize + 1}
              -
              {Math.min(filters.page * filters.pageSize, sortedUsers.length)}
            </strong>{' '}
            {t('common.of') || 'of'}{' '}
            <strong className="text-foreground font-mono">
              {sortedUsers.length}
            </strong>{' '}
            {t('users.identitiesTotal') || 'identities'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() =>
              setFilters((p) => ({ ...p, page: Math.max(p.page - 1, 1) }))
            }
            className="h-8 px-3 rounded-xl border border-border/80 bg-card hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            <span>{t('common.previous') || 'Previous'}</span>
          </button>

          <span className="px-3 py-1 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold text-xs">
            {filters.page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={filters.page >= totalPages}
            onClick={() =>
              setFilters((p) => ({ ...p, page: Math.min(p.page + 1, totalPages) }))
            }
            className="h-8 px-3 rounded-xl border border-border/80 bg-card hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{t('common.next') || 'Next'}</span>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* 5. Action Dialog Coordinator Modals */}
      <UserActionModals
        modalState={modalState}
        onClose={() => setModalState(null)}
        onConfirmRoleChange={handleConfirmRoleChange}
        onConfirmResetPassword={handleConfirmResetPassword}
        onConfirmForceLogout={handleConfirmForceLogout}
        onConfirmToggleStatus={handleConfirmToggleStatus}
        onRevokeSession={handleRevokeSession}
        onRevokeAllSessions={handleRevokeAllSessions}
        onCreateUser={handleCreateUser}
      />
    </div>
  );
};

export default UsersDashboard;
