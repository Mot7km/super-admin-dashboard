import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';

type LoginFormPanelProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  errorMessage: string;
  locale: 'ar' | 'en';
  welcomeTitle: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  rememberLabel: string;
  forgotLabel: string;
  submitLabel: string;
  signingInLabel: string;
  demoAccountLabel: string;
  ownerDemoLabel: string;
  managerDemoLabel: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleRemember: (checked: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
  onFillDemo: (demoEmail: string, roleName: string) => void;
  showPassword: boolean;
};

const LoginFormPanel = ({
  email,
  password,
  rememberMe,
  isLoading,
  errorMessage,
  locale,
  welcomeTitle,
  subtitle,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  rememberLabel,
  forgotLabel,
  submitLabel,
  signingInLabel,
  demoAccountLabel,
  ownerDemoLabel,
  managerDemoLabel,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onToggleRemember,
  onSubmit,
  onForgotPassword,
  onFillDemo,
  showPassword,
}: LoginFormPanelProps) => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--card)] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">{welcomeTitle}</h1>
          <p className="text-xs text-[var(--text-muted)] sm:text-sm">{subtitle}</p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{emailLabel}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder={emailPlaceholder}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{passwordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder={passwordPlaceholder}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--surface)] py-3 pl-10 pr-10 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                aria-label="toggle password visibility"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => onToggleRemember(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-0 cursor-pointer"
              />
              <span>{rememberLabel}</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-[var(--primary)] hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              {forgotLabel}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:bg-[var(--primary-dark)] active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{signingInLabel}</span>
              </div>
            ) : (
              <>
                <span>{submitLabel}</span>
                {locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] block text-center">
            {demoAccountLabel}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onFillDemo('owner@mot7km.store', ownerDemoLabel)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--card)] p-2 text-left transition hover:border-[var(--primary)] hover:bg-[var(--elevated)] cursor-pointer"
            >
              <div className="font-bold text-[var(--text-primary)]">{ownerDemoLabel}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">owner@mot7km.store</div>
            </button>
            <button
              type="button"
              onClick={() => onFillDemo('manager@mot7km.store', managerDemoLabel)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--card)] p-2 text-left transition hover:border-[var(--primary)] hover:bg-[var(--elevated)] cursor-pointer"
            >
              <div className="font-bold text-[var(--text-primary)]">{managerDemoLabel}</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono">manager@mot7km.store</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormPanel;