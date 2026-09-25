export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'maintenance';

export type NodeType =
  | 'api_cluster'
  | 'database'
  | 'cache'
  | 'workers'
  | 'websockets'
  | 'storage_gateway';

export interface ServerNode {
  id: string;
  name: string;
  type: NodeType;
  region: string;
  status: NodeStatus;
  uptime: string;
  latencyMs: number;
  cpuPercent: number;
  memoryPercent: number;
  detailsEn: string;
  detailsAr: string;
  activeInstances: number;
  lastHealthCheck: string;
}

export interface ResourceMetric {
  id: string;
  labelEn: string;
  labelAr: string;
  currentPercent: number;
  displayValue: string;
  status: 'normal' | 'elevated' | 'critical';
  subTextEn: string;
  subTextAr: string;
}

export interface SystemIncident {
  id: string;
  titleEn: string;
  titleAr: string;
  severity: 'info' | 'resolved' | 'warning';
  timestamp: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface SystemHealthKpis {
  uptimePercent: number;
  avgLatencyMs: number;
  activeDbConnections: number;
  maxDbConnections: number;
  jobQueueThroughput: number;
  failedJobsCount: number;
}
