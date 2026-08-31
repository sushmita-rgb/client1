import { databases, storage, account, APPWRITE_CONFIG, isAppwriteConfigured } from '../lib/appwrite';
import { ID, Query } from 'appwrite';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_PRODUCTS_KEY = 'aurellecharmsss_local_products';
const LOCAL_REQUESTS_KEY = 'aurellecharmsss_local_requests';
const LOCAL_INQUIRIES_KEY = 'aurellecharmsss_local_inquiries';
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

const getLocalInquiries = () => {
  const stored = localStorage.getItem(LOCAL_INQUIRIES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

const saveLocalInquiries = (inquiries) => {
  localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
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
          console.warn('Appwrite Storage upload failed, converting to Base64:', err.message);
          imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageFile);
          });
        }
      } else if (typeof imageFile === 'string') {
        imageUrl = imageFile;
      } else if (imageFile instanceof File) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
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
          if (newImageFile instanceof File) {
            imageUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(newImageFile);
            });
          }
        }
      } else if (typeof newImageFile === 'string') {
        imageUrl = newImageFile;
      } else if (newImageFile instanceof File) {
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(newImageFile);
        });
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

  // PRODUCT INQUIRIES
  async getProductInquiries() {
    if (isAppwriteConfigured()) {
      try {
        const response = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          'product_inquiries',
          [Query.orderDesc('$createdAt'), Query.limit(100)]
        );
        if (response.documents.length > 0) return response.documents;
      } catch (e) {
        console.warn('Appwrite list product inquiries failed, using local fallback:', e.message);
      }
    }
    return getLocalInquiries();
  },

  async createProductInquiry(inquiryData) {
    const payload = {
      productId: inquiryData.productId || '',
      productName: inquiryData.productName || 'Unknown Product',
      productImage: inquiryData.productImage || '',
      productPrice: inquiryData.productPrice || 0,
      userName: inquiryData.userName || 'Guest Visitor',
      userEmail: inquiryData.userEmail || '',
      status: 'New Inquiry',
      createdAt: new Date().toISOString(),
    };

    if (isAppwriteConfigured()) {
      try {
        return await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          'product_inquiries',
          ID.unique(),
          payload
        );
      } catch (e) {
        console.warn('Appwrite inquiry document creation failed, using local fallback:', e.message);
      }
    }

    const inquiries = getLocalInquiries();
    const newDoc = {
      $id: 'inq-local-' + Date.now(),
      ...payload,
    };
    inquiries.unshift(newDoc);
    saveLocalInquiries(inquiries);
    return newDoc;
  },

  async updateInquiryStatus(id, status) {
    if (isAppwriteConfigured()) {
      try {
        return await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          'product_inquiries',
          id,
          { status }
        );
      } catch (e) {
        console.warn('Appwrite inquiry status update failed:', e.message);
      }
    }

    const inquiries = getLocalInquiries();
    const index = inquiries.findIndex((i) => i.$id === id || i.id === id);
    if (index !== -1) {
      inquiries[index].status = status;
      saveLocalInquiries(inquiries);
      return inquiries[index];
    }
    return null;
  },

  async deleteInquiry(id) {
    if (isAppwriteConfigured()) {
      try {
        await databases.deleteDocument(
          APPWRITE_CONFIG.databaseId,
          'product_inquiries',
          id
        );
      } catch (e) {
        console.warn('Appwrite inquiry delete failed:', e.message);
      }
    }

    const inquiries = getLocalInquiries();
    const updated = inquiries.filter((i) => i.$id !== id && i.id !== id);
    saveLocalInquiries(updated);
    return true;
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
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both your email address and password to sign in.');
    }

    const isAdminCreds =
      (cleanEmail === 'aurellecharmsss.gmail.com' ||
       cleanEmail === 'aurellecharmsss@gmail.com' ||
       cleanEmail === 'admin@aurellecharmsss.com') &&
      cleanPassword === 'aurellecharmsss4044';

    if (isAppwriteConfigured()) {
      try {
        return await account.createEmailPasswordSession(cleanEmail, cleanPassword);
      } catch (err) {
        if (!isAdminCreds) {
          throw new Error(err.message || 'Invalid email address or password.');
        }
      }
    }

    if (isAdminCreds) {
      const user = {
        $id: 'usr-admin-' + Date.now(),
        email: cleanEmail,
        name: 'AURELLECHARMSSS ADMIN',
        isAdmin: true,
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return user;
    }

    const user = {
      $id: 'usr-' + Date.now(),
      email: cleanEmail,
      name: (cleanEmail.split('@')[0] || 'User').toUpperCase(),
      isAdmin: false,
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
          isAdmin:
            acc.email === 'aurellecharmsss.gmail.com' ||
            acc.email === 'aurellecharmsss@gmail.com' ||
            acc.email === import.meta.env.VITE_ADMIN_EMAIL ||
            acc.email?.includes('admin'),
        };
      } catch (err) {
        return null;
      }
    }
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          parsed.email === 'aurellecharmsss.gmail.com' ||
          parsed.email === 'aurellecharmsss@gmail.com' ||
          parsed.email?.includes('admin')
        ) {
          parsed.isAdmin = true;
        }
        return parsed;
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
