import { memo, type FC } from 'react';
import { RevenueKpiStrip } from '../components/subscriptions/RevenueKpiStrip';
import { MrrMovementWaterfallCard } from '../components/subscriptions/MrrMovementWaterfallCard';
import { PlanBillingDistributionCard } from '../components/subscriptions/PlanBillingDistributionCard';
import { PaymentGatewayEfficiencyCard } from '../components/subscriptions/PaymentGatewayEfficiencyCard';
import { InvoiceAgingCollectionCard } from '../components/subscriptions/InvoiceAgingCollectionCard';

export const AnalyticsSubscriptionsSection: FC = memo(() => {
  return (
    <div className="space-y-6">
      {/* 1. Core Revenue & Unit Economics KPIs */}
      <RevenueKpiStrip />

      {/* 2. Hero MRR Movement Waterfall Breakdown */}
      <MrrMovementWaterfallCard />

      {/* 3. Subscription Plans & Billing Cadence Grid */}
      <PlanBillingDistributionCard />

      {/* 4. Payment Gateway Volume & Failure Diagnostics */}
      <PaymentGatewayEfficiencyCard />

      {/* 5. Invoices Aging, Collection Speed & DSO */}
      <InvoiceAgingCollectionCard />
    </div>
  );
});

AnalyticsSubscriptionsSection.displayName = 'AnalyticsSubscriptionsSection';
