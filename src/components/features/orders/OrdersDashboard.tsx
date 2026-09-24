import { useState } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import OrdersFilters from './sections/OrdersFilters';
import OrdersHeader from './sections/OrdersHeader';
import OrdersKanbanBoard from './components/OrdersKanbanBoard';

interface Order {
  id: string;
  type: string;
  items: string[];
  total: string;
  time: string;
  isUrgent: boolean;
  columnId: 'new' | 'preparing' | 'ready' | 'completed';
}

const OrdersDashboard = () => {
  const { t, locale } = useTranslation();
  const { showToast } = useToast();

  const [typeFilter, setTypeFilter] = useState<'all' | 'dinein' | 'takeaway'>('all');
  const [orders, setOrders] = useState<Order[]>([
    { id: '#ORD-2049', type: 'Dine-In (Table 4)', items: ['2x Smoked Truffle Burger', '2x Spanish Iced Latte'], total: '$42.00', time: '3m ago', isUrgent: false, columnId: 'new' },
    { id: '#ORD-2050', type: 'Takeaway', items: ['1x Margherita Pizza', '1x Iced Tea'], total: '$21.50', time: '1m ago', isUrgent: false, columnId: 'new' },
    { id: '#ORD-2048', type: 'Takeaway', items: ['1x Crispy Chicken Wrap', '1x Pistachio Pancake'], total: '$24.00', time: '14m ago', isUrgent: false, columnId: 'preparing' },
    { id: '#ORD-2045', type: 'Dine-In (Table 8)', items: ['3x Smoked Truffle Burger'], total: '$43.50', time: '18m ago', isUrgent: true, columnId: 'preparing' },
    { id: '#ORD-2046', type: 'Dine-In (Table 2)', items: ['2x Spanish Iced Latte'], total: '$13.00', time: '22m ago', isUrgent: false, columnId: 'ready' },
    { id: '#ORD-2044', type: 'Takeaway', items: ['1x Margherita Pizza'], total: '$18.00', time: '40m ago', isUrgent: false, columnId: 'completed' },
  ]);

  const moveOrder = (orderId: string, nextCol: 'new' | 'preparing' | 'ready' | 'completed') => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, columnId: nextCol } : o)));
    showToast(`${orderId} moved to ${t(`orders.kanban.${nextCol}`)}`, 'info');
  };

  const filteredOrders = orders.filter((o) => {
    if (typeFilter === 'dinein') return o.type.toLowerCase().includes('dine-in');
    if (typeFilter === 'takeaway') return o.type.toLowerCase().includes('takeaway');
    return true;
  });

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* ─── Header + Filters ────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <OrdersHeader title={t('orders.title')} subtitle={t('orders.subtitle')} kdsBadge={t('orders.kdsBadge')} />
        <div className="w-full sm:w-auto sm:min-w-[200px] md:min-w-[260px]">
          <OrdersFilters
            typeFilter={typeFilter}
            onChange={setTypeFilter}
            allLabel={t('orders.filterAll')}
            dineInLabel={t('orders.filterDineIn')}
            takeawayLabel={t('orders.filterTakeaway')}
          />
        </div>
      </div>

      {/* ─── Kanban Board ────────────────────────────────────────── */}
      <div className="overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        <OrdersKanbanBoard
          orders={filteredOrders}
          locale={locale}
          onMove={moveOrder}
          emptyTitle="common.noResults"
          delayedLabel={t('orders.delayed')}
          completeLabel="Order Complete"
          titleMap={{
            new: t('orders.kanban.new'),
            preparing: t('orders.kanban.preparing'),
            ready: t('orders.kanban.ready'),
            completed: t('orders.kanban.completed'),
          }}
          actionMap={{
            new: t('orders.actions.markPreparing'),
            preparing: t('orders.actions.markReady'),
            ready: t('orders.actions.complete'),
            completed: '',
          }}
        />
      </div>
    </div>
  );
};

export default OrdersDashboard;