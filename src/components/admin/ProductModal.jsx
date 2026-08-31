import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export default function ProductModal({ isOpen, onClose, editProductData = null }) {
  const { addProduct, editProduct, categories } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Bracelets',
    price: '',
    description: '',
    featured: false,
    bestCollection: false,
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProductData) {
      setFormData({
        name: editProductData.name || '',
        category: editProductData.category || 'Bracelets',
        price: editProductData.price || '',
        description: editProductData.description || '',
        featured: Boolean(editProductData.featured),
        bestCollection: Boolean(editProductData.bestCollection),
        available: editProductData.available !== undefined ? Boolean(editProductData.available) : true,
      });
      setImagePreview(editProductData.imageUrl || '');
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        category: 'Bracelets',
        price: '',
        description: '',
        featured: false,
        bestCollection: false,
        available: true,
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [editProductData, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file); // raw file for Appwrite storage if available
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      setError('Please fill in product name, price, and description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editProductData) {
        await editProduct(
          editProductData.$id || editProductData.id,
          {
            ...formData,
            imageUrl: editProductData.imageUrl,
            imageId: editProductData.imageId,
          },
          imageFile
        );
      } else {
        await addProduct(formData, imageFile);
      }
      onClose();
    } catch (err) {
      setError('Failed to save product. Please check your network and Appwrite setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-serif text-xl font-semibold text-slate-800">
            {editProductData ? 'Edit Product' : '+ Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Image Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
              Product Image *
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">No Image</span>
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center text-xs font-semibold uppercase px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors">
                <Upload className="w-4 h-4 mr-2 text-[#4A607A]" />
                <span>Upload Image to Storage</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Celestial Pearl Bracelet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price in ₹ */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 399"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
                Availability Status
              </label>
              <select
                value={formData.available ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, available: e.target.value === 'true' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Description *
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed handcrafted product description..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-[#4A607A] rounded"
              />
              <span className="text-xs font-semibold text-slate-700">Feature on Home Page</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bestCollection}
                onChange={(e) => setFormData({ ...formData, bestCollection: e.target.checked })}
                className="w-4 h-4 accent-[#4A607A] rounded"
              />
              <span className="text-xs font-semibold text-slate-700">Include in Best Collection</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase text-white bg-[#4A607A] hover:bg-[#2C3E50] shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : editProductData ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
