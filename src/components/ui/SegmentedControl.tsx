import type { ReactNode } from 'react';

type SegmentedControlOption<Value extends string> = {
  value: Value;
  label: string;
  icon?: ReactNode;
};

type SegmentedControlProps<Value extends string> = {
  options: Array<SegmentedControlOption<Value>>;
  selectedValue: Value;
  onChange: (value: Value) => void;
  className?: string;
};

const SegmentedControl = <Value extends string>({
  options,
  selectedValue,
  onChange,
  className = '',
}: SegmentedControlProps<Value>) => (
  <div className={`flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--card)] p-1 ${className}`}>
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
          selectedValue === option.value
            ? 'bg-[var(--primary)] text-white'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
      >
        {option.icon}
        <span>{option.label}</span>
      </button>
    ))}
  </div>
);

export default SegmentedControl;