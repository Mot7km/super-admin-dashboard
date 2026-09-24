import { QrCode, Sparkles, Star, TrendingUp } from 'lucide-react';

type LoginShowcaseProps = {
  badge: string;
  featureTitle: string;
  featureSub: string;
  qrViewsTitle: string;
  qrViewsGrowth: string;
  ratingTitle: string;
  ratingBadge: string;
  kitchenTitle: string;
  kitchenSub: string;
  kitchenBadge: string;
};

const LoginShowcasePanel = ({
  badge,
  featureTitle,
  featureSub,
  qrViewsTitle,
  qrViewsGrowth,
  ratingTitle,
  ratingBadge,
  kitchenTitle,
  kitchenSub,
  kitchenBadge,
}: LoginShowcaseProps) => {
  return (
    <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--surface)] via-[var(--card)] to-[var(--elevated)] p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] xl:text-3xl leading-snug">{featureTitle}</h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed sm:text-sm">{featureSub}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)]/80 p-4 shadow-md backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>{qrViewsTitle}</span>
              <QrCode className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">24,850</div>
            <span className="text-[11px] font-semibold text-[var(--primary)]">{qrViewsGrowth}</span>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--surface)]/80 p-4 shadow-md backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
              <span>{ratingTitle}</span>
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">4.9 ★</div>
            <span className="text-[11px] font-semibold text-emerald-500">{ratingBadge}</span>
          </div>

          <div className="col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--surface)]/80 p-4 shadow-md backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[var(--text-primary)]">{kitchenTitle}</h4>
                <p className="text-[11px] text-[var(--text-muted)]">{kitchenSub}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-500 animate-pulse">{kitchenBadge}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginShowcasePanel;