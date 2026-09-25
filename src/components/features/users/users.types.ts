export type UserRole =
  | 'super_admin'
  | 'support_staff'
  | 'business_owner'
  | 'branch_manager'
  | 'cashier';

export type UserStatus = 'active' | 'locked' | 'disabled' | 'pending';

export type DeviceType = 'desktop' | 'mobile' | 'pos_terminal' | 'tablet';

export type UserSession = {
  id: string;
  deviceType: DeviceType;
  deviceModel: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
};

export type GlobalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  businessId: string; // 'system' or tenant ID (e.g. 't-101')
  businessName: string;
  branchId?: string;
  branchName?: string;
  status: UserStatus;
  mfaEnabled: boolean;
  lastLogin: string;
  createdAt: string;
  sessions: UserSession[];
  notes?: string;
};

export type UserFilterState = {
  search: string;
  role: 'all' | UserRole;
  status: 'all' | UserStatus;
  business: string; // 'all' or business ID/name
  sortBy: 'last_login_desc' | 'created_desc' | 'name_asc' | 'sessions_desc';
  page: number;
  pageSize: number;
  viewMode: 'table' | 'grid';
};

export type UserModalAction =
  | { type: 'change_role'; user: GlobalUser }
  | { type: 'reset_password'; user: GlobalUser }
  | { type: 'force_logout'; user: GlobalUser }
  | { type: 'toggle_status'; user: GlobalUser; targetStatus: 'disabled' | 'active' | 'locked' }
  | { type: 'manage_sessions'; user: GlobalUser }
  | { type: 'create_user' }
  | null;
