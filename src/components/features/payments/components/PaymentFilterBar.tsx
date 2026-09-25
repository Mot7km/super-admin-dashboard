import { memo, type FC, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  CreditCard,
  FileText,
  Radio,
  PieChart,
  RotateCcw,
  Building2,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  PaymentFilterState,
  PaymentTransaction,
  Invoice,
  PaymentStatus,
} from '../payments.types';

type PaymentFilterBarProps = {
  filters: PaymentFilterState;
  onFilterChange: <K extends keyof PaymentFilterState>(
    key: K,
    value: PaymentFilterState[K],
  ) => void;
  onResetFilters: () => void;
  transactionsCount: number;
  invoicesCount: number;
  transactions: PaymentTransaction[];
  invoices: Invoice[];
};

const PaymentFilterBar: FC<PaymentFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  transactionsCount,
  invoicesCount,
  transactions,
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global hotkey '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute unique businesses for filter dropdown
  const uniqueBusinesses = useMemo(() => {
    const map = new Map<string, string>();
    for (const txn of transactions) {
      if (txn.businessId && txn.businessName) {
        map.set(txn.businessId, txn.businessName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [transactions]);

  // Compute live transaction status counts for quick-chips
  const statusCounts = useMemo(() => {
    const counts = { all: transactions.length, successful: 0, failed: 0, refunded: 0, disputed: 0 };
    for (const t of transactions) {
      if (t.status === 'successful') counts.successful += 1;
      else if (t.status === 'failed') counts.failed += 1;
      else if (t.status === 'refunded') counts.refunded += 1;
      else if (t.status === 'disputed') counts.disputed += 1;
    }
    return counts;
  }, [transactions]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.provider !== 'all' ||
    filters.method !== 'all' ||
    filters.business !== 'all';

  const TABS = [
    {
      id: 'transactions' as const,
      labelKey: 'payments.tabTransactions',
      defaultLabel: 'Transactions Registry',
      icon: CreditCard,
      count: transactionsCount,
    },
    {
      id: 'invoices' as const,
      labelKey: 'payments.tabInvoices',
      defaultLabel: 'Tax Invoices',
      icon: FileText,
      count: invoicesCount,
    },
    {
      id: 'gateways' as const,
      labelKey: 'payments.tabGateways',
      defaultLabel: 'Gateways & Routing',
      icon: Radio,
    },
    {
      id: 'methods' as const,
      labelKey: 'payments.tabMethods',
      defaultLabel: 'Payment Methods & Share',
      icon: PieChart,
    },
  ];

  const STATUS_PRESETS: {
    id: 'all' | PaymentStatus;
    label: string;
    count: number;
    dotClass: string;
  }[] = [
    { id: 'all', label: 'All', count: statusCounts.all, dotClass: 'bg-foreground/50' },
    { id: 'successful', label: 'Successful', count: statusCounts.successful, dotClass: 'bg-emerald-500' },
    { id: 'failed', label: 'Failed', count: statusCounts.failed, dotClass: 'bg-destructive' },
    { id: 'refunded', label: 'Refunded', count: statusCounts.refunded, dotClass: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-3.5">
      {/* 1. Primary Feature Navigation Segmented Dock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = filters.activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange('activeTab', tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                  isSelected
                    ? 'bg-card text-foreground shadow-xs border border-border/80 font-black'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span>{t(tab.labelKey) || tab.defaultLabel}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      isSelected
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-surface-subtle text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Status Segmented Filter Chips (Active when on transactions tab) */}
        {filters.activeTab === 'transactions' && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-surface-subtle p-1 rounded-xl border border-border/70 self-start sm:self-center">
            {STATUS_PRESETS.map((preset) => {
              const isSelected = filters.status === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onFilterChange('status', preset.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all select-none ${
                    isSelected
                      ? 'bg-card text-foreground shadow-2xs font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${preset.dotClass}`} />
                  <span>{preset.label}</span>
                  <span className="text-[10px] font-mono text-muted-foreground ml-0.5">
                    ({preset.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Enhanced Search & Custom-Styled Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-card/85 backdrop-blur-md border border-border/70 rounded-2xl p-2.5 sm:p-3 shadow-xs">
        {/* Search Input with Hotkey Badge */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={
              t('payments.searchPlaceholder') ||
              'Search by Txn ID, invoice, email, tenant, card... (Press /)'
            }
            className="w-full h-9 pl-9 pr-14 rtl:pl-9 rtl:pr-14 rounded-xl bg-surface-subtle border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
          <div className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            {filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="pointer-events-auto h-5 w-5 rounded-md hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-border/80 bg-card text-[10px] font-mono font-bold text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Controls Row with Integrated Icons and Custom Chevrons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Provider / Gateway Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Radio className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.provider}
              aria-label={t('payments.filterByProvider') || 'Filter by Gateway'}
              onChange={(e) => onFilterChange('provider', e.target.value as any)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('payments.allGateways') || 'All Gateways'}</option>
              <option value="paymob">Paymob</option>
              <option value="stripe">Stripe</option>
              <option value="geidea">Geidea</option>
              <option value="hyperpay">HyperPay</option>
              <option value="tap">Tap Payments</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Payment Method Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.method}
              aria-label={t('payments.filterByMethod') || 'Filter by Method'}
              onChange={(e) => onFilterChange('method', e.target.value as any)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('payments.allMethods') || 'All Methods'}</option>
              <option value="credit_card">Card (Visa/MC)</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="mada">Mada</option>
              <option value="digital_wallet">Digital Wallet</option>
              <option value="fawry">Fawry POS</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Tenant / Organization Filter */}
          <div className="relative min-w-[130px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.business}
              aria-label={t('payments.filterByBusiness') || 'Filter by Business'}
              onChange={(e) => onFilterChange('business', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('payments.allBusinesses') || 'All Tenants'}</option>
              {uniqueBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Sort By Selector */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.sortBy}
              aria-label={t('payments.sortBy') || 'Sort By'}
              onChange={(e) => onFilterChange('sortBy', e.target.value as any)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="date_desc">
                {t('payments.sortDateDesc') || 'Date (Newest)'}
              </option>
              <option value="date_asc">
                {t('payments.sortDateAsc') || 'Date (Oldest)'}
              </option>
              <option value="amount_desc">
                {t('payments.sortAmountDesc') || 'Amount (High-Low)'}
              </option>
              <option value="amount_asc">
                {t('payments.sortAmountAsc') || 'Amount (Low-High)'}
              </option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Active Filters Chips row */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            {t('common.activeFilters') || 'Active Filters'}:
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium">
              <span>&ldquo;{filters.search}&rdquo;</span>
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="hover:text-primary-foreground hover:bg-primary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Status: {filters.status}</span>
              <button
                type="button"
                onClick={() => onFilterChange('status', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.provider !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Gateway: {filters.provider}</span>
              <button
                type="button"
                onClick={() => onFilterChange('provider', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.method !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Method: {filters.method.replace('_', ' ')}</span>
              <button
                type="button"
                onClick={() => onFilterChange('method', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.business !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>
                {uniqueBusinesses.find((b) => b.id === filters.business)?.name ||
                  filters.business}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange('business', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors font-medium ml-auto rtl:ml-0 rtl:mr-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('common.reset') || 'Reset All'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(PaymentFilterBar);
