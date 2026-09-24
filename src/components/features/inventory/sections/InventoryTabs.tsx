import Tabs from '../../../ui/Tabs';
import { FileText, Link, Package } from 'lucide-react';

type TabKey = 'stock' | 'recipes' | 'po';

type InventoryTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  stockLabel: string;
  recipesLabel: string;
  poLabel: string;
};

const InventoryTabs = ({ activeTab, onTabChange, stockLabel, recipesLabel, poLabel }: InventoryTabsProps) => {
  const tabs = [
    { key: 'stock' as const, label: stockLabel, icon: Package },
    { key: 'recipes' as const, label: recipesLabel, icon: Link },
    { key: 'po' as const, label: poLabel, icon: FileText },
  ];

  return <Tabs items={tabs} activeKey={activeTab} onChange={onTabChange} />;
};

export default InventoryTabs;