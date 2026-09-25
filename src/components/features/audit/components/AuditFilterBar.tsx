import { memo, type FC, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  Shield,
  Building2,
  User,
  Calendar,
  RotateCcw,
  List,
  GitBranch,
  ChevronDown,
  Download,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  AuditFilterState,
  AuditCategory,
  AuditDatePreset,
  AuditLogEntry,
} from '../audit.types';

type AuditFilterBarProps = {
  filters: AuditFilterState;
  onFilterChange: <K extends keyof AuditFilterState>(
    key: K,
    value: AuditFilterState[K],
  ) => void;
  onResetFilters: () => void;
  logs: AuditLogEntry[];
  onOpenExportModal: () => void;
};

const CATEGORIES: { id: 'all' | AuditCategory; labelKey: string; defaultLabel: string }[] = [
  { id: 'all', labelKey: 'audit.categories.all', defaultLabel: 'All Events' },
  { id: 'security', labelKey: 'audit.categories.security', defaultLabel: 'Security & Access' },
  { id: 'business', labelKey: 'audit.categories.business', defaultLabel: 'Business Mutations' },
  { id: 'billing', labelKey: 'audit.categories.billing', defaultLabel: 'Billing & Plans' },
  { id: 'identity', labelKey: 'audit.categories.identity', defaultLabel: 'Identity & Tokens' },
  { id: 'system', labelKey: 'audit.categories.system', defaultLabel: 'System Core' },
];

const AuditFilterBar: FC<AuditFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  logs,
  onOpenExportModal,
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

  // Compute unique actors & businesses from log stream
  const uniqueActors = useMemo(() => {
    const map = new Map<string, string>();
    for (const log of logs) {
      if (log.actor.id && log.actor.name) {
        map.set(log.actor.id, log.actor.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  const uniqueBusinesses = useMemo(() => {
    const map = new Map<string, string>();
    for (const log of logs) {
      if (log.resource.businessId && log.resource.businessName) {
        map.set(log.resource.businessId, log.resource.businessName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.category !== 'all' ||
    filters.severity !== 'all' ||
    filters.status !== 'all' ||
    filters.actor !== 'all' ||
    filters.business !== 'all' ||
    filters.resourceType !== 'all' ||
    filters.dateRange !== 'all' ||
    Boolean(filters.ipAddress);

  return (
    <div className="space-y-3.5">
      {/* 1. Category Segmented Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange('category', cat.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all select-none ${
                  isSelected
                    ? 'bg-card text-foreground shadow-xs border border-border/80 font-black'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <span>{t(cat.labelKey) || cat.defaultLabel}</span>
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode & Export Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="flex items-center rounded-xl bg-surface-subtle p-1 border border-border/70">
            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'table')}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                filters.viewMode === 'table'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Table View"
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={() => onFilterChange('viewMode', 'timeline')}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                filters.viewMode === 'timeline'
                  ? 'bg-card text-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Timeline Feed"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>Timeline</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:bg-surface-subtle text-foreground text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. Main Search & Multi-Dimensional Filter Dropdowns */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 bg-card/85 backdrop-blur-md border border-border/70 rounded-2xl p-2.5 sm:p-3 shadow-xs">
        {/* Search Input with Hotkey Badge */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder={
              t('audit.filter.searchPlaceholder')
            }
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
          {/* Actor Filter */}
          <div className="relative min-w-[130px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <User className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.actor}
              aria-label={t('audit.filter.actor')}
              onChange={(e) => onFilterChange('actor', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('audit.filter.allActors')}</option>
              {uniqueActors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
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
              aria-label={t('audit.filter.business')}
              onChange={(e) => onFilterChange('business', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('audit.filter.allBusinesses')}</option>
              {uniqueBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Resource Type Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.resourceType}
              aria-label={t('audit.filter.resourceType')}
              onChange={(e) => onFilterChange('resourceType', e.target.value)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('audit.filter.allResources')}</option>
              <option value="business">Business Entity</option>
              <option value="subscription">Subscription Plan</option>
              <option value="user">User Identity</option>
              <option value="invoice">Invoice & Refund</option>
              <option value="gateway">Payment Gateway</option>
              <option value="system_core">System Core</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Date Range Filter */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.dateRange}
              aria-label={t('audit.filter.datePreset')}
              onChange={(e) => onFilterChange('dateRange', e.target.value as AuditDatePreset)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('audit.filter.dateAll')}</option>
              <option value="today">{t('audit.filter.dateToday')}</option>
              <option value="24h">{t('audit.filter.date24h')}</option>
              <option value="7d">{t('audit.filter.date7d')}</option>
              <option value="30d">{t('audit.filter.date30d')}</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Success / Failure Status */}
          <div className="relative min-w-[125px]">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <select
              value={filters.status}
              aria-label={t('audit.filter.status')}
              onChange={(e) => onFilterChange('status', e.target.value as any)}
              className="w-full h-9 pl-8 pr-7 rtl:pl-8 rtl:pr-8 rounded-xl bg-surface-subtle border border-border/70 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all appearance-none"
            >
              <option value="all">{t('audit.filter.allStatuses')}</option>
              <option value="success">{t('audit.status.success')}</option>
              <option value="failure">{t('audit.status.failure')}</option>
              <option value="warning">{t('audit.status.warning')}</option>
            </select>
            <ChevronDown className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Custom Date Range Pickers (if selected) */}
      {filters.dateRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-card border border-primary/30 text-xs animate-in fade-in duration-200">
          <span className="font-bold text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Custom Date Interval:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-surface-subtle border border-border text-foreground font-mono"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-surface-subtle border border-border text-foreground font-mono"
            />
          </div>
        </div>
      )}

      {/* 4. Active Filters Chips row */}
      {hasActiveFilters && (
        <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            {t('audit.filter.activeFilters')}
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

          {filters.actor !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Actor: {uniqueActors.find((a) => a.id === filters.actor)?.name || filters.actor}</span>
              <button
                type="button"
                onClick={() => onFilterChange('actor', 'all')}
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

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-subtle border border-border text-foreground font-medium">
              <span>Status: {filters.status}</span>
              <button
                type="button"
                onClick={() => onFilterChange('status', 'all')}
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
            <span>{t('audit.filter.clearAll')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(AuditFilterBar);
