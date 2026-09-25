import { memo, type FC, type FormEvent } from 'react';
import {
  Building,
  UserCheck,
  Save,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { BusinessPolicySettings } from '../global-settings.types';

type BusinessPoliciesSectionProps = {
  data: BusinessPolicySettings;
  onChange: (updated: Partial<BusinessPolicySettings>) => void;
  onSave: () => void;
};

export const BusinessPoliciesSection: FC<BusinessPoliciesSectionProps> = memo(({
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
      {/* 1. Tenant Creation & Growth Limits */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.business.tenantLimitsTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.business.tenantLimitsSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Max Businesses Per Owner */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.business.maxBizPerOwner')}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={data.maxBusinessesPerOwner}
              onChange={(e) => onChange({ maxBusinessesPerOwner: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {t('globalSettings.business.maxBizPerOwnerHint')}
            </span>
          </div>

          {/* Default Trial Days */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.business.defaultTrialDays')}
            </label>
            <input
              type="number"
              min="0"
              max="90"
              value={data.defaultTrialDays}
              onChange={(e) => onChange({ defaultTrialDays: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {t('globalSettings.business.defaultTrialDaysHint')}
            </span>
          </div>

          {/* Auto-suspend Inactive Days */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.business.autoSuspendDays')}
            </label>
            <input
              type="number"
              min="15"
              max="365"
              value={data.autoSuspendInactiveDays}
              onChange={(e) => onChange({ autoSuspendInactiveDays: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {t('globalSettings.business.autoSuspendDaysHint')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Onboarding & Registration Invariants */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.business.onboardingRulesTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.business.onboardingRulesSubtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Public Registration Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/80">
            <div>
              <span className="text-xs font-bold text-foreground block">
                {t('globalSettings.business.allowPublicRegTitle')}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t('globalSettings.business.allowPublicRegDesc')}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.allowPublicRegistration}
              onClick={() => onChange({ allowPublicRegistration: !data.allowPublicRegistration })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                data.allowPublicRegistration ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.allowPublicRegistration ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* KYC Verification Requirement */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/80">
            <div>
              <span className="text-xs font-bold text-foreground block">
                {t('globalSettings.business.requireKycTitle')}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t('globalSettings.business.requireKycDesc')}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.requireKycVerification}
              onClick={() => onChange({ requireKycVerification: !data.requireKycVerification })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                data.requireKycVerification ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.requireKycVerification ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
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

BusinessPoliciesSection.displayName = 'BusinessPoliciesSection';
