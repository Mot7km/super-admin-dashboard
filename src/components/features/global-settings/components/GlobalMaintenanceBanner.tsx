import { memo, useState, useEffect, type FC } from 'react';
import { Wrench, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../../../app/context/LanguageContext';

export const GlobalMaintenanceBanner: FC = memo(() => {
  const { locale } = useTranslation();
  const [isActive, setIsActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mot7km_maintenance_active') === 'true';
    } catch {
      return false;
    }
  });
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleMaintenanceChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsActive(customEvent.detail);
      setIsDismissed(false);
    };

    window.addEventListener('mot7km_maintenance_change', handleMaintenanceChange);
    return () => {
      window.removeEventListener('mot7km_maintenance_change', handleMaintenanceChange);
    };
  }, []);

  if (!isActive || isDismissed) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-semibold">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
          <Wrench className="h-3 w-3" />
          <span>HTTP 503</span>
        </div>

        <span className="font-bold">
          {locale === 'ar'
            ? 'تنبيه: وضع الصيانة المجدولة مفعّل حالياً للمنصة بالكامل!'
            : 'Alert: Platform-wide Scheduled Maintenance Mode is currently ACTIVE!'}
        </span>

        <span className="hidden md:inline-flex items-center gap-1 opacity-90 font-normal">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
          {locale === 'ar'
            ? 'استثناء المشرفين مفعّل (Admin Bypass Active)'
            : 'Super Admin Bypass Active'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/system/settings"
          className="underline hover:no-underline font-bold text-[11px] flex items-center gap-1 text-white hover:text-amber-100 transition-colors"
        >
          <span>{locale === 'ar' ? 'إدارة الإعدادات' : 'Configure'}</span>
          <ArrowRight className={`h-3 w-3 ${locale === 'ar' ? 'rotate-180' : ''}`} />
        </Link>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-md hover:bg-black/20 text-white/80 hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
});

GlobalMaintenanceBanner.displayName = 'GlobalMaintenanceBanner';
