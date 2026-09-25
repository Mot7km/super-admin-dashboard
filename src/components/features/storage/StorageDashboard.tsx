import { useState, useCallback, type FC } from 'react';
import {
  HardDrive,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  PlatformStorageOverview,
  BusinessStorageRecord,
} from './storage.types';
import {
  INITIAL_STORAGE_OVERVIEW,
  INITIAL_BUSINESS_STORAGES,
} from './storage.mock';

import { StorageKpiStrip } from './components/StorageKpiStrip';
import { StorageBreakdownCards } from './components/StorageBreakdownCards';
import { BusinessStorageTable } from './components/BusinessStorageTable';
import { AdjustQuotaModal } from './components/AdjustQuotaModal';

export const StorageDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [overview, setOverview] = useState<PlatformStorageOverview>(INITIAL_STORAGE_OVERVIEW);
  const [businesses, setBusinesses] = useState<BusinessStorageRecord[]>(INITIAL_BUSINESS_STORAGES);

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<BusinessStorageRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open Quota Modal
  const handleOpenAdjustQuota = useCallback((record: BusinessStorageRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  }, []);

  // Save new quota
  const handleSaveQuota = useCallback(
    (businessId: string, newQuotaGB: number) => {
      setBusinesses((prev) =>
        prev.map((b) => {
          if (b.businessId !== businessId) return b;
          const usagePercent = Math.round((b.usedGB / newQuotaGB) * 100);
          const status =
            usagePercent >= 90 ? 'critical' : usagePercent >= 70 ? 'warning' : 'normal';

          return {
            ...b,
            quotaGB: newQuotaGB,
            usagePercent,
            status,
          };
        })
      );

      // Recalculate critical count
      setOverview((prev) => {
        const nextCriticalCount = businesses.filter((b) => {
          if (b.businessId === businessId) {
            return (b.usedGB / newQuotaGB) >= 0.8;
          }
          return (b.usedGB / b.quotaGB) >= 0.8;
        }).length;

        return {
          ...prev,
          criticalTenantsCount: nextCriticalCount,
        };
      });

      showToast(t('storage.toast.quotaUpdated'), 'success');
    },
    [businesses, showToast, t]
  );

  const handleRefresh = useCallback(() => {
    showToast(t('storage.toast.synced'), 'info');
  }, [showToast, t]);

  return (
    <div className="space-y-6 text-foreground animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {t('storage.title')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  S3 Cloud Storage
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('storage.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card/60 backdrop-blur-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('storage.actions.refresh')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <StorageKpiStrip overview={overview} />

      {/* 3. Category Breakdown Cards */}
      <StorageBreakdownCards breakdown={overview.breakdown} />

      {/* 4. Business Quotas Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">
          {t('storage.table.sectionTitle')}
        </h3>
        <BusinessStorageTable
          businesses={businesses}
          onAdjustQuota={handleOpenAdjustQuota}
        />
      </div>

      {/* 5. Adjust Quota Modal */}
      <AdjustQuotaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRecord}
        onSave={handleSaveQuota}
      />
    </div>
  );
};

export default StorageDashboard;
