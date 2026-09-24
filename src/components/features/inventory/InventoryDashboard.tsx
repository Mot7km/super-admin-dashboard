import { useState } from 'react';
import { useTranslation } from '../../../../app/context/LanguageContext';
import { useToast } from '../../common/Toast';
import InventoryHeader from './sections/InventoryHeader';
import InventoryPoTab from './sections/InventoryPoTab';
import InventoryRecipeTab from './sections/InventoryRecipeTab';
import InventoryStockTab from './sections/InventoryStockTab';
import InventoryTabs from './sections/InventoryTabs';
import AddIngredientModal from './components/AddIngredientModal';
import InventoryRecipeModal from './components/InventoryRecipeModal';

const InventoryDashboard = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'stock' | 'recipes' | 'po'>('stock');
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [ingName, setIngName] = useState('');
  const [ingCategory, setIngCategory] = useState('Meat & Poultry');
  const [ingSupplier, setIngSupplier] = useState('Al-Watania Meats');
  const [ingStock, setIngStock] = useState('100');
  const [selectedRecipeDish, setSelectedRecipeDish] = useState('Smoked Truffle Burger');

  const [ingredients, setIngredients] = useState([
    { id: 'i-1', name: 'Angus Beef Patties (180g)', category: 'Meat & Poultry', currentStock: 45, maxStock: 300, unit: 'pcs', supplier: 'Al-Watania Meats', lastRestock: 'Feb 24, 2025' },
    { id: 'i-2', name: 'Truffle Oil Sauce', category: 'Sauces & Spices', currentStock: 12, maxStock: 100, unit: 'Liters', supplier: 'Gourmet Imports', lastRestock: 'Feb 20, 2025' },
    { id: 'i-3', name: 'Spanish Condensed Milk', category: 'Dairy & Coffee', currentStock: 8, maxStock: 120, unit: 'Cans', supplier: 'Delta Dairy', lastRestock: 'Feb 15, 2025' },
    { id: 'i-4', name: 'Brioche Burger Buns', category: 'Bakery', currentStock: 160, maxStock: 250, unit: 'pcs', supplier: 'El-Makhabez', lastRestock: 'Feb 26, 2025' },
  ]);

  const handleRestock = (ingId: string) => {
    setIngredients(ingredients.map((ing) => (ing.id === ingId ? { ...ing, currentStock: ing.maxStock } : ing)));
    showToast(t('common.success'), 'success');
  };

  const handleAddIngredient = () => {
    if (!ingName.trim()) return;
    setIngredients([
      ...ingredients,
      {
        id: `i-${Date.now()}`,
        name: ingName,
        category: ingCategory,
        currentStock: Number(ingStock) || 50,
        maxStock: 200,
        unit: 'pcs',
        supplier: ingSupplier,
        lastRestock: 'Today',
      },
    ]);
    setIngName('');
    setShowAddIngredientModal(false);
    showToast(t('common.success'), 'success');
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      <InventoryHeader
        title={t('inventory.title')}
        subtitle={t('inventory.subtitle')}
        addIngredientLabel={t('inventory.addIngredient')}
        exportPoLabel={t('inventory.exportPo')}
        onAddIngredient={() => setShowAddIngredientModal(true)}
        onExportPo={() => {
          setActiveTab('po');
          showToast(t('inventory.exportPo'), 'info');
        }}
      />

      <InventoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stockLabel={t('inventory.tabs.stockLevels')}
        recipesLabel={t('inventory.tabs.recipeLink')}
        poLabel={t('inventory.tabs.restockPo')}
      />

      {activeTab === 'stock' && (
        <InventoryStockTab
          ingredients={ingredients}
          onRestock={handleRestock}
          titleLabel={t('inventory.title')}
          lowStockLabel={t('inventory.lowStockAlert')}
          ingredientLabel={t('inventory.table.ingredient')}
          categoryLabel={t('inventory.table.category')}
          supplierLabel={t('inventory.table.supplierTag')}
          stockGaugeLabel={t('inventory.table.stockGauge')}
          currentStockLabel={t('inventory.table.currentStock')}
          actionsLabel={t('common.actions')}
          stockRemainingLabel={t('inventory.stockRemaining')}
          restockLabel="Restock"
        />
      )}

      {activeTab === 'recipes' && (
        <InventoryRecipeTab
          title={t('inventory.recipeTitle')}
          linkRecipeLabel={t('inventory.linkRecipe')}
          deductsHeader={t('inventory.deductsHeader')}
          onOpenRecipe={() => setShowRecipeModal(true)}
        />
      )}

      {activeTab === 'po' && <InventoryPoTab title={t('inventory.tabs.restockPo')} />}

      {showRecipeModal && (
        <InventoryRecipeModal
          selectedRecipeDish={selectedRecipeDish}
          onChangeDish={setSelectedRecipeDish}
          onClose={() => setShowRecipeModal(false)}
          onSave={() => setShowRecipeModal(false)}
        />
      )}

      {showAddIngredientModal && (
        <AddIngredientModal
          ingName={ingName}
          ingCategory={ingCategory}
          ingSupplier={ingSupplier}
          ingStock={ingStock}
          onChangeName={setIngName}
          onChangeCategory={setIngCategory}
          onChangeSupplier={setIngSupplier}
          onChangeStock={setIngStock}
          onClose={() => setShowAddIngredientModal(false)}
          onSave={handleAddIngredient}
        />
      )}
    </div>
  );
};

export default InventoryDashboard;