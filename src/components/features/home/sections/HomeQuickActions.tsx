import { memo, useMemo, type FC } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Users,
  CreditCard,
  Headphones,
  Server,
  Flag,
  Megaphone,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

export type QuickActionItem = {
  id: string;
  titleKey: string;
  route: string;
  icon: typeof Building2;
  badgeKey?: string;
  badgeRaw?: string;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
};

const HomeQuickActions: FC = () => {
  const { t } = useTranslation();

  const actions: QuickActionItem[] = useMemo(
    () => [
      {
        id: 'onboard-business',
        titleKey: 'dashboard.quickActions.onboardBusiness',
        route: '/businesses',
        icon: Building2,
        badgeRaw: '+48 New',
        colorClass: {
          bg: 'bg-primary/10 dark:bg-primary/15',
          text: 'text-primary',
          border: 'hover:border-primary/50',
          badgeBg: 'bg-primary/15 text-primary border-primary/25',
        },
      },
      {
        id: 'manage-users',
        titleKey: 'dashboard.quickActions.manageUsers',
        route: '/users',
        icon: Users,
        badgeRaw: '28.4k Active',
        colorClass: {
          bg: 'bg-purple-500/10 dark:bg-purple-500/15',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'hover:border-purple-500/50',
          badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25',
        },
      },
      {
        id: 'verify-payments',
        titleKey: 'dashboard.quickActions.verifyPayments',
        route: '/payments',
        icon: CreditCard,
        badgeRaw: '$482k Today',
        colorClass: {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'hover:border-emerald-500/50',
          badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
        },
      },
      {
        id: 'support-tickets',
        titleKey: 'dashboard.quickActions.supportDesk',
        route: '/support',
        icon: Headphones,
        badgeRaw: '7 Open',
        colorClass: {
          bg: 'bg-amber-500/10 dark:bg-amber-500/15',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'hover:border-amber-500/50',
          badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
        },
      },
      {
        id: 'system-health',
        titleKey: 'dashboard.quickActions.systemHealth',
        route: '/system/health',
        icon: Server,
        badgeRaw: '99.98% Live',
        colorClass: {
          bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
          text: 'text-cyan-600 dark:text-cyan-400',
          border: 'hover:border-cyan-500/50',
          badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
        },
      },
      {
        id: 'feature-flags',
        titleKey: 'dashboard.quickActions.featureFlags',
        route: '/system/feature-flags',
        icon: Flag,
        badgeRaw: '12 Active',
        colorClass: {
          bg: 'bg-blue-500/10 dark:bg-blue-500/15',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'hover:border-blue-500/50',
          badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
        },
      },
      {
        id: 'announcements',
        titleKey: 'dashboard.quickActions.broadcasts',
        route: '/system/announcements',
        icon: Megaphone,
        badgeRaw: 'Broadcast',
        colorClass: {
          bg: 'bg-teal-500/10 dark:bg-teal-500/15',
          text: 'text-teal-600 dark:text-teal-400',
          border: 'hover:border-teal-500/50',
          badgeBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25',
        },
      },
      {
        id: 'analytics-hub',
        titleKey: 'dashboard.quickActions.analyticsHub',
        route: '/analytics',
        icon: BarChart3,
        badgeRaw: 'Full Suite',
        colorClass: {
          bg: 'bg-rose-500/10 dark:bg-rose-500/15',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'hover:border-rose-500/50',
          badgeBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
        },
      },
    ],
    [],
  );

  return (
    <section aria-label="Executive Quick Action Hub" className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground font-sans">
            {t('dashboard.quickActions.sectionTitle')}
          </h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground/70 hidden sm:inline">
          {t('dashboard.quickActions.sectionSubtitle')}
        </span>
      </div>

      {/* 8-Slot Responsive Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.route}
              className={`group flex flex-col justify-between p-3 rounded-xl border border-border/70 dark:border-white/[0.08] bg-card/90 dark:bg-card/70 hover:bg-card shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.colorClass.border} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
            >
              {/* Top Row: Themed Icon Squircle + Live Badge */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div
                  className={`h-8 w-8 rounded-lg ${item.colorClass.bg} ${item.colorClass.text} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {item.badgeRaw && (
                  <span
                    className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-md border ${item.colorClass.badgeBg} truncate max-w-[70px] shadow-2xs`}
                  >
                    {item.badgeRaw}
                  </span>
                )}
              </div>

              {/* Bottom Row: Action Label */}
              <div>
                <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                  {t(item.titleKey)}
                </span>
                <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 font-mono">
                  {t('common.actions')} →
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </section>
  );
};

export default memo(HomeQuickActions);
