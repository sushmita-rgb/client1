import React from 'react';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import { useProducts } from '../../context/ProductContext';
import { Eye, TrendingUp, Info } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { products } = useProducts();
  const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl text-slate-800 font-bold">
            Analytics & Customer Interest
          </h1>
          <p className="text-xs text-slate-500">
            Real-time page views and product discovery metrics from Appwrite
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200 text-xs font-semibold">
          <Eye className="w-4 h-4" />
          <span>Total Views Logged: {totalViews.toLocaleString()}</span>
        </div>
      </div>

      {/* Mandatory Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs flex items-center space-x-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Note:</strong> These metrics reflect customer page views and search interactions on your storefront. An integrated payment gateway / order checkout system can be added seamlessly to track purchase conversions in future iterations.
        </span>
      </div>

      {/* Main Analytics Charts & Rankings */}
      <AnalyticsCharts />

    </div>
  );
}
