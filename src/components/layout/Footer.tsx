import { useTranslation } from '../../../app/context/LanguageContext';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--surface)] px-4 py-4 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      {/* Brand & Slogan */}
      <div className="flex items-center gap-2.5">
        <img
          src="/assets/logo/Mot7km_Logo.png"
          alt="Mot7km Logo"
          className="h-5 w-auto object-contain"
        />
        <span className="font-bold text-[var(--text-primary)]">{t('layout.brand')}</span>
        <span className="text-[var(--text-muted)]">•</span>
        <span className="font-medium text-[var(--text-secondary)]">{t('layout.slogan')}</span>
      </div>

      {/* Center / Right Links */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        {/* System Uptime Badge */}
        <div className="flex items-center gap-1.5 font-medium text-emerald-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>All Systems Operational</span>
        </div>

        <span className="text-[var(--text-muted)]">•</span>

        {/* Mot7km Website Link */}
        <a
          href="https://www.mot7km.store"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline transition cursor-pointer"
        >
          <span>{t('layout.officialWebsite')}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;