import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { MenuSlider } from '../menu.types';

type SlidersSectionProps = {
  sliders: MenuSlider[];
  onOpenAddSlider: () => void;
  onDeleteSlider: (slider: MenuSlider) => void;
};

const SlidersSection = ({ sliders, onOpenAddSlider, onDeleteSlider }: SlidersSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">{t('menu.sliders.title')}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{t('menu.sliders.sub')}</p>
        </div>
        <button
          onClick={onOpenAddSlider}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t('menu.sliders.addItem')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sliders.map((slide) => (
          <div key={slide.id} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-lg group">
            <div className="relative h-44 w-full overflow-hidden bg-slate-900">
              <img
                src={slide.image}
                alt="Banner"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <span className="rounded-md bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white w-max mb-1">
                  {slide.status}
                </span>
                <h3 className="font-bold text-white text-sm leading-snug">
                  {slide.titleKey.includes('.') ? t(slide.titleKey) : slide.titleKey}
                </h3>
                <p className="text-xs text-slate-300">
                  {slide.subtitleKey.includes('.') ? t(slide.subtitleKey) : slide.subtitleKey}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3.5 text-xs">
              <span className="text-[var(--text-muted)]">
                {t('menu.sliders.targetLabel')}{' '}
                <strong className="text-[var(--text-primary)]">
                  {slide.targetKey.includes('.') ? t(slide.targetKey) : slide.targetKey}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--primary)] cursor-pointer"
                  aria-label={t('common.edit')}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteSlider(slide)}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-rose-500 cursor-pointer"
                  aria-label={t('common.delete')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidersSection;