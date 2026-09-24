import type { InventoryIngredient } from './inventory.types';

export const initialIngredients: InventoryIngredient[] = [
  { id: 'i-1', name: 'Angus Beef Patties (180g)', category: 'Meat & Poultry', currentStock: 45, maxStock: 300, unit: 'pcs', supplier: 'Al-Watania Meats', lastRestock: 'Feb 24, 2025' },
  { id: 'i-2', name: 'Truffle Oil Sauce', category: 'Sauces & Spices', currentStock: 12, maxStock: 100, unit: 'Liters', supplier: 'Gourmet Imports', lastRestock: 'Feb 20, 2025' },
  { id: 'i-3', name: 'Spanish Condensed Milk', category: 'Dairy & Coffee', currentStock: 8, maxStock: 120, unit: 'Cans', supplier: 'Delta Dairy', lastRestock: 'Feb 15, 2025' },
  { id: 'i-4', name: 'Brioche Burger Buns', category: 'Bakery', currentStock: 160, maxStock: 250, unit: 'pcs', supplier: 'El-Makhabez', lastRestock: 'Feb 26, 2025' },
];
