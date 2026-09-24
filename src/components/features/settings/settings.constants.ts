import type { AuditLog, SettingsProfileData, WorkingHours } from './settings.types';

export const defaultProfileData: SettingsProfileData = {
  name: 'Mot7km Restaurant & Cafe',
  tagline: 'Authentic Gourmet & Specialty Coffee',
  phone: '+966 50 123 4567',
  email: 'contact@mot7km.store',
  website: 'https://www.mot7km.store',
  address: 'King Fahd Road, Olaya District, Building 402',
  cityCountry: 'Riyadh, Saudi Arabia',
  timezone: 'Asia/Riyadh (UTC+3)',
  currency: 'SAR — Saudi Riyal',
  taxRate: '15',
  instagram: '@mot7km_cafe',
  twitter: '@mot7km_sa',
  snapchat: 'mot7km.official',
  tiktok: '@mot7km_sa',
};

export const initialWorkingHours: WorkingHours[] = [
  { day: 'Sunday', isOpen: true, open: '10:00', close: '00:00' },
  { day: 'Monday', isOpen: true, open: '10:00', close: '00:00' },
  { day: 'Tuesday', isOpen: true, open: '10:00', close: '00:00' },
  { day: 'Wednesday', isOpen: true, open: '10:00', close: '00:00' },
  { day: 'Thursday', isOpen: true, open: '10:00', close: '01:00' },
  { day: 'Friday', isOpen: true, open: '13:00', close: '01:00' },
  { day: 'Saturday', isOpen: true, open: '10:00', close: '00:00' },
];

export const defaultPlans = [
  {
    id: 'p-1',
    name: 'Plan 1 — Starter QR Menu',
    price: '$29 / mo',
    isActive: false,
    features: ['Digital QR Menu', 'Bilingual Support', 'Customer Reviews Widget', '1 Branch Included'],
  },
  {
    id: 'p-2',
    name: 'Plan 2 — Ordering & POS Pro',
    price: '$79 / mo',
    isActive: true,
    features: ['All Starter Features', 'Live Kitchen KDS Display', 'Table Ordering & POS', '3 Branches Included'],
  },
  {
    id: 'p-3',
    name: 'Plan 3 — Operations Enterprise',
    price: '$149 / mo',
    isActive: false,
    features: ['All POS Features', 'Inventory & Recipe Links', 'Staff Attendance QR', 'Unlimited Branches'],
  },
];

export const defaultInvoices = [
  { id: 'INV-2025-003', date: 'Feb 01, 2025', amount: '$79.00', status: 'paid' },
  { id: 'INV-2025-002', date: 'Jan 01, 2025', amount: '$79.00', status: 'paid' },
  { id: 'INV-2024-012', date: 'Dec 01, 2024', amount: '$79.00', status: 'paid' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 1, action: 'Updated Dish Price (Smoked Truffle Burger -> $14.50)', user: 'Ahmed Hassan (Owner)', type: 'price', time: 'Today at 11:20 AM' },
  { id: 2, action: 'Marked Spanish Iced Latte as Sold Out', user: 'Mahmoud Ali (Cashier)', type: 'stock', time: 'Today at 09:45 AM' },
  { id: 3, action: 'Generated Staff Attendance QR Code', user: 'Ahmed Hassan (Owner)', type: 'staff', time: 'Yesterday at 04:15 PM' },
  { id: 4, action: 'Updated Thermal Receipt Footer Text', user: 'Sami Mansour (Manager)', type: 'price', time: 'Yesterday at 02:30 PM' },
  { id: 5, action: 'Added New Staff Account: Tariq Khaled (Kitchen Chef)', user: 'Ahmed Hassan (Owner)', type: 'staff', time: 'Feb 26, 2025 at 05:10 PM' },
  { id: 6, action: 'System Backup Completed & Cloud Sync Verified', user: 'System Auto-Task', type: 'auth', time: 'Feb 26, 2025 at 03:00 AM' },
  { id: 7, action: 'Adjusted Raw Material Recipe Deduction for Smoked Burger', user: 'Sami Mansour (Manager)', type: 'stock', time: 'Feb 25, 2025 at 01:20 PM' },
  { id: 8, action: 'User Login Session Started from IP 192.168.1.45', user: 'Mahmoud Ali (Cashier)', type: 'auth', time: 'Feb 25, 2025 at 08:00 AM' },
  { id: 9, action: 'Deleted Expired Promotional Banner from QR Simulator', user: 'Ahmed Hassan (Owner)', type: 'delete', time: 'Feb 24, 2025 at 06:45 PM' },
  { id: 10, action: 'Regenerated Developer API Webhook Key', user: 'Ahmed Hassan (Owner)', type: 'auth', time: 'Feb 24, 2025 at 11:15 AM' },
];
