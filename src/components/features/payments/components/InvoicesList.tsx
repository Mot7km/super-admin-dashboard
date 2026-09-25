import { memo, type FC } from 'react';
import {
  FileText,
  Clock,
  Printer,
  Building2,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Invoice, InvoiceStatus, PaymentModalAction } from '../payments.types';

type InvoicesListProps = {
  invoices: Invoice[];
  onOpenModal: (action: PaymentModalAction) => void;
};

const getInvoiceStatusBadge = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return {
        labelKey: 'payments.invStatusPaid',
        defaultLabel: 'Paid',
        dotClass: 'bg-emerald-500',
        badgeClass: 'text-success-text bg-success-bg border-success-text/20',
      };
    case 'unpaid':
      return {
        labelKey: 'payments.invStatusUnpaid',
        defaultLabel: 'Unpaid',
        dotClass: 'bg-amber-500',
        badgeClass: 'text-warning-text bg-warning-bg border-warning-text/20',
      };
    case 'overdue':
      return {
        labelKey: 'payments.invStatusOverdue',
        defaultLabel: 'Overdue',
        dotClass: 'bg-destructive animate-pulse',
        badgeClass: 'text-destructive-text bg-destructive-bg border-destructive-text/20',
      };
    case 'draft':
      return {
        labelKey: 'payments.invStatusDraft',
        defaultLabel: 'Draft',
        dotClass: 'bg-muted-foreground',
        badgeClass: 'text-muted-foreground bg-surface-subtle border-border',
      };
    case 'void':
      return {
        labelKey: 'payments.invStatusVoid',
        defaultLabel: 'Void',
        dotClass: 'bg-destructive',
        badgeClass: 'text-muted-foreground bg-destructive/10 border-destructive/20 line-through',
      };
  }
};

const InvoicesList: FC<InvoicesListProps> = ({ invoices, onOpenModal }) => {
  const { t, locale } = useTranslation();

  const formatAmount = (val: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency || 'EGP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="border-b border-border/70 bg-surface-subtle/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-4">{t('payments.colInvoiceNumber') || 'Invoice # & Period'}</th>
                <th className="py-3.5 px-4">{t('payments.colSubscriber') || 'Subscriber & Tier'}</th>
                <th className="py-3.5 px-4">{t('payments.colSubtotalVat') || 'Subtotal & Tax'}</th>
                <th className="py-3.5 px-4">{t('payments.colTotal') || 'Grand Total'}</th>
                <th className="py-3.5 px-4">{t('payments.colDueDate') || 'Due Date & Status'}</th>
                <th className="py-3.5 px-4">{t('payments.colPaymentChannel') || 'Payment Channel'}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left">
                  {t('common.actions') || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-xs">
              {invoices.map((inv) => {
                const statusMeta = getInvoiceStatusBadge(inv.status);

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-surface-subtle/50 transition-colors group"
                  >
                    {/* 1. Invoice Number & Period */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => onOpenModal({ type: 'view_invoice', invoice: inv })}
                          className="font-mono font-bold text-primary hover:underline text-xs flex items-center gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{inv.invoiceNumber}</span>
                        </button>
                        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5" />
                          <span>
                            {inv.periodStart} ~ {inv.periodEnd}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Subscriber & Plan Tier */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-[190px]">
                        <div className="font-semibold text-foreground truncate flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{inv.businessName}</span>
                        </div>
                        <span className="px-2 py-0.2 rounded-md bg-surface-subtle border border-border text-[10px] font-mono text-muted-foreground block truncate">
                          {inv.planTier}
                        </span>
                      </div>
                    </td>

                    {/* 3. Subtotal & Tax */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 font-mono">
                        <div className="text-foreground">
                          {formatAmount(inv.subtotal, inv.currency)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          VAT ({(inv.taxRate * 100).toFixed(0)}%): +{formatAmount(inv.taxAmount, inv.currency)}
                        </div>
                      </div>
                    </td>

                    {/* 4. Grand Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-black text-foreground text-sm tabular-nums">
                        {formatAmount(inv.total, inv.currency)}
                      </div>
                    </td>

                    {/* 5. Due Date & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusMeta.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                          <span>{t(statusMeta.labelKey) || statusMeta.defaultLabel}</span>
                        </span>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          <span>Due: {inv.dueDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* 6. Payment Channel */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-foreground font-medium truncate max-w-[150px]">
                        {inv.paymentMethodUsed || (
                          <span className="text-muted-foreground text-[11px] italic">
                            Pending settlement
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 7. Action Button */}
                    <td className="py-3.5 px-4 text-right rtl:text-left">
                      <button
                        type="button"
                        onClick={() => onOpenModal({ type: 'view_invoice', invoice: inv })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-subtle hover:bg-card border border-border/80 hover:border-primary/40 text-foreground text-xs font-bold transition-all shadow-2xs"
                      >
                        <Printer className="h-3.5 w-3.5 text-primary" />
                        <span>{t('payments.viewTaxInvoice') || 'View Tax PDF'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(InvoicesList);
