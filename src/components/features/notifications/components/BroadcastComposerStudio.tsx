import { useState, useMemo, type FC } from 'react';
import {
  Send,
  Bell,
  Smartphone,
  Mail,
  Users
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  NotificationChannel,
  NotificationType,
  AudienceType,
  NotificationBroadcast
} from '../notification.types';
import { TARGET_BUSINESS_OPTIONS } from '../notification.mock';
import { LiveDevicePreview } from './LiveDevicePreview';

type BroadcastComposerStudioProps = {
  onSubmitBroadcast: (newBroadcast: Partial<NotificationBroadcast>) => void;
};

const PLAN_OPTIONS: ('Free' | 'Basic' | 'Pro' | 'Enterprise')[] = [
  'Free',
  'Basic',
  'Pro',
  'Enterprise',
];

const ROLE_OPTIONS: ('Business Owners' | 'Branch Managers' | 'Cashiers' | 'Support Staff')[] = [
  'Business Owners',
  'Branch Managers',
  'Cashiers',
  'Support Staff',
];

export const BroadcastComposerStudio: FC<BroadcastComposerStudioProps> = ({
  onSubmitBroadcast,
}) => {
  const { t } = useTranslation();

  // Form State
  const [audienceType, setAudienceType] = useState<AudienceType>('all_businesses');
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<('Free' | 'Basic' | 'Pro' | 'Enterprise')[]>(['Pro', 'Enterprise']);
  const [selectedRoles, setSelectedRoles] = useState<('Business Owners' | 'Branch Managers' | 'Cashiers' | 'Support Staff')[]>(['Business Owners', 'Branch Managers']);
  const [specificUsersInput, setSpecificUsersInput] = useState('');

  // Channels & Content
  const [channels, setChannels] = useState<NotificationChannel[]>(['in_app', 'email', 'push']);
  const [notificationType, setNotificationType] = useState<NotificationType>('maintenance');
  const [title, setTitle] = useState('Scheduled Platform Database Maintenance');
  const [message, setMessage] = useState('We will be performing scheduled cloud database indexing and infrastructure maintenance tomorrow at 2:00 AM UTC. Estimated downtime is under 15 minutes.');
  const [ctaLabel, setCtaLabel] = useState('View Maintenance Roadmap');
  const [ctaUrl, setCtaUrl] = useState('/system/health');

  // Dispatch schedule
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-09-26T02:00');

  // Dynamic Reach Calculator
  const estimatedReach = useMemo(() => {
    switch (audienceType) {
      case 'all_businesses':
        return { businesses: 148, users: 1840 };
      case 'specific_business': {
        const count = selectedBusinesses.length || 1;
        return { businesses: count, users: count * 18 };
      }
      case 'by_plan': {
        const factor = selectedPlans.length * 35;
        return { businesses: factor, users: factor * 14 };
      }
      case 'by_role': {
        const roleUsers = selectedRoles.length * 360;
        return { businesses: 120, users: roleUsers };
      }
      case 'specific_users': {
        const emails = specificUsersInput.split(',').filter((e) => e.trim());
        return { businesses: Math.max(1, Math.ceil(emails.length / 3)), users: emails.length || 1 };
      }
    }
  }, [audienceType, selectedBusinesses, selectedPlans, selectedRoles, specificUsersInput]);

  const toggleChannel = (ch: NotificationChannel) => {
    if (channels.includes(ch)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== ch));
      }
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleQuickTemplate = (typeKey: NotificationType) => {
    setNotificationType(typeKey);
    if (typeKey === 'maintenance') {
      setTitle('Scheduled Platform Database Maintenance');
      setMessage('We will be performing scheduled cloud database indexing and infrastructure maintenance tomorrow at 2:00 AM UTC. POS offline mode will remain fully operational.');
      setCtaLabel('View Maintenance Status');
      setCtaUrl('/system/health');
    } else if (typeKey === 'security_alert') {
      setTitle('Mandatory POS Cashier PIN Rotation');
      setMessage('In compliance with our zero-trust quarterly policy, all cashiers are required to reset their 4-digit POS lockscreen PIN codes.');
      setCtaLabel('Open PIN Settings');
      setCtaUrl('/users');
    } else if (typeKey === 'system_update') {
      setTitle('Egyptian Tax Authority e-Invoice V2.1 Deployed');
      setMessage('All tax receipts and electronic QR signatures have been updated to the latest 2026 standard. No downtime or merchant action required.');
      setCtaLabel('Review Invoice Format');
      setCtaUrl('/payments');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSubmitBroadcast({
      title: title.trim(),
      message: message.trim(),
      type: notificationType,
      channels,
      audience: {
        type: audienceType,
        businessIds: selectedBusinesses,
        plans: selectedPlans,
        roles: selectedRoles,
        userEmails: specificUsersInput.split(',').map((s) => s.trim()).filter(Boolean),
        estimatedBusinessesCount: estimatedReach.businesses,
        estimatedUsersCount: estimatedReach.users,
      },
      status: isScheduled ? 'scheduled' : 'sent',
      scheduledAt: isScheduled ? new Date(scheduledDateTime).toISOString() : undefined,
      actionButton: ctaLabel.trim() ? { label: ctaLabel.trim(), url: ctaUrl.trim() || '#' } : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Form & Configuration (7 cols on desktop) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
        {/* Step 1: Target Audience Card */}
        <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{t('notifications.composer.targetAudience')}</span>
            </h3>

            {/* Calculated Estimated Reach Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold">
              <span>{estimatedReach.users.toLocaleString()} Users</span>
              <span className="opacity-40">•</span>
              <span>{estimatedReach.businesses} Businesses</span>
            </div>
          </div>

          {/* Segment Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAudienceType('all_businesses')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                audienceType === 'all_businesses'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border bg-surface-subtle text-muted-foreground hover:bg-card'
              }`}
            >
              All Tenants
            </button>

            <button
              type="button"
              onClick={() => setAudienceType('specific_business')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                audienceType === 'specific_business'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border bg-surface-subtle text-muted-foreground hover:bg-card'
              }`}
            >
              Specific Business
            </button>

            <button
              type="button"
              onClick={() => setAudienceType('by_plan')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                audienceType === 'by_plan'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border bg-surface-subtle text-muted-foreground hover:bg-card'
              }`}
            >
              By Plan Tier
            </button>

            <button
              type="button"
              onClick={() => setAudienceType('by_role')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                audienceType === 'by_role'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border bg-surface-subtle text-muted-foreground hover:bg-card'
              }`}
            >
              By Staff Role
            </button>

            <button
              type="button"
              onClick={() => setAudienceType('specific_users')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                audienceType === 'specific_users'
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border-border bg-surface-subtle text-muted-foreground hover:bg-card'
              }`}
            >
              Direct Users
            </button>
          </div>

          {/* Conditional Sub-selectors based on Audience */}
          {audienceType === 'specific_business' && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Select One or Multiple Target Businesses:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {TARGET_BUSINESS_OPTIONS.map((biz) => {
                  const isChecked = selectedBusinesses.includes(biz.id);
                  return (
                    <label
                      key={biz.id}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer ${
                        isChecked
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-surface-subtle text-muted-foreground'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedBusinesses(selectedBusinesses.filter((id) => id !== biz.id));
                          } else {
                            setSelectedBusinesses([...selectedBusinesses, biz.id]);
                          }
                        }}
                        className="rounded text-primary focus:ring-primary/20"
                      />
                      <span className="font-bold truncate">{biz.name}</span>
                      <span className="text-[10px] font-mono ml-auto opacity-70">({biz.plan})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {audienceType === 'by_plan' && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Target SaaS Subscription Plans:
              </label>
              <div className="flex flex-wrap gap-2">
                {PLAN_OPTIONS.map((p) => {
                  const isChecked = selectedPlans.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedPlans(selectedPlans.filter((plan) => plan !== p));
                        } else {
                          setSelectedPlans([...selectedPlans, p]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isChecked
                          ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                          : 'border-border bg-surface-subtle text-muted-foreground'
                      }`}
                    >
                      {p} Tier
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {audienceType === 'by_role' && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Target Platform User Roles:
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((r) => {
                  const isChecked = selectedRoles.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedRoles(selectedRoles.filter((role) => role !== r));
                        } else {
                          setSelectedRoles([...selectedRoles, r]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isChecked
                          ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                          : 'border-border bg-surface-subtle text-muted-foreground'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {audienceType === 'specific_users' && (
            <div className="pt-2 animate-fadeIn">
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Target User Emails (comma-separated):
              </label>
              <input
                type="text"
                value={specificUsersInput}
                onChange={(e) => setSpecificUsersInput(e.target.value)}
                placeholder="ahmed@business.com, sarah@enterprise.eg"
                className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-xs text-foreground font-mono focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>

        {/* Step 2: Communication Channels & Urgency */}
        <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('notifications.composer.channelsAndType')}
              </h3>
              <p className="text-xs text-muted-foreground">
                Select active delivery pipes and priority urgency
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickTemplate('maintenance')}
                className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20"
              >
                Maintenance
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate('security_alert')}
                className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
              >
                Security
              </button>
              <button
                type="button"
                onClick={() => handleQuickTemplate('system_update')}
                className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
              >
                Update
              </button>
            </div>
          </div>

          {/* Delivery Channels Toggle */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Delivery Channels:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => toggleChannel('in_app')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  channels.includes('in_app')
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'border-border bg-surface-subtle text-muted-foreground'
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="text-xs font-bold">In-App Banner</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChannel('push')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  channels.includes('push')
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'border-border bg-surface-subtle text-muted-foreground'
                }`}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-xs font-bold">Mobile Push</span>
              </button>

              <button
                type="button"
                onClick={() => toggleChannel('email')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  channels.includes('email')
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                    : 'border-border bg-surface-subtle text-muted-foreground'
                }`}
              >
                <Mail className="h-5 w-5" />
                <span className="text-xs font-bold">Email Campaign</span>
              </button>
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Broadcast Headline / Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Platform Database Maintenance tomorrow at 2 AM"
                className="w-full h-9 px-3 rounded-xl bg-surface-subtle border border-border text-xs sm:text-sm text-foreground font-medium focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Broadcast Message Body:
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed explanation, timelines, and instructions..."
                className="w-full p-3 rounded-xl bg-surface-subtle border border-border text-xs sm:text-sm text-foreground leading-relaxed focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Optional Call to Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  CTA Button Label (Optional):
                </label>
                <input
                  type="text"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="e.g. View Maintenance Details"
                  className="w-full h-8 px-3 rounded-lg bg-surface-subtle border border-border text-xs text-foreground font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  CTA Action URL:
                </label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="/system/health"
                  className="w-full h-8 px-3 rounded-lg bg-surface-subtle border border-border text-xs text-foreground font-mono"
                />
              </div>
            </div>
          </div>

          {/* Schedule vs Send Now */}
          <div className="pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground select-none">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="rounded text-primary focus:ring-primary/20"
                />
                <span>Schedule for specific future date & time</span>
              </label>

              {isScheduled && (
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="h-8 px-2.5 rounded-lg bg-surface-subtle border border-border text-xs font-mono text-foreground"
                />
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isScheduled ? 'Schedule Broadcast' : 'Dispatch Broadcast Now'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Right Column: Live Device WYSIWYG Preview Studio (5 cols on desktop) */}
      <div className="lg:col-span-5 sticky top-6">
        <LiveDevicePreview
          title={title}
          message={message}
          type={notificationType}
          actionButton={ctaLabel.trim() ? { label: ctaLabel.trim(), url: ctaUrl } : undefined}
        />
      </div>
    </div>
  );
};
