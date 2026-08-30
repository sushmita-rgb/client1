import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FolderTree, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { categories, setCategories, products } = useProducts();
  const [newCat, setNewCat] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (!categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setSuccessMsg(`Category "${newCat.trim()}" added successfully.`);
      setNewCat('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleDeleteCategory = (catToDelete) => {
    setCategories(categories.filter((c) => c !== catToDelete));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <h1 className="font-serif text-2xl text-slate-800 font-bold">
          Category Management
        </h1>
        <p className="text-xs text-slate-500">
          Manage product categories and storefront filtering classifications
        </p>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-semibold text-slate-800 flex items-center">
          <FolderTree className="w-5 h-5 mr-2 text-[#4A607A]" />
          <span>Add New Category</span>
        </h3>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Category name (e.g. Combo Gift Sets)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#4A607A] hover:bg-[#2C3E50] text-white text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add Category</span>
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <div
              key={cat}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <h4 className="font-serif text-lg font-semibold text-slate-800">{cat}</h4>
                <p className="text-xs text-slate-400 font-medium">{count} products assigned</p>
              </div>

              {['Bracelets', 'Keychains', 'Mobile Keychains', 'Best Collection'].includes(cat) ? (
                <span className="text-[10px] uppercase font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  SYSTEM CORE
                </span>
              ) : (
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 transition-colors"
                  title="Remove category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
