import React from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';

export default function RelatedProducts({ currentProductId, category }) {
  const { products } = useProducts();

  // Find products in same category first, excluding current product
  const related = products
    .filter((p) => (p.$id !== currentProductId && p.id !== currentProductId))
    .sort((a, b) => (a.category === category ? -1 : 1))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="py-16 border-t border-[#EBE3D5] bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            RECOMMENDED FOR YOU
          </span>
          <h2 className="font-serif text-3xl text-[#2C3E50] font-normal">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((product) => (
            <ProductCard key={product.$id || product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
