import { Zap } from 'lucide-react';

type MenuHeaderProps = {
  title: string;
  subtitle: string;
  peakHourLabel: string;
  isPeakHour: boolean;
  onTogglePeak: () => void;
};

const MenuHeader = ({ title, subtitle, peakHourLabel, isPeakHour, onTogglePeak }: MenuHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl break-words">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:text-sm break-words">
          {subtitle}
        </p>
      </div>

      <button
        onClick={onTogglePeak}
        className={`
          flex w-full sm:w-auto items-center justify-center gap-2 
          rounded-xl px-4 py-2.5 sm:px-3.5 sm:py-2 
          text-xs font-bold transition shadow-sm cursor-pointer
          ${
            isPeakHour
              ? 'bg-amber-500 text-white ring-2 ring-amber-500/30'
              : 'border border-[var(--color-border)] bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }
        `}
      >
        <Zap className="h-4 w-4 shrink-0" />
        <span className="truncate">{peakHourLabel}</span>
      </button>
    </div>
  );
};

export default MenuHeader;