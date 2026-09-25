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

// -------------------------------------------------------------
// Phase 3: Subscriptions, Revenue & Payment Intelligence Types
// -------------------------------------------------------------

export interface MrrWaterfallStep {
  key: 'starting' | 'new' | 'expansion' | 'contraction' | 'churn' | 'ending';
  labelKey: string;
  amount: number;
  isPositive?: boolean;
  isNegative?: boolean;
  isTotal?: boolean;
}

export interface MrrMovementSummary {
  startingMrr: number;
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnedMrr: number;
  endingMrr: number;
  netNewMrr: number;
  quickRatio: number;
  steps: MrrWaterfallStep[];
}

export interface SubscriptionPlanBreakdown {
  id: string;
  nameKey: string;
  tier: 'basic' | 'pro' | 'enterprise';
  subscribersCount: number;
  percent: number;
  mrrAmount: number;
  mrrPercent: number;
  priceMonthly: number;
  color: string;
}

export interface BillingCycleStat {
  cycle: 'monthly' | 'annual';
  labelKey: string;
  subscribersCount: number;
  percent: number;
  annualDiscountNote: string;
}

export interface SubscriptionCadenceStats {
  monthlyUpgrades: number;
  monthlyDowngrades: number;
  autoRenewPercent: number;
  upcomingRenewals7d: number;
}

export interface PaymentGatewayStat {
  id: string;
  name: string;
  methodKey: string;
  volumeEgp: number;
  txCount: number;
  successRate: number;
  sharePercent: number;
  color: string;
}

export interface PaymentFailureReasonItem {
  id: string;
  labelKey: string;
  count: number;
  percent: number;
  category: 'balance' | 'expiry' | 'network' | 'fraud';
}

export interface InvoiceCollectionStats {
  totalInvoicesCount: number;
  totalInvoicesAmount: number;
  paidCount: number;
  paidAmount: number;
  paidPercent: number;
  pendingCount: number;
  pendingAmount: number;
  pendingPercent: number;
  overdueCount: number;
  overdueAmount: number;
  overduePercent: number;
  dsoDays: number;
  totalRefundedAmount: number;
  refundsRate: number;
}

// -------------------------------------------------------------
// Phase 4: Trials & Cohort Retention Intelligence Types
// -------------------------------------------------------------

export interface TrialConversionStep {
  id: string;
  stepNumber: number;
  labelKey: string;
  count: number;
  conversionPercent: number;
  dropoffPercent?: number;
  stageAvgTimeDays?: number;
}

export interface TrialStatusOverview {
  activeTrials: number;
  convertedPaid: number;
  expiredUnconverted: number;
  extendedTrials: number;
  avgDaysToConvert: number;
  totalTrials: number;
  conversionRate: number;
}

export interface CohortMonthItem {
  monthKey: string;
  labelEn: string;
  labelAr: string;
  cohortSize: number;
  retentionPercentages: (number | null)[]; // e.g. [100, 82, 71, 65, 59, 54]
}

export interface RetentionCurvePoint {
  monthIndex: number;
  label: string;
  tenantRetention: number;
  userRetention: number;
  benchmarkRetention: number;
}

export interface TrialDropoffReason {
  id: string;
  reasonKey: string;
  count: number;
  percent: number;
  category: 'budget' | 'hardware' | 'setup' | 'training' | 'alternative';
}

// -------------------------------------------------------------
// Phase 5: Users, Product Usage & GMV Intelligence Types
// -------------------------------------------------------------

export interface UserActivitySummary {
  activeUsers: number;
  totalRegisteredUsers: number;
  newUsersThisMonth: number;
  dau: number;
  wau: number;
  mau: number;
  stickinessRatio: number;
}

export interface UserRoleItem {
  roleKey: string;
  nameKey: string;
  count: number;
  percent: number;
  color: string;
}

export interface UserEngagementSegment {
  segmentKey: string;
  labelKey: string;
  count: number;
  percent: number;
  descriptionKey: string;
  color: string;
}

export interface ProductFeatureUsageItem {
  id: string;
  featureKey: string;
  nameKey: string;
  adoptionCount: number;
  adoptionPercent: number;
  dailyInteractions: number;
  trend: string;
  color: string;
}

export interface FeatureAdoptionFunnelStep {
  id: string;
  stepNumber: number;
  labelKey: string;
  count: number;
  percentage: number;
  dropoffPercent?: number;
}

export interface GmvBusinessTypeShare {
  typeKey: string;
  nameKey: string;
  gmvAmount: number;
  percent: number;
  ordersCount: number;
  color: string;
}

export interface GmvIntelligenceSummary {
  totalGmv: number;
  totalOrders: number;
  aov: number;
  platformRevenue: number;
  takeRatePercent: number;
  businessTypeShares: GmvBusinessTypeShare[];
}

