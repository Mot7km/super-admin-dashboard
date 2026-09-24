import { useTranslation } from '../../../../../app/context/LanguageContext';
import { MapPin, Phone, Clock, Store, Edit, Trash2 } from 'lucide-react';
import type { Branch } from '../branches.types';

type BranchesLocationsTabProps = {
  branches: Branch[];
  onDeleteBranch: (branchId: string) => void;
  onEditBranch: (branch: Branch) => void;
};

const BranchesLocationsTab = ({ branches, onDeleteBranch, onEditBranch }: BranchesLocationsTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-3 sm:space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Header: icon + name + status + actions */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                    {branch.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold ring-1 mt-0.5 sm:mt-1 truncate max-w-[100px] ${branch.statusColor}`}
                  >
                    {branch.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <button
                  onClick={() => onEditBranch(branch)}
                  className="p-1 sm:p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer rounded-lg hover:bg-[var(--surface)]"
                  aria-label="Edit branch"
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => onDeleteBranch(branch.id)}
                  className="p-1 sm:p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  aria-label="Delete branch"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Details: address, phone, hours */}
            <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--color-border)]">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
                <span className="break-words">{branch.address}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)] shrink-0" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--text-muted)] shrink-0" />
                <span>{branch.hours}</span>
              </div>
            </div>
          </div>

          {/* Stats – now two rows: first row with sales & cashiers, second row with top dish */}
          <div className="space-y-2 pt-2 sm:pt-3 border-t border-[var(--color-border)]">
            {/* Row 1: Today Sales + Active Cashiers */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="rounded-xl bg-[var(--surface)] p-1.5 sm:p-2 text-center">
                <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] block leading-tight">
                  {t('branches.card.todaySales')}
                </span>
                <strong className="text-[10px] sm:text-sm text-[var(--primary)] font-extrabold block truncate">
                  {branch.todaySales}
                </strong>
              </div>
              <div className="rounded-xl bg-[var(--surface)] p-1.5 sm:p-2 text-center">
                <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] block leading-tight">
                  {t('branches.card.activePos')}
                </span>
                <strong className="text-[10px] sm:text-sm text-[var(--text-primary)] font-bold block truncate">
                  {branch.activeCashiers} {t('branches.card.cashiers')}
                </strong>
              </div>
            </div>

            {/* Row 2: Top Dish – full width, no truncation, word wrap */}
            <div className="rounded-xl bg-[var(--surface)] p-1.5 sm:p-2 text-center">
              <span className="text-[8px] sm:text-[10px] text-[var(--text-muted)] block leading-tight">
                {t('branches.card.topDish')}
              </span>
              <strong className="text-[10px] sm:text-sm text-amber-500 font-bold block break-words whitespace-normal">
                {t(branch.topDishKey)}
              </strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BranchesLocationsTab;