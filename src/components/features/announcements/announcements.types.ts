export type AnnouncementType = 'info' | 'warning' | 'critical' | 'success';

export type AnnouncementAudience = 'everyone' | 'plans' | 'businesses';

export interface SystemAnnouncement {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: AnnouncementType;
  audience: AnnouncementAudience;
  targetIds: string[];            // Plan IDs or Business IDs
  targetLabels?: string[];        // Visual chips (e.g. "Pro Business", "Café Nero")
  isActive: boolean;
  isDismissible: boolean;         // Can users dismiss this banner?
  isPinned: boolean;              // Stays at top of screen
  actionUrl?: string;             // Optional CTA link
  actionText?: string;
  actionTextAr?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  createdBy: string;
}

export interface ApiEndpointHealth {
  id: string;
  name: string;
  category: 'core' | 'pos' | 'payments' | 'orders' | 'inventory';
  baseUrl: string;
  version: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTimeMs: number;
  uptimePercentage: number;
  rateLimitPerMinute: number;
  rateLimitUsagePercent: number;
  corsAllowed: string[];
  lastChecked: string;
}

export type AnnouncementsTabId = 'announcements' | 'apiHealth';
