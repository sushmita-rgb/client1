import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { appwriteService } from '../services/appwriteService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [categories, setCategories] = useState([
    'Bracelets',
    'Keychains',
    'Mobile Keychains',
    'Best Collection',
  ]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await appwriteService.getProducts());
    } catch (e) {
      console.error('Error loading products:', e);
      setError(e.message || 'Could not load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    // Check in-memory first
    const match = products.find((p) => p.$id === id || p.id === id);
    if (match) return match;
    return await appwriteService.getProductById(id);
  };

  const addProduct = async (productData, imageFile) => {
    const newDoc = await appwriteService.createProduct(productData, imageFile);
    if (newDoc) {
      setProducts((prev) => [newDoc, ...prev]);
    }
    return newDoc;
  };

  const editProduct = async (id, productData, newImageFile) => {
    const updated = await appwriteService.updateProduct(id, productData, newImageFile);
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => ((p.$id === id || p.id === id) ? updated : p))
      );
    }
    return updated;
  };

  const deleteProduct = async (id, imageId) => {
    const success = await appwriteService.deleteProduct(id, imageId);
    if (success) {
      setProducts((prev) => prev.filter((p) => p.$id !== id && p.id !== id));
    }
    return success;
  };

  // Filtered & Sorted Products calculation
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      if (selectedCategory === 'Best Collection') {
        list = list.filter((p) => p.bestCollection || (p.category && p.category.trim().toLowerCase() === 'best collection'));
      } else {
        const targetCategory = selectedCategory.trim().toLowerCase();
        list = list.filter((p) => p.category && p.category.trim().toLowerCase() === targetCategory);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Price Filter
    list = list.filter((p) => (p.price || 0) <= maxPriceFilter);

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      // default newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, maxPriceFilter]);

  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured).slice(0, 4);
  }, [products]);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        featuredProducts,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        maxPriceFilter,
        setMaxPriceFilter,
        categories,
        setCategories,
        loadProducts,
        getProduct,
        addProduct,
        editProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
