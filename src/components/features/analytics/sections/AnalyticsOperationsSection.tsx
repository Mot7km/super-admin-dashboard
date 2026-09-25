import { memo, type FC } from 'react';
import { OperationsKpiStrip } from '../components/operations/OperationsKpiStrip';
import { ApiPerformanceLatencyCard } from '../components/operations/ApiPerformanceLatencyCard';
import { SystemErrorFrequencyCard } from '../components/operations/SystemErrorFrequencyCard';
import { SupportSlaOperationsCard } from '../components/operations/SupportSlaOperationsCard';
import { NotificationAuditCard } from '../components/operations/NotificationAuditCard';

export const AnalyticsOperationsSection: FC = memo(() => {
  return (
    <div className="space-y-6">
      {/* 1. Core Operations, Reliability & SLA KPIs Strip */}
      <OperationsKpiStrip />

      {/* 2. API Latency Spectrum (p50/p95/p99) & High-Frequency Endpoints */}
      <ApiPerformanceLatencyCard />

      {/* 3. System Error Distribution & HTTP Code Breakdown */}
      <SystemErrorFrequencyCard />

      {/* 4. Support Operations, Response MTTR & CSAT Benchmark */}
      <SupportSlaOperationsCard />

      {/* 5. Notification Dispatch & Admin Governance Audit */}
      <NotificationAuditCard />
    </div>
  );
});

AnalyticsOperationsSection.displayName = 'AnalyticsOperationsSection';
