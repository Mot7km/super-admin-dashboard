import { memo, type FC } from 'react';
import type { KpiMetricItem } from '../analytics.types';
import { OverviewKpiStrip } from '../components/OverviewKpiStrip';
import { OverviewPulseChart } from '../components/OverviewPulseChart';
import { PlatformHealthSummaryCard } from '../components/PlatformHealthSummaryCard';
import { OverviewInsightBanners } from '../components/OverviewInsightBanners';

type AnalyticsOverviewSectionProps = {
  kpis: KpiMetricItem[];
  compareWithPrevious: boolean;
};

export const AnalyticsOverviewSection: FC<AnalyticsOverviewSectionProps> = memo(({
  kpis,
  compareWithPrevious,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Core KPIs Strip (9 metrics) */}
      <OverviewKpiStrip
        kpis={kpis}
        compareWithPrevious={compareWithPrevious}
      />

      {/* 2. Visual Pulse Chart (MRR + Active Tenants Curve) */}
      <OverviewPulseChart />

      {/* 3. Automated Smart Insights */}
      <OverviewInsightBanners />

      {/* 4. Platform Health Radar (Facet 24) */}
      <PlatformHealthSummaryCard />
    </div>
  );
});

AnalyticsOverviewSection.displayName = 'AnalyticsOverviewSection';
