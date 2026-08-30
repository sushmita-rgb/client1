import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';

// 1. Read details from environment variables or defaults
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '6a93ca8b0039f02143d4';
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = 'riza_db';

async function setup() {
    console.log('🚀 Appwrite setup starting...');

    // 1. Create Database
    try {
        await databases.create(DB_ID, 'Riza DB');
        console.log('✅ Database "riza_db" created');
    } catch (e) {
        console.log('ℹ️ Database already exists or error:', e.message);
    }

    // 2. Create Products Collection
    // Helper to safely add attributes
    const safeAttr = async (fn, ...args) => {
        try { await fn(...args); console.log(`  + Attribute '${args[2]}' configured`); } 
        catch (e) { console.log(`  ℹ Attribute '${args[2]}': ${e.message}`); }
    };

    // 2. Products Collection
    try {
        await databases.createCollection(
            DB_ID, 'products', 'Products',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log('✅ Collection "products" created');
    } catch (e) {
        console.log('ℹ️ Products collection note:', e.message);
    }

    // Products Attributes
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'name', 255, true);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'category', 100, true);
    await safeAttr(databases.createFloatAttribute.bind(databases), DB_ID, 'products', 'price', true);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'description', 2000, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'imageId', 255, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'imageUrl', 1000, false);
    await safeAttr(databases.createBooleanAttribute.bind(databases), DB_ID, 'products', 'featured', false, false);
    await safeAttr(databases.createBooleanAttribute.bind(databases), DB_ID, 'products', 'bestCollection', false, false);
    await safeAttr(databases.createBooleanAttribute.bind(databases), DB_ID, 'products', 'available', false, true);
    await safeAttr(databases.createIntegerAttribute.bind(databases), DB_ID, 'products', 'views', false, 0, 999999, 0);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'products', 'createdAt', 100, false);

    // 3. Custom Requests Collection
    try {
        await databases.createCollection(
            DB_ID, 'custom_requests', 'Custom Requests',
            [
                Permission.create(Role.any()),
                Permission.read(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log('✅ Collection "custom_requests" created');
    } catch (e) {
        console.log('ℹ️ Custom requests collection note:', e.message);
    }

    // Custom Requests Attributes
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'name', 255, true);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'phone', 20, true);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'email', 255, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'category', 100, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'request', 255, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'message', 1000, false);
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'status', 50, false, 'pending');
    await safeAttr(databases.createStringAttribute.bind(databases), DB_ID, 'custom_requests', 'createdAt', 100, false);


    // 4. Create Storage Bucket
    try {
        await storage.createBucket(
            'product-images',
            'Product Images',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ],
            true, // fileSecurity
            true  // enabled
        );
        console.log('✅ Storage Bucket "product-images" created');
    } catch (e) {
        console.log('ℹ️ Bucket setup note:', e.message);
    }

    console.log('🎉 Setup successfully completed!');
}

setup();
