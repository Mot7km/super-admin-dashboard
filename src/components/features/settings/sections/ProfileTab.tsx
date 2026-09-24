import React from 'react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { Store, Building2, Clock, Share2, Save, Phone, Mail, Globe, DollarSign } from 'lucide-react';
import TimeRangePicker from '../../../ui/TimeRangeSlider';
import Select from '../../../ui/Select';
import type { SelectOption } from '../../../ui/Select';
import type { SettingsProfileData, WorkingHours } from '../settings.types';

type ProfileTabProps = {
  profileData: SettingsProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<SettingsProfileData>>;
  workingHours: WorkingHours[];
  setWorkingHours: React.Dispatch<React.SetStateAction<WorkingHours[]>>;
  onSave: (e: React.FormEvent) => void;
};

const ProfileTab: React.FC<ProfileTabProps> = ({
  profileData,
  setProfileData,
  workingHours,
  setWorkingHours,
  onSave,
}) => {
  const { t } = useTranslation();

  // Options for timezone select
  const timezoneOptions: SelectOption[] = [
    { value: 'Asia/Riyadh (UTC+3)', label: 'Asia/Riyadh (UTC+3)' },
    { value: 'Asia/Dubai (UTC+4)', label: 'Asia/Dubai (UTC+4)' },
    { value: 'Africa/Cairo (UTC+2)', label: 'Africa/Cairo (UTC+2)' },
  ];

  // Options for currency select
  const currencyOptions: SelectOption[] = [
    { value: 'SAR — Saudi Riyal', label: 'SAR — Saudi Riyal (ر.س)' },
    { value: 'USD — US Dollar', label: 'USD — US Dollar ($)' },
    { value: 'AED — UAE Dirham', label: 'AED — UAE Dirham (د.إ)' },
    { value: 'EGP — Egyptian Pound', label: 'EGP — Egyptian Pound (ج.م)' },
  ];

  // Helper to update a single day's hours
  const updateDayHours = (index: number, from: string, to: string) => {
    const updated = [...workingHours];
    updated[index].open = from;
    updated[index].close = to;
    setWorkingHours(updated);
  };

  // Helper to toggle open/closed
  const toggleDayOpen = (index: number) => {
    const updated = [...workingHours];
    updated[index].isOpen = !updated[index].isOpen;
    setWorkingHours(updated);
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      {/* Identity Card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <Store className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {t('settings.profile.identityTitle')}
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)]/10 p-3 ring-1 ring-[var(--primary)]/20 shadow">
              <img
                src="/assets/logo/Mot7km_Logo.png"
                alt="Mot7km Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Mot7km ERP Official Logo</h3>
              <p className="text-xs text-[var(--text-muted)]">assets/logo/Mot7km_Logo.png</p>
              <span className="inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                Active System Asset
              </span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {t('settings.profile.restName')}
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {t('settings.profile.tagline')}
              </label>
              <input
                type="text"
                value={profileData.tagline}
                onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {t('settings.profile.phone')}
              </label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                {t('settings.profile.email')}
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Regional Settings */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <Building2 className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {t('settings.profile.locationTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('settings.profile.address')}
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('settings.profile.cityCountry')}
            </label>
            <input
              type="text"
              value={profileData.cityCountry}
              onChange={(e) => setProfileData({ ...profileData, cityCountry: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('settings.profile.timezone')}
            </label>
            <Select
              value={profileData.timezone}
              onChange={(value) => setProfileData({ ...profileData, timezone: value })}
              options={timezoneOptions}
              placeholder="Select timezone"
              leftIcon={<Globe className="h-4 w-4" />}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('settings.profile.currency')}
            </label>
            <Select
              value={profileData.currency}
              onChange={(value) => setProfileData({ ...profileData, currency: value })}
              options={currencyOptions}
              placeholder="Select currency"
              leftIcon={<DollarSign className="h-4 w-4" />}
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              {t('settings.profile.taxRate')}
            </label>
            <input
              type="number"
              value={profileData.taxRate}
              onChange={(e) => setProfileData({ ...profileData, taxRate: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Working Hours Schedule – now using compact TimeRangePicker */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <Clock className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {t('settings.profile.hoursTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workingHours.map((item, idx) => {
            const isOpen = item.isOpen;
            return (
              <div
                key={item.day}
                className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {item.day}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleDayOpen(idx)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20'
                    }`}
                  >
                    {isOpen ? t('settings.profile.open') : t('settings.profile.closed')}
                  </button>
                </div>

                {isOpen ? (
                  <TimeRangePicker
                    from={item.open}
                    to={item.close}
                    onChange={(from: string, to: string) => updateDayHours(idx, from, to)}
                    compact
                    disabled={!isOpen}
                  />
                ) : (
                  <span className="text-[11px] text-[var(--text-muted)] italic">
                    Day Off / Closed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Profiles */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <Share2 className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            {t('settings.profile.socialTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Instagram Handle</label>
            <input
              type="text"
              value={profileData.instagram}
              onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Twitter / X Handle</label>
            <input
              type="text"
              value={profileData.twitter}
              onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Snapchat Username</label>
            <input
              type="text"
              value={profileData.snapchat}
              onChange={(e) => setProfileData({ ...profileData, snapchat: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">TikTok Handle</label>
            <input
              type="text"
              value={profileData.tiktok}
              onChange={(e) => setProfileData({ ...profileData, tiktok: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-2.5 text-xs font-medium focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-white shadow-lg hover:bg-[var(--primary-dark)] transition cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{t('settings.profile.saveProfile')}</span>
        </button>
      </div>
    </form>
  );
};

export default ProfileTab;