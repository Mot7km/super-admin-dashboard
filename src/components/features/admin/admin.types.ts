export type AdminRoleKey =
  | 'super_admin'
  | 'support_admin'
  | 'finance_admin'
  | 'operations_admin'
  | 'content_admin'
  | 'custom';

export type ClearanceLevel = 0 | 1 | 2; // 0: Root Sovereign, 1: Department Lead, 2: Specialist

export type AdminStatus = 'active' | 'suspended' | 'pending_invite';

export type TwoFactorMethod = 'authenticator_app' | 'security_key' | 'sms';

export type PermissionScope =
  | 'tenants'
  | 'subscriptions'
  | 'finance'
  | 'platform_users'
  | 'support'
  | 'notifications'
  | 'audit_logs'
  | 'admin_management'
  | 'system_infrastructure';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'execute';

export interface RoleDefinition {
  id: string;
  key: AdminRoleKey;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  department: string;
  departmentAr: string;
  clearanceLevel: ClearanceLevel;
  memberCount: number;
  badgeColor: string;
  isSystem: boolean;
  permissions: Record<PermissionScope, PermissionAction[]>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roleKey: AdminRoleKey;
  status: AdminStatus;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod;
  lastActive: string;
  lastLoginIp: string;
  location: string;
  activeSessionsCount: number;
  customPermissionOverrides?: Partial<Record<PermissionScope, PermissionAction[]>>;
  createdDate: string;
}

export interface AdminAccessLog {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: AdminRoleKey;
  action: string;
  actionAr: string;
  scope: PermissionScope;
  resourceTarget: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  mfaVerified: boolean;
  status: 'success' | 'blocked' | 'challenge_required';
  riskScore: 'low' | 'medium' | 'high';
}

export interface AdminFilterState {
  search: string;
  role: string;
  status: string;
  twoFactor: string;
}

export type AdminModalAction =
  | { type: 'invite_admin' }
  | { type: 'edit_admin'; admin: AdminUser }
  | { type: 'change_role'; admin: AdminUser }
  | { type: 'revoke_sessions'; admin: AdminUser }
  | { type: 'suspend_admin'; admin: AdminUser }
  | { type: 'create_role' }
  | { type: 'edit_role'; role: RoleDefinition }
  | null;

export type AdminTab = 'users' | 'roles_matrix' | 'hierarchy' | 'access_logs';
