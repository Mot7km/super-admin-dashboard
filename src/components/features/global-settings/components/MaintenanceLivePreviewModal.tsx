import { memo, useState, type FC } from 'react';
import {
  Wrench,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { MaintenanceSettings, GeneralSettings } from '../global-settings.types';

type MaintenanceLivePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  maintenance: MaintenanceSettings;
  general: GeneralSettings;
};

export const MaintenanceLivePreviewModal: FC<MaintenanceLivePreviewModalProps> = memo(({
  isOpen,
  onClose,
  maintenance,
  general,
}) => {
  const { t } = useTranslation();
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar');

  if (!isOpen) return null;

  const isRtl = previewLang === 'ar';
  const displayMessage = isRtl ? maintenance.messageAr : maintenance.messageEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top bar controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {t('globalSettings.maintenance.livePreviewTitle')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang switch preview */}
            <div className="flex items-center rounded-xl bg-background border border-border p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewLang('ar')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  previewLang === 'ar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  previewLang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 503 Render Canvas */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="flex-1 overflow-y-auto p-8 sm:p-14 flex flex-col items-center justify-center text-center bg-gradient-to-b from-card via-background to-muted/40"
        >
          {/* Brand logo / title */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center shadow-lg shadow-primary/20">
              M
            </div>
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              {general.platformName}
            </span>
          </div>

          {/* Maintenance Icon */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-rose-500/10 blur-xl animate-pulse" />
            <div className="relative p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-xl">
              <Wrench className="h-12 w-12 sm:h-16 sm:w-16 animate-bounce" />
            </div>
          </div>

          {/* 503 Code */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-3">
            HTTP 503 • {isRtl ? 'النظام تحت الصيانة المجدولة' : 'Scheduled Maintenance Mode'}
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground max-w-lg">
            {isRtl
              ? 'نعمل حالياً على تحسين وتحديث منصتكم'
              : 'We Are Currently Upgrading Your Platform'}
          </h2>

          <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
            {displayMessage}
          </p>

          {/* Estimated End Time Card */}
          {maintenance.estimatedEndTime && (
            <div className="mt-8 flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/80 shadow-md">
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="text-start">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  {isRtl ? 'الوقت المتوقع لعودة الخدمة' : 'Estimated Return Time'}
                </span>
                <span className="text-sm font-mono font-bold text-foreground">
                  {maintenance.estimatedEndTime}
                </span>
              </div>
            </div>
          )}

          {/* Admin Bypass note */}
          {maintenance.allowAdminAccess && (
            <div className="mt-6 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isRtl
                  ? 'بوابة المشرفين متاحة للدخول (Super Admin Bypass Active)'
                  : 'Super Admin Bypass Active for Authorized Operators'}
              </span>
            </div>
          )}

          {/* Support contact info */}
          <div className="mt-10 pt-6 border-t border-border/60 text-xs text-muted-foreground">
            {isRtl ? 'بحاجة لمساعدة فورية؟' : 'Need urgent support?'} {general.supportEmail}
          </div>
        </div>
      </div>
    </div>
  );
});

MaintenanceLivePreviewModal.displayName = 'MaintenanceLivePreviewModal';
