import { Layers, Plus, EyeOff, Search, Utensils, Settings2, Eye, Trash2, Tag, LayoutGrid, List, Pencil } from 'lucide-react';
import { useTranslation } from '../../../../../app/context/LanguageContext';
import EmptyState from '../../../common/EmptyState';
import SegmentedControl from '../../../ui/SegmentedControl';
import type { MenuCategory, MenuProduct } from '../menu.types';

type ItemsSectionProps = {
  categories: MenuCategory[];
  products: MenuProduct[];
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddCategory: () => void;
  onOpenAddProduct: () => void;
  onToggleCategorySoldOut: (id: string) => void;
  onToggleProductStatus: (id: string) => void;
  onOpenVariantBuilder: (product: MenuProduct) => void;
  onDeleteProduct: (product: MenuProduct) => void;
  onEditCategory: (id: string) => void;
  onEditProduct: (product: MenuProduct) => void;
};

const ItemsSection = ({
  categories,
  products,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onOpenAddCategory,
  onOpenAddProduct,
  onToggleCategorySoldOut,
  onToggleProductStatus,
  onOpenVariantBuilder,
  onDeleteProduct,
  onEditCategory,
  onEditProduct,
}: ItemsSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* ─── Categories Bar ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--card)] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">{t('menu.categories.title')}</h2>
          </div>
          <button
            onClick={onOpenAddCategory}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--surface)] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[var(--primary)] hover:bg-[var(--elevated)] transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('menu.categories.add')}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`group relative flex flex-col items-center gap-2.5 rounded-2xl border p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                cat.isSoldOut
                  ? 'border-rose-500/30 bg-rose-500/5'
                  : 'border-[var(--color-border)] bg-[var(--surface)] hover:border-[var(--primary)]/40'
              }`}
            >
              {/* ─── Image ───────────────────────────────────────────── */}
              <div
                className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
                  cat.isSoldOut
                    ? 'ring-rose-500/30 grayscale'
                    : 'ring-[var(--primary)]/20 group-hover:ring-[var(--primary)]/50 group-hover:scale-105'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.nameKey.includes('.') ? t(cat.nameKey) : cat.nameKey}
                  className="h-full w-full object-cover"
                />
                {cat.isSoldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-rose-500/60 backdrop-blur-sm">
                    <EyeOff className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* ─── Name ─────────────────────────────────────────────── */}
              <div className="text-center min-w-0 w-full">
                <p className={`text-xs sm:text-sm font-bold truncate ${cat.isSoldOut ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>
                  {cat.nameKey.includes('.') ? t(cat.nameKey) : cat.nameKey}
                </p>
                <p className="text-[10px] sm:text-[11px] font-medium text-[var(--text-muted)] mt-0.5">
                  {cat.count} {t('common.items') || 'items'}
                </p>
              </div>

              {/* ─── Actions: Edit + Toggle Sold Out ────────────────── */}
              <div className="flex items-center gap-1.5 mt-1">
                {/* Edit Category – pill with icon + label */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCategory(cat.id);
                  }}
                  className="flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-secondary)] border border-[var(--color-border)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer"
                  aria-label={t('common.edit') || 'Edit category'}
                >
                  <Pencil className="h-3 w-3" />
                  <span className="hidden xs:inline">{t('common.edit')}</span>
                </button>

                {/* Toggle Sold Out */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCategorySoldOut(cat.id);
                  }}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer ${
                    cat.isSoldOut
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-[var(--elevated)] text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10'
                  }`}
                  title={cat.isSoldOut ? 'Mark as available' : 'Mark as sold out'}
                >
                  {cat.isSoldOut ? t('menu.categories.bulkSoldOut') : t('menu.categories.bulkActive')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Products ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-[var(--text-primary)]">{t('menu.products.title')}</h2>

          <div className="flex items-center gap-2 justify-center sm:justify-center md:justify-baseline">
            <button
              onClick={onOpenAddProduct}
              className="flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[var(--primary-dark)] transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('menu.products.add')}</span>
            </button>

            <SegmentedControl
              options={[
                { value: 'grid', label: t('menu.viewGrid'), icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                { value: 'table', label: t('menu.viewTable'), icon: <List className="h-3.5 w-3.5" /> },
              ]}
              selectedValue={viewMode}
              onChange={(mode) => onViewModeChange(mode)}
            />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none shadow-sm"
          />
        </div>

        {/* ─── Empty State ──────────────────────────────────────────── */}
        {products.length === 0 ? (
          <EmptyState
            icon={Utensils}
            titleKey="common.noResults"
            actionLabelKey="menu.products.add"
            onAction={onOpenAddProduct}
          />
        ) : viewMode === 'grid' ? (
          /* ─── Grid View ─────────────────────────────────────────── */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-lg group transition hover:border-[var(--primary)]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                    <img src={item.image} alt={item.nameKey} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="rounded-md bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[var(--text-primary)]">
                        {item.nameKey.includes('.') ? t(item.nameKey) : item.nameKey}
                      </h3>
                      <span className="font-extrabold text-sm text-[var(--primary)]">{item.price}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {item.categoryKey.includes('.') ? t(item.categoryKey) : item.categoryKey} • {item.views} {t('common.views')}
                    </p>

                    <div className="pt-1 flex flex-wrap gap-1 text-[10px]">
                      {item.variants.map((v, i) => (
                        <span key={i} className="rounded-md bg-[var(--surface)] border border-[var(--color-border)] px-1.5 py-0.5 font-medium text-[var(--text-secondary)]">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-[var(--color-border)] text-xs mt-2">
                  <button
                    onClick={() => onOpenVariantBuilder(item)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline pt-2 cursor-pointer"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    <span>{t('menu.products.variantsAndExtras')}</span>
                  </button>

                  <div className="flex items-center gap-1 pt-2">
                    {/* Edit Product */}
                    <button
                      onClick={() => onEditProduct(item)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--primary)] cursor-pointer"
                      title={t('common.edit')}
                      aria-label={t('common.edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onToggleProductStatus(item.id)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--text-primary)] cursor-pointer"
                      title="Toggle Status"
                      aria-label="Toggle Status"
                    >
                      {item.status === 'Active' ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-rose-500" />}
                    </button>
                    <button
                      onClick={() => onDeleteProduct(item)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-rose-500 cursor-pointer"
                      title={t('common.delete')}
                      aria-label={t('common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ─── Table View ─────────────────────────────────────────── */
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--card)] shadow-lg">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="border-b border-[var(--color-border)] bg-[var(--surface)] font-semibold text-[var(--text-muted)]">
                <tr>
                  <th className="p-3">{t('menu.products.name')}</th>
                  <th className="p-3">{t('menu.products.category')}</th>
                  <th className="p-3">{t('menu.products.price')}</th>
                  <th className="p-3">{t('menu.products.badge')}</th>
                  <th className="p-3">{t('menu.products.status')}</th>
                  <th className="p-3 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--elevated)]/40 transition">
                    <td className="p-3 font-bold text-[var(--text-primary)]">
                      {item.nameKey.includes('.') ? t(item.nameKey) : item.nameKey}
                    </td>
                    <td className="p-3 text-[var(--text-secondary)]">
                      {item.categoryKey.includes('.') ? t(item.categoryKey) : item.categoryKey}
                    </td>
                    <td className="p-3 font-semibold text-[var(--primary)]">{item.price}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
                        <Tag className="h-3 w-3" />
                        {item.badge}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                          item.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Product */}
                        <button
                          onClick={() => onEditProduct(item)}
                          className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--primary)] cursor-pointer"
                          title={t('common.edit')}
                          aria-label={t('common.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleProductStatus(item.id)}
                          className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-[var(--text-primary)] cursor-pointer"
                          aria-label="Toggle Status"
                        >
                          {item.status === 'Active' ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-rose-500" />}
                        </button>
                        <button
                          onClick={() => onDeleteProduct(item)}
                          className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--elevated)] hover:text-rose-500 cursor-pointer"
                          aria-label={t('common.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsSection;