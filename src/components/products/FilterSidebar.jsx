import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function FilterSidebar() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    maxPriceFilter,
    setMaxPriceFilter,
  } = useProducts();

  const allCategoryOptions = ['All', ...categories];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-8 bg-[#FFFDF9] p-6 rounded-2xl border border-[#EBE3D5] shadow-soft-sm">
      
      {/* Categories Section */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#4A607A] uppercase mb-4 pb-2 border-b border-[#FAF7F2]">
          <Filter className="w-4 h-4" />
          <span>Categories</span>
        </div>
        <div className="space-y-1.5">
          {allCategoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#EBF3FA] text-[#2C3E50] font-semibold border border-[#B8D4F0] shadow-soft-sm'
                  : 'text-[#5C728A] hover:bg-[#FAF7F2] hover:text-[#2C3E50]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-[#4A607A] uppercase mb-4 pb-2 border-b border-[#FAF7F2]">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Max Price</span>
          </div>
          <span className="text-sm font-bold text-[#2C3E50]">₹{maxPriceFilter}</span>
        </div>

        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={maxPriceFilter}
          onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
          className="w-full accent-[#4A607A] cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-medium mt-2">
          <span>₹100</span>
          <span>₹1500+</span>
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          setSelectedCategory('All');
          setMaxPriceFilter(1500);
        }}
        className="w-full text-center text-xs font-semibold text-[#5C728A] hover:text-[#2C3E50] underline tracking-wider uppercase pt-2"
      >
        RESET ALL FILTERS
      </button>

    </aside>
  );
}
