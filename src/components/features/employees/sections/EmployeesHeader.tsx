import { Plus, QrCode } from 'lucide-react';

type EmployeesHeaderProps = {
  title: string;
  subtitle: string;
  onAddStaff: () => void;
  onOpenQr: () => void;
  addLabel: string;
  qrLabel: string;
};

const EmployeesHeader = ({ title, subtitle, onAddStaff, onOpenQr, addLabel, qrLabel }: EmployeesHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl break-words">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:text-sm break-words">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onAddStaff}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] transition hover:bg-[var(--elevated)] cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[var(--primary)]" />
          <span>{addLabel}</span>
        </button>
        <button
          onClick={onOpenQr}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] cursor-pointer"
        >
          <QrCode className="h-4 w-4" />
          <span>{qrLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default EmployeesHeader;