import { type ReactNode, type ComponentType } from 'react';

export type DataTableDensity = 'compact' | 'normal' | 'spacious';

export type DataTableSortDirection = 'asc' | 'desc';

export interface DataTableColumn<TData> {
  id: string;
  header: string | ((context: { column: DataTableColumn<TData>; isSorted: boolean; sortDirection?: DataTableSortDirection }) => ReactNode);
  accessorKey?: keyof TData;
  cell?: (context: { row: TData; index: number; value: unknown }) => ReactNode;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  minWidth?: string;
  className?: string;
  hideable?: boolean;
}

export interface DataTableFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DataTableFilterConfig {
  id: string;
  label: string;
  value: string;
  options: DataTableFilterOption[];
  onChange: (value: string) => void;
  icon?: ComponentType<{ className?: string }>;
}

export interface DataTableBatchAction<TData> {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  variant?: 'default' | 'danger' | 'primary';
  onClick: (selectedRows: TData[]) => void;
}

export interface DataTablePaginationConfig {
  page?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface DataTableSearchConfig {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  searchFields?: string[];
}

export interface DataTablePrimaryAction {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  badge?: string;
}

export interface DataTableSecondaryAction {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick: () => void;
}

export interface DataTableEmptyStateConfig {
  title?: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DataTableProps<TData> {
  /** Array of data rows */
  data: TData[];
  /** Column definitions */
  columns: DataTableColumn<TData>[];
  /** Unique key extractor for each row */
  keyExtractor: (row: TData) => string;
  /** Optional title shown above the table */
  title?: string;
  /** Optional subtitle shown above the table */
  subtitle?: string;
  /** Search bar configuration or false to hide search input */
  search?: DataTableSearchConfig | false;
  /** Hide the entire toolbar */
  hideToolbar?: boolean;
  /** Custom filter dropdowns */
  filters?: DataTableFilterConfig[];
  /** Primary CTA button (e.g. "+ Invite New Operator") */
  primaryAction?: DataTablePrimaryAction;
  /** Additional secondary action buttons */
  secondaryActions?: DataTableSecondaryAction[];
  /** Enable row selection with checkboxes */
  enableSelection?: boolean;
  /** Controlled selected row keys */
  selectedRowKeys?: string[];
  /** Callback when row selection changes */
  onSelectionChange?: (selectedKeys: string[], selectedRows: TData[]) => void;
  /** Actions shown when one or more rows are selected */
  batchActions?: DataTableBatchAction<TData>[];
  /** Controlled sorting key */
  sortKey?: string;
  /** Controlled sorting direction */
  sortDirection?: DataTableSortDirection;
  /** Callback when sorting changes */
  onSortChange?: (key: string, direction: DataTableSortDirection) => void;
  /** Pagination configuration (if false, disables pagination; if object or true, auto-paginates) */
  pagination?: DataTablePaginationConfig | boolean;
  /** Loading state with skeleton placeholder */
  isLoading?: boolean;
  /** Empty state when no data matches */
  emptyState?: DataTableEmptyStateConfig;
  /** Callback when a row is clicked */
  onRowClick?: (row: TData, index: number) => void;
  /** Custom class generator for each row */
  rowClassName?: (row: TData, index: number) => string;
  /** Export handler (e.g. CSV or JSON export) */
  onExport?: (format: 'csv' | 'json') => void;
  /** Enable column show/hide selector */
  enableColumnVisibility?: boolean;
  /** Enable row density switcher */
  enableDensitySwitcher?: boolean;
  /** Initial row density */
  initialDensity?: DataTableDensity;
  /** Total count telemetry badge */
  totalCountBadge?: string;
}
