import { useState, useRef, useEffect, useCallback, type FC, type ComponentType, type MouseEvent } from 'react';
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { useTranslation } from '../../../../app/context/LanguageContext';

export interface DataTableRowActionItem {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
  dividerBefore?: boolean;
  onClick: () => void;
}

export interface DataTableRowActionsProps {
  actions: DataTableRowActionItem[];
  triggerIcon?: 'horizontal' | 'vertical';
  triggerAriaLabel?: string;
  align?: 'auto' | 'start' | 'end';
}

export const DataTableRowActions: FC<DataTableRowActionsProps> = ({
  actions,
  triggerIcon = 'horizontal',
  triggerAriaLabel,
  align = 'auto',
}) => {
  const { isRtl } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 190px below, flip dropdown upwards
      setOpenUpward(spaceBelow < 190);
    }
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  const handleActionClick = useCallback((e: MouseEvent, action: DataTableRowActionItem) => {
    e.stopPropagation();
    if (action.disabled) return;
    setIsOpen(false);
    action.onClick();
  }, []);

  const IconComponent = triggerIcon === 'vertical' ? MoreVertical : MoreHorizontal;

  // Alignment determination
  const resolvedAlign = align === 'auto' ? (isRtl ? 'start' : 'end') : align;
  const alignClass = resolvedAlign === 'start' ? 'left-0 rtl:left-auto rtl:right-0' : 'right-0 rtl:right-auto rtl:left-0';
  const verticalPlacementClass = openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5';

  if (actions.length === 0) return null;

  return (
    <div className="relative inline-flex items-center">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={triggerAriaLabel || (isRtl ? 'خيارات إضافية' : 'Row actions')}
        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
          isOpen
            ? 'border-primary bg-primary/10 text-primary shadow-2xs'
            : 'border-border/80 bg-card hover:bg-surface-subtle text-muted-foreground hover:text-foreground'
        }`}
      >
        <IconComponent className="h-4 w-4" />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className={`absolute ${alignClass} ${verticalPlacementClass} min-w-[190px] rounded-xl border border-border/90 bg-card/95 backdrop-blur-xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150`}
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map((action) => {
            const ItemIcon = action.icon;
            const isDanger = action.variant === 'danger';
            const isWarning = action.variant === 'warning';
            const isSuccess = action.variant === 'success';

            const variantClasses = isDanger
              ? 'text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 font-bold'
              : isWarning
              ? 'text-amber-500 hover:bg-amber-500/10 focus:bg-amber-500/10 font-bold'
              : isSuccess
              ? 'text-emerald-500 hover:bg-emerald-500/10 focus:bg-emerald-500/10 font-bold'
              : 'text-foreground hover:bg-surface-subtle focus:bg-surface-subtle font-medium';

            return (
              <div key={action.id}>
                {action.dividerBefore && (
                  <div className="my-1 border-t border-border/60" role="separator" />
                )}
                <button
                  type="button"
                  role="menuitem"
                  disabled={action.disabled}
                  onClick={(e) => handleActionClick(e, action)}
                  className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses}`}
                >
                  {ItemIcon && <ItemIcon className="h-3.5 w-3.5 shrink-0" />}
                  <span className="truncate">{action.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
