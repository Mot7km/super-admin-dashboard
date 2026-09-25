import { useState, useEffect, memo, type FC, type ComponentType } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../app/context/LanguageContext';

export interface SidebarSubItemConfig {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'error' | 'success';
}

export interface SidebarNavCollapsibleProps {
  id: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
  items: SidebarSubItemConfig[];
  isCollapsed: boolean;
  badge?: string;
  badgeVariant?: 'primary' | 'warning' | 'error' | 'success';
  onItemClick?: () => void;
  defaultOpen?: boolean;
}

export const SidebarNavCollapsible: FC<SidebarNavCollapsibleProps> = memo(({
  id,
  labelKey,
  icon: Icon,
  items,
  isCollapsed,
  badge,
  badgeVariant = 'primary',
  onItemClick,
  defaultOpen,
}) => {
  const { t, isRtl } = useTranslation();
  const location = useLocation();

  // Determine if any child route or base group route is currently active
  const isAnyChildActive =
    items.some(
      (item) =>
        location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
    ) ||
    location.pathname === `/${id}` ||
    location.pathname.startsWith(`/${id}/`);

  const isChildActive = (itemTo: string) => {
    if (location.pathname === itemTo || location.pathname.startsWith(`${itemTo}/`)) {
      return true;
    }
    if (location.pathname === `/${id}` && itemTo === `/${id}/overview`) {
      return true;
    }
    return false;
  };

  // Auto-expand if active or defaults to open
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (defaultOpen !== undefined) return defaultOpen;
    return isAnyChildActive || false;
  });

  // Keep open when navigating to one of its children
  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [isAnyChildActive]);

  const renderBadge = (
    badgeText?: string,
    variant: 'primary' | 'warning' | 'error' | 'success' = 'primary'
  ) => {
    if (!badgeText) return null;
    const colorClasses = {
      primary: 'bg-primary/15 text-primary border border-primary/20',
      warning: 'bg-warning-bg text-warning-text border border-warning/20',
      error: 'bg-destructive-bg text-destructive-text border border-destructive/20',
      success: 'bg-success-bg text-success-text border border-success/20',
    }[variant];

    return (
      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-pill shrink-0 ${colorClasses}`}>
        {badgeText}
      </span>
    );
  };

  const groupLabel = t(labelKey);
  const contentId = `nav-collapsible-${id}`;

  return (
    <div className="flex flex-col gap-1 w-full" role="group" aria-label={groupLabel}>
      {/* Group Header Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          title={isCollapsed ? groupLabel : undefined}
          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isCollapsed ? 'justify-center px-0' : ''
          } ${
            isAnyChildActive
              ? 'bg-primary/10 text-primary font-bold shadow-xs'
              : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
          }`}
        >
          {/* Icon & Label */}
          <div className="flex items-center gap-3 min-w-0">
            <Icon
              className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isAnyChildActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`}
            />
            {!isCollapsed && <span className="truncate">{groupLabel}</span>}
          </div>

          {/* Badges & Chevron (when expanded sidebar) */}
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 shrink-0">
              {badge ? (
                renderBadge(badge, badgeVariant)
              ) : (
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-md bg-muted/60 text-muted-foreground">
                  {items.length}
                </span>
              )}
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground/80 transition-transform duration-200 ease-out ${
                  isOpen ? 'rotate-180 text-foreground' : ''
                }`}
              />
            </div>
          )}
        </button>

        {/* Collapsed Mode Flyout Popover (Interactive & Accessible) */}
        {isCollapsed && (
          <div
            className={`pointer-events-none group-hover:pointer-events-auto absolute hidden group-hover:flex flex-col rounded-2xl bg-card/95 backdrop-blur-md p-2.5 text-xs font-semibold text-card-foreground shadow-2xl border border-border/80 z-50 min-w-[210px] space-y-1 transition-all duration-150 animate-in fade-in zoom-in-95 top-0 ${
              isRtl
                ? 'right-full mr-2.5 before:absolute before:inset-y-0 before:-right-3 before:w-3'
                : 'left-full ml-2.5 before:absolute before:inset-y-0 before:-left-3 before:w-3'
            }`}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/60 mb-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground text-xs">{groupLabel}</span>
              </div>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-md bg-muted text-muted-foreground">
                {items.length}
              </span>
            </div>

            {/* Sub-items in Flyout */}
            <div className="flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {items.map((subItem) => {
                const subLabel = t(subItem.labelKey);
                const isCurrent = isChildActive(subItem.to);
                return (
                  <NavLink
                    key={subItem.to}
                    to={subItem.to}
                    onClick={onItemClick}
                    className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                      isCurrent
                        ? 'bg-primary/10 text-primary font-bold shadow-xs'
                        : 'text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <subItem.icon className={`h-3.5 w-3.5 shrink-0 ${isCurrent ? 'text-primary' : 'opacity-70'}`} />
                      <span className="truncate">{subLabel}</span>
                    </div>
                    {renderBadge(subItem.badge, subItem.badgeVariant)}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Mode: Modern Inset Card & Glowing Rail */}
      {!isCollapsed && isOpen && (
        <div
          id={contentId}
          className="relative rounded-2xl bg-surface-subtle/50 dark:bg-card/40 border border-border/50 p-1.5 mt-0.5 space-y-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200"
        >
          {/* Subtle Vertical Glowing Track */}
          <div
            className={`absolute top-2.5 bottom-2.5 w-[2px] rounded-full bg-border/60 ${
              isRtl ? 'right-2.5' : 'left-2.5'
            }`}
          />

          {items.map((subItem) => {
            const subLabel = t(subItem.labelKey);
            const active = isChildActive(subItem.to);
            return (
              <NavLink
                key={subItem.to}
                to={subItem.to}
                onClick={onItemClick}
                className={
                  `group relative flex items-center justify-between rounded-xl py-1.5 px-3 text-[11px] font-medium transition-all duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    isRtl ? 'pr-4' : 'pl-4'
                  } ${
                    active
                      ? 'bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/20'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  }`
                }
              >
                {() => (
                  <>
                    {/* Node on the rail */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-200 ${
                          active
                            ? 'bg-primary scale-125 shadow-[0_0_6px_rgba(var(--primary),0.8)]'
                            : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/70'
                        }`}
                      />
                      <subItem.icon
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                          active
                            ? 'text-primary scale-105'
                            : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                        }`}
                      />
                      <span className="truncate">{subLabel}</span>
                    </div>

                    {/* Badge */}
                    {renderBadge(subItem.badge, subItem.badgeVariant)}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
});

SidebarNavCollapsible.displayName = 'SidebarNavCollapsible';
