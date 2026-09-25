import { memo, type FC } from 'react';
import {
  Users2,
  ShieldCheck,
  Flame,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../../app/context/LanguageContext';
import { USER_ROLES_DATA, USER_ENGAGEMENT_SEGMENTS } from '../../analytics.mock';

export const UserRolesEngagementCard: FC = memo(() => {
  const { t } = useTranslation();

  const roles = USER_ROLES_DATA;
  const segments = USER_ENGAGEMENT_SEGMENTS;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. User Roles Distribution */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('analytics.users.rolesTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.users.rolesSubtitle')}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-foreground">
              7,842 {t('analytics.users.activePersonnel')}
            </span>
          </div>

          {/* Stacked Proportional Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted p-0.5">
              {roles.map((r) => (
                <div
                  key={r.roleKey}
                  title={`${t(r.nameKey)}: ${r.count} (${r.percent}%)`}
                  className={`h-full first:rounded-s-full last:rounded-e-full ${r.color} transition-all duration-300`}
                  style={{ width: `${r.percent}%` }}
                />
              ))}
            </div>
          </div>

          {/* Role Items */}
          <div className="mt-4 space-y-3">
            {roles.map((r) => (
              <div
                key={r.roleKey}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3.5 hover:bg-background/80 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${r.color}`} />
                  <span className="font-bold text-foreground">
                    {t(r.nameKey)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-foreground">
                    {r.count.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    ({r.percent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{t('analytics.users.rbacCompliance')}</span>
          </span>
          <span className="font-semibold text-emerald-500">100% RBAC Policy Compliant</span>
        </div>
      </div>

      {/* 2. Engagement Clusters */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {t('analytics.users.engagementTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('analytics.users.engagementSubtitle')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              <Zap className="h-3.5 w-3.5" />
              <span>80% Highly Active</span>
            </div>
          </div>

          {/* Segment Cards */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
            {segments.map((seg) => (
              <div
                key={seg.segmentKey}
                className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${seg.color}`}>
                    {t(seg.labelKey)}
                  </span>
                  <span className="font-extrabold text-foreground">
                    {seg.percent}%
                  </span>
                </div>

                <div className="text-sm font-extrabold text-foreground">
                  {seg.count.toLocaleString()}
                </div>

                <div className="text-[11px] text-muted-foreground leading-tight">
                  {t(seg.descriptionKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground flex items-center justify-between">
          <span>{t('analytics.users.dormantIntervention')}</span>
          <span className="font-semibold text-rose-500">6.0% Dormancy Target &lt; 8%</span>
        </div>
      </div>
    </div>
  );
});

UserRolesEngagementCard.displayName = 'UserRolesEngagementCard';
