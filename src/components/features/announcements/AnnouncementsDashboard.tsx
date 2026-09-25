import { useState, useMemo, useCallback, type FC } from 'react';
import {
  Megaphone,
  Server,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import type {
  SystemAnnouncement,
  ApiEndpointHealth,
  AnnouncementsTabId,
} from './announcements.types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_API_ENDPOINTS,
} from './announcements.mock';

import { AnnouncementsKpiStrip } from './components/AnnouncementsKpiStrip';
import { AnnouncementLiveBannerPreview } from './components/AnnouncementLiveBannerPreview';
import { AnnouncementsTable } from './components/AnnouncementsTable';
import { CreateAnnouncementModal } from './components/CreateAnnouncementModal';
import { ApiEndpointsHealthGrid } from './components/ApiEndpointsHealthGrid';

export const AnnouncementsDashboard: FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpointHealth[]>(INITIAL_API_ENDPOINTS);
  const [activeTab, setActiveTab] = useState<AnnouncementsTabId>('announcements');

  // Preview selection
  const [selectedForPreviewId, setSelectedForPreviewId] = useState<string | null>(
    () => announcements.find((a) => a.isActive)?.id || announcements[0]?.id || null
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<SystemAnnouncement | null>(null);

  const selectedAnnouncement = useMemo(() => {
    return announcements.find((a) => a.id === selectedForPreviewId) || announcements[0] || null;
  }, [announcements, selectedForPreviewId]);

  // Toggle active state
  const handleToggle = useCallback(
    (item: SystemAnnouncement) => {
      const nextState = !item.isActive;
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, isActive: nextState } : a))
      );
      showToast(
        nextState
          ? t('announcements.toast.activated')
          : t('announcements.toast.deactivated'),
        nextState ? 'success' : 'info'
      );
    },
    [showToast, t]
  );

  // Save (Create / Edit)
  const handleSaveAnnouncement = useCallback(
    (data: Partial<SystemAnnouncement>) => {
      if (editingAnnouncement) {
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === editingAnnouncement.id ? { ...a, ...data } : a
          )
        );
        showToast(t('announcements.toast.updated'), 'success');
      } else {
        const newItem: SystemAnnouncement = {
          id: `anc_${Date.now()}`,
          title: data.title || 'New Announcement',
          titleAr: data.titleAr || 'إعلان جديد',
          message: data.message || '',
          messageAr: data.messageAr || '',
          type: data.type || 'info',
          audience: data.audience || 'everyone',
          targetIds: data.targetIds || [],
          targetLabels: data.targetLabels || ['All Tenants'],
          isActive: data.isActive ?? true,
          isDismissible: data.isDismissible ?? true,
          isPinned: data.isPinned ?? false,
          actionUrl: data.actionUrl,
          actionText: data.actionText,
          actionTextAr: data.actionTextAr,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          endDate: data.endDate,
          createdAt: 'Just now',
          createdBy: 'Root Super Admin',
        };
        setAnnouncements((prev) => [newItem, ...prev]);
        setSelectedForPreviewId(newItem.id);
        showToast(t('announcements.toast.created'), 'success');
      }
    },
    [editingAnnouncement, showToast, t]
  );

  // Delete
  const handleDelete = useCallback(
    (item: SystemAnnouncement) => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== item.id));
      if (selectedForPreviewId === item.id) {
        setSelectedForPreviewId(null);
      }
      showToast(t('announcements.toast.deleted'), 'error');
    },
    [selectedForPreviewId, showToast, t]
  );

  // Open Create
  const handleOpenCreate = useCallback(() => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  }, []);

  // Open Edit
  const handleOpenEdit = useCallback((item: SystemAnnouncement) => {
    setEditingAnnouncement(item);
    setIsModalOpen(true);
  }, []);

  // Select for preview
  const handleSelectForPreview = useCallback((item: SystemAnnouncement) => {
    setSelectedForPreviewId(item.id);
    showToast(t('announcements.toast.loadedInPreview'), 'info');
  }, [showToast, t]);

  // Refresh endpoints ping
  const handleRefreshEndpoints = useCallback(() => {
    setApiEndpoints((prev) =>
      prev.map((ep) => ({
        ...ep,
        responseTimeMs: Math.max(18, Math.floor(ep.responseTimeMs + (Math.random() * 8 - 4))),
        lastChecked: 'Just now',
      }))
    );
  }, []);

  return (
    <div className="space-y-6 text-foreground animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                  {t('announcements.title')}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  Broadcast & Telemetry
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t('announcements.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/80 p-1 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'announcements'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>{t('announcements.tabs.announcements')}</span>
          </button>

          <button
            onClick={() => setActiveTab('apiHealth')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'apiHealth'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>{t('announcements.tabs.apiHealth')}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <AnnouncementsKpiStrip
        announcements={announcements}
        apiEndpoints={apiEndpoints}
      />

      {/* 3. Tab Contents */}
      {activeTab === 'announcements' ? (
        <div className="space-y-6">
          {/* Live simulator banner */}
          <AnnouncementLiveBannerPreview
            announcement={selectedAnnouncement}
          />

          {/* Announcements Table */}
          <AnnouncementsTable
            announcements={announcements}
            selectedForPreviewId={selectedForPreviewId}
            onSelectForPreview={handleSelectForPreview}
            onToggle={handleToggle}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onOpenCreate={handleOpenCreate}
          />
        </div>
      ) : (
        <ApiEndpointsHealthGrid
          endpoints={apiEndpoints}
          onRefreshAll={handleRefreshEndpoints}
        />
      )}

      {/* 4. Create / Edit Modal */}
      <CreateAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnnouncement}
        editingAnnouncement={editingAnnouncement}
      />
    </div>
  );
};

export default AnnouncementsDashboard;
