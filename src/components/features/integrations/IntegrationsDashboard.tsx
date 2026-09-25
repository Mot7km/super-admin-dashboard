import { useState, useMemo, useCallback, type FC } from 'react';
import {
  Layers,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  IntegrationItem,
  IntegrationCategory,
  IntegrationEnvironment,
  WebhookEventLog,
  IntegrationsKpiSummary,
} from './integrations.types';
import {
  INITIAL_INTEGRATIONS_DATA,
  MOCK_WEBHOOK_LOGS,
  INITIAL_INTEGRATIONS_KPIS,
} from './integrations.mock';

import { IntegrationsKpiStrip } from './components/IntegrationsKpiStrip';
import { IntegrationsCategoryTabs } from './components/IntegrationsCategoryTabs';
import { IntegrationCardGrid } from './components/IntegrationCardGrid';
import { ConfigureIntegrationModal } from './components/ConfigureIntegrationModal';
import { TestConnectionModal } from './components/TestConnectionModal';
import { WebhooksActivityDrawer } from './components/WebhooksActivityDrawer';

export const IntegrationsDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS_DATA);
  const [kpis, setKpis] = useState<IntegrationsKpiSummary>(INITIAL_INTEGRATIONS_KPIS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookEventLog[]>(MOCK_WEBHOOK_LOGS);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<'all' | IntegrationEnvironment>('all');

  // Modals & Drawer State
  const [selectedForConfig, setSelectedForConfig] = useState<IntegrationItem | null>(null);
  const [selectedForPing, setSelectedForPing] = useState<IntegrationItem | null>(null);
  const [isWebhooksDrawerOpen, setIsWebhooksDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Category counts
  const countsByCategory = useMemo(() => {
    const counts: Record<IntegrationCategory, number> = {
      all: integrations.length,
      payment: 0,
      messaging: 0,
      cloud: 0,
      webhooks: 0,
    };

    integrations.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [integrations]);

  // Filtered Integrations
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Environment filter
      if (envFilter !== 'all' && item.environment !== envFilter) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesKey = item.providerKey.toLowerCase().includes(query);
        const matchesEnDesc = item.descriptionEn.toLowerCase().includes(query);
        const matchesArDesc = item.descriptionAr.toLowerCase().includes(query);

        if (!matchesName && !matchesKey && !matchesEnDesc && !matchesArDesc) {
          return false;
        }
      }

      return true;
    });
  }, [integrations, activeCategory, envFilter, searchQuery]);

  // Save Config Handler
  const handleSaveConfig = useCallback(
    (updated: IntegrationItem) => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showToast(t('integrations.toast.configSaved'), 'success');
    },
    [showToast, t]
  );

  // Retry Webhook Handler
  const handleRetryWebhook = useCallback(
    (logId: string) => {
      setWebhookLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? { ...log, statusCode: 200, status: 'success', timestamp: 'Just now' }
            : log
        )
      );
      showToast(t('integrations.toast.webhookRetried'), 'success');
    },
    [showToast, t]
  );

  // Sync / Refresh All Gateways
  const handleSyncAll = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIntegrations((prev) =>
        prev.map((item) => ({ ...item, lastSyncAt: 'Just now' }))
      );
      setKpis((prev) => ({ ...prev, systemHealthIndex: 99.91 }));
      showToast(t('integrations.toast.allSynced'), 'success');
    }, 600);
  }, [showToast, t]);

  return (
    <div className="space-y-7 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {t('integrations.title')}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('integrations.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
            <Sparkles className="h-3.5 w-3.5" />
            <span>9 Gateway Services Healthy</span>
          </div>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm hover:border-primary hover:bg-muted/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{t('integrations.actions.syncAll')}</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <IntegrationsKpiStrip kpis={kpis} />

      {/* Categories & Filter Bar */}
      <IntegrationsCategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        envFilter={envFilter}
        onEnvFilterChange={setEnvFilter}
        onOpenWebhooksDrawer={() => setIsWebhooksDrawerOpen(true)}
        countsByCategory={countsByCategory}
      />

      {/* Cards Grid */}
      <IntegrationCardGrid
        integrations={filteredIntegrations}
        onConfigure={(item) => setSelectedForConfig(item)}
        onTestPing={(item) => setSelectedForPing(item)}
      />

      {/* Configuration Modal */}
      <ConfigureIntegrationModal
        isOpen={Boolean(selectedForConfig)}
        onClose={() => setSelectedForConfig(null)}
        integration={selectedForConfig}
        onSave={handleSaveConfig}
      />

      {/* Test Connection Modal */}
      <TestConnectionModal
        isOpen={Boolean(selectedForPing)}
        onClose={() => setSelectedForPing(null)}
        integration={selectedForPing}
      />

      {/* Webhooks Activity Drawer */}
      <WebhooksActivityDrawer
        isOpen={isWebhooksDrawerOpen}
        onClose={() => setIsWebhooksDrawerOpen(false)}
        logs={webhookLogs}
        onRetryWebhook={handleRetryWebhook}
      />
    </div>
  );
};

IntegrationsDashboard.displayName = 'IntegrationsDashboard';
