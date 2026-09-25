import { memo, type FC } from 'react';
import { BusinessPlatformActivityStrip } from '../components/business/BusinessPlatformActivityStrip';
import { BusinessActivationFunnelCard } from '../components/business/BusinessActivationFunnelCard';
import { BusinessStatusDonutCard } from '../components/business/BusinessStatusDonutCard';
import { BusinessGrowthTrendChart } from '../components/business/BusinessGrowthTrendChart';
import { MultiBranchAnalyticsCard } from '../components/business/MultiBranchAnalyticsCard';
import { GeographicGovernoratesCard } from '../components/business/GeographicGovernoratesCard';

export const AnalyticsGrowthSection: FC = memo(() => {
  return (
    <div className="space-y-6">
      {/* 1. Vital Platform Daily Operations Activity Strip */}
      <BusinessPlatformActivityStrip />

      {/* 2. Hero 6-Stage Business Activation Funnel (Activation Rate 68%) */}
      <BusinessActivationFunnelCard />

      {/* 3. Business Status Donut & Proportional Distribution */}
      <BusinessStatusDonutCard />

      {/* 4. Monthly Growth & Activation Trajectory Chart */}
      <BusinessGrowthTrendChart />

      {/* 5. Dual Grid: Multi-Branch Analytics & Egyptian Governorates Coverage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MultiBranchAnalyticsCard />
        <GeographicGovernoratesCard />
      </div>
    </div>
  );
});

AnalyticsGrowthSection.displayName = 'AnalyticsGrowthSection';
