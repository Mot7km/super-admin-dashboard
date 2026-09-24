import { useState } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import ConfirmDialog from '../../common/ConfirmDialog';
import { Plus, Store, Clock, ShieldCheck } from 'lucide-react';
import BranchesLocationsTab from './sections/BranchesLocationsTab';
import BranchesMatrixTab from './sections/BranchesMatrixTab';
import BranchesHoursTab from './sections/BranchesHoursTab';
import AddBranchModal from './components/AddBranchModal';
import { initialBranches, initialMatrix } from './branches.constants';

const BranchesDashboard = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'locations' | 'matrix' | 'hours'>('locations');
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [deleteBranchId, setDeleteBranchId] = useState<string | null>(null);

  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');

  const [branches, setBranches] = useState(initialBranches);
  const [matrix, setMatrix] = useState(initialMatrix);

  const toggleMatrix = (idx: number, branchKey: 'mainBranch' | 'mallBranch') => {
    const updated = [...matrix];
    updated[idx][branchKey] = !updated[idx][branchKey];
    setMatrix(updated);
    showToast(t('common.success'), 'info');
  };

  const handleAddBranch = () => {
    if (!branchName.trim()) return;
    setBranches([
      ...branches,
      {
        id: `b-${Date.now()}`,
        name: branchName,
        status: 'Operational',
        statusColor: 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20',
        address: branchAddress || 'Branch Address, Cairo',
        phone: branchPhone || '+20 100 000 0000',
        hours: '10:00 AM - 12:00 AM',
        todaySales: '$0',
        activeCashiers: 1,
        topDishKey: 'dashboard.products.truffleBurger',
      },
    ]);
    setBranchName('');
    setBranchAddress('');
    setBranchPhone('');
    setShowAddBranchModal(false);
    showToast(t('common.success'), 'success');
  };

  const handleConfirmDeleteBranch = () => {
    if (!deleteBranchId) return;
    setBranches(branches.filter((branch) => branch.id !== deleteBranchId));
    setDeleteBranchId(null);
    showToast(t('common.success'), 'info');
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl break-words">
            {t('branches.title')}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--text-muted)] sm:text-sm break-words">
            {t('branches.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowAddBranchModal(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{t('branches.addBtn')}</span>
        </button>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────── */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1 hide-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[var(--color-border)] pb-2 min-w-max">
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--elevated)]'
            }`}
          >
            <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('branches.tabs.locations')}</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--elevated)]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('branches.tabs.availabilityMatrix')}</span>
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === 'hours'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text-secondary)] hover:bg-[var(--elevated)]'
            }`}
          >
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{t('branches.tabs.workingHours')}</span>
          </button>
        </div>
      </div>

      {/* ─── Tab Content ───────────────────────────────────────────── */}
      {activeTab === 'locations' && (
        <BranchesLocationsTab
          branches={branches}
          onDeleteBranch={(id) => setDeleteBranchId(id)}
          onEditBranch={() => showToast(t('common.edit'), 'info')}
        />
      )}
      {activeTab === 'matrix' && <BranchesMatrixTab matrix={matrix} onToggleMatrix={toggleMatrix} />}
      {activeTab === 'hours' && <BranchesHoursTab />}

      {/* ─── Modals ────────────────────────────────────────────────── */}
      <AddBranchModal
        open={showAddBranchModal}
        branchName={branchName}
        branchAddress={branchAddress}
        branchPhone={branchPhone}
        onBranchNameChange={setBranchName}
        onBranchAddressChange={setBranchAddress}
        onBranchPhoneChange={setBranchPhone}
        onClose={() => setShowAddBranchModal(false)}
        onSave={handleAddBranch}
      />

      <ConfirmDialog
        isOpen={!!deleteBranchId}
        title={t('common.delete')}
        message="Are you sure you want to delete this branch?"
        onConfirm={handleConfirmDeleteBranch}
        onCancel={() => setDeleteBranchId(null)}
      />
    </div>
  );
};

export default BranchesDashboard;