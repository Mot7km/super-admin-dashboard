export type IntegrationCategory = 'all' | 'payment' | 'messaging' | 'cloud' | 'webhooks';

export type IntegrationStatus = 'connected' | 'degraded' | 'sandbox' | 'disconnected';

export type IntegrationEnvironment = 'production' | 'sandbox';

export interface IntegrationItem {
  id: string;
  name: string;
  providerKey: 'stripe' | 'moyasar' | 'tap' | 'fcm' | 'twilio' | 'resend' | 's3' | 'google_maps' | 'zatca';
  category: 'payment' | 'messaging' | 'cloud' | 'webhooks';
  descriptionEn: string;
  descriptionAr: string;
  status: IntegrationStatus;
  environment: IntegrationEnvironment;
  healthScore: number; // 0-100
  latencyMs: number;
  monthlyUsage: number;
  monthlyLimit: number | null;
  usageUnit: string;
  maskedKey: string;
  webhookUrl: string;
  lastSyncAt: string;
  isCustomWebhook?: boolean;
}

export interface WebhookEventLog {
  id: string;
  event: string;
  targetProvider: string;
  endpoint: string;
  statusCode: number;
  status: 'success' | 'failed' | 'retrying';
  timestamp: string;
  durationMs: number;
  payloadSummary: string;
}

export interface IntegrationsKpiSummary {
  totalConnected: number;
  inSandbox: number;
  systemHealthIndex: number;
  monthlyPaymentVolumeUsd: number;
  monthlyMessagesDispatched: number;
}
