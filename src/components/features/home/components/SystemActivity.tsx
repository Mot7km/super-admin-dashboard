import type { FC } from 'react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { HomeActivityItem } from '../home.types';

type SystemActivityProps = {
  activityFeed: HomeActivityItem[];
};

const SystemActivity: FC<SystemActivityProps> = ({ activityFeed }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-5 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          {t('dashboard.systemActivity')}
        </h2>
      </div>
      <div className="mt-4 space-y-3">
        {activityFeed.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-[var(--text-primary)]">
                {t(item.titleKey)}
              </span>
            </div>
            <span className="shrink-0 text-[var(--text-muted)]">
              {t(item.timeKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemActivity;