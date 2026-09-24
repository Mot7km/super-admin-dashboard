import { Check, X, Grid } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AvailabilityMatrixRow } from '../branches.types';

type BranchesMatrixTabProps = {
  matrix: AvailabilityMatrixRow[];
  onToggleMatrix: (idx: number, branchKey: 'mainBranch' | 'mallBranch') => void;
};

const BranchesMatrixTab = ({ matrix, onToggleMatrix }: BranchesMatrixTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-4">
      {/* Header with icon */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <Grid className="h-5 w-5 text-[var(--primary)] shrink-0" />
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            {t('branches.matrixTitle')}
          </h2>
          <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            {t('branches.matrixSubtitle')}
          </p>
        </div>
      </div>

      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
        <table className="w-full text-left text-[10px] sm:text-xs min-w-[400px]">
          <thead className="border-b border-[var(--color-border)] bg-[var(--surface)] font-semibold text-[var(--text-muted)]">
            <tr>
              <th className="p-2 sm:p-3">{t('branches.headers.dish')}</th>
              <th className="p-2 sm:p-3 text-center">{t('branches.headers.mainBranch')}</th>
              <th className="p-2 sm:p-3 text-center">{t('branches.headers.mallBranch')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {matrix.map((item, idx) => (
              <tr key={idx} className="hover:bg-[var(--elevated)]/40 transition">
                <td className="p-2 sm:p-3 font-bold text-[var(--text-primary)] truncate max-w-[120px] sm:max-w-none">
                  {t(item.dishKey)}
                </td>
                <td className="p-2 sm:p-3 text-center">
                  <button
                    onClick={() => onToggleMatrix(idx, 'mainBranch')}
                    className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
                      item.mainBranch
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                    aria-label={item.mainBranch ? 'Remove from main branch' : 'Add to main branch'}
                  >
                    {item.mainBranch ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </button>
                </td>
                <td className="p-2 sm:p-3 text-center">
                  <button
                    onClick={() => onToggleMatrix(idx, 'mallBranch')}
                    className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
                      item.mallBranch
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                    }`}
                    aria-label={item.mallBranch ? 'Remove from mall branch' : 'Add to mall branch'}
                  >
                    {item.mallBranch ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchesMatrixTab;