import { type FC } from 'react';
import type { DataTableColumn, DataTableDensity } from './table.types';

interface DataTableSkeletonProps<TData> {
  columns: DataTableColumn<TData>[];
  rowCount?: number;
  density?: DataTableDensity;
  enableSelection?: boolean;
}

export const DataTableSkeleton = <TData,>({
  columns,
  rowCount = 5,
  density = 'normal',
  enableSelection = false,
}: DataTableSkeletonProps<TData>): ReturnType<FC> => {
  const rowHeightClass = {
    compact: 'py-2',
    normal: 'py-3.5',
    spacious: 'py-5',
  }[density];

  return (
    <tbody className="divide-y divide-border/40">
      {Array.from({ length: rowCount }).map((_, rIdx) => (
        <tr key={`skeleton-row-${rIdx}`} className="animate-pulse">
          {enableSelection && (
            <td className={`${rowHeightClass} px-4 w-10`}>
              <div className="h-4 w-4 rounded-md bg-muted/60" />
            </td>
          )}
          {columns.map((col, cIdx) => (
            <td
              key={`skeleton-cell-${rIdx}-${col.id}`}
              className={`${rowHeightClass} px-4`}
              style={{ width: col.width }}
            >
              <div
                className="h-4 rounded-md bg-muted/50"
                style={{
                  width: cIdx === 0 ? '65%' : cIdx === columns.length - 1 ? '40%' : `${50 + ((rIdx * 17 + cIdx * 23) % 35)}%`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
