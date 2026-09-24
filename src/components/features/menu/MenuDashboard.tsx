import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import ConfirmDialog from '../../common/ConfirmDialog';

// Local types & constants
import type { MenuCategory, MenuProduct, MenuSlider } from './menu.types';
import { initialCategories, initialProducts, initialSliders } from './menu.constants';

// Sections
import MenuHeader from './sections/MenuHeader';
import MenuTabs from './sections/MenuTabs';
import ItemsSection from './sections/ItemsSection';
import SlidersSection from './sections/SlidersSection';
import QrSection from './sections/QrSection';
import ReviewsSection from './sections/ReviewsSection';

// Modals
import AddCategoryModal from './components/AddCategoryModal';
import AddProductModal from './components/AddProductModal';
import AddSliderModal from './components/AddSliderModal';
import VariantBuilderModal from './components/VariantBuilderModal';

const MenuDashboard = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State
  const queryTab = searchParams.get('tab');
  const validTabs = ['items', 'sliders', 'qr', 'reviews', 'simulator'];
  const initialTab = (queryTab && validTabs.includes(queryTab) ? queryTab : 'items') as 'items' | 'sliders' | 'qr' | 'reviews' | 'simulator';
  const [activeTab, setActiveTab] = useState<'items' | 'sliders' | 'qr' | 'reviews' | 'simulator'>(initialTab);

  useEffect(() => {
    if (queryTab && validTabs.includes(queryTab) && queryTab !== activeTab) {
      setActiveTab(queryTab as any);
    }
  }, [queryTab]);

  const handleTabChange = (tab: 'items' | 'sliders' | 'qr' | 'reviews' | 'simulator') => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  // UI Modes & Filters
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isPeakHourMode, setIsPeakHourMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Visibility
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddSliderItemModal, setShowAddSliderItemModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  // Form Inputs
  const [newCatName, setNewCatName] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');

  // Selected Dish / Confirm Dialog State
  const [selectedDishForVariant, setSelectedDishForVariant] = useState<MenuProduct | null>(null);
  const [newVariantInput, setNewVariantInput] = useState('');
  const [newExtraInput, setNewExtraInput] = useState('');
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'product' | 'slider'; name: string } | null>(null);

  // Data Collections
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [products, setProducts] = useState<MenuProduct[]>(initialProducts);
  const [sliders, setSliders] = useState<MenuSlider[]>(initialSliders);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const name = p.nameKey.includes('.') ? t(p.nameKey) : p.nameKey;
    const cat = p.categoryKey.includes('.') ? t(p.categoryKey) : p.categoryKey;
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || cat.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handlers
  const handleToggleCategorySoldOut = (catId: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, isSoldOut: !c.isSoldOut } : c)));
    showToast(t('common.success'), 'info');
  };

  const handleToggleProductStatus = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, status: p.status === 'Active' ? 'Sold Out' : 'Active' } : p))
    );
    showToast(t('common.success'), 'info');
  };

  const handleEditCategory = (catId: string) => {
    const category = categories.find((c) => c.id === catId);
    if (!category) return;
    showToast(`${t('common.edit')}: ${category.nameKey.includes('.') ? t(category.nameKey) : category.nameKey}`, 'info');
  };

  const handleEditProduct = (product: MenuProduct) => {
    showToast(`${t('common.edit')}: ${product.nameKey.includes('.') ? t(product.nameKey) : product.nameKey}`, 'info');
  };

  const handleOpenVariantBuilder = (dish: MenuProduct) => {
    setSelectedDishForVariant(JSON.parse(JSON.stringify(dish)));
    setShowVariantModal(true);
  };

  const handleAddVariantToDish = () => {
    if (!newVariantInput.trim() || !selectedDishForVariant) return;
    const updated = {
      ...selectedDishForVariant,
      variants: [...selectedDishForVariant.variants, newVariantInput.trim()],
    };
    setSelectedDishForVariant(updated);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setNewVariantInput('');
    showToast(t('common.success'), 'success');
  };

  const handleAddExtraToDish = () => {
    if (!newExtraInput.trim() || !selectedDishForVariant) return;
    const updated = {
      ...selectedDishForVariant,
      extras: [...selectedDishForVariant.extras, newExtraInput.trim()],
    };
    setSelectedDishForVariant(updated);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setNewExtraInput('');
    showToast(t('common.success'), 'success');
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, nameKey: newCatName, count: 0, isSoldOut: false, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80' },
    ]);
    setNewCatName('');
    setShowAddCategoryModal(false);
    showToast(t('common.success'), 'success');
  };

  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice.trim()) return;
    setProducts((prev) => [
      ...prev,
      {
        id: `prod-${Date.now()}`,
        nameKey: newProdName,
        categoryKey: 'menu.categoriesList.burgers',
        price: newProdPrice.startsWith('$') ? newProdPrice : `$${newProdPrice}`,
        status: 'Active',
        badge: 'New',
        views: '0',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80',
        variants: ['Standard'],
        extras: [],
      },
    ]);
    setNewProdName('');
    setNewProdPrice('');
    setShowAddProductModal(false);
    showToast(t('common.success'), 'success');
  };

  const handleAddSliderItem = () => {
    if (!newSlideTitle.trim()) return;
    setSliders((prev) => [
      ...prev,
      {
        id: `slide-${Date.now()}`,
        titleKey: newSlideTitle,
        subtitleKey: newSlideSubtitle || 'Special Promotional Offer',
        targetKey: 'dashboard.products.truffleBurger',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
        status: 'Active',
      },
    ]);
    setNewSlideTitle('');
    setNewSlideSubtitle('');
    setShowAddSliderItemModal(false);
    showToast(t('common.success'), 'success');
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    if (deleteItem.type === 'product') {
      setProducts((prev) => prev.filter((p) => p.id !== deleteItem.id));
    } else {
      setSliders((prev) => prev.filter((s) => s.id !== deleteItem.id));
    }
    showToast(`${deleteItem.name} ${t('common.delete').toLowerCase()}d`, 'info');
    setDeleteItem(null);
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Header */}
      <MenuHeader
        title={t('menu.title')}
        subtitle={t('menu.subtitle')}
        peakHourLabel={t('menu.peakHourMode')}
        isPeakHour={isPeakHourMode}
        onTogglePeak={() => {
          setIsPeakHourMode(!isPeakHourMode);
          showToast(`${t('menu.peakHourMode')}: ${!isPeakHourMode ? 'ON' : 'OFF'}`, 'info');
        }}
      />

      {/* Tabs */}
      <MenuTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        itemLabel={t('menu.tabs.categoriesAndProducts')}
        slidersLabel={t('menu.tabs.slidersAndBanners')}
        qrLabel={t('menu.tabs.qrControl')}
        reviewsLabel={t('menu.tabs.reviews')}
      />

      {/* Main Tab Sections */}
      {activeTab === 'items' && (
        <ItemsSection
          categories={categories}
          products={filteredProducts}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddCategory={() => setShowAddCategoryModal(true)}
          onOpenAddProduct={() => setShowAddProductModal(true)}
          onToggleCategorySoldOut={handleToggleCategorySoldOut}
          onToggleProductStatus={handleToggleProductStatus}
          onOpenVariantBuilder={handleOpenVariantBuilder}
          onDeleteProduct={(p) =>
            setDeleteItem({ id: p.id, type: 'product', name: p.nameKey.includes('.') ? t(p.nameKey) : p.nameKey })
          }
          onEditCategory={handleEditCategory}
          onEditProduct={handleEditProduct}
        />
      )}

      {activeTab === 'sliders' && (
        <SlidersSection
          sliders={sliders}
          onOpenAddSlider={() => setShowAddSliderItemModal(true)}
          onDeleteSlider={(s) =>
            setDeleteItem({ id: s.id, type: 'slider', name: s.titleKey.includes('.') ? t(s.titleKey) : s.titleKey })
          }
        />
      )}

      {activeTab === 'qr' && (
        <QrSection
          onDownloadQr={() => showToast(t('menu.qr.downloadBtn'), 'info')}
          onShareQr={() => showToast(t('menu.qr.shareBtn'), 'info')}
        />
      )}

      {activeTab === 'reviews' && <ReviewsSection />}

      {/* Modals */}
      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        categoryName={newCatName}
        onCategoryNameChange={setNewCatName}
        onSave={handleAddCategory}
      />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        productName={newProdName}
        onProductNameChange={setNewProdName}
        productPrice={newProdPrice}
        onProductPriceChange={setNewProdPrice}
        onSave={handleAddProduct}
      />

      <AddSliderModal
        isOpen={showAddSliderItemModal}
        onClose={() => setShowAddSliderItemModal(false)}
        slideTitle={newSlideTitle}
        onSlideTitleChange={setNewSlideTitle}
        slideSubtitle={newSlideSubtitle}
        onSlideSubtitleChange={setNewSlideSubtitle}
        onSave={handleAddSliderItem}
      />

      <VariantBuilderModal
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        selectedDish={selectedDishForVariant}
        newVariantInput={newVariantInput}
        onVariantInputChange={setNewVariantInput}
        onAddVariant={handleAddVariantToDish}
        newExtraInput={newExtraInput}
        onExtraInputChange={setNewExtraInput}
        onAddExtra={handleAddExtraToDish}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItem}
        title={t('common.delete')}
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
};

export default MenuDashboard;