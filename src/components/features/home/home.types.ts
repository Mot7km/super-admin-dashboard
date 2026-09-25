import type { LucideIcon } from 'lucide-react';

export type HeroKpi = {
  id: string;
  titleKey: string;
  value: string;
  subValue?: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  haloColor: string;
  data: Array<{ day: string; v: number }>;
  formatVal: (value: number) => string;
};

export type SentinelMetric = {
  id: string;
  labelKey: string;
  value: string;
  subtextKey: string;
  variant: 'default' | 'warning' | 'error' | 'success';
  icon: LucideIcon;
  badge?: string;
};

export type RevenuePoint = {
  month: string;
  mrr: number;
  revenue: number;
  newBusinesses: number;
  activeUsers: number;
};

export type SubscriptionPlanShare = {
  name: string;
  tenants: number;
  percentage: number;
  mrr: string;
  color: string;
};

export type RecentTenant = {
  id: string;
  name: string;
  category: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  region: string;
  mrr: string;
  status: 'active' | 'trial' | 'pending';
  joinedAtKey: string;
};

export type SystemEvent = {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  subtitle: string;
  timeKey: string;
  level: 'info' | 'success' | 'warning' | 'error';
};

export type TransactionVolumePoint = {
  time: string;
  orders: number;
  volume: number;
};

// Legacy types for compatibility
export type HomeProduct = {
  nameKey: string;
  views: string;
  percentage: number;
};

export type HomeReview = {
  id: number;
  customer: string;
  rating: number;
  dishKey: string;
  commentKey: string;
  timeKey: string;
};

export type HomeActivityItem = {
  id: number;
  icon: LucideIcon;
  titleKey: string;
  timeKey: string;
};

