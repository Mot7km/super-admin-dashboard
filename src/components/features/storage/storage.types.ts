export interface StorageCategoryBreakdown {
  imagesGB: number;
  imagesPercent: number;
  documentsGB: number;
  documentsPercent: number;
  backupsGB: number;
  backupsPercent: number;
  logsGB: number;
  logsPercent: number;
}

export interface PlatformStorageOverview {
  totalCapacityGB: number;
  usedCapacityGB: number;
  availableCapacityGB: number;
  usagePercentage: number;
  monthlyGrowthGB: number;
  criticalTenantsCount: number;
  breakdown: StorageCategoryBreakdown;
}

export type StorageQuotaStatus = 'normal' | 'warning' | 'critical';

export interface BusinessStorageRecord {
  businessId: string;
  businessName: string;
  businessCode: string;
  planName: string;
  usedGB: number;
  quotaGB: number;
  usagePercent: number;
  status: StorageQuotaStatus;
  fileCount: number;
  categoryBreakdown: {
    imagesGB: number;
    documentsGB: number;
    backupsGB: number;
    logsGB: number;
  };
  lastUploadAt: string;
}

export interface StorageFilterState {
  search: string;
  status: 'all' | StorageQuotaStatus;
  plan: string;
}
