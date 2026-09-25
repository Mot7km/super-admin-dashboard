import { memo, type FC, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  Building2,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  Plus,
  Layers,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  SupportFilterState,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  SupportTicket,
  SupportAdminStaff
} from '../support.types';

type SupportFilterBarProps = {
  filters: SupportFilterState;
  onFilterChange: <K extends keyof SupportFilterState>(
    key: K,
    value: SupportFilterState[K]
  ) => void;
  onResetFilters: () => void;
  tickets: SupportTicket[];
  staff: SupportAdminStaff[];
  onOpenCreateModal: () => void;
};

const STATUS_TABS: { id: 'all' | TicketStatus; labelKey: string }[] = [
  { id: 'all', labelKey: 'support.status.all' },
  { id: 'open', labelKey: 'support.status.open' },
  { id: 'pending', labelKey: 'support.status.pending' },
  { id: 'resolved', labelKey: 'support.status.resolved' },
  { id: 'closed', labelKey: 'support.status.closed' },
];

const SupportFilterBar: FC<SupportFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  tickets,
  staff,
  onOpenCreateModal,
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

  // Compute status counts for badges
  const statusCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      pending: tickets.filter((t) => t.status === 'pending').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    };
  }, [tickets]);

  // Unique businesses
  const uniqueBusinesses = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of tickets) {
      if (t.businessId && t.businessName) {
        map.set(t.businessId, t.businessName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [tickets]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.business !== 'all' ||
    filters.assignedAdmin !== 'all';

  return (
    <div className="space-y-3.5">
      {/* 1. Status Segmented Tabs + Create Ticket Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const isSelected = filters.status === tab.id;
            const count = statusCounts[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange('status', tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all select-none flex items-center gap-2 ${
                  isSelected
                    ? 'bg-card text-foreground shadow-xs border border-border/80 font-black'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <span>{t(tab.labelKey)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
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

        {/* Action Button: Create Ticket */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t('support.action.newTicket')}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Search & Multi-Dimensional Dropdown Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-card/85 backdrop-blur-md border border-border/70 rounded-2xl p-2.5 sm:p-3 shadow-xs">
        {/* Search Input with Hotkey Badge */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={t('support.filter.searchPlaceholder')}
            className="w-full h-9 pl-9 pr-14 rtl:pl-9 rtl:pr-14 rounded-xl bg-surface-subtle border border-border/70 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
          <div className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            {filters.search ? (
              <button
                type="button"
                onClick={() => onFilterChange('search', '')}
                className="pointer-events-auto h-5 w-5 rounded-md hover:bg-surface-elevated text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-border/80 bg-card text-[10px] font-mono font-bold text-muted-foreground">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.priority}
              aria-label={t('support.filter.priority')}
              onChange={(e) => onFilterChange('priority', e.target.value as 'all' | TicketPriority)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('support.filter.allPriorities')}</option>
              <option value="critical">{t('support.priority.critical')}</option>
              <option value="high">{t('support.priority.high')}</option>
              <option value="medium">{t('support.priority.medium')}</option>
              <option value="low">{t('support.priority.low')}</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Business / Tenant Filter */}
          <div className="relative min-w-[130px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.business}
              aria-label={t('support.filter.business')}
              onChange={(e) => onFilterChange('business', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('support.filter.allBusinesses')}</option>
              {uniqueBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Assigned Admin Filter */}
          <div className="relative min-w-[130px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.assignedAdmin}
              aria-label={t('support.filter.assignedAdmin')}
              onChange={(e) => onFilterChange('assignedAdmin', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('support.filter.allAssignees')}</option>
              <option value="unassigned">{t('support.filter.unassigned')}</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.category}
              aria-label={t('support.filter.category')}
              onChange={(e) => onFilterChange('category', e.target.value as 'all' | TicketCategory)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('support.filter.allCategories')}</option>
              <option value="pos_hardware">{t('support.category.pos_hardware')}</option>
              <option value="technical">{t('support.category.technical')}</option>
              <option value="billing">{t('support.category.billing')}</option>
              <option value="account">{t('support.category.account')}</option>
              <option value="feature_request">{t('support.category.feature_request')}</option>
              <option value="security">{t('support.category.security')}</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Sort By Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.sortBy}
              aria-label={t('support.filter.sortBy')}
              onChange={(e) => onFilterChange('sortBy', e.target.value as any)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="urgency">{t('support.sort.urgency')}</option>
              <option value="newest">{t('support.sort.newest')}</option>
              <option value="oldest">{t('support.sort.oldest')}</option>
              <option value="sla">{t('support.sort.sla')}</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Active Filters Chips row */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            {t('support.filter.activeFilters')}:
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

          {filters.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Priority: {filters.priority}</span>
              <button
                type="button"
                onClick={() => onFilterChange('priority', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.business !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Business: {uniqueBusinesses.find((b) => b.id === filters.business)?.name || filters.business}</span>
              <button
                type="button"
                onClick={() => onFilterChange('business', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.assignedAdmin !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>
                Assignee: {filters.assignedAdmin === 'unassigned' ? 'Unassigned' : staff.find((s) => s.id === filters.assignedAdmin)?.name || filters.assignedAdmin}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange('assignedAdmin', 'all')}
                className="hover:text-foreground rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Category: {filters.category}</span>
              <button
                type="button"
                onClick={() => onFilterChange('category', 'all')}
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
            <span>{t('support.filter.clearAll')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(SupportFilterBar);
