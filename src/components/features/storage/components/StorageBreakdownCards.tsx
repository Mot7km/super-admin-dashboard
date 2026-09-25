import { memo, type FC } from 'react';
import {
  Image as ImageIcon,
  FileText,
  Database,
  ScrollText,
  FolderArchive,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { StorageCategoryBreakdown } from '../storage.types';

type StorageBreakdownCardsProps = {
  breakdown: StorageCategoryBreakdown;
};

export const StorageBreakdownCards: FC<StorageBreakdownCardsProps> = memo(({ breakdown }) => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 'images',
      titleKey: 'storage.categories.images',
      subtitleKey: 'storage.categories.imagesDesc',
      gb: breakdown.imagesGB,
      percent: breakdown.imagesPercent,
      icon: ImageIcon,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      barColor: 'bg-sky-500',
    },
    {
      id: 'documents',
      titleKey: 'storage.categories.documents',
      subtitleKey: 'storage.categories.documentsDesc',
      gb: breakdown.documentsGB,
      percent: breakdown.documentsPercent,
      icon: FileText,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      barColor: 'bg-indigo-500',
    },
    {
      id: 'backups',
      titleKey: 'storage.categories.backups',
      subtitleKey: 'storage.categories.backupsDesc',
      gb: breakdown.backupsGB,
      percent: breakdown.backupsPercent,
      icon: Database,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      barColor: 'bg-emerald-500',
    },
    {
      id: 'logs',
      titleKey: 'storage.categories.logs',
      subtitleKey: 'storage.categories.logsDesc',
      gb: breakdown.logsGB,
      percent: breakdown.logsPercent,
      icon: ScrollText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FolderArchive className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t('storage.categories.sectionTitle')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-2xl ${cat.bg} ${cat.color} border ${cat.border}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-sm font-bold text-foreground">
                  {cat.percent}%
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground">
                  {t(cat.titleKey)}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t(cat.subtitleKey)}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60">
                <div className="flex items-baseline justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{t('storage.categories.volume')}</span>
                  <span className="font-mono font-bold text-foreground">{cat.gb} GB</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

StorageBreakdownCards.displayName = 'StorageBreakdownCards';
