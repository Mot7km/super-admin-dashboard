import { useState, type FC } from 'react';
import {
  Smartphone,
  Monitor,
  Mail,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import type { NotificationType } from '../notification.types';

type LiveDevicePreviewProps = {
  title: string;
  message: string;
  type: NotificationType;
  actionButton?: {
    label: string;
    url: string;
  };
};

export const LiveDevicePreview: FC<LiveDevicePreviewProps> = ({
  title,
  message,
  type,
  actionButton,
}) => {
  const { t } = useTranslation();
  const [previewMode, setPreviewMode] = useState<'mobile' | 'in_app' | 'email'>('mobile');

  const displayTitle = title.trim() || 'Notification Title';
  const displayMessage = message.trim() || 'Your broadcast message preview will appear here in real-time as you compose...';

  const getTypeStyle = () => {
    switch (type) {
      case 'maintenance':
        return {
          badge: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          accent: 'border-l-4 border-amber-500',
        };
      case 'security_alert':
        return {
          badge: 'bg-rose-500/20 text-rose-500 border-rose-500/30',
          icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
          accent: 'border-l-4 border-rose-500',
        };
      case 'system_update':
        return {
          badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          icon: <Info className="h-4 w-4 text-cyan-400" />,
          accent: 'border-l-4 border-cyan-500',
        };
      case 'promotional':
        return {
          badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: <CheckCircle2 className="h-4 w-4 text-purple-400" />,
          accent: 'border-l-4 border-purple-500',
        };
      case 'general_info':
      default:
        return {
          badge: 'bg-primary/20 text-primary border-primary/30',
          icon: <Bell className="h-4 w-4 text-primary" />,
          accent: 'border-l-4 border-primary',
        };
    }
  };

  const currentStyle = getTypeStyle();

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-4 sm:p-5 flex flex-col h-full shadow-lg">
      {/* Device Mode Switcher */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/70 mb-4">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Monitor className="h-4 w-4 text-primary" />
          {t('notifications.preview.studioTitle')}
        </span>

        <div className="flex items-center rounded-xl bg-surface-subtle p-0.5 border border-border text-xs">
          <button
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              previewMode === 'mobile'
                ? 'bg-card text-foreground shadow-2xs font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode('in_app')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              previewMode === 'in_app'
                ? 'bg-card text-foreground shadow-2xs font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="h-3 w-3" />
            <span>In-App</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewMode('email')}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
              previewMode === 'email'
                ? 'bg-card text-foreground shadow-2xs font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="h-3 w-3" />
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* Screen Container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-surface-subtle/50 rounded-2xl border border-border/60">
        {/* 1. Mobile Push Preview */}
        {previewMode === 'mobile' && (
          <div className="w-full max-w-[320px] rounded-[36px] border-4 border-slate-700 bg-slate-950 p-4 shadow-2xl text-slate-100 flex flex-col items-center">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mb-6" />

            <div className="text-[11px] font-mono text-slate-400 mb-6">
              Friday, September 26 • 09:41
            </div>

            {/* Push Notification Card */}
            <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-700/80 p-3.5 backdrop-blur-md shadow-lg animate-fadeIn text-left rtl:text-right">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px]">
                    M
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">Mot7km ERP POS</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">now</span>
              </div>

              <h5 className="text-xs font-bold text-slate-100 mb-0.5 line-clamp-1">
                {displayTitle}
              </h5>
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                {displayMessage}
              </p>
            </div>

            {/* Bottom Indicator */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mt-10 mb-1" />
          </div>
        )}

        {/* 2. In-App Announcement Banner / Modal Preview */}
        {previewMode === 'in_app' && (
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-fadeIn text-left rtl:text-right">
            {/* Simulated App Topbar */}
            <div className="p-3 border-b border-border bg-card/90 flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Al-Ahram Hospitality Console</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-subtle font-mono text-muted-foreground">
                Tenant View
              </span>
            </div>

            {/* Notification Sticky Alert */}
            <div className={`p-4 bg-surface-subtle/80 ${currentStyle.accent}`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-card border border-border shrink-0">
                  {currentStyle.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">{displayTitle}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full uppercase font-bold border ${currentStyle.badge}`}>
                      {type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {displayMessage}
                  </p>

                  {actionButton?.label && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-default"
                    >
                      <span>{actionButton.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Branded Email Card Preview */}
        {previewMode === 'email' && (
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-fadeIn text-left rtl:text-right">
            {/* Email Header */}
            <div className="p-4 bg-gradient-to-r from-primary/90 via-primary to-primary/80 text-primary-foreground flex items-center justify-between">
              <span className="font-black text-sm tracking-wider">MOT7KM CLOUD ERP</span>
              <span className="text-[10px] font-mono bg-primary-foreground/20 px-2 py-0.5 rounded-full font-bold">
                Platform Alert
              </span>
            </div>

            {/* Email Body */}
            <div className="p-5 space-y-3.5 text-xs text-foreground">
              <div className="font-mono text-muted-foreground text-[11px]">
                To: <span className="text-foreground font-bold">business.owner@tenant.com</span>
              </div>

              <h4 className="text-sm font-bold text-foreground border-b border-border/70 pb-2">
                {displayTitle}
              </h4>

              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {displayMessage}
              </p>

              {actionButton?.label && (
                <div className="pt-2">
                  <div className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs text-center shadow-md">
                    {actionButton.label}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border/60 text-[10px] text-muted-foreground font-mono">
                You received this mandatory operational broadcast because your business is hosted on the Mot7km ERP Platform.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
