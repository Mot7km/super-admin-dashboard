import { Building2, DollarSign, Server, Sparkles, TrendingUp } from 'lucide-react';

type LoginShowcaseProps = {
  badge: string;
  featureTitle: string;
  featureSub: string;
  tenantsTitle: string;
  tenantsGrowth: string;
  mrrTitle: string;
  mrrBadge: string;
  systemHealthTitle: string;
  systemHealthSub: string;
  systemHealthBadge: string;
};

const LoginShowcasePanel = ({
  badge,
  featureTitle,
  featureSub,
  tenantsTitle,
  tenantsGrowth,
  mrrTitle,
  mrrBadge,
  systemHealthTitle,
  systemHealthSub,
  systemHealthBadge,
}: LoginShowcaseProps) => {
  return (
    <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-card to-surface-subtle p-8 sm:p-10 shadow-ambient space-y-8 backdrop-blur-xl">
        {/* Background ambient glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-pill bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-foreground xl:text-3xl leading-snug">
            {featureTitle}
          </h2>

          <p className="text-xs text-muted-foreground leading-relaxed sm:text-sm max-w-xl">
            {featureSub}
          </p>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {/* Active SaaS Tenants */}
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-md space-y-2 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span>{tenantsTitle}</span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-foreground">
              142 <span className="text-xs font-normal text-muted-foreground">Tenants</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-success-text bg-success-bg px-2 py-0.5 rounded-pill w-fit">
              <TrendingUp className="h-3 w-3" />
              <span>{tenantsGrowth}</span>
            </div>
          </div>

          {/* Global Platform MRR */}
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-md space-y-2 hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span>{mrrTitle}</span>
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight text-foreground">
              {mrrBadge}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-pill w-fit">
              <span>ARR: $1.54M</span>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="col-span-2 rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-md flex items-center justify-between hover:border-success/40 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success-text font-bold ring-1 ring-success/20">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <span>{systemHealthTitle}</span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-surface px-2 py-0.5 rounded border border-border">
                    AWS + Cloudflare Global Edge
                  </span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{systemHealthSub}</p>
              </div>
            </div>
            <span className="rounded-pill bg-success-bg px-3 py-1 text-xs font-bold text-success-text border border-success/20 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>{systemHealthBadge}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginShowcasePanel;