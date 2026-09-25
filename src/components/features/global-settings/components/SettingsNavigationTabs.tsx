import { memo, type FC } from 'react';
import {
  Settings,
  ShieldAlert,
  Building,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SettingsTabId } from '../global-settings.types';

type SettingsNavigationTabsProps = {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
  isMaintenanceActive: boolean;
};

export const SettingsNavigationTabs: FC<SettingsNavigationTabsProps> = memo(({
  activeTab,
  onTabChange,
  isMaintenanceActive,
}) => {
  const { t } = useTranslation();

  const tabs: { id: SettingsTabId; labelKey: string; icon: typeof Settings; isDangerous?: boolean }[] = [
    { id: 'general', labelKey: 'globalSettings.tabs.general', icon: Settings },
    { id: 'security', labelKey: 'globalSettings.tabs.security', icon: ShieldAlert },
    { id: 'business', labelKey: 'globalSettings.tabs.businessPolicy', icon: Building },
    { id: 'maintenance', labelKey: 'globalSettings.tabs.maintenance', icon: Wrench, isDangerous: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const showMaintenanceBadge = tab.id === 'maintenance' && isMaintenanceActive;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              isActive
                ? tab.isDangerous && isMaintenanceActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{t(tab.labelKey)}</span>

            {showMaintenanceBadge && (
              <span className="flex items-center gap-1 ms-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-white text-rose-600 animate-pulse">
                <AlertTriangle className="h-2.5 w-2.5" />
                LIVE 503
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

SettingsNavigationTabs.displayName = 'SettingsNavigationTabs';
