import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileCode2,
  Building2,
  Terminal,
  Server,
  Monitor,
  Smartphone,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type {
  AuditLogEntry,
  AuditSeverity,
  AuditStatus,
  AuditModalAction
} from '../audit.types';

interface AuditTimelineFeedProps {
  logs: AuditLogEntry[];
  onOpenModal: (action: AuditModalAction) => void;
  onSelectActor?: (actorId: string) => void;
  onSelectBusiness?: (businessId: string) => void;
}

export const AuditTimelineFeed: React.FC<AuditTimelineFeedProps> = ({
  logs,
  onOpenModal,
  onSelectActor,
  onSelectBusiness
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const getSeverityGlow = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-rose-500/50 bg-rose-950/20 text-rose-400 shadow-rose-900/20';
      case 'high':
        return 'border-amber-500/50 bg-amber-950/20 text-amber-400 shadow-amber-900/20';
      case 'medium':
        return 'border-sky-500/50 bg-sky-950/20 text-sky-400 shadow-sky-900/20';
      case 'low':
      default:
        return 'border-slate-700 bg-slate-900/50 text-slate-400 shadow-slate-900/20';
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case 'success':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'failure':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
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

  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl p-16 text-center">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-200 mb-1">{t('audit.table.noLogsFound')}</h3>
        <p className="text-sm text-slate-400">{t('audit.table.noLogsDesc')}</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 pr-2 md:pl-8 space-y-6">
      {/* Central timeline spine line */}
      <div className={`absolute top-3 bottom-3 w-0.5 bg-gradient-to-b from-cyan-500/50 via-slate-700 to-transparent ${isAr ? 'right-4 md:right-5' : 'left-4 md:left-5'}`} />

      {logs.map((log) => {
        const dateObj = new Date(log.timestamp);
        const formattedTime = dateObj.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        const formattedDate = dateObj.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <div key={log.id} className="relative group">
            {/* Timeline Node Icon */}
            <div
              className={`absolute top-4 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 z-10 ${
                isAr ? '-right-7 md:-right-8' : '-left-7 md:-left-8'
              } ${getSeverityGlow(log.severity)} bg-slate-950`}
            >
              {getStatusIcon(log.status)}
            </div>

            {/* Event Card */}
            <div
              onClick={() => onOpenModal({ type: 'view_details', entry: log })}
              className="rounded-2xl border border-slate-800/90 bg-slate-950/70 backdrop-blur-xl p-5 shadow-xl hover:border-slate-700 hover:bg-slate-900/50 transition-all cursor-pointer group/card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                {/* Actor & Action Header */}
                <div className="flex items-center gap-3">
                  {log.actor.avatar ? (
                    <img
                      src={log.actor.avatar}
                      alt={log.actor.name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-indigo-400/30">
                      {log.actor.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActor?.(log.actor.id);
                        }}
                        className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors"
                      >
                        {log.actor.name}
                      </button>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono">
                        {log.actor.role}
                      </span>
                      {log.actor.isSystem && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                          SYSTEM BOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{log.actor.email}</p>
                  </div>
                </div>

                {/* Timestamp & Status */}
                <div className="flex flex-col items-end gap-1 text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-300">{formattedTime}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2 py-0.5 rounded uppercase font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                      {log.action}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Description & Target */}
              <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/80 mb-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-200">
                    {log.description}
                  </span>
                  {log.resource.businessName && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (log.resource.businessId) onSelectBusiness?.(log.resource.businessId);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{log.resource.businessName}</span>
                    </button>
                  )}
                </div>

                {/* State Diff Preview if Available */}
                {log.diff && log.diff.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/60">
                    <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                        {t('audit.table.stateModifications')} ({log.diff.length})
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenModal({ type: 'view_diff', entry: log });
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                      >
                        {t('audit.table.viewFullDiff')}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {log.diff.slice(0, 2).map((d, i) => (
                        <div key={i} className="text-xs font-mono p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                          <span className="text-slate-400">{d.label || d.field}:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-rose-400 line-through opacity-80">{String(d.oldValue)}</span>
                            <span className="text-slate-600">→</span>
                            <span className="text-emerald-400 font-bold">{String(d.newValue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Client Telemetry Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    {getDeviceIcon(log.clientContext.deviceType)}
                    <span className="text-slate-400">{log.clientContext.ipAddress}</span>
                  </span>
                  <span>•</span>
                  <span>{log.clientContext.location} ({log.clientContext.countryCode})</span>
                  <span>•</span>
                  <span>{log.clientContext.browser}</span>
                </div>

                <div className="flex items-center gap-2 text-cyan-400 group-hover/card:translate-x-1 transition-transform">
                  <span className="text-xs font-sans font-medium">{t('audit.table.inspectDetails')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
