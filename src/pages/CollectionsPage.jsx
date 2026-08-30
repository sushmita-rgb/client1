import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/products/FilterSidebar';
import ProductGrid from '../components/products/ProductGrid';
import { useProducts } from '../context/ProductContext';

export default function CollectionsPage() {
  const [searchParams] = useSearchParams();
  const { setSelectedCategory } = useProducts();

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, setSelectedCategory]);

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3 pb-8 border-b border-[#EBE3D5]">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            EXPLORE THE GALLERY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C3E50] font-normal">
            ALL COLLECTIONS
          </h1>
          <p className="text-base text-[#5C728A] font-light max-w-lg mx-auto">
            Browse handcrafted bracelets, cute keychains, phone charms, and signature gift sets.
          </p>
        </div>

        {/* Layout: Left Sidebar + Right Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar />
          <ProductGrid />
        </div>

      </div>
    </div>
  );
}
