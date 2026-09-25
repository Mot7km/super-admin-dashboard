import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  FileCode2,
  Download,
  Building2,
  Globe,
  FileSpreadsheet,
  FileJson,
  FileText,
  User
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { AuditModalAction } from '../audit.types';

interface AuditActionModalsProps {
  modalAction: AuditModalAction;
  onClose: () => void;
  onExportConfirm: (format: 'json' | 'csv' | 'pdf', filterSummary: string) => void;
}

export const AuditActionModals: React.FC<AuditActionModalsProps> = ({
  modalAction,
  onClose,
  onExportConfirm
}) => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [includeSha256, setIncludeSha256] = useState(true);

  if (!modalAction) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Deep Event Inspector Modal
  if (modalAction.type === 'view_details') {
    const entry = modalAction.entry;
    const dateObj = new Date(entry.timestamp);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{t('audit.modal.detailsTitle')}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {entry.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{t('audit.modal.detailsSubtitle')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
            {/* Primary Action Banner */}
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded uppercase font-mono font-semibold bg-slate-800 text-slate-300">
                    {entry.action}
                  </span>
                  <span className="text-xs font-semibold text-cyan-400">{entry.actionLabel}</span>
                </div>
                <p className="text-sm font-semibold text-slate-100">{entry.description}</p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-slate-300">
                  {dateObj.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {dateObj.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Actor & Resource 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Actor Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>{t('audit.modal.actorInformation')}</span>
                </div>
                <div className="flex items-center gap-3">
                  {entry.actor.avatar ? (
                    <img
                      src={entry.actor.avatar}
                      alt={entry.actor.name}
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      {entry.actor.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-100">{entry.actor.name}</div>
                    <div className="text-xs text-indigo-400 font-mono">{entry.actor.role}</div>
                  </div>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
                  <div>Email: <span className="text-slate-200">{entry.actor.email}</span></div>
                  <div>Actor ID: <span className="text-slate-200">{entry.actor.id}</span></div>
                </div>
              </div>

              {/* Resource Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('audit.modal.targetResource')}</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">{entry.resource.type}</div>
                  <div className="font-semibold text-slate-100">{entry.resource.name}</div>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-400 pt-1">
                  <div>Resource ID: <span className="text-slate-200">{entry.resource.id}</span></div>
                  {entry.resource.businessName && (
                    <div>
                      Tenant: <span className="text-emerald-400">{entry.resource.businessName}</span> ({entry.resource.businessId})
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Client Context & Network Telemetry */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 pb-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t('audit.modal.clientTelemetry')}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">IP Address:</span>
                  <span className="font-mono text-slate-200">{entry.clientContext.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Geo Location:</span>
                  <span className="text-slate-200">{entry.clientContext.location} ({entry.clientContext.countryCode})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Browser / OS:</span>
                  <span className="text-slate-200">{entry.clientContext.browser} / {entry.clientContext.os}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Device Type:</span>
                  <span className="uppercase font-mono text-slate-200">{entry.clientContext.deviceType}</span>
                </div>
              </div>

              <div className="pt-2 text-xs font-mono">
                <span className="text-slate-500 block">Request ID:</span>
                <span className="text-cyan-300 break-all">{entry.clientContext.requestId}</span>
              </div>
              <div className="text-xs font-mono">
                <span className="text-slate-500 block">User-Agent Header:</span>
                <span className="text-slate-400 break-all text-[11px]">{entry.clientContext.userAgent}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 HMAC Signature */}
            <div className="p-4 rounded-xl border border-cyan-900/50 bg-cyan-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {t('audit.modal.hmacIntegritySignature')}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('hash', entry.hashSignature)}
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                >
                  {copiedKey === 'hash' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{t('audit.modal.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t('audit.modal.copyHash')}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-cyan-200 break-all bg-slate-950/80 p-2.5 rounded-lg border border-cyan-800/40">
                {entry.hashSignature}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('audit.modal.hmacVerified')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleCopy('rawJson', JSON.stringify(entry, null, 2))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copiedKey === 'rawJson' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t('audit.modal.copiedJson')}</span>
                </>
              ) : (
                <>
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>{t('audit.modal.copyRawJson')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              {t('audit.modal.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. State Diff Inspector Modal
  if (modalAction.type === 'view_diff') {
    const entry = modalAction.entry;
    const diffList = entry.diff || [];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{t('audit.modal.diffTitle')}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {entry.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{entry.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Diff List */}
          <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{t('audit.modal.diffLegend')}:</span>
              <div className="flex items-center gap-3 font-mono">
                <span className="inline-flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded bg-rose-500" /> {t('audit.modal.previousState')}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded bg-emerald-500" /> {t('audit.modal.mutatedState')}
                </span>
              </div>
            </div>

            {diffList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                {t('audit.modal.noDiffAvailable')}
              </div>
            ) : (
              <div className="space-y-3">
                {diffList.map((d, i) => (
                  <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="font-semibold text-slate-200">{d.label || d.field}</span>
                      <span className="text-xs font-mono text-cyan-400">{d.field}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Old Value */}
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                        <span className="text-[10px] font-mono uppercase text-rose-400 block mb-1">
                          {t('audit.modal.before')}
                        </span>
                        <div className="font-mono text-xs text-rose-300 break-all line-through opacity-80">
                          {d.oldValue === null ? 'null' : String(d.oldValue)}
                        </div>
                      </div>

                      {/* New Value */}
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
                          {t('audit.modal.after')}
                        </span>
                        <div className="font-mono text-xs text-emerald-300 font-bold break-all">
                          {d.newValue === null ? 'null' : String(d.newValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {t('audit.modal.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Compliance Dossier Export Modal
  if (modalAction.type === 'export_dossier') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{t('audit.modal.exportTitle')}</h3>
                <p className="text-xs text-slate-400">{t('audit.modal.exportSubtitle')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-sm text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t('audit.modal.selectFormat')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    exportFormat === 'json'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <FileJson className="w-6 h-6" />
                  <span className="text-xs">JSON (Signed)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    exportFormat === 'csv'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <FileSpreadsheet className="w-6 h-6" />
                  <span className="text-xs">CSV Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExportFormat('pdf')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span className="text-xs">PDF Dossier</span>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSha256}
                  onChange={(e) => setIncludeSha256(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/40 w-4 h-4 bg-slate-900"
                />
                <span className="text-xs text-slate-300">{t('audit.modal.includeShaSignatures')}</span>
              </label>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('audit.modal.isoSoc2Compliant')}</span>
              </div>
              <p>{t('audit.modal.isoSoc2Desc')}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t('audit.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={() => onExportConfirm(exportFormat, `${exportFormat.toUpperCase()} with HMAC: ${includeSha256}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t('audit.modal.downloadDossier')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
