import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { useTranslation } from '../../../app/context/LanguageContext';

interface EmptyStateProps {
  icon?: LucideIcon;
  titleKey?: string;
  title?: string;
  subtitleKey?: string;
  subtitle?: string;
  actionLabelKey?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  titleKey,
  title,
  subtitleKey,
  subtitle,
  actionLabelKey,
  actionLabel,
  onAction,
}) => {
  const { t } = useTranslation();

  const displayTitle = titleKey ? t(titleKey) : title || t('common.noResults');
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  const displayAction = actionLabelKey ? t(actionLabelKey) : actionLabel;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--surface)]/50 my-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-3 ring-1 ring-[var(--primary)]/20">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-[var(--text-primary)]">{displayTitle}</h3>
      {displaySubtitle && (
        <p className="mt-1 text-xs text-[var(--text-muted)] max-w-sm">{displaySubtitle}</p>
      )}
      {displayAction && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          {displayAction}
        </button>
      )}
    </div>
  );
};

export default EmptyState;