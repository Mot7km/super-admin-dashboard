import { memo, type FC, useMemo } from 'react';
import {
  CreditCard,
  Smartphone,
  Radio,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { PaymentTransaction } from '../payments.types';

type PaymentMethodsAnalyticsProps = {
  transactions: PaymentTransaction[];
};

type MethodStats = {
  key: string;
  name: string;
  count: number;
  volume: number;
  sharePercent: number;
  successRate: number;
  avgFeePercent: number;
  icon: FC<{ className?: string }>;
  colorClass: string;
  barColor: string;
};

const PaymentMethodsAnalytics: FC<PaymentMethodsAnalyticsProps> = ({ transactions }) => {
  const { t, locale } = useTranslation();

  const stats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0) || 1;
    const groups: Record<
      string,
      { count: number; volume: number; success: number; fee: number }
    > = {
      credit_card: { count: 0, volume: 0, success: 0, fee: 0 },
      apple_pay: { count: 0, volume: 0, success: 0, fee: 0 },
      mada: { count: 0, volume: 0, success: 0, fee: 0 },
      digital_wallet: { count: 0, volume: 0, success: 0, fee: 0 },
      fawry: { count: 0, volume: 0, success: 0, fee: 0 },
    };

    for (const t of transactions) {
      const g = groups[t.paymentMethod] || groups.credit_card;
      g.count += 1;
      g.volume += t.amount;
      g.fee += t.fee;
      if (t.status === 'successful') g.success += 1;
    }

    const items: MethodStats[] = [
      {
        key: 'mada',
        name: 'Mada Debit Network (GCC)',
        count: groups.mada.count,
        volume: groups.mada.volume,
        sharePercent: Math.round((groups.mada.volume / totalVolume) * 100),
        successRate: groups.mada.count > 0 ? Math.round((groups.mada.success / groups.mada.count) * 100) : 100,
        avgFeePercent: 1.75,
        icon: CreditCard,
        colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        barColor: 'bg-emerald-500',
      },
      {
        key: 'credit_card',
        name: 'Credit / Debit Cards (Visa & Mastercard)',
        count: groups.credit_card.count,
        volume: groups.credit_card.volume,
        sharePercent: Math.round((groups.credit_card.volume / totalVolume) * 100),
        successRate: groups.credit_card.count > 0 ? Math.round((groups.credit_card.success / groups.credit_card.count) * 100) : 100,
        avgFeePercent: 2.65,
        icon: CreditCard,
        colorClass: 'text-primary bg-primary/10 border-primary/20',
        barColor: 'bg-primary',
      },
      {
        key: 'apple_pay',
        name: 'Apple Pay & Google Pay',
        count: groups.apple_pay.count,
        volume: groups.apple_pay.volume,
        sharePercent: Math.round((groups.apple_pay.volume / totalVolume) * 100),
        successRate: groups.apple_pay.count > 0 ? Math.round((groups.apple_pay.success / groups.apple_pay.count) * 100) : 100,
        avgFeePercent: 2.25,
        icon: Smartphone,
        colorClass: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
        barColor: 'bg-sky-500',
      },
      {
        key: 'digital_wallet',
        name: 'Mobile Wallets (Vodafone Cash & STC Pay)',
        count: groups.digital_wallet.count,
        volume: groups.digital_wallet.volume,
        sharePercent: Math.round((groups.digital_wallet.volume / totalVolume) * 100),
        successRate: groups.digital_wallet.count > 0 ? Math.round((groups.digital_wallet.success / groups.digital_wallet.count) * 100) : 100,
        avgFeePercent: 2.0,
        icon: Smartphone,
        colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        barColor: 'bg-amber-500',
      },
      {
        key: 'fawry',
        name: 'Fawry & Cash POS Outlets',
        count: groups.fawry.count,
        volume: groups.fawry.volume,
        sharePercent: Math.round((groups.fawry.volume / totalVolume) * 100),
        successRate: groups.fawry.count > 0 ? Math.round((groups.fawry.success / groups.fawry.count) * 100) : 100,
        avgFeePercent: 1.5,
        icon: Radio,
        colorClass: 'text-teal-600 bg-teal-500/10 border-teal-500/20',
        barColor: 'bg-teal-600',
      },
    ];

    return items;
  }, [transactions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t('payments.methodsShareTitle') || 'Payment Channels & Clearing Share'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('payments.methodsShareSubtitle') ||
                'Comparative distribution, fee structure, and clearing velocity across networks'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-subtle border border-border text-[11px] font-mono text-muted-foreground">
            Multi-Tenant Aggregation
          </span>
        </div>

        {/* Stacked Visual Bar */}
        <div className="h-3 w-full rounded-full bg-surface-subtle overflow-hidden flex mb-6">
          {stats.map((s) => (
            <div
              key={s.key}
              style={{ width: `${Math.max(s.sharePercent, 3)}%` }}
              className={`${s.barColor} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
              title={`${s.name}: ${s.sharePercent}%`}
            />
          ))}
        </div>

        {/* Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="p-4 rounded-2xl border border-border/80 bg-surface-subtle/50 hover:bg-card hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${s.colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {s.count} transactions
                        </span>
                      </div>
                    </div>

                    <span className="font-mono font-black text-sm text-foreground">
                      {s.sharePercent}%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono border-t border-border/50 pt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Volume Cleared:</span>
                      <span className="font-bold text-foreground">
                        {formatCurrency(s.volume)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-bold text-success-text">
                        {s.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Processing Overhead:</span>
                      <span className="text-muted-foreground">
                        ~{s.avgFeePercent}% interchange
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentMethodsAnalytics);
