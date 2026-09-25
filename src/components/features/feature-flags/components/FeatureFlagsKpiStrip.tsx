import { memo, type FC } from 'react';
import {
  Flag,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FeatureFlag } from '../feature-flags.types';

type FeatureFlagsKpiStripProps = {
  flags: FeatureFlag[];
};

export const FeatureFlagsKpiStrip: FC<FeatureFlagsKpiStripProps> = memo(({ flags }) => {
  const { t } = useTranslation();

  const total = flags.length;
  const activeCount = flags.filter((f) => f.isEnabled).length;
  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0;
  
  // Scoped to specific plans or businesses
  const scopedCount = flags.filter((f) => f.targetType === 'plans' || f.targetType === 'businesses').length;
  
  // Percentage / canary rollouts
  const rolloutCount = flags.filter((f) => f.targetType === 'percentage').length;

  // Staging / dev count
  const nonProdCount = flags.filter((f) => f.environment !== 'production').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total System Flags */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('featureFlags.kpi.totalFlags')}
          </span>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
            <Flag className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {total}
          </span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {t('featureFlags.kpi.systemSwitches')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {nonProdCount} {t('featureFlags.kpi.inStagingDev')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 2. Active Flags (Live in Prod) */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('featureFlags.kpi.activeFlags')}
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-500 font-mono">
            {activeCount}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {activeRate}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {total - activeCount} {t('featureFlags.kpi.safelyDisabled')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 3. Targeted & Scoped */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('featureFlags.kpi.targetedScoped')}
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
            {scopedCount}
          </span>
          <span className="text-xs font-medium text-indigo-400">
            {t('featureFlags.kpi.byPlanOrBusiness')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('featureFlags.kpi.exclusiveAccessRules')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500/50 via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 4. Gradual Rollout / Canary */}
      <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('featureFlags.kpi.canaryRollout')}
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500 font-mono">
            {rolloutCount}
          </span>
          <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {t('featureFlags.kpi.percentageTesting')}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('featureFlags.kpi.progressiveDelivery')}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
});

FeatureFlagsKpiStrip.displayName = 'FeatureFlagsKpiStrip';
