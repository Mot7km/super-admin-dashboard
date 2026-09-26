import { memo, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { PageHeader, type PageHeaderBadge } from '../../../common/header';

type HomeHeaderProps = {
  timeFilter: string;
  onTimeFilterChange: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
};

const HomeHeader: FC<HomeHeaderProps> = ({
  timeFilter,
  onTimeFilterChange,
  onRefresh,
  onExport,
  isRefreshing = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const timeFilterOptions = useMemo(
    () => [
      { value: 'today', label: t('dashboard.periods.today') },
      { value: '7d', label: t('dashboard.periods.last7d') },
      { value: '30d', label: t('dashboard.periods.last30d') },
      { value: 'quarter', label: t('dashboard.periods.quarter') },
      { value: 'ytd', label: t('dashboard.periods.ytd') },
    ],
    [t],
  );

  const headerBadges: PageHeaderBadge[] = useMemo(
    () => [
      {
        text: t('dashboard.systemStatusLive'),
        isLive: true,
        variant: 'success',
        tooltip: 'Mesh Network Active • 24ms Edge Ping across 4 multi-region clusters',
      },
      {
        text: 'Root Sentinel Active',
        icon: Shield,
        variant: 'primary',
      },
    ],
    [t],
  );

  return (
    <PageHeader
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      icon={LayoutDashboard}
      iconVariant="primary"
      badges={headerBadges}
      timeFilter={{
        value: timeFilter,
        options: timeFilterOptions,
        onChange: onTimeFilterChange,
        ariaLabel: 'Dashboard timeframe selection',
      }}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      onExport={onExport}
      exportLabel={t('dashboard.exportTelemetry')}
      primaryAction={{
        label: t('dashboard.onboardTenant'),
        icon: Plus,
        badge: '+N',
        onClick: () => navigate('/businesses?action=new'),
      }}
    />
  );
};

export default memo(HomeHeader);