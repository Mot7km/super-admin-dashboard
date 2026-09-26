import { memo, useState, useMemo, useCallback, type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Building2,
  HardDrive,
  Users,
  Eye,
  CreditCard,
  Crown,
  Zap,
  Rocket,
  Copy,
  Check,
  Mail,
  Phone,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import {
  DataTable,
  DataTableRowActions,
  type DataTableColumn,
  type DataTableBatchAction,
} from '../../../common/table';
import type { Business, BusinessActionModalState } from '../businesses.types';

type BusinessTableProps = {
  businesses: Business[];
  onActionSelect: (action: BusinessActionModalState) => void;
};

// Flags mapping
const COUNTRY_FLAGS: Record<string, string> = {
  SA: '🇸🇦',
  EG: '🇪🇬',
  AE: '🇦🇪',
  QA: '🇶🇦',
  JO: '🇯🇴',
  TR: '🇹🇷',
};

// Plan Styling & Icons
const PLAN_CONFIGS: Record<string, {
  name: string;
  badgeStyle: string;
  icon: typeof Crown;
  iconColor: string;
  avatarGradient: string;
  accentBorder: string;
}> = {
  Enterprise: {
    name: 'Enterprise',
    badgeStyle: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    icon: Crown,
    iconColor: 'text-blue-500',
    avatarGradient: 'from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/20',
    accentBorder: 'border-l-blue-500',
  },
  Pro: {
    name: 'Professional',
    badgeStyle: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    icon: Zap,
    iconColor: 'text-emerald-500',
    avatarGradient: 'from-teal-600 via-emerald-600 to-green-700 text-white shadow-emerald-500/20',
    accentBorder: 'border-l-emerald-500',
  },
  Starter: {
    name: 'Starter',
    badgeStyle: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
    icon: Rocket,
    iconColor: 'text-purple-500',
    avatarGradient: 'from-purple-600 via-indigo-600 to-violet-700 text-white shadow-purple-500/20',
    accentBorder: 'border-l-purple-500',
  },
};

const STATUS_CONFIGS: Record<string, { bg: string; dot: string; label: string }> = {
  active: {
    bg: 'bg-success-bg border-success/30 text-success-text',
    dot: 'bg-success animate-pulse',
    label: 'Active',
  },
  trial: {
    bg: 'bg-info-bg border-info/30 text-info-text',
    dot: 'bg-info',
    label: 'In Trial',
  },
  suspended: {
    bg: 'bg-destructive-bg border-destructive/30 text-destructive-text font-bold',
    dot: 'bg-destructive',
    label: 'Suspended',
  },
  disabled: {
    bg: 'bg-muted border-border text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Disabled',
  },
  pending: {
    bg: 'bg-warning-bg border-warning/30 text-warning-text',
    dot: 'bg-warning',
    label: 'Pending',
  },
};

const BusinessTable: FC<BusinessTableProps> = ({ businesses, onActionSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback((e: MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  // Define Table Columns
  const columns = useMemo<DataTableColumn<Business>[]>(() => [
    {
      id: 'business',
      header: t('businesses.colBusiness'),
      accessorKey: 'name',
      sortable: true,
      minWidth: '260px',
      cell: ({ row: b }: { row: Business }) => {
        const planCfg = PLAN_CONFIGS[b.plan] || PLAN_CONFIGS.Enterprise;
        const flag = COUNTRY_FLAGS[b.countryCode] || '🌐';
        const initials = b.name
          .split(' ')
          .map((w) => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            {/* Gradient Monogram Avatar with Country Flag Badge */}
            <div className="relative shrink-0">
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${planCfg.avatarGradient} flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform duration-200`}
              >
                {initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 text-xs select-none shadow-xs"
                title={b.country}
              >
                {flag}
              </span>
            </div>

            {/* Business Metadata */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                  {b.name}
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-surface-subtle border border-border/80 text-[10px] font-mono text-muted-foreground font-semibold">
                  #{b.id}
                </span>
              </div>

              {/* Subdomain & Category */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 truncate">
                <span className="font-medium text-foreground/80 truncate">
                  {b.category}
                </span>
                <span>•</span>
                <span className="font-mono text-primary/90 truncate font-semibold">
                  {b.subdomain}.mot7km.store
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, `${b.subdomain}.mot7km.store`, b.id)}
                  className="p-0.5 rounded-md hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition cursor-pointer"
                  title="Copy subdomain"
                >
                  {copiedId === b.id ? (
                    <Check className="h-3 w-3 text-success-text" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'statusPlan',
      header: t('businesses.colStatusPlan'),
      accessorKey: 'status',
      sortable: true,
      minWidth: '150px',
      cell: ({ row: b }: { row: Business }) => {
        const planCfg = PLAN_CONFIGS[b.plan] || PLAN_CONFIGS.Enterprise;
        const PlanIcon = planCfg.icon;
        const statusCfg = STATUS_CONFIGS[b.status] || STATUS_CONFIGS.active;

        return (
          <div className="flex flex-col gap-1.5 items-start">
            {/* Status Badge with 8px radius */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shadow-xs ${statusCfg.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
              <span>{statusCfg.label}</span>
            </span>

            {/* Plan Tier Badge with Dedicated Icon and 8px radius */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold border font-mono ${planCfg.badgeStyle}`}
            >
              <PlanIcon className={`h-3 w-3 ${planCfg.iconColor}`} />
              <span>{b.plan}</span>
            </span>
          </div>
        );
      },
    },
    {
      id: 'owner',
      header: t('businesses.colOwner'),
      minWidth: '180px',
      cell: ({ row: b }: { row: Business }) => (
        <div className="space-y-0.5 min-w-[160px]">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-xs truncate">
              {b.owner.name}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-surface-subtle border border-border/70 text-muted-foreground font-semibold">
              {b.owner.role.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono truncate">
            <Mail className="h-3 w-3 text-muted-foreground/80 shrink-0" />
            <span className="truncate">{b.owner.email}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 font-mono">
            <Phone className="h-3 w-3 text-muted-foreground/80 shrink-0" />
            <span>{b.owner.phone}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'scale',
      header: t('businesses.colScale'),
      accessorKey: 'branchesCount',
      sortable: true,
      align: 'center',
      minWidth: '140px',
      cell: ({ row: b }: { row: Business }) => {
        const branchPercent = Math.round((b.branchesCount / b.branchesLimit) * 100);

        return (
          <div className="inline-flex flex-col gap-1 items-center">
            <div className="inline-flex items-center p-1 rounded-lg bg-surface-subtle border border-border/80 divide-x rtl:divide-x-reverse divide-border/60">
              {/* Branches metric */}
              <div
                className="px-2 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground"
                title={`Branches: ${b.branchesCount} of ${b.branchesLimit}`}
              >
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="tabular-nums">{b.branchesCount}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  /{b.branchesLimit}
                </span>
              </div>

              {/* Staff metric */}
              <div
                className="px-2 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground"
                title={`Active Staff: ${b.employeesCount} users`}
              >
                <Users className="h-3.5 w-3.5 text-secondary" />
                <span className="tabular-nums">{b.employeesCount}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Staff
                </span>
              </div>
            </div>

            {/* Mini capacity indicator */}
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums">
              {branchPercent}% Facility Cap
            </span>
          </div>
        );
      },
    },
    {
      id: 'mrrRevenue',
      header: t('businesses.colMrrRevenue'),
      accessorKey: 'mrr',
      sortable: true,
      align: 'end',
      minWidth: '140px',
      cell: ({ row: b }: { row: Business }) => (
        <div className="flex flex-col items-end">
          <span className="text-sm font-black text-foreground font-mono tabular-nums tracking-tight">
            ${b.mrr.toLocaleString()}
            <span className="text-[10px] font-normal text-muted-foreground ms-0.5">/mo</span>
          </span>

          <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono text-muted-foreground tabular-nums">
            <span className="text-success-text font-bold">
              GMV ${b.gmvTotal >= 1000 ? `${(b.gmvTotal / 1000).toFixed(0)}k` : b.gmvTotal}
            </span>
            <span>•</span>
            <span>{(b.ordersCount / 1000).toFixed(1)}k ord</span>
          </div>
        </div>
      ),
    },
    {
      id: 'storageUsage',
      header: t('businesses.colStorageUsage'),
      accessorKey: 'storageUsedGb',
      sortable: true,
      minWidth: '140px',
      cell: ({ row: b }: { row: Business }) => {
        const storagePercent = Math.round((b.storageUsedGb / b.storageLimitGb) * 100);

        return (
          <div className="w-32">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <HardDrive className="h-3 w-3 text-muted-foreground" />
                <span className="font-bold text-foreground tabular-nums">{b.storageUsedGb} GB</span>
              </span>
              <span
                className={`font-extrabold text-[10px] px-1 rounded-md tabular-nums ${
                  storagePercent > 85
                    ? 'bg-destructive/15 text-destructive'
                    : storagePercent > 65
                    ? 'bg-warning/15 text-warning-text'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {storagePercent}%
              </span>
            </div>

            {/* 6px radius inner gauge */}
            <div className="h-1.5 w-full rounded-md bg-surface-subtle overflow-hidden ring-1 ring-border/50">
              <div
                className={`h-full rounded-md transition-all duration-300 ${
                  storagePercent > 85
                    ? 'bg-destructive'
                    : storagePercent > 65
                    ? 'bg-warning'
                    : 'bg-primary'
                }`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      align: 'end',
      minWidth: '70px',
      cell: ({ row: b }: { row: Business }) => (
        <DataTableRowActions
          triggerIcon="horizontal"
          align="end"
          actions={[
            {
              id: 'impersonate',
              label: t('businesses.actions.impersonate'),
              icon: ShieldCheck,
              variant: 'default',
              onClick: () => onActionSelect({ type: 'impersonate', business: b }),
            },
            {
              id: 'inspect',
              label: t('dashboard.inspectTenant') || 'Inspect Tenant Details',
              icon: Eye,
              variant: 'default',
              onClick: () => navigate(`/businesses/${b.id}`),
            },
            {
              id: 'change-plan',
              label: t('businesses.actions.changePlan'),
              icon: CreditCard,
              variant: 'default',
              onClick: () => onActionSelect({ type: 'change_plan', business: b }),
            },
            {
              id: 'extend-sub',
              label: t('businesses.actions.extendSub'),
              icon: Calendar,
              variant: 'default',
              onClick: () => onActionSelect({ type: 'extend_sub', business: b }),
            },
            {
              id: 'toggle-status',
              label: b.status === 'suspended' ? t('businesses.actions.activate') : t('businesses.actions.suspend'),
              icon: b.status === 'suspended' ? UserCheck : AlertTriangle,
              variant: b.status === 'suspended' ? 'success' : 'warning',
              dividerBefore: true,
              onClick: () => {
                if (b.status === 'suspended') {
                  onActionSelect({ type: 'activate', business: b });
                } else {
                  onActionSelect({ type: 'suspend', business: b });
                }
              },
            },
            {
              id: 'reset-settings',
              label: t('businesses.actions.resetSettings'),
              icon: RotateCcw,
              variant: 'default',
              onClick: () => onActionSelect({ type: 'reset_settings', business: b }),
            },
            {
              id: 'delete-archive',
              label: t('businesses.actions.deleteArchive'),
              icon: Trash2,
              variant: 'danger',
              dividerBefore: true,
              onClick: () => onActionSelect({ type: 'delete', business: b }),
            },
          ]}
        />
      ),
    },
  ], [t, navigate, onActionSelect, handleCopy, copiedId]);

  // Batch actions for selected businesses
  const batchActions = useMemo<DataTableBatchAction<Business>[]>(() => [
    {
      id: 'batch-suspend',
      label: t('businesses.actions.suspend'),
      icon: AlertTriangle,
      variant: 'default',
      onClick: (selected: Business[]) => {
        selected.forEach((b: Business) => {
          if (b.status === 'active' || b.status === 'trial') {
            onActionSelect({ type: 'suspend', business: b });
          }
        });
      },
    },
    {
      id: 'batch-plan',
      label: t('businesses.actions.changePlan'),
      icon: CreditCard,
      variant: 'default',
      onClick: (selected: Business[]) => {
        if (selected.length > 0) {
          onActionSelect({ type: 'change_plan', business: selected[0] });
        }
      },
    },
  ], [t, onActionSelect]);

  return (
    <DataTable<Business>
      data={businesses}
      columns={columns}
      keyExtractor={(b: Business) => b.id}
      search={false}
      enableSelection
      batchActions={batchActions}
      enableDensitySwitcher
      initialDensity="normal"
      pagination={false}
      onRowClick={(b: Business) => navigate(`/businesses/${b.id}`)}
      rowClassName={(b: Business) =>
        `border-l-4 ${PLAN_CONFIGS[b.plan]?.accentBorder || 'border-l-primary'}`
      }
      emptyState={{
        title: t('businesses.noBusinessesFound') || 'No businesses found',
        description: t('businesses.noBusinessesDesc') || 'No tenants match your search and filter criteria.',
        icon: Building2,
      }}
    />
  );
};

export default memo(BusinessTable);
export { BusinessTable };
