export type BranchStatus = 'Operational' | 'Busy Peak Hours';

export type Branch = {
  id: string;
  name: string;
  status: BranchStatus;
  statusColor: string;
  address: string;
  phone: string;
  hours: string;
  todaySales: string;
  activeCashiers: number;
  topDishKey: string;
};

export type AvailabilityMatrixRow = {
  dishKey: string;
  mainBranch: boolean;
  mallBranch: boolean;
};
