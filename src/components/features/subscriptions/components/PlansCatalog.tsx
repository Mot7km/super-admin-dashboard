import { memo, useState, type FC } from 'react';
import {
  Check,
  X,
  Sparkles,
  Crown,
  Layers,
  Shield,
  Edit3,
  Users,
  Building2,
  Package,
  HardDrive,
  Clock,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SaaSPlan, PlanTier } from '../subscriptions.types';

type PlansCatalogProps = {
  plans: SaaSPlan[];
  onEditPlan: (plan: SaaSPlan) => void;
  onCreatePlan: () => void;
  onDeletePlan: (plan: SaaSPlan) => void;
};

const PlansCatalog: FC<PlansCatalogProps> = ({
  plans,
  onEditPlan,
  onCreatePlan,
  onDeletePlan,
}) => {
  const { t, locale } = useTranslation();
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');

  const getTierIcon = (tier: PlanTier) => {
    switch (tier) {
      case 'Free':
        return <Layers className="h-5 w-5 text-muted-foreground" />;
      case 'Basic':
        return <Zap className="h-5 w-5 text-emerald-500" />;
      case 'Pro':
        return <Sparkles className="h-5 w-5 text-primary" />;
      case 'Enterprise':
        return <Crown className="h-5 w-5 text-amber-500" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  const getTierBadgeClass = (tier: PlanTier) => {
    switch (tier) {
      case 'Free':
        return 'bg-surface-subtle text-muted-foreground border-border';
      case 'Basic':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Pro':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Enterprise':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Billing Cycle Switcher & Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <span>{t('subscriptions.plansCatalogTitle')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              4 Sovereign Tiers
            </span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            {t('subscriptions.plansCatalogSubtitle')}
          </p>
        </div>

        {/* Monthly vs Annual Switcher & Add Plan CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/70">
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                cycle === 'monthly'
                  ? 'bg-card text-foreground shadow-xs ring-1 ring-border font-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('subscriptions.monthlyBilling')}
            </button>
            <button
              type="button"
              onClick={() => setCycle('annual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                cycle === 'annual'
                  ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{t('subscriptions.annualBilling')}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500">
                -20%
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCreatePlan}
            className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span>{t('subscriptions.addNewPlan')}</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Column Plans Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {plans.map((plan) => {
          const price = cycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
          const isEnterprise = plan.tier === 'Enterprise';

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl border transition-all duration-200 bg-card p-5 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                plan.isPopular
                  ? 'border-primary ring-2 ring-primary/20 shadow-primary/5'
                  : isEnterprise
                  ? 'border-amber-500/40 bg-gradient-to-b from-card to-amber-500/5'
                  : 'border-border/80'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Popular Tier</span>
                </div>
              )}

              {/* Plan Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-surface-subtle border border-border flex items-center justify-center shrink-0">
                      {getTierIcon(plan.tier)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-foreground">{plan.name}</h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getTierBadgeClass(
                          plan.tier,
                        )}`}
                      >
                        {plan.tier}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-surface-subtle border border-border text-[10px] font-mono font-bold text-muted-foreground">
                    {plan.subscribersCount} {t('subscriptions.activeSubscribers')}
                  </span>
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {locale === 'ar' ? plan.taglineAr : plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-foreground tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      /{cycle === 'monthly' ? 'mo' : 'mo (billed annually)'}
                    </span>
                  </div>
                  {cycle === 'annual' && plan.priceMonthly > 0 && (
                    <span className="text-[11px] text-emerald-500 font-bold block mt-0.5">
                      Save ${(plan.priceMonthly - plan.priceAnnual) * 12}/year
                    </span>
                  )}
                </div>

                {/* Core Resource Quotas Strip */}
                <div className="mt-5 space-y-2.5 rounded-xl bg-surface-subtle/80 border border-border/70 p-3.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      <span>{t('subscriptions.branchesQuota')}</span>
                    </span>
                    <strong className="text-foreground font-mono">
                      {plan.maxBranches === -1 ? 'Unlimited' : `${plan.maxBranches} Branches`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{t('subscriptions.employeesQuota')}</span>
                    </span>
                    <strong className="text-foreground font-mono">
                      {plan.maxEmployees === -1 ? 'Unlimited' : `${plan.maxEmployees} Staff`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-amber-500" />
                      <span>{t('subscriptions.productsQuota')}</span>
                    </span>
                    <strong className="text-foreground font-mono">
                      {plan.maxProducts === -1 ? 'Unlimited' : `${plan.maxProducts.toLocaleString()} SKUs`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="h-3.5 w-3.5 text-sky-400" />
                      <span>{t('subscriptions.storageQuota')}</span>
                    </span>
                    <strong className="text-foreground font-mono">{plan.storageGb} GB</strong>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground font-medium border-t border-border/50 pt-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      <span>{t('subscriptions.trialPeriod')}</span>
                    </span>
                    <strong className="text-foreground font-mono">
                      {plan.trialDays === 0 ? 'No Trial' : `${plan.trialDays} Days Free`}
                    </strong>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="mt-5 space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    {t('subscriptions.featuresIncluded')}
                  </span>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat) => (
                      <li
                        key={feat.id}
                        className={`flex items-start gap-2 ${
                          feat.included ? 'text-foreground' : 'text-muted-foreground/60'
                        }`}
                      >
                        {feat.included ? (
                          <div className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="mt-0.5 h-4 w-4 rounded-full bg-surface-subtle text-muted-foreground/40 flex items-center justify-center shrink-0">
                            <X className="h-2.5 w-2.5 stroke-[2]" />
                          </div>
                        )}
                        <span className={feat.highlight ? 'font-bold text-primary' : ''}>
                          {locale === 'ar' ? feat.nameAr : feat.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditPlan(plan)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs ${
                    plan.isPopular
                      ? 'bg-primary hover:bg-primary-dark text-primary-foreground shadow-primary/20'
                      : 'border border-border bg-card hover:bg-surface-subtle hover:border-primary/50 text-foreground'
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{t('subscriptions.editPlanQuotas')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeletePlan(plan)}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-destructive-bg hover:border-destructive/40 text-muted-foreground hover:text-destructive transition-all duration-200 cursor-pointer shadow-xs shrink-0"
                  title={t('subscriptions.deletePlan')}
                  aria-label={t('subscriptions.deletePlan')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(PlansCatalog);
