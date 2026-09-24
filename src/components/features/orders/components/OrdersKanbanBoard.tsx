import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ChefHat, Clock } from 'lucide-react';
import EmptyState from '../../../common/EmptyState';

type Order = {
  id: string;
  type: string;
  items: string[];
  total: string;
  time: string;
  isUrgent: boolean;
  columnId: 'new' | 'preparing' | 'ready' | 'completed';
};

type OrdersKanbanBoardProps = {
  orders: Order[];
  locale: 'ar' | 'en';
  onMove: (id: string, nextCol: 'new' | 'preparing' | 'ready' | 'completed') => void;
  emptyTitle: string;
  delayedLabel: string;
  completeLabel: string;
  titleMap: Record<string, string>;
  actionMap: Record<string, string>;
};

const columns = [
  { id: 'new', borderColor: 'border-blue-500/40', badgeColor: 'bg-blue-500/10 text-blue-500 ring-blue-500/20', nextAction: 'preparing' as const },
  { id: 'preparing', borderColor: 'border-amber-500/40', badgeColor: 'bg-amber-500/10 text-amber-500 ring-amber-500/20', nextAction: 'ready' as const },
  { id: 'ready', borderColor: 'border-emerald-500/40', badgeColor: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20', nextAction: 'completed' as const },
  { id: 'completed', borderColor: 'border-[var(--color-border)]', badgeColor: 'bg-[var(--elevated)] text-[var(--text-secondary)] ring-[var(--color-border)]', nextAction: null },
];

const OrdersKanbanBoard = ({ orders, locale, onMove, emptyTitle, delayedLabel, completeLabel, titleMap, actionMap }: OrdersKanbanBoardProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => {
        const colOrders = orders.filter((o) => o.columnId === col.id);

        return (
          <div key={col.id} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 shadow-lg h-full">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">{titleMap[col.id]}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${col.badgeColor}`}>
                {colOrders.length}
              </span>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto hide-scrollbar">
              {colOrders.length === 0 ? (
                <EmptyState icon={ChefHat} titleKey={emptyTitle} />
              ) : (
                colOrders.map((ord) => (
                  <div key={ord.id} className={`rounded-xl border ${col.borderColor} bg-[var(--surface)] p-4 shadow-md space-y-3 relative group transition hover:border-[var(--primary)]`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sm text-[var(--text-primary)]">{ord.id}</span>
                      <span className="flex items-center gap-1 text-[var(--text-muted)] text-[11px]">
                        <Clock className="h-3 w-3" />
                        {ord.time}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md w-max">{ord.type}</div>

                    <ul className="text-xs text-[var(--text-secondary)] space-y-1 pt-1 border-t border-[var(--color-border)]">
                      {ord.items.map((item, idx) => (
                        <li key={idx} className="font-medium">• {item}</li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
                      <span className="font-bold text-[var(--text-primary)]">{ord.total}</span>
                      {ord.isUrgent && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 animate-pulse">
                          <AlertCircle className="h-3 w-3" /> {delayedLabel}
                        </span>
                      )}
                    </div>

                    {col.nextAction && (
                      <button
                        onClick={() => onMove(ord.id, col.nextAction)}
                        className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] py-2 text-xs font-bold text-white shadow hover:bg-[var(--primary-dark)] transition cursor-pointer"
                      >
                        <span>{actionMap[col.id]}</span>
                        {locale === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                      </button>
                    )}

                    {col.id === 'completed' && (
                      <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-xs pt-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{completeLabel}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersKanbanBoard;