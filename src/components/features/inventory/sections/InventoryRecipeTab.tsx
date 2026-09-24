import { Plus } from 'lucide-react';

type InventoryRecipeTabProps = {
  title: string;
  linkRecipeLabel: string;
  deductsHeader: string;
  onOpenRecipe: () => void;
};

const InventoryRecipeTab = ({ title, linkRecipeLabel, deductsHeader, onOpenRecipe }: InventoryRecipeTabProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-3 sm:space-y-4">
      {/* Header: title + button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] break-words">
          {title}
        </h2>
        <button
          onClick={onOpenRecipe}
          className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] px-3 py-2 sm:px-3 sm:py-1.5 text-xs font-bold text-[var(--primary)] transition hover:bg-[var(--elevated)] cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{linkRecipeLabel}</span>
        </button>
      </div>

      {/* Recipe deductions list */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-4 text-[10px] sm:text-xs space-y-1.5 sm:space-y-2">
        <h4 className="font-bold text-[var(--primary)]">{deductsHeader}</h4>
        <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-[var(--text-secondary)]">
          <li>1x Brioche Burger Bun</li>
          <li>1x Angus Beef Patty (180g)</li>
          <li>15 ml Truffle Oil Sauce</li>
        </ul>
      </div>
    </div>
  );
};

export default InventoryRecipeTab;