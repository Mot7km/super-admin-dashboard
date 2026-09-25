import { memo, useState, type FC } from 'react';
import {
  Copy,
  Check,
  Globe,
  Crown,
  Building2,
  SlidersHorizontal,
  Edit2,
  Code2,
  Trash2,
  Info,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FeatureFlag } from '../feature-flags.types';

type FeatureFlagsTableProps = {
  flags: FeatureFlag[];
  onToggle: (flag: FeatureFlag) => void;
  onEdit: (flag: FeatureFlag) => void;
  onViewDetails: (flag: FeatureFlag) => void;
  onDelete: (flag: FeatureFlag) => void;
};

export const FeatureFlagsTable: FC<FeatureFlagsTableProps> = memo(({
  flags,
  onToggle,
  onEdit,
  onViewDetails,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getEnvBadge = (env: FeatureFlag['environment']) => {
    switch (env) {
      case 'production':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            PROD
          </span>
        );
      case 'staging':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            STAGING
          </span>
        );
      case 'development':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">
            DEV
          </span>
        );
    }
  };

  const renderScopeBadge = (flag: FeatureFlag) => {
    switch (flag.targetType) {
      case 'everyone':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20 w-fit">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span>{t('featureFlags.scopes.everyone')}</span>
          </div>
        );
      case 'plans':
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 w-fit">
              <Crown className="h-3.5 w-3.5 shrink-0" />
              <span>{t('featureFlags.scopes.plans')}</span>
            </div>
            {flag.targetLabels && flag.targetLabels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-0.5">
                {flag.targetLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case 'businesses':
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>
                {flag.targetIds.length} {t('featureFlags.table.businessesTargeted')}
              </span>
            </div>
            {flag.targetLabels && flag.targetLabels.length > 0 && (
              <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]" title={flag.targetLabels.join(', ')}>
                {flag.targetLabels.join(', ')}
              </span>
            )}
          </div>
        );
      case 'percentage':
        return (
          <div className="flex flex-col gap-1.5 min-w-[130px]">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
              <span className="flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {t('featureFlags.scopes.percentage')}
              </span>
              <span className="font-mono">{flag.rolloutPercentage ?? 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${flag.rolloutPercentage ?? 0}%` }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (flags.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
        <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-3">
          <Info className="h-8 w-8" />
        </div>
        <h4 className="text-base font-bold text-foreground">
          {t('featureFlags.table.noFlagsFound')}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {t('featureFlags.table.noFlagsDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 text-start">{t('featureFlags.table.flag')}</th>
              <th className="py-3.5 px-4 text-start">{t('featureFlags.table.environment')}</th>
              <th className="py-3.5 px-4 text-start">{t('featureFlags.table.targetScope')}</th>
              <th className="py-3.5 px-4 text-center">{t('featureFlags.table.status')}</th>
              <th className="py-3.5 px-4 text-start">{t('featureFlags.table.updated')}</th>
              <th className="py-3.5 px-4 text-end">{t('featureFlags.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {flags.map((flag) => (
              <tr
                key={flag.id}
                className="group hover:bg-muted/30 transition-colors duration-150"
              >
                {/* 1. Name & Key */}
                <td className="py-4 px-4 align-top max-w-[280px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                        {flag.name}
                      </span>
                    </div>

                    {/* Copyable Key */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(flag.key)}
                        className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 transition-all cursor-pointer"
                        title={t('featureFlags.table.copyKey')}
                      >
                        <span>{flag.key}</span>
                        {copiedKey === flag.key ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {flag.description}
                    </p>

                    {/* Tags */}
                    {flag.tags && flag.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {flag.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/5 text-primary border border-primary/10"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* 2. Environment */}
                <td className="py-4 px-4 align-top whitespace-nowrap">
                  {getEnvBadge(flag.environment)}
                </td>

                {/* 3. Target Scope */}
                <td className="py-4 px-4 align-top">
                  {renderScopeBadge(flag)}
                </td>

                {/* 4. Instant Toggle Switch */}
                <td className="py-4 px-4 align-top text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={flag.isEnabled}
                      onClick={() => onToggle(flag)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        flag.isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          flag.isEnabled ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[11px] font-bold ${
                        flag.isEnabled ? 'text-emerald-500' : 'text-muted-foreground'
                      }`}
                    >
                      {flag.isEnabled
                        ? t('featureFlags.table.on')
                        : t('featureFlags.table.off')}
                    </span>
                  </div>
                </td>

                {/* 5. Updated / Toggled Info */}
                <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-muted-foreground">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/70" />
                      <span>{flag.updatedAt}</span>
                    </div>
                    {flag.lastToggledBy && (
                      <span className="text-[11px] text-muted-foreground/80">
                        {t('featureFlags.table.by')} {flag.lastToggledBy.name}
                      </span>
                    )}
                  </div>
                </td>

                {/* 6. Actions */}
                <td className="py-4 px-4 align-top text-end whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details / Code */}
                    <button
                      onClick={() => onViewDetails(flag)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all"
                      title={t('featureFlags.actions.viewDetails')}
                    >
                      <Code2 className="h-4 w-4" />
                    </button>

                    {/* Edit Scope */}
                    <button
                      onClick={() => onEdit(flag)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                      title={t('featureFlags.actions.editFlag')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete / Kill */}
                    <button
                      onClick={() => onDelete(flag)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                      title={t('featureFlags.actions.deleteFlag')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

FeatureFlagsTable.displayName = 'FeatureFlagsTable';
