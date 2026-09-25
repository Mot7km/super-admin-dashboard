import { memo, useState, type FC } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  History,
  FileJson,
  Calendar,
  User,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FeatureFlag } from '../feature-flags.types';

type FlagDetailsDrawerProps = {
  flag: FeatureFlag | null;
  onClose: () => void;
};

export const FlagDetailsDrawer: FC<FlagDetailsDrawerProps> = memo(({ flag, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'code' | 'json' | 'audit'>('code');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!flag) return null;

  const reactSnippet = `// 1. React Frontend Hook
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export const MyFeatureComponent = () => {
  const isEnabled = useFeatureFlag('${flag.key}');

  if (!isEnabled) {
    return null; // or fallback legacy UI
  }

  return <${flag.name.replace(/[^a-zA-Z]/g, '')}Widget />;
};`;

  const nodeSnippet = `// 2. Node.js / Express Middleware
const isFlagActive = await featureFlagService.evaluate('${flag.key}', {
  tenantId: req.tenant.id,
  planId: req.tenant.planId,
  environment: process.env.NODE_ENV,
});

if (!isFlagActive) {
  return res.status(403).json({ error: 'Feature not enabled for this tenant.' });
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-border/80 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{flag.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  flag.isEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground'
                }`}>
                  {flag.isEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">{flag.key}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-border/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'code'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{t('featureFlags.drawer.codeIntegration')}</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'json'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <FileJson className="h-3.5 w-3.5" />
            <span>{t('featureFlags.drawer.jsonPayload')}</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'audit'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>{t('featureFlags.drawer.auditHistory')}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">React / Frontend Integration</span>
                  <button
                    onClick={() => handleCopy(reactSnippet)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedSnippet ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-muted/60 text-foreground font-mono text-xs overflow-x-auto border border-border/80">
                  {reactSnippet}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">Backend Middleware (Node.js)</span>
                  <button
                    onClick={() => handleCopy(nodeSnippet)}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedSnippet ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-muted/60 text-foreground font-mono text-xs overflow-x-auto border border-border/80">
                  {nodeSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-foreground">Flag Definition Schema</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(flag, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedSnippet ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-2xl bg-muted/60 text-foreground font-mono text-xs overflow-x-auto border border-border/80 max-h-72">
                {JSON.stringify(flag, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <User className="h-4 w-4 text-primary" />
                  <span>Created By</span>
                </div>
                <p className="text-xs text-muted-foreground">{flag.createdBy.name}</p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>{flag.createdAt}</span>
                </div>
              </div>

              {flag.lastToggledBy && (
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <History className="h-4 w-4 text-amber-500" />
                    <span>Last State Switch</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Toggled by {flag.lastToggledBy.name}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Calendar className="h-3 w-3" />
                    <span>{flag.lastToggledBy.at}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-border/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
});

FlagDetailsDrawer.displayName = 'FlagDetailsDrawer';
