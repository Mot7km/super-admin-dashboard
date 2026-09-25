export type TimeRange = 'today' | '7d' | '30d' | '3m' | '6m' | '12m' | 'custom';

export type AnalyticsTab =
  | 'overview'
  | 'growth'
  | 'subscriptions'
  | 'trials'
  | 'product'
  | 'operations';

export type KpiMetricKey =
  | 'totalBusinesses'
  | 'activeBusinesses'
  | 'newBusinesses'
  | 'mrr'
  | 'arr'
  | 'activeUsers'
  | 'orders'
  | 'churnRate'
  | 'trialToPaid';

export interface KpiMetricItem {
  key: KpiMetricKey;
  labelKey: string;
  current: number;
  previous: number;
  percentChange: number;
  trend: 'up' | 'down';
  isPositive: boolean; // whether "up" is good or bad (e.g. churn up is bad, churn down is good)
  format: 'currency' | 'number' | 'percent';
  currencyCode?: string;
  sparkline: number[];
  accentColor: 'emerald' | 'indigo' | 'blue' | 'violet' | 'amber' | 'rose' | 'teal';
  descriptionKey: string;
}

export interface PulsePoint {
  id: string;
  labelEn: string;
  labelAr: string;
  mrr: number;
  mrrPrev: number;
  activeBusinesses: number;
  newBusinesses: number;
}

export interface PlatformHealthItem {
  id: string;
  nameKey: string;
  status: 'healthy' | 'degraded' | 'down';
  metric: string;
  latencyMs?: number;
}

export interface AnalyticsFilterState {
  timeRange: TimeRange;
  compareWithPrevious: boolean;
  customStartDate?: string;
  customEndDate?: string;
}

export interface FunnelStep {
  id: string;
  stepNumber: number;
  labelKey: string;
  count: number;
  percentage: number; // percentage of first step
  dropoffPercent?: number; // dropoff from previous step
}

export interface BusinessStatusDistribution {
  active: number;
  trial: number;
  expired: number;
  suspended: number;
  cancelled: number;
  total: number;
}

export interface BusinessGrowthMonth {
  monthKey: string;
  labelEn: string;
  labelAr: string;
  newCount: number;
  activatedCount: number;
  suspendedCount: number;
  reactivatedCount: number;
}

export interface PlatformActivitySummary {
  totalOrders: number;
  productsAdded: number;
  employeesAdded: number;
  branchesCreated: number;
}

export interface MultiBranchStats {
  totalBranches: number;
  activeBranches: number;
  avgBranchesPerBusiness: number;
  avgOrdersPerBranchDay: number;
  avgSalesPerBranchDay: number;
  avgEmployeesPerBranch: number;
}

export interface GovernorateStat {
  id: string;
  nameEn: string;
  nameAr: string;
  businessCount: number;
  percent: number;
}

