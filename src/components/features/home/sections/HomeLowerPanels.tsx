import type { FC } from 'react';
import type { HomeActivityItem, HomeProduct, HomeReview } from '../home.types';
import LeftPanel from '.././components/LeftPanel';
import RecentReviews from '.././components/RecentReviews';
import SystemActivity from '.././components/SystemActivity';

type HomeLowerPanelsProps = {
  topProducts: HomeProduct[];
  recentReviews: HomeReview[];
  activityFeed: HomeActivityItem[];
  productFilter: string;
  onProductFilterChange: (value: string) => void;
};

const HomeLowerPanels: FC<HomeLowerPanelsProps> = ({
  topProducts,
  recentReviews,
  activityFeed,
  productFilter,
  onProductFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left column – all in one component */}
      <LeftPanel
        topProducts={topProducts}
        productFilter={productFilter}
        onProductFilterChange={onProductFilterChange}
      />

      {/* Right column – two separate components */}
      <div className="grid grid-cols-1 gap-6 lg:col-span-6">
        <RecentReviews recentReviews={recentReviews} />
        <SystemActivity activityFeed={activityFeed} />
      </div>
    </div>
  );
};

export default HomeLowerPanels;