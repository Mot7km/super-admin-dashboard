import { useState, useCallback, type FC } from 'react';
import {
  Activity,
  RefreshCw,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  ServerNode,
  ResourceMetric,
  SystemIncident,
  SystemHealthKpis,
} from './system-health.types';
import {
  INITIAL_SERVER_NODES,
  INITIAL_RESOURCE_METRICS,
  INITIAL_INCIDENTS,
  INITIAL_SYSTEM_KPIS,
} from './system-health.mock';

import { SystemHealthKpiStrip } from './components/SystemHealthKpiStrip';
import { ServerNodesGrid } from './components/ServerNodesGrid';
import { ResourceUtilizationCards } from './components/ResourceUtilizationCards';
import { IncidentTimelineCard } from './components/IncidentTimelineCard';
import { PurgeCacheModal } from './components/PurgeCacheModal';
import { RawMetricsDrawer } from './components/RawMetricsDrawer';

export const SystemHealthDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [nodes, setNodes] = useState<ServerNode[]>(INITIAL_SERVER_NODES);
  const [metrics] = useState<ResourceMetric[]>(INITIAL_RESOURCE_METRICS);
  const [incidents] = useState<SystemIncident[]>(INITIAL_INCIDENTS);
  const [kpis, setKpis] = useState<SystemHealthKpis>(INITIAL_SYSTEM_KPIS);

  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [inspectingNode, setInspectingNode] = useState<ServerNode | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Single Node Recheck
  const handleRecheckNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                latencyMs: Math.max(4, n.latencyMs + Math.floor(Math.random() * 5) - 2),
                lastHealthCheck: 'Just now',
              }
            : n
        )
      );
      showToast(t('systemHealth.toast.nodeChecked'), 'info');
    },
    [showToast, t]
  );

  // Global Fleet Diagnostic
  const handleRunDiagnostics = useCallback(() => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          lastHealthCheck: 'Just now',
        }))
      );
      setKpis((prev) => ({
        ...prev,
        uptimePercent: 99.99,
        avgLatencyMs: 30,
      }));
      showToast(t('systemHealth.toast.diagnosticsPassed'), 'success');
    }, 700);
  }, [showToast, t]);

  // Purge Cache Confirm
  const handleConfirmPurge = useCallback(
    (scope: string) => {
      showToast(`${t('systemHealth.toast.cachePurged')} (${scope})`, 'success');
    },
    [showToast, t]
  );

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {t('systemHealth.title')}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('systemHealth.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>All Clusters Operational</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPurgeModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:border-red-500/50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t('systemHealth.actions.purgeCache')}</span>
          </button>

          <button
            type="button"
            onClick={handleRunDiagnostics}
            disabled={isDiagnosing}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isDiagnosing ? 'animate-spin' : ''}`} />
            <span>{t('systemHealth.actions.runDiagnostics')}</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <SystemHealthKpiStrip kpis={kpis} />

      {/* Resource Utilization Cards */}
      <ResourceUtilizationCards metrics={metrics} />

      {/* Server Fleet Grid */}
      <ServerNodesGrid
        nodes={nodes}
        onRecheckNode={handleRecheckNode}
        onInspectNode={(node) => setInspectingNode(node)}
      />

      {/* Incident & Maintenance History */}
      <IncidentTimelineCard incidents={incidents} />

      {/* Purge Cache Modal */}
      <PurgeCacheModal
        isOpen={isPurgeModalOpen}
        onClose={() => setIsPurgeModalOpen(false)}
        onConfirmPurge={handleConfirmPurge}
      />

      {/* Raw Metrics Drawer */}
      <RawMetricsDrawer
        isOpen={Boolean(inspectingNode)}
        onClose={() => setInspectingNode(null)}
        node={inspectingNode}
      />
    </div>
  );
};

SystemHealthDashboard.displayName = 'SystemHealthDashboard';
