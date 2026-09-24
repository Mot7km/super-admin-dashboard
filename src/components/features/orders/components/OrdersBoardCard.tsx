import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

type Order = {
  id: string;
  type: string;
  items: string[];
  total: string;
  time: string;
  isUrgent: boolean;
  columnId: 'new' | 'preparing' | 'ready' | 'completed';
};

type OrdersBoardCardProps = {
  order: Order;
  borderColor: string;
  onMove: (id: string, nextCol: 'new' | 'preparing' | 'ready' | 'completed') => void;
  nextAction?: 'new' | 'preparing' | 'ready' | 'completed';
  actionLabel: string;
  delayedLabel: string;
  completeLabel: string;
  locale: 'ar' | 'en';
};

const OrdersBoardCard = ({ order, borderColor, onMove, nextAction, actionLabel, delayedLabel, completeLabel, locale }: OrdersBoardCardProps) => {
  return (
    <div className={`rounded-xl border ${borderColor} bg-[var(--surface)] p-4 shadow-md space-y-3 relative group transition hover:border-[var(--primary)]`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-sm text-[var(--text-primary)]">{order.id}</span>
        <span className="flex items-center gap-1 text-[var(--text-muted)] text-[11px]">
          <Clock className="h-3 w-3" />
          {order.time}
        </span>
      </div>

      <div className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md w-max">{order.type}</div>

      <ul className="text-xs text-[var(--text-secondary)] space-y-1 pt-1 border-t border-[var(--color-border)]">
        {order.items.map((item, idx) => (
          <li key={idx} className="font-medium">• {item}</li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)] text-xs">
        <span className="font-bold text-[var(--text-primary)]">{order.total}</span>
        {order.isUrgent && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 animate-pulse">
            <AlertCircle className="h-3 w-3" /> {delayedLabel}
          </span>
        )}
      </div>

      {nextAction && (
        <button
          onClick={() => onMove(order.id, nextAction)}
          className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] py-2 text-xs font-bold text-white shadow hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          <span>{actionLabel}</span>
          {locale === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      )}

      {order.columnId === 'completed' && (
        <div className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-xs pt-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>{completeLabel}</span>
        </div>
      )}
    </div>
  );
};

export default OrdersBoardCard;