import { Check } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string | ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
};

const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  id,
}) => {
  const handleToggle = () => {
    if (!disabled) onChange(!checked);
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div
      className={`
        flex items-center justify-between
        w-full rounded-xl
        border border-[var(--color-border)]
        bg-[var(--card)]
        px-4 py-3
        transition-all duration-200
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--primary)]/50 hover:shadow-md'}
        ${className}
      `}
      onClick={handleToggle}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      aria-disabled={disabled}
    >
      <label
        htmlFor={checkboxId}
        className="text-sm font-medium text-[var(--text-secondary)] cursor-pointer select-none"
      >
        {label}
      </label>

      <div className="relative flex items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            flex h-5 w-5 shrink-0 items-center justify-center
            rounded-md border-2
            transition-all duration-200
            ${checked
              ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
              : 'border-[var(--color-border)] bg-[var(--surface)]'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
          aria-hidden="true"
        >
          {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
};

export default Checkbox;