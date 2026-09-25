import { useState, type FC } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Calendar,
  CreditCard,
  UserCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { Business, BusinessActionModalState, BusinessPlan } from '../businesses.types';

type BusinessActionModalsProps = {
  modalState: BusinessActionModalState;
  onClose: () => void;
  onConfirmSuccess: (actionType: string, business: Business, details?: string) => void;
};

const BusinessActionModals: FC<BusinessActionModalsProps> = ({
  modalState,
  onClose,
  onConfirmSuccess,
}) => {
  const { t } = useTranslation();

  // Modal specific internal states
  const [selectedPlan, setSelectedPlan] = useState<BusinessPlan>('Enterprise');
  const [extendDays, setExtendDays] = useState<number>(30);
  const [suspendReason, setSuspendReason] = useState<string>('Billing payment decline');
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!modalState) return null;

  const { type, business } = modalState;

  const handleSubmit = (actionType: string, details?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmSuccess(actionType, business, details);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-dropdown animate-scale-up"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-surface-subtle cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 1. IMPERSONATE MODAL */}
        {type === 'impersonate' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {t('businesses.actions.impersonateTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Root Super Admin Session Elevation
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle border border-border/60 text-xs text-foreground space-y-2">
              <p>
                You are about to access <strong>{business.name}</strong> (`#{business.id}`) with supreme administrative privileges.
              </p>
              <div className="p-2.5 rounded-lg bg-warning-bg border border-warning/30 text-[11px] text-warning-text flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  All database modifications and configuration changes made during this impersonated session will be immutably recorded under your Root Admin signature.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('impersonated', `Elevated to tenant ${business.id}`)}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Launch Tenant Console</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. CHANGE PLAN MODAL */}
        {type === 'change_plan' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {t('businesses.actions.changePlanTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Modify subscription plan tier for <strong>{business.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {(['Enterprise', 'Pro', 'Starter'] as BusinessPlan[]).map((plan) => {
                const isSelected = (selectedPlan || business.plan) === plan;
                return (
                  <label
                    key={plan}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                        : 'border-border/60 hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="plan"
                        value={plan}
                        checked={isSelected}
                        onChange={() => setSelectedPlan(plan)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-bold text-foreground">{plan} Plan</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {plan === 'Enterprise' ? '$1,200/mo' : plan === 'Pro' ? '$450/mo' : '$150/mo'}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('plan_changed', `Tier changed to ${selectedPlan}`)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                {t('common.saveChanges')}
              </button>
            </div>
          </div>
        )}

        {/* 3. EXTEND SUBSCRIPTION MODAL */}
        {type === 'extend_sub' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-info-bg text-info-text flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {t('businesses.actions.extendSubTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Grant grace period extension for <strong>{business.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <span className="font-semibold text-muted-foreground block">
                Select Extension Period:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[14, 30, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExtendDays(days)}
                    className={`py-2 px-3 rounded-xl border font-bold text-center cursor-pointer transition ${
                      extendDays === days
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40'
                        : 'border-border/60 hover:bg-surface-subtle text-foreground'
                    }`}
                  >
                    +{days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('sub_extended', `Extended by ${extendDays} days`)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-primary-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        )}

        {/* 4. SUSPEND / DISABLE MODAL */}
        {(type === 'suspend' || type === 'disable') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive-bg text-destructive-text flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {type === 'suspend'
                    ? t('businesses.actions.suspendTitle')
                    : t('businesses.actions.disableTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Restrict access to <strong>{business.name}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Reason for suspension:
              </label>
              <select
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-surface-subtle p-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="Billing payment decline">Billing payment decline / Dunning expired</option>
                <option value="Terms of Service Violation">Terms of Service / Acceptable Use Violation</option>
                <option value="Voluntary Administrative Freeze">Voluntary Administrative Freeze</option>
                <option value="Security Quarantine">Security Quarantine / Fraud Investigation</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(type, suspendReason)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive-dark text-xs font-bold text-destructive-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                Confirm {type === 'suspend' ? 'Suspension' : 'Deactivation'}
              </button>
            </div>
          </div>
        )}

        {/* 5. ACTIVATE MODAL */}
        {type === 'activate' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success-bg text-success-text flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {t('businesses.actions.activateTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Restore active operational status for <strong>{business.name}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This action will lift all account restrictions, reactivate POS and online order webhooks, and notify the owner via SMS and email.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('activated', 'Account reinstated by Super Admin')}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-success hover:bg-success-dark text-xs font-bold text-success-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                Reactivate Tenant
              </button>
            </div>
          </div>
        )}

        {/* 6. RESET SETTINGS MODAL */}
        {type === 'reset_settings' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning-bg text-warning-text flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {t('businesses.actions.resetSettingsTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Reset configurations for <strong>{business.name}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This will reset tenant theme customizations, API webhooks, and default currency formats back to system defaults. Business transactional data will NOT be deleted.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('settings_reset', 'Default configurations restored')}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-warning hover:bg-warning-dark text-xs font-bold text-warning-foreground shadow-sm cursor-pointer disabled:opacity-60"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}

        {/* 7. DELETE / ARCHIVE MODAL */}
        {type === 'delete' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-destructive-bg text-destructive-text flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-destructive">
                  {t('businesses.actions.deleteTitle')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Irreversible Archive & Tenant Teardown
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-destructive-bg/30 border border-destructive/30 text-xs text-destructive-text">
              <p className="font-bold">Warning: High Impact Operation!</p>
              <p className="mt-1">
                You are about to archive tenant <strong>{business.name}</strong> (`#{business.id}`). To proceed, please type <strong className="font-mono">DELETE</strong> in the field below.
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full rounded-xl border border-border bg-surface-subtle p-2.5 text-xs font-mono font-bold text-foreground focus:border-destructive focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface-subtle cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== 'DELETE' || isProcessing}
                onClick={() => handleSubmit('deleted', 'Tenant archived and de-provisioned')}
                className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive-dark text-xs font-bold text-destructive-foreground shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Permanently Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessActionModals;
