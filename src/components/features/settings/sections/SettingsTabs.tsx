import Tabs from '../../../ui/Tabs';
import { Printer, ShieldCheck, Store, Zap } from 'lucide-react';

type TabKey = 'profile' | 'plans' | 'integrations' | 'audit';

type SettingsTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  profileLabel: string;
  plansLabel: string;
  integrationsLabel: string;
  auditLabel: string;
};

const SettingsTabs = ({ activeTab, onTabChange, profileLabel, plansLabel, integrationsLabel, auditLabel }: SettingsTabsProps) => {
  const tabs = [
    { key: 'profile' as const, label: profileLabel, icon: Store },
    { key: 'plans' as const, label: plansLabel, icon: Zap },
    { key: 'integrations' as const, label: integrationsLabel, icon: Printer },
    { key: 'audit' as const, label: auditLabel, icon: ShieldCheck },
  ];

  return <Tabs items={tabs} activeKey={activeTab} onChange={onTabChange} className="[&_button]:cursor-pointer" />;
};

export default SettingsTabs;