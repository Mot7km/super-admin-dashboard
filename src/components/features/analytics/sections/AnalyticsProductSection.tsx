import { memo, type FC } from 'react';
import { ProductUsageKpiStrip } from '../components/product/ProductUsageKpiStrip';
import { GmvVsRevenueCard } from '../components/product/GmvVsRevenueCard';
import { ProductFeatureUsageCard } from '../components/product/ProductFeatureUsageCard';
import { FeatureAdoptionFunnelCard } from '../components/product/FeatureAdoptionFunnelCard';
import { UserRolesEngagementCard } from '../components/product/UserRolesEngagementCard';

export const AnalyticsProductSection: FC = memo(() => {
  return (
    <div className="space-y-6">
      {/* 1. Core Users, Product & GMV KPIs Strip */}
      <ProductUsageKpiStrip />

      {/* 2. Macro GMV vs Mot7km SaaS Revenue Breakdown */}
      <GmvVsRevenueCard />

      {/* 3. Product Features Usage & Adoption Matrix */}
      <ProductFeatureUsageCard />

      {/* 4. Progressive Feature Adoption Funnel (Feature Flags) */}
      <FeatureAdoptionFunnelCard />

      {/* 5. User Roles Allocation & Engagement Clusters */}
      <UserRolesEngagementCard />
    </div>
  );
});

AnalyticsProductSection.displayName = 'AnalyticsProductSection';
