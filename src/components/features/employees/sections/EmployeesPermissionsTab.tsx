import { Check, X } from 'lucide-react';

type PermissionRow = {
  page: string;
  owner: boolean;
  manager: boolean;
  cashier: boolean;
  kitchen: boolean;
};

type EmployeesPermissionsTabProps = {
  permissions: PermissionRow[];
  title: string;
  subtitle: string;
  featureLabel: string;
  ownerLabel: string;
  managerLabel: string;
  cashierLabel: string;
  kitchenLabel: string;
  onTogglePermission: (idx: number, roleKey: 'manager' | 'cashier' | 'kitchen') => void;
};

const EmployeesPermissionsTab = ({
  permissions,
  title,
  subtitle,
  featureLabel,
  ownerLabel,
  managerLabel,
  cashierLabel,
  kitchenLabel,
  onTogglePermission,
}: EmployeesPermissionsTabProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
      <div>
        <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--color-border)] bg-[var(--surface)] font-semibold text-[var(--text-muted)]">
            <tr>
              <th className="p-3">{featureLabel}</th>
              <th className="p-3 text-center">{ownerLabel}</th>
              <th className="p-3 text-center">{managerLabel}</th>
              <th className="p-3 text-center">{cashierLabel}</th>
              <th className="p-3 text-center">{kitchenLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {permissions.map((permission, idx) => (
              <tr key={idx} className="hover:bg-[var(--elevated)]/40 transition">
                <td className="p-3 font-bold text-[var(--text-primary)]">{permission.page}</td>
                <td className="p-3 text-center">
                  <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onTogglePermission(idx, 'manager')}
                    className="p-1 rounded hover:bg-[var(--elevated)] cursor-pointer"
                  >
                    {permission.manager ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-rose-500 mx-auto" />
                    )}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onTogglePermission(idx, 'cashier')}
                    className="p-1 rounded hover:bg-[var(--elevated)] cursor-pointer"
                  >
                    {permission.cashier ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-rose-500 mx-auto" />
                    )}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onTogglePermission(idx, 'kitchen')}
                    className="p-1 rounded hover:bg-[var(--elevated)] cursor-pointer"
                  >
                    {permission.kitchen ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-rose-500 mx-auto" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesPermissionsTab;