import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';

// Per-category themed background gradients matching the RIZA pastel palette
const categoryBg = {
  'Bracelets':        'from-[#EBF3FA] via-[#F4EFE6] to-[#FAF7F2]',
  'Keychains':        'from-[#F4EFE6] via-[#FFFDF9] to-[#EBF3FA]',
  'Mobile Keychains': 'from-[#EBF3FA] via-[#FFFDF9] to-[#F0EBF8]',
  'Best Collection':  'from-[#FDF8E7] via-[#FAF7F2] to-[#EBF3FA]',
};

export default function ProductCard({ product }) {
  const id = product.$id || product.id;
  const bgGradient = categoryBg[product.category] || 'from-[#EBF3FA] via-[#FAF7F2] to-[#FFFDF9]';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EBE3D5] hover:border-[#B8D4F0] transition-all duration-300 shadow-soft-sm hover:shadow-soft hover:-translate-y-0.5">
      {/* Product Image Container — themed gradient bg for transparent PNGs */}
      <div className={`relative aspect-square w-full bg-gradient-to-br ${bgGradient} overflow-hidden`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain object-center p-4 sm:p-5 group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md"
          loading="lazy"
        />

        {/* Subtle inner vignette ring */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40 pointer-events-none" />

        {/* Availability Badge */}
        {!product.available && (
          <span className="absolute top-3 left-3 bg-[#1E293B]/80 backdrop-blur-sm text-white text-[10px] uppercase font-semibold px-2.5 py-1 rounded-md tracking-wider">
            OUT OF STOCK
          </span>
        )}

        {/* Featured Tag */}
        {product.featured && product.available && (
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[#4A607A] text-[10px] uppercase font-semibold px-2.5 py-1 rounded-md tracking-wider border border-[#B8D4F0]">
            FEATURED
          </span>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-[#2C3E50]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 p-4">
          <Link
            to={`/product/${id}`}
            className="text-[11px] font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full bg-white/95 text-[#2C3E50] hover:bg-white transition-colors shadow-soft flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-[#4A607A]" />
            QUICK VIEW
          </Link>
        </div>
      </div>

      {/* Product Info & Actions */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#FFFDF9]">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-[#5C728A] uppercase block mb-1">
            {product.category}
          </span>
          <Link to={`/product/${id}`}>
            <h3 className="font-serif text-base sm:text-lg text-[#2C3E50] group-hover:text-[#4A607A] transition-colors leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-3.5 flex items-center justify-between border-t border-[#FAF7F2] mt-3">
          <span className="font-serif text-base sm:text-lg font-bold text-[#2C3E50]">
            ₹{product.price}
          </span>

          <Link
            to={`/product/${id}`}
            className="text-[11px] font-semibold text-[#4A607A] group-hover:text-[#2C3E50] flex items-center gap-1 transition-colors"
          >
            <span>View Product</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
