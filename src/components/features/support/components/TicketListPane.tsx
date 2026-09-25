import { memo, type FC } from 'react';
import {
  Paperclip,
  MessageSquare,
  Building2,
  CheckCircle2,
  Search,
  UserCheck
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SupportTicket, TicketPriority, TicketStatus } from '../support.types';

type TicketListPaneProps = {
  tickets: SupportTicket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: SupportTicket) => void;
};

const TicketListPane: FC<TicketListPaneProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const getPriorityBadge = (priority: TicketPriority, isBreached?: boolean) => {
    if (isBreached) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-destructive-bg text-destructive-text border border-destructive-text/30">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
          {t('support.kpi.criticalUrgent')}
        </span>
      );
    }
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            {t('support.priority.critical')}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {t('support.priority.high')}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-500 border border-sky-500/30">
            {t('support.priority.medium')}
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {t('support.priority.low')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {t('support.status.open')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
            {t('support.status.pending')}
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t('support.status.resolved')}
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {t('support.status.closed')}
          </span>
        );
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-12 text-center h-full flex flex-col items-center justify-center">
        <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border/80 text-muted-foreground mb-3 shadow-inner">
          <Search className="h-7 w-7 opacity-60" />
        </div>
        <h4 className="text-sm font-bold text-foreground mb-1">{t('support.table.noTicketsFound')}</h4>
        <p className="text-xs text-muted-foreground max-w-xs">{t('support.table.noTicketsDesc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-md flex flex-col h-full">
      {/* Pane Subheader */}
      <div className="p-3.5 border-b border-border/70 bg-card/40 flex items-center justify-between text-xs font-bold text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{t('support.pane.triageQueue')}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-mono text-[10px]">
            {tickets.length}
          </span>
        </div>
        <span className="text-[11px] font-normal">{t('support.pane.clickToInspect')}</span>
      </div>

      {/* Ticket List Items */}
      <div className="overflow-y-auto divide-y divide-border/60 max-h-[720px] no-scrollbar">
        {tickets.map((ticket) => {
          const isSelected = ticket.id === selectedTicketId;
          const lastMessage = ticket.messages[ticket.messages.length - 1];

          return (
            <div
              key={ticket.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectTicket(ticket)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTicket(ticket)}
              className={`group relative p-4 transition-all duration-150 cursor-pointer select-none text-left rtl:text-right ${
                isSelected
                  ? 'bg-primary/5 dark:bg-primary/10 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary shadow-xs'
                  : 'hover:bg-surface-subtle/70'
              }`}
            >
              {/* Header: ID, Priority, Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-black text-foreground">{ticket.id}</span>
                  {getPriorityBadge(ticket.priority, ticket.isSlaBreached)}
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusBadge(ticket.status)}
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {formatTime(ticket.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1.5">
                {ticket.subject}
              </h4>

              {/* Snippet from latest message */}
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                {lastMessage?.body || 'No messages recorded yet.'}
              </p>

              {/* Footer Meta: Business, Contact, Assignee, Counter */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-foreground truncate max-w-[120px]">{ticket.businessName}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-surface-subtle font-mono text-muted-foreground">
                    {ticket.businessPlan}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 font-mono text-[11px]">
                  {ticket.assignedTo ? (
                    <span
                      title={`Assigned to ${ticket.assignedTo.name}`}
                      className="inline-flex items-center gap-1 text-primary"
                    >
                      <UserCheck className="h-3 w-3" />
                      <span className="truncate max-w-[80px]">{ticket.assignedTo.name.split(' ')[0]}</span>
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold">{t('support.filter.unassigned')}</span>
                  )}

                  {ticket.attachments.length > 0 && (
                    <span className="flex items-center gap-0.5 text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      <span>{ticket.attachments.length}</span>
                    </span>
                  )}

                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{ticket.messages.length}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(TicketListPane);
