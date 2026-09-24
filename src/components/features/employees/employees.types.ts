export type StaffStatus = 'Clocked In' | 'Clocked Out';

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: StaffStatus;
  shift: string;
};

export type PermissionMatrixRow = {
  page: string;
  owner: boolean;
  manager: boolean;
  cashier: boolean;
  kitchen: boolean;
};
