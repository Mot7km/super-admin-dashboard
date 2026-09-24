import { ChevronDown, Check } from 'lucide-react';
import { type FC, type ReactNode, useState, useRef, useEffect } from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
};

const Select: FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  leftIcon,
  rightIcon = <ChevronDown className="h-4 w-4" />,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  // Toggle menu
  const toggleMenu = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  // Handle selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggleMenu}
        disabled={disabled}
        className={`
          flex items-center justify-between
          w-full rounded-xl
          border border-[var(--color-border)]
          bg-[var(--card)]
          py-2.5 px-3.5
          text-sm font-medium
          text-[var(--text-secondary)]
          shadow-sm
          transition-all duration-200
          hover:border-[var(--primary)]/50 hover:shadow-md
          focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          paddingLeft: leftIcon ? '2.75rem' : '1rem',
          paddingRight: '2.5rem',
        }}
      >
        <span className="truncate">{displayLabel}</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-transform duration-200">
          {rightIcon}
        </span>
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--primary)]">
            {leftIcon}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="
            absolute z-50 mt-1.5 w-full
            rounded-xl
            border border-[var(--color-border)]
            bg-[var(--card)]
            py-1.5
            shadow-xl
            animate-in fade-in-0 zoom-in-95
            origin-top-left
          "
        >
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    flex items-center justify-between
                    px-4 py-2.5
                    text-sm font-medium
                    cursor-pointer
                    transition-colors duration-150
                    hover:bg-[var(--elevated)]
                    ${isSelected ? 'text-[var(--primary)] bg-[var(--primary)]/5' : 'text-[var(--text-secondary)]'}
                  `}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-[var(--primary)]" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;