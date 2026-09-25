import { memo, useState, type FC } from 'react';
import {
  Plus,
  Copy,
  Check,
  Calendar,
  Layers,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Coupon } from '../subscriptions.types';

type CouponsManagerProps = {
  coupons: Coupon[];
  onCreateCoupon: () => void;
  onToggleCouponStatus: (couponId: string) => void;
};

const CouponsManager: FC<CouponsManagerProps> = ({
  coupons,
  onCreateCoupon,
  onToggleCouponStatus,
}) => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalActive = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.redemptionsCount, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header with Stats & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-foreground tracking-tight">
              {t('subscriptions.couponsTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              {totalActive} {t('subscriptions.activePromos')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            {t('subscriptions.couponsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-xs font-mono border-x border-border/60 px-4">
            <div>
              <span className="text-muted-foreground block text-[10px]">TOTAL REDEEMED</span>
              <strong className="text-foreground text-sm font-black">{totalRedemptions}</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">CAMPAIGNS</span>
              <strong className="text-foreground text-sm font-black">{coupons.length}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateCoupon}
            className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            <span>{t('subscriptions.createCoupon')}</span>
          </button>
        </div>
      </div>

      {/* 2. Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {coupons.map((coupon) => {
          const isCopied = copiedId === coupon.id;
          const redemptionPct = Math.min(
            100,
            Math.round((coupon.redemptionsCount / coupon.maxRedemptions) * 100),
          );

          return (
            <div
              key={coupon.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-card shadow-sm hover:shadow-md ${
                coupon.isActive
                  ? 'border-border/80 hover:border-primary/50'
                  : 'border-border/50 opacity-60 bg-surface-subtle/50'
              }`}
            >
              <div>
                {/* Top: Code & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-surface-subtle border border-border text-sm font-black font-mono tracking-wider text-foreground select-all">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code, coupon.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition cursor-pointer"
                      title="Copy promo code"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => onToggleCouponStatus(coupon.id)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground transition"
                    title={coupon.isActive ? 'Deactivate promo' : 'Activate promo'}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Discount Badge & Value */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-emerald-500">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `$${coupon.discountValue} FLAT`}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {coupon.discountType}
                  </span>
                </div>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {coupon.description}
                </p>

                {/* Applicable Plans */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    <span>Valid:</span>
                  </span>
                  {coupon.validPlans.map((plan) => (
                    <span
                      key={plan}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-subtle border border-border text-foreground"
                    >
                      {plan}
                    </span>
                  ))}
                </div>

                {/* Redemption Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Redeemed</span>
                    <span className="font-bold text-foreground">
                      {coupon.redemptionsCount} / {coupon.maxRedemptions} ({redemptionPct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        redemptionPct >= 90
                          ? 'bg-amber-500'
                          : redemptionPct >= 100
                          ? 'bg-destructive'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${redemptionPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom: Expiry Date */}
              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3" />
                  <span>Expires: {coupon.expiresAt}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    coupon.isActive
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-surface-subtle text-muted-foreground'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Expired'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CouponsManager);
