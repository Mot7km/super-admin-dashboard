import { memo, type FC } from 'react';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { INVOICE_COLLECTION_DATA } from '../../analytics.mock';

export const InvoiceAgingCollectionCard: FC = memo(() => {
  const { t } = useTranslation();

  const data = INVOICE_COLLECTION_DATA;

  const invoiceSegments = [
    {
      key: 'paid',
      labelKey: 'analytics.invoices.paid',
      count: data.paidCount,
      amount: data.paidAmount,
      percent: data.paidPercent,
      color: 'bg-emerald-500',
      text: 'text-emerald-500',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
      icon: CheckCircle2,
    },
    {
      key: 'pending',
      labelKey: 'analytics.invoices.pending',
      count: data.pendingCount,
      amount: data.pendingAmount,
      percent: data.pendingPercent,
      color: 'bg-amber-500',
      text: 'text-amber-500',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
      icon: Clock,
    },
    {
      key: 'overdue',
      labelKey: 'analytics.invoices.overdue',
      count: data.overdueCount,
      amount: data.overdueAmount,
      percent: data.overduePercent,
      color: 'bg-rose-500',
      text: 'text-rose-500',
      border: 'border-rose-500/20',
      bg: 'bg-rose-500/10',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('analytics.invoices.title')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('analytics.invoices.subtitle')}
            </p>
          </div>
        </div>

        {/* DSO & Refunds KPI Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 font-bold text-primary">
            <Zap className="h-3.5 w-3.5" />
            <span>DSO: {data.dsoDays} {t('analytics.invoices.days')}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/80 px-3 py-1.5 font-semibold text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
            <span>
              {t('analytics.invoices.refunds')}: EGP {data.totalRefundedAmount.toLocaleString()} ({data.refundsRate}%)
            </span>
          </div>
        </div>
      </div>

      {/* Proportional Invoices Bar */}
      <div className="space-y-2">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted p-0.5">
          {invoiceSegments.map((seg) => (
            <div
              key={seg.key}
              title={`${t(seg.labelKey)}: ${seg.count} (${seg.percent}%)`}
              className={`h-full first:rounded-s-full last:rounded-e-full ${seg.color} transition-all duration-300`}
              style={{ width: `${seg.percent}%` }}
            />
          ))}
        </div>
      </div>

      {/* 3 Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {invoiceSegments.map((seg) => {
          const Icon = seg.icon;
          return (
            <div
              key={seg.key}
              className={`rounded-xl border ${seg.border} ${seg.bg} p-4 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Icon className={`h-4 w-4 ${seg.text}`} />
                  <span>{t(seg.labelKey)}</span>
                </div>
                <span className={`text-xs font-bold ${seg.text}`}>
                  {seg.percent}%
                </span>
              </div>

              <div className="text-xl font-extrabold text-foreground">
                EGP {seg.amount.toLocaleString()}
              </div>

              <div className="text-[11px] text-muted-foreground">
                {seg.count} {t('analytics.invoices.invoicesCount')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

InvoiceAgingCollectionCard.displayName = 'InvoiceAgingCollectionCard';
