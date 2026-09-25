import type { FeatureFlag } from './feature-flags.types';

export interface PlanOption {
  id: string;
  name: string;
  badgeColor: string;
}

export interface BusinessOption {
  id: string;
  name: string;
  code: string;
  category: string;
}

export const AVAILABLE_PLANS: PlanOption[] = [
  { id: 'plan_free', name: 'Free Tier', badgeColor: 'border-slate-500 text-slate-400 bg-slate-500/10' },
  { id: 'plan_basic', name: 'Basic Starter', badgeColor: 'border-blue-500 text-blue-400 bg-blue-500/10' },
  { id: 'plan_pro', name: 'Pro Business', badgeColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
  { id: 'plan_enterprise', name: 'Enterprise Cloud', badgeColor: 'border-purple-500 text-purple-400 bg-purple-500/10' },
];

export const AVAILABLE_BUSINESSES: BusinessOption[] = [
  { id: 'biz_101', name: 'Al-Sultan Gourmet Grill', code: 'BUS-101', category: 'Restaurant' },
  { id: 'biz_102', name: 'Café Nero Artisan', code: 'BUS-102', category: 'Café' },
  { id: 'biz_103', name: 'Marina Fresh Roastery', code: 'BUS-103', category: 'Coffee & Roastery' },
  { id: 'biz_104', name: 'Downtown Express Bites', code: 'BUS-104', category: 'Fast Food' },
  { id: 'biz_105', name: 'Golden Fork Hospitality', code: 'BUS-105', category: 'Fine Dining' },
  { id: 'biz_106', name: 'Bakehouse 360 Artisans', code: 'BUS-106', category: 'Bakery' },
];

export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'ff_001',
    key: 'pos_v2',
    name: 'New Cloud POS Engine (V2)',
    description: 'Ultra-fast offline-first cloud cashier terminal with instant background sync and split-bill acceleration.',
    isEnabled: true,
    targetType: 'plans',
    targetIds: ['plan_pro', 'plan_enterprise'],
    targetLabels: ['Pro Business', 'Enterprise Cloud'],
    environment: 'production',
    tags: ['POS', 'Core', 'V2'],
    createdAt: '2026-08-15 09:30 AM',
    updatedAt: '2026-09-24 11:42 PM',
    createdBy: {
      id: 'usr_001',
      name: 'Ahmed Tariq (Lead Architect)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
    lastToggledBy: {
      name: 'Root Super Admin',
      at: '2026-09-24 11:42 PM',
    },
  },
  {
    id: 'ff_002',
    key: 'customer_reviews',
    name: 'Customer QR Reviews & Ratings',
    description: 'Post-checkout QR survey module that pushes real-time customer satisfaction sentiment to the business cockpit.',
    isEnabled: false,
    targetType: 'everyone',
    targetIds: [],
    targetLabels: ['All Tenants'],
    environment: 'production',
    tags: ['Marketing', 'Reviews'],
    createdAt: '2026-08-20 02:15 PM',
    updatedAt: '2026-09-22 04:30 PM',
    createdBy: {
      id: 'usr_002',
      name: 'Sara Nour (Product Mgr)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    },
    lastToggledBy: {
      name: 'Sara Nour',
      at: '2026-09-22 04:30 PM',
    },
  },
  {
    id: 'ff_003',
    key: 'advanced_analytics',
    name: 'Predictive Revenue & Telemetry',
    description: 'Real-time multi-branch cashflow projections, peak-hour heatmaps, and item margin velocity analytics.',
    isEnabled: true,
    targetType: 'plans',
    targetIds: ['plan_pro', 'plan_enterprise'],
    targetLabels: ['Pro Business', 'Enterprise Cloud'],
    environment: 'production',
    tags: ['Analytics', 'Finance'],
    createdAt: '2026-08-01 10:00 AM',
    updatedAt: '2026-09-20 01:20 PM',
    createdBy: {
      id: 'usr_001',
      name: 'Ahmed Tariq (Lead Architect)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
    lastToggledBy: {
      name: 'Finance Admin',
      at: '2026-09-20 01:20 PM',
    },
  },
  {
    id: 'ff_004',
    key: 'online_ordering',
    name: 'Direct WhatsApp & Web Storefront',
    description: 'Self-serve branded customer ordering portal with direct automated WhatsApp order dispatching.',
    isEnabled: true,
    targetType: 'businesses',
    targetIds: ['biz_101', 'biz_102'],
    targetLabels: ['Al-Sultan Gourmet Grill', 'Café Nero Artisan'],
    environment: 'production',
    tags: ['Online Ordering', 'Beta'],
    createdAt: '2026-09-02 04:45 PM',
    updatedAt: '2026-09-25 08:15 AM',
    createdBy: {
      id: 'usr_003',
      name: 'Karim Zidan (DevOps)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    lastToggledBy: {
      name: 'Karim Zidan',
      at: '2026-09-25 08:15 AM',
    },
  },
  {
    id: 'ff_005',
    key: 'ai_insights',
    name: 'AI Smart Demand & Inventory Restock',
    description: 'Deep-learning predictive agent that predicts ingredient spoilage and drafts vendor replenishment POs automatically.',
    isEnabled: true,
    targetType: 'percentage',
    targetIds: [],
    targetLabels: ['25% Canary Rollout'],
    rolloutPercentage: 25,
    environment: 'production',
    tags: ['AI', 'Beta', 'Inventory'],
    createdAt: '2026-09-10 11:30 AM',
    updatedAt: '2026-09-24 07:10 PM',
    createdBy: {
      id: 'usr_001',
      name: 'Ahmed Tariq (Lead Architect)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
    lastToggledBy: {
      name: 'Ahmed Tariq',
      at: '2026-09-24 07:10 PM',
    },
  },
  {
    id: 'ff_006',
    key: 'kitchen_display_v2',
    name: 'Multi-Station KDS Touch Routing',
    description: 'Touchscreen kitchen order flow coordinator with ticket prep timing, audio alerts, and expeditor screen.',
    isEnabled: true,
    targetType: 'everyone',
    targetIds: [],
    targetLabels: ['All Tenants'],
    environment: 'production',
    tags: ['KDS', 'Kitchen'],
    createdAt: '2026-07-28 08:00 AM',
    updatedAt: '2026-09-18 10:20 AM',
    createdBy: {
      id: 'usr_002',
      name: 'Sara Nour (Product Mgr)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    id: 'ff_007',
    key: 'multi_currency_checkout',
    name: 'Dynamic Multi-Currency & FX POS',
    description: 'Allows POS cashiers to accept foreign tourist currencies with automated Central Bank FX parity conversion.',
    isEnabled: false,
    targetType: 'plans',
    targetIds: ['plan_enterprise'],
    targetLabels: ['Enterprise Cloud'],
    environment: 'staging',
    tags: ['Payments', 'FX', 'Staging'],
    createdAt: '2026-09-18 03:00 PM',
    updatedAt: '2026-09-23 05:40 PM',
    createdBy: {
      id: 'usr_003',
      name: 'Karim Zidan (DevOps)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
  },
  {
    id: 'ff_008',
    key: 'biometric_pos_auth',
    name: 'Biometric Terminal Clock-in',
    description: 'WebAuthn hardware key and camera-based facial verification for supervisor overrides and shift clocking.',
    isEnabled: false,
    targetType: 'businesses',
    targetIds: ['biz_105'],
    targetLabels: ['Golden Fork Hospitality'],
    environment: 'development',
    tags: ['Security', 'Hardware', 'Experimental'],
    createdAt: '2026-09-21 06:10 PM',
    updatedAt: '2026-09-24 09:15 AM',
    createdBy: {
      id: 'usr_001',
      name: 'Ahmed Tariq (Lead Architect)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
  },
];
