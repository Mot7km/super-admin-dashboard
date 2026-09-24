import { type FC, useState } from 'react';
import { Store, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import Select from '../../../ui/Select';
import DateRangePicker from '../../../ui/DateRangePicker';

type HomeHeaderProps = {
  selectedBranch: string;
  isChimeMuted: boolean;
  onBranchChange: (value: string) => void;
  onToggleChime: () => void;
};

const HomeHeader: FC<HomeHeaderProps> = ({
  selectedBranch,
  isChimeMuted,
  onBranchChange,
  onToggleChime,
}) => {
  const { t } = useTranslation();

  const today = new Date();
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: today,
    end: today,
  });

  const branchOptions = [
    { value: 'all', label: t('dashboard.allBranches') },
    { value: 'main', label: t('dashboard.mainBranch') },
    { value: 'mall', label: t('dashboard.mallBranch') },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Title + subtitle + badge */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl truncate">
              {t('dashboard.title')}
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 ring-1 ring-emerald-500/20 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="whitespace-nowrap">{t('dashboard.liveKitchen')}</span>
              <button
                onClick={onToggleChime}
                className="ml-1 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                title={isChimeMuted ? t('dashboard.soundChimeMute') : t('dashboard.soundChimeOn')}
                aria-label="Toggle chime sound"
              >
                {isChimeMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Right: Controls – always on the same row */}
        <div className="flex flex-row flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Select
            value={selectedBranch}
            onChange={onBranchChange}
            options={branchOptions}
            leftIcon={<Store className="h-4 w-4" />}
            className="flex-1 min-w-[140px] lg:w-48"
          />
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={t('dashboard.dateRange') || 'Select date range'}
            className="flex-1 min-w-[140px] lg:w-56"
          />
        </div>
      </div>
    </>
  );
};

export default HomeHeader;