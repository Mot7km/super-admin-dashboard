import { memo, useState, type FC, type FormEvent } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Save,
  Lock,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SecuritySettings } from '../global-settings.types';

type SecurityPoliciesSectionProps = {
  data: SecuritySettings;
  onChange: (updated: Partial<SecuritySettings>) => void;
  onSave: () => void;
};

export const SecurityPoliciesSection: FC<SecurityPoliciesSectionProps> = memo(({
  data,
  onChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const [newIpInput, setNewIpInput] = useState('');
  const [ipError, setIpError] = useState<string | null>(null);

  const handleAddIp = () => {
    const trimmed = newIpInput.trim();
    if (!trimmed) return;
    if (data.ipWhitelist.includes(trimmed)) {
      setIpError(t('globalSettings.security.ipAlreadyExists'));
      return;
    }
    onChange({ ipWhitelist: [...data.ipWhitelist, trimmed] });
    setNewIpInput('');
    setIpError(null);
  };

  const handleRemoveIp = (ipToRemove: string) => {
    onChange({ ipWhitelist: data.ipWhitelist.filter((ip) => ip !== ipToRemove) });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Session & Authentication Controls */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.security.authSessionsTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.security.authSessionsSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Inactivity Timeout */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.security.sessionTimeout')} ({t('globalSettings.security.minutes')})
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={data.sessionTimeoutMinutes}
              onChange={(e) => onChange({ sessionTimeoutMinutes: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {t('globalSettings.security.sessionTimeoutHint')}
            </span>
          </div>

          {/* Max Failed Attempts */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {t('globalSettings.security.maxLoginAttempts')}
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={data.maxLoginAttempts}
              onChange={(e) => onChange({ maxLoginAttempts: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              required
            />
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {t('globalSettings.security.maxLoginAttemptsHint')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Password & 2FA Governance */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t('globalSettings.security.password2faTitle')}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t('globalSettings.security.password2faSubtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Min password length */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                {t('globalSettings.security.passwordMinLength')}
              </label>
              <input
                type="number"
                min="8"
                max="32"
                value={data.passwordMinLength}
                onChange={(e) => onChange({ passwordMinLength: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                required
              />
            </div>

            {/* Require special character toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/30 border border-border/80">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {t('globalSettings.security.requireSpecialChar')}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {t('globalSettings.security.specialCharDesc')}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={data.requireSpecialChar}
                onClick={() => onChange({ requireSpecialChar: !data.requireSpecialChar })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  data.requireSpecialChar ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    data.requireSpecialChar ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mandatory 2FA for Admins */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div>
              <span className="text-xs font-bold text-foreground block">
                {t('globalSettings.security.enforce2faTitle')}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t('globalSettings.security.enforce2faDesc')}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.require2FAForAdmins}
              onClick={() => onChange({ require2FAForAdmins: !data.require2FAForAdmins })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                data.require2FAForAdmins ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.require2FAForAdmins ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. IP Whitelist Perimeter */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('globalSettings.security.ipWhitelistTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('globalSettings.security.ipWhitelistSubtitle')}
              </p>
            </div>
          </div>

          {/* Whitelist Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">
              {data.ipWhitelistEnabled
                ? t('globalSettings.security.whitelistActive')
                : t('globalSettings.security.whitelistDisabled')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={data.ipWhitelistEnabled}
              onClick={() => onChange({ ipWhitelistEnabled: !data.ipWhitelistEnabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                data.ipWhitelistEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.ipWhitelistEnabled ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* IP Inputs and List */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newIpInput}
              onChange={(e) => setNewIpInput(e.target.value)}
              placeholder="e.g. 192.168.1.150 or 156.204.0.0/16"
              className="flex-1 px-3.5 py-2 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
            <button
              type="button"
              onClick={handleAddIp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>{t('globalSettings.security.addIp')}</span>
            </button>
          </div>

          {ipError && (
            <p className="text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{ipError}</span>
            </p>
          )}

          {/* List of active whitelist IPs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {data.ipWhitelist.map((ip) => (
              <div
                key={ip}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs font-mono text-foreground"
              >
                <span>{ip}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveIp(ip)}
                  className="text-muted-foreground hover:text-rose-500 transition-colors p-0.5"
                  title="Remove IP"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
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

SecurityPoliciesSection.displayName = 'SecurityPoliciesSection';
