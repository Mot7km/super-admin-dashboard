import { memo, useState, useEffect, type FC, type FormEvent } from 'react';
import {
  X,
  Megaphone,
  Globe,
  Crown,
  Building2,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { SystemAnnouncement, AnnouncementType, AnnouncementAudience } from '../announcements.types';
import { AVAILABLE_PLANS, AVAILABLE_BUSINESSES } from '../../feature-flags/feature-flags.mock';

type CreateAnnouncementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcementData: Partial<SystemAnnouncement>) => void;
  editingAnnouncement: SystemAnnouncement | null;
};

export const CreateAnnouncementModal: FC<CreateAnnouncementModalProps> = memo(({
  isOpen,
  onClose,
  onSave,
  editingAnnouncement,
}) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [message, setMessage] = useState('');
  const [messageAr, setMessageAr] = useState('');
  const [type, setType] = useState<AnnouncementType>('info');
  const [audience, setAudience] = useState<AnnouncementAudience>('everyone');
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [selectedBizIds, setSelectedBizIds] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isDismissible, setIsDismissible] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [actionUrl, setActionUrl] = useState('');
  const [actionText, setActionText] = useState('');
  const [actionTextAr, setActionTextAr] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title);
      setTitleAr(editingAnnouncement.titleAr);
      setMessage(editingAnnouncement.message);
      setMessageAr(editingAnnouncement.messageAr);
      setType(editingAnnouncement.type);
      setAudience(editingAnnouncement.audience);
      setSelectedPlanIds(editingAnnouncement.audience === 'plans' ? editingAnnouncement.targetIds : []);
      setSelectedBizIds(editingAnnouncement.audience === 'businesses' ? editingAnnouncement.targetIds : []);
      setIsPinned(editingAnnouncement.isPinned);
      setIsDismissible(editingAnnouncement.isDismissible);
      setIsActive(editingAnnouncement.isActive);
      setActionUrl(editingAnnouncement.actionUrl || '');
      setActionText(editingAnnouncement.actionText || '');
      setActionTextAr(editingAnnouncement.actionTextAr || '');
      setStartDate(editingAnnouncement.startDate);
      setEndDate(editingAnnouncement.endDate || '');
    } else {
      setTitle('');
      setTitleAr('');
      setMessage('');
      setMessageAr('');
      setType('info');
      setAudience('everyone');
      setSelectedPlanIds(['plan_pro', 'plan_enterprise']);
      setSelectedBizIds([]);
      setIsPinned(false);
      setIsDismissible(true);
      setIsActive(true);
      setActionUrl('');
      setActionText('');
      setActionTextAr('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
    }
    setError(null);
  }, [editingAnnouncement, isOpen]);

  if (!isOpen) return null;

  const handlePlanToggle = (planId: string) => {
    setSelectedPlanIds((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
    );
  };

  const handleBizToggle = (bizId: string) => {
    setSelectedBizIds((prev) =>
      prev.includes(bizId) ? prev.filter((id) => id !== bizId) : [...prev, bizId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !titleAr.trim()) {
      setError(t('announcements.modal.titleRequired'));
      return;
    }
    if (!message.trim() && !messageAr.trim()) {
      setError(t('announcements.modal.messageRequired'));
      return;
    }

    let targetIds: string[] = [];
    let targetLabels: string[] = [];

    if (audience === 'plans') {
      if (selectedPlanIds.length === 0) {
        setError(t('announcements.modal.selectAtLeastOnePlan'));
        return;
      }
      targetIds = selectedPlanIds;
      targetLabels = AVAILABLE_PLANS.filter((p) => selectedPlanIds.includes(p.id)).map((p) => p.name);
    } else if (audience === 'businesses') {
      if (selectedBizIds.length === 0) {
        setError(t('announcements.modal.selectAtLeastOneBusiness'));
        return;
      }
      targetIds = selectedBizIds;
      targetLabels = AVAILABLE_BUSINESSES.filter((b) => selectedBizIds.includes(b.id)).map((b) => b.name);
    } else {
      targetLabels = ['All Tenants'];
    }

    onSave({
      title: title.trim() || titleAr.trim(),
      titleAr: titleAr.trim() || title.trim(),
      message: message.trim() || messageAr.trim(),
      messageAr: messageAr.trim() || message.trim(),
      type,
      audience,
      targetIds,
      targetLabels,
      isPinned,
      isDismissible,
      isActive,
      actionUrl: actionUrl.trim() || undefined,
      actionText: actionText.trim() || undefined,
      actionTextAr: actionTextAr.trim() || undefined,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || undefined,
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
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {editingAnnouncement
                  ? t('announcements.modal.editTitle')
                  : t('announcements.modal.createTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t('announcements.modal.subtitle')}
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
          {/* 1. Type Selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              {t('announcements.modal.severityType')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setType('info')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'info'
                    ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Info className="h-4 w-4 text-sky-400" />
                <span>{t('announcements.types.info')}</span>
              </button>

              <button
                type="button"
                onClick={() => setType('warning')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>{t('announcements.types.warning')}</span>
              </button>

              <button
                type="button"
                onClick={() => setType('critical')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'critical'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <AlertCircle className="h-4 w-4 text-rose-500" />
                <span>{t('announcements.types.critical')}</span>
              </button>

              <button
                type="button"
                onClick={() => setType('success')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-background border-border text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{t('announcements.types.success')}</span>
              </button>
            </div>
          </div>

          {/* 2. Title Inputs (EN & AR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.titleEn')} *
              </label>
              <input
                type="text"
                dir="ltr"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Network Upgrade"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.titleAr')} * (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: ترقية مجدولة في شبكة الخوادم"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
          </div>

          {/* 3. Message Inputs (EN & AR) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.messageEn')} *
              </label>
              <textarea
                rows={3}
                dir="ltr"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed message displayed on the customer banner..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.messageAr')} * (العربية)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={messageAr}
                onChange={(e) => setMessageAr(e.target.value)}
                placeholder="نص الإشعار التفصيلي المعروض في البانر..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground leading-relaxed"
              />
            </div>
          </div>

          {/* 4. Audience Targeting */}
          <div className="pt-2 border-t border-border/60">
            <label className="block text-xs font-bold text-foreground mb-2">
              {t('announcements.modal.targetAudience')}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setAudience('everyone')}
                className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                  audience === 'everyone'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold">{t('announcements.audience.everyone')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAudience('plans')}
                className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                  audience === 'plans'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span className="text-xs font-bold">{t('announcements.audience.plans')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAudience('businesses')}
                className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                  audience === 'businesses'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-bold">{t('announcements.audience.businesses')}</span>
              </button>
            </div>

            {/* Plans Selector */}
            {audience === 'plans' && (
              <div className="mt-3 p-3 rounded-2xl bg-muted/30 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_PLANS.map((plan) => {
                  const isSelected = selectedPlanIds.includes(plan.id);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handlePlanToggle(plan.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
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
            )}

            {/* Businesses Selector */}
            {audience === 'businesses' && (
              <div className="mt-3 p-3 rounded-2xl bg-muted/30 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {AVAILABLE_BUSINESSES.map((biz) => {
                  const isSelected = selectedBizIds.includes(biz.id);
                  return (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => handleBizToggle(biz.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all text-start ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                          : 'bg-background border-border text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <span className="font-semibold">{biz.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Date Validity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.startDate')}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.endDate')} ({t('announcements.modal.optional')})
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* 6. Action Link (CTA) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                {t('announcements.modal.actionUrl')}
              </label>
              <input
                type="text"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="/system/health"
                className="w-full px-3.5 py-2 text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Button Text (EN)
              </label>
              <input
                type="text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="View Details"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                زر الإجراء (AR)
              </label>
              <input
                type="text"
                value={actionTextAr}
                onChange={(e) => setActionTextAr(e.target.value)}
                placeholder="تفاصيل أكثر"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* 7. Display Options (Pinned, Dismissible, Active) */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border/60 text-xs font-semibold">
            {/* Pinned */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>{t('announcements.modal.pinToTop')}</span>
            </label>

            {/* Dismissible */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDismissible}
                onChange={(e) => setIsDismissible(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>{t('announcements.modal.allowDismiss')}</span>
            </label>

            {/* Active */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>{t('announcements.modal.publishImmediately')}</span>
            </label>
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
              {editingAnnouncement ? t('common.saveChanges') : t('announcements.actions.createAnnouncement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

CreateAnnouncementModal.displayName = 'CreateAnnouncementModal';
