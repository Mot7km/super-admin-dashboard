export type PlanTier = 'Free' | 'Basic' | 'Pro' | 'Enterprise' | (string & {});
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled' | 'pending_renewal';

export type SaaSPlanFeature = {
  id: string;
  name: string;
  nameAr: string;
  included: boolean;
  highlight?: boolean;
};

export type SaaSPlan = {
  id: string;
  tier: PlanTier;
  name: string;
  tagline: string;
  taglineAr: string;
  priceMonthly: number;
  priceAnnual: number; // monthly equivalent when paid annually
  currency: string;
  maxBranches: number; // -1 = Unlimited
  maxEmployees: number; // -1 = Unlimited
  maxProducts: number; // -1 = Unlimited
  storageGb: number;
  trialDays: number;
  isPopular?: boolean;
  features: SaaSPlanFeature[];
  limits: {
    apiCallsPerMonth: number;
    customDomains: boolean;
    prioritySupport: boolean;
    whiteLabel: boolean;
  };
  subscribersCount: number;
};

export type SubscriptionAdjustment = {
  branchesLimitBonus: number;
  employeesLimitBonus: number;
  storageGbBonus: number;
  gracePeriodDays: number;
  notes?: string;
};

export type Subscription = {
  id: string;
  businessId: string;
  businessName: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  planTier: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  autoRenew: boolean;
  pricePaid: number;
  discountApplied?: {
    code: string;
    percent?: number;
    amount?: number;
  };
  customOverrides?: SubscriptionAdjustment;
  branchesUsed: number;
  branchesLimit: number;
  employeesUsed: number;
  employeesLimit: number;
  mrrContribution: number;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validPlans: PlanTier[];
  maxRedemptions: number;
  redemptionsCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
};

export type SubscriptionFilterState = {
  search: string;
  status: 'all' | SubscriptionStatus;
  tier: 'all' | PlanTier;
  billingCycle: 'all' | BillingCycle;
  sortBy: 'mrr_desc' | 'mrr_asc' | 'renewal_asc' | 'created_desc';
  page: number;
  pageSize: number;
};

export type SubscriptionModalAction =
  | { type: 'renew'; subscription: Subscription }
  | { type: 'change_tier'; subscription: Subscription; mode: 'upgrade' | 'downgrade' }
  | { type: 'manual_adjust'; subscription: Subscription }
  | { type: 'cancel'; subscription: Subscription }
  | { type: 'create_plan' }
  | { type: 'edit_plan'; plan: SaaSPlan }
  | { type: 'delete_plan'; plan: SaaSPlan }
  | { type: 'create_coupon' }
  | null;
