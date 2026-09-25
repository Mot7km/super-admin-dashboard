import { useState, useCallback, type FC } from 'react';
import { Settings, RefreshCw, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  GlobalSettingsState,
  SettingsTabId,
  GeneralSettings,
  SecuritySettings,
  BusinessPolicySettings,
  MaintenanceSettings,
} from './global-settings.types';
import { INITIAL_GLOBAL_SETTINGS, emitMaintenanceChange } from './global-settings.mock';

import { SettingsNavigationTabs } from './components/SettingsNavigationTabs';
import { GeneralSettingsSection } from './components/GeneralSettingsSection';
import { SecurityPoliciesSection } from './components/SecurityPoliciesSection';
import { BusinessPoliciesSection } from './components/BusinessPoliciesSection';
import { MaintenanceModeSection } from './components/MaintenanceModeSection';

export const GlobalSettingsDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<GlobalSettingsState>(INITIAL_GLOBAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<SettingsTabId>('general');

  // Partial update handlers
  const handleUpdateGeneral = useCallback((updated: Partial<GeneralSettings>) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, ...updated },
    }));
  }, []);

  const handleUpdateSecurity = useCallback((updated: Partial<SecuritySettings>) => {
    setSettings((prev) => ({
      ...prev,
      security: { ...prev.security, ...updated },
    }));
  }, []);

  const handleUpdateBusiness = useCallback((updated: Partial<BusinessPolicySettings>) => {
    setSettings((prev) => ({
      ...prev,
      businessPolicy: { ...prev.businessPolicy, ...updated },
    }));
  }, []);

  const handleUpdateMaintenance = useCallback((updated: Partial<MaintenanceSettings>) => {
    if (updated.isActive !== undefined) {
      emitMaintenanceChange(updated.isActive);
    }
    setSettings((prev) => ({
      ...prev,
      maintenance: { ...prev.maintenance, ...updated },
    }));
  }, []);

  const handleSave = useCallback(() => {
    showToast(t('globalSettings.toast.savedSuccessfully'), 'success');
  }, [showToast, t]);

  const handleResetDefaults = useCallback(() => {
    setSettings(INITIAL_GLOBAL_SETTINGS);
    showToast(t('globalSettings.toast.resetToDefaults'), 'info');
  }, [showToast, t]);

  return (
    <div className="space-y-6 text-foreground animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {t('globalSettings.title')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  Super Admin Governance
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('globalSettings.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card/60 backdrop-blur-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('globalSettings.actions.restoreDefaults')}</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <SettingsNavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMaintenanceActive={settings.maintenance.isActive}
      />

      {/* 3. Active Section View */}
      <div className="pt-2">
        {activeTab === 'general' && (
          <GeneralSettingsSection
            data={settings.general}
            onChange={handleUpdateGeneral}
            onSave={handleSave}
          />
        )}

        {activeTab === 'security' && (
          <SecurityPoliciesSection
            data={settings.security}
            onChange={handleUpdateSecurity}
            onSave={handleSave}
          />
        )}

        {activeTab === 'business' && (
          <BusinessPoliciesSection
            data={settings.businessPolicy}
            onChange={handleUpdateBusiness}
            onSave={handleSave}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceModeSection
            data={settings.maintenance}
            general={settings.general}
            onChange={handleUpdateMaintenance}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default GlobalSettingsDashboard;
