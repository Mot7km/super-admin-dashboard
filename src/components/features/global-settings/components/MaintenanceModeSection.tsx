import { memo, useState, type FC, type FormEvent } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Eye,
  Save,
  Radio,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { MaintenanceSettings, GeneralSettings } from '../global-settings.types';
import { MaintenanceLivePreviewModal } from './MaintenanceLivePreviewModal';

type MaintenanceModeSectionProps = {
  data: MaintenanceSettings;
  general: GeneralSettings;
  onChange: (updated: Partial<MaintenanceSettings>) => void;
  onSave: () => void;
};

export const MaintenanceModeSection: FC<MaintenanceModeSectionProps> = memo(({
  data,
  general,
  onChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Hero Maintenance Mode Activation Card */}
      <div className={`rounded-3xl border transition-all p-6 sm:p-7 shadow-sm ${
        data.isActive
          ? 'border-rose-500/50 bg-rose-500/5 shadow-rose-500/10'
          : 'border-border/80 bg-card/60 backdrop-blur-xl'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border ${
              data.isActive
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                : 'bg-muted text-muted-foreground border-border'
            }`}>
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-foreground">
                  {t('globalSettings.maintenance.modeTitle')}
                </h3>
                {data.isActive ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                    <Radio className="h-3 w-3" />
                    503 ACTIVE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
                    OFFLINE / INACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {t('globalSettings.maintenance.modeSubtitle')}
              </p>
            </div>
          </div>

          {/* Toggle Hero Switch */}
          <div className="flex items-center gap-3 self-end md:self-center">
            <button
              type="button"
              role="switch"
              aria-checked={data.isActive}
              onClick={() => onChange({ isActive: !data.isActive })}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                data.isActive ? 'bg-rose-600' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  data.isActive ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-extrabold ${data.isActive ? 'text-rose-500' : 'text-muted-foreground'}`}>
              {data.isActive ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Warning Callout when Active */}
        {data.isActive && (
          <div className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-sm mb-0.5">
                {t('globalSettings.maintenance.activeWarningTitle')}
              </span>
              {t('globalSettings.maintenance.activeWarningDesc')}
            </div>
          </div>
        )}
      </div>

      {/* 2. Admin Bypass Configuration Card */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.maintenance.bypassTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.maintenance.bypassSubtitle')}
            </p>
          </div>
        </div>

        {/* Allow Super Admin Access Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/80">
          <div>
            <span className="text-xs font-bold text-foreground block">
              {t('globalSettings.maintenance.allowAdminAccessTitle')}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {t('globalSettings.maintenance.allowAdminAccessDesc')}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.allowAdminAccess}
            onClick={() => onChange({ allowAdminAccess: !data.allowAdminAccess })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              data.allowAdminAccess ? 'bg-emerald-500' : 'bg-muted-foreground/30'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                data.allowAdminAccess ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Messages & Schedule Configuration Card */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('globalSettings.maintenance.messagesTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('globalSettings.maintenance.messagesSubtitle')}
              </p>
            </div>
          </div>

          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('globalSettings.maintenance.preview503')}</span>
          </button>
        </div>

        {/* Estimated End Time */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {t('globalSettings.maintenance.estimatedEndTime')}
          </label>
          <input
            type="text"
            value={data.estimatedEndTime}
            onChange={(e) => onChange({ estimatedEndTime: e.target.value })}
            placeholder="e.g. 2026-09-25 14:00 (GMT+3) or 2:00 AM"
            className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
          />
        </div>

        {/* Arabic Message */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {t('globalSettings.maintenance.messageAr')} (العربية)
          </label>
          <textarea
            rows={3}
            dir="rtl"
            value={data.messageAr}
            onChange={(e) => onChange({ messageAr: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground leading-relaxed"
          />
        </div>

        {/* English Message */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1.5">
            {t('globalSettings.maintenance.messageEn')} (English)
          </label>
          <textarea
            rows={3}
            dir="ltr"
            value={data.messageEn}
            onChange={(e) => onChange({ messageEn: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground leading-relaxed"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>{t('globalSettings.actions.saveSettings')}</span>
        </button>
      </div>

      {/* Live Preview Modal */}
      <MaintenanceLivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maintenance={data}
        general={general}
      />
    </form>
  );
});

MaintenanceModeSection.displayName = 'MaintenanceModeSection';
