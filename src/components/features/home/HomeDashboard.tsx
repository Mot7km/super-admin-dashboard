import { useState, useCallback } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import HomeHeader from './sections/HomeHeader';
import HomeStats from './sections/HomeStats';
import HomeCharts from './sections/HomeCharts';
import HomeLowerPanels from './sections/HomeLowerPanels';
import {
  heroKpis,
  recentTenants,
  revenueTrajectoryData,
  sentinelMetrics,
  subscriptionPlanData,
  systemEvents,
  transactionVolumeData,
} from './home.constants';

const HomeDashboard = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [timeFilter, setTimeFilter] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(t('dashboard.telemetrySynced'), 'success');
    }, 600);
  }, [showToast, t]);

  const handleTimeFilterChange = useCallback((val: string) => {
    setTimeFilter(val);
    showToast(`${t('dashboard.periodChanged')}: ${val.toUpperCase()}`, 'info');
  }, [showToast, t]);

  const handleExport = useCallback(() => {
    showToast('Platform telemetry exported to JSON/CSV report successfully.', 'success');
  }, [showToast]);

  return (
    <div className="space-y-6 text-foreground overflow-x-clip animate-fade-in">
      {/* 1. Super Admin Command Center Header */}
      <HomeHeader
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
      />

      {/* 2. Top Deck: 4 Strategic Headline KPIs + Operational Sentinel Alert Strip */}
      <HomeStats
        heroKpis={heroKpis}
        sentinelMetrics={sentinelMetrics}
      />

      {/* 3. The Visualization Engine: Master Trajectory + Subscription Matrix */}
      <HomeCharts
        revenueTrajectoryData={revenueTrajectoryData}
        subscriptionPlanData={subscriptionPlanData}
      />

      {/* 4. Live Activity: Orders/Transactions Volume Stream + Recent Businesses & Audit Stream */}
      <HomeLowerPanels
        transactionVolumeData={transactionVolumeData}
        recentTenants={recentTenants}
        systemEvents={systemEvents}
      />
    </div>
  );
};

export default HomeDashboard;