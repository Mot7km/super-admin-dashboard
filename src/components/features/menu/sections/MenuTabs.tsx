import Tabs from '../../../ui/Tabs';
import { QrCode, Sliders, Star, Utensils } from 'lucide-react';

type TabKey = 'items' | 'sliders' | 'qr' | 'reviews' | 'simulator';

type MenuTabsProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  itemLabel: string;
  slidersLabel: string;
  qrLabel: string;
  reviewsLabel: string;
};

const MenuTabs = ({
  activeTab,
  onTabChange,
  itemLabel,
  slidersLabel,
  qrLabel,
  reviewsLabel,
}: MenuTabsProps) => {
  const tabMeta = [
    { key: 'items' as const, label: itemLabel, icon: Utensils },
    { key: 'sliders' as const, label: slidersLabel, icon: Sliders },
    { key: 'qr' as const, label: qrLabel, icon: QrCode },
    { key: 'reviews' as const, label: reviewsLabel, icon: Star },
  ];

  return (
    <div className="flex items-center justify-between pb-2 gap-2">
      <Tabs items={tabMeta} activeKey={activeTab} onChange={onTabChange} className="flex-1" />
    </div>
  );
};

export default MenuTabs;