export type MenuProductStatus = 'Active' | 'Sold Out';

export type MenuCategory = {
  id: string;
  nameKey: string;
  count: number;
  isSoldOut: boolean;
  image: string;
};

export type MenuProduct = {
  id: string;
  nameKey: string;
  categoryKey: string;
  price: string;
  status: MenuProductStatus;
  badge: string;
  views: string;
  image: string;
  variants: string[];
  extras: string[];
};

export type MenuSlider = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  targetKey: string;
  image: string;
  status: string;
};

export type Review = {
  id: string;
  productId: string;
  userName: string;
  date: string;
  rating: number;
  comment: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
};

export type Category = {
  id: string;
  name: string;
  image: string;
};

export type ReviewStatus = 'idle' | 'deleting' | 'deleted';