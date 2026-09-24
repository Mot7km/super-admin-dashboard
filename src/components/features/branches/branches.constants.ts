import type { AvailabilityMatrixRow, Branch } from './branches.types';

export const initialBranches: Branch[] = [
  {
    id: 'b-1',
    name: 'Main Branch — Downtown',
    status: 'Operational',
    statusColor: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
    address: 'Downtown, 15 El-Tahrir Square, Cairo',
    phone: '+20 100 123 4567',
    hours: '10:00 AM - 02:00 AM',
    todaySales: '$2,450',
    activeCashiers: 3,
    topDishKey: 'dashboard.products.truffleBurger',
  },
  {
    id: 'b-2',
    name: 'Mall Branch — Sheikh Zayed',
    status: 'Busy Peak Hours',
    statusColor: 'bg-amber-500/10 text-amber-500 ring-amber-500/20',
    address: 'Arkan Plaza, Sheikh Zayed, Giza',
    phone: '+20 101 987 6543',
    hours: '11:00 AM - 12:00 AM',
    todaySales: '$1,980',
    activeCashiers: 2,
    topDishKey: 'dashboard.products.icedLatte',
  },
];

export const initialMatrix: AvailabilityMatrixRow[] = [
  { dishKey: 'dashboard.products.truffleBurger', mainBranch: true, mallBranch: true },
  { dishKey: 'dashboard.products.icedLatte', mainBranch: true, mallBranch: true },
  { dishKey: 'dashboard.products.margheritaPizza', mainBranch: true, mallBranch: false },
  { dishKey: 'dashboard.products.crispyChicken', mainBranch: false, mallBranch: true },
];
