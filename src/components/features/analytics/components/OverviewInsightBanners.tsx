import { memo, type FC } from 'react';
import {
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

export const OverviewInsightBanners: FC = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* 1. MRR Record */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/60 to-card p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
          <TrendingUp className="h-4 w-4" />
          <span>{t('analytics.insights.mrrRecordTitle')}</span>
        </div>
        <p className="mt-2 text-xs text-foreground font-medium leading-relaxed">
          {t('analytics.insights.mrrRecordDesc')}
        </p>
      </div>

      {/* 2. Low Churn */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-card/60 to-card p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
          <Award className="h-4 w-4" />
          <span>{t('analytics.insights.churnDropTitle')}</span>
        </div>
        <p className="mt-2 text-xs text-foreground font-medium leading-relaxed">
          {t('analytics.insights.churnDropDesc')}
        </p>
      </div>

      {/* 3. Conversion Funnel Acceleration */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-card/60 to-card p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-violet-500 uppercase tracking-wider">
          <Zap className="h-4 w-4" />
          <span>{t('analytics.insights.conversionSurgeTitle')}</span>
        </div>
        <p className="mt-2 text-xs text-foreground font-medium leading-relaxed">
          {t('analytics.insights.conversionSurgeDesc')}
        </p>
      </div>
    </div>
  );
});

OverviewInsightBanners.displayName = 'OverviewInsightBanners';
