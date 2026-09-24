import type { LucideIcon } from 'lucide-react';

export type HomeStat = {
  titleKey: string;
  value: string;
  change?: string;
  changeKey?: string;
  icon: LucideIcon;
  haloColor: string;
  data: Array<{ day: string; v: number }>;
  formatVal: (value: number) => string;
};

export type HomeProduct = {
  nameKey: string;
  views: string;
  percentage: number;
};

export type HomeReview = {
  id: number;
  customer: string;
  rating: number;
  dishKey: string;
  commentKey: string;
  timeKey: string;
};

export type HomeActivityItem = {
  id: number;
  icon: LucideIcon;
  titleKey: string;
  timeKey: string;
};
