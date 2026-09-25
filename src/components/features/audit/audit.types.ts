export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AuditCategory =
  | 'security'
  | 'business'
  | 'billing'
  | 'identity'
  | 'system';

export type AuditStatus = 'success' | 'failure' | 'warning';

export type AuditActionVerb =
  | 'business_suspended'
  | 'business_activated'
  | 'business_plan_changed'
  | 'account_locked'
  | 'account_unlocked'
  | 'password_reset'
  | 'session_revoked'
  | 'force_logout'
  | 'refund_issued'
  | 'role_elevated'
  | 'quota_overridden'
  | 'api_key_rotated'
  | 'unauthorized_access_attempt'
  | 'impersonation_started'
  | 'impersonation_ended'
  | 'coupon_created'
  | 'system_setting_updated';

export type AuditActor = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isSystem?: boolean;
};

export type AuditResource = {
  type:
    | 'business'
    | 'user'
    | 'subscription'
    | 'invoice'
    | 'gateway'
    | 'security_policy'
    | 'system_core';
  id: string;
  name: string;
  businessId?: string;
  businessName?: string;
};

export type AuditStateDiff = {
  field: string;
  label: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
};

export type AuditClientContext = {
  ipAddress: string;
  location: string;
  countryCode: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'cli' | 'api_gateway';
  requestId: string;
};

export type AuditLogEntry = {
  id: string; // e.g. 'aud_904128'
  timestamp: string; // ISO
  actor: AuditActor;
  action: AuditActionVerb;
  actionLabel: string;
  category: AuditCategory;
  severity: AuditSeverity;
  status: AuditStatus;
  resource: AuditResource;
  description: string;
  diff?: AuditStateDiff[];
  clientContext: AuditClientContext;
  hashSignature: string; // e.g. 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  failureReason?: string;
  httpStatus?: number;
};

export type AuditDatePreset = 'all' | 'today' | '24h' | '7d' | '30d' | 'custom';

export type AuditFilterState = {
  search: string;
  category: 'all' | AuditCategory;
  severity: 'all' | AuditSeverity;
  status: 'all' | AuditStatus;
  actor: string; // 'all' or actor name/id
  business: string; // 'all' or businessId
  resourceType: string; // 'all' or resource type
  dateRange: AuditDatePreset;
  startDate?: string;
  endDate?: string;
  ipAddress: string;
  page: number;
  pageSize: number;
  viewMode: 'table' | 'timeline';
};

export type AuditModalAction =
  | { type: 'view_details'; entry: AuditLogEntry }
  | { type: 'view_diff'; entry: AuditLogEntry }
  | { type: 'export_dossier' }
  | null;
