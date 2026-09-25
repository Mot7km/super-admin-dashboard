import { useState, type FC } from 'react';
import {
  X,
  Plus,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  SupportModalAction,
  SupportTicket,
  SupportAdminStaff,
  TicketCategory,
  TicketPriority
} from '../support.types';

type SupportActionModalsProps = {
  modalAction: SupportModalAction;
  staff: SupportAdminStaff[];
  onClose: () => void;
  onCreateTicket: (newTicket: Partial<SupportTicket>) => void;
  onConfirmReassign: (ticketId: string, staffId: string) => void;
  onConfirmResolve: (ticketId: string, resolutionNote: string) => void;
};

const SAMPLE_BUSINESSES = [
  { id: 'biz_124', name: 'Al-Ahram Hospitality', plan: 'Enterprise' as const },
  { id: 'biz_102', name: 'Al-Baraka Retail', plan: 'Pro' as const },
  { id: 'biz_118', name: 'Golden Fork Gourmet', plan: 'Basic' as const },
  { id: 'biz_105', name: 'Nile Fresh Groceries', plan: 'Enterprise' as const },
  { id: 'biz_132', name: 'Cairo Tech Cafe', plan: 'Pro' as const },
  { id: 'biz_140', name: 'Express Burger Chain', plan: 'Enterprise' as const },
];

export const SupportActionModals: FC<SupportActionModalsProps> = ({
  modalAction,
  staff,
  onClose,
  onCreateTicket,
  onConfirmReassign,
  onConfirmResolve,
}) => {
  const { t } = useTranslation();

  // Create form state
  const [selectedBizId, setSelectedBizId] = useState(SAMPLE_BUSINESSES[0].id);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('technical');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assigneeId, setAssigneeId] = useState(staff[0]?.id || 'unassigned');
  const [initialMessage, setInitialMessage] = useState('');

  // Reassign state
  const [targetStaffId, setTargetStaffId] = useState(staff[0]?.id || '');

  // Resolve state
  const [resolutionNote, setResolutionNote] = useState('');

  if (!modalAction) return null;

  // 1. Create Ticket Modal
  if (modalAction.type === 'create_ticket') {
    const handleCreateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!subject.trim() || !initialMessage.trim()) return;

      const biz = SAMPLE_BUSINESSES.find((b) => b.id === selectedBizId) || SAMPLE_BUSINESSES[0];
      const assignedStaff = staff.find((s) => s.id === assigneeId);

      onCreateTicket({
        subject: subject.trim(),
        category,
        priority,
        status: 'open',
        businessId: biz.id,
        businessName: biz.name,
        businessPlan: biz.plan,
        customerContact: {
          name: 'Authorized Admin Dispatch',
          email: 'admin.dispatch@mot7km.com',
          role: 'Super Admin Representative',
        },
        assignedTo: assignedStaff,
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: {
              id: 'adm_dispatch',
              name: 'Super Admin Console',
              email: 'superadmin@mot7km.com',
              role: 'Global Platform Admin',
              isStaff: true,
            },
            body: initialMessage.trim(),
            timestamp: new Date().toISOString(),
            isInternal: false,
          },
        ],
        tags: [category.toUpperCase(), 'Sovereign Dispatch'],
      });
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border bg-card/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('support.modal.createTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('support.modal.createSubtitle')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Target Business */}
            <div>
              <label className="block font-bold text-foreground mb-1.5">
                {t('support.modal.targetBusiness')}
              </label>
              <select
                value={selectedBizId}
                onChange={(e) => setSelectedBizId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-foreground font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {SAMPLE_BUSINESSES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.plan} Plan)
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-bold text-foreground mb-1.5">
                {t('support.modal.ticketSubject')}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. POS terminal integration failure"
                className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  {t('support.filter.category')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-foreground font-medium focus:ring-2 focus:ring-primary/20"
                >
                  <option value="technical">Technical</option>
                  <option value="pos_hardware">POS Hardware</option>
                  <option value="billing">Billing & Tax</option>
                  <option value="account">Account Access</option>
                  <option value="feature_request">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  {t('support.filter.priority')}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-foreground font-medium focus:ring-2 focus:ring-primary/20"
                >
                  <option value="critical">🚨 Critical</option>
                  <option value="high">🔥 High</option>
                  <option value="medium">⚡ Medium</option>
                  <option value="low">🌱 Low</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">
                  {t('support.filter.assignedAdmin')}
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-foreground font-medium focus:ring-2 focus:ring-primary/20"
                >
                  <option value="unassigned">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Initial Message */}
            <div>
              <label className="block font-bold text-foreground mb-1.5">
                {t('support.modal.initialMessage')}
              </label>
              <textarea
                required
                rows={4}
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                placeholder="Provide incident diagnosis, steps, or inquiry details..."
                className="w-full p-3 rounded-xl bg-surface-subtle border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground font-medium"
              >
                {t('support.modal.cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t('support.modal.submitCreate')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Reassign Ticket Modal
  if (modalAction.type === 'reassign_ticket') {
    const ticket = modalAction.ticket;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>{t('support.modal.reassignTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Reassigning ticket <strong className="text-foreground">{ticket.id}</strong> ({ticket.subject}) to a specialized operator:
          </p>

          <div className="space-y-2 mb-5">
            {staff.map((s) => (
              <label
                key={s.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  targetStaffId === s.id
                    ? 'border-primary bg-primary/10 shadow-xs'
                    : 'border-border bg-surface-subtle hover:bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="staff_select"
                    checked={targetStaffId === s.id}
                    onChange={() => setTargetStaffId(s.id)}
                    className="text-primary focus:ring-primary/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{s.role}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-card border border-border text-muted-foreground">
                  {s.activeTicketsCount} active
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
              {t('support.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmReassign(ticket.id, targetStaffId);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {t('support.modal.confirmTransfer')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Resolve Ticket Modal
  if (modalAction.type === 'resolve_ticket') {
    const ticket = modalAction.ticket;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div
          className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>{t('support.modal.resolveTitle')}</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Closing and marking <strong className="text-foreground">{ticket.id}</strong> as successfully resolved. Enter root cause and deployment summary:
          </p>

          <textarea
            rows={3}
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="e.g. Proxy failover completed, POS cache reset verified by branch manager."
            className="w-full p-3 rounded-xl bg-surface-subtle border border-border text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500/20 mb-4 resize-none"
          />

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground">
              {t('support.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmResolve(ticket.id, resolutionNote);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow-sm hover:bg-emerald-400"
            >
              {t('support.modal.markResolved')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
