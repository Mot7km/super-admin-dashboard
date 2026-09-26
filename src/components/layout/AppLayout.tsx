import { useState, useRef, useEffect, useMemo } from 'react';
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
  TrendingUp,
  Target,
  Layers,
  Server,
  Briefcase,
  GitBranch,
  Calculator,
  ShieldAlert,
  Sun,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';
import { SidebarNavCollapsible } from './SidebarNavCollapsible';

type NavItemConfig = {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'error' | 'success';
};

const AppLayout = () => {
  const { t, locale, toggleLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { user, logout } = useAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
    setSearchQuery('');
  };

  // Keyboard shortcut listener to focus search on '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        if (isCollapsed) {
          setIsCollapsed(false);
        }
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 60);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  // Global Users Directory Sub-items
  const usersSubItems: NavItemConfig[] = useMemo(() => [
    { to: '/users/all', labelKey: 'users.roles.all', icon: Users },
    { to: '/users/super_admin', labelKey: 'users.roles.superAdmin', icon: ShieldAlert },
    { to: '/users/support_staff', labelKey: 'users.roles.supportStaff', icon: Headphones },
    { to: '/users/business_owner', labelKey: 'users.roles.businessOwner', icon: Briefcase },
    { to: '/users/branch_manager', labelKey: 'users.roles.branchManager', icon: GitBranch },
    { to: '/users/cashier', labelKey: 'users.roles.cashier', icon: Calculator },
  ], []);

  // Analytics Hub Sub-items
  const analyticsSubItems: NavItemConfig[] = useMemo(() => [
    { to: '/analytics/overview', labelKey: 'analytics.tabs.overview', icon: LayoutDashboard },
    { to: '/analytics/growth', labelKey: 'analytics.tabs.growth', icon: TrendingUp },
    { to: '/analytics/subscriptions', labelKey: 'analytics.tabs.subscriptions', icon: CreditCard },
    { to: '/analytics/trials', labelKey: 'analytics.tabs.trials', icon: Target },
    { to: '/analytics/product', labelKey: 'analytics.tabs.product', icon: Layers },
    { to: '/analytics/operations', labelKey: 'analytics.tabs.operations', icon: Server, badge: '99.2%', badgeVariant: 'success' },
  ], []);

  // System Infrastructure Sub-items
  const systemSubItems: NavItemConfig[] = useMemo(() => [
    { to: '/system/feature-flags', labelKey: 'nav.featureFlags', icon: Flag },
    { to: '/system/announcements', labelKey: 'nav.announcements', icon: Megaphone },
    { to: '/system/settings', labelKey: 'nav.settings', icon: Settings },
    { to: '/system/storage', labelKey: 'nav.storage', icon: HardDrive },
    { to: '/system/integrations', labelKey: 'nav.integrations', icon: Workflow },
    { to: '/system/health', labelKey: 'nav.systemHealth', icon: Activity, badge: '99.9%', badgeVariant: 'success' },
  ], []);

  // Flat list of all searchable routes for the Quick Jump Search
  const allSearchableItems: Array<NavItemConfig & { groupKey: string }> = useMemo(() => [
    { to: '/', labelKey: 'nav.overview', icon: LayoutDashboard, groupKey: 'nav.groupCore' },
    { to: '/businesses', labelKey: 'nav.businesses', icon: Building2, groupKey: 'nav.groupCore' },
    { to: '/users/all', labelKey: 'users.roles.all', icon: Users, groupKey: 'nav.groupGovernance' },
    { to: '/users/super_admin', labelKey: 'users.roles.superAdmin', icon: ShieldAlert, groupKey: 'nav.groupGovernance' },
    { to: '/users/support_staff', labelKey: 'users.roles.supportStaff', icon: Headphones, groupKey: 'nav.groupGovernance' },
    { to: '/users/business_owner', labelKey: 'users.roles.businessOwner', icon: Briefcase, groupKey: 'nav.groupGovernance' },
    { to: '/users/branch_manager', labelKey: 'users.roles.branchManager', icon: GitBranch, groupKey: 'nav.groupGovernance' },
    { to: '/users/cashier', labelKey: 'users.roles.cashier', icon: Calculator, groupKey: 'nav.groupGovernance' },
    { to: '/admin-management', labelKey: 'nav.adminManagement', icon: UserCog, groupKey: 'nav.groupGovernance' },
    { to: '/subscriptions', labelKey: 'nav.subscriptions', icon: CreditCard, groupKey: 'nav.groupFinance' },
    { to: '/payments', labelKey: 'nav.payments', icon: Receipt, groupKey: 'nav.groupFinance' },
    { to: '/analytics/overview', labelKey: 'analytics.tabs.overview', icon: LayoutDashboard, groupKey: 'nav.groupIntelligence' },
    { to: '/analytics/growth', labelKey: 'analytics.tabs.growth', icon: TrendingUp, groupKey: 'nav.groupIntelligence' },
    { to: '/analytics/subscriptions', labelKey: 'analytics.tabs.subscriptions', icon: CreditCard, groupKey: 'nav.groupIntelligence' },
    { to: '/analytics/trials', labelKey: 'analytics.tabs.trials', icon: Target, groupKey: 'nav.groupIntelligence' },
    { to: '/analytics/product', labelKey: 'analytics.tabs.product', icon: Layers, groupKey: 'nav.groupIntelligence' },
    { to: '/analytics/operations', labelKey: 'analytics.tabs.operations', icon: Server, badge: '99.2%', badgeVariant: 'success', groupKey: 'nav.groupIntelligence' },
    { to: '/audit-logs', labelKey: 'nav.auditLogs', icon: ScrollText, groupKey: 'nav.groupIntelligence' },
    { to: '/system/feature-flags', labelKey: 'nav.featureFlags', icon: Flag, groupKey: 'nav.groupSystem' },
    { to: '/system/announcements', labelKey: 'nav.announcements', icon: Megaphone, groupKey: 'nav.groupSystem' },
    { to: '/system/settings', labelKey: 'nav.settings', icon: Settings, groupKey: 'nav.groupSystem' },
    { to: '/system/storage', labelKey: 'nav.storage', icon: HardDrive, groupKey: 'nav.groupSystem' },
    { to: '/system/integrations', labelKey: 'nav.integrations', icon: Workflow, groupKey: 'nav.groupSystem' },
    { to: '/system/health', labelKey: 'nav.systemHealth', icon: Activity, badge: '99.9%', badgeVariant: 'success', groupKey: 'nav.groupSystem' },
    { to: '/notifications', labelKey: 'nav.notifications', icon: Bell, badge: '4', badgeVariant: 'primary', groupKey: 'nav.groupOperations' },
    { to: '/support', labelKey: 'nav.support', icon: Headphones, groupKey: 'nav.groupOperations' },
  ], []);

  // Filtered search results
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return allSearchableItems.filter((item) => {
      const translated = t(item.labelKey).toLowerCase();
      const groupTrans = t(item.groupKey).toLowerCase();
      return translated.includes(q) || groupTrans.includes(q) || item.to.toLowerCase().includes(q);
    });
  }, [searchQuery, allSearchableItems, t]);

  const renderBadge = (badge?: string, variant: 'primary' | 'warning' | 'error' | 'success' = 'primary') => {
    if (!badge) return null;
    const colorClasses = {
      primary: 'bg-primary/15 text-primary border border-primary/25',
      warning: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/25',
      error: 'bg-destructive/15 text-destructive border border-destructive/25',
      success: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25',
    }[variant];

    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md shrink-0 shadow-2xs ${colorClasses}`}>
        {variant === 'success' && (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
        )}
        <span>{badge}</span>
      </span>
    );
  };

  const renderNavLink = (item: NavItemConfig) => {
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
              ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent dark:from-primary/20 dark:via-primary/5 text-primary font-bold shadow-xs border border-primary/20'
              : 'text-muted-foreground hover:bg-surface-subtle/80 hover:text-foreground hover:translate-x-0.5 rtl:hover:-translate-x-0.5'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active Accent Light Pill (Leading Edge) */}
            {isActive && (
              <span
                className={`absolute inset-y-1.5 w-1 rounded-e-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] ${
                  locale === 'ar' ? 'right-0 rounded-s-full rounded-e-none' : 'left-0'
                }`}
              />
            )}

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
                className={`pointer-events-none absolute hidden rounded-lg bg-card px-2.5 py-1.5 text-xs font-bold text-card-foreground shadow-dialog border border-border group-hover:flex items-center gap-2 z-50 whitespace-nowrap ${
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
  };

  const renderSectionHeader = (labelKey: string) => {
    if (isCollapsed) {
      return <div className="my-1.5 mx-2 border-t border-border/40" />;
    }
    return (
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 select-none">
        <span>{t(labelKey)}</span>
      </div>
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
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase font-mono">
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
        className={`fixed inset-y-0 z-50 flex flex-col border-e border-border/80 bg-surface p-3 transition-all duration-300 ease-in-out lg:static lg:z-auto lg:h-screen lg:shrink-0 hide-scrollbar shadow-ambient ${
          locale === 'ar' ? 'right-0' : 'left-0'
        } ${
          mobileSidebarOpen
            ? 'translate-x-0 w-[85vw] max-w-[280px]'
            : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full') + ' lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[72px] lg:px-2' : 'lg:w-[264px] lg:px-3'}`}
      >
        {/* Brand Area */}
        <div
          className={`flex items-center pb-3 pt-1 shrink-0 border-b border-border/60 ${
            isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20 shadow-2xs">
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
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded-md bg-primary/15 text-primary border border-primary/25">
                    ROOT
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground truncate">
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

        {/* Quick Module Filter Search */}
        {!isCollapsed ? (
          <div className="relative mt-2.5 px-0.5 shrink-0">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground ${
                locale === 'ar' ? 'right-3' : 'left-3'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.filterModules')}
              className={`w-full rounded-lg bg-surface-subtle/80 border border-border/70 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                locale === 'ar' ? 'pr-8 pl-6' : 'pl-8 pr-6'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer ${
                  locale === 'ar' ? 'left-2.5' : 'right-2.5'
                }`}
                title={t('nav.clearSearch')}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsCollapsed(false);
              setTimeout(() => searchInputRef.current?.focus(), 60);
            }}
            className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
            title={t('nav.filterModules')}
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {/* Navigation Scroll Area */}
        <nav
          className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto hide-scrollbar"
          aria-label="Main Super Admin Navigation"
        >
          {filteredItems ? (
            /* Search Results Mode */
            <div className="flex flex-col gap-1 py-1">
              <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>{t('common.actions')}</span>
                <span className="font-mono text-primary font-bold">{filteredItems.length} found</span>
              </div>
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  {t('nav.noMatchingModules')}
                </div>
              ) : (
                filteredItems.map((item) => {
                  const label = t(item.labelKey);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        setSearchQuery('');
                        closeMobileSidebar();
                      }}
                      className={({ isActive }) =>
                        `group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent dark:from-primary/20 dark:via-primary/5 text-primary font-bold shadow-xs border border-primary/20'
                            : 'text-muted-foreground hover:bg-surface-subtle/80 hover:text-foreground'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon className="h-4 w-4 shrink-0 text-primary" />
                        <div className="truncate">
                          <span className="truncate block font-bold text-foreground">{label}</span>
                          <span className="text-[9px] text-muted-foreground truncate block">
                            {t(item.groupKey)}
                          </span>
                        </div>
                      </div>
                      {renderBadge(item.badge, item.badgeVariant)}
                    </NavLink>
                  );
                })
              )}
            </div>
          ) : (
            /* Categorized Navigation */
            <>
              {/* Group 1: Core & Tenancy */}
              {renderSectionHeader('nav.groupCore')}
              {renderNavLink({ to: '/', labelKey: 'nav.overview', icon: LayoutDashboard })}
              {renderNavLink({ to: '/businesses', labelKey: 'nav.businesses', icon: Building2 })}

              {/* Group 2: Access & Governance */}
              {renderSectionHeader('nav.groupGovernance')}
              <SidebarNavCollapsible
                id="users"
                labelKey="nav.users"
                icon={Users}
                items={usersSubItems}
                isCollapsed={isCollapsed}
                defaultOpen={false}
                onItemClick={closeMobileSidebar}
              />
              {renderNavLink({ to: '/admin-management', labelKey: 'nav.adminManagement', icon: UserCog })}

              {/* Group 3: Financial Engine */}
              {renderSectionHeader('nav.groupFinance')}
              {renderNavLink({ to: '/subscriptions', labelKey: 'nav.subscriptions', icon: CreditCard })}
              {renderNavLink({ to: '/payments', labelKey: 'nav.payments', icon: Receipt })}

              {/* Group 4: Telemetry & Analytics */}
              {renderSectionHeader('nav.groupIntelligence')}
              <SidebarNavCollapsible
                id="analytics"
                labelKey="nav.analytics"
                icon={BarChart3}
                items={analyticsSubItems}
                isCollapsed={isCollapsed}
                defaultOpen={false}
                onItemClick={closeMobileSidebar}
              />
              {renderNavLink({ to: '/audit-logs', labelKey: 'nav.auditLogs', icon: ScrollText })}

              {/* Group 5: Infrastructure & System */}
              {renderSectionHeader('nav.groupSystem')}
              <SidebarNavCollapsible
                id="system"
                labelKey="nav.system"
                icon={Sliders}
                items={systemSubItems}
                isCollapsed={isCollapsed}
                defaultOpen={true}
                onItemClick={closeMobileSidebar}
              />

              {/* Group 6: Operations & Support */}
              {renderSectionHeader('nav.groupOperations')}
              {renderNavLink({
                to: '/notifications',
                labelKey: 'nav.notifications',
                icon: Bell,
                badge: '4',
                badgeVariant: 'primary',
              })}
              {renderNavLink({ to: '/support', labelKey: 'nav.support', icon: Headphones })}
            </>
          )}
        </nav>

        {/* User Profile & Footer Controls */}
        <div className="mt-auto border-t border-border/80 pt-2.5 shrink-0 space-y-2">
          {/* User Profile Card */}
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-surface-subtle/80 p-2 border border-border/70 shadow-2xs ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="relative shrink-0">
              <div className="h-8 w-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-black text-xs shadow-2xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface animate-pulse" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-bold text-foreground">
                      {user?.name || t('layout.defaultUser')}
                    </span>
                    <span className="text-[8px] font-mono font-bold px-1 rounded bg-muted text-muted-foreground">
                      ROOT
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {user?.email || 'superadmin@mot7km.com'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    showToast('Logged out of Super Admin session', 'info');
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition cursor-pointer"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Dual Switchers: Theme & Language */}
          {!isCollapsed ? (
            <div className="grid grid-cols-2 gap-1.5 px-0.5">
              <button
                onClick={toggleTheme}
                aria-label={t('layout.theme')}
                className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground border border-border/60 bg-surface/50 cursor-pointer shadow-2xs"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={toggleLocale}
                aria-label={t('layout.language')}
                className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-surface-subtle hover:text-foreground border border-border/60 bg-surface/50 cursor-pointer shadow-2xs"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>{t('layout.otherLanguage')}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
                title={t('layout.theme')}
                aria-label={t('layout.theme')}
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-primary" />}
              </button>
              <button
                onClick={toggleLocale}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-subtle hover:text-foreground cursor-pointer"
                title={t('layout.language')}
                aria-label={t('layout.language')}
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
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