// src/components/branches/BranchesHoursTab.tsx (adjust path as needed)
import { useState } from 'react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { Clock } from 'lucide-react';
import TimeRangePicker from '../../../ui/TimeRangeSlider';

type DaySchedule = {
  day: string;
  open: boolean;
  from: string;
  to: string;
};

const BranchesHoursTab = () => {
  const { t, dir = 'ltr' } = useTranslation() as { t: (key: string) => string; dir?: 'ltr' | 'rtl' };

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'monday', open: true, from: '09:00', to: '23:00' },
    { day: 'tuesday', open: true, from: '09:00', to: '23:00' },
    { day: 'wednesday', open: true, from: '09:00', to: '23:00' },
    { day: 'thursday', open: true, from: '09:00', to: '23:00' },
    { day: 'friday', open: true, from: '09:00', to: '23:00' },
    { day: 'saturday', open: true, from: '10:00', to: '22:00' },
    { day: 'sunday', open: false, from: '00:00', to: '00:00' },
  ]);

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item
      )
    );
  };

  const updateTimeRange = (index: number, from: string, to: string) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, from, to } : item
      )
    );
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-4">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <Clock className="h-5 w-5 text-[var(--primary)] shrink-0" />
        <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
          {t('branches.scheduleTitle')}
        </h2>
      </div>

      <div className="space-y-3">
        {schedule.map((item, index) => {
          const isOpen = item.open;

          return (
            <div
              key={item.day}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:p-4 space-y-2.5 hover:border-[var(--primary)]/30 transition"
            >
              {/* Row 1: Day name + Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[var(--text-primary)] text-sm">
                  {t(`branches.days.${item.day}`)}
                </span>

                <button
                  onClick={() => toggleDay(index)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                    isOpen ? 'bg-[var(--primary)]' : 'bg-[var(--color-border)]'
                  }`}
                  aria-label={isOpen ? 'Close' : 'Open'}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200"
                    style={{
                      [dir === 'rtl' ? 'right' : 'left']: isOpen
                        ? `calc(100% - 1.25rem - 2px)`
                        : '2px',
                    }}
                  />
                </button>
              </div>

              {/* Row 2: TimeRangeSlider (only when open) */}
              {isOpen ? (
                <TimeRangePicker
                  from={item.from}
                  to={item.to}
                  onChange={(from, to) => updateTimeRange(index, from, to)}
                  compact={false}
                />
              ) : (
                <div className="text-[10px] font-semibold text-rose-500">
                  {t('branches.closedBadge') || 'Closed'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BranchesHoursTab;