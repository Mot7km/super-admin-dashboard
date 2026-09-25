import { memo, type FC } from 'react';
import {
  Bell,
  Smartphone,
  Mail,
  Send,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  CreditCard,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import {
  NOTIFICATION_CHANNELS_DATA,
  ADMIN_AUDIT_SUMMARY,
} from '../../analytics.mock';

export const NotificationAuditCard: FC = memo(() => {
  const { t } = useTranslation();
  const channels = NOTIFICATION_CHANNELS_DATA;
  const audit = ADMIN_AUDIT_SUMMARY;

  const totalNotifications = channels.reduce((acc, c) => acc + c.sentCount, 0);

  const getChannelIcon = (channelKey: string) => {
    switch (channelKey) {
      case 'push':
        return <Bell className="h-4 w-4 text-primary" />;
      case 'sms':
        return <Smartphone className="h-4 w-4 text-emerald-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-amber-500" />;
      default:
        return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Notification Channel Telemetry */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.ops.notifTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.ops.notifSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{t('analytics.ops.totalSent')}:</span>
            <span className="font-mono font-bold text-foreground">
              {totalNotifications.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Channel Cards */}
        <div className="space-y-3">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    {getChannelIcon(ch.channelKey)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      {t(ch.channelNameKey)}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {ch.sentCount.toLocaleString()} {t('analytics.ops.dispatched')}
                    </p>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-xs font-mono font-extrabold text-foreground">
                    {ch.deliveryRatePercent}%
                  </div>
                  <div className="text-[10px] text-emerald-500 font-semibold">
                    {t('analytics.ops.deliveryRate')}
                  </div>
                </div>
              </div>

              {/* Delivery Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${ch.color} rounded-full`}
                  style={{ width: `${ch.deliveryRatePercent}%` }}
                />
              </div>

              {/* Extra Email Metrics if present */}
              {ch.openRatePercent && (
                <div className="flex items-center gap-4 pt-1 text-[11px] text-muted-foreground border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{t('analytics.ops.openRate')}:</span>
                    <strong className="text-foreground font-mono">{ch.openRatePercent}%</strong>
                  </span>
                  {ch.clickRatePercent && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{t('analytics.ops.clickRate')}:</span>
                      <strong className="text-foreground font-mono">{ch.clickRatePercent}%</strong>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Audit & Security Governance Activity */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {t('analytics.audit.title')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('analytics.audit.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-500">
              <Activity className="h-3 w-3" />
              {audit.totalAdminActionsToday} {t('analytics.audit.actionsToday')}
            </span>
          </div>
        </div>

        {/* Audit Metric Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Business Config Edits */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">{t('analytics.audit.businessEdits')}</span>
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </div>
            <div className="text-xl font-mono font-extrabold text-foreground">
              {audit.businessConfigEdits}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t('analytics.audit.tenantConfigLogs')}
            </p>
          </div>

          {/* Subscription Edits */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">{t('analytics.audit.planEdits')}</span>
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-xl font-mono font-extrabold text-foreground">
              {audit.subscriptionPlanEdits}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t('analytics.audit.planChangeLogs')}
            </p>
          </div>

          {/* Operator Governance */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">{t('analytics.audit.operatorEdits')}</span>
              <UserCheck className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-xl font-mono font-extrabold text-foreground">
              {audit.operatorGovernanceEdits}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t('analytics.audit.rolePermissionLogs')}
            </p>
          </div>

          {/* Security Revocations */}
          <div className="rounded-xl border border-border/60 bg-background/50 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold">{t('analytics.audit.sessionRevokes')}</span>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-xl font-mono font-extrabold text-rose-500">
              {audit.securitySessionRevocations}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {t('analytics.audit.authSessionResets')}
            </p>
          </div>
        </div>

        {/* Security Anomalies Status Bar */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <div className="text-xs font-bold text-foreground">
                {t('analytics.audit.anomalyGuardStatus')}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {t('analytics.audit.anomalyGuardSubtitle')}
              </div>
            </div>
          </div>
          <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-xs font-black text-emerald-500">
            {audit.securityAnomaliesCount} {t('analytics.audit.anomalies')}
          </span>
        </div>
      </div>
    </div>
  );
});

NotificationAuditCard.displayName = 'NotificationAuditCard';
