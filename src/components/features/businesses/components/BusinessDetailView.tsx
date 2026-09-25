import { memo, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Calendar,
  AlertTriangle,
  UserCheck,
  Building2,
  Users,
  HardDrive,
  Activity,
  DollarSign,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle2,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Business, BusinessActionModalState } from '../businesses.types';

type BusinessDetailViewProps = {
  business: Business;
  onActionSelect: (action: BusinessActionModalState) => void;
};

type DetailTab = 'overview' | 'branches' | 'subscription' | 'activity' | 'danger';

const PLAN_BADGES: Record<string, string> = {
  Enterprise: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  Pro: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  Starter: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
};

const STATUS_BADGES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  active: {
    bg: 'bg-success-bg border-success/30 text-success-text',
    text: 'text-success-text',
    dot: 'bg-success',
    label: 'Active System Status',
  },
  trial: {
    bg: 'bg-info-bg border-info/30 text-info-text',
    text: 'text-info-text',
    dot: 'bg-info',
    label: 'In Evaluation Trial',
  },
  suspended: {
    bg: 'bg-destructive-bg border-destructive/30 text-destructive-text',
    text: 'text-destructive-text',
    dot: 'bg-destructive',
    label: 'Account Suspended',
  },
  disabled: {
    bg: 'bg-muted border-border text-muted-foreground',
    text: 'text-muted-foreground',
    dot: 'bg-muted-foreground',
    label: 'Voluntary Maintenance Freeze',
  },
  pending: {
    bg: 'bg-warning-bg border-warning/30 text-warning-text',
    text: 'text-warning-text',
    dot: 'bg-warning',
    label: 'Pending Verification',
  },
};

const BusinessDetailView: FC<BusinessDetailViewProps> = ({
  business,
  onActionSelect,
}) => {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const statusCfg = STATUS_BADGES[business.status] || STATUS_BADGES.active;
  const planStyle = PLAN_BADGES[business.plan] || PLAN_BADGES.Starter;
  const storagePercent = Math.round((business.storageUsedGb / business.storageLimitGb) * 100);
  const branchPercent = Math.round((business.branchesCount / business.branchesLimit) * 100);
  const staffPercent = Math.round((business.employeesCount / business.employeesLimit) * 100);
  const apiPercent = Math.round((business.apiCallsMonth / business.apiCallsLimit) * 100);

  const initials = business.name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Breadcrumbs & Return Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/businesses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{t('businesses.backToList')}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>Tenant ID:</span>
          <span className="font-bold text-foreground bg-surface-subtle px-2 py-0.5 rounded-lg border border-border/80">
            #{business.id}
          </span>
        </div>
      </div>

      {/* 2. Suspension Alert Banner (If suspended or disabled) */}
      {(business.status === 'suspended' || business.status === 'disabled') && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-destructive-bg/30 border border-destructive/30 text-destructive-text">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-sm block">
                {business.status === 'suspended' ? 'Tenant Account Suspended' : 'Account Temporarily Frozen'}
              </span>
              <p className="text-xs text-destructive-text/90 mt-0.5">
                {business.suspendedReason || business.notes || 'Contact Root Super Admin for reactivation details.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onActionSelect({ type: 'activate', business })}
              className="px-3.5 py-1.5 rounded-xl bg-success hover:bg-success-dark text-xs font-bold text-success-foreground shadow-xs transition cursor-pointer"
            >
              Reactivate Account
            </button>
          </div>
        </div>
      )}

      {/* 3. Master Tenant Hero Command Deck */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-ambient">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Identity & Subdomain */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border-2 border-primary/20 text-primary flex items-center justify-center shrink-0 font-black text-xl shadow-xs">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {business.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified SaaS Tenant</span>
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {business.legalName} • {business.category} • {business.city}, {business.country}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono">
                <a
                  href={`https://${business.subdomain}.mot7km.store`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                >
                  <span>{business.subdomain}.mot7km.store</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                {business.customDomain && (
                  <span className="text-muted-foreground">
                    Custom: <strong className="text-foreground">{business.customDomain}</strong>
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-extrabold border ${statusCfg.bg}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                  <span>{statusCfg.label}</span>
                </span>

                <span className={`px-2 py-0.2 rounded-pill text-[10px] font-extrabold border ${planStyle}`}>
                  {business.plan} Plan
                </span>
              </div>
            </div>
          </div>

          {/* Super Admin Action Command Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Impersonate CTA */}
            <button
              type="button"
              onClick={() => onActionSelect({ type: 'impersonate', business })}
              className="group flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:shadow-primary/25 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              title="Enter tenant dashboard as Root Admin"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t('businesses.actions.impersonate')}</span>
            </button>

            {/* Change Plan Button */}
            <button
              type="button"
              onClick={() => onActionSelect({ type: 'change_plan', business })}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-surface-subtle px-3.5 py-2.5 text-xs font-bold text-foreground transition cursor-pointer shadow-xs"
            >
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              <span>{t('businesses.actions.changePlan')}</span>
            </button>

            {/* Extend Subscription */}
            <button
              type="button"
              onClick={() => onActionSelect({ type: 'extend_sub', business })}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-surface-subtle px-3.5 py-2.5 text-xs font-bold text-foreground transition cursor-pointer shadow-xs"
            >
              <Calendar className="h-3.5 w-3.5 text-info-text" />
              <span>{t('businesses.actions.extendSub')}</span>
            </button>

            {/* Suspend or Activate Toggle */}
            {business.status === 'suspended' ? (
              <button
                type="button"
                onClick={() => onActionSelect({ type: 'activate', business })}
                className="flex items-center gap-1.5 rounded-xl border border-success/30 bg-success-bg text-success-text px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Activate</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onActionSelect({ type: 'suspend', business })}
                className="flex items-center gap-1.5 rounded-xl border border-warning/30 bg-warning-bg text-warning-text px-3.5 py-2.5 text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Suspend</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Executive Telemetry Overview Strip (5 Key KPI Gauges) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* MRR */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-bold">Monthly MRR</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xl font-black text-foreground font-mono tabular-nums block">
            ${business.mrr.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            ARR: ${(business.mrr * 12).toLocaleString()}
          </span>
        </div>

        {/* Processed GMV */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-bold">Total GMV</span>
            <Activity className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-xl font-black text-foreground font-mono tabular-nums block">
            ${business.gmvTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {business.ordersCount.toLocaleString()} orders
          </span>
        </div>

        {/* Branches Quota */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-bold">Branches</span>
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xl font-black text-foreground font-mono tabular-nums block">
            {business.branchesCount} / {business.branchesLimit}
          </span>
          <div className="h-1.5 w-full rounded-pill bg-surface-subtle overflow-hidden mt-1.5">
            <div className="h-full bg-primary rounded-pill" style={{ width: `${branchPercent}%` }} />
          </div>
        </div>

        {/* Staff Quota */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-bold">Staff Accounts</span>
            <Users className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-xl font-black text-foreground font-mono tabular-nums block">
            {business.employeesCount} / {business.employeesLimit}
          </span>
          <div className="h-1.5 w-full rounded-pill bg-surface-subtle overflow-hidden mt-1.5">
            <div className="h-full bg-secondary rounded-pill" style={{ width: `${staffPercent}%` }} />
          </div>
        </div>

        {/* Storage Quota */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span className="font-bold">Cloud Storage</span>
            <HardDrive className="h-4 w-4 text-chart-4" />
          </div>
          <span className="text-xl font-black text-foreground font-mono tabular-nums block">
            {business.storageUsedGb} GB
          </span>
          <div className="h-1.5 w-full rounded-pill bg-surface-subtle overflow-hidden mt-1.5">
            <div
              className={`h-full rounded-pill ${
                storagePercent > 85 ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Deep Multi-Tab Navigation */}
      <div className="border-b border-border/80">
        <div role="tablist" className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>{t('businesses.tabs.overview')}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'branches'}
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'branches'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{t('businesses.tabs.branches')} ({business.branches.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'subscription'}
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>{t('businesses.tabs.subscriptionUsage')}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>{t('businesses.tabs.auditStream')}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'danger'}
            onClick={() => setActiveTab('danger')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'danger'
                ? 'bg-destructive-bg text-destructive border border-destructive/20 shadow-xs'
                : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{t('businesses.tabs.dangerZone')}</span>
          </button>
        </div>
      </div>

      {/* 6. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & OWNER IDENTITY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Business Information Card (7 cols) */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-7 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground pb-2 border-b border-border/60">
              {t('businesses.sectionBusinessInfo')}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Legal Entity</span>
                <span className="font-bold text-foreground block mt-0.5">{business.legalName}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Category</span>
                <span className="font-bold text-foreground block mt-0.5">{business.category}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Commercial Reg (CR)</span>
                <span className="font-mono font-bold text-foreground block mt-0.5">{business.crNumber}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Tax / VAT Number</span>
                <span className="font-mono font-bold text-foreground block mt-0.5">{business.vatNumber}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Currency</span>
                <span className="font-mono font-bold text-foreground block mt-0.5">{business.currency}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Created Date</span>
                <span className="font-mono font-bold text-foreground block mt-0.5">{business.createdAt}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Last Active Telemetry</span>
                <span className="font-mono font-bold text-success-text block mt-0.5">{business.lastActiveAt}</span>
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Location</span>
                <span className="font-bold text-foreground block mt-0.5">{business.city}, {business.country}</span>
              </div>
            </div>

            {business.notes && (
              <div className="pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground font-bold block mb-1">Administrative Notes:</span>
                <p className="p-3 rounded-xl bg-surface-subtle border border-border/60 text-foreground leading-relaxed">
                  {business.notes}
                </p>
              </div>
            )}
          </div>

          {/* Owner Profile Card (5 cols) */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-5 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground pb-2 border-b border-border/60">
              {t('businesses.sectionOwnerInfo')}
            </h3>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center shrink-0 font-bold text-sm">
                {business.owner.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <span className="font-extrabold text-foreground text-sm block">
                  {business.owner.name}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {business.owner.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-subtle border border-border/60">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="font-mono text-foreground truncate">{business.owner.email}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-subtle border border-border/60">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span className="font-mono text-foreground truncate">{business.owner.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANCHES LIST */}
      {activeTab === 'branches' && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Branch & Facility Topology
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Physical locations and dark kitchens provisioned under this tenant
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-pill bg-primary/10 text-primary text-xs font-mono font-bold">
              {business.branches.length} of {business.branchesLimit} Used
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {business.branches.map((br) => (
              <div
                key={br.id}
                className="p-4 rounded-xl border border-border/70 bg-surface-subtle/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-extrabold text-foreground text-xs">{br.name}</span>
                    {br.isMain && (
                      <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[9px] font-bold">
                        Main HQ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-success-bg text-success-text border border-success/30 font-mono">
                    {br.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-border/40">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">City</span>
                    <span className="font-bold text-foreground">{br.city}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Staff</span>
                    <span className="font-bold text-foreground font-mono">{br.staffCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Orders</span>
                    <span className="font-bold text-foreground font-mono">{br.ordersCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION & QUOTAS */}
      {activeTab === 'subscription' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Plan & Billing Details */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-6 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground pb-2 border-b border-border/60">
              Active Subscription Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border/60">
                <span className="text-muted-foreground">Current Plan</span>
                <span className={`px-2.5 py-0.5 rounded-pill font-bold border font-mono ${planStyle}`}>
                  {business.plan}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border/60">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-bold text-foreground uppercase tracking-wider font-mono">
                  {business.billingCycle}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border/60">
                <span className="text-muted-foreground">Next Renewal Date</span>
                <span className="font-bold text-foreground font-mono">
                  {business.nextBillingDate}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle border border-border/60">
                <span className="text-muted-foreground">Monthly Recurring Cost</span>
                <span className="font-black text-foreground font-mono text-sm">
                  ${business.mrr.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          {/* Resource Limits & Quotas */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm lg:col-span-6 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground pb-2 border-b border-border/60">
              Resource Utilization Quotas
            </h3>

            <div className="space-y-4 text-xs">
              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Storage Allocation</span>
                  <span className="font-mono text-muted-foreground">
                    {business.storageUsedGb} GB / {business.storageLimitGb} GB ({storagePercent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-pill bg-surface-subtle overflow-hidden">
                  <div className="h-full bg-primary rounded-pill" style={{ width: `${storagePercent}%` }} />
                </div>
              </div>

              {/* API Calls */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">API Throughput</span>
                  <span className="font-mono text-muted-foreground">
                    {(business.apiCallsMonth / 1000).toFixed(0)}k / {(business.apiCallsLimit / 1000).toFixed(0)}k calls ({apiPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-pill bg-surface-subtle overflow-hidden">
                  <div className="h-full bg-secondary rounded-pill" style={{ width: `${apiPercent}%` }} />
                </div>
              </div>

              {/* Branches */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Branches Ceiling</span>
                  <span className="font-mono text-muted-foreground">
                    {business.branchesCount} / {business.branchesLimit} ({branchPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-pill bg-surface-subtle overflow-hidden">
                  <div className="h-full bg-chart-4 rounded-pill" style={{ width: `${branchPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT STREAM */}
      {activeTab === 'activity' && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Immutable Tenant Audit Ledger
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full chronological stream of administrative events and system telemetry
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {business.auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start gap-3 text-xs">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{log.action}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-muted-foreground/70 font-mono mt-0.5 block">
                    Actor: {log.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DANGER ZONE */}
      {activeTab === 'danger' && (
        <div className="rounded-2xl border border-destructive/40 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-destructive border-b border-destructive/20 pb-3">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-base font-extrabold">Super Admin Danger Controls</h3>
          </div>

          <div className="space-y-3">
            {/* Reset Settings */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-subtle border border-border/60">
              <div>
                <span className="font-bold text-foreground text-xs block">
                  Reset Tenant Customizations
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Reverts all storefront colors, QR themes, and webhook URLs back to default settings.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onActionSelect({ type: 'reset_settings', business })}
                className="px-3.5 py-2 rounded-xl border border-warning/40 text-warning-text hover:bg-warning-bg text-xs font-bold transition cursor-pointer"
              >
                Reset Settings
              </button>
            </div>

            {/* Suspend Account */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-subtle border border-border/60">
              <div>
                <span className="font-bold text-foreground text-xs block">
                  Suspend Tenant Services
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Immediately halts all API traffic, POS transactions, and customer access.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onActionSelect({ type: 'suspend', business })}
                className="px-3.5 py-2 rounded-xl border border-destructive/40 text-destructive-text hover:bg-destructive-bg text-xs font-bold transition cursor-pointer"
              >
                Suspend Account
              </button>
            </div>

            {/* Archive / Delete */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-destructive-bg/20 border border-destructive/30">
              <div>
                <span className="font-bold text-destructive text-xs block">
                  Permanently Archive & De-provision
                </span>
                <span className="text-[11px] text-destructive-text/80">
                  Deletes all databases, worker cluster allocations, and customer records permanently.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onActionSelect({ type: 'delete', business })}
                className="px-3.5 py-2 rounded-xl bg-destructive hover:bg-destructive-dark text-destructive-foreground text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Archive Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BusinessDetailView);
