import type { Order } from './orders.types';

export const initialOrders: Order[] = [
  { id: '#ORD-2049', type: 'Dine-In (Table 4)', items: ['2x Smoked Truffle Burger', '2x Spanish Iced Latte'], total: '$42.00', time: '3m ago', isUrgent: false, columnId: 'new' },
  { id: '#ORD-2050', type: 'Takeaway', items: ['1x Margherita Pizza', '1x Iced Tea'], total: '$21.50', time: '1m ago', isUrgent: false, columnId: 'new' },
  { id: '#ORD-2048', type: 'Takeaway', items: ['1x Crispy Chicken Wrap', '1x Pistachio Pancake'], total: '$24.00', time: '14m ago', isUrgent: false, columnId: 'preparing' },
  { id: '#ORD-2045', type: 'Dine-In (Table 8)', items: ['3x Smoked Truffle Burger'], total: '$43.50', time: '18m ago', isUrgent: true, columnId: 'preparing' },
  { id: '#ORD-2046', type: 'Dine-In (Table 2)', items: ['2x Spanish Iced Latte'], total: '$13.00', time: '22m ago', isUrgent: false, columnId: 'ready' },
  { id: '#ORD-2044', type: 'Takeaway', items: ['1x Margherita Pizza'], total: '$18.00', time: '40m ago', isUrgent: false, columnId: 'completed' },
];
