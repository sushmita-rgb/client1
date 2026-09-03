import { Client, Databases, Storage } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve(process.cwd(), '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2 && !line.trim().startsWith('#')) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
}

const OLD_ENDPOINT = process.env.OLD_APPWRITE_ENDPOINT || env.OLD_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const OLD_PROJECT_ID = process.env.OLD_APPWRITE_PROJECT_ID || env.OLD_APPWRITE_PROJECT_ID || '6a93ca8b0039f02143d4';
const OLD_DATABASE_ID = process.env.OLD_APPWRITE_DATABASE_ID || env.OLD_APPWRITE_DATABASE_ID || 'riza_db';
const OLD_API_KEY = process.env.OLD_APPWRITE_API_KEY || env.OLD_APPWRITE_API_KEY || env.APPWRITE_API_KEY;

const NEW_ENDPOINT = process.env.NEW_APPWRITE_ENDPOINT || env.NEW_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const NEW_PROJECT_ID = process.env.NEW_APPWRITE_PROJECT_ID || env.NEW_APPWRITE_PROJECT_ID || '6a9932fb003d3766f26b';
const NEW_DATABASE_ID = process.env.NEW_APPWRITE_DATABASE_ID || env.NEW_APPWRITE_DATABASE_ID || '6a993364000e5125dbd2';
const NEW_API_KEY = process.env.NEW_APPWRITE_API_KEY || env.NEW_APPWRITE_API_KEY || env.APPWRITE_API_KEY;

console.log('--- Appwrite Migration Configuration ---');
console.log(`OLD Project: ${OLD_PROJECT_ID} | DB: ${OLD_DATABASE_ID} | Endpoint: ${OLD_ENDPOINT}`);
console.log(`NEW Project: ${NEW_PROJECT_ID} | DB: ${NEW_DATABASE_ID} | Endpoint: ${NEW_ENDPOINT}`);
console.log('----------------------------------------\n');

if (!OLD_API_KEY || !NEW_API_KEY) {
  console.error('❌ Error: Missing API keys for Appwrite migration.');
  process.exit(1);
}

const oldClient = new Client().setEndpoint(OLD_ENDPOINT).setProject(OLD_PROJECT_ID).setKey(OLD_API_KEY);
const oldDatabases = new Databases(oldClient);
const oldStorage = new Storage(oldClient);

const newClient = new Client().setEndpoint(NEW_ENDPOINT).setProject(NEW_PROJECT_ID).setKey(NEW_API_KEY);
const newDatabases = new Databases(newClient);
const newStorage = new Storage(newClient);

async function waitForAttributes(dbId, colId, expectedCount) {
  console.log(`⏳ Waiting for attributes in collection '${colId}' to become available...`);
  while (true) {
    const list = await newDatabases.listAttributes(dbId, colId);
    const available = list.attributes.filter(a => a.status === 'available');
    const processing = list.attributes.filter(a => a.status === 'processing');
    const failed = list.attributes.filter(a => a.status === 'stuck' || a.status === 'failed');

    if (failed.length > 0) {
      throw new Error(`Attribute creation failed for keys: ${failed.map(a => a.key).join(', ')}`);
    }

    if (available.length >= expectedCount && processing.length === 0) {
      console.log(`✅ All ${available.length} attributes in '${colId}' are available.`);
      break;
    }

    console.log(`   Progress: ${available.length}/${expectedCount} available, ${processing.length} processing...`);
    await new Promise(res => setTimeout(res, 2000));
  }
}

async function migrateSchemaAndData() {
  const report = {
    tablesMigrated: [],
    totalRowsMigrated: 0,
    schemaMigrated: [],
    indexesMigrated: [],
    permissionsMigrated: [],
    storageStatus: '',
    verifications: []
  };

  // 1. Verify/Create NEW Database
  try {
    await newDatabases.get(NEW_DATABASE_ID);
    console.log(`✅ Target database '${NEW_DATABASE_ID}' exists.`);
  } catch (e) {
    if (e.code === 404) {
      console.log(`ℹ️ Target database '${NEW_DATABASE_ID}' not found. Creating database...`);
      await newDatabases.create(NEW_DATABASE_ID, 'Appwrite Database');
      console.log(`✅ Target database '${NEW_DATABASE_ID}' created.`);
    } else {
      throw e;
    }
  }

  // 2. Fetch OLD Collections
  const oldCollections = await oldDatabases.listCollections(OLD_DATABASE_ID);
  console.log(`📁 Found ${oldCollections.total} collections in OLD database.`);

  for (const oldCol of oldCollections.collections) {
    console.log(`\n========================================`);
    console.log(`Migrating Collection: ${oldCol.name} (${oldCol.$id})`);
    console.log(`========================================`);

    // Check if collection exists in NEW DB
    let newCol;
    try {
      newCol = await newDatabases.getCollection(NEW_DATABASE_ID, oldCol.$id);
      console.log(`ℹ️ Collection '${oldCol.$id}' already exists in NEW database.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`🔨 Creating collection '${oldCol.name}' (${oldCol.$id}) in NEW database...`);
        newCol = await newDatabases.createCollection(
          NEW_DATABASE_ID,
          oldCol.$id,
          oldCol.name,
          oldCol.$permissions || [],
          oldCol.documentSecurity || false,
          oldCol.enabled !== undefined ? oldCol.enabled : true
        );
        console.log(`✅ Collection '${oldCol.$id}' created.`);
      } else {
        throw e;
      }
    }

    report.permissionsMigrated.push({
      collection: oldCol.$id,
      permissions: oldCol.$permissions,
      documentSecurity: oldCol.documentSecurity
    });

    // Migrate Attributes
    const oldAttrs = await oldDatabases.listAttributes(OLD_DATABASE_ID, oldCol.$id);
    const existingNewAttrs = await newDatabases.listAttributes(NEW_DATABASE_ID, oldCol.$id);
    const existingKeys = new Set(existingNewAttrs.attributes.map(a => a.key));

    console.log(`📋 Found ${oldAttrs.attributes.length} attributes in OLD collection '${oldCol.$id}'.`);

    for (const attr of oldAttrs.attributes) {
      if (existingKeys.has(attr.key)) {
        console.log(`  ℹ️ Attribute '${attr.key}' already exists in NEW collection.`);
        continue;
      }

      console.log(`  ➕ Creating attribute '${attr.key}' (${attr.type})...`);
      switch (attr.type) {
        case 'string':
          if (attr.format === 'email') {
            await newDatabases.createEmailAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.default, attr.array);
          } else if (attr.format === 'url') {
            await newDatabases.createUrlAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.default, attr.array);
          } else if (attr.format === 'enum') {
            await newDatabases.createEnumAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.elements, attr.required, attr.default, attr.array);
          } else {
            await newDatabases.createStringAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.size || 255, attr.required, attr.default, attr.array, attr.encrypt);
          }
          break;
        case 'integer':
          await newDatabases.createIntegerAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
          break;
        case 'double':
        case 'float':
          await newDatabases.createFloatAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
          break;
        case 'boolean':
          await newDatabases.createBooleanAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.default, attr.array);
          break;
        case 'datetime':
          await newDatabases.createDatetimeAttribute(NEW_DATABASE_ID, oldCol.$id, attr.key, attr.required, attr.default, attr.array);
          break;
        default:
          console.warn(`⚠️ Unsupported attribute type '${attr.type}' for key '${attr.key}'`);
      }
    }

    // Wait for all attributes to be available
    await waitForAttributes(NEW_DATABASE_ID, oldCol.$id, oldAttrs.attributes.length);

    report.schemaMigrated.push({
      collection: oldCol.$id,
      attributesCount: oldAttrs.attributes.length,
      attributeKeys: oldAttrs.attributes.map(a => a.key)
    });

    // Migrate Indexes
    const oldIndexes = await oldDatabases.listIndexes(OLD_DATABASE_ID, oldCol.$id);
    const existingNewIndexes = await newDatabases.listIndexes(NEW_DATABASE_ID, oldCol.$id);
    const existingIdxKeys = new Set(existingNewIndexes.indexes.map(i => i.key));

    for (const idx of oldIndexes.indexes) {
      if (existingIdxKeys.has(idx.key)) {
        console.log(`  ℹ️ Index '${idx.key}' already exists in NEW collection.`);
        continue;
      }
      console.log(`  🔍 Creating index '${idx.key}' (${idx.type})...`);
      await newDatabases.createIndex(NEW_DATABASE_ID, oldCol.$id, idx.key, idx.type, idx.attributes, idx.orders);
    }

    report.indexesMigrated.push({
      collection: oldCol.$id,
      indexesCount: oldIndexes.indexes.length
    });

    // Migrate Documents
    const oldDocs = await oldDatabases.listDocuments(OLD_DATABASE_ID, oldCol.$id);
    console.log(`📦 Found ${oldDocs.total} documents in OLD collection '${oldCol.$id}'.`);

    let countMigrated = 0;
    for (const doc of oldDocs.documents) {
      // Clean system attributes
      const { $id, $createdAt, $updatedAt, $permissions, $databaseId, $collectionId, $sequence, ...docData } = doc;

      try {
        await newDatabases.createDocument(
          NEW_DATABASE_ID,
          oldCol.$id,
          $id, // Preserve original document ID
          docData,
          $permissions && $permissions.length > 0 ? $permissions : undefined
        );
        countMigrated++;
        console.log(`  ✅ Migrated document ID '${$id}'`);
      } catch (e) {
        if (e.code === 409) {
          console.log(`  ℹ️ Document ID '${$id}' already exists in NEW collection. Updating...`);
          await newDatabases.updateDocument(NEW_DATABASE_ID, oldCol.$id, $id, docData, $permissions);
          countMigrated++;
        } else {
          console.error(`  ❌ Failed to migrate document '${$id}':`, e.message);
          throw e;
        }
      }
    }

    // Verification step
    const newDocs = await newDatabases.listDocuments(NEW_DATABASE_ID, oldCol.$id);
    console.log(`🔍 Verification for '${oldCol.$id}': OLD count = ${oldDocs.total}, NEW count = ${newDocs.total}`);

    report.tablesMigrated.push(oldCol.$id);
    report.totalRowsMigrated += countMigrated;
    report.verifications.push({
      collection: oldCol.$id,
      oldTotal: oldDocs.total,
      newTotal: newDocs.total,
      matched: oldDocs.total === newDocs.total
    });
  }

  // 3. Migrate Storage Buckets
  console.log(`\n========================================`);
  console.log(`Migrating Storage Buckets`);
  console.log(`========================================`);
  const oldBuckets = await oldStorage.listBuckets();
  console.log(`🗄️ Found ${oldBuckets.total} storage buckets in OLD project.`);

  for (const bucket of oldBuckets.buckets) {
    try {
      await newStorage.getBucket(bucket.$id);
      console.log(`ℹ️ Bucket '${bucket.name}' (${bucket.$id}) already exists in NEW project.`);
    } catch (e) {
      if (e.code === 404) {
        console.log(`🔨 Creating bucket '${bucket.name}' (${bucket.$id}) in NEW project...`);
        await newStorage.createBucket(
          bucket.$id,
          bucket.name,
          bucket.$permissions || [],
          bucket.fileSecurity || false,
          bucket.enabled !== undefined ? bucket.enabled : true,
          bucket.maximumFileSize || undefined,
          bucket.allowedFileExtensions || undefined
        );
        console.log(`✅ Bucket '${bucket.$id}' created in NEW project.`);
      } else {
        throw e;
      }
    }

    const files = await oldStorage.listFiles(bucket.$id);
    console.log(`📄 Found ${files.total} files in bucket '${bucket.name}'.`);
    if (files.total === 0) {
      report.storageStatus = `Bucket '${bucket.$id}' provisioned (0 files present in old bucket).`;
    } else {
      report.storageStatus = `Bucket '${bucket.$id}' provisioned (${files.total} files present).`;
    }
  }

  console.log(`\n🎉 MIGRATION COMPLETED SUCCESSFULLY!`);
  console.log(JSON.stringify(report, null, 2));
}

migrateSchemaAndData().catch(err => {
  console.error('\n❌ Migration script failed:', err);
  process.exit(1);
});
