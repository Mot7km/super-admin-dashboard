import type { MenuCategory, MenuProduct, MenuSlider, Category, Product, Review } from './menu.types';

export const initialCategories: MenuCategory[] = [
  { id: 'cat-1', nameKey: 'menu.categoriesList.burgers', count: 18, isSoldOut: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80' },
  { id: 'cat-2', nameKey: 'menu.categoriesList.beverages', count: 24, isSoldOut: false, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&auto=format&fit=crop&q=80' },
  { id: 'cat-3', nameKey: 'menu.categoriesList.pizza', count: 12, isSoldOut: false, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=200&auto=format&fit=crop&q=80' },
  { id: 'cat-4', nameKey: 'menu.categoriesList.desserts', count: 15, isSoldOut: false, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&auto=format&fit=crop&q=80' },
];

export const initialProducts: MenuProduct[] = [
  {
    id: 'prod-1',
    nameKey: 'dashboard.products.truffleBurger',
    categoryKey: 'menu.categoriesList.burgers',
    price: '$14.50',
    status: 'Active',
    badge: 'Bestseller',
    views: '4,820',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    variants: ['Single ($14.50)', 'Double ($18.00)'],
    extras: ['Extra Cheese (+$1.50)', 'Truffle Dip (+$2.00)'],
  },
  {
    id: 'prod-2',
    nameKey: 'dashboard.products.icedLatte',
    categoryKey: 'menu.categoriesList.beverages',
    price: '$6.50',
    status: 'Sold Out',
    badge: 'Popular',
    views: '3,950',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80',
    variants: ['Medium ($6.50)', 'Large ($7.50)'],
    extras: ['Oat Milk (+$1.00)', 'Vanilla Syrup (+$0.50)'],
  },
  {
    id: 'prod-3',
    nameKey: 'dashboard.products.margheritaPizza',
    categoryKey: 'menu.categoriesList.pizza',
    price: '$18.00',
    status: 'Active',
    badge: 'New',
    views: '3,120',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80',
    variants: ['Medium 12"', 'Large 16"'],
    extras: ['Extra Mozzarella (+$2.50)'],
  },
];

export const initialSliders: MenuSlider[] = [
  {
    id: 'slide-1',
    titleKey: 'menu.slidersList.s1Title',
    subtitleKey: 'menu.slidersList.s1Subtitle',
    targetKey: 'dashboard.products.truffleBurger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
  },
  {
    id: 'slide-2',
    titleKey: 'menu.slidersList.s2Title',
    subtitleKey: 'menu.slidersList.s2Subtitle',
    targetKey: 'dashboard.products.icedLatte',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
  },
];

export const categories: Category[] = [
  { id: 'cat1', name: 'Appetizers', image: 'https://picsum.photos/seed/appetizer/80/80' },
  { id: 'cat2', name: 'Main Courses', image: 'https://picsum.photos/seed/maincourse/80/80' },
  { id: 'cat3', name: 'Desserts', image: 'https://picsum.photos/seed/dessert/80/80' },
  { id: 'cat4', name: 'Beverages', image: 'https://picsum.photos/seed/beverage/80/80' },
  { id: 'cat5', name: 'Salads', image: 'https://picsum.photos/seed/salad/80/80' },
  { id: 'cat6', name: 'Soups', image: 'https://picsum.photos/seed/soup/80/80' },
  { id: 'cat7', name: 'Seafood', image: 'https://picsum.photos/seed/seafood/80/80' },
  { id: 'cat8', name: 'Pasta', image: 'https://picsum.photos/seed/pasta_cat/80/80' },
  { id: 'cat9', name: 'Pizza', image: 'https://picsum.photos/seed/pizza/80/80' },
  { id: 'cat10', name: 'Sandwiches', image: 'https://picsum.photos/seed/sandwich/80/80' },
];

export const products: Product[] = [
  // Appetizers (cat1) – 15 items to force overflow
  { id: 'p1', name: 'Spring Rolls', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/springrolls/300/200', rating: 4.5, reviewCount: 12 },
  { id: 'p2', name: 'Garlic Bread', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/garlicbread/300/200', rating: 4.8, reviewCount: 8 },
  { id: 'p3', name: 'Stuffed Mushrooms', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/mushrooms/300/200', rating: 4.2, reviewCount: 5 },
  { id: 'p23', name: 'Onion Rings', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/onionrings/300/200', rating: 4.3, reviewCount: 7 },
  { id: 'p24', name: 'Mozzarella Sticks', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/mozzarella/300/200', rating: 4.6, reviewCount: 11 },
  { id: 'p25', name: 'Chicken Wings', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/wings/300/200', rating: 4.9, reviewCount: 23 },
  { id: 'p26', name: 'Nachos', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/nachos/300/200', rating: 4.1, reviewCount: 6 },
  { id: 'p27', name: 'Bruschetta', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/bruschetta/300/200', rating: 4.4, reviewCount: 9 },
  { id: 'p28', name: 'Calamari', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/calamari/300/200', rating: 4.7, reviewCount: 15 },
  { id: 'p29', name: 'Dumplings', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/dumplings/300/200', rating: 4.5, reviewCount: 10 },
  { id: 'p30', name: 'Samosa', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/samosa/300/200', rating: 4.2, reviewCount: 4 },
  { id: 'p31', name: 'Hummus Platter', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/hummus/300/200', rating: 4.3, reviewCount: 8 },
  { id: 'p32', name: 'Chicken Tenders', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/tenders/300/200', rating: 4.6, reviewCount: 13 },
  { id: 'p33', name: 'Potato Skins', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/potatoskins/300/200', rating: 4.0, reviewCount: 5 },
  { id: 'p34', name: 'Jalapeño Poppers', categoryId: 'cat1', imageUrl: 'https://picsum.photos/seed/poppers/300/200', rating: 4.8, reviewCount: 19 },
  // Main Courses (cat2)
  { id: 'p4', name: 'Grilled Chicken', categoryId: 'cat2', imageUrl: 'https://picsum.photos/seed/chicken/300/200', rating: 4.0, reviewCount: 15 },
  { id: 'p5', name: 'Beef Burger', categoryId: 'cat2', imageUrl: 'https://picsum.photos/seed/burger/300/200', rating: 4.9, reviewCount: 22 },
  { id: 'p6', name: 'Vegetable Pasta', categoryId: 'cat2', imageUrl: 'https://picsum.photos/seed/pasta/300/200', rating: 3.8, reviewCount: 6 },
  // Desserts (cat3)
  { id: 'p7', name: 'Chocolate Cake', categoryId: 'cat3', imageUrl: 'https://picsum.photos/seed/cake/300/200', rating: 4.7, reviewCount: 18 },
  { id: 'p8', name: 'Ice Cream', categoryId: 'cat3', imageUrl: 'https://picsum.photos/seed/icecream/300/200', rating: 4.3, reviewCount: 10 },
  // Beverages (cat4)
  { id: 'p9', name: 'Fresh Juice', categoryId: 'cat4', imageUrl: 'https://picsum.photos/seed/juice/300/200', rating: 4.6, reviewCount: 14 },
  { id: 'p10', name: 'Soft Drink', categoryId: 'cat4', imageUrl: 'https://picsum.photos/seed/soda/300/200', rating: 4.1, reviewCount: 7 },
  // Salads (cat5)
  { id: 'p11', name: 'Caesar Salad', categoryId: 'cat5', imageUrl: 'https://picsum.photos/seed/caesar/300/200', rating: 4.4, reviewCount: 9 },
  { id: 'p12', name: 'Greek Salad', categoryId: 'cat5', imageUrl: 'https://picsum.photos/seed/greek/300/200', rating: 4.2, reviewCount: 6 },
  // Soups (cat6)
  { id: 'p13', name: 'Tomato Soup', categoryId: 'cat6', imageUrl: 'https://picsum.photos/seed/tomato/300/200', rating: 4.0, reviewCount: 11 },
  { id: 'p14', name: 'Lentil Soup', categoryId: 'cat6', imageUrl: 'https://picsum.photos/seed/lentil/300/200', rating: 4.5, reviewCount: 8 },
  // Seafood (cat7)
  { id: 'p15', name: 'Grilled Salmon', categoryId: 'cat7', imageUrl: 'https://picsum.photos/seed/salmon/300/200', rating: 4.8, reviewCount: 20 },
  { id: 'p16', name: 'Shrimp Scampi', categoryId: 'cat7', imageUrl: 'https://picsum.photos/seed/shrimp/300/200', rating: 4.6, reviewCount: 14 },
  // Pasta (cat8)
  { id: 'p17', name: 'Spaghetti Carbonara', categoryId: 'cat8', imageUrl: 'https://picsum.photos/seed/carbonara/300/200', rating: 4.7, reviewCount: 16 },
  { id: 'p18', name: 'Fettuccine Alfredo', categoryId: 'cat8', imageUrl: 'https://picsum.photos/seed/alfredo/300/200', rating: 4.3, reviewCount: 9 },
  // Pizza (cat9)
  { id: 'p19', name: 'Margherita Pizza', categoryId: 'cat9', imageUrl: 'https://picsum.photos/seed/margherita/300/200', rating: 4.9, reviewCount: 25 },
  { id: 'p20', name: 'Pepperoni Pizza', categoryId: 'cat9', imageUrl: 'https://picsum.photos/seed/pepperoni/300/200', rating: 4.7, reviewCount: 19 },
  // Sandwiches (cat10)
  { id: 'p21', name: 'Club Sandwich', categoryId: 'cat10', imageUrl: 'https://picsum.photos/seed/club/300/200', rating: 4.2, reviewCount: 10 },
  { id: 'p22', name: 'Chicken Wrap', categoryId: 'cat10', imageUrl: 'https://picsum.photos/seed/wrap/300/200', rating: 4.4, reviewCount: 8 },
];

export const mockReviews: Review[] = [
  // Spring Rolls
  { id: 'r1', productId: 'p1', userName: 'Ahmed M.', date: '2026-08-10', rating: 5, comment: 'Crispy and delicious! Best spring rolls in town.' },
  { id: 'r2', productId: 'p1', userName: 'Sara A.', date: '2026-08-08', rating: 4, comment: 'Very good, but a bit oily.' },
  // Garlic Bread
  { id: 'r3', productId: 'p2', userName: 'Khaled H.', date: '2026-08-05', rating: 5, comment: 'Perfect garlic bread, loved the cheese.' },
  // Stuffed Mushrooms
  { id: 'r4', productId: 'p3', userName: 'Nora F.', date: '2026-08-01', rating: 3, comment: 'Flavorful, but a bit too salty for my taste.' },
  // Onion Rings
  { id: 'r5', productId: 'p23', userName: 'Omar K.', date: '2026-07-30', rating: 4, comment: 'Perfectly crispy and golden.' },
  // Mozzarella Sticks
  { id: 'r6', productId: 'p24', userName: 'Layla S.', date: '2026-07-28', rating: 5, comment: 'Cheesy and delicious, the sauce is great!' },
  // Chicken Wings
  { id: 'r7', productId: 'p25', userName: 'Faisal A.', date: '2026-07-25', rating: 5, comment: 'Best wings in town! Spicy and juicy.' },
  // Nachos
  { id: 'r8', productId: 'p26', userName: 'Sara M.', date: '2026-07-22', rating: 4, comment: 'Great for sharing, loaded with toppings.' },
  // Bruschetta
  { id: 'r9', productId: 'p27', userName: 'Khaled Y.', date: '2026-07-20', rating: 4, comment: 'Fresh and flavorful, the bread is perfect.' },
  // Calamari
  { id: 'r10', productId: 'p28', userName: 'Nadia R.', date: '2026-07-18', rating: 5, comment: 'Tender and crispy, excellent quality.' },
  // Dumplings
  { id: 'r11', productId: 'p29', userName: 'Yusuf Z.', date: '2026-07-15', rating: 4, comment: 'Authentic taste, loved the dipping sauce.' },
  // Samosa
  { id: 'r12', productId: 'p30', userName: 'Aisha W.', date: '2026-07-12', rating: 4, comment: 'Spicy and crunchy, very satisfying.' },
  // Hummus Platter
  { id: 'r13', productId: 'p31', userName: 'Tariq M.', date: '2026-07-10', rating: 5, comment: 'Smooth and creamy, best hummus in the city.' },
  // Chicken Tenders
  { id: 'r14', productId: 'p32', userName: 'Mona L.', date: '2026-07-08', rating: 4, comment: 'Great for kids, tender and juicy.' },
  // Potato Skins
  { id: 'r15', productId: 'p33', userName: 'Rami S.', date: '2026-07-05', rating: 4, comment: 'Loaded with cheese and bacon, very tasty.' },
  // Jalapeño Poppers
  { id: 'r16', productId: 'p34', userName: 'Huda N.', date: '2026-07-03', rating: 5, comment: 'Spicy and cheesy, absolutely love them!' },
  // Grilled Chicken
  { id: 'r17', productId: 'p4', userName: 'Nora F.', date: '2026-08-01', rating: 3, comment: 'Chicken was a bit dry, but seasoning was good.' },
  { id: 'r18', productId: 'p4', userName: 'Faisal O.', date: '2026-07-28', rating: 4, comment: 'Great flavor, generous portion.' },
  // Beef Burger
  { id: 'r19', productId: 'p5', userName: 'Layla H.', date: '2026-07-25', rating: 5, comment: 'Juicy burger, perfect bun, will order again.' },
  // Chocolate Cake
  { id: 'r20', productId: 'p7', userName: 'Omar F.', date: '2026-07-20', rating: 5, comment: 'Rich chocolate flavor, moist and fresh.' },
  // Fresh Juice
  { id: 'r21', productId: 'p9', userName: 'Mona S.', date: '2026-07-18', rating: 4, comment: 'Refreshing and natural, but a bit pricey.' },
  { id: 'r22', productId: 'p9', userName: 'Nadia J.', date: '2026-07-10', rating: 5, comment: 'Best fresh juice I ever had!' },
];