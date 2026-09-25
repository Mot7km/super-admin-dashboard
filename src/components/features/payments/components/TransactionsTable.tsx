import { memo, type FC, useState, useRef, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  MoreVertical,
  ExternalLink,
  Building2,
  Smartphone,
  Radio,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  PaymentTransaction,
  PaymentModalAction,
  PaymentStatus,
  PaymentMethodType,
} from '../payments.types';

type TransactionsTableProps = {
  transactions: PaymentTransaction[];
  onOpenModal: (action: PaymentModalAction) => void;
};

const getStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case 'successful':
      return {
        labelKey: 'payments.statusSuccessful',
        defaultLabel: 'Successful',
        dotClass: 'bg-emerald-500',
        badgeClass: 'text-success-text bg-success-bg border-success-text/20',
        icon: CheckCircle2,
      };
    case 'failed':
      return {
        labelKey: 'payments.statusFailed',
        defaultLabel: 'Failed',
        dotClass: 'bg-destructive',
        badgeClass: 'text-destructive-text bg-destructive-bg border-destructive-text/20',
        icon: AlertTriangle,
      };
    case 'refunded':
      return {
        labelKey: 'payments.statusRefunded',
        defaultLabel: 'Refunded',
        dotClass: 'bg-amber-500',
        badgeClass: 'text-warning-text bg-warning-bg border-warning-text/20',
        icon: RotateCcw,
      };
    case 'disputed':
      return {
        labelKey: 'payments.statusDisputed',
        defaultLabel: 'Disputed',
        dotClass: 'bg-purple-500',
        badgeClass: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
        icon: AlertCircle,
      };
    case 'pending':
      return {
        labelKey: 'payments.statusPending',
        defaultLabel: 'Pending',
        dotClass: 'bg-sky-500',
        badgeClass: 'text-info-text bg-info-bg border-info-text/20',
        icon: Clock,
      };
  }
};

const getMethodIcon = (method: PaymentMethodType) => {
  switch (method) {
    case 'apple_pay':
    case 'google_pay':
    case 'digital_wallet':
      return Smartphone;
    case 'fawry':
      return Radio;
    default:
      return CreditCard;
  }
};

const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
  onOpenModal,
}) => {
  const { t, locale } = useTranslation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAmount = (val: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency || 'EGP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) return locale === 'ar' ? 'الآن' : 'Just now';
      if (diffMinutes < 60)
        return locale === 'ar' ? `منذ ${diffMinutes} دقيقة` : `${diffMinutes}m ago`;
      if (diffHours < 24)
        return locale === 'ar' ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
      if (diffDays === 1) return locale === 'ar' ? 'أمس' : 'Yesterday';
      return locale === 'ar' ? `منذ ${diffDays} أيام` : `${diffDays}d ago`;
    } catch {
      return isoString;
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/50">
        <div className="h-12 w-12 rounded-2xl bg-surface-subtle border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <CreditCard className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-foreground">
          {t('payments.noTxnFound') || 'No financial transactions found'}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          {t('payments.noTxnDescription') ||
            'Try adjusting your search criteria, gateway provider, or date range.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="border-b border-border/70 bg-surface-subtle/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3.5 px-4">{t('payments.colTransaction') || 'Transaction ID & Time'}</th>
              <th className="py-3.5 px-4">{t('payments.colTenant') || 'Subscriber & Customer'}</th>
              <th className="py-3.5 px-4">{t('payments.colAmount') || 'Gross & Net Amount'}</th>
              <th className="py-3.5 px-4">{t('payments.colMethod') || 'Method & Card Brand'}</th>
              <th className="py-3.5 px-4">{t('payments.colGateway') || 'Gateway / Provider'}</th>
              <th className="py-3.5 px-4">{t('payments.colStatus') || 'Processing Status'}</th>
              <th className="py-3.5 px-4 text-right rtl:text-left">
                {t('common.actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-xs">
            {transactions.map((txn) => {
              const statusMeta = getStatusBadge(txn.status);
              const MethodIcon = getMethodIcon(txn.paymentMethod);
              const isMenuOpen = activeMenuId === txn.id;

              return (
                <tr
                  key={txn.id}
                  className="hover:bg-surface-subtle/50 transition-colors group"
                >
                  {/* 1. Transaction ID & Creation Time */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-foreground flex items-center gap-1.5">
                        <span className="text-primary hover:underline cursor-pointer"
                          onClick={() => onOpenModal({ type: 'view_transaction', transaction: txn })}
                        >
                          {txn.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{getRelativeTime(txn.createdAt)}</span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Tenant & Customer */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-[200px]">
                      <div className="font-semibold text-foreground truncate flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{txn.businessName}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate font-mono">
                        {txn.customerEmail}
                      </div>
                    </div>
                  </td>

                  {/* 3. Gross & Net Amount */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-mono font-black text-foreground text-sm tabular-nums">
                        {formatAmount(txn.amount, txn.currency)}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Fee: {formatAmount(txn.fee, txn.currency)} • Net: {formatAmount(txn.net, txn.currency)}
                      </div>
                    </div>
                  </td>

                  {/* 4. Payment Method & Card Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-primary shrink-0">
                        <MethodIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block text-xs capitalize">
                          {txn.paymentMethod.replace('_', ' ')}
                        </span>
                        {txn.cardLast4 ? (
                          <span className="text-[11px] text-muted-foreground font-mono block">
                            {txn.cardBrand ? txn.cardBrand.toUpperCase() : 'Card'} •••• {txn.cardLast4}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/80 font-mono block">
                            Direct Endpoint
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 5. Gateway / Provider */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-mono font-bold text-xs uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {txn.provider}
                    </span>
                  </td>

                  {/* 6. Processing Status */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                        <span>{t(statusMeta.labelKey) || statusMeta.defaultLabel}</span>
                      </span>

                      {txn.status === 'failed' && txn.failureReason && (
                        <div className="text-[10px] text-destructive-text font-mono flex items-center gap-1" title={txn.failureCode}>
                          <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate max-w-[140px]">{txn.failureReason.replace(/_/g, ' ')}</span>
                        </div>
                      )}

                      {txn.status === 'refunded' && txn.refundAmount && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          Refunded {formatAmount(txn.refundAmount, txn.currency)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 7. Sovereign Root Actions */}
                  <td className="py-3.5 px-4 text-right rtl:text-left relative">
                    <div className="relative inline-block text-left" ref={isMenuOpen ? menuRef : null}>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId((prev) => (prev === txn.id ? null : txn.id))
                        }
                        className="h-8 w-8 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isMenuOpen && (
                        <div
                          className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-48 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-left rtl:text-right"
                          role="menu"
                        >
                          {/* 1. Inspect */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onOpenModal({ type: 'view_transaction', transaction: txn });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-primary" />
                            <span>{t('payments.actions.inspectTxn') || 'Inspect Transaction'}</span>
                          </button>

                          {/* 2. Issue Refund (if successful) */}
                          {txn.status === 'successful' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenModal({ type: 'refund', transaction: txn });
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-warning-text hover:bg-warning-bg/30 transition-colors"
                            >
                              <RotateCcw className="h-3.5 w-3.5 text-warning-text" />
                              <span>{t('payments.actions.issueRefund') || 'Issue Refund'}</span>
                            </button>
                          )}

                          {/* 3. Retry (if failed) */}
                          {txn.status === 'failed' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onOpenModal({ type: 'retry_payment', transaction: txn });
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                            >
                              <RotateCcw className="h-3.5 w-3.5 text-primary" />
                              <span>{t('payments.actions.retryCharge') || 'Retry Payment'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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

export default memo(TransactionsTable);
