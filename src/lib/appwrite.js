import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error(
    'Appwrite is not configured. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID in .env'
  );
}

export const client = new Client().setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  productsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_PRODUCTS || 'products',
  requestsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_REQUESTS || 'custom_requests',
  inquiriesCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_INQUIRIES || 'product_inquiries',
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_PRODUCT_IMAGES || 'product-images',
  // The single Appwrite auth user allowed into /admin.
  adminUserId: import.meta.env.VITE_ADMIN_USER_ID,
};
