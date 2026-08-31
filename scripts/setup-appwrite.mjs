/**
 * Appwrite Automated Setup Script
 * 
 * Usage:
 * Set APPWRITE_API_KEY environment variable and run:
 * node scripts/setup-appwrite.mjs
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !apiKey) {
  console.log('Appwrite Setup Info: To automatically provision Appwrite collections via API, specify VITE_APPWRITE_PROJECT_ID and APPWRITE_API_KEY.');
  console.log('Otherwise, you can manually create the database "aurellecharmsss_db", collections "products", "custom_requests", "analytics", and bucket "product-images" in the Appwrite Console.');
  process.exit(0);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = 'aurellecharmsss_db';
const BUCKET_ID = 'product-images';

async function setup() {
  try {
    console.log('Creating database "aurellecharmsss_db"...');
    try {
      await databases.create(DB_ID, 'AurelleCharmsss Database');
    } catch (e) {
      console.log('Database aurellecharmsss_db already exists or error:', e.message);
    }

    // 1. Create Products collection
    console.log('Creating "products" collection...');
    try {
      await databases.createCollection(DB_ID, 'products', 'Products', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]);

      // Add attributes
      await databases.createStringAttribute(DB_ID, 'products', 'name', 255, true);
      await databases.createStringAttribute(DB_ID, 'products', 'category', 100, true);
      await databases.createFloatAttribute(DB_ID, 'products', 'price', true);
      await databases.createStringAttribute(DB_ID, 'products', 'description', 2000, true);
      await databases.createStringAttribute(DB_ID, 'products', 'imageId', 255, false);
      await databases.createStringAttribute(DB_ID, 'products', 'imageUrl', 1000, true);
      await databases.createBooleanAttribute(DB_ID, 'products', 'featured', false, false);
      await databases.createBooleanAttribute(DB_ID, 'products', 'bestCollection', false, false);
      await databases.createBooleanAttribute(DB_ID, 'products', 'available', false, true);
      await databases.createIntegerAttribute(DB_ID, 'products', 'views', false, 0);
      await databases.createStringAttribute(DB_ID, 'products', 'createdAt', 100, true);
      console.log('Products collection configured successfully.');
    } catch (e) {
      console.log('Products collection setup note:', e.message);
    }

    // 2. Create Custom Requests collection
    console.log('Creating "custom_requests" collection...');
    try {
      await databases.createCollection(DB_ID, 'custom_requests', 'Custom Requests', [
        Permission.read(Role.users()),
        Permission.create(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]);

      await databases.createStringAttribute(DB_ID, 'custom_requests', 'name', 255, true);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'phone', 50, true);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'email', 255, true);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'category', 100, true);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'request', 2000, true);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'message', 2000, false);
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'status', 50, false, 'New');
      await databases.createStringAttribute(DB_ID, 'custom_requests', 'createdAt', 100, true);
      console.log('Custom Requests collection configured successfully.');
    } catch (e) {
      console.log('Custom Requests collection note:', e.message);
    }

    // 3. Create Storage Bucket
    console.log('Creating "product-images" bucket...');
    try {
      await storage.createBucket(BUCKET_ID, 'Product Images', [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ], false, true, 10485760, ['jpg', 'jpeg', 'png', 'webp', 'svg']);
      console.log('Storage bucket product-images created.');
    } catch (e) {
      console.log('Storage bucket note:', e.message);
    }

    console.log('Appwrite setup complete!');
  } catch (error) {
    console.error('Setup error:', error);
  }
}

setup();
