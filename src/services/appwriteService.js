import { databases, storage, account, APPWRITE_CONFIG, isAppwriteConfigured } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_PRODUCTS_KEY = 'aurellecharmsss_local_products';
const LOCAL_REQUESTS_KEY = 'aurellecharmsss_local_requests';
const LOCAL_USER_KEY = 'aurellecharmsss_local_user';
// Bump this version string whenever INITIAL_PRODUCTS changes so localStorage
// is automatically wiped and re-seeded with the latest products/images.
const PRODUCTS_SEED_VERSION = 'v4-aurellecharmsss-brand';
const LOCAL_SEED_VERSION_KEY = 'aurellecharmsss_products_seed_version';

// Helper to get local products from localStorage or initialize
const getLocalProducts = () => {
  // If the seed version changed, clear old cache so new images load immediately
  const storedVersion = localStorage.getItem(LOCAL_SEED_VERSION_KEY);
  if (storedVersion !== PRODUCTS_SEED_VERSION) {
    localStorage.removeItem(LOCAL_PRODUCTS_KEY);
    localStorage.setItem(LOCAL_SEED_VERSION_KEY, PRODUCTS_SEED_VERSION);
  }

  const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
};

const saveLocalProducts = (products) => {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
};


const getLocalRequests = () => {
  const stored = localStorage.getItem(LOCAL_REQUESTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const saveLocalRequests = (requests) => {
  localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(requests));
};

export const appwriteService = {
  // PRODUCTS
  async getProducts() {
    if (isAppwriteConfigured()) {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          [Query.orderDesc('createdAt'), Query.limit(100)]
        );
        if (response.documents.length > 0) {
          return response.documents;
        }
      } catch (err) {
        console.warn('Appwrite listDocuments failed, using local storage fallback:', err.message);
      }
    }
    return getLocalProducts();
  },

  async getProductById(id) {
    if (isAppwriteConfigured()) {
      try {
        return await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          id
        );
      } catch (err) {
        console.warn('Appwrite getDocument failed, checking local:', err.message);
      }
    }
    const localProds = getLocalProducts();
    return localProds.find((p) => p.$id === id || p.id === id) || null;
  },

  async incrementProductViews(id) {
    if (isAppwriteConfigured()) {
      try {
        const currentDoc = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          id
        );
        const newViews = (currentDoc.views || 0) + 1;
        return await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          id,
          { views: newViews }
        );
      } catch (err) {
        console.warn('Appwrite view count update failed:', err.message);
      }
    }
    
    // Fallback local update
    const prods = getLocalProducts();
    const index = prods.findIndex((p) => p.$id === id || p.id === id);
    if (index !== -1) {
      prods[index].views = (prods[index].views || 0) + 1;
      saveLocalProducts(prods);
      return prods[index];
    }
    return null;
  },

  async createProduct(productData, imageFile) {
    let imageUrl = productData.imageUrl || '/assets/bracelets/Customised_Bracelets_-removebg-preview.png';
    let imageId = productData.imageId || '';

    // If image file is uploaded and Appwrite is configured
    if (imageFile) {
      if (isAppwriteConfigured()) {
        try {
          const uploadedFile = await storage.createFile(
            APPWRITE_CONFIG.bucketId,
            ID.unique(),
            imageFile
          );
          imageId = uploadedFile.$id;
          imageUrl = storage.getFilePreview(APPWRITE_CONFIG.bucketId, imageId).href;
        } catch (err) {
          console.warn('Appwrite Storage upload failed, creating object URL:', err.message);
          imageUrl = URL.createObjectURL(imageFile);
        }
      } else {
        imageUrl = URL.createObjectURL(imageFile);
      }
    }

    const payload = {
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price),
      description: productData.description,
      imageId,
      imageUrl,
      featured: Boolean(productData.featured),
      bestCollection: Boolean(productData.bestCollection),
      available: productData.available !== undefined ? Boolean(productData.available) : true,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    if (isAppwriteConfigured()) {
      try {
        return await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          ID.unique(),
          payload
        );
      } catch (err) {
        console.warn('Appwrite document creation failed, storing locally:', err.message);
      }
    }

    // Local fallback creation
    const prods = getLocalProducts();
    const newDoc = {
      $id: 'prod-local-' + Date.now(),
      ...payload,
    };
    prods.unshift(newDoc);
    saveLocalProducts(prods);
    return newDoc;
  },

  async updateProduct(id, productData, newImageFile) {
    let imageUrl = productData.imageUrl;
    let imageId = productData.imageId;

    if (newImageFile) {
      if (isAppwriteConfigured()) {
        try {
          const uploadedFile = await storage.createFile(
            APPWRITE_CONFIG.bucketId,
            ID.unique(),
            newImageFile
          );
          imageId = uploadedFile.$id;
          imageUrl = storage.getFilePreview(APPWRITE_CONFIG.bucketId, imageId).href;
        } catch (err) {
          console.warn('Storage upload error:', err.message);
          imageUrl = URL.createObjectURL(newImageFile);
        }
      } else {
        imageUrl = URL.createObjectURL(newImageFile);
      }
    }

    const payload = {
      name: productData.name,
      category: productData.category,
      price: parseFloat(productData.price),
      description: productData.description,
      imageId,
      imageUrl,
      featured: Boolean(productData.featured),
      bestCollection: Boolean(productData.bestCollection),
      available: Boolean(productData.available),
    };

    if (isAppwriteConfigured()) {
      try {
        return await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          id,
          payload
        );
      } catch (err) {
        console.warn('Appwrite update failed:', err.message);
      }
    }

    // Local update
    const prods = getLocalProducts();
    const index = prods.findIndex((p) => p.$id === id || p.id === id);
    if (index !== -1) {
      prods[index] = { ...prods[index], ...payload };
      saveLocalProducts(prods);
      return prods[index];
    }
    return null;
  },

  async deleteProduct(id, imageId) {
    if (isAppwriteConfigured()) {
      try {
        await databases.deleteDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.productsCollectionId,
          id
        );
        if (imageId) {
          try {
            await storage.deleteFile(APPWRITE_CONFIG.bucketId, imageId);
          } catch (e) {
            // file delete optional ignore
          }
        }
      } catch (err) {
        console.warn('Appwrite document delete failed:', err.message);
      }
    }

    // Local fallback delete
    const prods = getLocalProducts();
    const filtered = prods.filter((p) => p.$id !== id && p.id !== id);
    saveLocalProducts(filtered);
    return true;
  },

  // CUSTOM REQUESTS
  async createCustomRequest(requestData) {
    const payload = {
      name: requestData.name,
      phone: requestData.phone,
      email: requestData.email,
      category: requestData.category,
      request: requestData.request,
      message: requestData.message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    if (isAppwriteConfigured()) {
      try {
        return await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.requestsCollectionId,
          ID.unique(),
          payload
        );
      } catch (err) {
        console.warn('Appwrite custom request create failed:', err.message);
      }
    }

    // Local fallback
    const requests = getLocalRequests();
    const newDoc = {
      $id: 'req-' + Date.now(),
      ...payload,
    };
    requests.unshift(newDoc);
    saveLocalRequests(requests);
    return newDoc;
  },

  async getCustomRequests() {
    if (isAppwriteConfigured()) {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.requestsCollectionId,
          [Query.orderDesc('createdAt')]
        );
        if (response.documents.length > 0) {
          return response.documents;
        }
      } catch (err) {
        console.warn('Appwrite list custom requests failed:', err.message);
      }
    }
    return getLocalRequests();
  },

  async updateRequestStatus(id, newStatus) {
    if (isAppwriteConfigured()) {
      try {
        return await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.requestsCollectionId,
          id,
          { status: newStatus }
        );
      } catch (err) {
        console.warn('Appwrite request status update failed:', err.message);
      }
    }

    const requests = getLocalRequests();
    const index = requests.findIndex((r) => r.$id === id || r.id === id);
    if (index !== -1) {
      requests[index].status = newStatus;
      saveLocalRequests(requests);
      return requests[index];
    }
    return null;
  },

  // AUTHENTICATION
  async signup(email, password, name) {
    if (isAppwriteConfigured()) {
      try {
        await account.create(ID.unique(), email, password, name);
        return await account.createEmailPasswordSession(email, password);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    // Local session simulation
    const user = {
      $id: 'usr-' + Date.now(),
      email,
      name: name || email.split('@')[0],
      isAdmin: email.toLowerCase().includes('admin'),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return user;
  },

  async login(email, password) {
    if (isAppwriteConfigured()) {
      try {
        return await account.createEmailPasswordSession(email, password);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    const isAdmin = email.toLowerCase().includes('admin') || password === 'admin123';
    const user = {
      $id: 'usr-' + Date.now(),
      email,
      name: email.split('@')[0].toUpperCase(),
      isAdmin,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return user;
  },

  async getCurrentUser() {
    if (isAppwriteConfigured()) {
      try {
        const acc = await account.get();
        return {
          ...acc,
          isAdmin: acc.email === import.meta.env.VITE_ADMIN_EMAIL || acc.email?.includes('admin'),
        };
      } catch (err) {
        return null;
      }
    }
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  async logout() {
    if (isAppwriteConfigured()) {
      try {
        await account.deleteSession('current');
      } catch (err) {
        // ignore
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    return true;
  },
};
