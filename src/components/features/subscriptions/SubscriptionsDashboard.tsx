import { useState, useMemo, useCallback } from 'react';
import {
  CreditCard,
  Layers,
  Tag,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import {
  INITIAL_SAAS_PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_COUPONS,
} from './subscriptions.mock';
import type {
  Subscription,
  SaaSPlan,
  Coupon,
  SubscriptionFilterState,
  SubscriptionModalAction,
  PlanTier,
} from './subscriptions.types';
import SubscriptionKpiStrip from './components/SubscriptionKpiStrip';
import SubscriptionFilterBar from './components/SubscriptionFilterBar';
import SubscriptionTable from './components/SubscriptionTable';
import PlansCatalog from './components/PlansCatalog';
import CouponsManager from './components/CouponsManager';
import SubscriptionActionModals from './components/SubscriptionActionModals';

type ActiveTab = 'subscriptions' | 'plans' | 'coupons';

const SubscriptionsDashboard = () => {
  const { t } = useTranslation();

  // Primary state stores
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [plans, setPlans] = useState<SaaSPlan[]>(INITIAL_SAAS_PLANS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('subscriptions');

  // Modal dialog coordinator
  const [modalState, setModalState] = useState<SubscriptionModalAction>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null,
  );

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  // Filtering state
  const [filters, setFilters] = useState<SubscriptionFilterState>({
    search: '',
    status: 'all',
    tier: 'all',
    billingCycle: 'all',
    sortBy: 'mrr_desc',
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = useCallback(
    <K extends keyof SubscriptionFilterState>(key: K, value: SubscriptionFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === 'search' || key === 'status' || key === 'tier' || key === 'billingCycle' ? 1 : prev.page,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      tier: 'all',
      billingCycle: 'all',
      sortBy: 'mrr_desc',
      page: 1,
      pageSize: 10,
    });
  }, []);

  // Filtered & Sorted Subscriptions
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.businessName.toLowerCase().includes(q) ||
          s.subdomain.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          s.ownerEmail.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q),
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status);
    }

    // Tier filter
    if (filters.tier !== 'all') {
      result = result.filter((s) => s.planTier === filters.tier);
    }

    // Billing cycle filter
    if (filters.billingCycle !== 'all') {
      result = result.filter((s) => s.billingCycle === filters.billingCycle);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'mrr_desc':
          return b.mrrContribution - a.mrrContribution;
        case 'mrr_asc':
          return a.mrrContribution - b.mrrContribution;
        case 'renewal_asc':
          return new Date(a.currentPeriodEnd).getTime() - new Date(b.currentPeriodEnd).getTime();
        case 'created_desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, filters.search, filters.status, filters.tier, filters.billingCycle, filters.sortBy]);

  // Aggregate category counts for presets
  const statusCounts = useMemo(
    () => ({
      all: subscriptions.length,
      active: subscriptions.filter((s) => s.status === 'active').length,
      trial: subscriptions.filter((s) => s.status === 'trial').length,
      pending_renewal: subscriptions.filter((s) => s.status === 'pending_renewal').length,
      expired: subscriptions.filter((s) => s.status === 'expired').length,
      cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
    }),
    [subscriptions],
  );

  const totalFilteredMrr = useMemo(
    () => filteredSubscriptions.reduce((sum, s) => sum + s.mrrContribution, 0),
    [filteredSubscriptions],
  );

  // Modal confirm handlers
  const handleConfirmRenew = (sub: Subscription, months: number) => {
    const currentEnd = new Date(sub.currentPeriodEnd);
    currentEnd.setMonth(currentEnd.getMonth() + months);
    const newEndStr = currentEnd.toISOString().split('T')[0];

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              currentPeriodEnd: newEndStr,
              status: 'active',
            }
          : s,
      ),
    );
    setModalState(null);
    showToast(`Renewed subscription for ${sub.businessName} until ${newEndStr}`, 'success');
  };

  const handleConfirmTierChange = (
    sub: Subscription,
    newTier: PlanTier,
    _effectiveImmediately: boolean,
  ) => {
    const targetPlan = plans.find((p) => p.tier === newTier);
    const newMrr = targetPlan ? targetPlan.priceMonthly : sub.mrrContribution;

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              planTier: newTier,
              mrrContribution: newMrr,
              branchesLimit: targetPlan?.maxBranches ?? sub.branchesLimit,
              employeesLimit: targetPlan?.maxEmployees ?? sub.employeesLimit,
            }
          : s,
      ),
    );
    setModalState(null);
    showToast(`Updated subscription for ${sub.businessName} to ${newTier} Tier`, 'success');
  };

  const handleConfirmManualAdjust = (
    sub: Subscription,
    adjustments: {
      branchesLimitBonus: number;
      employeesLimitBonus: number;
      storageGbBonus: number;
      gracePeriodDays: number;
      notes?: string;
    },
  ) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              customOverrides: adjustments,
              branchesLimit:
                s.branchesLimit === -1 ? -1 : s.branchesLimit + adjustments.branchesLimitBonus,
              employeesLimit:
                s.employeesLimit === -1 ? -1 : s.employeesLimit + adjustments.employeesLimitBonus,
            }
          : s,
      ),
    );
    setModalState(null);
    showToast(`Applied custom bonus quotas to ${sub.businessName}`, 'success');
  };

  const handleConfirmCancel = (sub: Subscription, immediate: boolean, reason: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id
          ? {
              ...s,
              status: 'cancelled',
              autoRenew: false,
            }
          : s,
      ),
    );
    setModalState(null);
    showToast(
      `Subscription for ${sub.businessName} cancelled (${immediate ? 'Immediate' : 'At period end'}). Reason: ${reason}`,
      'info',
    );
  };

  const handleSavePlan = (updatedPlan: SaaSPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setModalState(null);
    showToast(`Updated parameters for ${updatedPlan.name} successfully`, 'success');
  };

  const handleCreatePlan = (newPlan: SaaSPlan) => {
    setPlans((prev) => [...prev, newPlan]);
    setModalState(null);
    showToast(`New plan "${newPlan.name}" deployed to catalog`, 'success');
  };

  const handleDeletePlan = (planId: string) => {
    const target = plans.find((p) => p.id === planId);
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    setModalState(null);
    showToast(`Plan "${target?.name || ''}" removed from catalog`, 'info');
  };

  const handleCreateCoupon = (
    newCouponData: Omit<Coupon, 'id' | 'redemptionsCount' | 'createdAt'>,
  ) => {
    const created: Coupon = {
      ...newCouponData,
      id: `cpn_${Date.now()}`,
      redemptionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCoupons((prev) => [created, ...prev]);
    setModalState(null);
    showToast(`Promo voucher ${created.code} deployed successfully`, 'success');
  };

  const handleToggleCouponStatus = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c)),
    );
    showToast(`Voucher status updated`, 'info');
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 shadow-2xl animate-slide-up text-xs font-bold text-foreground">
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
          {toast.type === 'info' && <Info className="h-4 w-4 text-primary" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Master Page Header & Sovereign Nav Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {t('subscriptions.title')}
            </h1>
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary font-mono flex items-center gap-1.5 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {subscriptions.length} Subscriptions Tracked
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm max-w-2xl leading-relaxed">
            {t('subscriptions.subtitle')}
          </p>
        </div>

        {/* Module Sub-navigation Tabs */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-surface-subtle border border-border/80 self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'subscriptions'
                ? 'bg-card text-foreground shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="h-4 w-4 text-primary" />
            <span>{t('subscriptions.tabSubscriptions')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-primary/10 text-primary">
              {subscriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-card text-foreground shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="h-4 w-4 text-amber-500" />
            <span>{t('subscriptions.tabPlans')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-500">
              {plans.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-card text-foreground shadow-xs ring-1 ring-border font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tag className="h-4 w-4 text-emerald-500" />
            <span>{t('subscriptions.tabCoupons')}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500">
              {coupons.filter((c) => c.isActive).length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Deck (Continuous Financial Visibility) */}
      <SubscriptionKpiStrip
        subscriptions={subscriptions}
        activeStatus={filters.status}
        onStatusSelect={(status) => handleFilterChange('status', status)}
      />

      {/* 3. Tab Views */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <SubscriptionFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalFiltered={filteredSubscriptions.length}
            totalSubscribers={subscriptions.length}
            totalFilteredMrr={totalFilteredMrr}
            statusCounts={statusCounts}
          />

          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            onActionSelect={setModalState}
          />
        </div>
      )}

      {activeTab === 'plans' && (
        <PlansCatalog
          plans={plans}
          onEditPlan={(plan) => setModalState({ type: 'edit_plan', plan })}
          onCreatePlan={() => setModalState({ type: 'create_plan' })}
          onDeletePlan={(plan) => setModalState({ type: 'delete_plan', plan })}
        />
      )}

      {activeTab === 'coupons' && (
        <CouponsManager
          coupons={coupons}
          onCreateCoupon={() => setModalState({ type: 'create_coupon' })}
          onToggleCouponStatus={handleToggleCouponStatus}
        />
      )}

      {/* 4. Action Modals Dialog */}
      <SubscriptionActionModals
        modalState={modalState}
        onClose={() => setModalState(null)}
        plans={plans}
        onConfirmRenew={handleConfirmRenew}
        onConfirmTierChange={handleConfirmTierChange}
        onConfirmManualAdjust={handleConfirmManualAdjust}
        onConfirmCancel={handleConfirmCancel}
        onSavePlan={handleSavePlan}
        onCreatePlan={handleCreatePlan}
        onDeletePlan={handleDeletePlan}
        onCreateCoupon={handleCreateCoupon}
      />
    </div>
  );
};

export default SubscriptionsDashboard;
