import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HomeReview } from '../home.types';

type RecentReviewsProps = {
  recentReviews: HomeReview[];
};

const RecentReviews: FC<RecentReviewsProps> = ({ recentReviews }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          {t('dashboard.recentReviews')}
        </h2>
        <button
          onClick={() => navigate('/menu')}
          className="text-xs font-medium text-[var(--primary)] hover:underline bg-transparent border-0 p-0 cursor-pointer"
        >
          {t('dashboard.viewAll')}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {recentReviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[var(--text-primary)]">{rev.customer}</span>
                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 font-semibold text-amber-500">
                  ★ {rev.rating}.0
                </span>
              </div>
              <span className="text-[var(--text-muted)] text-[11px]">{t(rev.timeKey)}</span>
            </div>
            <p className="mt-1.5 font-medium text-[var(--text-secondary)]">
              "{t(rev.commentKey)}"
            </p>
            <div className="mt-2 text-[11px] font-semibold text-[var(--primary)]">
              {t(rev.dishKey)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReviews;