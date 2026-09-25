import { useState, type FC } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { INITIAL_BROADCASTS } from './notification.mock';
import type {
  NotificationBroadcast,
  NotificationModalAction,
  BroadcastStatus
} from './notification.types';
import NotificationKpiStrip from './components/NotificationKpiStrip';
import { BroadcastComposerStudio } from './components/BroadcastComposerStudio';
import BroadcastHistoryTable from './components/BroadcastHistoryTable';
import { NotificationActionModals } from './components/NotificationActionModals';
import { Radio, Plus, CheckCircle2, History } from 'lucide-react';

export const NotificationsDashboard: FC = () => {
  const { t } = useTranslation();
  const [broadcasts, setBroadcasts] = useState<NotificationBroadcast[]>(INITIAL_BROADCASTS);
  const [activeTab, setActiveTab] = useState<'history' | 'composer'>('history');
  const [activeKpiStatus, setActiveKpiStatus] = useState<'all' | BroadcastStatus>('all');
  const [modalAction, setModalAction] = useState<NotificationModalAction>(null);
  const [pendingBroadcast, setPendingBroadcast] = useState<Partial<NotificationBroadcast> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartDispatch = (newBroadcastData: Partial<NotificationBroadcast>) => {
    setPendingBroadcast(newBroadcastData);
    setModalAction({ type: 'confirm_dispatch', broadcast: newBroadcastData });
  };

  const handleConfirmAuthorizedDispatch = () => {
    if (!pendingBroadcast) return;

    const newId = `BRD-${Math.floor(4000 + Math.random() * 1000)}`;
    const isScheduled = pendingBroadcast.status === 'scheduled';

    const created: NotificationBroadcast = {
      id: newId,
      title: pendingBroadcast.title || 'Untitled Broadcast',
      message: pendingBroadcast.message || '',
      type: pendingBroadcast.type || 'general_info',
      channels: pendingBroadcast.channels || ['in_app'],
      audience: pendingBroadcast.audience || {
        type: 'all_businesses',
        estimatedBusinessesCount: 148,
        estimatedUsersCount: 1840,
      },
      status: isScheduled ? 'scheduled' : 'sent',
      scheduledAt: pendingBroadcast.scheduledAt,
      sentAt: isScheduled ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      authorName: 'Alex Morgan (Super Admin)',
      actionButton: pendingBroadcast.actionButton,
      metrics: {
        sentCount: isScheduled ? 0 : pendingBroadcast.audience?.estimatedUsersCount || 1200,
        deliveredCount: isScheduled ? 0 : Math.round((pendingBroadcast.audience?.estimatedUsersCount || 1200) * 0.99),
        readCount: 0,
        clickCount: 0,
      },
    };

    setBroadcasts([created, ...broadcasts]);
    setPendingBroadcast(null);
    setActiveTab('history');
    showToast(isScheduled ? `${t('notifications.toast.scheduledSuccessfully')}: ${newId}` : `${t('notifications.toast.dispatchedSuccessfully')}: ${newId}`);
  };

  const handleCancelScheduled = (broadcastId: string) => {
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === broadcastId ? { ...b, status: 'cancelled' } : b))
    );
    showToast(`${t('notifications.toast.cancelledBroadcast')}: ${broadcastId}`);
  };

  const handleCloneBroadcast = (broadcast: NotificationBroadcast) => {
    setActiveTab('composer');
    showToast(`${t('notifications.toast.clonedIntoComposer')}: ${broadcast.title}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-card/95 text-foreground shadow-2xl backdrop-blur-md animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>{t('notifications.page.title')}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {t('notifications.page.badgeOmni')}
              </span>
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t('notifications.page.subtitle')}</p>
        </div>

        {/* Action Button: Toggle Compose / History */}
        <div className="flex items-center gap-2">
          {activeTab === 'history' ? (
            <button
              type="button"
              onClick={() => setActiveTab('composer')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('notifications.action.composeNew')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-foreground hover:bg-surface-subtle transition-all cursor-pointer"
            >
              <History className="h-4 w-4" />
              <span>{t('notifications.action.viewHistory')}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Support Telemetry Strip */}
      <NotificationKpiStrip
        broadcasts={broadcasts}
        activeStatus={activeKpiStatus}
        onSelectStatus={(st) => {
          setActiveKpiStatus(st);
          setActiveTab('history');
        }}
      />

      {/* Segmented Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-card text-foreground shadow-xs border border-border/80 font-black'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>{t('notifications.tabs.history')}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-subtle font-bold">
            {broadcasts.length}
          </span>
          {activeTab === 'history' && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('composer')}
          className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'composer'
              ? 'bg-card text-foreground shadow-xs border border-border/80 font-black'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>{t('notifications.tabs.composerStudio')}</span>
          {activeTab === 'composer' && (
            <span className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* Content Render based on Active Tab */}
      {activeTab === 'history' ? (
        <BroadcastHistoryTable
          broadcasts={broadcasts}
          onOpenModal={(action) => setModalAction(action)}
          onCloneBroadcast={handleCloneBroadcast}
        />
      ) : (
        <BroadcastComposerStudio
          onSubmitBroadcast={handleStartDispatch}
        />
      )}

      {/* Action Modals */}
      <NotificationActionModals
        modalAction={modalAction}
        onClose={() => setModalAction(null)}
        onConfirmDispatch={handleConfirmAuthorizedDispatch}
        onConfirmCancelScheduled={handleCancelScheduled}
      />
    </div>
  );
};

export default NotificationsDashboard;
