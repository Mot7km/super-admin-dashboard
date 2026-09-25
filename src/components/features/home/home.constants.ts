import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  DollarSign,
  Headphones,
  Key,
  Server,
  Shield,
  ShoppingBag,
  TrendingDown,
  Users,
} from 'lucide-react';
import type {
  HeroKpi,
  RecentTenant,
  RevenuePoint,
  SentinelMetric,
  SubscriptionPlanShare,
  SystemEvent,
  TransactionVolumePoint,
} from './home.types';

// Sparklines for top Hero Cards
export const mrrSparkline = [
  { day: 'Day 1', v: 112000 },
  { day: 'Day 5', v: 115400 },
  { day: 'Day 10', v: 118900 },
  { day: 'Day 15', v: 121000 },
  { day: 'Day 20', v: 124500 },
  { day: 'Day 25', v: 126800 },
  { day: 'Day 30', v: 128450 },
];

export const businessesSparkline = [
  { day: 'Day 1', v: 1372 },
  { day: 'Day 5', v: 1380 },
  { day: 'Day 10', v: 1391 },
  { day: 'Day 15', v: 1400 },
  { day: 'Day 20', v: 1408 },
  { day: 'Day 25', v: 1414 },
  { day: 'Day 30', v: 1420 },
];

export const transactionsSparkline = [
  { day: 'Day 1', v: 28500 },
  { day: 'Day 5', v: 31200 },
  { day: 'Day 10', v: 36400 },
  { day: 'Day 15', v: 34100 },
  { day: 'Day 20', v: 42000 },
  { day: 'Day 25', v: 45600 },
  { day: 'Day 30', v: 48900 },
];

export const usersSparkline = [
  { day: 'Day 1', v: 25100 },
  { day: 'Day 5', v: 25800 },
  { day: 'Day 10', v: 26400 },
  { day: 'Day 15', v: 27100 },
  { day: 'Day 20', v: 27600 },
  { day: 'Day 25', v: 28100 },
  { day: 'Day 30', v: 28450 },
];

// 1. Top Deck: 4 Strategic Hero KPIs
export const heroKpis: HeroKpi[] = [
  {
    id: 'mrr-revenue',
    titleKey: 'dashboard.kpis.mrr',
    value: '$128,450',
    subValue: 'ARR: $1.54M',
    change: '+14.8% MoM',
    isPositive: true,
    icon: DollarSign,
    haloColor: 'from-blue-500/15 via-primary/10 to-transparent',
    data: mrrSparkline,
    formatVal: (val: number) => `$${val.toLocaleString()}`,
  },
  {
    id: 'total-businesses',
    titleKey: 'dashboard.kpis.totalBusinesses',
    value: '1,420',
    subValue: '1,388 Active (97.7%)',
    change: '+48 New this month',
    isPositive: true,
    icon: Building2,
    haloColor: 'from-teal-500/15 via-secondary/10 to-transparent',
    data: businessesSparkline,
    formatVal: (val: number) => `${val.toLocaleString()} Tenants`,
  },
  {
    id: 'platform-orders-volume',
    titleKey: 'dashboard.kpis.ordersVolume',
    value: '342,890',
    subValue: '$4.82M Total GMV',
    change: '+18.2% vs last month',
    isPositive: true,
    icon: ShoppingBag,
    haloColor: 'from-cyan-500/15 via-accent/10 to-transparent',
    data: transactionsSparkline,
    formatVal: (val: number) => `${val.toLocaleString()} Orders`,
  },
  {
    id: 'active-users',
    titleKey: 'dashboard.kpis.activeUsers',
    value: '28,450',
    subValue: '72% DAU/MAU Stickiness',
    change: '+11.5% active',
    isPositive: true,
    icon: Users,
    haloColor: 'from-purple-500/15 via-purple-600/10 to-transparent',
    data: usersSparkline,
    formatVal: (val: number) => `${val.toLocaleString()} Users`,
  },
];

// 2. Operational Sentinel Alert Strip
export const sentinelMetrics: SentinelMetric[] = [
  {
    id: 'expiring-subscriptions',
    labelKey: 'dashboard.sentinel.expiringSubscriptions',
    value: '18 Plans',
    subtextKey: 'dashboard.sentinel.expiringSubtext',
    variant: 'warning',
    icon: AlertTriangle,
    badge: '< 7 Days',
  },
  {
    id: 'churned-businesses',
    labelKey: 'dashboard.sentinel.churnedBusinesses',
    value: '4 Businesses',
    subtextKey: 'dashboard.sentinel.churnRate',
    variant: 'error',
    icon: TrendingDown,
    badge: '0.28% Churn',
  },
  {
    id: 'support-tickets',
    labelKey: 'dashboard.sentinel.openSupportTickets',
    value: '7 Open Tickets',
    subtextKey: 'dashboard.sentinel.ticketSla',
    variant: 'default',
    icon: Headphones,
    badge: '4.2m SLA',
  },
  {
    id: 'api-throughput-errors',
    labelKey: 'dashboard.sentinel.apiHealth',
    value: '1,420 req/s',
    subtextKey: 'dashboard.sentinel.apiErrors',
    variant: 'success',
    icon: Activity,
    badge: '0.02% Errors',
  },
];

// 3. Revenue & Business Trajectory (Monthly data)
export const revenueTrajectoryData: RevenuePoint[] = [
  { month: 'Jan', mrr: 88000, revenue: 114000, newBusinesses: 32, activeUsers: 19800 },
  { month: 'Feb', mrr: 94000, revenue: 122000, newBusinesses: 36, activeUsers: 21200 },
  { month: 'Mar', mrr: 99500, revenue: 129000, newBusinesses: 41, activeUsers: 22800 },
  { month: 'Apr', mrr: 104000, revenue: 135000, newBusinesses: 38, activeUsers: 23900 },
  { month: 'May', mrr: 109800, revenue: 142000, newBusinesses: 45, activeUsers: 24700 },
  { month: 'Jun', mrr: 114200, revenue: 148000, newBusinesses: 42, activeUsers: 25600 },
  { month: 'Jul', mrr: 118000, revenue: 153000, newBusinesses: 40, activeUsers: 26200 },
  { month: 'Aug', mrr: 122500, revenue: 159000, newBusinesses: 47, activeUsers: 27100 },
  { month: 'Sep', mrr: 128450, revenue: 167000, newBusinesses: 48, activeUsers: 28450 },
];

// 4. Subscription Plan Distribution
export const subscriptionPlanData: SubscriptionPlanShare[] = [
  { name: 'Enterprise', tenants: 596, percentage: 42, mrr: '$53,950', color: '#3B82F6' },
  { name: 'Professional', tenants: 540, percentage: 38, mrr: '$48,810', color: '#10B981' },
  { name: 'Starter', tenants: 284, percentage: 20, mrr: '$25,690', color: '#8B5CF6' },
];

// 5. System Transaction Volume / Velocity over 24 hours
export const transactionVolumeData: TransactionVolumePoint[] = [
  { time: '00:00', orders: 420, volume: 12400 },
  { time: '03:00', orders: 180, volume: 5600 },
  { time: '06:00', orders: 390, volume: 11200 },
  { time: '09:00', orders: 1840, volume: 46200 },
  { time: '12:00', orders: 3420, volume: 89400 },
  { time: '15:00', orders: 2890, volume: 74200 },
  { time: '18:00', orders: 3980, volume: 104500 },
  { time: '21:00', orders: 4650, volume: 128900 },
  { time: '23:00', orders: 2100, volume: 58200 },
];

// 6. Recent Tenant Business Onboardings
export const recentTenants: RecentTenant[] = [
  {
    id: 't-101',
    name: 'Gourmet Cloud Kitchens',
    category: 'Cloud Kitchens',
    plan: 'Enterprise',
    region: 'Riyadh, KSA',
    mrr: '$1,200/mo',
    status: 'active',
    joinedAtKey: 'dashboard.timeAgo.m10',
  },
  {
    id: 't-102',
    name: 'Sultan Coffee Roasters (12 Branches)',
    category: 'Specialty Coffee',
    plan: 'Enterprise',
    region: 'Cairo, Egypt',
    mrr: '$950/mo',
    status: 'active',
    joinedAtKey: 'dashboard.timeAgo.m45',
  },
  {
    id: 't-103',
    name: 'Urban Slice Pizza Hub',
    category: 'Fast Casual',
    plan: 'Pro',
    region: 'Dubai, UAE',
    mrr: '$450/mo',
    status: 'active',
    joinedAtKey: 'dashboard.timeAgo.h2',
  },
  {
    id: 't-104',
    name: 'Al-Ahram Hospitality Group',
    category: 'Restaurant Chain',
    plan: 'Enterprise',
    region: 'Alexandria, Egypt',
    mrr: '$1,400/mo',
    status: 'trial',
    joinedAtKey: 'dashboard.timeAgo.h4',
  },
  {
    id: 't-105',
    name: 'Taco Libre Street Kitchen',
    category: 'Boutique Dining',
    plan: 'Starter',
    region: 'Jeddah, KSA',
    mrr: '$150/mo',
    status: 'active',
    joinedAtKey: 'dashboard.timeAgo.h6',
  },
];

// 7. Live Audit & System Telemetry Events
export const systemEvents: SystemEvent[] = [
  {
    id: 'ev-1',
    icon: Key,
    titleKey: 'dashboard.audit.apiKeyProvisioned',
    subtitle: 'Tenant #1420 (Gourmet Cloud Kitchens) API v2 enabled',
    timeKey: 'dashboard.timeAgo.m2',
    level: 'info',
  },
  {
    id: 'ev-2',
    icon: CheckCircle2,
    titleKey: 'dashboard.audit.planAutoRenewed',
    subtitle: 'Sultan Coffee Roasters recurring $950 processed via Stripe',
    timeKey: 'dashboard.timeAgo.m10',
    level: 'success',
  },
  {
    id: 'ev-3',
    icon: Server,
    titleKey: 'dashboard.audit.clusterAutoScaled',
    subtitle: 'Cluster eu-west-1 scaled +2 worker pods on peak load',
    timeKey: 'dashboard.timeAgo.h1',
    level: 'info',
  },
  {
    id: 'ev-4',
    icon: Shield,
    titleKey: 'dashboard.audit.complianceCheckPassed',
    subtitle: 'Zero vulnerability findings across 1,420 tenant databases',
    timeKey: 'dashboard.timeAgo.h3',
    level: 'success',
  },
];
