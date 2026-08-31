import React, { useState } from 'react';
import { isAppwriteConfigured } from '../../lib/appwrite';
import { Settings, ShieldCheck, Database, Key, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
        <h1 className="font-serif text-2xl text-slate-800 font-bold">
          Store Settings & Appwrite Backend
        </h1>
        <p className="text-xs text-slate-500">
          Configure backend API endpoints, database collection IDs, and store information
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-lg font-semibold text-slate-800 flex items-center">
              <Database className="w-5 h-5 mr-2 text-[#4A607A]" />
              <span>Appwrite Status</span>
            </h3>
            <p className="text-xs text-slate-500">Live connection diagnostic status</p>
          </div>
          {isAppwriteConfigured() ? (
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Connected to Appwrite Cloud
            </span>
          ) : (
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Running with Local Persistence Wrapper
            </span>
          )}
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-semibold text-slate-500 mb-1">Database ID</label>
              <input
                type="text"
                readOnly
                value={import.meta.env.VITE_APPWRITE_DATABASE_ID || 'aurellecharmsss_db'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-slate-500 mb-1">Storage Bucket ID</label>
              <input
                type="text"
                readOnly
                value={import.meta.env.VITE_APPWRITE_BUCKET_PRODUCT_IMAGES || 'product-images'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-semibold text-slate-800">Automated Appwrite Provisioning Script</h4>
            <p className="text-slate-500">
              Run <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono">node scripts/setup-appwrite.mjs</code> to automatically provision Appwrite database collections and permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
