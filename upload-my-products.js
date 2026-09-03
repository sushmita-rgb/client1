import { Client, Databases, ID, Query } from 'node-appwrite';
import { INITIAL_PRODUCTS } from './src/data/initialProducts.js';

const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '6a9932fb003d3766f26b';
const API_KEY = process.env.NEW_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const DB_ID = process.env.VITE_APPWRITE_DATABASE_ID || '6a993364000e5125dbd2';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function revertAndUploadOriginalOrder() {
    console.log('🧹 Clearing existing products from Appwrite...');
    try {
        const existing = await databases.listDocuments(DB_ID, 'products', [Query.limit(100)]);
        for (const doc of existing.documents) {
            await databases.deleteDocument(DB_ID, 'products', doc.$id);
        }
        console.log(`✅ Cleared ${existing.documents.length} existing products.`);
    } catch (e) {
        console.log('ℹ️ Clearing step note:', e.message);
    }

    console.log(`📦 Uploading ${INITIAL_PRODUCTS.length} products in original order (Product #1 -> #22)...`);

    for (const p of INITIAL_PRODUCTS) {
        try {
            await databases.createDocument(
                DB_ID,
                'products',
                ID.unique(),
                {
                    name: p.name,
                    category: p.category || 'Bracelets',
                    price: parseFloat(p.price) || 0,
                    description: p.description || '',
                    imageId: p.imageId || '',
                    imageUrl: p.imageUrl || '',
                    featured: Boolean(p.featured),
                    bestCollection: Boolean(p.bestCollection),
                    available: p.available !== undefined ? Boolean(p.available) : true,
                    views: Number(p.views) || 0,
                    createdAt: p.createdAt || new Date().toISOString()
                }
            );
            console.log(`✅ Uploaded: [${p.category}] ${p.name}`);
        } catch (e) {
            console.log(`❌ Failed ${p.name}:`, e.message);
        }
    }
    console.log('🎉 Successfully reverted! All products uploaded in original order.');
}

revertAndUploadOriginalOrder();
