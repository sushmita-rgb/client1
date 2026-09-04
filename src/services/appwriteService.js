import { databases, storage, account, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const { databaseId, productsCollectionId, requestsCollectionId, inquiriesCollectionId, bucketId } =
  APPWRITE_CONFIG;

// Appwrite is the only source of truth. There is no localStorage mirror: a silent
// fallback is how an empty/misconfigured database looked like a working site.
// Reads return what the server returns (including []); writes throw so the caller
// can show the real failure.

// /preview (Appwrite's image transforms) is paid-plan only and 403s here, so the
// file is uploaded and served as-is via /view. Compress before uploading.
const uploadImage = async (file) => {
  const uploaded = await storage.createFile(bucketId, ID.unique(), file);
  return { imageId: uploaded.$id, imageUrl: storage.getFileView(bucketId, uploaded.$id) };
};

const productPayload = (d, imageId, imageUrl) => ({
  name: d.name,
  category: d.category,
  price: parseFloat(d.price) || 0,
  description: d.description || '',
  imageId: imageId || '',
  imageUrl: imageUrl || '',
  featured: Boolean(d.featured),
  bestCollection: Boolean(d.bestCollection),
  available: d.available !== undefined ? Boolean(d.available) : true,
});

export const appwriteService = {
  // ---------- PRODUCTS (public read, admin write) ----------
  async getProducts() {
    const res = await databases.listDocuments(databaseId, productsCollectionId, [
      Query.orderDesc('createdAt'),
      Query.limit(100),
    ]);
    return res.documents;
  },

  async getProductById(id) {
    return databases.getDocument(databaseId, productsCollectionId, id);
  },

  async createProduct(productData, imageFile) {
    let { imageId, imageUrl } = productData;
    if (imageFile instanceof File) ({ imageId, imageUrl } = await uploadImage(imageFile));
    else if (typeof imageFile === 'string' && imageFile) imageUrl = imageFile;

    return databases.createDocument(databaseId, productsCollectionId, ID.unique(), {
      ...productPayload(productData, imageId, imageUrl),
      createdAt: new Date().toISOString(),
    });
  },

  async updateProduct(id, productData, newImageFile) {
    let { imageId, imageUrl } = productData;
    if (newImageFile instanceof File) ({ imageId, imageUrl } = await uploadImage(newImageFile));
    else if (typeof newImageFile === 'string' && newImageFile) imageUrl = newImageFile;

    return databases.updateDocument(
      databaseId,
      productsCollectionId,
      id,
      productPayload(productData, imageId, imageUrl)
    );
  },

  async deleteProduct(id, imageId) {
    await databases.deleteDocument(databaseId, productsCollectionId, id);
    if (imageId) {
      // The document is already gone; a stale file must not fail the delete.
      await storage.deleteFile(bucketId, imageId).catch(() => {});
    }
    return true;
  },

  // ---------- CUSTOM REQUESTS (anyone may create, admin reads) ----------
  async createCustomRequest(requestData) {
    return databases.createDocument(databaseId, requestsCollectionId, ID.unique(), {
      name: requestData.name,
      phone: requestData.phone,
      email: requestData.email,
      category: requestData.category,
      request: requestData.request,
      message: requestData.message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    });
  },

  async getCustomRequests() {
    const res = await databases.listDocuments(databaseId, requestsCollectionId, [
      Query.orderDesc('createdAt'),
      Query.limit(100),
    ]);
    return res.documents;
  },

  async updateRequestStatus(id, status) {
    return databases.updateDocument(databaseId, requestsCollectionId, id, { status });
  },

  // ---------- PRODUCT INQUIRIES (anyone may create, admin reads) ----------
  async getProductInquiries() {
    const res = await databases.listDocuments(databaseId, inquiriesCollectionId, [
      Query.orderDesc('createdAt'),
      Query.limit(100),
    ]);
    return res.documents;
  },

  async createProductInquiry(inquiryData) {
    return databases.createDocument(databaseId, inquiriesCollectionId, ID.unique(), {
      productId: inquiryData.productId || '',
      productName: inquiryData.productName || 'Unknown Product',
      productImage: inquiryData.productImage || '',
      productPrice: inquiryData.productPrice || 0,
      userName: inquiryData.userName || 'Guest Visitor',
      userEmail: inquiryData.userEmail || '',
      status: 'New Inquiry',
      createdAt: new Date().toISOString(),
    });
  },

  async updateInquiryStatus(id, status) {
    return databases.updateDocument(databaseId, inquiriesCollectionId, id, { status });
  },

  async deleteInquiry(id) {
    await databases.deleteDocument(databaseId, inquiriesCollectionId, id);
    return true;
  },

  // ---------- AUTHENTICATION ----------
  // One Appwrite auth user is the admin. Everyone else browses anonymously —
  // there are no customer accounts. This flag only drives UI routing; the real
  // gate is the collection permissions, which are scoped to the admin's user id.
  async login(email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();
    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both your email address and password to sign in.');
    }
    // A stale session blocks createEmailPasswordSession with a 401.
    await account.deleteSession('current').catch(() => {});
    await account.createEmailPasswordSession(cleanEmail, cleanPassword);
    return this.getCurrentUser();
  },

  async getCurrentUser() {
    const acc = await account.get();
    return { ...acc, isAdmin: acc.$id === APPWRITE_CONFIG.adminUserId };
  },

  async logout() {
    await account.deleteSession('current').catch(() => {});
    return true;
  },
};
