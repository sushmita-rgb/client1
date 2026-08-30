import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { products } = useProducts();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#1E293B]/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-soft-lg border border-[#EBE3D5] overflow-hidden flex flex-col">
        {/* Search Input Header */}
        <div className="relative flex items-center px-6 py-4 border-b border-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#5C728A] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bracelets, keychains, charms..."
            className="w-full bg-transparent text-base sm:text-lg font-serif text-[#2C3E50] placeholder-[#94A3B8] focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#5C728A] hover:text-[#2C3E50] rounded-full hover:bg-[#F4EFE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Quick Suggestions */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#5C728A] uppercase mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Pearl Bracelet', 'Blossom Keychain', 'Phone Strap', 'Gift Combo'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#EBF3FA] text-[#4A607A] border border-[#EBE3D5] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-[#5C728A] uppercase mb-2">
                Found {results.length} item{results.length > 1 ? 's' : ''}
              </p>
              {results.map((product) => (
                <div
                  key={product.$id || product.id}
                  onClick={() => handleSelect(product.$id || product.id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#EBF3FA] to-[#FAF7F2] flex items-center justify-center shrink-0 border border-[#EBE3D5]">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-contain drop-shadow-sm"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[#2C3E50] group-hover:text-[#4A607A] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#5C728A]">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-[#2C3E50]">₹{product.price}</span>
                    <ArrowRight className="w-4 h-4 text-[#5C728A] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm font-serif text-[#5C728A]">No handmade products found matching "{query}"</p>
              <p className="text-xs text-[#94A3B8] mt-1">Try searching for bracelets, keychains, or phone charms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
