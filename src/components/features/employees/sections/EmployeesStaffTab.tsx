type EmployeeMember = {
  id: string;
  name: string;
  role: string;
  branch: string;
  status: 'Clocked In' | 'Clocked Out';
  shift: string;
};

type EmployeesStaffTabProps = {
  employees: EmployeeMember[];
  nameLabel: string;
  roleLabel: string;
  branchLabel: string;
  statusLabel: string;
  shiftLabel: string;
  clockedInLabel: string;
  clockedOutLabel: string;
};

const EmployeesStaffTab = ({
  employees,
  nameLabel,
  roleLabel,
  branchLabel,
  statusLabel,
  shiftLabel,
  clockedInLabel,
  clockedOutLabel,
}: EmployeesStaffTabProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-6 shadow-lg space-y-4">
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
        <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
          <thead className="border-b border-[var(--color-border)] bg-[var(--surface)] font-semibold text-[var(--text-muted)]">
            <tr>
              <th className="p-2 sm:p-3">{nameLabel}</th>
              <th className="p-2 sm:p-3">{roleLabel}</th>
              <th className="p-2 sm:p-3 hidden sm:table-cell">{branchLabel}</th>
              <th className="p-2 sm:p-3">{statusLabel}</th>
              <th className="p-2 sm:p-3 hidden md:table-cell">{shiftLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-[var(--elevated)]/40 transition">
                <td className="p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center text-[10px] sm:text-xs shrink-0">
                      {employee.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[var(--text-primary)] truncate max-w-[80px] sm:max-w-none">
                      {employee.name}
                    </span>
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-[var(--text-secondary)] font-medium truncate max-w-[80px] sm:max-w-none">
                  {employee.role}
                </td>
                <td className="p-2 sm:p-3 text-[var(--text-muted)] hidden sm:table-cell truncate max-w-[100px]">
                  {employee.branch}
                </td>
                <td className="p-2 sm:p-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${
                      employee.status === 'Clocked In'
                        ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                        employee.status === 'Clocked In' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    ></span>
                    {employee.status === 'Clocked In' ? clockedInLabel : clockedOutLabel}
                  </span>
                </td>
                <td className="p-2 sm:p-3 font-mono text-[var(--text-muted)] text-[10px] sm:text-xs hidden md:table-cell truncate max-w-[80px]">
                  {employee.shift}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeesStaffTab;