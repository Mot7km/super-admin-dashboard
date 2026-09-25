import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/context/AuthContext';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useTheme } from '../../../../app/context/ThemeContext';
import { useToast } from '../../common/Toast';
import LoginFooter from './sections/LoginFooter';
import LoginFormPanel from './sections/LoginFormPanel';
import LoginHeader from './sections/LoginHeader';

const LoginDashboard = () => {
  const { t, locale, toggleLocale } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage(t('login.fillRequired'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(email);
      showToast(t('common.success'), 'success');
      navigate('/');
    }, 700);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    setErrorMessage('');

    setTimeout(() => {
      setSocialLoading(null);
      const socialEmail = provider === 'google' 
        ? 'admin.google@mot7km.com' 
        : 'admin.facebook@mot7km.com';
      
      login(socialEmail);
      showToast(
        locale === 'ar' 
          ? `تم تسجيل الدخول بنجاح عبر ${provider === 'google' ? 'Google' : 'Facebook'}`
          : `Signed in successfully via ${provider === 'google' ? 'Google' : 'Facebook'} SSO`,
        'success'
      );
      navigate('/');
    }, 900);
  };

  const handleFillDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('superadmin2025');
    setErrorMessage('');
    showToast(`${roleName} demo credentials loaded`, 'info');
  };

  return (
    <div className="min-h-screen w-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden font-sans transition-colors duration-300">
      <LoginHeader
        brand={t('layout.brand')}
        slogan={t('layout.slogan')}
        theme={theme}
        otherLanguage={t('layout.otherLanguage')}
        onToggleTheme={toggleTheme}
        onToggleLocale={toggleLocale}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 max-w-lg mx-auto w-full my-auto animate-fade-in">
        <LoginFormPanel
          email={email}
          password={password}
          rememberMe={rememberMe}
          isLoading={isLoading}
          socialLoading={socialLoading}
          errorMessage={errorMessage}
          locale={locale}
          superAdminBadge={t('login.superAdminBadge')}
          welcomeTitle={t('login.welcomeBack')}
          subtitle={t('login.subtitle')}
          loginWithGoogle={t('login.loginWithGoogle')}
          loginWithFacebook={t('login.loginWithFacebook')}
          orDivider={t('login.orDivider')}
          emailLabel={t('login.emailLabel')}
          emailPlaceholder={t('login.emailPlaceholder')}
          passwordLabel={t('login.passwordLabel')}
          passwordPlaceholder={t('login.passwordPlaceholder')}
          rememberLabel={t('login.rememberMe')}
          forgotLabel={t('login.forgotPassword')}
          submitLabel={t('login.submitButton')}
          signingInLabel={t('login.signingIn')}
          demoAccountLabel={t('login.demoAccount')}
          ownerDemoLabel={t('login.ownerDemo')}
          managerDemoLabel={t('login.managerDemo')}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword((value) => !value)}
          onToggleRemember={setRememberMe}
          onSubmit={handleSubmit}
          onSocialLogin={handleSocialLogin}
          onForgotPassword={() => showToast(`${t('login.forgotPassword')} (Sent reset link to security inbox)`, 'info')}
          onFillDemo={handleFillDemo}
          showPassword={showPassword}
        />
      </main>

      <LoginFooter />
    </div>
  );
};

export default LoginDashboard;