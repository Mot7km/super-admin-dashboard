import { AlertTriangle, RefreshCw } from 'lucide-react';

type Ingredient = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  lastRestock: string;
};

type InventoryStockTabProps = {
  ingredients: Ingredient[];
  onRestock: (id: string) => void;
  titleLabel: string;
  lowStockLabel: string;
  ingredientLabel: string;
  categoryLabel: string;
  supplierLabel: string;
  stockGaugeLabel: string;
  currentStockLabel: string;
  actionsLabel: string;
  stockRemainingLabel: string;
  restockLabel: string;
};

const InventoryStockTab = ({
  ingredients,
  onRestock,
  titleLabel,
  lowStockLabel,
  ingredientLabel,
  categoryLabel,
  supplierLabel,
  stockGaugeLabel,
  currentStockLabel,
  actionsLabel,
  stockRemainingLabel,
  restockLabel,
}: InventoryStockTabProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">{titleLabel}</h2>
          <span className="text-[10px] sm:text-xs font-semibold text-rose-500 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {lowStockLabel}
          </span>
        </div>

        {/* Table wrapper with horizontal scroll */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
          <table className="w-full text-left text-[10px] sm:text-xs min-w-[600px]">
            <thead className="border-b border-[var(--color-border)] bg-[var(--surface)] font-semibold text-[var(--text-muted)]">
              <tr>
                <th className="p-2 sm:p-3">{ingredientLabel}</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">{categoryLabel}</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">{supplierLabel}</th>
                <th className="p-2 sm:p-3">{stockGaugeLabel}</th>
                <th className="p-2 sm:p-3 hidden xs:table-cell">{currentStockLabel}</th>
                <th className="p-2 sm:p-3 text-right">{actionsLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {ingredients.map((ing) => {
                const percentage = Math.round((ing.currentStock / ing.maxStock) * 100);
                const isLow = percentage < 15;

                return (
                  <tr key={ing.id} className="hover:bg-[var(--elevated)]/40 transition">
                    {/* Name */}
                    <td className="p-2 sm:p-3 font-bold text-[var(--text-primary)] truncate max-w-[80px] sm:max-w-none">
                      {ing.name}
                    </td>

                    {/* Category – hidden on mobile */}
                    <td className="p-2 sm:p-3 text-[var(--text-secondary)] hidden sm:table-cell truncate max-w-[100px]">
                      {ing.category}
                    </td>

                    {/* Supplier – hidden on tablet and smaller */}
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      <span className="rounded-md bg-[var(--surface)] border border-[var(--color-border)] px-1.5 sm:px-2 py-0.5 font-medium text-[var(--text-muted)] text-[9px] sm:text-xs">
                        {ing.supplier}
                      </span>
                    </td>

                    {/* Stock gauge */}
                    <td className="p-2 sm:p-3 w-32 sm:w-48">
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8px] sm:text-[10px] font-bold">
                          <span className={isLow ? 'text-rose-500' : 'text-[var(--text-muted)]'}>
                            {percentage}% {stockRemainingLabel}
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-[var(--elevated)]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLow ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Current stock – hidden on very small screens */}
                    <td className="p-2 sm:p-3 font-bold text-[var(--text-primary)] hidden xs:table-cell whitespace-nowrap">
                      {ing.currentStock} / {ing.maxStock} {ing.unit}
                    </td>

                    {/* Actions */}
                    <td className="p-2 sm:p-3 text-right">
                      <button
                        onClick={() => onRestock(ing.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)]/10 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition cursor-pointer whitespace-nowrap"
                      >
                        <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>{restockLabel}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStockTab;