import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../products/ProductCard';

export default function FeaturedCollection() {
  const { featuredProducts, loading } = useProducts();

  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            CURATED SELECTION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C3E50] font-normal">
            OUR COLLECTION
          </h2>
          <p className="text-base text-[#5C728A] font-light">
            Handcrafted pieces for every little moment.
          </p>
        </div>

        {/* Dynamic Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#F4EFE6] aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.$id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Collections Action */}
        <div className="text-center mt-16">
          <Link
            to="/collections"
            className="group inline-flex items-center text-xs tracking-widest uppercase font-semibold text-[#2C3E50] bg-[#FFFDF9] hover:bg-[#EBF3FA] px-8 py-4 rounded-full border border-[#D0E2F3] shadow-soft hover:shadow-soft-lg transition-all duration-300"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform duration-300 text-[#4A607A]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
