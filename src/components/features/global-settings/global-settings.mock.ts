import type { GlobalSettingsState } from './global-settings.types';

export const INITIAL_GLOBAL_SETTINGS: GlobalSettingsState = {
  general: {
    platformName: 'MOT7KM Cloud ERP',
    platformTagline: 'Next-Generation Multi-Tenant Restaurant & Retail Management Platform',
    platformLogoUrl: 'https://mot7km.store/assets/logo.svg',
    defaultCurrency: 'SAR',
    defaultLanguage: 'ar',
    timezone: 'Asia/Riyadh (GMT+3)',
    supportEmail: 'support@mot7km.store',
    supportPhone: '+966 11 456 7890',
    copyrightText: '© 2026 MOT7KM SaaS Technologies Ltd. All Rights Reserved.',
  },
  security: {
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 60,
    passwordMinLength: 10,
    requireSpecialChar: true,
    require2FAForAdmins: true,
    ipWhitelistEnabled: false,
    ipWhitelist: ['192.168.1.100', '10.0.0.1/24', '156.204.12.88'],
    corsAllowedOrigins: [
      'https://app.mot7km.store',
      'https://pos.mot7km.store',
      'https://admin.mot7km.store',
    ],
  },
  businessPolicy: {
    maxBusinessesPerOwner: 10,
    defaultTrialDays: 14,
    autoSuspendInactiveDays: 45,
    requireKycVerification: true,
    allowPublicRegistration: true,
    maxBranchesDefault: 5,
  },
  maintenance: {
    isActive: false,
    messageEn: 'The platform is currently undergoing scheduled infrastructure upgrades. We will be back online shortly.',
    messageAr: 'المنصة تخضع حالياً لأعمال ترقية مجدولة في البنية التحتية وتحسين الأداء. سنعود للعمل بكامل طاقتنا في أقرب وقت.',
    estimatedEndTime: '2026-09-25 14:00 (GMT+3)',
    allowAdminAccess: true,
    allowedIPs: ['156.204.12.88', '197.38.10.45'],
    lastActivatedAt: '2026-09-15 02:00 AM',
    activatedBy: 'Ahmed Tariq (Lead Architect)',
  },
};

export const SUPPORTED_CURRENCIES = [
  { code: 'SAR', label: 'Saudi Riyal (ر.س)', symbol: 'SAR' },
  { code: 'EGP', label: 'Egyptian Pound (ج.م)', symbol: 'EGP' },
  { code: 'AED', label: 'UAE Dirham (د.إ)', symbol: 'AED' },
  { code: 'USD', label: 'US Dollar ($)', symbol: 'USD' },
  { code: 'EUR', label: 'Euro (€)', symbol: 'EUR' },
  { code: 'KWD', label: 'Kuwaiti Dinar (د.ك)', symbol: 'KWD' },
];

export const SUPPORTED_TIMEZONES = [
  { value: 'Asia/Riyadh (GMT+3)', label: 'Riyadh / Saudi Arabia (GMT+3)' },
  { value: 'Africa/Cairo (GMT+2)', label: 'Cairo / Egypt (GMT+2)' },
  { value: 'Asia/Dubai (GMT+4)', label: 'Dubai / UAE (GMT+4)' },
  { value: 'Asia/Kuwait (GMT+3)', label: 'Kuwait City (GMT+3)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'Europe/London (GMT+0)', label: 'London (GMT+0)' },
];

export const emitMaintenanceChange = (isActive: boolean) => {
  try {
    localStorage.setItem('mot7km_maintenance_active', isActive ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('mot7km_maintenance_change', { detail: isActive }));
  } catch (err) {
    console.error('Failed to dispatch maintenance event', err);
  }
};
