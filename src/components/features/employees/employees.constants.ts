import type { PermissionMatrixRow, StaffMember } from './employees.types';

export const initialStaff: StaffMember[] = [
  { id: 'e-1', name: 'Ahmed Hassan', role: 'Branch Manager', branch: 'Main Branch', status: 'Clocked In', shift: '09:00 AM - 05:00 PM' },
  { id: 'e-2', name: 'Mahmoud Ali', role: 'Head Cashier', branch: 'Main Branch', status: 'Clocked In', shift: '01:00 PM - 09:00 PM' },
  { id: 'e-3', name: 'Nour El-Din', role: 'Kitchen Chef', branch: 'Mall Branch', status: 'Clocked Out', shift: '04:00 PM - 12:00 AM' },
];

export const initialPermissions: PermissionMatrixRow[] = [
  { page: 'Dashboard Analytics', owner: true, manager: true, cashier: false, kitchen: false },
  { page: 'Menu & QR Control', owner: true, manager: true, cashier: false, kitchen: false },
  { page: 'POS & Kitchen Orders (KDS)', owner: true, manager: true, cashier: true, kitchen: true },
  { page: 'Financial Sales & Revenue', owner: true, manager: false, cashier: false, kitchen: false },
  { page: 'Inventory & Stock Restock', owner: true, manager: true, cashier: false, kitchen: true },
];
