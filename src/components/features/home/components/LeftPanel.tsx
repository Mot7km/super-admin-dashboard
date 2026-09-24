import type { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { useToast } from '../../../common/Toast';
import Select from '../../../ui/Select'; // adjust path
import type { HomeProduct } from '../home.types';

type LeftPanelProps = {
  topProducts: HomeProduct[];
  productFilter: string;
  onProductFilterChange: (value: string) => void;
};

const LeftPanel: FC<LeftPanelProps> = ({
  topProducts,
  productFilter,
  onProductFilterChange,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const categories = [
    { key: 'catBurgers', percentage: 42, color: 'bg-blue-500' },
    { key: 'catDrinks', percentage: 28, color: 'bg-teal-500' },
    { key: 'catDesserts', percentage: 18, color: 'bg-amber-500' },
    { key: 'catSides', percentage: 12, color: 'bg-sky-500' },
  ];

  // Options for the custom Select
  const filterOptions = [
    { value: 'byViews', label: t('dashboard.byViews') },
    { value: 'byRating', label: t('dashboard.byRating') },
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg lg:col-span-6">
      {/* Top Products */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {t('dashboard.topProducts')}
          </h2>
          {/* 🔥 Custom Select instead of native dropdown */}
          <Select
            value={productFilter}
            onChange={onProductFilterChange}
            options={filterOptions}
            className="w-auto min-w-[120px]"
          />
        </div>

        <div className="mt-4 flex-1 space-y-4">
          {topProducts.map((prod) => (
            <div key={prod.nameKey} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[var(--text-secondary)]">{t(prod.nameKey)}</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {prod.views} {t('common.views')}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--elevated)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${prod.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Sales */}
      <div className="mt-6 pt-5 border-t border-[var(--color-border)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wide text-[var(--text-muted)] uppercase">
            {t('dashboard.categorySales')}
          </h3>
          <span className="text-[11px] font-bold text-[var(--primary)]">$3,420 Total</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 space-y-1"
            >
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text-secondary)]">{t(`dashboard.${cat.key}`)}</span>
                <span className="text-[var(--text-primary)] font-bold">{cat.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--elevated)]">
                <div className={`h-full ${cat.color} w-[${cat.percentage}%]`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-3 text-xs">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="font-bold text-[var(--text-primary)]">
            {t('dashboard.aiRecommendation')}
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {t('dashboard.aiText')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            showToast('Night Offer Banner Activated!', 'success');
            navigate('/menu?tab=sliders');
          }}
          className="shrink-0 rounded-lg bg-[var(--primary)] px-2.5 py-1.5 text-[11px] font-bold text-white shadow hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          {t('dashboard.activateOffer')}
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;