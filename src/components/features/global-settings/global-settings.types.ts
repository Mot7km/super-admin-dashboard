export interface GeneralSettings {
  platformName: string;
  platformTagline: string;
  platformLogoUrl: string;
  defaultCurrency: string;       // 'SAR', 'EGP', 'AED', 'USD'
  defaultLanguage: 'ar' | 'en';
  timezone: string;
  supportEmail: string;
  supportPhone: string;
  copyrightText: string;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  requireSpecialChar: boolean;
  require2FAForAdmins: boolean;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
  corsAllowedOrigins: string[];
}

export interface BusinessPolicySettings {
  maxBusinessesPerOwner: number;
  defaultTrialDays: number;
  autoSuspendInactiveDays: number;
  requireKycVerification: boolean;
  allowPublicRegistration: boolean;
  maxBranchesDefault: number;
}

export interface MaintenanceSettings {
  isActive: boolean;
  messageEn: string;
  messageAr: string;
  estimatedEndTime: string;
  allowAdminAccess: boolean;
  allowedIPs: string[];
  lastActivatedAt?: string;
  activatedBy?: string;
}

export interface GlobalSettingsState {
  general: GeneralSettings;
  security: SecuritySettings;
  businessPolicy: BusinessPolicySettings;
  maintenance: MaintenanceSettings;
}

export type SettingsTabId = 'general' | 'security' | 'business' | 'maintenance';
