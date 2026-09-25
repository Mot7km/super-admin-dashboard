import type { FC } from 'react';
import { useTranslation } from '../../../app/context/LanguageContext';
import { Sparkles, Shield, ArrowUpRight, Search, Filter } from 'lucide-react';

type GenericModulePageProps = {
  titleKey: string;
  descriptionKey?: string;
  category: string;
};

export const GenericModulePage: FC<GenericModulePageProps> = ({ titleKey, descriptionKey, category }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-pill border border-primary/20">
              {category}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ {t(titleKey)}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {t(titleKey)}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm mt-1">
            {descriptionKey ? t(descriptionKey) : `إدارة ومراقبة قسم ${t(titleKey)} في منظومة متحكم المركزية.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث في البيانات..."
              className="rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-xs font-medium text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary transition"
          >
            <Filter className="h-4 w-4" />
            <span>فلترة</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-ambient">
          <span className="text-xs font-medium text-muted-foreground">الحالة التشغيلية</span>
          <div className="text-xl font-bold mt-2 flex items-center gap-2 text-success-text">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span>نشط ومتصل</span>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-ambient">
          <span className="text-xs font-medium text-muted-foreground">السجلات المفهرسة</span>
          <div className="text-xl font-bold mt-2 text-foreground">
            ١,٢٤٠ <span className="text-xs text-muted-foreground font-normal">سجل</span>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 rounded-2xl border border-border shadow-ambient">
          <span className="text-xs font-medium text-muted-foreground">مستوى الأمان والصلاحيات</span>
          <div className="text-xl font-bold mt-2 flex items-center gap-1.5 text-primary">
            <Shield className="h-4 w-4" />
            <span>Root Admin Only</span>
          </div>
        </div>
      </div>

      {/* Main Container Placeholder */}
      <div className="bg-card rounded-3xl border border-border p-8 text-center space-y-4 shadow-ambient">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto ring-1 ring-primary/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          لوحة {t(titleKey)}
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          هذه الوحدة مربوطة الآن بهيكل التنقل الرئيسي لمنصة المشرف العام. سيتم ربط الـ API والعمليات المباشرة في التحديثات القادمة.
        </p>
      </div>
    </div>
  );
};

export default GenericModulePage;
