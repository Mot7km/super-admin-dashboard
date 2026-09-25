import { memo, useState, type FC } from 'react';
import {
  X,
  Server,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { ServerNode } from '../system-health.types';

type RawMetricsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  node: ServerNode | null;
};

export const RawMetricsDrawer: FC<RawMetricsDrawerProps> = memo(({
  isOpen,
  onClose,
  node,
}) => {
  const { t, isRtl } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !node) return null;

  const rawTelemetry = {
    nodeId: node.id,
    nodeName: node.name,
    clusterRegion: node.region,
    containerEngine: 'containerd://1.6.28-k8s',
    orchestrator: 'Kubernetes EKS v1.29.3',
    status: node.status,
    uptimeSla: node.uptime,
    metrics: {
      roundTripLatencyMs: node.latencyMs,
      cpuUtilizationPercent: node.cpuPercent,
      memoryUtilizationPercent: node.memoryPercent,
      allocatedInstances: node.activeInstances,
      activeThreads: node.activeInstances * 16,
      maxFileDescriptors: 65536,
      openSockets: 1420,
    },
    tlsCipher: 'TLS_AES_256_GCM_SHA384 (TLS 1.3)',
    healthcheckProtocol: 'HTTP/2 GET /healthz [200 OK]',
    timestamp: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(rawTelemetry, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} flex max-w-full`}>
        <div className="w-screen max-w-lg border-s border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {t('systemHealth.drawer.title')}
                </h3>
                <p className="text-xs text-muted-foreground">{node.name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 border-b border-border/60 bg-muted/20 p-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Status</span>
              <div className="mt-0.5 font-bold text-emerald-500 uppercase">{node.status}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Latency</span>
              <div className="mt-0.5 font-bold text-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-500" />
                <span>{node.latencyMs} ms</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Nodes</span>
              <div className="mt-0.5 font-bold text-foreground">{node.activeInstances} Nodes</div>
            </div>
          </div>

          {/* JSON Telemetry Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Raw Telemetry Payload
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="rounded-2xl border border-border/80 bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
              {jsonString}
            </pre>
          </div>

          {/* Footer */}
          <div className="border-t border-border/80 p-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

RawMetricsDrawer.displayName = 'RawMetricsDrawer';
