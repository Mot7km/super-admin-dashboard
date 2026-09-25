import { memo, type FC } from 'react';
import {
  Server,
  Database,
  Layers,
  Cpu,
  Radio,
  HardDrive,
  Clock,
  Zap,
  RotateCw,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { ServerNode, NodeType } from '../system-health.types';

type ServerNodesGridProps = {
  nodes: ServerNode[];
  onRecheckNode: (nodeId: string) => void;
  onInspectNode: (node: ServerNode) => void;
};

export const ServerNodesGrid: FC<ServerNodesGridProps> = memo(({
  nodes,
  onRecheckNode,
  onInspectNode,
}) => {
  const { t, locale } = useTranslation();

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'api_cluster':
        return <Server className="h-5 w-5 text-blue-500" />;
      case 'database':
        return <Database className="h-5 w-5 text-emerald-500" />;
      case 'cache':
        return <Layers className="h-5 w-5 text-rose-500" />;
      case 'workers':
        return <Cpu className="h-5 w-5 text-amber-500" />;
      case 'websockets':
        return <Radio className="h-5 w-5 text-violet-500" />;
      case 'storage_gateway':
        return <HardDrive className="h-5 w-5 text-cyan-500" />;
      default:
        return <Server className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground sm:text-base">
            {t('systemHealth.nodes.sectionTitle')}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t('systemHealth.nodes.sectionSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {nodes.map((node) => {
          const details = locale === 'ar' ? node.detailsAr : node.detailsEn;

          return (
            <div
              key={node.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-background/80 shadow-sm transition-transform duration-200 group-hover:scale-105">
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {node.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {node.region}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('systemHealth.nodes.statusHealthy')}
                  </span>
                </div>

                {/* Details */}
                <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">
                  {details}
                </p>

                {/* Latency & Instances Strip */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-border/50 bg-muted/20 p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t('systemHealth.nodes.instances')}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
                      <Server className="h-3.5 w-3.5 text-primary" />
                      <span>{node.activeInstances} Nodes Active</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {t('systemHealth.nodes.response')}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1 font-bold text-foreground">
                      <Zap className="h-3.5 w-3.5 text-blue-500" />
                      <span>{node.latencyMs} ms</span>
                    </div>
                  </div>
                </div>

                {/* CPU & Memory Footprint */}
                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>CPU Load</span>
                      <span className="font-semibold text-foreground">{node.cpuPercent}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          node.cpuPercent > 70 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${node.cpuPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>RAM Footprint</span>
                      <span className="font-semibold text-foreground">{node.memoryPercent}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          node.memoryPercent > 75 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${node.memoryPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{node.lastHealthCheck}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onRecheckNode(node.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>{t('systemHealth.nodes.ping')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onInspectNode(node)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    <span>{t('systemHealth.nodes.inspect')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ServerNodesGrid.displayName = 'ServerNodesGrid';
