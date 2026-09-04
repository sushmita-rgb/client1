import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductModal from '../../components/admin/ProductModal';
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useProducts();
  const [deleteError, setDeleteError] = React.useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleteError('');
    try {
      await deleteProduct(deletingId);
      setDeletingId(null);
    } catch (err) {
      // Writes throw now; without this the dialog closed as if the delete worked.
      setDeleteError(err?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl text-slate-800 font-bold">
            Product Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, update, or remove handmade ornaments from Appwrite Database
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[#4A607A] hover:bg-[#2C3E50] text-white px-5 py-3 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>+ ADD PRODUCT</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase">
          Total Products: {filtered.length}
        </span>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map((prod) => {
                const id = prod.$id || prod.id;
                return (
                  <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Image & Name */}
                    <td className="py-3 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#EBF3FA] to-[#FAF7F2] border border-slate-200 shrink-0 flex items-center justify-center">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 object-contain drop-shadow-sm"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-800 line-clamp-1">{prod.name}</p>
                          {prod.featured && (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>


                    {/* Category */}
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      ₹{prod.price}
                    </td>


                    {/* Status */}
                    <td className="py-3 px-4">
                      {prod.available !== false ? (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {prod.createdAt ? new Date(prod.createdAt).toLocaleDateString() : '2026-08-01'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No products found matching your search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editProductData={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-slate-800">
              Delete Product?
            </h3>
            <p className="text-xs text-slate-500">
              This will permanently delete the item document from Appwrite Database and clean up associated image storage.
            </p>
            {deleteError && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {deleteError}
              </p>
            )}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => { setDeletingId(null); setDeleteError(''); }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
