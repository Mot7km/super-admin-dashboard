import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../common/Toast';
import { mockBusinesses } from './businesses.mock';
import type {
  Business,
  BusinessActionModalState,
  BusinessFilterState,
  BusinessPlan,
} from './businesses.types';

import BusinessListHeader from './components/BusinessListHeader';
import BusinessFilterBar from './components/BusinessFilterBar';
import BusinessTable from './components/BusinessTable';
import BusinessGrid from './components/BusinessGrid';
import BusinessPagination from './components/BusinessPagination';
import BusinessDetailView from './components/BusinessDetailView';
import BusinessActionModals from './components/BusinessActionModals';

const DEFAULT_FILTERS: BusinessFilterState = {
  search: '',
  status: 'all',
  plan: 'all',
  dateRange: 'all',
  sortBy: 'mrr_desc',
  page: 1,
  pageSize: 10,
  viewMode: 'table',
};

const BusinessesDashboard = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // All businesses state (supports live mutations)
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);

  // Filters state
  const [filters, setFilters] = useState<BusinessFilterState>(DEFAULT_FILTERS);

  // Modal action state
  const [modalState, setModalState] = useState<BusinessActionModalState>(null);

  // Filter mutation helper
  const handleFilterChange = useCallback(
    <K extends keyof BusinessFilterState>(key: K, value: BusinessFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === 'pageSize' || key === 'search' || key === 'status' || key === 'plan' ? 1 : prev.page,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filtered & Sorted Businesses
  const filteredBusinesses = useMemo(() => {
    let result = [...businesses];

    // 1. Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.subdomain.toLowerCase().includes(q) ||
          b.owner.name.toLowerCase().includes(q) ||
          b.owner.email.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.crNumber.includes(q) ||
          b.id.toLowerCase().includes(q),
      );
    }

    // 2. Status filter
    if (filters.status !== 'all') {
      result = result.filter((b) => b.status === filters.status);
    }

    // 3. Plan filter
    if (filters.plan !== 'all') {
      result = result.filter((b) => b.plan === filters.plan);
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'mrr_desc':
          return b.mrr - a.mrr;
        case 'mrr_asc':
          return a.mrr - b.mrr;
        case 'created_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'orders_desc':
          return b.ordersCount - a.ordersCount;
        case 'storage_desc':
          return b.storageUsedGb - a.storageUsedGb;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [businesses, filters.search, filters.status, filters.plan, filters.sortBy]);

  // Aggregate category counts for presets
  const statusCounts = useMemo(
    () => ({
      all: businesses.length,
      active: businesses.filter((b) => b.status === 'active').length,
      enterprise: businesses.filter((b) => b.plan === 'Enterprise').length,
      trial: businesses.filter((b) => b.status === 'trial').length,
      suspended: businesses.filter((b) => b.status === 'suspended' || b.status === 'disabled').length,
    }),
    [businesses],
  );

  // Total MRR of current filtered results
  const totalFilteredMrr = useMemo(
    () => filteredBusinesses.reduce((sum, b) => sum + b.mrr, 0),
    [filteredBusinesses],
  );

  // Paginated slice
  const paginatedBusinesses = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredBusinesses.slice(start, start + filters.pageSize);
  }, [filteredBusinesses, filters.page, filters.pageSize]);

  const totalPages = Math.ceil(filteredBusinesses.length / filters.pageSize) || 1;

  // Selected single business for Detail View
  const selectedBusiness = useMemo(() => {
    if (!id) return null;
    return businesses.find((b) => b.id === id) || null;
  }, [id, businesses]);

  // Handle Action Modal Success
  const handleModalConfirmSuccess = (actionType: string, targetBiz: Business, details?: string) => {
    switch (actionType) {
      case 'impersonated':
        showToast(`Root session elevated to tenant: ${targetBiz.name}`, 'info');
        break;
      case 'plan_changed':
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === targetBiz.id
              ? {
                  ...b,
                  plan: (details?.split('to ')[1] as BusinessPlan) || b.plan,
                  auditLogs: [
                    {
                      id: `log-${Date.now()}`,
                      action: 'Plan Modified by Super Admin',
                      actor: 'Root Admin',
                      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                      details: details || 'Plan updated',
                      type: 'billing',
                    },
                    ...b.auditLogs,
                  ],
                }
              : b,
          ),
        );
        showToast(`Plan successfully updated for ${targetBiz.name}`, 'success');
        break;
      case 'sub_extended':
        showToast(`Subscription grace period extended for ${targetBiz.name}`, 'success');
        break;
      case 'suspend':
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === targetBiz.id
              ? { ...b, status: 'suspended', suspendedReason: details }
              : b,
          ),
        );
        showToast(`Tenant ${targetBiz.name} has been suspended`, 'error');
        break;
      case 'activated':
        setBusinesses((prev) =>
          prev.map((b) => (b.id === targetBiz.id ? { ...b, status: 'active', suspendedReason: undefined } : b)),
        );
        showToast(`Tenant ${targetBiz.name} reactivated successfully`, 'success');
        break;
      case 'disable':
        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === targetBiz.id
              ? { ...b, status: 'disabled', notes: `Frozen: ${details}` }
              : b,
          ),
        );
        showToast(`Tenant ${targetBiz.name} put in temporary maintenance freeze`, 'info');
        break;
      case 'settings_reset':
        showToast(`Configurations reset to system defaults for ${targetBiz.name}`, 'info');
        break;
      case 'deleted':
        setBusinesses((prev) => prev.filter((b) => b.id !== targetBiz.id));
        showToast(`Tenant ${targetBiz.name} permanently archived`, 'error');
        if (id) {
          navigate('/businesses');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in">
      {/* If viewing single business details */}
      {id ? (
        selectedBusiness ? (
          <BusinessDetailView
            business={selectedBusiness}
            onActionSelect={setModalState}
          />
        ) : (
          <div className="rounded-2xl border border-border/80 bg-card p-8 text-center space-y-3">
            <h2 className="text-lg font-bold text-foreground">Tenant Not Found</h2>
            <p className="text-xs text-muted-foreground">
              No business found matching ID &quot;{id}&quot;.
            </p>
            <button
              type="button"
              onClick={() => navigate('/businesses')}
              className="px-4 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground cursor-pointer"
            >
              Return to Business List
            </button>
          </div>
        )
      ) : (
        /* If viewing businesses list */
        <div className="space-y-4">
          {/* Header & KPI Summary */}
          <BusinessListHeader
            businesses={businesses}
            activeStatus={filters.status}
            onStatusSelect={(st) => handleFilterChange('status', st)}
            onOnboardClick={() => showToast('Onboard Enterprise Business Modal opened', 'info')}
            onExportClick={() => showToast('Exporting 1,420 businesses to CSV report...', 'success')}
          />

          {/* Filter, Search & Layout Switcher Bar */}
          <BusinessFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalFiltered={filteredBusinesses.length}
            totalTenants={businesses.length}
            totalFilteredMrr={totalFilteredMrr}
            counts={statusCounts}
          />

          {/* Table or Grid View */}
          {filters.viewMode === 'table' ? (
            <BusinessTable
              businesses={paginatedBusinesses}
              onActionSelect={setModalState}
            />
          ) : (
            <BusinessGrid
              businesses={paginatedBusinesses}
              onActionSelect={setModalState}
            />
          )}

          {/* Pagination */}
          <BusinessPagination
            currentPage={filters.page}
            totalPages={totalPages}
            pageSize={filters.pageSize}
            totalItems={filteredBusinesses.length}
            onPageChange={(page) => handleFilterChange('page', page)}
            onPageSizeChange={(size) => handleFilterChange('pageSize', size)}
          />
        </div>
      )}

      {/* Unified Action Modals */}
      <BusinessActionModals
        modalState={modalState}
        onClose={() => setModalState(null)}
        onConfirmSuccess={handleModalConfirmSuccess}
      />
    </div>
  );
};

export default BusinessesDashboard;
