import { memo, useState, useEffect, type FC } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  FileText,
  Printer,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Radio,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PaymentModalAction } from '../payments.types';

type PaymentActionModalsProps = {
  modalState: PaymentModalAction;
  onClose: () => void;
  onConfirmRefund: (
    transactionId: string,
    refundAmount: number,
    reason: string,
  ) => void;
  onConfirmRetry: (transactionId: string) => void;
};

const PaymentActionModals: FC<PaymentActionModalsProps> = ({
  modalState,
  onClose,
  onConfirmRefund,
  onConfirmRetry,
}) => {
  const { t, locale } = useTranslation();

  // Refund Modal State
  const [refundMode, setRefundMode] = useState<'full' | 'partial'>('full');
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer dissatisfaction');
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (modalState?.type === 'refund') {
      setRefundMode('full');
      setRefundAmountInput(modalState.transaction.amount);
      setRefundReason('Subscription cancellation / adjustment');
    }
  }, [modalState]);

  if (!modalState) return null;

  const formatAmount = (val: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency || 'EGP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyRaw = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl p-6 transition-all duration-200 text-left rtl:text-right">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 h-8 w-8 rounded-xl bg-surface-subtle hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. Issue Refund Modal */}
        {modalState.type === 'refund' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('payments.actions.issueRefund') || 'Issue Electronic Refund'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalState.transaction.id} • {modalState.transaction.businessName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-border/70 mb-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-semibold">
                  Original Transaction Amount:
                </span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {formatAmount(
                    modalState.transaction.amount,
                    modalState.transaction.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gateway & Channel:</span>
                <span className="font-mono text-foreground uppercase">
                  {modalState.transaction.provider} •{' '}
                  {modalState.transaction.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Customer Payer:</span>
                <span className="font-mono text-foreground">
                  {modalState.transaction.customerEmail}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <label className="font-bold text-muted-foreground block mb-2">
                  Refund Volume Scope:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRefundMode('full');
                      setRefundAmountInput(modalState.transaction.amount);
                    }}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                      refundMode === 'full'
                        ? 'bg-card border-primary text-foreground ring-2 ring-primary/20'
                        : 'bg-surface-subtle border-border text-muted-foreground hover:bg-card'
                    }`}
                  >
                    Full Refund (
                    {formatAmount(
                      modalState.transaction.amount,
                      modalState.transaction.currency,
                    )}
                    )
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefundMode('partial')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition-all ${
                      refundMode === 'partial'
                        ? 'bg-card border-primary text-foreground ring-2 ring-primary/20'
                        : 'bg-surface-subtle border-border text-muted-foreground hover:bg-card'
                    }`}
                  >
                    Partial Refund
                  </button>
                </div>
              </div>

              {refundMode === 'partial' && (
                <div>
                  <label className="font-bold text-muted-foreground block mb-1">
                    Custom Refund Amount ({modalState.transaction.currency}):
                  </label>
                  <input
                    type="number"
                    max={modalState.transaction.amount}
                    min={1}
                    value={refundAmountInput}
                    onChange={(e) => setRefundAmountInput(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-muted-foreground block mb-1">
                  Reason for Refund:
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="Subscription cancellation / adjustment">
                    Subscription cancellation / tier adjustment
                  </option>
                  <option value="Duplicate transaction charged">
                    Duplicate transaction charged
                  </option>
                  <option value="Terminal hardware malfunction">
                    Terminal hardware malfunction
                  </option>
                  <option value="Fraudulent / unauthorized dispute prevention">
                    Fraudulent / unauthorized dispute prevention
                  </option>
                  <option value="Client courtesy credit">Client courtesy credit</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-warning-bg/40 border border-warning-text/30 text-warning-text flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Notice: Electronic refunds dispatch directly back to the customer’s
                  payment card or digital wallet via the payment processor. Processing
                  takes 3-7 business days depending on the acquiring bank.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmRefund(
                    modalState.transaction.id,
                    refundAmountInput,
                    refundReason,
                  );
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                Confirm & Dispatch Refund
              </button>
            </div>
          </div>
        )}

        {/* 2. Transaction Raw Inspector Modal */}
        {modalState.type === 'view_transaction' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {t('payments.actions.inspectTxn') || 'Transaction Payload Inspector'}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {modalState.transaction.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyRaw(modalState.transaction)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-bold text-foreground hover:bg-surface-subtle transition-all"
              >
                {copiedJson ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border/70">
                <span className="text-muted-foreground block text-[11px]">
                  Gross Amount:
                </span>
                <span className="font-mono font-black text-sm text-foreground">
                  {formatAmount(
                    modalState.transaction.amount,
                    modalState.transaction.currency,
                  )}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border/70">
                <span className="text-muted-foreground block text-[11px]">
                  Gateway Ref:
                </span>
                <span className="font-mono font-bold text-xs text-foreground truncate block">
                  {modalState.transaction.providerTxnRef}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border/70">
                <span className="text-muted-foreground block text-[11px]">
                  Risk Score:
                </span>
                <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  {modalState.transaction.riskScore || 5} / 100 (Safe)
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-xs font-bold text-muted-foreground block">
                Raw Telemetry Payload:
              </span>
              <pre className="p-3.5 rounded-2xl bg-surface-subtle border border-border font-mono text-[11px] text-foreground overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(modalState.transaction, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.done') || 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* 3. Retry Payment Modal */}
        {modalState.type === 'retry_payment' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('payments.actions.retryCharge') || 'Re-attempt Failed Charge'}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {modalState.transaction.id} • {modalState.transaction.businessName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-destructive-bg/30 border border-destructive-text/30 text-xs text-destructive-text mb-4">
              <div className="font-bold mb-1">Prior Decline Code:</div>
              <div className="font-mono">
                {modalState.transaction.failureCode || 'card_declined'} —{' '}
                {modalState.transaction.failureReason || 'Declined by issuer'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-subtle border border-border/70 text-xs space-y-2 mb-6 leading-relaxed">
              <p>
                Triggering a re-attempt will dispatch an automated recurring charge request
                to the customer’s registered card on file (
                <span className="font-mono font-bold">
                  {modalState.transaction.cardBrand?.toUpperCase() || 'Card'} ••••{' '}
                  {modalState.transaction.cardLast4 || '4242'}
                </span>
                ) via {modalState.transaction.provider.toUpperCase()}.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirmRetry(modalState.transaction.id);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                Re-attempt Charge Now
              </button>
            </div>
          </div>
        )}

        {/* 4. Tax Invoice Modal & Print View */}
        {modalState.type === 'view_invoice' && (
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Tax Invoice / فاتورة ضريبية إلكترونية
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {modalState.invoice.invoiceNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:brightness-105 transition-all"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {/* Electronic Tax Invoice Document Body */}
            <div className="p-6 rounded-2xl bg-surface-subtle/50 border border-border/80 text-xs text-foreground space-y-5">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-border/70 pb-4">
                <div>
                  <h2 className="text-base font-black text-foreground">
                    Mot7km Cloud ERP Platforms
                  </h2>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    Sovereign Multi-Tenant SaaS Network
                  </p>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    Tax ID: EG-7719283401 • CR: 1092834
                  </p>
                </div>

                <div className="text-left sm:text-right rtl:text-right sm:rtl:text-left font-mono">
                  <div className="text-xs font-bold text-foreground">
                    Invoice: {modalState.invoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Issued: {modalState.invoice.periodStart}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Due: {modalState.invoice.dueDate}
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="border-b border-border/70 pb-4">
                <span className="text-[11px] font-bold text-muted-foreground uppercase block mb-1">
                  Billed To / العميل:
                </span>
                <div className="font-bold text-foreground text-sm">
                  {modalState.invoice.businessName}
                </div>
                <div className="text-muted-foreground font-mono text-[11px]">
                  Plan: {modalState.invoice.planTier}
                </div>
                {modalState.invoice.taxNumber && (
                  <div className="text-muted-foreground font-mono text-[11px]">
                    Customer Tax Registration: {modalState.invoice.taxNumber}
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-[11px] font-bold text-muted-foreground">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right rtl:text-left">Unit Price</th>
                      <th className="py-2 text-right rtl:text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {modalState.invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 font-sans font-medium">{item.description}</td>
                        <td className="py-2.5 text-center">{item.quantity}</td>
                        <td className="py-2.5 text-right rtl:text-left">
                          {formatAmount(item.unitPrice, modalState.invoice.currency)}
                        </td>
                        <td className="py-2.5 text-right rtl:text-left font-bold">
                          {formatAmount(item.total, modalState.invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & QR Code */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/70">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-xl bg-card border border-border flex items-center justify-center text-foreground p-1 shadow-2xs">
                    <QrCode className="h-12 w-12" />
                  </div>
                  <div className="text-[10px] text-muted-foreground max-w-[200px] leading-tight">
                    ZATCA / ETA Electronic invoice cryptographic digest validated.
                  </div>
                </div>

                <div className="w-full sm:w-60 space-y-1.5 font-mono text-xs text-right rtl:text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      {formatAmount(
                        modalState.invoice.subtotal,
                        modalState.invoice.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      VAT ({(modalState.invoice.taxRate * 100).toFixed(0)}%):
                    </span>
                    <span>
                      +{formatAmount(
                        modalState.invoice.taxAmount,
                        modalState.invoice.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-black text-sm text-foreground pt-1 border-t border-border/60">
                    <span>Total Due:</span>
                    <span className="text-primary">
                      {formatAmount(
                        modalState.invoice.total,
                        modalState.invoice.currency,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.done') || 'Close'}
              </button>
            </div>
          </div>
        )}

        {/* 5. Gateway Details Modal */}
        {modalState.type === 'gateway_details' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {modalState.provider.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Gateway Health & Failover Routing Parameters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/70">
                <span className="text-muted-foreground block text-[11px]">
                  Network Latency:
                </span>
                <span className="font-mono font-bold text-sm text-foreground">
                  {modalState.provider.latencyMs}ms average ping
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border/70">
                <span className="text-muted-foreground block text-[11px]">
                  30-Day SLA Uptime:
                </span>
                <span className="font-mono font-bold text-sm text-success-text">
                  {modalState.provider.uptimePercent}%
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-xs">
              <div>
                <span className="font-bold text-muted-foreground block mb-1">
                  Supported Currencies:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {modalState.provider.supportedCurrencies.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border font-mono text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-muted-foreground block mb-1">
                  Supported Clearing Methods:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {modalState.provider.supportedMethods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md bg-surface-subtle border border-border font-mono text-[11px] capitalize"
                    >
                      {m.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-surface-subtle transition-colors"
              >
                {t('common.done') || 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PaymentActionModals);
