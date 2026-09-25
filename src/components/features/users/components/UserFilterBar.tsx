import { memo, type FC, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  Users,
  ShieldAlert,
  Headphones,
  Briefcase,
  GitBranch,
  Calculator,
  LayoutGrid,
  List,
  UserPlus,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { GlobalUser, UserFilterState, UserRole } from '../users.types';

type UserFilterBarProps = {
  users: GlobalUser[];
  filters: UserFilterState;
  onFilterChange: <K extends keyof UserFilterState>(key: K, value: UserFilterState[K]) => void;
  onResetFilters: () => void;
  onOpenCreateUser: () => void;
};

type RoleTabConfig = {
  id: 'all' | UserRole;
  labelKey: string;
  defaultLabel: string;
  icon: FC<{ className?: string }>;
  colorClass: string;
};

const ROLE_TABS: RoleTabConfig[] = [
  {
    id: 'all',
    labelKey: 'users.roles.all',
    defaultLabel: 'All Users',
    icon: Users,
    colorClass: 'text-foreground',
  },
  {
    id: 'super_admin',
    labelKey: 'users.roles.superAdmin',
    defaultLabel: 'Super Admins',
    icon: ShieldAlert,
    colorClass: 'text-amber-500 dark:text-amber-400',
  },
  {
    id: 'support_staff',
    labelKey: 'users.roles.supportStaff',
    defaultLabel: 'Support Staff',
    icon: Headphones,
    colorClass: 'text-sky-500 dark:text-sky-400',
  },
  {
    id: 'business_owner',
    labelKey: 'users.roles.businessOwner',
    defaultLabel: 'Business Owners',
    icon: Briefcase,
    colorClass: 'text-primary',
  },
  {
    id: 'branch_manager',
    labelKey: 'users.roles.branchManager',
    defaultLabel: 'Branch Managers',
    icon: GitBranch,
    colorClass: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    id: 'cashier',
    labelKey: 'users.roles.cashier',
    defaultLabel: 'Cashiers & POS',
    icon: Calculator,
    colorClass: 'text-teal-600 dark:text-teal-400',
  },
];

const UserFilterBar: FC<UserFilterBarProps> = ({
  users,
  filters,
  onFilterChange,
  onResetFilters,
  onOpenCreateUser,
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global hotkey '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live counts per role
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: users.length };
    for (const u of users) {
      counts[u.role] = (counts[u.role] || 0) + 1;
    }
    return counts;
  }, [users]);

  // Unique business list
  const uniqueBusinesses = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of users) {
      if (u.businessId && u.businessName) {
        map.set(u.businessId, u.businessName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [users]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.role !== 'all' ||
    filters.status !== 'all' ||
    filters.business !== 'all';

  return (
    <div className="space-y-3.5">
      {/* 1. Top Role Scope Segmented Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 no-scrollbar border-b border-border/60">
        <div className="flex items-center gap-1.5 min-w-max">
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = filters.role === tab.id;
            const count = roleCounts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange('role', tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                  isSelected
                    ? 'bg-card text-foreground shadow-sm border border-border/80 font-black'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isSelected ? tab.colorClass : 'text-muted-foreground'
                  }`}
                />
                <span>{t(tab.labelKey) || tab.defaultLabel}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isSelected
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-surface-subtle text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreateUser}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>{t('users.createUserBtn') || 'Add / Invite User'}</span>
          </button>
        </div>
      </div>

      {/* 2. Search, Status, Business, Sort & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card/80 backdrop-blur-sm border border-border/70 rounded-2xl p-3 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={
              t('users.searchPlaceholder') ||
              'Search users by name, email, phone, business, device IP... (Press / to focus)'
            }
            className="w-full h-10 pl-9 pr-9 rtl:pl-9 rtl:pr-9 rounded-xl bg-surface-subtle border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-md hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.status}
              aria-label={t('users.filterByStatus') || 'Filter by Status'}
              onChange={(e) => onFilterChange('status', e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">{t('users.statusAll') || 'All Statuses'}</option>
              <option value="active">{t('users.statusActive') || 'Active'}</option>
              <option value="locked">{t('users.statusLocked') || 'Locked'}</option>
              <option value="disabled">{t('users.statusDisabled') || 'Disabled'}</option>
              <option value="pending">{t('users.statusPending') || 'Pending'}</option>
            </select>
          </div>

          {/* Business / Tenant Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.business}
              aria-label={t('users.filterByBusiness') || 'Filter by Business'}
              onChange={(e) => onFilterChange('business', e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">{t('users.allBusinesses') || 'All Tenancies / Orgs'}</option>
              {uniqueBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.sortBy}
              aria-label={t('users.sortBy') || 'Sort By'}
              onChange={(e) => onFilterChange('sortBy', e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="last_login_desc">
                {t('users.sortLastLogin') || 'Last Active (Newest)'}
              </option>
              <option value="created_desc">
                {t('users.sortCreatedDesc') || 'Created Date (Newest)'}
              </option>
              <option value="name_asc">{t('users.sortNameAsc') || 'Name (A-Z)'}</option>
              <option value="sessions_desc">
                {t('users.sortSessionsDesc') || 'Connected Devices (Most)'}
              </option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-surface-subtle p-1 border border-border/70">
            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'table')}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                filters.viewMode === 'table'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'grid')}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                filters.viewMode === 'grid'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Active Filters Chips row */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            {t('common.activeFilters') || 'Active Filters'}:
          </span>

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium">
              <span>&ldquo;{filters.search}&rdquo;</span>
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="hover:text-primary-foreground hover:bg-primary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.role !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>
                {t('users.role') || 'Role'}: {filters.role.replace('_', ' ')}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange('role', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>
                {t('users.status') || 'Status'}: {filters.status}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange('status', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.business !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>
                {uniqueBusinesses.find((b) => b.id === filters.business)?.name ||
                  filters.business}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange('business', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors font-medium ml-auto rtl:ml-0 rtl:mr-auto"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{t('common.reset') || 'Reset All'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(UserFilterBar);
