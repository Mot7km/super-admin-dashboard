import { memo, useState, type FC } from 'react';
import {
  Shield,
  Check,
  X,
  Lock,
  Save,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Building2,
  CreditCard,
  Receipt,
  Users,
  Ticket,
  Bell,
  ScrollText,
  ShieldAlert,
  Server
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  RoleDefinition,
  PermissionScope,
  PermissionAction
} from '../admin.types';
import { PERMISSION_SCOPES } from '../admin.mock';

type RolePermissionsMatrixProps = {
  roles: RoleDefinition[];
  selectedRoleKey?: string;
  onUpdateRolePermissions: (roleId: string, updatedPermissions: Record<PermissionScope, PermissionAction[]>) => void;
};

const ALL_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'execute'];

export const RolePermissionsMatrix: FC<RolePermissionsMatrixProps> = memo(({
  roles,
  selectedRoleKey: initialRoleKey,
  onUpdateRolePermissions,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const [activeRoleKey, setActiveRoleKey] = useState<string>(initialRoleKey || 'finance_admin');
  const [dirtyPermissions, setDirtyPermissions] = useState<Record<string, Record<PermissionScope, PermissionAction[]>>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const activeRole = roles.find((r) => r.key === activeRoleKey) || roles[0];

  const currentRolePermissions = dirtyPermissions[activeRole.id] || activeRole.permissions;

  const isSuperAdmin = activeRole.key === 'super_admin';

  const getScopeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="h-4 w-4" />;
      case 'CreditCard': return <CreditCard className="h-4 w-4" />;
      case 'Receipt': return <Receipt className="h-4 w-4" />;
      case 'Users': return <Users className="h-4 w-4" />;
      case 'Ticket': return <Ticket className="h-4 w-4" />;
      case 'Bell': return <Bell className="h-4 w-4" />;
      case 'ScrollText': return <ScrollText className="h-4 w-4" />;
      case 'ShieldAlert': return <ShieldAlert className="h-4 w-4" />;
      case 'Server': return <Server className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const handleToggleAction = (scope: PermissionScope, action: PermissionAction) => {
    if (isSuperAdmin) return; // Super admin permissions are permanently locked to sovereign

    const existingActions = currentRolePermissions[scope] || [];
    const isGranted = existingActions.includes(action);

    const updatedActions = isGranted
      ? existingActions.filter((a) => a !== action)
      : [...existingActions, action];

    const updatedMap: Record<PermissionScope, PermissionAction[]> = {
      ...currentRolePermissions,
      [scope]: updatedActions,
    };

    setDirtyPermissions((prev) => ({
      ...prev,
      [activeRole.id]: updatedMap,
    }));
    setHasUnsavedChanges(true);
  };

  const handleToggleAllScope = (scope: PermissionScope, grant: boolean) => {
    if (isSuperAdmin) return;

    const descriptor = PERMISSION_SCOPES.find((s) => s.scope === scope);
    if (!descriptor) return;

    const updatedMap: Record<PermissionScope, PermissionAction[]> = {
      ...currentRolePermissions,
      [scope]: grant ? [...descriptor.supportedActions] : [],
    };

    setDirtyPermissions((prev) => ({
      ...prev,
      [activeRole.id]: updatedMap,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!hasUnsavedChanges) return;
    onUpdateRolePermissions(activeRole.id, currentRolePermissions);
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    setDirtyPermissions((prev) => {
      const copy = { ...prev };
      delete copy[activeRole.id];
      return copy;
    });
    setHasUnsavedChanges(false);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl p-4 sm:p-6 space-y-6">
      {/* Header & Role Switcher Pills */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-border/60">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <span>{t('adminManagement.matrix.title')}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t('adminManagement.matrix.subtitle')}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-subtle/80 border border-border/60">
          {roles.map((r) => {
            const isActive = r.key === activeRoleKey;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setActiveRoleKey(r.key);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-card text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isAr ? r.nameAr : r.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Role Meta Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface-subtle/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-foreground">
              {isAr ? activeRole.nameAr : activeRole.name}
            </h4>
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${activeRole.badgeColor}`}>
              L{activeRole.clearanceLevel} Clearance
            </span>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Lock className="h-3 w-3" /> Sovereign Immutable
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isAr ? activeRole.descriptionAr : activeRole.description}
          </p>
        </div>

        {/* Save / Reset changes */}
        <div className="flex items-center gap-2 shrink-0">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground border border-border bg-card"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('adminManagement.action.reset')}</span>
            </button>
          )}

          <button
            type="button"
            disabled={!hasUnsavedChanges || isSuperAdmin}
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
              hasUnsavedChanges && !isSuperAdmin
                ? 'bg-primary text-primary-foreground hover:opacity-95'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            <span>{t('adminManagement.action.saveChanges')}</span>
          </button>
        </div>
      </div>

      {/* Super Admin Immutable notice */}
      {isSuperAdmin && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            {t('adminManagement.matrix.superAdminNotice')}
          </span>
        </div>
      )}

      {/* Matrix Grid */}
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
              <th scope="col" className="py-3 px-4 min-w-[220px]">
                {t('adminManagement.matrix.colScope')}
              </th>
              {ALL_ACTIONS.map((action) => (
                <th key={action} scope="col" className="py-3 px-4 text-center">
                  <span className="font-bold text-foreground">
                    {action}
                  </span>
                </th>
              ))}
              <th scope="col" className="py-3 px-4 text-right">
                {t('adminManagement.matrix.colBatch')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {PERMISSION_SCOPES.map((scopeItem) => {
              const assignedActions = currentRolePermissions[scopeItem.scope] || [];
              const isAllGranted = scopeItem.supportedActions.every((a) => assignedActions.includes(a));

              return (
                <tr
                  key={scopeItem.scope}
                  className="hover:bg-surface-subtle/50 transition-colors"
                >
                  {/* Scope info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-surface-subtle border border-border text-primary shrink-0 mt-0.5">
                        {getScopeIcon(scopeItem.iconName)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          {isAr ? scopeItem.labelAr : scopeItem.labelEn}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                          {isAr ? scopeItem.descAr : scopeItem.descEn}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* 5 Actions Checkbox/Toggles */}
                  {ALL_ACTIONS.map((action) => {
                    const isSupported = scopeItem.supportedActions.includes(action);
                    const isGranted = assignedActions.includes(action);

                    if (!isSupported) {
                      return (
                        <td key={action} className="py-3.5 px-4 text-center">
                          <span className="text-muted-foreground/30 font-mono text-[10px]">
                            N/A
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={action} className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={isSuperAdmin}
                          onClick={() => handleToggleAction(scopeItem.scope, action)}
                          className={`h-7 w-7 rounded-lg inline-flex items-center justify-center transition-all ${
                            isGranted
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-surface-subtle/80 text-muted-foreground border border-border hover:border-primary/40'
                          } ${isSuperAdmin ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:scale-105'}`}
                        >
                          {isGranted ? (
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          ) : (
                            <X className="h-3.5 w-3.5 opacity-30" />
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Batch Toggle for this scope */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {!isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleToggleAllScope(scopeItem.scope, !isAllGranted)}
                        className="text-[11px] font-mono font-bold text-primary hover:underline"
                      >
                        {isAllGranted ? t('adminManagement.matrix.revokeScope') : t('adminManagement.matrix.grantScope')}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

RolePermissionsMatrix.displayName = 'RolePermissionsMatrix';
