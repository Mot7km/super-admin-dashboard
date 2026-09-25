import { memo, useState, useRef, useEffect, type FC } from 'react';
import {
  Lock,
  Send,
  Paperclip,
  Building2,
  ExternalLink,
  Download,
  FileText,
  FileCode,
  Image as ImageIcon,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  SupportTicket,
  TicketStatus,
  TicketPriority,
  SupportAdminStaff
} from '../support.types';

type TicketDetailPaneProps = {
  ticket: SupportTicket;
  staff: SupportAdminStaff[];
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdatePriority: (ticketId: string, priority: TicketPriority) => void;
  onReassign: (ticketId: string, staffId: string) => void;
  onSendMessage: (ticketId: string, body: string, isInternal: boolean) => void;
};

const CANNED_MACROS = [
  {
    title: 'Investigating Infrastructure',
    text: 'We are actively investigating the network route and upstream payment gateway logs for your tenant cluster. We will follow up shortly.',
  },
  {
    title: 'Cache & Quotas Refreshed',
    text: 'We have manually cleared your tenant cache and synchronized your latest subscription quota. Please hard refresh your dashboard (Ctrl + F5).',
  },
  {
    title: 'Awaiting Diagnostic Details',
    text: 'Could you please confirm the exact terminal hardware ID and attach the latest error screenshot so we can isolate the failure?',
  },
];

const TicketDetailPane: FC<TicketDetailPaneProps> = ({
  ticket,
  staff,
  onUpdateStatus,
  onUpdatePriority,
  onReassign,
  onSendMessage,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.messages]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSendMessage(ticket.id, replyText.trim(), isInternalNote);
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4 text-sky-400" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-rose-400" />;
      case 'log':
        return <FileCode className="h-4 w-4 text-amber-400" />;
      default:
        return <Paperclip className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* 1. Header Toolbar: ID, Status, Priority, Reassign, Actions */}
      <div className="p-4 border-b border-border/70 bg-card/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-foreground bg-surface-subtle px-2.5 py-1 rounded-lg border border-border">
              {ticket.id}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
              {ticket.category}
            </span>
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              value={ticket.status}
              aria-label="Ticket Status"
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
              className="h-8 pl-3 pr-7 rtl:pl-3 rtl:pr-7 rounded-lg bg-surface-subtle border border-border text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="open">🟢 {t('support.status.open')}</option>
              <option value="pending">🟡 {t('support.status.pending')}</option>
              <option value="resolved">✅ {t('support.status.resolved')}</option>
              <option value="closed">⚪ {t('support.status.closed')}</option>
            </select>
          </div>

          {/* Priority Selector */}
          <div className="relative">
            <select
              value={ticket.priority}
              aria-label="Ticket Priority"
              onChange={(e) => onUpdatePriority(ticket.id, e.target.value as TicketPriority)}
              className="h-8 pl-3 pr-7 rtl:pl-3 rtl:pr-7 rounded-lg bg-surface-subtle border border-border text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="critical">🚨 {t('support.priority.critical')}</option>
              <option value="high">🔥 {t('support.priority.high')}</option>
              <option value="medium">⚡ {t('support.priority.medium')}</option>
              <option value="low">🌱 {t('support.priority.low')}</option>
            </select>
          </div>
        </div>

        {/* Right Tools: Reassign Admin & Tenant Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface-subtle px-2.5 py-1 rounded-lg border border-border">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <select
              value={ticket.assignedTo?.id || 'unassigned'}
              aria-label="Assign Operator"
              onChange={(e) => onReassign(ticket.id, e.target.value)}
              className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="unassigned">{t('support.filter.unassigned')}</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <a
            href={`/businesses/${ticket.businessId}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium text-foreground hover:bg-surface-subtle transition-all"
            title="Open Business Profile"
          >
            <Building2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">{ticket.businessName}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* 2. Customer & Subject Banner */}
      <div className="p-4 border-b border-border/60 bg-card/30">
        <h3 className="text-base sm:text-lg font-black text-foreground mb-2 leading-snug">
          {ticket.subject}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Customer info */}
          <div className="flex items-center gap-2.5">
            {ticket.customerContact.avatar ? (
              <img
                src={ticket.customerContact.avatar}
                alt={ticket.customerContact.name}
                className="w-8 h-8 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {ticket.customerContact.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{ticket.customerContact.name}</span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  ({ticket.customerContact.role})
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {ticket.customerContact.email}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-subtle border border-border text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Thread Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[460px] no-scrollbar">
        {ticket.messages.map((msg) => {
          const isStaff = msg.sender.isStaff;
          const isInternal = msg.isInternal;
          const msgDate = new Date(msg.timestamp).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isInternal
                  ? 'items-center my-3'
                  : isStaff
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              {/* Internal Note Banner Layout */}
              {isInternal ? (
                <div className="w-full max-w-2xl rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-500 font-mono">
                      <Lock className="h-3.5 w-3.5" />
                      {t('support.thread.internalStaffNote')}
                    </span>
                    <span className="text-[11px] font-mono text-amber-600/80 dark:text-amber-400/80">
                      {msg.sender.name} • {msgDate}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-100 leading-relaxed whitespace-pre-wrap">
                    {msg.body}
                  </p>
                </div>
              ) : (
                /* Regular Chat Bubble */
                <div
                  className={`max-w-xl rounded-2xl p-4 shadow-sm ${
                    isStaff
                      ? 'bg-primary text-primary-foreground rounded-tr-xs rtl:rounded-tr-2xl rtl:rounded-tl-xs'
                      : 'bg-card border border-border/80 text-foreground rounded-tl-xs rtl:rounded-tl-2xl rtl:rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-1.5 opacity-90">
                    <span className="font-bold flex items-center gap-1.5">
                      {msg.sender.name}
                      {isStaff && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-primary-foreground/20 font-mono">
                          STAFF
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[10px]">{msgDate}</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.body}
                  </p>

                  {/* Inline Message Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-current/20 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/10 dark:bg-black/20 text-xs font-mono"
                        >
                          {getAttachmentIcon(att.type)}
                          <span className="truncate max-w-[140px] font-bold">{att.name}</span>
                          <span className="text-[10px] opacity-75">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Global Ticket Attachments Dock (if any) */}
      {ticket.attachments.length > 0 && (
        <div className="px-4 py-2.5 border-t border-border/60 bg-surface-subtle/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-muted-foreground font-bold shrink-0 flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            {t('support.thread.caseAttachments')}:
          </span>
          {ticket.attachments.map((att) => (
            <div
              key={att.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-card border border-border/80 text-foreground text-xs shrink-0 hover:border-primary/40 transition-colors"
            >
              {getAttachmentIcon(att.type)}
              <span className="font-mono text-xs font-medium truncate max-w-[120px]">{att.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono">({att.size})</span>
              <a
                href={att.url}
                download={att.name}
                className="text-muted-foreground hover:text-primary transition-colors ml-1 p-0.5"
                title="Download Attachment"
              >
                <Download className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 5. Rich Reply Composer with Public vs Internal Switcher */}
      <div className="p-3.5 sm:p-4 border-t border-border/70 bg-card/70">
        {/* Switcher & Canned Macros */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {/* Public vs Internal Note Toggle */}
          <div className="flex items-center rounded-xl bg-surface-subtle p-0.5 border border-border text-xs">
            <button
              type="button"
              onClick={() => setIsInternalNote(false)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                !isInternalNote
                  ? 'bg-card text-foreground shadow-2xs font-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('support.composer.publicReply')}
            </button>
            <button
              type="button"
              onClick={() => setIsInternalNote(true)}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                isInternalNote
                  ? 'bg-amber-500 text-slate-950 shadow-2xs font-black'
                  : 'text-muted-foreground hover:text-amber-500'
              }`}
            >
              <Lock className="h-3 w-3" />
              {t('support.composer.internalNote')}
            </button>
          </div>

          {/* Canned Macro Quick Responses */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground hidden sm:inline">{t('support.composer.macros')}:</span>
            <select
              aria-label="Canned Macros"
              onChange={(e) => {
                if (e.target.value) {
                  setReplyText((prev) => (prev ? `${prev}\n\n${e.target.value}` : e.target.value));
                  e.target.value = '';
                }
              }}
              className="h-7 px-2.5 rounded-lg bg-surface-subtle border border-border text-xs text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
            >
              <option value="">{t('support.composer.selectMacro')}</option>
              {CANNED_MACROS.map((m, idx) => (
                <option key={idx} value={m.text}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isInternalNote
                ? t('support.composer.internalPlaceholder')
                : t('support.composer.publicPlaceholder')
            }
            rows={3}
            className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 transition-all resize-none ${
              isInternalNote
                ? 'bg-amber-500/5 border-amber-500/40 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-amber-600/50'
                : 'bg-surface-subtle border-border/80 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground'
            }`}
          />

          {/* Action Row Inside Composer */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
              Ctrl + Enter {t('support.composer.toSend')}
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={!replyText.trim()}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isInternalNote
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              }`}
            >
              <span>{isInternalNote ? t('support.composer.postNote') : t('support.composer.sendReply')}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TicketDetailPane);
