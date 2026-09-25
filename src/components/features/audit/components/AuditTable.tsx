import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCode2,
  ChevronRight,
  Copy,
  Check,
  Building2,
  Monitor,
  Smartphone,
  Terminal,
  Server,
  Lock,
  Search
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  AuditLogEntry,
  AuditSeverity,
  AuditCategory,
  AuditStatus,
  AuditModalAction
} from '../audit.types';

interface AuditTableProps {
  logs: AuditLogEntry[];
  totalLogs: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onOpenModal: (action: AuditModalAction) => void;
  onSelectActor?: (actorId: string) => void;
  onSelectBusiness?: (businessId: string) => void;
  onSelectIp?: (ip: string) => void;
}

export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  totalLogs,
  page,
  pageSize,
  onPageChange,
  onOpenModal,
  onSelectActor,
  onSelectBusiness,
  onSelectIp
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const totalPages = Math.ceil(totalLogs / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const paginatedLogs = logs.slice(startIndex, startIndex + pageSize);

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {t('audit.severity.critical')}
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t('audit.severity.high')}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            {t('audit.severity.medium')}
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {t('audit.severity.low')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: AuditStatus, httpStatus?: number) => {
    switch (status) {
      case 'success':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>200 OK</span>
          </div>
        );
      case 'failure':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{httpStatus || 403} Denied</span>
          </div>
        );
      case 'warning':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{httpStatus || 429} Warning</span>
          </div>
        );
    }
  };

  const getCategoryBadge = (category: AuditCategory) => {
    const config: Record<AuditCategory, { bg: string; text: string; border: string }> = {
      security: { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' },
      business: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' },
      billing: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' },
      identity: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-800/40' },
      system: { bg: 'bg-slate-900/60', text: 'text-slate-400', border: 'border-slate-800' }
    };
    const c = config[category] || config.system;
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${c.bg} ${c.text} ${c.border}`}>
        {t(`audit.categories.${category}`)}
      </span>
    );
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-3.5 h-3.5 text-slate-400" />;
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-slate-400" />;
      case 'cli':
        return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Server className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    return {
      time: date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      date: date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  };

  if (paginatedLogs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl p-16 text-center">
        <div className="inline-flex p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 mb-4 shadow-inner">
          <Search className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">{t('audit.table.noLogsFound')}</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{t('audit.table.noLogsDesc')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl overflow-hidden shadow-2xl transition-all">
      {/* Table Top Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('audit.table.auditTrailStream')}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {totalLogs} {t('audit.table.eventsCount')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            {t('audit.table.immutableHmacLedger')}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/70 border-b border-slate-800/80 text-xs uppercase font-semibold text-slate-400 select-none">
            <tr>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colTimestamp')}</th>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colActor')}</th>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colAction')}</th>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colResource')}</th>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colClientContext')}</th>
              <th scope="col" className="py-3.5 px-4">{t('audit.table.colResult')}</th>
              <th scope="col" className="py-3.5 px-4 text-center">{t('audit.table.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedLogs.map((log) => {
              const dt = formatTimestamp(log.timestamp);
              const isCrit = log.severity === 'critical';

              return (
                <tr
                  key={log.id}
                  onClick={() => onOpenModal({ type: 'view_details', entry: log })}
                  className={`group cursor-pointer transition-colors hover:bg-slate-900/60 ${
                    isCrit ? 'bg-rose-950/10 hover:bg-rose-950/20' : ''
                  }`}
                >
                  {/* Timestamp & Severity */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-200">{dt.time}</span>
                        {getSeverityBadge(log.severity)}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{dt.date}</span>
                    </div>
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {log.actor.avatar ? (
                          <img
                            src={log.actor.avatar}
                            alt={log.actor.name}
                            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-indigo-400/30">
                            {log.actor.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        {log.actor.isSystem && (
                          <span
                            title="Automated System Bot"
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-slate-950 flex items-center justify-center text-[9px] text-white"
                          >
                            ⚡
                          </span>
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectActor?.(log.actor.id);
                          }}
                          className="font-medium text-slate-100 hover:text-cyan-400 transition-colors block text-left"
                        >
                          {log.actor.name}
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="text-[11px] text-indigo-400 font-mono">{log.actor.role}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[120px]">{log.actor.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Action & Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 max-w-[280px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getCategoryBadge(log.category)}
                        <span className="font-semibold text-slate-200 text-xs group-hover:text-cyan-300 transition-colors">
                          {log.actionLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 group-hover:text-slate-300">
                        {log.description}
                      </p>
                      {log.diff && log.diff.length > 0 && (
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenModal({ type: 'view_diff', entry: log });
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/50 transition-colors"
                          >
                            <FileCode2 className="w-3 h-3" />
                            {log.diff.length} {t('audit.table.changesRecorded')}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Resource & Business */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-200">{log.resource.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                          {log.resource.type}
                        </span>
                      </div>
                      {log.resource.businessName && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (log.resource.businessId) onSelectBusiness?.(log.resource.businessId);
                          }}
                          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>{log.resource.businessName}</span>
                          <span className="text-slate-500 font-mono text-[10px]">({log.resource.businessId})</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Client Context (IP / Location / Device) */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {getDeviceIcon(log.clientContext.deviceType)}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIp?.(log.clientContext.ipAddress);
                          }}
                          className="font-mono text-xs text-slate-300 hover:text-cyan-400 transition-colors"
                        >
                          {log.clientContext.ipAddress}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>{log.clientContext.countryCode}</span>
                        <span>•</span>
                        <span>{log.clientContext.location}</span>
                        <span>•</span>
                        <span>{log.clientContext.browser}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status & HTTP Code */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(log.status, log.httpStatus)}
                      {log.failureReason && (
                        <span className="text-[11px] text-rose-400 font-mono truncate max-w-[140px]" title={log.failureReason}>
                          {log.failureReason}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action Controls & HMAC */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleCopyHash(e, log.hashSignature)}
                        title={`${t('audit.table.copyHash')}: ${log.hashSignature}`}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                      >
                        {copiedHash === log.hashSignature ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenModal({ type: 'view_details', entry: log })}
                        title={t('audit.table.inspectDetails')}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          {t('audit.table.showing')}{' '}
          <span className="font-semibold text-slate-200">{Math.min(startIndex + 1, totalLogs)}</span> -{' '}
          <span className="font-semibold text-slate-200">{Math.min(startIndex + pageSize, totalLogs)}</span>{' '}
          {t('audit.table.of')} <span className="font-semibold text-slate-200">{totalLogs}</span> {t('audit.table.records')}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {t('audit.table.previous')}
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (
                p === 1 ||
                p === totalPages ||
                (p >= page - 1 && p <= page + 1)
              ) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      p === page
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                        : 'border border-slate-800/80 bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              if (p === page - 2 || p === page + 2) {
                return (
                  <span key={p} className="text-slate-600 px-1 text-xs">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {t('audit.table.next')}
          </button>
        </div>
      </div>
    </div>
  );
};
