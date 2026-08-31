import { Client, Databases, ID, Query } from 'node-appwrite';
import { INITIAL_PRODUCTS } from './src/data/initialProducts.js';

const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '6a93ca8b0039f02143d4';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_3c311bd14dae6f62426fe460c066b379af27f0a0db3fd1fc0238800452ad5de355d103805c2cf44ec8aed41b2f239d77175c3da76deb69bef2f12380fcad397896a550a0edfe9801e465fb7a8876095c8e89a91ca05ec1f581b4d5cdcc74e9a1b124455dc33b7f11bb93a0422d872b80fc5a2082808489780f93b0da5c08462f';
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function revertAndUploadOriginalOrder() {
    console.log('🧹 Clearing existing products from Appwrite...');
    try {
        const existing = await databases.listDocuments('aurellecharmsss_db', 'products', [Query.limit(100)]);
        for (const doc of existing.documents) {
            await databases.deleteDocument('aurellecharmsss_db', 'products', doc.$id);
        }
        console.log(`✅ Cleared ${existing.documents.length} existing products.`);
    } catch (e) {
        console.log('ℹ️ Clearing step note:', e.message);
    }

    console.log(`📦 Uploading ${INITIAL_PRODUCTS.length} products in original order (Product #1 -> #22)...`);

    for (const p of INITIAL_PRODUCTS) {
        try {
            await databases.createDocument(
                'aurellecharmsss_db',
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
