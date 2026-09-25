export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type TicketCategory =
  | 'technical'
  | 'billing'
  | 'account'
  | 'pos_hardware'
  | 'feature_request'
  | 'security';

export type TicketAttachment = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'log' | 'archive' | 'file';
  url: string;
  uploadedAt: string;
};

export type TicketMessageSender = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isStaff: boolean;
};

export type TicketMessage = {
  id: string;
  sender: TicketMessageSender;
  body: string;
  timestamp: string; // ISO
  isInternal: boolean; // True for internal private notes
  attachments?: TicketAttachment[];
};

export type SupportAdminStaff = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  activeTicketsCount: number;
};

export type SupportTicket = {
  id: string; // e.g. 'TCK-8902'
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  businessId: string;
  businessName: string;
  businessPlan: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  customerContact: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
  };
  assignedTo?: SupportAdminStaff;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  slaTargetAt: string; // ISO deadline
  isSlaBreached?: boolean;
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  tags: string[];
};

export type SupportFilterState = {
  search: string;
  status: 'all' | TicketStatus;
  priority: 'all' | TicketPriority;
  category: 'all' | TicketCategory;
  business: string; // 'all' or businessId
  assignedAdmin: string; // 'all', 'unassigned', or adminId
  sortBy: 'urgency' | 'newest' | 'oldest' | 'sla';
  viewLayout: 'split' | 'table';
};

export type SupportModalAction =
  | { type: 'create_ticket' }
  | { type: 'reassign_ticket'; ticket: SupportTicket }
  | { type: 'resolve_ticket'; ticket: SupportTicket }
  | null;
