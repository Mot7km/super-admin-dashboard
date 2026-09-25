import { memo, useState, type FC } from 'react';
import {
  X,
  RotateCw,
  ArrowUpCircle,
  Sliders,
  AlertTriangle,
  Edit3,
  Tag,
  Building2,
  Users,
  HardDrive,
  Calendar,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  Subscription,
  SaaSPlan,
  SubscriptionModalAction,
  PlanTier,
  Coupon,
} from '../subscriptions.types';

type SubscriptionActionModalsProps = {
  modalState: SubscriptionModalAction;
  onClose: () => void;
  plans: SaaSPlan[];
  onConfirmRenew: (sub: Subscription, months: number) => void;
  onConfirmTierChange: (sub: Subscription, newTier: PlanTier, effectiveImmediately: boolean) => void;
  onConfirmManualAdjust: (
    sub: Subscription,
    adjustments: {
      branchesLimitBonus: number;
      employeesLimitBonus: number;
      storageGbBonus: number;
      gracePeriodDays: number;
      notes?: string;
    },
  ) => void;
  onConfirmCancel: (sub: Subscription, immediate: boolean, reason: string) => void;
  onSavePlan: (updatedPlan: SaaSPlan) => void;
  onCreatePlan: (newPlan: SaaSPlan) => void;
  onDeletePlan: (planId: string) => void;
  onCreateCoupon: (newCoupon: Omit<Coupon, 'id' | 'redemptionsCount' | 'createdAt'>) => void;
};

const SubscriptionActionModals: FC<SubscriptionActionModalsProps> = ({
  modalState,
  onClose,
  plans,
  onConfirmRenew,
  onConfirmTierChange,
  onConfirmManualAdjust,
  onConfirmCancel,
  onSavePlan,
  onCreatePlan,
  onDeletePlan,
  onCreateCoupon,
}) => {
  const { t } = useTranslation();

  // Create Plan Form State
  const [createPlanName, setCreatePlanName] = useState<string>('Scale Tier');
  const [createPlanNameAr, setCreatePlanNameAr] = useState<string>('باقة التوسع المتقدمة');
  const [createPlanTier, setCreatePlanTier] = useState<PlanTier>('Pro');
  const [createPlanTagline, setCreatePlanTagline] = useState<string>(
    'Custom resource architecture for fast-growing chains',
  );
  const [createPlanTaglineAr, setCreatePlanTaglineAr] = useState<string>(
    'معمارية موارد مخصصة لسلاسل الفروع المتسارعة',
  );
  const [createPlanPriceMonthly, setCreatePlanPriceMonthly] = useState<number>(249);
  const [createPlanPriceAnnual, setCreatePlanPriceAnnual] = useState<number>(199);
  const [createPlanBranches, setCreatePlanBranches] = useState<number>(20);
  const [createPlanEmployees, setCreatePlanEmployees] = useState<number>(100);
  const [createPlanProducts, setCreatePlanProducts] = useState<number>(25000);
  const [createPlanStorage, setCreatePlanStorage] = useState<number>(150);
  const [createPlanTrialDays, setCreatePlanTrialDays] = useState<number>(14);
  const [createPlanIsPopular, setCreatePlanIsPopular] = useState<boolean>(false);

  // Renew State
  const [renewMonths, setRenewMonths] = useState<number>(1);

  // Change Tier State
  const [targetTier, setTargetTier] = useState<PlanTier>(
    modalState?.type === 'change_tier'
      ? modalState.mode === 'upgrade'
        ? modalState.subscription.planTier === 'Free'
          ? 'Basic'
          : modalState.subscription.planTier === 'Basic'
          ? 'Pro'
          : 'Enterprise'
        : 'Free'
      : 'Pro',
  );
  const [effectiveImmediately, setEffectiveImmediately] = useState<boolean>(true);

  // Manual Adjust State
  const [branchBonus, setBranchBonus] = useState<number>(
    modalState?.type === 'manual_adjust'
      ? modalState.subscription.customOverrides?.branchesLimitBonus || 2
      : 2,
  );
  const [empBonus, setEmpBonus] = useState<number>(
    modalState?.type === 'manual_adjust'
      ? modalState.subscription.customOverrides?.employeesLimitBonus || 10
      : 10,
  );
  const [storageBonus, setStorageBonus] = useState<number>(
    modalState?.type === 'manual_adjust'
      ? modalState.subscription.customOverrides?.storageGbBonus || 20
      : 20,
  );
  const [graceDays, setGraceDays] = useState<number>(
    modalState?.type === 'manual_adjust'
      ? modalState.subscription.customOverrides?.gracePeriodDays || 7
      : 7,
  );
  const [adjustNotes, setAdjustNotes] = useState<string>(
    modalState?.type === 'manual_adjust'
      ? modalState.subscription.customOverrides?.notes || ''
      : '',
  );

  // Cancel State
  const [cancelImmediate, setCancelImmediate] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Non-payment / Administrative request');

  // Edit Plan State
  const [editingPlan, setEditingPlan] = useState<SaaSPlan | null>(
    modalState?.type === 'edit_plan' ? { ...modalState.plan } : null,
  );

  // Create Coupon State
  const [couponCode, setCouponCode] = useState<string>('SAVE30');
  const [couponDesc, setCouponDesc] = useState<string>('Special administrative discount voucher');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(30);
  const [couponPlans, setCouponPlans] = useState<PlanTier[]>(['Pro', 'Enterprise']);
  const [couponMaxRedemptions, setCouponMaxRedemptions] = useState<number>(100);
  const [couponExpiry, setCouponExpiry] = useState<string>('2026-12-31');

  if (!modalState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. Renew Modal */}
        {modalState.type === 'renew' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <RotateCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('subscriptions.modalRenewTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.subscription.businessName} ({modalState.subscription.planTier} Tier)
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-surface-subtle border border-border p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Expiry:</span>
                <span className="font-mono font-bold text-foreground">
                  {modalState.subscription.currentPeriodEnd}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base MRR:</span>
                <span className="font-mono font-bold text-foreground">
                  ${modalState.subscription.mrrContribution} /mo
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                {t('subscriptions.extendDuration')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRenewMonths(m)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                      renewMonths === m
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-card border-border text-foreground hover:bg-surface-subtle'
                    }`}
                  >
                    +{m} {m === 1 ? 'Month' : 'Months'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => onConfirmRenew(modalState.subscription, renewMonths)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
              >
                {t('subscriptions.confirmRenewal')}
              </button>
            </div>
          </div>
        )}

        {/* 2. Upgrade / Downgrade Modal */}
        {modalState.type === 'change_tier' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <ArrowUpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {modalState.mode === 'upgrade'
                    ? t('subscriptions.modalUpgradeTitle')
                    : t('subscriptions.modalDowngradeTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.subscription.businessName} (Current:{' '}
                  <strong>{modalState.subscription.planTier}</strong>)
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-2">
                Select Destination Tier:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {plans.map((p) => (
                  <button
                    key={p.tier}
                    type="button"
                    onClick={() => setTargetTier(p.tier)}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition cursor-pointer ${
                      targetTier === p.tier
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-foreground">{p.name}</strong>
                      <span className="text-xs font-mono font-black text-primary">
                        ${p.priceMonthly}/mo
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      {p.maxBranches === -1 ? 'Unlimited' : `${p.maxBranches} branches`} •{' '}
                      {p.storageGb} GB
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={effectiveImmediately}
                onChange={(e) => setEffectiveImmediately(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <span>Apply changes immediately (Prorated billing recalculation)</span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onConfirmTierChange(modalState.subscription, targetTier, effectiveImmediately)
                }
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
              >
                {t('subscriptions.confirmTierChange')}
              </button>
            </div>
          </div>
        )}

        {/* 3. Manual Adjustments Modal */}
        {modalState.type === 'manual_adjust' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('subscriptions.modalAdjustTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grant custom capacity overrides without modifying plan pricing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-foreground flex items-center gap-1 mb-1">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Bonus Branches:</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={branchBonus}
                  onChange={(e) => setBranchBonus(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground flex items-center gap-1 mb-1">
                  <Users className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Bonus Employees:</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={empBonus}
                  onChange={(e) => setEmpBonus(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground flex items-center gap-1 mb-1">
                  <HardDrive className="h-3.5 w-3.5 text-sky-400" />
                  <span>Bonus Storage (GB):</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={storageBonus}
                  onChange={(e) => setStorageBonus(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground flex items-center gap-1 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  <span>Grace Extension (Days):</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={graceDays}
                  onChange={(e) => setGraceDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground text-xs block mb-1">
                Internal Administrative Justification:
              </label>
              <textarea
                rows={2}
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="e.g. VIP partner agreement, granted 2 branches for regional retail expansion"
                className="w-full rounded-xl border border-border bg-surface-subtle p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onConfirmManualAdjust(modalState.subscription, {
                    branchesLimitBonus: branchBonus,
                    employeesLimitBonus: empBonus,
                    storageGbBonus: storageBonus,
                    gracePeriodDays: graceDays,
                    notes: adjustNotes,
                  })
                }
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                {t('subscriptions.saveAdjustments')}
              </button>
            </div>
          </div>
        )}

        {/* 4. Cancel / Suspend Modal */}
        {modalState.type === 'cancel' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-destructive-text">
                  {t('subscriptions.modalCancelTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Terminate subscription for {modalState.subscription.businessName}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Cancellation Reason:
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={cancelImmediate}
                onChange={(e) => setCancelImmediate(e.target.checked)}
                className="rounded border-border text-destructive focus:ring-destructive h-4 w-4"
              />
              <span className="text-destructive font-bold">
                Revoke immediately (otherwise terminates at period end)
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onConfirmCancel(modalState.subscription, cancelImmediate, cancelReason)
                }
                className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive-text text-xs font-bold text-destructive-foreground shadow-sm cursor-pointer"
              >
                {t('subscriptions.confirmCancel')}
              </button>
            </div>
          </div>
        )}

        {/* 5. Edit Plan Configurator Modal */}
        {modalState.type === 'edit_plan' && editingPlan && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Edit3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Edit Plan Architecture: {editingPlan.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update sovereign price points, quotas, and limits
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Monthly Price ($):</label>
                <input
                  type="number"
                  value={editingPlan.priceMonthly}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Annual Price/mo ($):</label>
                <input
                  type="number"
                  value={editingPlan.priceAnnual}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, priceAnnual: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Max Branches (-1 = ∞):</label>
                <input
                  type="number"
                  value={editingPlan.maxBranches}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, maxBranches: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Max Employees (-1 = ∞):</label>
                <input
                  type="number"
                  value={editingPlan.maxEmployees}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, maxEmployees: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Storage Limit (GB):</label>
                <input
                  type="number"
                  value={editingPlan.storageGb}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, storageGb: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Trial Period (Days):</label>
                <input
                  type="number"
                  value={editingPlan.trialDays}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, trialDays: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => onSavePlan(editingPlan)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
              >
                Save Plan Parameters
              </button>
            </div>
          </div>
        )}

        {/* 6. Create Coupon Modal */}
        {modalState.type === 'create_coupon' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Create Promotional Voucher Code
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generate promotional discount campaigns for tenant acquisition
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">Voucher Code:</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-black uppercase text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Discount Type:</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 font-bold text-xs"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount ($ FLAT)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Value ({couponType === 'percentage' ? '%' : '$'}):
                  </label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Max Redemptions:</label>
                  <input
                    type="number"
                    value={couponMaxRedemptions}
                    onChange={(e) => setCouponMaxRedemptions(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Campaign Description:</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Applicable Plans:</label>
                <div className="flex flex-wrap gap-2">
                  {(['Free', 'Basic', 'Pro', 'Enterprise'] as PlanTier[]).map((tier) => {
                    const isSelected = couponPlans.includes(tier);
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() =>
                          setCouponPlans((prev) =>
                            isSelected ? prev.filter((p) => p !== tier) : [...prev, tier],
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface-subtle border-border text-muted-foreground'
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Expiry Date:</label>
                <input
                  type="date"
                  value={couponExpiry}
                  onChange={(e) => setCouponExpiry(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onCreateCoupon({
                    code: couponCode,
                    description: couponDesc,
                    discountType: couponType,
                    discountValue: couponValue,
                    validPlans: couponPlans,
                    maxRedemptions: couponMaxRedemptions,
                    expiresAt: couponExpiry,
                    isActive: true,
                  })
                }
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
              >
                Deploy Voucher Campaign
              </button>
            </div>
          </div>
        )}

        {/* 7. Create Plan Modal */}
        {modalState.type === 'create_plan' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('subscriptions.createPlanTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('subscriptions.createPlanSubtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Plan Name (EN):</label>
                <input
                  type="text"
                  value={createPlanName}
                  onChange={(e) => setCreatePlanName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Plan Name (AR):</label>
                <input
                  type="text"
                  value={createPlanNameAr}
                  onChange={(e) => setCreatePlanNameAr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-bold rtl:text-right"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Base Plan Tier:</label>
                <select
                  value={createPlanTier}
                  onChange={(e) => setCreatePlanTier(e.target.value as PlanTier)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 font-bold"
                >
                  <option value="Free">Free</option>
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Max Products (-1 = ∞):</label>
                <input
                  type="number"
                  value={createPlanProducts}
                  onChange={(e) => setCreatePlanProducts(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Monthly Price ($):</label>
                <input
                  type="number"
                  value={createPlanPriceMonthly}
                  onChange={(e) => setCreatePlanPriceMonthly(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Annual Price/mo ($):</label>
                <input
                  type="number"
                  value={createPlanPriceAnnual}
                  onChange={(e) => setCreatePlanPriceAnnual(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Max Branches (-1 = ∞):</label>
                <input
                  type="number"
                  value={createPlanBranches}
                  onChange={(e) => setCreatePlanBranches(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Max Employees (-1 = ∞):</label>
                <input
                  type="number"
                  value={createPlanEmployees}
                  onChange={(e) => setCreatePlanEmployees(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Storage Limit (GB):</label>
                <input
                  type="number"
                  value={createPlanStorage}
                  onChange={(e) => setCreatePlanStorage(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">Trial Period (Days):</label>
                <input
                  type="number"
                  value={createPlanTrialDays}
                  onChange={(e) => setCreatePlanTrialDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Tagline (EN):</label>
                <input
                  type="text"
                  value={createPlanTagline}
                  onChange={(e) => setCreatePlanTagline(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2"
                />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Tagline (AR):</label>
                <input
                  type="text"
                  value={createPlanTaglineAr}
                  onChange={(e) => setCreatePlanTaglineAr(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-subtle px-3 py-2 rtl:text-right"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-medium text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={createPlanIsPopular}
                  onChange={(e) => setCreatePlanIsPopular(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <span>Highlight as &quot;Most Popular&quot; Tier</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() =>
                  onCreatePlan({
                    id: `plan_${Date.now()}`,
                    tier: createPlanTier,
                    name: createPlanName,
                    tagline: createPlanTagline,
                    taglineAr: createPlanTaglineAr,
                    priceMonthly: createPlanPriceMonthly,
                    priceAnnual: createPlanPriceAnnual,
                    currency: 'USD',
                    maxBranches: createPlanBranches,
                    maxEmployees: createPlanEmployees,
                    maxProducts: createPlanProducts,
                    storageGb: createPlanStorage,
                    trialDays: createPlanTrialDays,
                    isPopular: createPlanIsPopular,
                    subscribersCount: 0,
                    limits: {
                      apiCallsPerMonth: 50000,
                      customDomains: true,
                      prioritySupport: true,
                      whiteLabel: false,
                    },
                    features: [
                      {
                        id: 'f1',
                        name: 'Full POS & Barcode Scanner Engine',
                        nameAr: 'نقاط بيع متقدمة وقارئ باركود سريع',
                        included: true,
                      },
                      {
                        id: 'f2',
                        name: 'Multi-branch Sync & Inventory Transfers',
                        nameAr: 'مزامنة الفروع ومناقلات المخزون',
                        included: true,
                      },
                      {
                        id: 'f3',
                        name: 'REST API & Webhook Integrations',
                        nameAr: 'واجهات برمجة التطبيقات والربط البرمجي',
                        included: true,
                      },
                      {
                        id: 'f4',
                        name: 'Automated Daily Cloud Backups',
                        nameAr: 'نسخ احتياطي سحابي يومي آلي',
                        included: true,
                      },
                    ],
                  })
                }
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer"
              >
                {t('subscriptions.deployNewPlan')}
              </button>
            </div>
          </div>
        )}

        {/* 8. Delete Plan Modal */}
        {modalState.type === 'delete_plan' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-destructive-text">
                  {t('subscriptions.deletePlan')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Permanently retire &quot;{modalState.plan.name}&quot;
                </p>
              </div>
            </div>

            {modalState.plan.subscribersCount > 0 ? (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive-text space-y-1">
                <strong>Attention Sovereign Warning:</strong>
                <p className="text-[11px] leading-relaxed">
                  There are currently{' '}
                  <strong>{modalState.plan.subscribersCount} active subscribers</strong> utilizing
                  this tier. Deleting this plan will remove it from future sales and mark the tier as
                  archived.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                This plan currently has 0 active subscribers. It can be safely removed from the
                catalog.
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => onDeletePlan(modalState.plan.id)}
                className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive-text text-xs font-bold text-destructive-foreground shadow-sm cursor-pointer"
              >
                {t('subscriptions.confirmDeletePlan')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SubscriptionActionModals);
