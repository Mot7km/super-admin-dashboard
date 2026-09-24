import { useTranslation } from '../../../../../app/context/LanguageContext';
import { QrCode, X } from 'lucide-react';

type AttendanceQrModalProps = {
  onClose: () => void;
};

const AttendanceQrModal = ({ onClose }: AttendanceQrModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-6 shadow-2xl space-y-4 text-center">
        <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
          <h3 className="font-bold text-sm text-[var(--text-primary)]">{t('employees.qrModalTitle')}</h3>
          <button onClick={onClose} className="cursor-pointer">
            <X className="h-5 w-5 text-[var(--text-muted)]" />
          </button>
        </div>
        <div className="p-6 bg-slate-900 rounded-xl inline-block text-white">
          <QrCode className="h-32 w-32 mx-auto" />
        </div>
        <p className="text-xs text-[var(--text-muted)]">{t('employees.qrModalSub')}</p>
      </div>
    </div>
  );
};

export default AttendanceQrModal;
