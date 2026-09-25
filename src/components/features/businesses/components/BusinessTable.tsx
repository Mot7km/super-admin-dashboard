import { memo, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const closeMenu = () => setActiveMenuId(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      onClick={closeMenu}
      className="relative rounded-2xl border border-border/80 bg-card shadow-ambient overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-surface-subtle/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/80">
            <tr>
              <th scope="col" className="py-4 px-4 font-bold min-w-[260px]">
                {t('businesses.colBusiness')}
              </th>
              <th scope="col" className="py-4 px-3 font-bold min-w-[140px]">
                {t('businesses.colStatusPlan')}
              </th>
              <th scope="col" className="py-4 px-3 font-bold min-w-[180px]">
                {t('businesses.colOwner')}
              </th>
              <th scope="col" className="py-4 px-3 font-bold text-center min-w-[140px]">
                {t('businesses.colScale')}
              </th>
              <th scope="col" className="py-4 px-3 font-bold text-right min-w-[140px]">
                {t('businesses.colMrrRevenue')}
              </th>
              <th scope="col" className="py-4 px-3 font-bold min-w-[140px]">
                {t('businesses.colStorageUsage')}
              </th>
              <th scope="col" className="py-4 px-4 font-bold text-right min-w-[140px]">
                {t('common.actions')}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60">
            {businesses.map((b) => {
              const planCfg = PLAN_CONFIGS[b.plan] || PLAN_CONFIGS.Enterprise;
              const PlanIcon = planCfg.icon;
              const statusCfg = STATUS_CONFIGS[b.status] || STATUS_CONFIGS.active;
              const storagePercent = Math.round((b.storageUsedGb / b.storageLimitGb) * 100);
              const branchPercent = Math.round((b.branchesCount / b.branchesLimit) * 100);
              const flag = COUNTRY_FLAGS[b.countryCode] || '🌐';

              // Initials
              const initials = b.name
                .split(' ')
                .map((w) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr
                  key={b.id}
                  onClick={() => navigate(`/businesses/${b.id}`)}
                  className={`group relative hover:bg-surface-subtle/70 transition-all duration-200 cursor-pointer border-l-4 ${planCfg.accentBorder}`}
                >
                  {/* ========================================================= */}
                  {/* 1. BUSINESS & DOMAIN IDENTITY                             */}
                  {/* ========================================================= */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Gradient Monogram Avatar with Country Flag Badge */}
                      <div className="relative shrink-0">
                        <div
                          className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${planCfg.avatarGradient} flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform duration-200`}
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
                          <span className="px-1.5 py-0.2 rounded bg-surface-subtle border border-border/80 text-[10px] font-mono text-muted-foreground font-semibold">
                            #{b.id}
                          </span>
                        </div>

                        {/* Subdomain & Category */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1 truncate">
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
                            className="p-0.5 rounded hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition cursor-pointer"
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
                  </td>

                  {/* ========================================================= */}
                  {/* 2. STATUS & PLAN COHESION                                 */}
                  {/* ========================================================= */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-[10px] font-bold border shadow-xs ${statusCfg.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                        <span>{statusCfg.label}</span>
                      </span>

                      {/* Plan Tier Badge with Dedicated Icon */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-extrabold border font-mono ${planCfg.badgeStyle}`}
                      >
                        <PlanIcon className={`h-3 w-3 ${planCfg.iconColor}`} />
                        <span>{b.plan}</span>
                      </span>
                    </div>
                  </td>

                  {/* ========================================================= */}
                  {/* 3. OWNER ACCOUNT & IDENTITY                               */}
                  {/* ========================================================= */}
                  <td className="py-4 px-3">
                    <div className="space-y-0.5 min-w-[160px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground text-xs truncate">
                          {b.owner.name}
                        </span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-surface-subtle text-muted-foreground">
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
                  </td>

                  {/* ========================================================= */}
                  {/* 4. CAPACITY SCALE (BRANCHES & STAFF)                      */}
                  {/* ========================================================= */}
                  <td className="py-4 px-3 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col gap-1.5 items-center">
                      <div className="inline-flex items-center p-1 rounded-xl bg-surface-subtle border border-border/80 divide-x divide-border/60">
                        {/* Branches metric */}
                        <div
                          className="px-2.5 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground"
                          title={`Branches: ${b.branchesCount} of ${b.branchesLimit}`}
                        >
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                          <span>{b.branchesCount}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            /{b.branchesLimit}
                          </span>
                        </div>

                        {/* Staff metric */}
                        <div
                          className="px-2.5 flex items-center gap-1.5 font-mono text-xs font-bold text-foreground"
                          title={`Active Staff: ${b.employeesCount} users`}
                        >
                          <Users className="h-3.5 w-3.5 text-secondary" />
                          <span>{b.employeesCount}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Staff
                          </span>
                        </div>
                      </div>

                      {/* Mini capacity indicator */}
                      <span className="text-[9px] text-muted-foreground font-mono">
                        {branchPercent}% Facility Cap
                      </span>
                    </div>
                  </td>

                  {/* ========================================================= */}
                  {/* 5. FINANCIAL COMMAND (MRR & GMV)                          */}
                  {/* ========================================================= */}
                  <td className="py-4 px-3 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-foreground font-mono tabular-nums tracking-tight">
                        ${b.mrr.toLocaleString()}
                        <span className="text-[10px] font-normal text-muted-foreground ml-0.5">/mo</span>
                      </span>

                      <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono text-muted-foreground">
                        <span className="text-success-text font-bold">
                          GMV ${b.gmvTotal >= 1000 ? `${(b.gmvTotal / 1000).toFixed(0)}k` : b.gmvTotal}
                        </span>
                        <span>•</span>
                        <span>{(b.ordersCount / 1000).toFixed(1)}k ord</span>
                      </div>
                    </div>
                  </td>

                  {/* ========================================================= */}
                  {/* 6. STORAGE QUOTA & INFRASTRUCTURE                         */}
                  {/* ========================================================= */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          <span className="font-bold text-foreground">{b.storageUsedGb} GB</span>
                        </span>
                        <span
                          className={`font-extrabold text-[10px] px-1 rounded ${
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

                      <div className="h-1.5 w-full rounded-pill bg-surface-subtle overflow-hidden ring-1 ring-border/50">
                        <div
                          className={`h-full rounded-pill transition-all duration-300 ${
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
                  </td>

                  {/* ========================================================= */}
                  {/* 7. HIGH-AGENCY ACTIONS                                    */}
                  {/* ========================================================= */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="relative inline-flex items-center gap-1.5">
                      {/* Direct Impersonate Superpower Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionSelect({ type: 'impersonate', business: b });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                        title="Impersonate / Access Tenant as Admin"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline text-[11px]">Access</span>
                      </button>

                      {/* Direct Inspect Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/businesses/${b.id}`);
                        }}
                        className="p-1.5 rounded-lg border border-border/70 hover:border-foreground/40 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition cursor-pointer"
                        title={t('dashboard.inspectTenant')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {/* 3-Dots Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(e, b.id)}
                        className="p-1.5 rounded-lg border border-border/70 hover:border-foreground/40 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground transition cursor-pointer"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* 3-Dots Action Popover Menu */}
                      {activeMenuId === b.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-1.5 shadow-dropdown z-50 animate-fade-in text-left text-xs"
                        >
                          {/* Impersonate Admin */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              onActionSelect({ type: 'impersonate', business: b });
                            }}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 font-bold transition cursor-pointer"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>{t('businesses.actions.impersonate')}</span>
                          </button>

                          {/* Change Plan */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              onActionSelect({ type: 'change_plan', business: b });
                            }}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-foreground hover:bg-surface-subtle font-medium transition cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{t('businesses.actions.changePlan')}</span>
                          </button>

                          {/* Extend Subscription */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              onActionSelect({ type: 'extend_sub', business: b });
                            }}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-foreground hover:bg-surface-subtle font-medium transition cursor-pointer"
                          >
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{t('businesses.actions.extendSub')}</span>
                          </button>

                          <div className="my-1 border-t border-border/60" />

                          {/* Status Actions */}
                          {b.status === 'suspended' ? (
                            <button
                              type="button"
                              onClick={() => {
                                closeMenu();
                                onActionSelect({ type: 'activate', business: b });
                              }}
                              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-success-text hover:bg-success-bg font-bold transition cursor-pointer"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>{t('businesses.actions.activate')}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                closeMenu();
                                onActionSelect({ type: 'suspend', business: b });
                              }}
                              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-warning-text hover:bg-warning-bg font-medium transition cursor-pointer"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <span>{t('businesses.actions.suspend')}</span>
                            </button>
                          )}

                          {/* Reset Settings */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              onActionSelect({ type: 'reset_settings', business: b });
                            }}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-foreground hover:bg-surface-subtle font-medium transition cursor-pointer"
                          >
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                            <span>{t('businesses.actions.resetSettings')}</span>
                          </button>

                          <div className="my-1 border-t border-border/60" />

                          {/* Delete / Archive */}
                          <button
                            type="button"
                            onClick={() => {
                              closeMenu();
                              onActionSelect({ type: 'delete', business: b });
                            }}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-destructive hover:bg-destructive-bg font-bold transition cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{t('businesses.actions.deleteArchive')}</span>
                          </button>
                        </div>
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

export default memo(BusinessTable);
