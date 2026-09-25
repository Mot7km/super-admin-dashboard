import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../../app/context/ThemeContext';
import { useTranslation } from '../../../app/context/LanguageContext';
import { useToast } from '../common/Toast';
import { useAuth } from '../../../app/context/AuthContext';
import Footer from './Footer';
import { GlobalMaintenanceBanner } from '../features/global-settings/components/GlobalMaintenanceBanner';
import {
  Menu as MenuIcon,
  X,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Receipt,
  BarChart3,
  Headphones,
  Bell,
  ScrollText,
  Sliders,
  Flag,
  Megaphone,
  Settings,
  HardDrive,
  Workflow,
  Activity,
  UserCog,
  Sun,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Shield,
} from 'lucide-react';
import { SidebarNavCollapsible } from './SidebarNavCollapsible';

type NavItemConfig = {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'error' | 'success';
};

type NavGroupConfig = {
  id: string;
  items: NavItemConfig[];
};

const AppLayout = () => {
  const { t, locale, toggleLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { user, logout } = useAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  // Grouped Navigation structure matching the MOT7KM Super Admin architecture
  const navGroups: NavGroupConfig[] = [
    {
      id: 'overview-group',
      items: [
        { to: '/', labelKey: 'nav.overview', icon: LayoutDashboard },
      ],
    },
    {
      id: 'core-management',
      items: [
        { to: '/businesses', labelKey: 'nav.businesses', icon: Building2 },
        { to: '/users', labelKey: 'nav.users', icon: Users },
        { to: '/subscriptions', labelKey: 'nav.subscriptions', icon: CreditCard },
        { to: '/payments', labelKey: 'nav.payments', icon: Receipt },
      ],
    },
    {
      id: 'insights',
      items: [
        { to: '/analytics', labelKey: 'nav.analytics', icon: BarChart3 },
      ],
    },
    {
      id: 'support-ops',
      items: [
        { to: '/support', labelKey: 'nav.support', icon: Headphones },
        { to: '/notifications', labelKey: 'nav.notifications', icon: Bell, badge: '4', badgeVariant: 'primary' },
      ],
    },
    {
      id: 'audit',
      items: [
        { to: '/audit-logs', labelKey: 'nav.auditLogs', icon: ScrollText },
      ],
    },
  ];

  const systemSubItems: NavItemConfig[] = [
    { to: '/system/feature-flags', labelKey: 'nav.featureFlags', icon: Flag },
    { to: '/system/announcements', labelKey: 'nav.announcements', icon: Megaphone },
    { to: '/system/settings', labelKey: 'nav.settings', icon: Settings },
    { to: '/system/storage', labelKey: 'nav.storage', icon: HardDrive },
    { to: '/system/integrations', labelKey: 'nav.integrations', icon: Workflow },
    { to: '/system/health', labelKey: 'nav.systemHealth', icon: Activity, badge: '99.9%', badgeVariant: 'success' },
  ];

  const adminItem: NavItemConfig = {
    to: '/admin-management',
    labelKey: 'nav.adminManagement',
    icon: UserCog,
  };

  const renderBadge = (badge?: string, variant: 'primary' | 'warning' | 'error' | 'success' = 'primary') => {
    if (!badge) return null;
    const colorClasses = {
      primary: 'bg-primary/15 text-primary border border-primary/20',
      warning: 'bg-warning-bg text-warning-text border border-warning/20',
      error: 'bg-destructive-bg text-destructive-text border border-destructive/20',
      success: 'bg-success-bg text-success-text border border-success/20',
    }[variant];

    return (
      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-pill shrink-0 ${colorClasses}`}>
        {badge}
      </span>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col lg:flex-row font-sans">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-md lg:hidden shrink-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 p-1 ring-1 ring-primary/20">
            <img
              src="/assets/logo/Mot7km_Logo.png"
              alt="Mot7km Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-base font-black tracking-tight text-foreground">
            MOT7KM
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => showToast('4 New System Alerts', 'info')}
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
            aria-label={t('layout.theme')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleLocale}
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
            aria-label={t('layout.language')}
          >
            <Globe className="h-4 w-4 text-primary" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden cursor-pointer"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar: Fixed height 100vh on Desktop */}
      <aside
        className={`fixed inset-y-0 z-50 flex flex-col border-e border-border bg-surface p-3.5 transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-screen lg:shrink-0 lg:overflow-y-auto hide-scrollbar ${
          locale === 'ar' ? 'right-0' : 'left-0'
        } ${
          mobileSidebarOpen
            ? 'translate-x-0 w-[85vw] max-w-[280px]'
            : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full') + ' lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[76px] lg:px-2' : 'lg:w-[260px] lg:px-3.5'}`}
      >
        {/* Brand Area */}
        <div
          className={`flex items-center pb-4 pt-1 shrink-0 border-b border-border/60 ${
            isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20 shadow-sm">
              <img
                src="/assets/logo/Mot7km_Logo.png"
                alt="Mot7km Logo"
                className="h-full w-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-wider text-foreground">
                    MOT7KM
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/20">
                    ROOT
                  </span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  Super Admin SaaS
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-1.5 text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground lg:flex shrink-0 cursor-pointer"
            title={isCollapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')}
            aria-label={isCollapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')}
          >
            {isCollapsed ? (
              <PanelLeftOpen className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
            ) : (
              <PanelLeftClose className={`h-4 w-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-subtle lg:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-3 flex flex-1 flex-col gap-3 overflow-y-auto hide-scrollbar" aria-label="Main Super Admin Navigation">
          {navGroups.map((group, groupIdx) => (
            <div key={group.id} className="flex flex-col gap-1">
              {group.items.map((item) => {
                const label = t(item.labelKey);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={closeMobileSidebar}
                    title={isCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isCollapsed ? 'justify-center px-0' : ''
                      } ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25 font-bold'
                          : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <item.icon
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{label}</span>}
                        </div>

                        {!isCollapsed && renderBadge(item.badge, item.badgeVariant)}

                        {/* Collapsed Mode Hover Tooltip */}
                        {isCollapsed && (
                          <div
                            className={`pointer-events-none absolute hidden rounded-lg bg-card px-3 py-1.5 text-xs font-bold text-card-foreground shadow-dialog border border-border group-hover:flex items-center gap-2 z-50 whitespace-nowrap ${
                              locale === 'ar' ? 'right-full mr-3' : 'left-full ml-3'
                            }`}
                          >
                            <span>{label}</span>
                            {renderBadge(item.badge, item.badgeVariant)}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Group Separator */}
              {groupIdx < navGroups.length - 1 && (
                <div className="my-1 border-t border-border/40" />
              )}
            </div>
          ))}

          {/* Group Separator before System */}
          <div className="my-1 border-t border-border/40" />

          {/* System Submenu (Modern Inset Card & Glowing Rail Collapsible) */}
          <SidebarNavCollapsible
            id="system"
            labelKey="nav.system"
            icon={Sliders}
            items={systemSubItems}
            isCollapsed={isCollapsed}
            defaultOpen={true}
            onItemClick={closeMobileSidebar}
          />

          {/* Group Separator before Admin Management */}
          <div className="my-1 border-t border-border/40" />

          {/* Admin Management Item */}
          <NavLink
            to={adminItem.to}
            onClick={closeMobileSidebar}
            title={isCollapsed ? t(adminItem.labelKey) : undefined}
            className={({ isActive }) =>
              `group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : ''
              } ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25 font-bold'
                  : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <adminItem.icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{t(adminItem.labelKey)}</span>}
                </div>

                {isCollapsed && (
                  <div
                    className={`pointer-events-none absolute hidden rounded-lg bg-card px-3 py-1.5 text-xs font-bold text-card-foreground shadow-dialog border border-border group-hover:block z-50 whitespace-nowrap ${
                      locale === 'ar' ? 'right-full mr-3' : 'left-full ml-3'
                    }`}
                  >
                    {t(adminItem.labelKey)}
                  </div>
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* User Profile & Footer Controls */}
        <div className="mt-auto border-t border-border pt-3 shrink-0 space-y-2">
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-surface-subtle p-2 border border-border/80 ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs ring-2 ring-primary/30">
                <Shield className="h-4 w-4" />
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success ring-1 ring-surface" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-bold text-foreground">
                    {user?.name || t('layout.defaultUser')}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {user?.email || 'superadmin@mot7km.com'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    showToast('Logged out of Super Admin session', 'info');
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive-bg hover:text-destructive-text transition cursor-pointer"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center justify-between px-1">
              <button
                onClick={toggleTheme}
                aria-label={t('layout.theme')}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
                <span>{t('layout.theme')}</span>
              </button>
              <button
                onClick={toggleLocale}
                aria-label={t('layout.language')}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>{t('layout.otherLanguage')}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col scroll-smooth overflow-safe">
        <GlobalMaintenanceBanner />
        <main className="flex-1 p-3 sm:p-6 lg:p-7">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;