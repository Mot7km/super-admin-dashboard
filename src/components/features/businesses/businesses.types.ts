export type BusinessStatus = 'active' | 'trial' | 'suspended' | 'disabled' | 'pending';
export type BusinessPlan = 'Enterprise' | 'Pro' | 'Starter';
export type BillingCycle = 'monthly' | 'annual';

export type BusinessOwner = {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
};

export type BusinessBranch = {
  id: string;
  name: string;
  city: string;
  isMain: boolean;
  status: 'active' | 'maintenance' | 'closed';
  staffCount: number;
  ordersCount: number;
  revenueMonth: number;
};

export type BusinessAuditLog = {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
  type: 'info' | 'warning' | 'security' | 'billing';
};

export type Business = {
  id: string;
  name: string;
  legalName: string;
  subdomain: string;
  customDomain?: string;
  category: string;
  country: string;
  countryCode: string;
  city: string;
  crNumber: string;
  vatNumber: string;
  currency: string;
  status: BusinessStatus;
  plan: BusinessPlan;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  mrr: number; // USD
  gmvTotal: number;
  ordersCount: number;
  branchesCount: number;
  branchesLimit: number;
  employeesCount: number;
  employeesLimit: number;
  storageUsedGb: number;
  storageLimitGb: number;
  apiCallsMonth: number;
  apiCallsLimit: number;
  owner: BusinessOwner;
  branches: BusinessBranch[];
  auditLogs: BusinessAuditLog[];
  createdAt: string;
  lastActiveAt: string;
  suspendedReason?: string;
  notes?: string;
};

export type BusinessSortField =
  | 'mrr_desc'
  | 'mrr_asc'
  | 'created_desc'
  | 'orders_desc'
  | 'storage_desc'
  | 'name_asc';

export type BusinessFilterState = {
  search: string;
  status: 'all' | BusinessStatus;
  plan: 'all' | BusinessPlan;
  dateRange: 'all' | '7d' | '30d' | 'quarter' | 'year';
  sortBy: BusinessSortField;
  page: number;
  pageSize: number;
  viewMode: 'table' | 'grid';
};

export type BusinessActionModalState =
  | { type: 'impersonate'; business: Business }
  | { type: 'change_plan'; business: Business }
  | { type: 'extend_sub'; business: Business }
  | { type: 'suspend'; business: Business }
  | { type: 'activate'; business: Business }
  | { type: 'disable'; business: Business }
  | { type: 'reset_settings'; business: Business }
  | { type: 'delete'; business: Business }
  | null;
