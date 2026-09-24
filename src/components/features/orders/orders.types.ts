export type OrderColumn = 'new' | 'preparing' | 'ready' | 'completed';

export type Order = {
  id: string;
  type: string;
  items: string[];
  total: string;
  time: string;
  isUrgent: boolean;
  columnId: OrderColumn;
};
