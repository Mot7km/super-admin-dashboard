import { FileText, Plus } from 'lucide-react';

type InventoryHeaderProps = {
  title: string;
  subtitle: string;
  addIngredientLabel: string;
  exportPoLabel: string;
  onAddIngredient: () => void;
  onExportPo: () => void;
};

const InventoryHeader = ({ title, subtitle, addIngredientLabel, exportPoLabel, onAddIngredient, onExportPo }: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">{title}</h1>
        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddIngredient}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--color-border)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--elevated)] transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[var(--primary)]" />
          <span>{addIngredientLabel}</span>
        </button>
        <button
          onClick={onExportPo}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          <span>{exportPoLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryHeader;