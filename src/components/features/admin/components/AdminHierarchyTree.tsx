import { memo, useState, type FC } from 'react';
import {
  ShieldAlert,
  CreditCard,
  Server,
  Ticket,
  Bell,
  Users,
  Sliders,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { RoleDefinition, AdminUser, AdminModalAction } from '../admin.types';

type AdminHierarchyTreeProps = {
  roles: RoleDefinition[];
  admins: AdminUser[];
  onOpenModal: (action: AdminModalAction) => void;
  onSelectRoleForMatrix?: (roleKey: string) => void;
};

export const AdminHierarchyTree: FC<AdminHierarchyTreeProps> = memo(({
  roles,
  admins,
  onOpenModal,
  onSelectRoleForMatrix,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('super_admin');

  const superAdminRole = roles.find((r) => r.key === 'super_admin');
  const departmentalRoles = roles.filter((r) => r.key !== 'super_admin');

  const getRoleIcon = (key: string) => {
    switch (key) {
      case 'super_admin':
        return <ShieldAlert className="h-6 w-6 text-amber-400" />;
      case 'finance_admin':
        return <CreditCard className="h-5 w-5 text-emerald-400" />;
      case 'operations_admin':
        return <Server className="h-5 w-5 text-cyan-400" />;
      case 'support_admin':
        return <Ticket className="h-5 w-5 text-indigo-400" />;
      case 'content_admin':
        return <Bell className="h-5 w-5 text-purple-400" />;
      default:
        return <Users className="h-5 w-5 text-primary" />;
    }
  };

  const getMembersOfRole = (roleKey: string) => {
    return admins.filter((a) => a.roleKey === roleKey);
  };

  const selectedRole = roles.find((r) => r.key === selectedRoleKey) || superAdminRole;
  const selectedRoleMembers = selectedRole ? getMembersOfRole(selectedRole.key) : [];

  return (
    <div className="space-y-6">
      {/* Visual Hierarchy Tree Container */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <span>{t('adminManagement.hierarchy.title')}</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('adminManagement.hierarchy.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenModal({ type: 'create_role' })}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          >
            <span>+</span>
            <span>{t('adminManagement.action.createNewRole')}</span>
          </button>
        </div>

        {/* Tree Render Structure */}
        <div className="mt-8 flex flex-col items-center">
          {/* 1. Level 0 Sovereign Root Node */}
          {superAdminRole && (
            <div
              onClick={() => setSelectedRoleKey('super_admin')}
              className={`w-full max-w-md rounded-2xl border transition-all duration-300 p-5 cursor-pointer text-center relative group ${
                selectedRoleKey === 'super_admin'
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/30'
                  : 'border-border bg-card/80 hover:border-amber-500/50 hover:bg-surface-subtle'
              }`}
            >
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
                {getRoleIcon('super_admin')}
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h4 className="text-base font-extrabold text-foreground tracking-tight">
                  {isAr ? superAdminRole.nameAr : superAdminRole.name}
                </h4>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  L0 Sovereign
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto line-clamp-2">
                {isAr ? superAdminRole.descriptionAr : superAdminRole.description}
              </p>

              {/* Members Avatars preview */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <div className="flex items-center -space-x-2">
                  {getMembersOfRole('super_admin').map((m) => (
                    <img
                      key={m.id}
                      src={m.avatar}
                      alt={m.name}
                      title={m.name}
                      className="h-7 w-7 rounded-full border-2 border-card object-cover ring-1 ring-border"
                    />
                  ))}
                  <span className="text-xs font-mono font-bold text-muted-foreground ml-3">
                    {getMembersOfRole('super_admin').length} {t('adminManagement.hierarchy.members')}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  {t('adminManagement.hierarchy.rootAccess')}
                </span>
              </div>
            </div>
          )}

          {/* Vertical Connecting Trunk */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-amber-500/60 to-primary/40 my-1" />

          {/* Horizontal Branch Bar */}
          <div className="w-full max-w-4xl h-0.5 bg-border relative">
            <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
          </div>

          {/* 2. Departmental Child Nodes Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {departmentalRoles.map((role) => {
              const isSelected = selectedRoleKey === role.key;
              const roleMembers = getMembersOfRole(role.key);

              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleKey(role.key)}
                  className={`rounded-2xl border transition-all duration-300 p-4 cursor-pointer relative group flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30'
                      : 'border-border bg-card/70 hover:border-primary/50 hover:bg-surface-subtle'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-surface-subtle border border-border">
                        {getRoleIcon(role.key)}
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${role.badgeColor}`}>
                        L{role.clearanceLevel} Clearance
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {isAr ? role.nameAr : role.name}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono block mb-2">
                      {isAr ? role.departmentAr : role.department}
                    </span>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {isAr ? role.descriptionAr : role.description}
                    </p>
                  </div>

                  {/* Card Footer with Avatars */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center -space-x-1.5">
                      {roleMembers.slice(0, 3).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          title={m.name}
                          className="h-6 w-6 rounded-full border-2 border-card object-cover"
                        />
                      ))}
                      {roleMembers.length > 3 && (
                        <span className="h-6 w-6 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground">
                          +{roleMembers.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {roleMembers.length} {t('adminManagement.hierarchy.staff')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Role Deep-Dive Inspection Panel */}
      {selectedRole && (
        <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-surface-subtle border border-border">
                {getRoleIcon(selectedRole.key)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-foreground">
                    {isAr ? selectedRole.nameAr : selectedRole.name}
                  </h4>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${selectedRole.badgeColor}`}>
                    L{selectedRole.clearanceLevel} Clearance
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {isAr ? selectedRole.departmentAr : selectedRole.department}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onSelectRoleForMatrix && (
                <button
                  type="button"
                  onClick={() => onSelectRoleForMatrix(selectedRole.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:opacity-95"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>{t('adminManagement.action.viewPermissionsMatrix')}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpenModal({ type: 'edit_role', role: selectedRole })}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border bg-card hover:bg-surface-subtle text-foreground"
              >
                {t('adminManagement.action.editRole')}
              </button>
            </div>
          </div>

          {/* Members in this role list */}
          <div className="mt-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{t('adminManagement.hierarchy.assignedStaff')} ({selectedRoleMembers.length})</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedRoleMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-surface-subtle/50 hover:bg-surface-subtle transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-9 w-9 rounded-full object-cover border border-border"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-foreground truncate block">
                        {member.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate block font-mono">
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {member.location.split(',')[0]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 font-mono">
                      <Lock className="h-2.5 w-2.5" /> 2FA Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AdminHierarchyTree.displayName = 'AdminHierarchyTree';
