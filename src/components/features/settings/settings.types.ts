export type AuditLogType = 'price' | 'stock' | 'staff' | 'auth' | 'delete';

export type AuditLog = {
  id: number;
  action: string;
  user: string;
  type: AuditLogType;
  time: string;
};

export type SettingsProfileData = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  cityCountry: string;
  timezone: string;
  currency: string;
  taxRate: string;
  instagram: string;
  twitter: string;
  snapchat: string;
  tiktok: string;
};

export type WorkingHours = {
  day: string;
  isOpen: boolean;
  open: string;
  close: string;
};
