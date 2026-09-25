import { memo, useState, type FC } from 'react';
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  Pin,
  Eye,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemAnnouncement } from '../announcements.types';

type AnnouncementLiveBannerPreviewProps = {
  announcement: SystemAnnouncement | null;
};

export const AnnouncementLiveBannerPreview: FC<AnnouncementLiveBannerPreviewProps> = memo(({
  announcement,
}) => {
  const { t } = useTranslation();
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  if (!announcement) {
    return null;
  }

  const isRtl = lang === 'ar';
  const title = isRtl ? announcement.titleAr : announcement.title;
  const message = isRtl ? announcement.messageAr : announcement.message;
  const actionText = isRtl ? announcement.actionTextAr : announcement.actionText;

  const getTypeStyles = () => {
    switch (announcement.type) {
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600',
          badge: 'bg-sky-900/40 text-sky-100 border-sky-400/30',
          icon: Info,
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600',
          badge: 'bg-amber-900/40 text-amber-100 border-amber-400/30',
          icon: AlertTriangle,
        };
      case 'critical':
        return {
          bg: 'bg-gradient-to-r from-rose-700 via-rose-600 to-red-600',
          badge: 'bg-rose-950/40 text-rose-100 border-rose-400/30',
          icon: AlertCircle,
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600',
          badge: 'bg-emerald-950/40 text-emerald-100 border-emerald-400/30',
          icon: CheckCircle2,
        };
    }
  };

  const style = getTypeStyles();
  const Icon = style.icon;

  return (
    <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 shadow-sm space-y-3">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {t('announcements.preview.simulatorTitle')}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground">
            ({t('announcements.preview.simulatingCustomerView')})
          </span>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center rounded-xl bg-background border border-border p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLang('ar')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              lang === 'ar' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              lang === 'en' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Rendered Live Banner */}
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`relative overflow-hidden rounded-2xl p-4 text-white shadow-lg ${style.bg}`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/20 text-white shrink-0 mt-0.5">
              <Icon className="h-5 w-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm">{title}</span>
                {announcement.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                    <Pin className="h-3 w-3" />
                    {isRtl ? 'مثبت' : 'Pinned'}
                  </span>
                )}
                {announcement.targetLabels && announcement.targetLabels.length > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                    {announcement.targetLabels.join(', ')}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/90 leading-relaxed max-w-2xl">
                {message}
              </p>
            </div>
          </div>

          {/* Action Button & Dismiss */}
          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            {actionText && (
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-white/90 active:scale-95 transition-all"
              >
                <span>{actionText}</span>
                <ArrowRight className={`h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            )}

            {announcement.isDismissible && (
              <button
                type="button"
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

AnnouncementLiveBannerPreview.displayName = 'AnnouncementLiveBannerPreview';
