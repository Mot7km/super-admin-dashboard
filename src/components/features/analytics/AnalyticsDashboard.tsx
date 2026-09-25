import { useState, useCallback, useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  TimeRange,
  AnalyticsTab,
  KpiMetricItem,
} from './analytics.types';
import { INITIAL_OVERVIEW_KPIS } from './analytics.mock';

import { AnalyticsTimeFilterBar } from './components/AnalyticsTimeFilterBar';
import { AnalyticsOverviewSection } from './sections/AnalyticsOverviewSection';
import { AnalyticsGrowthSection } from './sections/AnalyticsGrowthSection';
import { AnalyticsSubscriptionsSection } from './sections/AnalyticsSubscriptionsSection';
import { AnalyticsTrialsSection } from './sections/AnalyticsTrialsSection';
import { AnalyticsProductSection } from './sections/AnalyticsProductSection';
import { AnalyticsOperationsSection } from './sections/AnalyticsOperationsSection';

export const AnalyticsDashboard: FC = () => {
  const { t, isRtl } = useTranslation();
  const { showToast } = useToast();
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const validTabs: AnalyticsTab[] = useMemo(
    () => ['overview', 'growth', 'subscriptions', 'trials', 'product', 'operations'],
    []
  );

  const activeTab: AnalyticsTab = validTabs.includes(tab as AnalyticsTab)
    ? (tab as AnalyticsTab)
    : 'overview';

  const handleSelectTab = useCallback(
    (newTab: AnalyticsTab) => {
      navigate(`/analytics/${newTab}`);
    },
    [navigate]
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [kpis, setKpis] = useState<KpiMetricItem[]>(INITIAL_OVERVIEW_KPIS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Time Range Selection with dynamic mock adaptation
  const handleSelectTimeRange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    // Adjust mock KPI values slightly based on range to make interface feel dynamic
    setKpis((prev) =>
      prev.map((kpi) => {
        let multiplier = 1;
        if (range === 'today') multiplier = 0.04;
        else if (range === '7d') multiplier = 0.25;
        else if (range === '30d') multiplier = 1.0;
        else if (range === '3m') multiplier = 2.8;
        else if (range === '6m') multiplier = 5.2;
        else if (range === '12m') multiplier = 10.0;

        if (kpi.format === 'currency' && kpi.key === 'mrr') {
          return kpi; // MRR is rate-based
        }
        if (kpi.format === 'percent') {
          return kpi;
        }

        const adjustedCurrent = Math.round(kpi.current * multiplier);
        const adjustedPrev = Math.round(kpi.previous * multiplier);
        return {
          ...kpi,
          current: adjustedCurrent,
          previous: adjustedPrev,
        };
      })
    );
  }, []);

  // Refresh Action
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(t('analytics.toast.refreshed'), 'success');
    }, 600);
  }, [showToast, t]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {t('analytics.title')}
                </h1>
                <span className="hidden sm:inline-block text-muted-foreground/40 font-mono">/</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  {t(`analytics.tabs.${activeTab}`)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('analytics.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-500">
          <Sparkles className="h-4 w-4" />
          <span>Real-time SaaS Telemetry Active</span>
        </div>
      </div>

      {/* Global Time Filter Bar */}
      <AnalyticsTimeFilterBar
        timeRange={timeRange}
        onSelectTimeRange={handleSelectTimeRange}
        compareWithPrevious={compareWithPrevious}
        onToggleCompare={() => setCompareWithPrevious((prev) => !prev)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <AnalyticsOverviewSection
          kpis={kpis}
          compareWithPrevious={compareWithPrevious}
        />
      )}

      {activeTab === 'growth' && <AnalyticsGrowthSection />}
      {activeTab === 'subscriptions' && <AnalyticsSubscriptionsSection />}
      {activeTab === 'trials' && <AnalyticsTrialsSection />}
      {activeTab === 'product' && <AnalyticsProductSection />}
      {activeTab === 'operations' && <AnalyticsOperationsSection />}

      {/* Phase Roadmap Preview for other tabs */}
      {activeTab !== 'overview' &&
        activeTab !== 'growth' &&
        activeTab !== 'subscriptions' &&
        activeTab !== 'trials' &&
        activeTab !== 'product' &&
        activeTab !== 'operations' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              {t(`analytics.tabs.${activeTab}`)} — {t('analytics.roadmap.comingInPhase')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('analytics.roadmap.phaseDescription')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelectTab('overview')}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <span>{t('analytics.roadmap.backToOverview')}</span>
            <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
};

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
