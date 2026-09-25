import { useState, useMemo, useCallback } from 'react';
import {
  DollarSign,
  Download,
  Radio,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_GATEWAYS,
  PERIOD_REVENUE_METRICS,
} from './payments.mock';
import type {
  PaymentTransaction,
  Invoice,
  PaymentProviderStatus,
  PaymentFilterState,
  PaymentModalAction,
  RevenuePeriod,
} from './payments.types';
import RevenueCockpit from './components/RevenueCockpit';
import PaymentProviderStatusStrip from './components/PaymentProviderStatusStrip';
import PaymentFilterBar from './components/PaymentFilterBar';
import TransactionsTable from './components/TransactionsTable';
import InvoicesList from './components/InvoicesList';
import PaymentMethodsAnalytics from './components/PaymentMethodsAnalytics';
import PaymentActionModals from './components/PaymentActionModals';

const PaymentsDashboard = () => {
  const { t, locale } = useTranslation();

  // Primary State Stores
  const [transactions, setTransactions] =
    useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [invoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [gateways] = useState<PaymentProviderStatus[]>(INITIAL_GATEWAYS);

  // Timeframe Scope
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('month');
  const [customStartDate, setCustomStartDate] = useState('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState('2026-09-25');

  // Filter State
  const [filters, setFilters] = useState<PaymentFilterState>({
    activeTab: 'transactions',
    revenuePeriod: 'month',
    customStartDate: '2026-09-01',
    customEndDate: '2026-09-25',
    status: 'all',
    provider: 'all',
    method: 'all',
    business: 'all',
    search: '',
    sortBy: 'date_desc',
    page: 1,
    pageSize: 8,
  });

  // Modal Action Coordinator
  const [modalState, setModalState] = useState<PaymentModalAction>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    [],
  );

  const handleFilterChange = useCallback(
    <K extends keyof PaymentFilterState>(key: K, value: PaymentFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page:
          key === 'search' ||
          key === 'status' ||
          key === 'provider' ||
          key === 'method' ||
          key === 'business'
            ? 1
            : prev.page,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      status: 'all',
      provider: 'all',
      method: 'all',
      business: 'all',
      page: 1,
    }));
  }, []);

  // Compute Revenue Summary for current period
  const activeRevenueSummary = useMemo(() => {
    return PERIOD_REVENUE_METRICS[revenuePeriod] || PERIOD_REVENUE_METRICS.month;
  }, [revenuePeriod]);

  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (filters.status !== 'all' && txn.status !== filters.status) return false;
      if (filters.provider !== 'all' && txn.provider !== filters.provider) return false;
      if (filters.method !== 'all' && txn.paymentMethod !== filters.method) return false;
      if (filters.business !== 'all' && txn.businessId !== filters.business) return false;

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesId = txn.id.toLowerCase().includes(q);
        const matchesBusiness = txn.businessName.toLowerCase().includes(q);
        const matchesEmail = txn.customerEmail.toLowerCase().includes(q);
        const matchesMethod = txn.paymentMethod.toLowerCase().includes(q);
        const matchesRef = txn.providerTxnRef.toLowerCase().includes(q);
        const matchesCard = txn.cardLast4?.includes(q);

        if (!matchesId && !matchesBusiness && !matchesEmail && !matchesMethod && !matchesRef && !matchesCard) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filters.status, filters.provider, filters.method, filters.business, filters.search]);

  // Sort Transactions
  const sortedTransactions = useMemo(() => {
    const list = [...filteredTransactions];
    switch (filters.sortBy) {
      case 'date_desc':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'date_asc':
        return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'amount_desc':
        return list.sort((a, b) => b.amount - a.amount);
      case 'amount_asc':
        return list.sort((a, b) => a.amount - b.amount);
      default:
        return list;
    }
  }, [filteredTransactions, filters.sortBy]);

  // Paginate Transactions
  const totalPages = Math.ceil(sortedTransactions.length / filters.pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return sortedTransactions.slice(start, start + filters.pageSize);
  }, [sortedTransactions, filters.page, filters.pageSize]);

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (filters.business !== 'all' && inv.businessId !== filters.business) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchesBusiness = inv.businessName.toLowerCase().includes(q);
        const matchesPlan = inv.planTier.toLowerCase().includes(q);
        if (!matchesNum && !matchesBusiness && !matchesPlan) return false;
      }
      return true;
    });
  }, [invoices, filters.business, filters.search]);

  // Actions: Issue Refund
  const handleConfirmRefund = useCallback(
    (transactionId: string, refundAmount: number, reason: string) => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === transactionId) {
            return {
              ...t,
              status: 'refunded',
              refundAmount,
              refundReason: reason,
              refundedAt: new Date().toISOString(),
            };
          }
          return t;
        }),
      );
      showToast(
        locale === 'ar'
          ? `تم استرداد مبلغ ${refundAmount} بنجاح وإعادته لحساب العميل`
          : `Refund of ${refundAmount} dispatched successfully back to client card`,
        'success',
      );
    },
    [locale, showToast],
  );

  // Actions: Retry Failed Charge
  const handleConfirmRetry = useCallback(
    (transactionId: string) => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (t.id === transactionId) {
            return {
              ...t,
              status: 'successful',
              failureReason: undefined,
              failureCode: undefined,
              fee: Math.round(t.amount * 0.025),
              net: Math.round(t.amount * 0.975),
            };
          }
          return t;
        }),
      );
      showToast(
        locale === 'ar'
          ? 'تمت إعادة محاولة الخصم بنجاح وتسوية العملية المالية'
          : 'Payment re-attempt succeeded and charge settled',
        'success',
      );
    },
    [locale, showToast],
  );

  // Export CSV
  const handleExportLedger = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'TxnID,InvoiceID,Business,Amount,Currency,Status,Fee,Net,Method,Provider,CreatedAt',
        ...sortedTransactions.map(
          (t) =>
            `"${t.id}","${t.invoiceId || ''}","${t.businessName}",${t.amount},"${t.currency}","${t.status}",${t.fee},${t.net},"${t.paymentMethod}","${t.provider}","${t.createdAt}"`,
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(
      locale === 'ar'
        ? 'تم تصدير السجل المالي بنجاح بصيغة CSV'
        : 'Financial ledger exported successfully as CSV',
      'info',
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border animate-in slide-in-from-top duration-300 ${
            toast.type === 'success'
              ? 'bg-success-bg border-success-text/30 text-success-text'
              : toast.type === 'error'
              ? 'bg-destructive-bg border-destructive-text/30 text-destructive-text'
              : 'bg-info-bg border-info-text/30 text-info-text'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.type === 'info' && <Info className="h-4 w-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {t('payments.title') || 'Payments & Revenue'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('payments.subtitle') ||
                  'Sovereign multi-tenant clearing, transactions ledger, gateway SLA health, and tax invoices'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleExportLedger}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border/80 hover:bg-surface-subtle text-foreground text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{t('payments.exportLedger') || 'Export Ledger (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* 1. Revenue Cockpit (Timeframe Engine: Today, Month, Year, Custom Range) */}
      <RevenueCockpit
        summary={activeRevenueSummary}
        selectedPeriod={revenuePeriod}
        onSelectPeriod={setRevenuePeriod}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={(start, end) => {
          setCustomStartDate(start);
          setCustomEndDate(end);
        }}
        onQuickFilterStatus={(status) => {
          handleFilterChange('activeTab', 'transactions');
          handleFilterChange('status', status);
        }}
      />

      {/* 2. Gateway SLA & Telemetry Strip */}
      <PaymentProviderStatusStrip
        gateways={gateways}
        onOpenGatewayModal={(gw) => setModalState({ type: 'gateway_details', provider: gw })}
      />

      {/* 3. Filter Bar & View Tabs */}
      <PaymentFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        transactionsCount={transactions.length}
        invoicesCount={invoices.length}
        transactions={transactions}
        invoices={invoices}
      />

      {/* 4. Active Tab Content */}
      {filters.activeTab === 'transactions' && (
        <div className="space-y-4">
          <TransactionsTable
            transactions={paginatedTransactions}
            onOpenModal={setModalState}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                {t('common.showing') || 'Showing'}{' '}
                <strong className="text-foreground font-mono">
                  {sortedTransactions.length === 0
                    ? 0
                    : (filters.page - 1) * filters.pageSize + 1}
                  -
                  {Math.min(
                    filters.page * filters.pageSize,
                    sortedTransactions.length,
                  )}
                </strong>{' '}
                {t('common.of') || 'of'}{' '}
                <strong className="text-foreground font-mono">
                  {sortedTransactions.length}
                </strong>{' '}
                {t('payments.transactionsTotal') || 'transactions'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((p) => ({ ...p, page: Math.max(p.page - 1, 1) }))
                }
                className="h-8 px-3 rounded-xl border border-border/80 bg-card hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                <span>{t('common.previous') || 'Previous'}</span>
              </button>

              <span className="px-3 py-1 rounded-xl bg-surface-subtle border border-border text-foreground font-mono font-bold text-xs">
                {filters.page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={filters.page >= totalPages}
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    page: Math.min(p.page + 1, totalPages),
                  }))
                }
                className="h-8 px-3 rounded-xl border border-border/80 bg-card hover:bg-surface-subtle disabled:opacity-40 disabled:pointer-events-none text-foreground text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>{t('common.next') || 'Next'}</span>
                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {filters.activeTab === 'invoices' && (
        <InvoicesList invoices={filteredInvoices} onOpenModal={setModalState} />
      )}

      {filters.activeTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gateways.map((gw) => (
            <div
              key={gw.id}
              className="p-5 rounded-2xl border border-border/80 bg-card/90 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                      <Radio className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {gw.name}
                      </h4>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Ping: {gw.latencyMs}ms
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    {gw.uptimePercent}% SLA
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-bold text-foreground">
                      {gw.successRatePercent}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currencies:</span>
                    <span className="text-foreground">
                      {gw.supportedCurrencies.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalState({ type: 'gateway_details', provider: gw })
                }
                className="w-full py-2 rounded-xl bg-surface-subtle hover:bg-card border border-border text-xs font-bold text-foreground transition-all"
              >
                Inspect Routing Parameters
              </button>
            </div>
          ))}
        </div>
      )}

      {filters.activeTab === 'methods' && (
        <PaymentMethodsAnalytics transactions={transactions} />
      )}

      {/* 5. Modals Coordinator */}
      <PaymentActionModals
        modalState={modalState}
        onClose={() => setModalState(null)}
        onConfirmRefund={handleConfirmRefund}
        onConfirmRetry={handleConfirmRetry}
      />
    </div>
  );
};

export default PaymentsDashboard;
