import Tabs from '../../../ui/Tabs';
import { Clock, Shield, UserCheck } from 'lucide-react';

type TabKey = 'staff' | 'permissions' | 'shifts';

type EmployeesTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  staffLabel: string;
  permissionsLabel: string;
  shiftsLabel: string;
};

const EmployeesTabs = ({ activeTab, onTabChange, staffLabel, permissionsLabel, shiftsLabel }: EmployeesTabsProps) => {
  const tabs = [
    { key: 'staff' as const, label: staffLabel, icon: UserCheck },
    { key: 'permissions' as const, label: permissionsLabel, icon: Shield },
    { key: 'shifts' as const, label: shiftsLabel, icon: Clock },
  ];

  return <Tabs items={tabs} activeKey={activeTab} onChange={onTabChange} className="cursor-pointer" />;
};

export default EmployeesTabs;