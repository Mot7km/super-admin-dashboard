import type { FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Terminal } from 'lucide-react';

type LoginFormPanelProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  socialLoading: 'google' | 'facebook' | null;
  errorMessage: string;
  locale: 'ar' | 'en';
  superAdminBadge: string;
  welcomeTitle: string;
  subtitle: string;
  loginWithGoogle: string;
  loginWithFacebook: string;
  orDivider: string;
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
  onSocialLogin: (provider: 'google' | 'facebook') => void;
  onForgotPassword: () => void;
  onFillDemo: (demoEmail: string, roleName: string) => void;
  showPassword: boolean;
};

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
    />
    <path
      fill="#FBBC05"
      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LoginFormPanel = ({
  email,
  password,
  rememberMe,
  isLoading,
  socialLoading,
  errorMessage,
  locale,
  superAdminBadge,
  welcomeTitle,
  subtitle,
  loginWithGoogle,
  loginWithFacebook,
  orDivider,
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
  onSocialLogin,
  onForgotPassword,
  onFillDemo,
  showPassword,
}: LoginFormPanelProps) => {
  return (
    <div className="w-full max-w-md space-y-5">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-ambient space-y-6 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle glowing accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

        {/* Super Admin Status Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>{superAdminBadge}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {welcomeTitle}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-destructive/20 bg-destructive-bg p-3 text-xs font-semibold text-destructive-text text-center animate-fade-in">
            {errorMessage}
          </div>
        )}

        {/* Social SSO Buttons (Google & Facebook) */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isLoading || socialLoading !== null}
            onClick={() => onSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-surface hover:bg-surface-subtle py-2.5 px-4 text-xs font-bold text-foreground transition-all duration-200 hover:border-primary/40 hover:shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {socialLoading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <GoogleIcon />
            )}
            <span>{loginWithGoogle}</span>
          </button>

          <button
            type="button"
            disabled={isLoading || socialLoading !== null}
            onClick={() => onSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-surface hover:bg-surface-subtle py-2.5 px-4 text-xs font-bold text-foreground transition-all duration-200 hover:border-[#1877F2]/40 hover:shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {socialLoading === 'facebook' ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#1877F2]" />
            ) : (
              <FacebookIcon />
            )}
            <span>{loginWithFacebook}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative bg-card px-3 text-[11px] font-medium text-muted-foreground">
            {orDivider}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{emailLabel}</span>
              <span className="text-[10px] text-muted-foreground font-mono">root / privileged</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder={emailPlaceholder}
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-xs font-medium text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">{passwordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder={passwordPlaceholder}
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-10 text-xs font-medium text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                aria-label="toggle password visibility"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => onToggleRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">{rememberLabel}</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="font-semibold text-primary hover:underline bg-transparent border-0 p-0 cursor-pointer text-xs"
            >
              {forgotLabel}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || socialLoading !== null}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
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

        {/* Quick Super Admin Demo Accounts */}
        <div className="pt-4 border-t border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              {demoAccountLabel}
            </span>
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-pill">
              1-Click Fill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onFillDemo('superadmin@mot7km.com', ownerDemoLabel)}
              className="rounded-xl border border-border bg-surface p-2.5 text-left transition hover:border-primary hover:bg-surface-subtle cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                  {ownerDemoLabel}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  ROOT
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">superadmin@mot7km.com</div>
            </button>

            <button
              type="button"
              onClick={() => onFillDemo('ops@mot7km.com', managerDemoLabel)}
              className="rounded-xl border border-border bg-surface p-2.5 text-left transition hover:border-primary hover:bg-surface-subtle cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                  {managerDemoLabel}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  OPS
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">ops@mot7km.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormPanel;