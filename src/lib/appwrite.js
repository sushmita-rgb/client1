import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a9932fb003d3766f26b';

export const client = new Client();

if (projectId && projectId !== 'your_appwrite_project_id') {
  client
    .setEndpoint(endpoint)
    .setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '6a993364000e5125dbd2',
  productsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_PRODUCTS || 'products',
  requestsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_REQUESTS || 'custom_requests',
  analyticsCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ANALYTICS || 'analytics',
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_PRODUCT_IMAGES || 'product-images',
};

export const isAppwriteConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_APPWRITE_PROJECT_ID) &&
    import.meta.env.VITE_APPWRITE_PROJECT_ID !== 'your_appwrite_project_id' &&
    import.meta.env.VITE_APPWRITE_PROJECT_ID !== 'aurellecharmsss_project'
  );
};
