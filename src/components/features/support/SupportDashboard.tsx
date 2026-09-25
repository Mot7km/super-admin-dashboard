import { useState, useMemo, type FC } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { INITIAL_SUPPORT_TICKETS, SUPPORT_ADMIN_STAFF } from './support.mock';
import type {
  SupportTicket,
  SupportFilterState,
  SupportModalAction,
  TicketStatus,
  TicketPriority
} from './support.types';
import SupportKpiStrip from './components/SupportKpiStrip';
import SupportFilterBar from './components/SupportFilterBar';
import TicketListPane from './components/TicketListPane';
import TicketDetailPane from './components/TicketDetailPane';
import { SupportActionModals } from './components/SupportActionModals';
import { CheckCircle2, LifeBuoy } from 'lucide-react';

const INITIAL_FILTERS: SupportFilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  business: 'all',
  assignedAdmin: 'all',
  sortBy: 'urgency',
  viewLayout: 'split',
};

export const SupportDashboard: FC = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [staff] = useState(SUPPORT_ADMIN_STAFF);
  const [filters, setFilters] = useState<SupportFilterState>(INITIAL_FILTERS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [modalAction, setModalAction] = useState<SupportModalAction>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & sort logic
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Search
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchId = ticket.id.toLowerCase().includes(q);
          const matchSubject = ticket.subject.toLowerCase().includes(q);
          const matchBusiness = ticket.businessName.toLowerCase().includes(q);
          const matchContact = ticket.customerContact.name.toLowerCase().includes(q);
          const matchCategory = ticket.category.toLowerCase().includes(q);
          if (!matchId && !matchSubject && !matchBusiness && !matchContact && !matchCategory) {
            return false;
          }
        }

        // Status
        if (filters.status !== 'all' && ticket.status !== filters.status) {
          return false;
        }

        // Priority
        if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
          return false;
        }

        // Category
        if (filters.category !== 'all' && ticket.category !== filters.category) {
          return false;
        }

        // Business
        if (filters.business !== 'all' && ticket.businessId !== filters.business) {
          return false;
        }

        // Assigned Admin
        if (filters.assignedAdmin !== 'all') {
          if (filters.assignedAdmin === 'unassigned') {
            if (ticket.assignedTo) return false;
          } else if (ticket.assignedTo?.id !== filters.assignedAdmin) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'urgency') {
          const priorityWeights: Record<TicketPriority, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === 'sla') {
          return new Date(a.slaTargetAt).getTime() - new Date(b.slaTargetAt).getTime();
        }
        return 0;
      });
  }, [tickets, filters]);

  // Active selected ticket
  const activeTicket = useMemo(() => {
    return (
      tickets.find((t) => t.id === selectedTicketId) ||
      filteredTickets[0] ||
      tickets[0]
    );
  }, [tickets, selectedTicketId, filteredTickets]);

  // Handlers
  const handleSingleFilterChange = <K extends keyof SupportFilterState>(
    key: K,
    value: SupportFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    showToast(t('support.toast.filtersReset'));
  };

  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
    showToast(`${t('support.toast.statusUpdated')}: ${status.toUpperCase()}`);
  };

  const handleUpdatePriority = (ticketId: string, priority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t))
    );
    showToast(`${t('support.toast.priorityUpdated')}: ${priority.toUpperCase()}`);
  };

  const handleReassign = (ticketId: string, staffId: string) => {
    const targetStaff = staff.find((s) => s.id === staffId);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignedTo: targetStaff,
              updatedAt: new Date().toISOString(),
              messages: [
                ...t.messages,
                {
                  id: `msg_${Date.now()}`,
                  sender: {
                    id: 'adm_system',
                    name: 'System Bot',
                    email: 'bot@mot7km.com',
                    role: 'Audit Event',
                    isStaff: true,
                  },
                  body: `Ticket reassigned to ${targetStaff ? targetStaff.name : 'Unassigned pool'}.`,
                  timestamp: new Date().toISOString(),
                  isInternal: true,
                },
              ],
            }
          : t
      )
    );
    showToast(`${t('support.toast.reassignedTo')} ${targetStaff ? targetStaff.name : 'Unassigned'}`);
  };

  const handleSendMessage = (ticketId: string, body: string, isInternal: boolean) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: {
        id: 'adm_super',
        name: 'Alex Morgan',
        email: 'superadmin@mot7km.com',
        role: 'Global Platform Admin',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
        isStaff: true,
      },
      body,
      timestamp: new Date().toISOString(),
      isInternal,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              status: t.status === 'open' && !isInternal ? 'pending' : t.status,
              messages: [...t.messages, newMessage],
            }
          : t
      )
    );
    showToast(isInternal ? t('support.toast.internalNotePosted') : t('support.toast.replySent'));
  };

  const handleCreateTicket = (newTicketData: Partial<SupportTicket>) => {
    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdTicket: SupportTicket = {
      id: newId,
      subject: newTicketData.subject || 'Untitled Inquiry',
      category: newTicketData.category || 'technical',
      priority: newTicketData.priority || 'medium',
      status: 'open',
      businessId: newTicketData.businessId || 'biz_general',
      businessName: newTicketData.businessName || 'General Tenant',
      businessPlan: newTicketData.businessPlan || 'Basic',
      customerContact: newTicketData.customerContact || {
        name: 'Admin Dispatch',
        email: 'dispatch@mot7km.com',
        role: 'Dispatcher',
      },
      assignedTo: newTicketData.assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaTargetAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      messages: newTicketData.messages || [],
      attachments: [],
      tags: newTicketData.tags || ['General'],
    };

    setTickets([createdTicket, ...tickets]);
    setSelectedTicketId(newId);
    showToast(`${t('support.toast.ticketCreated')}: ${newId}`);
  };

  const handleConfirmResolve = (ticketId: string, note: string) => {
    handleUpdateStatus(ticketId, 'resolved');
    if (note.trim()) {
      handleSendMessage(ticketId, `RESOLVED: ${note.trim()}`, true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-card/95 text-foreground shadow-2xl backdrop-blur-md animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{t('support.page.title')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {t('support.page.badgeSovereign')}
              </span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t('support.page.subtitle')}</p>
        </div>
      </div>

      {/* KPI Support Telemetry Strip */}
      <SupportKpiStrip
        tickets={tickets}
        activeStatus={filters.status}
        activePriority={filters.priority}
        onSelectStatus={(status) => handleSingleFilterChange('status', status)}
        onSelectPriority={(priority) => handleSingleFilterChange('priority', priority)}
      />

      {/* Advanced Filter & Triage Bar */}
      <SupportFilterBar
        filters={filters}
        onFilterChange={handleSingleFilterChange}
        onResetFilters={handleResetFilters}
        tickets={tickets}
        staff={staff}
        onOpenCreateModal={() => setModalAction({ type: 'create_ticket' })}
      />

      {/* Master-Detail Triage Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Triage Queue (4 cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-5">
          <TicketListPane
            tickets={filteredTickets}
            selectedTicketId={activeTicket?.id}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
          />
        </div>

        {/* Right Column: Detailed Conversation & Action Thread (8 cols on desktop) */}
        <div className="lg:col-span-8 xl:col-span-7">
          {activeTicket ? (
            <TicketDetailPane
              ticket={activeTicket}
              staff={staff}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onReassign={handleReassign}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-16 text-center">
              <LifeBuoy className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-foreground mb-1">{t('support.pane.noTicketSelected')}</h3>
              <p className="text-xs text-muted-foreground">{t('support.pane.selectFromQueue')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      <SupportActionModals
        modalAction={modalAction}
        staff={staff}
        onClose={() => setModalAction(null)}
        onCreateTicket={handleCreateTicket}
        onConfirmReassign={handleReassign}
        onConfirmResolve={handleConfirmResolve}
      />
    </div>
  );
};

export default SupportDashboard;
