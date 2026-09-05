import { databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID, Query } from 'appwrite';

const { databaseId, productsCollectionId, requestsCollectionId } = APPWRITE_CONFIG;

// Appwrite is the only source of truth. There is no localStorage mirror: a silent
// fallback is how an empty/misconfigured database looked like a working site.
// Reads return what the server returns (including []); writes throw so the caller
// can show the real failure.

export const appwriteService = {
  // ---------- PRODUCTS (public read) ----------
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

  // ---------- CUSTOM REQUESTS (anyone may create) ----------
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
};
