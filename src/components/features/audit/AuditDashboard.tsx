import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { INITIAL_AUDIT_LOGS } from './audit.mock';
import type {
  AuditLogEntry,
  AuditFilterState,
  AuditModalAction,
  AuditSeverity,
  AuditStatus
} from './audit.types';
import AuditKpiStrip from './components/AuditKpiStrip';
import AuditFilterBar from './components/AuditFilterBar';
import { AuditTable } from './components/AuditTable';
import { AuditTimelineFeed } from './components/AuditTimelineFeed';
import { AuditActionModals } from './components/AuditActionModals';
import { CheckCircle2, Download } from 'lucide-react';

const INITIAL_FILTERS: AuditFilterState = {
  search: '',
  category: 'all',
  severity: 'all',
  status: 'all',
  actor: 'all',
  business: 'all',
  resourceType: 'all',
  dateRange: 'all',
  ipAddress: '',
  page: 1,
  pageSize: 10,
  viewMode: 'table'
};

export const AuditDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [filters, setFilters] = useState<AuditFilterState>(INITIAL_FILTERS);
  const [modalAction, setModalAction] = useState<AuditModalAction>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter computation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchDescription = log.description.toLowerCase().includes(q);
        const matchActorName = log.actor.name.toLowerCase().includes(q);
        const matchActorEmail = log.actor.email.toLowerCase().includes(q);
        const matchAction = log.action.toLowerCase().includes(q);
        const matchResource = log.resource.name.toLowerCase().includes(q);
        const matchBusiness = log.resource.businessName?.toLowerCase().includes(q);
        const matchIp = log.clientContext.ipAddress.includes(q);
        const matchId = log.id.toLowerCase().includes(q);
        if (
          !matchDescription &&
          !matchActorName &&
          !matchActorEmail &&
          !matchAction &&
          !matchResource &&
          !matchBusiness &&
          !matchIp &&
          !matchId
        ) {
          return false;
        }
      }

      // 2. Category
      if (filters.category !== 'all' && log.category !== filters.category) {
        return false;
      }

      // 3. Severity
      if (filters.severity !== 'all' && log.severity !== filters.severity) {
        return false;
      }

      // 4. Status
      if (filters.status !== 'all' && log.status !== filters.status) {
        return false;
      }

      // 5. Actor
      if (filters.actor !== 'all') {
        if (log.actor.id !== filters.actor && log.actor.name !== filters.actor) {
          return false;
        }
      }

      // 6. Business
      if (filters.business !== 'all') {
        if (
          log.resource.businessId !== filters.business &&
          log.resource.businessName !== filters.business
        ) {
          return false;
        }
      }

      // 7. Resource Type
      if (filters.resourceType !== 'all' && log.resource.type !== filters.resourceType) {
        return false;
      }

      // 8. IP Address
      if (filters.ipAddress.trim()) {
        if (!log.clientContext.ipAddress.includes(filters.ipAddress.trim())) {
          return false;
        }
      }

      // 9. Date Range Preset
      if (filters.dateRange !== 'all') {
        const logDate = new Date(log.timestamp).getTime();
        const now = new Date('2026-09-25T00:00:00Z').getTime(); // Baseline relative to seeded dates

        if (filters.dateRange === 'today') {
          const oneDayAgo = now - 24 * 60 * 60 * 1000;
          if (logDate < oneDayAgo) return false;
        } else if (filters.dateRange === '24h') {
          const oneDayAgo = now - 24 * 60 * 60 * 1000;
          if (logDate < oneDayAgo) return false;
        } else if (filters.dateRange === '7d') {
          const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
          if (logDate < sevenDaysAgo) return false;
        } else if (filters.dateRange === '30d') {
          const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
          if (logDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [logs, filters]);

  const handleExportConfirm = (_format: 'json' | 'csv' | 'pdf', summary: string) => {
    setModalAction(null);
    showToast(`${t('audit.toast.dossierExported')} (${summary})`);
  };

  const handleSingleFilterChange = <K extends keyof AuditFilterState>(
    key: K,
    value: AuditFilterState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? (value as number) : 1
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    showToast(t('audit.toast.filtersReset'));
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-cyan-500/30 bg-slate-900/95 text-slate-100 shadow-2xl backdrop-blur-md animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>{t('audit.page.title')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {t('audit.page.badgeLedger')}
              </span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">{t('audit.page.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalAction({ type: 'export_dossier' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('audit.page.exportComplianceDossier')}</span>
          </button>
        </div>
      </div>

      {/* KPI Security Telemetry Strip */}
      <AuditKpiStrip
        logs={logs}
        activeSeverity={filters.severity}
        activeStatus={filters.status}
        onSelectSeverity={(sev: 'all' | AuditSeverity) => handleSingleFilterChange('severity', sev)}
        onSelectStatus={(st: 'all' | AuditStatus) => handleSingleFilterChange('status', st)}
      />

      {/* 7-Dimensional Sovereign Filter Bar */}
      <AuditFilterBar
        filters={filters}
        onFilterChange={handleSingleFilterChange}
        onResetFilters={handleResetFilters}
        logs={logs}
        onOpenExportModal={() => setModalAction({ type: 'export_dossier' })}
      />

      {/* Main View Mode Render: Table vs Timeline */}
      {filters.viewMode === 'table' ? (
        <AuditTable
          logs={filteredLogs}
          totalLogs={filteredLogs.length}
          page={filters.page}
          pageSize={filters.pageSize}
          onPageChange={(p) => handleSingleFilterChange('page', p)}
          onOpenModal={(action) => setModalAction(action)}
          onSelectActor={(actorId) => handleSingleFilterChange('actor', actorId)}
          onSelectBusiness={(businessId) => handleSingleFilterChange('business', businessId)}
          onSelectIp={(ip) => handleSingleFilterChange('ipAddress', ip)}
        />
      ) : (
        <AuditTimelineFeed
          logs={filteredLogs}
          onOpenModal={(action) => setModalAction(action)}
          onSelectActor={(actorId) => handleSingleFilterChange('actor', actorId)}
          onSelectBusiness={(businessId) => handleSingleFilterChange('business', businessId)}
        />
      )}

      {/* Action & Deep Inspector Modals */}
      <AuditActionModals
        modalAction={modalAction}
        onClose={() => setModalAction(null)}
        onExportConfirm={handleExportConfirm}
      />
    </div>
  );
};
