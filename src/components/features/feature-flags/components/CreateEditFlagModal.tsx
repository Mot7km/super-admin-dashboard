import { memo, useState, useEffect, type FC, type FormEvent } from 'react';
import {
  X,
  Flag,
  Globe,
  Crown,
  Building2,
  SlidersHorizontal,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { FeatureFlag, TargetScope, FlagEnvironment } from '../feature-flags.types';
import { AVAILABLE_PLANS, AVAILABLE_BUSINESSES } from '../feature-flags.mock';

type CreateEditFlagModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flagData: Partial<FeatureFlag>) => void;
  editingFlag: FeatureFlag | null;
};

export const CreateEditFlagModal: FC<CreateEditFlagModalProps> = memo(({
  isOpen,
  onClose,
  onSave,
  editingFlag,
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<FlagEnvironment>('production');
  const [isEnabled, setIsEnabled] = useState(true);
  const [targetType, setTargetType] = useState<TargetScope>('everyone');
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [rolloutPercentage, setRolloutPercentage] = useState<number>(50);
  const [tagsString, setTagsString] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize form when opening
  useEffect(() => {
    if (editingFlag) {
      setName(editingFlag.name);
      setKey(editingFlag.key);
      setDescription(editingFlag.description);
      setEnvironment(editingFlag.environment);
      setIsEnabled(editingFlag.isEnabled);
      setTargetType(editingFlag.targetType);
      setSelectedPlanIds(editingFlag.targetType === 'plans' ? editingFlag.targetIds : []);
      setSelectedBusinessIds(editingFlag.targetType === 'businesses' ? editingFlag.targetIds : []);
      setRolloutPercentage(editingFlag.rolloutPercentage ?? 50);
      setTagsString(editingFlag.tags ? editingFlag.tags.join(', ') : '');
    } else {
      setName('');
      setKey('');
      setDescription('');
      setEnvironment('production');
      setIsEnabled(true);
      setTargetType('everyone');
      setSelectedPlanIds(['plan_pro', 'plan_enterprise']);
      setSelectedBusinessIds([]);
      setRolloutPercentage(25);
      setTagsString('Core');
    }
    setError(null);
  }, [editingFlag, isOpen]);

  if (!isOpen) return null;

  // Auto-generate key from name if not manually edited during create
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingFlag) {
      const generatedKey = val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setKey(generatedKey);
    }
  };

  const handlePlanToggle = (planId: string) => {
    setSelectedPlanIds((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
    );
  };

  const handleBusinessToggle = (bizId: string) => {
    setSelectedBusinessIds((prev) =>
      prev.includes(bizId) ? prev.filter((id) => id !== bizId) : [...prev, bizId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('featureFlags.modal.nameRequired'));
      return;
    }
    if (!key.trim()) {
      setError(t('featureFlags.modal.keyRequired'));
      return;
    }

    let targetIds: string[] = [];
    let targetLabels: string[] = [];

    if (targetType === 'plans') {
      if (selectedPlanIds.length === 0) {
        setError(t('featureFlags.modal.selectAtLeastOnePlan'));
        return;
      }
      targetIds = selectedPlanIds;
      targetLabels = AVAILABLE_PLANS.filter((p) => selectedPlanIds.includes(p.id)).map((p) => p.name);
    } else if (targetType === 'businesses') {
      if (selectedBusinessIds.length === 0) {
        setError(t('featureFlags.modal.selectAtLeastOneBusiness'));
        return;
      }
      targetIds = selectedBusinessIds;
      targetLabels = AVAILABLE_BUSINESSES.filter((b) => selectedBusinessIds.includes(b.id)).map((b) => b.name);
    } else if (targetType === 'percentage') {
      targetLabels = [`${rolloutPercentage}% Rollout`];
    } else {
      targetLabels = ['All Tenants'];
    }

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      key: key.trim().toLowerCase(),
      description: description.trim(),
      environment,
      isEnabled,
      targetType,
      targetIds,
      targetLabels,
      rolloutPercentage: targetType === 'percentage' ? rolloutPercentage : undefined,
      tags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {editingFlag
                  ? t('featureFlags.modal.editTitle')
                  : t('featureFlags.modal.createTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('featureFlags.modal.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Row 1: Name and Key */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('featureFlags.modal.flagName')} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. AI Smart Demand Planner"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('featureFlags.modal.flagKey')} * (slug)
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                placeholder="e.g. ai_smart_planner"
                className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {t('featureFlags.modal.description')}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the purpose of this feature flag..."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>

          {/* Environment & Initial State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('featureFlags.modal.environment')}
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as FlagEnvironment)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="production">Production (Live)</option>
                <option value="staging">Staging (Testing)</option>
                <option value="development">Development (Internal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('featureFlags.modal.initialState')}
              </label>
              <div className="flex items-center gap-3 h-[38px] px-3 bg-muted/30 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'ltr:translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-xs font-bold ${isEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {isEnabled ? t('featureFlags.table.on') : t('featureFlags.table.off')}
                </span>
              </div>
            </div>
          </div>

          {/* Scope Targeting Section */}
          <div className="pt-3 border-t border-border/60">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">
              {t('featureFlags.modal.scopeTargeting')}
            </label>

            {/* Scope Selection Radios */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Everyone */}
              <button
                type="button"
                onClick={() => setTargetType('everyone')}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col items-start gap-1.5 ${
                  targetType === 'everyone'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold">{t('featureFlags.scopes.everyone')}</span>
              </button>

              {/* Specific Plans */}
              <button
                type="button"
                onClick={() => setTargetType('plans')}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col items-start gap-1.5 ${
                  targetType === 'plans'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span className="text-xs font-bold">{t('featureFlags.scopes.plans')}</span>
              </button>

              {/* Specific Businesses */}
              <button
                type="button"
                onClick={() => setTargetType('businesses')}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col items-start gap-1.5 ${
                  targetType === 'businesses'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-bold">{t('featureFlags.scopes.businesses')}</span>
              </button>

              {/* Percentage */}
              <button
                type="button"
                onClick={() => setTargetType('percentage')}
                className={`p-3 rounded-2xl border text-start transition-all flex flex-col items-start gap-1.5 ${
                  targetType === 'percentage'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm'
                    : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-xs font-bold">{t('featureFlags.scopes.percentage')}</span>
              </button>
            </div>

            {/* Scope Dynamic Config Panels */}
            {/* 1. Plans Selector */}
            {targetType === 'plans' && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-muted/30 border border-border/80">
                <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                  {t('featureFlags.modal.selectEligiblePlans')}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_PLANS.map((plan) => {
                    const isSelected = selectedPlanIds.includes(plan.id);
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handlePlanToggle(plan.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <span>{plan.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Businesses Selector */}
            {targetType === 'businesses' && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-muted/30 border border-border/80">
                <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                  {t('featureFlags.modal.selectEligibleBusinesses')}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_BUSINESSES.map((biz) => {
                    const isSelected = selectedBusinessIds.includes(biz.id);
                    return (
                      <button
                        key={biz.id}
                        type="button"
                        onClick={() => handleBusinessToggle(biz.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-start ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-background border-border text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{biz.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{biz.code} • {biz.category}</div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Percentage Rollout Slider */}
            {targetType === 'percentage' && (
              <div className="mt-3.5 p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">{t('featureFlags.modal.rolloutPercentage')}:</span>
                  <span className="font-mono text-base font-bold text-amber-400">{rolloutPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={rolloutPercentage}
                  onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t('featureFlags.modal.percentageDescription')}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              {t('featureFlags.modal.tags')} ({t('featureFlags.modal.commaSeparated')})
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="e.g. POS, Beta, Checkout"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
            >
              {editingFlag ? t('common.saveChanges') : t('featureFlags.actions.createFlag')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateEditFlagModal.displayName = 'CreateEditFlagModal';
