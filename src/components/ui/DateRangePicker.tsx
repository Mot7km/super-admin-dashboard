import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { type FC, useState, useRef, useEffect } from 'react';

export type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

// Helpers
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDateShort = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDateFull = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const DateRangePicker: FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date range',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    if (value.start) return new Date(value.start.getFullYear(), value.start.getMonth(), 1);
    return new Date();
  });
  const [tempRange, setTempRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTempRange({ start: value.start ? new Date(value.start) : null, end: value.end ? new Date(value.end) : null });
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ start: null, end: null });
    setTempRange({ start: null, end: null });
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    if (tempRange.start && tempRange.end) {
      setTempRange({ start: day, end: null });
      return;
    }
    if (!tempRange.start) {
      setTempRange({ start: day, end: null });
    } else if (!tempRange.end) {
      if (day < tempRange.start) {
        setTempRange({ start: day, end: tempRange.start });
      } else {
        setTempRange({ start: tempRange.start, end: day });
      }
      onChange({ start: tempRange.start, end: day });
      setIsOpen(false);
    }
  };

  const handleDayHover = (day: Date) => {
    if (tempRange.start && !tempRange.end) {
      setHoverDate(day);
    }
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    days.push({ date: d, isOtherMonth: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({ date: d, isOtherMonth: false });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({ date: d, isOtherMonth: true });
  }

  const isSelected = (date: Date) => {
    if (tempRange.start && isSameDay(date, tempRange.start)) return 'start';
    if (tempRange.end && isSameDay(date, tempRange.end)) return 'end';
    return false;
  };

  const isInRange = (date: Date) => {
    if (!tempRange.start || !tempRange.end) return false;
    return date > tempRange.start && date < tempRange.end;
  };

  const isHovered = (date: Date) => {
    if (!tempRange.start || tempRange.end || !hoverDate) return false;
    const start = tempRange.start;
    return (date > start && date <= hoverDate) || (date < start && date >= hoverDate);
  };

  // Compact display text
  const displayText = (() => {
    if (value.start && value.end) {
      const s = value.start;
      const e = value.end;
      const sameYear = s.getFullYear() === e.getFullYear();
      const sameMonth = s.getMonth() === e.getMonth();
      const sameDay = isSameDay(s, e);
      if (sameDay) {
        return formatDateFull(s);
      } else if (sameMonth && sameYear) {
        return `${formatDateShort(s)} – ${e.getDate()}, ${s.getFullYear()}`;
      } else if (sameYear) {
        return `${formatDateShort(s)} – ${formatDateShort(e)}, ${s.getFullYear()}`;
      } else {
        return `${formatDateFull(s)} – ${formatDateFull(e)}`;
      }
    }
    if (value.start) {
      return `${formatDateFull(value.start)} – ...`;
    }
    return placeholder;
  })();

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
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
        style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
      >
        <span className="truncate">{displayText}</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <Calendar className="h-4 w-4" />
        </span>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--primary)]">
          <Calendar className="h-4 w-4" />
        </span>
        {value.start && (
          <span
            className="absolute right-10 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            onClick={handleClear}
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="
            absolute z-50 mt-1.5
            left-0 min-w-full max-w-sm
            rounded-xl
            border border-[var(--color-border)]
            bg-[var(--card)]
            p-4
            shadow-xl
            animate-in fade-in-0 zoom-in-95
            origin-top-left
          "
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goToPrevMonth}
              className="p-1 hover:bg-[var(--elevated)] rounded-md transition"
            >
              <ChevronLeft className="h-4 w-4 text-[var(--text-muted)]" />
            </button>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-[var(--elevated)] rounded-md transition"
            >
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-[var(--text-muted)] py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map(({ date, isOtherMonth }) => {
              const day = date.getDate();
              const selected = isSelected(date);
              const inRange = isInRange(date);
              const hovered = isHovered(date);
              const isToday = isSameDay(date, today);

              let bgColor = 'hover:bg-[var(--elevated)]';
              let textColor = isOtherMonth ? 'text-[var(--text-muted)]/50' : 'text-[var(--text-secondary)]';
              let ring = '';
              let zIndex = '';

              if (selected === 'start' || selected === 'end') {
                bgColor = 'bg-[var(--primary)] hover:bg-[var(--primary-dark)]';
                textColor = 'text-white';
                ring = 'rounded-full';
                zIndex = 'z-10';
              } else if (inRange || hovered) {
                bgColor = 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20';
                textColor = 'text-[var(--text-primary)]';
              }

              if (isToday && !selected) {
                textColor = 'text-[var(--primary)]';
              }

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => handleDayHover(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  className={`
                    relative h-9 w-full flex items-center justify-center
                    text-sm font-medium
                    transition-colors duration-150
                    ${bgColor}
                    ${textColor}
                    ${ring}
                    ${zIndex}
                    hover:z-10
                  `}
                  disabled={disabled}
                >
                  {day}
                  {isToday && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-3 pt-2 border-t border-[var(--color-border)]">
            <button
              onClick={() => {
                onChange({ start: null, end: null });
                setTempRange({ start: null, end: null });
                setIsOpen(false);
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;