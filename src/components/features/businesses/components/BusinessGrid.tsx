import { memo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardDrive,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import type { Business, BusinessActionModalState } from '../businesses.types';

type BusinessGridProps = {
  businesses: Business[];
  onActionSelect: (action: BusinessActionModalState) => void;
};

const PLAN_BADGES: Record<string, string> = {
  Enterprise: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  Pro: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  Starter: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
};

const STATUS_BADGES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: {
    bg: 'bg-success-bg border-success/30 text-success-text',
    text: 'text-success-text',
    dot: 'bg-success',
    label: 'Active',
  },
  trial: {
    bg: 'bg-info-bg border-info/30 text-info-text',
    text: 'text-info-text',
    dot: 'bg-info',
    label: 'In Trial',
  },
  suspended: {
    bg: 'bg-destructive-bg border-destructive/30 text-destructive-text',
    text: 'text-destructive-text',
    dot: 'bg-destructive',
    label: 'Suspended',
  },
  disabled: {
    bg: 'bg-muted border-border text-muted-foreground',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Disabled',
  },
  pending: {
    bg: 'bg-warning-bg border-warning/30 text-warning-text',
    text: 'text-warning-text',
    dot: 'bg-warning',
    label: 'Pending',
  },
};

const BusinessGrid: FC<BusinessGridProps> = ({ businesses, onActionSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {businesses.map((b) => {
        const statusCfg = STATUS_BADGES[b.status] || STATUS_BADGES.active;
        const planStyle = PLAN_BADGES[b.plan] || PLAN_BADGES.Starter;
        const storagePercent = Math.round((b.storageUsedGb / b.storageLimitGb) * 100);

        const initials = b.name
          .split(' ')
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div
            key={b.id}
            onClick={() => navigate(`/businesses/${b.id}`)}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-ambient cursor-pointer"
          >
            <div>
              {/* Card Header: Badges & Actions */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-[10px] font-extrabold border ${statusCfg.bg}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                    <span>{statusCfg.label}</span>
                  </span>

                  <span
                    className={`px-2 py-0.2 rounded-pill text-[9px] font-extrabold border font-mono ${planStyle}`}
                  >
                    {b.plan}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionSelect({ type: 'impersonate', business: b });
                    }}
                    className="p-1 rounded-lg hover:bg-primary/10 text-primary transition"
                    title="Impersonate Tenant as Admin"
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/businesses/${b.id}`);
                    }}
                    className="p-1 rounded-lg hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Business Identity */}
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 font-black text-sm group-hover:scale-105 transition-transform">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {b.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {b.category} • {b.city}, {b.countryCode}
                  </p>
                  <p className="text-[10px] font-mono text-primary/80 truncate mt-0.5">
                    {b.subdomain}.mot7km.store
                  </p>
                </div>
              </div>

              {/* Owner Info Box */}
              <div className="mt-3.5 p-2 rounded-xl bg-surface-subtle/70 border border-border/60 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground truncate">{b.owner.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{b.owner.role}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono block truncate mt-0.5">
                  {b.owner.email}
                </span>
              </div>

              {/* Scale & Revenue Stats */}
              <div className="grid grid-cols-3 gap-2 my-3 text-center">
                <div className="p-2 rounded-lg bg-surface-subtle/50 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block">MRR</span>
                  <span className="text-xs font-black text-foreground font-mono tabular-nums">
                    ${b.mrr}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-surface-subtle/50 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block">Branches</span>
                  <span className="text-xs font-black text-foreground font-mono tabular-nums">
                    {b.branchesCount}/{b.branchesLimit}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-surface-subtle/50 border border-border/40">
                  <span className="text-[10px] text-muted-foreground block">Staff</span>
                  <span className="text-xs font-black text-foreground font-mono tabular-nums">
                    {b.employeesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Storage Quota Bar */}
            <div className="pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <HardDrive className="h-3 w-3" />
                  <span>Storage Quota</span>
                </span>
                <span className="font-bold text-foreground">
                  {b.storageUsedGb} / {b.storageLimitGb} GB ({storagePercent}%)
                </span>
              </div>

              <div className="h-1.5 w-full rounded-pill bg-surface-subtle overflow-hidden ring-1 ring-border/50">
                <div
                  className={`h-full rounded-pill transition-all ${
                    storagePercent > 85
                      ? 'bg-destructive'
                      : storagePercent > 65
                      ? 'bg-warning'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(BusinessGrid);
