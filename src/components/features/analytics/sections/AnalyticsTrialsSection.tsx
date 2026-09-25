import { memo, type FC } from 'react';
import { TrialsKpiStrip } from '../components/trials/TrialsKpiStrip';
import { TrialConversionFunnelCard } from '../components/trials/TrialConversionFunnelCard';
import { CohortRetentionHeatmapCard } from '../components/trials/CohortRetentionHeatmapCard';
import { RetentionCurvesCard } from '../components/trials/RetentionCurvesCard';
import { TrialDropoffAnalysisCard } from '../components/trials/TrialDropoffAnalysisCard';

export const AnalyticsTrialsSection: FC = memo(() => {
  return (
    <div className="space-y-6">
      {/* 1. Core Trials & Retention KPIs Strip */}
      <TrialsKpiStrip />

      {/* 2. Hero 6-Stage Free Trial Conversion Funnel */}
      <TrialConversionFunnelCard />

      {/* 3. Monthly Cohort Retention Heatmap Matrix (M0..M5) */}
      <CohortRetentionHeatmapCard />

      {/* 4. Comparative Retention Trajectory Curves (Tenants vs Users) */}
      <RetentionCurvesCard />

      {/* 5. Trial Non-Conversion Drivers & Automated Interventions */}
      <TrialDropoffAnalysisCard />
    </div>
  );
});

AnalyticsTrialsSection.displayName = 'AnalyticsTrialsSection';
