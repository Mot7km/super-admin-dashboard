import { Globe, Moon, Shield, Sun } from 'lucide-react';

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
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1.5 ring-1 ring-primary/20 shadow-sm">
          <img src="/assets/logo/Mot7km_Logo.png" alt="Mot7km Logo" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-foreground">{brand}</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-pill bg-primary/10 text-primary border border-primary/20">
              <Shield className="h-3 w-3" />
              Super Admin
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">{slogan}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="theme toggle"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm hover:border-primary hover:text-foreground transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          <span className="hidden sm:inline">Theme</span>
        </button>

        <button
          onClick={onToggleLocale}
          aria-label="language toggle"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm hover:border-primary hover:text-foreground transition cursor-pointer"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span>{otherLanguage}</span>
        </button>
      </div>
    </header>
  );
};

export default LoginHeader;