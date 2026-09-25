export type NotificationChannel = 'in_app' | 'push' | 'email';

export type NotificationType =
  | 'maintenance'
  | 'security_alert'
  | 'system_update'
  | 'promotional'
  | 'general_info';

export type AudienceType =
  | 'all_businesses'
  | 'specific_business'
  | 'by_plan'
  | 'by_role'
  | 'specific_users';

export type BroadcastStatus = 'sent' | 'scheduled' | 'draft' | 'cancelled';

export type TargetAudienceConfig = {
  type: AudienceType;
  businessIds?: string[];
  plans?: ('Free' | 'Basic' | 'Pro' | 'Enterprise')[];
  roles?: ('Business Owners' | 'Branch Managers' | 'Cashiers' | 'Support Staff')[];
  userEmails?: string[];
  estimatedBusinessesCount: number;
  estimatedUsersCount: number;
};

export type NotificationBroadcast = {
  id: string; // e.g. 'BRD-4902'
  title: string;
  message: string;
  type: NotificationType;
  channels: NotificationChannel[];
  audience: TargetAudienceConfig;
  status: BroadcastStatus;
  scheduledAt?: string; // ISO
  sentAt?: string; // ISO
  createdAt: string; // ISO
  authorName: string;
  actionButton?: {
    label: string;
    url: string;
  };
  metrics: {
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    clickCount: number;
  };
};

export type NotificationFilterState = {
  search: string;
  channel: 'all' | NotificationChannel;
  type: 'all' | NotificationType;
  status: 'all' | BroadcastStatus;
  sortBy: 'newest' | 'oldest' | 'reach';
};

export type NotificationModalAction =
  | { type: 'confirm_dispatch'; broadcast: Partial<NotificationBroadcast> }
  | { type: 'inspect_broadcast'; broadcast: NotificationBroadcast }
  | { type: 'cancel_scheduled'; broadcast: NotificationBroadcast }
  | null;
