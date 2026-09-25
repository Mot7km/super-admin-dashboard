import { memo, useState, useMemo, type FC } from 'react';
import {
  Search,
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Globe,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AdminAccessLog } from '../admin.types';

type AdminAccessLogsStreamProps = {
  logs: AdminAccessLog[];
};

export const AdminAccessLogsStream: FC<AdminAccessLogsStreamProps> = memo(({ logs }) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AdminAccessLog | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = log.adminName.toLowerCase().includes(q);
        const matchAction = log.action.toLowerCase().includes(q);
        const matchIp = log.ipAddress.toLowerCase().includes(q);
        const matchRes = log.resourceTarget.toLowerCase().includes(q);
        if (!matchName && !matchAction && !matchIp && !matchRes) return false;
      }

      if (riskFilter !== 'all' && log.riskScore !== riskFilter) return false;
      if (statusFilter !== 'all' && log.status !== statusFilter) return false;

      return true;
    });
  }, [logs, search, riskFilter, statusFilter]);

  const formatLogTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Low Risk
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
            Elevated Risk
          </span>
        );
    }
  };

  const getStatusBadge = (status: 'success' | 'blocked' | 'challenge_required') => {
    switch (status) {
      case 'success':
        return (
          <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Authorized</span>
          </span>
        );
      case 'blocked':
        return (
          <span className="text-rose-400 font-mono font-bold flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>RBAC Blocked</span>
          </span>
        );
      case 'challenge_required':
        return (
          <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>MFA Challenged</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-xl p-4 sm:p-5 space-y-4">
      {/* Stream Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-bold">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>SIEM Security Stream Live</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {filteredLogs.length} Events Captured
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('adminManagement.logs.searchPlaceholder')}
              className={`w-full rounded-xl border border-border/80 bg-surface-subtle/80 py-1.5 ${
                isAr ? 'pr-8 pl-7' : 'pl-8 pr-7'
              } text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className={`absolute ${isAr ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-surface-subtle/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">{t('adminManagement.logs.allRisks')}</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">Elevated Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-surface-subtle/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">{t('adminManagement.logs.allStatuses')}</option>
            <option value="success">Authorized</option>
            <option value="blocked">RBAC Blocked</option>
          </select>
        </div>
      </div>

      {/* Stream Table */}
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/70 text-muted-foreground text-[11px] font-mono uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">{t('adminManagement.logs.colActor')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.logs.colAction')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.logs.colTarget')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.logs.colNetwork')}</th>
              <th scope="col" className="py-3 px-4">{t('adminManagement.logs.colTime')}</th>
              <th scope="col" className="py-3 px-4 text-center">{t('adminManagement.logs.colRisk')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredLogs.map((log) => {
              const timing = formatLogTime(log.timestamp);

              return (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="group hover:bg-surface-subtle/70 transition-colors cursor-pointer"
                >
                  {/* Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>{log.adminName}</span>
                      {log.mfaVerified && (
                        <span title="MFA Verified Session">
                          <Lock className="h-3 w-3 text-emerald-500" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {log.adminRole}
                    </span>
                  </td>

                  {/* Action Description */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-medium text-foreground">
                      {isAr ? log.actionAr : log.action}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface-subtle border border-border text-muted-foreground">
                        {log.scope}
                      </span>
                      {getStatusBadge(log.status)}
                    </div>
                  </td>

                  {/* Resource Target */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-foreground">
                    <span className="px-2 py-0.5 rounded bg-surface-subtle border border-border">
                      {log.resourceTarget}
                    </span>
                  </td>

                  {/* Network / Geolocation */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-foreground font-mono text-[11px]">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span>{log.ipAddress}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {log.location}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-mono text-foreground text-xs">
                      {timing.time}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {timing.date}
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getRiskBadge(log.riskScore)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">
              {t('adminManagement.logs.noLogsFound')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('adminManagement.logs.noLogsDesc')}
            </p>
          </div>
        )}
      </div>

      {/* Forensic Detail Flyout / Inspector */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span>Forensic Access Inspection: {selectedLog.id}</span>
              </h4>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-mono block">Action Executed:</span>
                <p className="font-bold text-foreground text-sm">
                  {isAr ? selectedLog.actionAr : selectedLog.action}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-2.5 rounded-xl border border-border bg-surface-subtle/50">
                  <span className="text-[10px] text-muted-foreground uppercase block">Internal Actor:</span>
                  <span className="font-bold text-foreground">{selectedLog.adminName}</span>
                  <span className="text-[10px] text-muted-foreground block">({selectedLog.adminRole})</span>
                </div>
                <div className="p-2.5 rounded-xl border border-border bg-surface-subtle/50">
                  <span className="text-[10px] text-muted-foreground uppercase block">Security Risk Score:</span>
                  <span className="font-bold uppercase text-primary">{selectedLog.riskScore}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface-subtle/50 font-mono space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase block">User Agent / Client Signature:</span>
                <span className="text-[11px] text-foreground break-all">{selectedLog.userAgent}</span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface-subtle/50 font-mono space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase block">Network Geolocation & IP:</span>
                <span className="text-xs text-foreground font-bold">{selectedLog.ipAddress}</span>
                <span className="text-xs text-muted-foreground block">{selectedLog.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-sm"
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

AdminAccessLogsStream.displayName = 'AdminAccessLogsStream';
