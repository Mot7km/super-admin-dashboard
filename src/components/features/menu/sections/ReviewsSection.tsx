import { useState, useMemo, useEffect } from 'react';
import { CategorySlider } from '../components/CategorySlider';
import { ProductSlider } from '../components/ProductSlider';
import { ReviewList } from '../components/ReviewList';
import { DeleteModal } from '../components/DeleteModal';
import { categories, products, mockReviews } from '../menu.constants';
import type { Review } from '../menu.types';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0].id);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first product on mount
  useEffect(() => {
    const firstProduct = products.find((p) => p.categoryId === categories[0].id);
    if (firstProduct) setSelectedProductId(firstProduct.id);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [selectedProductId]);

  const productReviews = useMemo(() => {
    if (!selectedProductId) return [];
    return reviews.filter((r) => r.productId === selectedProductId);
  }, [reviews, selectedProductId]);

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return productReviews;
    const q = searchQuery.toLowerCase();
    return productReviews.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
    );
  }, [productReviews, searchQuery]);

  const totalReviews = filteredReviews.length;
  const avgRating =
    totalReviews > 0
      ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    const first = products.find((p) => p.categoryId === id);
    setSelectedProductId(first?.id || null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Category Slider */}
      <CategorySlider
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={handleCategorySelect}
      />

      {/* Product Slider */}
      <ProductSlider
        products={filteredProducts}
        categories={categories}
        selectedProductId={selectedProductId}
        onSelectProduct={setSelectedProductId}
        reviews={reviews}
      />

      {/* Review List */}
      <ReviewList
        reviews={filteredReviews}
        selectedProduct={selectedProduct}
        avgRating={avgRating}
        totalReviews={totalReviews}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onDelete={setDeleteTarget}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ReviewsSection;