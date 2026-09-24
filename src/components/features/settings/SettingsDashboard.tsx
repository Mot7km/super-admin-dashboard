import React, { useState } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';

import SettingsHeader from './sections/SettingsHeader';
import SettingsTabs from './sections/SettingsTabs';
import ProfileTab from './sections/ProfileTab';
import PlansTab from './sections/PlansTab';
import IntegrationsTab from './sections/IntegrationsTab';
import AuditTab from './sections/AuditTab';

import {
  defaultProfileData,
  initialWorkingHours,
  defaultPlans,
  defaultInvoices,
  initialAuditLogs,
} from './settings.constants';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'plans' | 'integrations' | 'audit'>('profile');

  // Profile State
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);

  // Integrations State
  const [printerConfig, setPrinterConfig] = useState({
    name: 'Main Kitchen Thermal POS Printer #1',
    ipPort: '192.168.1.150 : 9100',
    paperWidth: '80mm',
    footerText: 'Thank you for visiting Mot7km Restaurant! www.mot7km.store',
  });
  const [notifications, setNotifications] = useState({
    emailNotif: true,
    smsNotif: true,
    pushNotif: true,
    dailySummary: false,
  });
  const [apiKey] = useState('sk_live_mot7km_9f8a3c4b5e6d7e8f9a0b1c2d3e4f5a6b');
  const [webhookUrl, setWebhookUrl] = useState('https://api.mot7km.store/v1/webhooks/orders');

  // Audit Log State
  const [auditQuery, setAuditQuery] = useState('');
  const [auditTypeFilter, setAuditTypeFilter] = useState('all');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('settings.profile.saveProfile'), 'success');
  };

  const handleSavePrinter = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('settings.integrations.savePrinter'), 'success');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    showToast('API Key copied to clipboard', 'info');
  };

  const filteredLogs = initialAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(auditQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(auditQuery.toLowerCase());
    const matchesType = auditTypeFilter === 'all' || log.type === auditTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      <SettingsHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <SettingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profileLabel={t('settings.tabs.profile')}
        plansLabel={t('settings.tabs.plans')}
        integrationsLabel={t('settings.tabs.integrations')}
        auditLabel={t('settings.tabs.auditLog')}
      />

      {activeTab === 'profile' && (
        <ProfileTab
          profileData={profileData}
          setProfileData={setProfileData}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          onSave={handleSaveProfile}
        />
      )}

      {activeTab === 'plans' && (
        <PlansTab
          plans={defaultPlans}
          invoices={defaultInvoices}
          onSelectPlan={(p) =>
            showToast(
              `${p.name}: ${p.isActive ? t('settings.plans.currentPlan') : t('settings.plans.upgradeBtn')}`,
              'info'
            )
          }
          onDownloadInvoice={(id) => showToast(`Downloaded Invoice ${id}`, 'info')}
        />
      )}

      {activeTab === 'integrations' && (
        <IntegrationsTab
          printerConfig={printerConfig}
          setPrinterConfig={setPrinterConfig}
          notifications={notifications}
          setNotifications={setNotifications}
          apiKey={apiKey}
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
          onSavePrinter={handleSavePrinter}
          onTestPrint={() => showToast('Test receipt sent to printer', 'info')}
          onCopyApiKey={handleCopyApiKey}
        />
      )}

      {activeTab === 'audit' && (
        <AuditTab
          logs={filteredLogs}
          searchQuery={auditQuery}
          setSearchQuery={setAuditQuery}
          typeFilter={auditTypeFilter}
          setTypeFilter={setAuditTypeFilter}
        />
      )}
    </div>
  );
};

export default SettingsPage;