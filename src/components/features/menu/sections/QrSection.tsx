import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Download, Share2, Upload, Check, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';

type QrSectionProps = {
  onDownloadQr?: () => void;
  onShareQr?: () => void;
};

const THEME_COLORS = ['#1683C7', '#0F766E', '#E11D48', '#D97706'];

export const QrSection = ({ onDownloadQr, onShareQr }: QrSectionProps) => {
  const { t } = useTranslation();

  const [qrValue] = useState('https://mot7km.com/dashboard');
  const [qrColor, setQrColor] = useState(THEME_COLORS[0]);
  const [logoUrl, setLogoUrl] = useState<string | null>('/assets/logo/Mot7km_Logo.png');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Download QR ──────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!qrContainerRef.current) {
      showToast('QR container not found', 'error');
      return;
    }

    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(qrContainerRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const images = doc.querySelectorAll('img');
          return Promise.all(
            Array.from(images).map(
              (img) =>
                new Promise((resolve) => {
                  if (img.complete) resolve(true);
                  else {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                  }
                })
            )
          );
        },
      });

      const link = document.createElement('a');
      link.download = 'mot7km-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast(t('menu.qr.downloadSuccess') || 'QR code downloaded!');
      if (onDownloadQr) onDownloadQr();
    } catch (error) {
      console.error('Download error:', error);
      showToast(t('menu.qr.downloadError') || 'Download failed. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  }, [t, onDownloadQr]);

  // ─── Share QR ────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!qrContainerRef.current) {
      showToast('QR container not found', 'error');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(qrContainerRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );
      const file = new File([blob], 'mot7km-qr.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: t('menu.qr.shareTitle') || 'Mot7km QR Code',
          text: t('menu.qr.shareText') || 'Scan this QR to visit Mot7km',
          files: [file],
        });
        showToast(t('menu.qr.shareSuccess') || 'Shared successfully!');
      } else {
        await navigator.clipboard.writeText(qrValue);
        showToast(t('menu.qr.copySuccess') || 'Link copied to clipboard!');
      }
      if (onShareQr) onShareQr();
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err);
        showToast(t('menu.qr.shareError') || 'Share failed', 'error');
      }
    }
  }, [t, qrValue, onShareQr]);

  // ─── Logo Upload ─────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo must be under 2MB', 'error');
      e.target.value = '';
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      showToast('Please upload a PNG, JPG, SVG, or WebP image', 'error');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setLogoUrl(ev.target.result as string);
        showToast(t('menu.qr.logoUpdated') || 'Logo updated successfully!');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read file', 'error');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    showToast(t('menu.qr.logoRemoved') || 'Logo removed');
  };

  // ─── Render QR (NO oklab colors - uses pure hex + rgba) ──────────
  const renderQrWithLogo = () => (
    <div className="relative inline-block">
      <QRCodeSVG
        value={qrValue}
        size={200}
        bgColor="#ffffff"
        fgColor={qrColor}
        level="H"
        includeMargin={false}
        imageSettings={
          logoUrl
            ? {
                src: logoUrl,
                height: 44,
                width: 44,
                excavate: true,
              }
            : undefined
        }
      />
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* ─── LEFT: QR Preview ────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--card)] p-6 sm:p-8 shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:shadow-black/10">
          {/* QR container - NO oklab, pure hex + rgba */}
          <div
            ref={qrContainerRef}
            className="relative rounded-3xl bg-white p-4 sm:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
            style={{
              background: '#ffffff',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex h-[180px] w-[180px] sm:h-[200px] sm:w-[200px] items-center justify-center rounded-2xl bg-white p-2 sm:p-3">
              {renderQrWithLogo()}
            </div>
            {/* Decorative glow - pure hex, no oklab */}
            <div
              className="absolute -inset-1 -z-10 rounded-3xl blur-2xl"
              style={{
                background: `rgba(22, 131, 199, 0.15)`,
              }}
            />
          </div>

          <div className="mt-5 sm:mt-6 text-center">
            <h3 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
              {t('menu.qr.title') || 'Your QR Code'}
            </h3>
            <p className="mt-1 break-all text-xs text-[var(--text-muted)] sm:text-sm">
              {qrValue}
            </p>
          </div>

          <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-dark)] hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:px-6 sm:py-3"
            >
              {isDownloading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>{t('menu.qr.downloading') || 'Downloading...'}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>{t('menu.qr.downloadBtn') || 'Download'}</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:text-[var(--text-primary)] hover:shadow-md hover:scale-[1.02] active:scale-95 sm:px-6 sm:py-3"
            >
              <Share2 className="h-4 w-4" />
              <span>{t('menu.qr.shareBtn') || 'Share'}</span>
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Branding Controls ────────────────────────────── */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 transition-all hover:shadow-2xl hover:shadow-black/10 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl">
            {t('menu.qr.brandingTitle') || 'Branding'}
          </h2>
          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
            {t('menu.qr.brandingSub') || 'Customize the look of your QR code'}
          </p>

          <div className="mt-6 space-y-8">
            {/* Theme Color */}
            <div>
              <label className="text-sm font-semibold text-[var(--text-secondary)]">
                {t('menu.qr.themeColor') || 'Theme Color'}
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setQrColor(color)}
                    className="relative h-10 w-10 cursor-pointer rounded-full transition-all hover:scale-110 focus:outline-none sm:h-10 sm:w-10"
                    style={{ backgroundColor: color }}
                  >
                    {qrColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                        <Check className="h-5 w-5" />
                      </span>
                    )}
                    <span
                      className={`absolute -inset-1 rounded-full transition-all ${
                        qrColor === color
                          ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--card)]'
                          : 'ring-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-sm font-semibold text-[var(--text-secondary)]">
                {t('menu.qr.logoLabel') || 'Logo'}
              </label>

              <div className="mt-3 overflow-hidden rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--primary)] hover:bg-[var(--background)]">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                  {/* Logo Preview */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 sm:h-16 sm:w-16">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Brand logo"
                        className="h-10 w-10 rounded-lg object-contain sm:h-12 sm:w-12"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-[var(--text-muted)] sm:h-6 sm:w-6" />
                    )}
                  </div>

                  {/* Logo Info */}
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {logoUrl
                        ? logoUrl.includes('data:')
                          ? 'Custom uploaded logo'
                          : 'Mot7km_Logo.png'
                        : 'No logo selected'}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {logoUrl ? 'PNG, JPG, SVG · max 2MB' : 'Upload a brand logo to embed'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-end">
                    {logoUrl && (
                      <button
                        onClick={handleRemoveLogo}
                        className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                      >
                        <X className="inline h-3.5 w-3.5" /> Remove
                      </button>
                    )}

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-sm dark:bg-[var(--surface)]"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {logoUrl ? 'Change' : 'Upload'}
                    </label>
                  </div>
                </div>

                {/* Status Badge */}
                {logoUrl && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-border)] pt-3 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {t('menu.qr.primaryBadge') || 'Primary Logo'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ✓ Embedded in QR
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 w-auto max-w-[92vw] -translate-x-1/2 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:max-w-[90vw]">
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-2xl sm:px-6 sm:py-4 ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]'
                : 'bg-gradient-to-r from-rose-500 to-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default QrSection;