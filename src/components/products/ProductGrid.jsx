import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';

export default function ProductGrid() {
  const { filteredProducts, loading, sortBy, setSortBy } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 space-y-8">
      {/* Header Bar with Count & Sorting dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF9] p-4 sm:px-6 rounded-2xl border border-[#EBE3D5] shadow-soft-sm">
        <p className="text-xs font-semibold tracking-wider text-[#5C728A] uppercase">
          SHOWING <span className="text-[#2C3E50]">{filteredProducts.length}</span> PRODUCTS
        </p>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-medium text-[#5C728A] whitespace-nowrap">
            SORT BY:
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAF7F2] border border-[#EBE3D5] text-xs font-medium text-[#2C3E50] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B8D4F0]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#F4EFE6] aspect-square rounded-xl" />
          ))}
        </div>
      ) : paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.$id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFDF9] rounded-2xl p-12 text-center border border-[#EBE3D5] space-y-4">
          <PackageSearch className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="font-serif text-2xl text-[#2C3E50]">No Products Found</h3>
          <p className="text-sm text-[#5C728A] max-w-sm mx-auto">
            Try adjusting your category filter or search keywords to explore more handmade pieces.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-[#EBE3D5] text-[#5C728A] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                currentPage === pageNum
                  ? 'bg-[#4A607A] text-white'
                  : 'text-[#5C728A] hover:bg-[#EBF3FA]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-[#EBE3D5] text-[#5C728A] hover:bg-[#FAF7F2] disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
