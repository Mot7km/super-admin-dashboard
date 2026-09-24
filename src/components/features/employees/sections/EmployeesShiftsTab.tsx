// src/components/employees/sections/EmployeesShiftsTab.tsx
import { useState } from 'react';
import TimeRangePicker from '../../../ui/TimeRangeSlider';

type ShiftMember = {
  id: string;
  name: string;
  role: string;
  from: string;
  to: string;
};

type EmployeesShiftsTabProps = {
  members: ShiftMember[];
  title: string;
  onShiftChange?: (id: string, from: string, to: string) => void;
};

const EmployeesShiftsTab = ({
  members,
  title,
  onShiftChange,
}: EmployeesShiftsTabProps) => {
  const [localMembers, setLocalMembers] = useState(members);

  const handleTimeChange = (id: string, from: string, to: string) => {
    if (onShiftChange) {
      onShiftChange(id, from, to);
    } else {
      setLocalMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, from, to } : m))
      );
    }
  };

  const displayMembers = onShiftChange ? members : localMembers;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-lg space-y-4">
      <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
      <div className="space-y-3 text-xs">
        {displayMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--surface)] p-4 space-y-2.5"
          >
            {/* Row 1: Name + Role */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[var(--text-primary)]">
                {member.name}{' '}
                <span className="font-normal text-[var(--text-muted)]">
                  ({member.role})
                </span>
              </span>
            </div>

            {/* Row 2: TimeRangePicker */}
            <TimeRangePicker
              from={member.from}
              to={member.to}
              onChange={(from, to) => handleTimeChange(member.id, from, to)}
              compact={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesShiftsTab;