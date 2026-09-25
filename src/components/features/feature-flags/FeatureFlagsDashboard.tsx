import { useState, useMemo, useCallback, type FC } from 'react';
import { Flag, Sparkles, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type { FeatureFlag, FlagFilterState } from './feature-flags.types';
import { INITIAL_FEATURE_FLAGS } from './feature-flags.mock';

import { FeatureFlagsKpiStrip } from './components/FeatureFlagsKpiStrip';
import { FeatureFlagsFilters } from './components/FeatureFlagsFilters';
import { FeatureFlagsTable } from './components/FeatureFlagsTable';
import { CreateEditFlagModal } from './components/CreateEditFlagModal';
import { FlagDetailsDrawer } from './components/FlagDetailsDrawer';
import { KillSwitchConfirmModal } from './components/KillSwitchConfirmModal';

const initialFilters: FlagFilterState = {
  search: '',
  status: 'all',
  scope: 'all',
  environment: 'all',
  tag: '',
};

export const FeatureFlagsDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FEATURE_FLAGS);
  const [filters, setFilters] = useState<FlagFilterState>(initialFilters);

  // Modals state
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [detailsFlag, setDetailsFlag] = useState<FeatureFlag | null>(null);
  const [killSwitchFlag, setKillSwitchFlag] = useState<FeatureFlag | null>(null);
  const [killSwitchMode, setKillSwitchMode] = useState<'toggleOff' | 'delete'>('toggleOff');

  // Filter Handler
  const handleFilterChange = useCallback((newFilters: Partial<FlagFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  // Filtered Flags
  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      // Search matches name, key, or description
      const matchesSearch =
        filters.search === '' ||
        flag.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        flag.key.toLowerCase().includes(filters.search.toLowerCase()) ||
        flag.description.toLowerCase().includes(filters.search.toLowerCase());

      // Status
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'enabled' && flag.isEnabled) ||
        (filters.status === 'disabled' && !flag.isEnabled);

      // Scope
      const matchesScope =
        filters.scope === 'all' || flag.targetType === filters.scope;

      // Environment
      const matchesEnv =
        filters.environment === 'all' || flag.environment === filters.environment;

      return matchesSearch && matchesStatus && matchesScope && matchesEnv;
    });
  }, [flags, filters]);

  // Toggle Flag handler
  const handleToggle = useCallback(
    (flag: FeatureFlag) => {
      // If toggling off an active production flag with specific targets, prompt kill-switch confirmation
      if (flag.isEnabled && flag.environment === 'production' && flag.targetType !== 'everyone') {
        setKillSwitchFlag(flag);
        setKillSwitchMode('toggleOff');
        return;
      }

      // Quick toggle
      const nextState = !flag.isEnabled;
      setFlags((prev) =>
        prev.map((f) =>
          f.id === flag.id
            ? {
                ...f,
                isEnabled: nextState,
                updatedAt: 'Just now',
                lastToggledBy: { name: 'Root Super Admin', at: 'Just now' },
              }
            : f
        )
      );

      showToast(
        nextState
          ? `${flag.name}: ${t('featureFlags.toast.enabled')}`
          : `${flag.name}: ${t('featureFlags.toast.disabled')}`,
        nextState ? 'success' : 'info'
      );
    },
    [showToast, t]
  );

  // Confirm Kill Switch Toggle Off
  const handleConfirmKillSwitch = useCallback(() => {
    if (!killSwitchFlag) return;

    if (killSwitchMode === 'toggleOff') {
      setFlags((prev) =>
        prev.map((f) =>
          f.id === killSwitchFlag.id
            ? {
                ...f,
                isEnabled: false,
                updatedAt: 'Just now',
                lastToggledBy: { name: 'Emergency Kill Switch', at: 'Just now' },
              }
            : f
        )
      );
      showToast(
        `${killSwitchFlag.name}: ${t('featureFlags.toast.emergencyDisabled')}`,
        'error'
      );
    } else if (killSwitchMode === 'delete') {
      setFlags((prev) => prev.filter((f) => f.id !== killSwitchFlag.id));
      showToast(
        `${killSwitchFlag.name}: ${t('featureFlags.toast.deleted')}`,
        'error'
      );
    }

    setKillSwitchFlag(null);
  }, [killSwitchFlag, killSwitchMode, showToast, t]);

  // Open Create Modal
  const handleOpenCreateModal = useCallback(() => {
    setEditingFlag(null);
    setIsCreateEditOpen(true);
  }, []);

  // Open Edit Modal
  const handleOpenEditModal = useCallback((flag: FeatureFlag) => {
    setEditingFlag(flag);
    setIsCreateEditOpen(true);
  }, []);

  // Save (Create or Update)
  const handleSaveFlag = useCallback(
    (flagData: Partial<FeatureFlag>) => {
      if (editingFlag) {
        // Update existing
        setFlags((prev) =>
          prev.map((f) =>
            f.id === editingFlag.id
              ? {
                  ...f,
                  ...flagData,
                  updatedAt: 'Just now',
                }
              : f
          )
        );
        showToast(t('featureFlags.toast.updated'), 'success');
      } else {
        // Create new
        const newFlag: FeatureFlag = {
          id: `ff_${Date.now()}`,
          key: flagData.key ?? 'new_feature',
          name: flagData.name ?? 'New Feature Flag',
          description: flagData.description ?? '',
          isEnabled: flagData.isEnabled ?? true,
          targetType: flagData.targetType ?? 'everyone',
          targetIds: flagData.targetIds ?? [],
          targetLabels: flagData.targetLabels ?? ['All Tenants'],
          rolloutPercentage: flagData.rolloutPercentage,
          environment: flagData.environment ?? 'production',
          tags: flagData.tags ?? ['Custom'],
          createdAt: 'Just now',
          updatedAt: 'Just now',
          createdBy: {
            id: 'usr_root',
            name: 'Root Super Admin',
          },
        };
        setFlags((prev) => [newFlag, ...prev]);
        showToast(t('featureFlags.toast.created'), 'success');
      }
    },
    [editingFlag, showToast, t]
  );

  // Trigger Delete Modal
  const handleDeleteTrigger = useCallback((flag: FeatureFlag) => {
    setKillSwitchFlag(flag);
    setKillSwitchMode('delete');
  }, []);

  return (
    <div className="space-y-6 text-foreground animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Flag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {t('featureFlags.title')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  Zero-Downtime
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('featureFlags.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats / Quick refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showToast(t('featureFlags.toast.syncRefreshed'), 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card/60 backdrop-blur-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Refresh flags state"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('featureFlags.actions.sync')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <FeatureFlagsKpiStrip flags={flags} />

      {/* 3. Filters & Search */}
      <FeatureFlagsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 4. Table */}
      <FeatureFlagsTable
        flags={filteredFlags}
        onToggle={handleToggle}
        onEdit={handleOpenEditModal}
        onViewDetails={setDetailsFlag}
        onDelete={handleDeleteTrigger}
      />

      {/* 5. Create / Edit Modal */}
      <CreateEditFlagModal
        isOpen={isCreateEditOpen}
        onClose={() => setIsCreateEditOpen(false)}
        onSave={handleSaveFlag}
        editingFlag={editingFlag}
      />

      {/* 6. Details & Code Drawer */}
      <FlagDetailsDrawer
        flag={detailsFlag}
        onClose={() => setDetailsFlag(null)}
      />

      {/* 7. Kill Switch / Delete Confirmation Modal */}
      <KillSwitchConfirmModal
        isOpen={!!killSwitchFlag}
        flag={killSwitchFlag}
        mode={killSwitchMode}
        onClose={() => setKillSwitchFlag(null)}
        onConfirm={handleConfirmKillSwitch}
      />
    </div>
  );
};

export default FeatureFlagsDashboard;
