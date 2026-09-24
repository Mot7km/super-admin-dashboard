// src/ui/TimeRangePicker.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

// ----- Internal Slider Component (same logic) -----
type TimeRangeSliderProps = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  disabled?: boolean;
};

const TimeRangeSlider: React.FC<TimeRangeSliderProps> = ({
  from,
  to,
  onChange,
  disabled = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'from' | 'to' | null>(null);

  const toMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes: number): string => {
    const wrapped = ((minutes % 1440) + 1440) % 1440;
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const fromMinutes = toMinutes(from);
  const toMinutesVal = toMinutes(to);
  const totalMinutes = 24 * 60;
  const clamp = (val: number) => Math.max(0, Math.min(totalMinutes - 1, val));

  const fromPercent = (fromMinutes / totalMinutes) * 100;
  const toPercent = (toMinutesVal / totalMinutes) * 100;

  const handleMouseDown = (handle: 'from' | 'to') => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleTouchStart = (handle: 'from' | 'to') => (e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(handle);
  };

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    if ('touches' in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = getClientX(e);
      const percent = clamp(((clientX - rect.left) / rect.width) * 100);
      const minutes = Math.round((percent / 100) * totalMinutes);
      const clampedMinutes = clamp(minutes);
      const newTime = toTime(clampedMinutes);

      if (isDragging === 'from') {
        onChange(newTime, to);
      } else {
        onChange(from, newTime);
      }
    },
    [isDragging, from, to, onChange]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  // Click on track -> move nearest handle
  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = clamp(((e.clientX - rect.left) / rect.width) * 100);
    const minutes = Math.round((percent / 100) * totalMinutes);
    const clampedMinutes = clamp(minutes);
    const newTime = toTime(clampedMinutes);

    const currentFrom = toMinutes(from);
    const currentTo = toMinutes(to);
    const distFrom = Math.abs(clampedMinutes - currentFrom);
    const distTo = Math.abs(clampedMinutes - currentTo);

    if (distFrom <= distTo) {
      onChange(newTime, to);
    } else {
      onChange(from, newTime);
    }
  };

  const renderFilledSegments = () => {
    if (fromPercent <= toPercent) {
      return (
        <div
          className="absolute h-full rounded-full bg-[var(--primary)] pointer-events-none"
          style={{ left: `${fromPercent}%`, width: `${toPercent - fromPercent}%` }}
        />
      );
    } else {
      return (
        <>
          <div
            className="absolute h-full rounded-l-full bg-[var(--primary)] pointer-events-none"
            style={{ left: `${fromPercent}%`, width: `${100 - fromPercent}%` }}
          />
          <div
            className="absolute h-full rounded-r-full bg-[var(--primary)] pointer-events-none"
            style={{ left: '0%', width: `${toPercent}%` }}
          />
        </>
      );
    }
  };

  return (
    <div className="w-full select-none">
      <div className="flex justify-between text-xs font-medium text-[var(--text-muted)] mb-1.5">
        <span>{from}</span>
        <span>{to}</span>
      </div>

      <div
        ref={trackRef}
        className="relative h-2 w-full rounded-full bg-[var(--elevated)] cursor-pointer touch-none"
        onClick={handleTrackClick}
      >
        {renderFilledSegments()}

        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[var(--primary)] shadow-md transition-transform ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{ left: `calc(${fromPercent}% - 8px)` }}
          onMouseDown={handleMouseDown('from')}
          onTouchStart={handleTouchStart('from')}
        />

        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[var(--primary)] shadow-md transition-transform ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{ left: `calc(${toPercent}% - 8px)` }}
          onMouseDown={handleMouseDown('to')}
          onTouchStart={handleTouchStart('to')}
        />
      </div>

      <div className="flex justify-between text-[10px] font-medium text-[var(--text-muted)] mt-1">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
};

// ----- Main Picker (with compact mode) -----
type TimeRangePickerProps = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  disabled?: boolean;
  compact?: boolean;   // default true
  className?: string;
};

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  from,
  to,
  onChange,
  disabled = false,
  compact = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Expanded mode – render slider inline
  if (!compact) {
    return (
      <div className={className}>
        <TimeRangeSlider from={from} to={to} onChange={onChange} disabled={disabled} />
      </div>
    );
  }

  // Compact mode – button + popover
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 rounded-md border border-[var(--color-border)] 
          bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--text-primary)]
          hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
          transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[var(--text-muted)]" />
          <span>{from} – {to}</span>
        </span>
        <span className="text-[var(--text-muted)] text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--card)] p-4 shadow-xl">
          <TimeRangeSlider
            from={from}
            to={to}
            onChange={(newFrom, newTo) => {
              onChange(newFrom, newTo);
              // keep open (user clicks "Done" to close)
            }}
            disabled={disabled}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-[var(--primary)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--primary)]/80 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangePicker;