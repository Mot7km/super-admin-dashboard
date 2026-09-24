import React from 'react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import { ShieldCheck, Search } from 'lucide-react';
import Select from '../../../ui/Select';
import type { SelectOption } from '../../../ui/Select';
import type { AuditLog } from '../settings.types';

type AuditTabProps = {
  logs: AuditLog[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
};

const getTypeBadge = (type: AuditLog['type']) => {
  switch (type) {
    case 'price':
      return <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 ring-1 ring-emerald-500/20 whitespace-nowrap">Menu & Prices</span>;
    case 'stock':
      return <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500 ring-1 ring-amber-500/20 whitespace-nowrap">Stock & Recipes</span>;
    case 'staff':
      return <span className="rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-500 ring-1 ring-sky-500/20 whitespace-nowrap">Staff & Roles</span>;
    case 'auth':
      return <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500 ring-1 ring-purple-500/20 whitespace-nowrap">Auth & Security</span>;
    case 'delete':
      return <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500 ring-1 ring-rose-500/20 whitespace-nowrap">Deletion</span>;
    default:
      return null;
  }
};

const AuditTab: React.FC<AuditTabProps> = ({
  logs,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
}) => {
  const { t } = useTranslation();

  // Options for type filter
  const filterOptions: SelectOption[] = [
    { value: 'all', label: t('settings.audit.filterActionType') },
    { value: 'price', label: t('settings.audit.filterPrice') },
    { value: 'stock', label: t('settings.audit.filterStock') },
    { value: 'staff', label: t('settings.audit.filterStaff') },
    { value: 'auth', label: t('settings.audit.filterAuth') },
    { value: 'delete', label: t('settings.audit.filterDelete') },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[var(--primary)] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            {t('settings.audit.title')}
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={filterOptions}
            placeholder={t('settings.audit.filterActionType')}
            className="w-full sm:w-auto min-w-[160px]"
          />

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('settings.audit.searchPlaceholder')}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-1.5 pl-8 pr-3 text-xs font-medium focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>
      </div>

      {/* Logs list */}
      <div className="space-y-2.5 text-xs">
        {logs.length === 0 ? (
          <p className="text-center py-8 text-[var(--text-muted)]">{t('common.noResults')}</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between hover:border-[var(--primary)]/30 transition"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--card)] font-bold text-[var(--primary)] ring-1 ring-[var(--color-border)]">
                  {log.user.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="font-bold text-[var(--text-primary)] truncate">{log.action}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 justify-between sm:justify-start">
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">By {log.user}</p>
                    {getTypeBadge(log.type)}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap self-end sm:self-auto">
                {log.time}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditTab;