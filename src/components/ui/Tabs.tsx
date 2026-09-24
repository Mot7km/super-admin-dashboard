import type { ComponentType } from 'react';

type TabItem<Key extends string> = {
  key: Key;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
};

type TabsProps<Key extends string> = {
  items: Array<TabItem<Key>>;
  activeKey: Key;
  onChange: (key: Key) => void;
  className?: string;
};

const Tabs = <Key extends string>({
  items,
  activeKey,
  onChange,
  className = '',
}: TabsProps<Key>) => (
  <div className={`flex items-center gap-1.5 sm:gap-2 border-b border-[var(--color-border)] pb-2 overflow-x-auto hide-scrollbar mobile-scroll-snap ${className}`}>
    {items.map(({ key, label, icon: Icon, disabled }) => (
      <button
        key={key}
        type="button"
        onClick={() => !disabled && onChange(key)}
        disabled={disabled}
        className={`flex items-center gap-1.5 sm:gap-2 shrink-0 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold transition whitespace-nowrap cursor-pointer ${
          activeKey === key
            ? 'bg-[var(--primary)] text-white shadow-md'
            : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--elevated)]'
        } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        {Icon && <Icon className="h-4 w-4" />}
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default Tabs;