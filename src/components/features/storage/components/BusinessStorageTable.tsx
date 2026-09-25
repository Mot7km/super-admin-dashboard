import { memo, useState, useMemo, type FC } from 'react';
import {
  Search,
  FilterX,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileBox,
  Clock,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { BusinessStorageRecord, StorageQuotaStatus } from '../storage.types';

type BusinessStorageTableProps = {
  businesses: BusinessStorageRecord[];
  onAdjustQuota: (record: BusinessStorageRecord) => void;
};

export const BusinessStorageTable: FC<BusinessStorageTableProps> = memo(({
  businesses,
  onAdjustQuota,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StorageQuotaStatus>('all');

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        search === '' ||
        b.businessName.toLowerCase().includes(search.toLowerCase()) ||
        b.businessCode.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [businesses, search, statusFilter]);

  const isFiltered = search !== '' || statusFilter !== 'all';

  const getStatusBadge = (status: StorageQuotaStatus, percent: number) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t('storage.status.normal')}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-3 w-3" />
            {t('storage.status.warning')} ({percent}%)
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            {t('storage.status.critical')} ({percent}%)
          </span>
        );
    }
  };

  const getProgressBarColor = (status: StorageQuotaStatus) => {
    switch (status) {
      case 'normal':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('storage.filters.searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2 text-sm rounded-xl bg-background/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">{t('storage.filters.allStatuses')}</option>
            <option value="normal">{t('storage.status.normal')}</option>
            <option value="warning">{t('storage.status.warning')} (&gt; 70%)</option>
            <option value="critical">{t('storage.status.critical')} (&gt; 90%)</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>{t('storage.filters.reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 text-start">{t('storage.table.business')}</th>
                <th className="py-3.5 px-4 text-start">{t('storage.table.quotaUsage')}</th>
                <th className="py-3.5 px-4 text-start">{t('storage.table.breakdown')}</th>
                <th className="py-3.5 px-4 text-start">{t('storage.table.fileStats')}</th>
                <th className="py-3.5 px-4 text-center">{t('storage.table.status')}</th>
                <th className="py-3.5 px-4 text-end">{t('storage.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((item) => (
                <tr
                  key={item.businessId}
                  className="group hover:bg-muted/30 transition-colors duration-150"
                >
                  {/* Business Name and Code */}
                  <td className="py-4 px-4 align-top max-w-[220px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {item.businessName}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {item.businessCode}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {item.planName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Quota Usage & Progress Bar */}
                  <td className="py-4 px-4 align-top min-w-[180px]">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="font-mono font-bold text-foreground">
                          {item.usedGB} GB <span className="font-normal text-muted-foreground">/ {item.quotaGB} GB</span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {item.usagePercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                            item.status
                          )}`}
                          style={{ width: `${Math.min(100, item.usagePercent)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Category Breakdown Small Pills */}
                  <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span title="Images">🖼️ {item.categoryBreakdown.imagesGB}G</span>
                      <span title="Documents">📄 {item.categoryBreakdown.documentsGB}G</span>
                      <span title="Backups">💾 {item.categoryBreakdown.backupsGB}G</span>
                      <span title="Logs">📋 {item.categoryBreakdown.logsGB}G</span>
                    </div>
                  </td>

                  {/* File Stats and Last Upload */}
                  <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <FileBox className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{item.fileCount.toLocaleString()} {t('storage.table.files')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground/70">
                        <Clock className="h-3 w-3" />
                        <span>{item.lastUploadAt}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                    {getStatusBadge(item.status, item.usagePercent)}
                  </td>

                  {/* Actions: Adjust Quota */}
                  <td className="py-4 px-4 align-top text-end whitespace-nowrap">
                    <button
                      onClick={() => onAdjustQuota(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
                      title={t('storage.actions.adjustQuota')}
                    >
                      <Sliders className="h-3.5 w-3.5 text-primary" />
                      <span>{t('storage.actions.adjustQuota')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

BusinessStorageTable.displayName = 'BusinessStorageTable';
