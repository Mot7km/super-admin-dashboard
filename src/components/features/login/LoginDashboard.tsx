import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/context/AuthContext';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useTheme } from '../../../../app/context/ThemeContext';
import { useToast } from '../../common/Toast';
import LoginFooter from './sections/LoginFooter';
import LoginFormPanel from './sections/LoginFormPanel';
import LoginHeader from './sections/LoginHeader';
import LoginShowcasePanel from './components/LoginShowcasePanel';

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
    }, 800);
  };

  const handleFillDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('mot7km2025');
    setErrorMessage('');
    showToast(`${roleName} Demo Loaded`, 'info');
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col justify-between overflow-x-hidden font-sans transition-colors duration-300">
      <LoginHeader
        brand={t('layout.brand')}
        slogan={t('layout.slogan')}
        theme={theme}
        otherLanguage={t('layout.otherLanguage')}
        onToggleTheme={toggleTheme}
        onToggleLocale={toggleLocale}
      />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <LoginFormPanel
              email={email}
              password={password}
              rememberMe={rememberMe}
              isLoading={isLoading}
              errorMessage={errorMessage}
              locale={locale}
              welcomeTitle={t('login.welcomeBack')}
              subtitle={t('login.subtitle')}
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
              onForgotPassword={() => showToast(`${t('login.forgotPassword')} demo link`, 'info')}
              onFillDemo={handleFillDemo}
              showPassword={showPassword}
            />
          </div>

          <LoginShowcasePanel
            badge={t('login.showcase.badge')}
            featureTitle={t('login.featureTitle')}
            featureSub={t('login.featureSub')}
            qrViewsTitle={t('login.showcase.qrViewsTitle')}
            qrViewsGrowth={t('login.showcase.qrViewsGrowth')}
            ratingTitle={t('login.showcase.ratingTitle')}
            ratingBadge={t('login.showcase.ratingBadge')}
            kitchenTitle={t('login.showcase.kitchenTitle')}
            kitchenSub={t('login.showcase.kitchenSub')}
            kitchenBadge={t('login.showcase.kitchenBadge')}
          />
        </div>
      </main>

      <LoginFooter />
    </div>
  );
};

export default LoginDashboard;