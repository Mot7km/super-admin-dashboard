import { memo, useState, useMemo, type FC } from 'react';
import {
  Search,
  X,
  Bell,
  Smartphone,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
  Copy
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  NotificationBroadcast,
  NotificationChannel,
  NotificationType,
  BroadcastStatus,
  NotificationModalAction
} from '../notification.types';

type BroadcastHistoryTableProps = {
  broadcasts: NotificationBroadcast[];
  onOpenModal: (action: NotificationModalAction) => void;
  onCloneBroadcast: (broadcast: NotificationBroadcast) => void;
};

const BroadcastHistoryTable: FC<BroadcastHistoryTableProps> = ({
  broadcasts,
  onOpenModal,
  onCloneBroadcast,
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | NotificationChannel>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BroadcastStatus>('all');

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = b.title.toLowerCase().includes(q);
        const matchMsg = b.message.toLowerCase().includes(q);
        const matchId = b.id.toLowerCase().includes(q);
        const matchAuthor = b.authorName.toLowerCase().includes(q);
        if (!matchTitle && !matchMsg && !matchId && !matchAuthor) return false;
      }

      if (channelFilter !== 'all' && !b.channels.includes(channelFilter)) {
        return false;
      }

      if (typeFilter !== 'all' && b.type !== typeFilter) {
        return false;
      }

      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [broadcasts, search, channelFilter, typeFilter, statusFilter]);

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'maintenance':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
            {t('notifications.type.maintenance')}
          </span>
        );
      case 'security_alert':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-500 border border-rose-500/30">
            {t('notifications.type.security_alert')}
          </span>
        );
      case 'system_update':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            {t('notifications.type.system_update')}
          </span>
        );
      case 'promotional':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
            {t('notifications.type.promotional')}
          </span>
        );
      case 'general_info':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {t('notifications.type.general_info')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: BroadcastStatus) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t('notifications.status.sent')}
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-3 w-3 animate-pulse" />
            {t('notifications.status.scheduled')}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {t('notifications.status.draft')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {t('notifications.status.cancelled')}
          </span>
        );
    }
  };

  const formatDateTime = (iso?: string): { date: string; time: string } => {
    if (!iso) return { date: '-', time: '-' };
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl space-y-4 p-4 sm:p-5">
      {/* Search & Multi-Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('notifications.filter.searchPlaceholder')}
            className="w-full h-9 pl-9 pr-8 rtl:pl-8 rtl:pr-9 rounded-xl bg-surface-subtle border border-border text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Channel Filter */}
          <select
            value={channelFilter}
            aria-label="Filter by Channel"
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-surface-subtle border border-border text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">{t('notifications.filter.allChannels')}</option>
            <option value="in_app">{t('notifications.channel.in_app')}</option>
            <option value="push">{t('notifications.channel.push')}</option>
            <option value="email">{t('notifications.channel.email')}</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            aria-label="Filter by Type"
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-surface-subtle border border-border text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">{t('notifications.filter.allTypes')}</option>
            <option value="maintenance">{t('notifications.type.maintenance')}</option>
            <option value="security_alert">{t('notifications.type.security_alert')}</option>
            <option value="system_update">{t('notifications.type.system_update')}</option>
            <option value="promotional">{t('notifications.type.promotional')}</option>
            <option value="general_info">{t('notifications.type.general_info')}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            aria-label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 rounded-xl bg-surface-subtle border border-border text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">{t('notifications.filter.allStatuses')}</option>
            <option value="sent">{t('notifications.status.sent')}</option>
            <option value="scheduled">{t('notifications.status.scheduled')}</option>
            <option value="draft">{t('notifications.status.draft')}</option>
            <option value="cancelled">{t('notifications.status.cancelled')}</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-left rtl:text-right text-xs text-foreground">
          <thead className="bg-surface-subtle/80 border-b border-border/80 text-[11px] uppercase font-bold text-muted-foreground select-none">
            <tr>
              <th scope="col" className="py-3 px-4">{t('notifications.table.colBroadcast')}</th>
              <th scope="col" className="py-3 px-4">{t('notifications.table.colChannels')}</th>
              <th scope="col" className="py-3 px-4">{t('notifications.table.colAudience')}</th>
              <th scope="col" className="py-3 px-4">{t('notifications.table.colStatusTiming')}</th>
              <th scope="col" className="py-3 px-4">{t('notifications.table.colDeliveryRead')}</th>
              <th scope="col" className="py-3 px-4 text-center">{t('notifications.table.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredBroadcasts.map((item) => {
              const timing = formatDateTime(item.status === 'scheduled' ? item.scheduledAt : item.sentAt);
              const readPercent = item.metrics.deliveredCount > 0
                ? Math.round((item.metrics.readCount / item.metrics.deliveredCount) * 100)
                : 0;

              return (
                <tr
                  key={item.id}
                  onClick={() => onOpenModal({ type: 'inspect_broadcast', broadcast: item })}
                  className="group hover:bg-surface-subtle/70 transition-colors cursor-pointer"
                >
                  {/* Broadcast ID & Title */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-foreground bg-surface-subtle px-1.5 py-0.5 rounded border border-border text-[11px]">
                        {item.id}
                      </span>
                      {getTypeBadge(item.type)}
                    </div>
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      By {item.authorName}
                    </div>
                  </td>

                  {/* Channels */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {item.channels.includes('in_app') && (
                        <span title="In-App Banner" className="p-1 rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                          <Bell className="h-3.5 w-3.5" />
                        </span>
                      )}
                      {item.channels.includes('push') && (
                        <span title="Mobile Push" className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Smartphone className="h-3.5 w-3.5" />
                        </span>
                      )}
                      {item.channels.includes('email') && (
                        <span title="Email Campaign" className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                          <Mail className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Target Audience */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-foreground">
                      {item.audience.type === 'all_businesses' && 'All Businesses'}
                      {item.audience.type === 'specific_business' && `${item.audience.businessIds?.length || 1} Specific Tenants`}
                      {item.audience.type === 'by_plan' && item.audience.plans?.join(', ')}
                      {item.audience.type === 'by_role' && item.audience.roles?.join(', ')}
                      {item.audience.type === 'specific_users' && 'Direct Users'}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      ~{item.audience.estimatedUsersCount.toLocaleString()} Users ({item.audience.estimatedBusinessesCount} Tenants)
                    </div>
                  </td>

                  {/* Status & Timing */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(item.status)}
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {timing.date} • {timing.time}
                      </div>
                    </div>
                  </td>

                  {/* Delivery & Read Metrics */}
                  <td className="py-3.5 px-4 min-w-[150px]">
                    {item.status === 'sent' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground">{item.metrics.readCount} Reads</span>
                          <span className="font-bold text-primary">{readPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-surface-subtle overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${readPercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {item.metrics.deliveredCount.toLocaleString()} Delivered
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-mono text-xs">
                        Awaiting release
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenModal({ type: 'inspect_broadcast', broadcast: item })}
                        title="Inspect Broadcast"
                        className="p-1.5 rounded-lg border border-border bg-surface-subtle text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onCloneBroadcast(item)}
                        title="Clone Campaign"
                        className="p-1.5 rounded-lg border border-border bg-surface-subtle text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>

                      {item.status === 'scheduled' && (
                        <button
                          type="button"
                          onClick={() => onOpenModal({ type: 'cancel_scheduled', broadcast: item })}
                          title="Cancel Scheduled Broadcast"
                          className="p-1.5 rounded-lg border border-border bg-surface-subtle text-rose-500 hover:bg-rose-500/10 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(BroadcastHistoryTable);
