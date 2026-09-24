import { Globe, Moon, Sun } from 'lucide-react';

type LoginHeaderProps = {
  brand: string;
  slogan: string;
  theme: 'light' | 'dark';
  otherLanguage: string;
  onToggleTheme: () => void;
  onToggleLocale: () => void;
};

const LoginHeader = ({ brand, slogan, theme, otherLanguage, onToggleTheme, onToggleLocale }: LoginHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 p-1.5 ring-1 ring-[var(--primary)]/20">
          <img src="/assets/logo/Mot7km_Logo.png" alt="Mot7km Logo" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">{brand}</span>
          <span className="text-[10px] font-medium text-[var(--text-muted)]">{slogan}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="theme toggle"
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm hover:border-[var(--primary)] hover:text-[var(--text-primary)] transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          <span className="hidden sm:inline">Theme</span>
        </button>

        <button
          onClick={onToggleLocale}
          aria-label="language toggle"
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm hover:border-[var(--primary)] hover:text-[var(--text-primary)] transition cursor-pointer"
        >
          <Globe className="h-4 w-4 text-[var(--primary)]" />
          <span>{otherLanguage}</span>
        </button>
      </div>
    </header>
  );
};

export default LoginHeader;