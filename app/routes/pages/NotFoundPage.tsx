import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { Home, AlertTriangle, Compass } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[var(--color-background)] p-4">
      {/* Decorative Orbs */}
      <div className="orb orb-primary absolute -left-20 -top-20 h-64 w-64 animate-orb-1" />
      <div className="orb orb-accent absolute -bottom-20 -right-20 h-80 w-80 animate-orb-2" />

      {/* Main Card */}
      <div className="glass-card relative z-10 mx-auto max-w-2xl rounded-2xl p-8 text-center shadow-xl sm:p-12">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
            <Compass className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
        </div>

        {/* 404 with gradient zero */}
        <div className="text-7xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-8xl">
          4
          <span className="gradient-text mx-1">0</span>
          4
        </div>

        {/* Title & Description */}
        <h1 className="mt-4 text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl">
          {t('notFound.title')}
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          {t('notFound.description')}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-on-primary)] transition hover:opacity-90 hover:shadow-glow-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            {t('notFound.action')}
          </Link>
          <Link
            to="/mock"
            className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-primary)] hover:shadow-md"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t('notFound.secondaryAction') || 'Go to Mock'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;