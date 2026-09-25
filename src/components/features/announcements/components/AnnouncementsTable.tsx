import { memo, useState, useMemo, type FC } from 'react';
import {
  Search,
  Plus,
  FilterX,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Globe,
  Crown,
  Building2,
  Pin,
  Edit2,
  Trash2,
  Eye,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemAnnouncement, AnnouncementType, AnnouncementAudience } from '../announcements.types';

type AnnouncementsTableProps = {
  announcements: SystemAnnouncement[];
  selectedForPreviewId: string | null;
  onSelectForPreview: (announcement: SystemAnnouncement) => void;
  onToggle: (announcement: SystemAnnouncement) => void;
  onEdit: (announcement: SystemAnnouncement) => void;
  onDelete: (announcement: SystemAnnouncement) => void;
  onOpenCreate: () => void;
};

export const AnnouncementsTable: FC<AnnouncementsTableProps> = memo(({
  announcements,
  selectedForPreviewId,
  onSelectForPreview,
  onToggle,
  onEdit,
  onDelete,
  onOpenCreate,
}) => {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | AnnouncementType>('all');
  const [audienceFilter, setAudienceFilter] = useState<'all' | AnnouncementAudience>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesSearch =
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.titleAr.includes(search) ||
        a.message.toLowerCase().includes(search.toLowerCase()) ||
        a.messageAr.includes(search);

      const matchesType = typeFilter === 'all' || a.type === typeFilter;
      const matchesAudience = audienceFilter === 'all' || a.audience === audienceFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && a.isActive) ||
        (statusFilter === 'inactive' && !a.isActive);

      return matchesSearch && matchesType && matchesAudience && matchesStatus;
    });
  }, [announcements, search, typeFilter, audienceFilter, statusFilter]);

  const isFiltered = search !== '' || typeFilter !== 'all' || audienceFilter !== 'all' || statusFilter !== 'all';

  const getTypeBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Info className="h-3 w-3" />
            {t('announcements.types.info')}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-3 w-3" />
            {t('announcements.types.warning')}
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            {t('announcements.types.critical')}
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t('announcements.types.success')}
          </span>
        );
    }
  };

  const getAudienceBadge = (a: SystemAnnouncement) => {
    switch (a.audience) {
      case 'everyone':
        return (
          <div className="flex items-center gap-1 text-xs font-semibold text-sky-400">
            <Globe className="h-3.5 w-3.5" />
            <span>{t('announcements.audience.everyone')}</span>
          </div>
        );
      case 'plans':
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400">
              <Crown className="h-3.5 w-3.5" />
              <span>{t('announcements.audience.plans')}</span>
            </div>
            {a.targetLabels && (
              <span className="text-[10px] text-muted-foreground font-mono">
                {a.targetLabels.join(', ')}
              </span>
            )}
          </div>
        );
      case 'businesses':
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <Building2 className="h-3.5 w-3.5" />
              <span>{t('announcements.audience.businesses')}</span>
            </div>
            {a.targetLabels && (
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {a.targetLabels.join(', ')}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-card/60 backdrop-blur-xl border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('announcements.filters.searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2 text-sm rounded-xl bg-background/80 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">{t('announcements.filters.allTypes')}</option>
            <option value="info">🔵 {t('announcements.types.info')}</option>
            <option value="warning">🟡 {t('announcements.types.warning')}</option>
            <option value="critical">🔴 {t('announcements.types.critical')}</option>
            <option value="success">🟢 {t('announcements.types.success')}</option>
          </select>

          {/* Audience Filter */}
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">{t('announcements.filters.allAudiences')}</option>
            <option value="everyone">🌐 {t('announcements.audience.everyone')}</option>
            <option value="plans">👑 {t('announcements.audience.plans')}</option>
            <option value="businesses">🏢 {t('announcements.audience.businesses')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-xl bg-background/80 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">{t('announcements.filters.allStatuses')}</option>
            <option value="active">{t('announcements.filters.activeOnly')}</option>
            <option value="inactive">{t('announcements.filters.inactiveOnly')}</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setAudienceFilter('all');
                setStatusFilter('all');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>{t('announcements.filters.reset')}</span>
            </button>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={onOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>{t('announcements.actions.createAnnouncement')}</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 text-start">{t('announcements.table.announcement')}</th>
                <th className="py-3.5 px-4 text-start">{t('announcements.table.type')}</th>
                <th className="py-3.5 px-4 text-start">{t('announcements.table.audience')}</th>
                <th className="py-3.5 px-4 text-center">{t('announcements.table.status')}</th>
                <th className="py-3.5 px-4 text-start">{t('announcements.table.schedule')}</th>
                <th className="py-3.5 px-4 text-end">{t('announcements.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((item) => {
                const isSelected = item.id === selectedForPreviewId;
                const isRtl = locale === 'ar';
                const displayTitle = isRtl ? item.titleAr : item.title;
                const displayMessage = isRtl ? item.messageAr : item.message;

                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors duration-150 ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                    }`}
                  >
                    {/* Announcement Title & Message */}
                    <td className="py-4 px-4 align-top max-w-[320px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {item.isPinned && (
                            <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                          <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {displayTitle}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {displayMessage}
                        </p>
                      </div>
                    </td>

                    {/* Severity Type */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      {getTypeBadge(item.type)}
                    </td>

                    {/* Target Audience */}
                    <td className="py-4 px-4 align-top">
                      {getAudienceBadge(item)}
                    </td>

                    {/* Instant Active Toggle */}
                    <td className="py-4 px-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.isActive}
                          onClick={() => onToggle(item)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              item.isActive ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[10px] font-bold ${
                          item.isActive ? 'text-emerald-500' : 'text-muted-foreground'
                        }`}>
                          {item.isActive ? t('announcements.table.active') : t('announcements.table.inactive')}
                        </span>
                      </div>
                    </td>

                    {/* Schedule / Created info */}
                    <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-muted-foreground">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <Calendar className="h-3 w-3" />
                          <span>{item.startDate} {item.endDate ? `→ ${item.endDate}` : ''}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/70">
                          {item.createdBy}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview in Simulator */}
                        <button
                          onClick={() => onSelectForPreview(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title={t('announcements.actions.preview')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title={t('announcements.actions.edit')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title={t('announcements.actions.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

AnnouncementsTable.displayName = 'AnnouncementsTable';
