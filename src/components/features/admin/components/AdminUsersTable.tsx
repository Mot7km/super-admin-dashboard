import { memo, useState, useMemo, useCallback, type FC } from 'react';
import {
  Plus,
  Shield,
  KeyRound,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Edit,
  UserX,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import {
  DataTable,
  DataTableRowActions,
  type DataTableColumn,
  type DataTableFilterConfig,
  type DataTableBatchAction,
} from '../../../common/table';
import type {
  AdminUser,
  RoleDefinition,
  AdminModalAction,
  AdminStatus,
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

  const rolesMap = useMemo(() => {
    return new Map(roles.map((r) => [r.key, r]));
  }, [roles]);

  // Filtered dataset
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

  const formatLastActive = useCallback((iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  }, [isAr]);

  const getStatusBadge = useCallback((status: AdminStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t('adminManagement.status.active')}
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <UserX className="h-3.5 w-3.5" />
            {t('adminManagement.status.suspended')}
          </span>
        );
      case 'pending_invite':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            {t('adminManagement.status.pendingInvite')}
          </span>
        );
    }
  }, [t]);

  // CSV Export Handler
  const handleExport = useCallback((format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'MFA', 'Active Sessions', 'Location', 'Last Active', 'Status'];
      const rows = filteredAdmins.map((a) => {
        const role = rolesMap.get(a.roleKey);
        return [
          `"${a.id}"`,
          `"${a.name}"`,
          `"${a.email}"`,
          `"${role?.name || a.roleKey}"`,
          `"${role?.department || ''}"`,
          `"${a.twoFactorEnabled ? 'Enabled (' + a.twoFactorMethod + ')' : 'Disabled'}"`,
          a.activeSessionsCount,
          `"${a.location}"`,
          `"${a.lastActive}"`,
          `"${a.status}"`,
        ].join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `admin_operators_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [filteredAdmins, rolesMap]);

  // Define Table Columns
  const columns = useMemo<DataTableColumn<AdminUser>[]>(() => [
    {
      id: 'operator',
      header: t('adminManagement.table.colOperator'),
      accessorKey: 'name',
      sortable: true,
      minWidth: '220px',
      cell: ({ row: admin }: { row: AdminUser }) => (
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="h-10 w-10 rounded-full object-cover border border-border shadow-xs"
            />
            {admin.status === 'active' && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            )}
          </div>
          <div>
            <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
              <span>{admin.name}</span>
              {admin.roleKey === 'super_admin' && (
                <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              )}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              {admin.email}
            </div>
            <span className="text-[10px] text-muted-foreground/80 font-mono">
              ID: {admin.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'roleClearance',
      header: t('adminManagement.table.colRoleClearance'),
      accessorKey: 'roleKey',
      sortable: true,
      minWidth: '170px',
      cell: ({ row: admin }: { row: AdminUser }) => {
        const role = rolesMap.get(admin.roleKey);
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${role?.badgeColor || 'border-border text-foreground'}`}>
              {isAr ? role?.nameAr || admin.roleKey : role?.name || admin.roleKey}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {isAr ? role?.departmentAr : role?.department}
            </span>
            <span className="text-[10px] font-mono text-primary font-bold">
              Clearance L{role?.clearanceLevel ?? 2}
            </span>
          </div>
        );
      },
    },
    {
      id: 'securityMfa',
      header: t('adminManagement.table.colSecurityMfa'),
      minWidth: '150px',
      cell: ({ row: admin }: { row: AdminUser }) => (
        admin.twoFactorEnabled ? (
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 font-mono">
              <Lock className="h-3.5 w-3.5" />
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
            <AlertCircle className="h-3.5 w-3.5" />
            {t('adminManagement.mfa.pending')}
          </span>
        )
      ),
    },
    {
      id: 'sessionsGeo',
      header: t('adminManagement.table.colSessionsGeo'),
      accessorKey: 'activeSessionsCount',
      sortable: true,
      minWidth: '160px',
      cell: ({ row: admin }: { row: AdminUser }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                admin.activeSessionsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="font-mono font-bold text-foreground text-xs tabular-nums">
              {admin.activeSessionsCount} {t('adminManagement.table.activeSessions')}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {admin.location}
          </span>
          <span className="text-[10px] text-muted-foreground/80 font-mono">
            IP: {admin.lastLoginIp}
          </span>
        </div>
      ),
    },
    {
      id: 'lastActive',
      header: t('adminManagement.table.colLastActive'),
      accessorKey: 'lastActive',
      sortable: true,
      minWidth: '130px',
      cell: ({ row: admin }: { row: AdminUser }) => {
        const lastActiveFormatted = formatLastActive(admin.lastActive);
        return (
          <div>
            <div className="text-xs font-mono text-foreground font-bold tabular-nums">
              {lastActiveFormatted.date}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono tabular-nums">
              {lastActiveFormatted.time}
            </div>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('adminManagement.table.colStatus'),
      accessorKey: 'status',
      sortable: true,
      minWidth: '130px',
      cell: ({ row: admin }: { row: AdminUser }) => getStatusBadge(admin.status),
    },
    {
      id: 'actions',
      header: t('adminManagement.table.colActions'),
      align: 'end',
      width: '60px',
      cell: ({ row: admin }: { row: AdminUser }) => (
        <DataTableRowActions
          triggerIcon="horizontal"
          actions={[
            {
              id: 'edit',
              label: t('adminManagement.action.editAdmin'),
              icon: Edit,
              onClick: () => onOpenModal({ type: 'edit_admin', admin }),
            },
            {
              id: 'change-role',
              label: t('adminManagement.action.changeRole'),
              icon: Shield,
              onClick: () => onOpenModal({ type: 'change_role', admin }),
            },
            {
              id: 'toggle-status',
              label: admin.status === 'active' ? t('adminManagement.action.suspend') : t('adminManagement.action.activate'),
              icon: admin.status === 'active' ? UserX : UserCheck,
              variant: admin.status === 'active' ? 'warning' : 'success',
              dividerBefore: true,
              onClick: () => onToggleStatus(admin.id),
            },
            {
              id: 'revoke-sessions',
              label: t('adminManagement.action.revokeSessions'),
              icon: LogOut,
              variant: 'danger',
              onClick: () => onOpenModal({ type: 'revoke_sessions', admin }),
            },
          ]}
        />
      ),
    },
  ], [t, isAr, rolesMap, formatLastActive, getStatusBadge, onOpenModal, onToggleStatus]);

  // Filters Configuration
  const filterConfigs = useMemo<DataTableFilterConfig[]>(() => [
    {
      id: 'role',
      label: t('adminManagement.filter.allRoles'),
      value: roleFilter,
      onChange: setRoleFilter,
      options: roles.map((r) => ({
        label: isAr ? r.nameAr : r.name,
        value: r.key,
        count: admins.filter((a) => a.roleKey === r.key).length,
      })),
    },
    {
      id: 'status',
      label: t('adminManagement.filter.allStatuses'),
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        {
          label: t('adminManagement.status.active'),
          value: 'active',
          count: admins.filter((a) => a.status === 'active').length,
        },
        {
          label: t('adminManagement.status.suspended'),
          value: 'suspended',
          count: admins.filter((a) => a.status === 'suspended').length,
        },
        {
          label: t('adminManagement.status.pendingInvite'),
          value: 'pending_invite',
          count: admins.filter((a) => a.status === 'pending_invite').length,
        },
      ],
    },
    {
      id: 'twoFa',
      label: t('adminManagement.filter.allTwoFactor'),
      value: twoFaFilter,
      onChange: setTwoFaFilter,
      options: [
        {
          label: t('adminManagement.filter.mfaEnabled'),
          value: 'enabled',
          count: admins.filter((a) => a.twoFactorEnabled).length,
        },
        {
          label: t('adminManagement.filter.mfaDisabled'),
          value: 'disabled',
          count: admins.filter((a) => !a.twoFactorEnabled).length,
        },
      ],
    },
  ], [t, isAr, roles, roleFilter, statusFilter, twoFaFilter, admins]);

  // Batch Actions Configuration
  const batchActions = useMemo<DataTableBatchAction<AdminUser>[]>(() => [
    {
      id: 'revoke-batch',
      label: t('adminManagement.action.revokeSessions'),
      icon: LogOut,
      variant: 'danger',
      onClick: (selected: AdminUser[]) => {
        if (selected.length === 1) {
          onOpenModal({ type: 'revoke_sessions', admin: selected[0] });
        } else {
          // Open confirm modal or handle bulk revoke
          selected.forEach((admin: AdminUser) => onOpenModal({ type: 'revoke_sessions', admin }));
        }
      },
    },
    {
      id: 'suspend-batch',
      label: t('adminManagement.action.suspend'),
      icon: UserX,
      variant: 'default',
      onClick: (selected: AdminUser[]) => {
        selected.forEach((admin: AdminUser) => {
          if (admin.status === 'active') {
            onToggleStatus(admin.id);
          }
        });
      },
    },
  ], [t, onOpenModal, onToggleStatus]);

  return (
    <DataTable<AdminUser>
      data={filteredAdmins}
      columns={columns}
      keyExtractor={(admin: AdminUser) => admin.id}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: t('adminManagement.filter.searchPlaceholder'),
      }}
      filters={filterConfigs}
      primaryAction={{
        label: t('adminManagement.action.inviteAdmin'),
        icon: Plus,
        onClick: () => onOpenModal({ type: 'invite_admin' }),
      }}
      enableSelection
      batchActions={batchActions}
      onExport={handleExport}
      enableDensitySwitcher
      initialDensity="normal"
      pagination={{
        pageSize: 10,
      }}
      emptyState={{
        title: t('adminManagement.table.noAdminsFound'),
        description: t('adminManagement.table.noAdminsDesc'),
        icon: Shield,
      }}
    />
  );
});

AdminUsersTable.displayName = 'AdminUsersTable';
