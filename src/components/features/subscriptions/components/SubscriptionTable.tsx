import { memo, useState, useRef, useEffect, type FC } from 'react';
import {
  MoreVertical,
  Crown,
  Sparkles,
  Layers,
  Zap,
  RotateCw,
  ArrowUpCircle,
  ArrowDownCircle,
  Sliders,
  AlertTriangle,
  Building2,
  Users,
  Copy,
  Check,
  Tag,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  Subscription,
  SubscriptionModalAction,
  PlanTier,
  SubscriptionStatus,
} from '../subscriptions.types';

type SubscriptionTableProps = {
  subscriptions: Subscription[];
  onActionSelect: (action: SubscriptionModalAction) => void;
};

const SubscriptionTable: FC<SubscriptionTableProps> = ({
  subscriptions,
  onActionSelect,
}) => {
  const { t } = useTranslation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCopySubdomain = (e: React.MouseEvent, sub: Subscription) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://${sub.subdomain}`);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTierIcon = (tier: PlanTier) => {
    switch (tier) {
      case 'Enterprise':
        return <Crown className="h-3.5 w-3.5 text-amber-500" />;
      case 'Pro':
        return <Sparkles className="h-3.5 w-3.5 text-primary" />;
      case 'Basic':
        return <Zap className="h-3.5 w-3.5 text-emerald-500" />;
      default:
        return <Layers className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getTierBadge = (tier: PlanTier) => {
    switch (tier) {
      case 'Enterprise':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/25';
      case 'Pro':
        return 'bg-primary/10 text-primary border-primary/25';
      case 'Basic':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25';
      default:
        return 'bg-surface-subtle text-muted-foreground border-border';
    }
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-bg text-success-text border border-success-text/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('subscriptions.statusActive')}
          </span>
        );
      case 'trial':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-info-bg text-info-text border border-info-text/20">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            {t('subscriptions.statusTrial')}
          </span>
        );
      case 'pending_renewal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-bg text-warning-text border border-warning-text/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t('subscriptions.statusPendingRenewal')}
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-destructive-bg text-destructive-text border border-destructive-text/20">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {t('subscriptions.statusExpired')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-subtle text-muted-foreground border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            {t('subscriptions.statusCancelled')}
          </span>
        );
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-12 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          {t('subscriptions.noMatchingSubscriptions')}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {t('subscriptions.tryAdjustingFilters')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/70 bg-surface-subtle/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none">
              <th className="py-3.5 px-4">{t('subscriptions.colSubscriber')}</th>
              <th className="py-3.5 px-3">{t('subscriptions.colTierCycle')}</th>
              <th className="py-3.5 px-3">{t('subscriptions.colStatus')}</th>
              <th className="py-3.5 px-3">{t('subscriptions.colUsageQuotas')}</th>
              <th className="py-3.5 px-3">{t('subscriptions.colMrrPaid')}</th>
              <th className="py-3.5 px-3">{t('subscriptions.colRenewalPeriod')}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">{t('subscriptions.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {subscriptions.map((sub) => {
              const isMenuOpen = activeMenuId === sub.id;

              // Quota capacity calculations
              const branchPct =
                sub.branchesLimit === -1
                  ? 25
                  : Math.min(100, Math.round((sub.branchesUsed / sub.branchesLimit) * 100));

              const empPct =
                sub.employeesLimit === -1
                  ? 25
                  : Math.min(100, Math.round((sub.employeesUsed / sub.employeesLimit) * 100));

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-surface-subtle/60 transition-colors duration-150 group"
                >
                  {/* 1. Subscriber / Tenant */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {/* Monogram Badge */}
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary flex items-center justify-center font-black font-mono text-xs shrink-0 shadow-xs">
                        {sub.businessName.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground truncate max-w-[200px]">
                            {sub.businessName}
                          </span>
                          {sub.customOverrides && (
                            <span
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              title={sub.customOverrides.notes || 'Custom bonus quota active'}
                            >
                              Bonus +
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-muted-foreground truncate max-w-[170px] font-mono">
                            {sub.subdomain}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopySubdomain(e, sub)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded transition"
                            title="Copy store URL"
                          >
                            {copiedId === sub.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Tier & Billing Cycle */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border ${getTierBadge(
                            sub.planTier,
                          )}`}
                        >
                          {getTierIcon(sub.planTier)}
                          <span>{sub.planTier}</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-surface-subtle border border-border text-muted-foreground font-semibold">
                          {sub.billingCycle}
                        </span>
                      </div>

                      {/* Coupon / Discount Tag if applied */}
                      {sub.discountApplied && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono font-medium">
                          <Tag className="h-3 w-3" />
                          <span>
                            {sub.discountApplied.code} (-{sub.discountApplied.percent}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 3. Status */}
                  <td className="py-3.5 px-3">{getStatusBadge(sub.status)}</td>

                  {/* 4. Quota Usage (Branches & Staff) */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1.5 min-w-[130px]">
                      {/* Branches meter */}
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>Branches</span>
                          </span>
                          <span className="font-mono font-bold text-foreground">
                            {sub.branchesUsed} /{' '}
                            {sub.branchesLimit === -1 ? '∞' : sub.branchesLimit}
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-surface-subtle overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              branchPct >= 90
                                ? 'bg-amber-500'
                                : branchPct >= 100
                                ? 'bg-destructive'
                                : 'bg-primary'
                            }`}
                            style={{ width: `${branchPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Staff meter */}
                      <div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Staff</span>
                          </span>
                          <span className="font-mono font-bold text-foreground">
                            {sub.employeesUsed} /{' '}
                            {sub.employeesLimit === -1 ? '∞' : sub.employeesLimit}
                          </span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-surface-subtle overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              empPct >= 90
                                ? 'bg-amber-500'
                                : empPct >= 100
                                ? 'bg-destructive'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${empPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 5. MRR & Paid */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-mono font-black text-sm text-foreground">
                        ${sub.mrrContribution}
                        <span className="text-[10px] text-muted-foreground font-normal"> /mo</span>
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        Paid: ${sub.pricePaid.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  {/* 6. Current Period & Renewal */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-foreground text-xs">
                        {sub.currentPeriodEnd}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            sub.autoRenew ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {sub.autoRenew ? 'Auto-renew ON' : 'Manual Renew'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 7. Action Dropdown Menu */}
                  <td className="py-3.5 px-4 text-right rtl:text-left relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : sub.id)}
                      className="p-1.5 rounded-lg border border-border bg-card hover:bg-surface-subtle hover:border-primary/50 text-muted-foreground hover:text-foreground transition cursor-pointer shadow-xs"
                      title="Manage Subscription"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Popover Actions Menu */}
                    {isMenuOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-4 rtl:right-auto rtl:left-4 top-12 z-40 w-52 rounded-xl border border-border/80 bg-card p-1.5 shadow-xl animate-fade-in text-left rtl:text-right"
                      >
                        {/* Renew / Extend */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onActionSelect({ type: 'renew', subscription: sub });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle hover:text-primary rounded-lg transition cursor-pointer"
                        >
                          <RotateCw className="h-3.5 w-3.5 text-primary" />
                          <span>{t('subscriptions.actionRenew')}</span>
                        </button>

                        {/* Upgrade Plan */}
                        {sub.planTier !== 'Enterprise' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onActionSelect({
                                type: 'change_tier',
                                subscription: sub,
                                mode: 'upgrade',
                              });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-foreground hover:bg-emerald-500/10 hover:text-emerald-500 rounded-lg transition cursor-pointer"
                          >
                            <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{t('subscriptions.actionUpgrade')}</span>
                          </button>
                        )}

                        {/* Downgrade Plan */}
                        {sub.planTier !== 'Free' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onActionSelect({
                                type: 'change_tier',
                                subscription: sub,
                                mode: 'downgrade',
                              });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface-subtle hover:text-foreground rounded-lg transition cursor-pointer"
                          >
                            <ArrowDownCircle className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{t('subscriptions.actionDowngrade')}</span>
                          </button>
                        )}

                        {/* Manual Adjustments */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onActionSelect({ type: 'manual_adjust', subscription: sub });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-500/10 rounded-lg transition cursor-pointer"
                        >
                          <Sliders className="h-3.5 w-3.5 text-purple-400" />
                          <span>{t('subscriptions.actionManualAdjust')}</span>
                        </button>

                        <div className="my-1 border-t border-border/60" />

                        {/* Cancel / Suspend */}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onActionSelect({ type: 'cancel', subscription: sub });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive-bg rounded-lg transition cursor-pointer"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                          <span>{t('subscriptions.actionCancel')}</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(SubscriptionTable);
