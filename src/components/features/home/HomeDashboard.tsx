import { useState } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import HomeHeader from './sections/HomeHeader';
import HomeStats from './sections/HomeStats';
import HomeTraffic from './sections/HomeCharts';
import HomeLowerPanels from './sections/HomeLowerPanels';
import {
  activityFeed,
  branchComparisonData,
  homeStats,
  recentReviews,
  topProducts,
  trafficOverviewData,
} from './home.constants';

const HomeDashboard = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [productFilter, setProductFilter] = useState('byViews');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [isChimeMuted, setIsChimeMuted] = useState(false);

  const handleBranchFilter = (val: string) => {
    setSelectedBranch(val);
    showToast(`${t('dashboard.title')}: Filtered by branch`, 'info');
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)] overflow-x-clip">
      <HomeHeader
        selectedBranch={selectedBranch}
        isChimeMuted={isChimeMuted}
        onBranchChange={handleBranchFilter}
        onToggleChime={() => {
          setIsChimeMuted((active) => !active);
          showToast(isChimeMuted ? t('dashboard.soundChimeOn') : t('dashboard.soundChimeMute'), 'info');
        }}
      />

      <HomeStats stats={homeStats} />

      <HomeTraffic
        trafficOverviewData={trafficOverviewData(t)}
        branchComparisonData={branchComparisonData}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      <HomeLowerPanels
        topProducts={topProducts}
        recentReviews={recentReviews}
        activityFeed={activityFeed}
        productFilter={productFilter}
        onProductFilterChange={setProductFilter}
      />
    </div>
  );
};

export default HomeDashboard;