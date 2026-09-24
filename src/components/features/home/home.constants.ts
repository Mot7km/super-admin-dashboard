import {
  AlertCircle,
  QrCode,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Utensils,
} from 'lucide-react';

export const sparklineData1 = [
  { day: 'Feb 22', v: 1200 },
  { day: 'Feb 23', v: 1800 },
  { day: 'Feb 24', v: 1600 },
  { day: 'Feb 25', v: 2400 },
  { day: 'Feb 26', v: 2100 },
  { day: 'Feb 27', v: 3100 },
  { day: 'Feb 28', v: 3850 },
];

export const sparklineData2 = [
  { day: 'Feb 22', v: 120 },
  { day: 'Feb 23', v: 125 },
  { day: 'Feb 24', v: 130 },
  { day: 'Feb 25', v: 135 },
  { day: 'Feb 26', v: 138 },
  { day: 'Feb 27', v: 140 },
  { day: 'Feb 28', v: 142 },
];

export const sparklineData3 = [
  { day: 'Feb 22', v: 4.5 },
  { day: 'Feb 23', v: 4.6 },
  { day: 'Feb 24', v: 4.7 },
  { day: 'Feb 25', v: 4.8 },
  { day: 'Feb 26', v: 4.8 },
  { day: 'Feb 27', v: 4.9 },
  { day: 'Feb 28', v: 4.9 },
];

export const sparklineData4 = [
  { day: 'Feb 22', v: 2100 },
  { day: 'Feb 23', v: 2400 },
  { day: 'Feb 24', v: 2800 },
  { day: 'Feb 25', v: 2600 },
  { day: 'Feb 26', v: 3100 },
  { day: 'Feb 27', v: 3300 },
  { day: 'Feb 28', v: 3420 },
];

export const homeStats = [
  {
    titleKey: 'dashboard.stats.totalMenuViews',
    value: '24,850',
    change: '↑ 14.2%',
    icon: QrCode,
    haloColor: 'from-blue-500/10 to-cyan-500/5',
    data: sparklineData1,
    formatVal: (val: number) => `${val.toLocaleString()} views`,
  },
  {
    titleKey: 'dashboard.stats.activeProducts',
    value: '142',
    changeKey: 'dashboard.stats.soldOutBadge',
    icon: Utensils,
    haloColor: 'from-emerald-500/10 to-teal-500/5',
    data: sparklineData2,
    formatVal: (val: number) => `${val} products`,
  },
  {
    titleKey: 'dashboard.stats.averageRating',
    value: '4.9 ★',
    changeKey: 'dashboard.stats.reviewsBadge',
    icon: Star,
    haloColor: 'from-amber-500/10 to-yellow-500/5',
    data: sparklineData3,
    formatVal: (val: number) => `${val} ★`,
  },
  {
    titleKey: 'dashboard.stats.todaySales',
    value: '$3,420',
    change: '↑ 8.6%',
    icon: TrendingUp,
    haloColor: 'from-sky-500/10 to-blue-500/5',
    data: sparklineData4,
    formatVal: (val: number) => `$${val.toLocaleString()}`,
  },
];

export const branchComparisonData = [
  { name: 'Week 1', mainBranchSales: 4200, mallBranchSales: 2800, mainBranchViews: 5400, mallBranchViews: 3200 },
  { name: 'Week 2', mainBranchSales: 5100, mallBranchSales: 3400, mainBranchViews: 6800, mallBranchViews: 4100 },
  { name: 'Week 3', mainBranchSales: 4900, mallBranchSales: 3900, mainBranchViews: 6200, mallBranchViews: 4800 },
  { name: 'Week 4', mainBranchSales: 6300, mallBranchSales: 4500, mainBranchViews: 8100, mallBranchViews: 5600 },
];

export const topProducts = [
  { nameKey: 'dashboard.products.truffleBurger', views: '4,820', percentage: 92 },
  { nameKey: 'dashboard.products.icedLatte', views: '3,950', percentage: 78 },
  { nameKey: 'dashboard.products.margheritaPizza', views: '3,120', percentage: 62 },
  { nameKey: 'dashboard.products.crispyChicken', views: '2,640', percentage: 50 },
  { nameKey: 'dashboard.products.pistachioPancake', views: '1,980', percentage: 38 },
];

export const recentReviews = [
  {
    id: 1,
    customer: 'Sami Al-Mansoor',
    rating: 5,
    dishKey: 'dashboard.products.truffleBurger',
    commentKey: 'dashboard.reviewsList.r1',
    timeKey: 'dashboard.timeAgo.m10',
  },
  {
    id: 2,
    customer: 'Laila H.',
    rating: 5,
    dishKey: 'dashboard.products.icedLatte',
    commentKey: 'dashboard.reviewsList.r2',
    timeKey: 'dashboard.timeAgo.m45',
  },
  {
    id: 3,
    customer: 'Tariq K.',
    rating: 4,
    dishKey: 'dashboard.products.margheritaPizza',
    commentKey: 'dashboard.reviewsList.r3',
    timeKey: 'dashboard.timeAgo.h2',
  },
];

export const activityFeed = [
  {
    id: 1,
    icon: QrCode,
    titleKey: 'dashboard.activity.qrScanned',
    timeKey: 'dashboard.timeAgo.m2',
  },
  {
    id: 2,
    icon: Star,
    titleKey: 'dashboard.activity.reviewSubmitted',
    timeKey: 'dashboard.timeAgo.m10',
  },
  {
    id: 3,
    icon: AlertCircle,
    titleKey: 'dashboard.activity.itemSoldOut',
    timeKey: 'dashboard.timeAgo.h1',
  },
  {
    id: 4,
    icon: ShoppingBag,
    titleKey: 'dashboard.activity.newOrder',
    timeKey: 'dashboard.timeAgo.h2',
  },
];

export const trafficOverviewData = (t: (key: string) => string) => [
  { name: t('dashboard.dates.feb1'), views: 2400 },
  { name: t('dashboard.dates.feb8'), views: 4100 },
  { name: t('dashboard.dates.feb15'), views: 3900 },
  { name: t('dashboard.dates.feb25'), views: 5800 },
  { name: t('dashboard.dates.feb28'), views: 8650 },
];

export const quickActionButtonData = [
  { labelKey: 'dashboard.quickActions.addDish', icon: Sparkles, route: '/menu' },
  { labelKey: 'dashboard.quickActions.addBanner', icon: Sparkles, route: '/menu' },
  { labelKey: 'dashboard.quickActions.downloadQr', icon: Sparkles, route: '/menu' },
];
