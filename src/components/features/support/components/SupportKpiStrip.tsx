import { memo, type FC } from 'react';
import {
  LifeBuoy,
  AlertOctagon,
  Clock,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SupportTicket, TicketStatus, TicketPriority } from '../support.types';

type SupportKpiStripProps = {
  tickets: SupportTicket[];
  activeStatus: 'all' | TicketStatus;
  activePriority: 'all' | TicketPriority;
  onSelectStatus: (status: 'all' | TicketStatus) => void;
  onSelectPriority: (priority: 'all' | TicketPriority) => void;
};

const SupportKpiStrip: FC<SupportKpiStripProps> = ({
  tickets,
  activeStatus,
  activePriority,
  onSelectStatus,
  onSelectPriority,
}) => {
  const { t } = useTranslation();

  const totalTickets = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const criticalCount = tickets.filter((t) => t.priority === 'critical' || t.isSlaBreached).length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const slaResolutionPercent = totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Active Queue Load */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelectStatus('open');
          onSelectPriority('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelectStatus('open');
            onSelectPriority('all');
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'open' && activePriority === 'all'
            ? 'bg-card border-primary/60 shadow-md ring-2 ring-primary/20'
            : 'bg-card/90 border-border/80 hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-extrabold text-primary font-mono">
            <TrendingUp className="h-3 w-3" />
            +14.2% Vol
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('support.kpi.openQueue')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-foreground font-mono tabular-nums tracking-tight">
              {openCount}
            </span>
            <span className="text-xs font-bold text-muted-foreground font-mono">
              {totalTickets} {t('support.kpi.totalTracked')}
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((openCount / Math.max(totalTickets, 1)) * 100, 100)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('support.kpi.firstResponseAvg')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            14m Avg FRT
          </span>
        </div>
      </div>

      {/* 2. Critical & Breached SLA */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelectPriority(activePriority === 'critical' ? 'all' : 'critical');
          onSelectStatus('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelectPriority(activePriority === 'critical' ? 'all' : 'critical');
            onSelectStatus('all');
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activePriority === 'critical'
            ? 'bg-card border-rose-500/60 shadow-md ring-2 ring-rose-500/20'
            : 'bg-card/90 border-border/80 hover:border-rose-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500/80 via-rose-500 to-amber-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-destructive-bg border border-destructive-text/20 text-destructive-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive-bg border border-destructive-text/20 px-2 py-0.5 text-[11px] font-extrabold text-destructive-text font-mono">
            {criticalCount > 0 ? (
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            ) : null}
            SLA Urgent
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('support.kpi.criticalUrgent')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400 font-mono tabular-nums tracking-tight">
              {criticalCount}
            </span>
            <span className="text-xs font-bold text-rose-500/90 font-mono">
              Immediate Attention
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((criticalCount / Math.max(totalTickets, 1)) * 100 * 2.5, 100)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('support.kpi.slaPolicy')}
          </span>
          <span className="font-mono font-black text-rose-500 dark:text-rose-400 tabular-nums">
            &lt; 60m Resolution Target
          </span>
        </div>
      </div>

      {/* 3. Pending on Customer / Technical Verify */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelectStatus(activeStatus === 'pending' ? 'all' : 'pending');
          onSelectPriority('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelectStatus(activeStatus === 'pending' ? 'all' : 'pending');
            onSelectPriority('all');
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'pending'
            ? 'bg-card border-amber-500/60 shadow-md ring-2 ring-amber-500/20'
            : 'bg-card/90 border-border/80 hover:border-amber-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400 to-yellow-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            Awaiting Actions
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('support.kpi.pendingFollowups')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono tabular-nums tracking-tight">
              {pendingCount}
            </span>
            <span className="text-xs font-bold text-amber-600/90 font-mono">
              In Verification
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((pendingCount / Math.max(totalTickets, 1)) * 100 * 2, 100)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('support.kpi.customerTurnaround')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            Active Threads
          </span>
        </div>
      </div>

      {/* 4. Resolved & CSAT Benchmark */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          onSelectStatus(activeStatus === 'resolved' ? 'all' : 'resolved');
          onSelectPriority('all');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSelectStatus(activeStatus === 'resolved' ? 'all' : 'resolved');
            onSelectPriority('all');
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer text-left rtl:text-right select-none ${
          activeStatus === 'resolved' || activeStatus === 'closed'
            ? 'bg-card border-emerald-500/60 shadow-md ring-2 ring-emerald-500/20'
            : 'bg-card/90 border-border/80 hover:border-emerald-500/40 hover:bg-card hover:-translate-y-1 hover:shadow-md'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 via-emerald-400 to-teal-500/40" />

        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-10 rounded-xl bg-success-bg border border-success-text/20 text-success-text flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-success-bg border border-success-text/20 px-2 py-0.5 text-[11px] font-extrabold text-success-text font-mono">
            CSAT 98.4%
          </span>
        </div>

        <div className="mt-3.5">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            {t('support.kpi.resolvedAndClosed')}
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl sm:text-3xl font-black text-success-text font-mono tabular-nums tracking-tight">
              {resolvedCount}
            </span>
            <span className="text-xs font-bold text-success-text/90 font-mono">
              {slaResolutionPercent}% Success SLA
            </span>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${slaResolutionPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs border-t border-border/50 pt-2.5">
          <span className="text-muted-foreground font-medium">
            {t('support.kpi.tenantSatisfaction')}
          </span>
          <span className="font-mono font-black text-foreground tabular-nums">
            High Quality Rating
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(SupportKpiStrip);
