import { memo, type FC, type FormEvent } from 'react';
import {
  Globe,
  Coins,
  Mail,
  Phone,
  Save,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GeneralSettings } from '../global-settings.types';
import { SUPPORTED_CURRENCIES, SUPPORTED_TIMEZONES } from '../global-settings.mock';

type GeneralSettingsSectionProps = {
  data: GeneralSettings;
  onChange: (updated: Partial<GeneralSettings>) => void;
  onSave: () => void;
};

export const GeneralSettingsSection: FC<GeneralSettingsSectionProps> = memo(({
  data,
  onChange,
  onSave,
}) => {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Brand & Identity Card */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.general.brandTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.general.brandSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Platform Name */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.platformName')} *
            </label>
            <input
              type="text"
              value={data.platformName}
              onChange={(e) => onChange({ platformName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.logoUrl')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={data.platformLogoUrl}
                onChange={(e) => onChange({ platformLogoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                LOGO
              </div>
            </div>
          </div>

          {/* Platform Tagline */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.tagline')}
            </label>
            <input
              type="text"
              value={data.platformTagline}
              onChange={(e) => onChange({ platformTagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>
        </div>
      </div>

      {/* 2. Localization & Regional Defaults Card */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.general.regionalTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.general.regionalSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Default Currency */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.defaultCurrency')}
            </label>
            <select
              value={data.defaultCurrency}
              onChange={(e) => onChange({ defaultCurrency: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Default Platform Language */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.defaultLanguage')}
            </label>
            <select
              value={data.defaultLanguage}
              onChange={(e) => onChange({ defaultLanguage: e.target.value as 'ar' | 'en' })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="ar">العربية (Arabic - Default RTL)</option>
              <option value="en">English (English - LTR)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.timezone')}
            </label>
            <select
              value={data.timezone}
              onChange={(e) => onChange({ timezone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Support & Legal Invariants Card */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.general.supportLegalTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.general.supportLegalSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Support Email */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.supportEmail')}
            </label>
            <div className="relative">
              <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={data.supportEmail}
                onChange={(e) => onChange({ supportEmail: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.supportPhone')}
            </label>
            <div className="relative">
              <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={data.supportPhone}
                onChange={(e) => onChange({ supportPhone: e.target.value })}
                className="w-full ps-10 pe-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.general.copyright')}
            </label>
            <input
              type="text"
              value={data.copyrightText}
              onChange={(e) => onChange({ copyrightText: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>
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
    </form>
  );
});

GeneralSettingsSection.displayName = 'GeneralSettingsSection';
