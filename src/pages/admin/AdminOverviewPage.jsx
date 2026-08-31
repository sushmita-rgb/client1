import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { useRequests } from '../../context/RequestContext';
import StatCard from '../../components/admin/StatCard';
import AnalyticsCharts from '../../components/admin/AnalyticsCharts';
import { Package, Eye, MessageSquareHeart, Award, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverviewPage() {
  const { products, mostViewedProduct } = useProducts();
  const { requests } = useRequests();

  const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-slate-800 font-bold">
            Overview
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Real-time performance metrics and catalog activity
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[#4A607A] hover:bg-[#2C3E50] text-white px-3.5 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5 shrink-0" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TOTAL PRODUCTS"
          value={products.length}
          subtitle="Active items in catalog"
          icon={Package}
          color="blue"
        />

        <StatCard
          title="TOTAL PRODUCT VIEWS"
          value={totalViews.toLocaleString()}
          subtitle="Cumulative storefront views"
          icon={Eye}
          color="amber"
        />

        <StatCard
          title="CUSTOM REQUESTS"
          value={requests.length}
          subtitle="Submitted order inquiries"
          icon={MessageSquareHeart}
          color="emerald"
        />

        <StatCard
          title="MOST VIEWED PRODUCT"
          value={mostViewedProduct ? mostViewedProduct.name : 'N/A'}
          subtitle={mostViewedProduct ? `${mostViewedProduct.views || 0} views` : ''}
          icon={Award}
          color="purple"
        />
      </div>

      {/* Analytics Charts Section */}
      <AnalyticsCharts />

      {/* Quick Action Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Recent Custom Order Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-slate-800">
              Recent Custom Requests
            </h3>
            <Link
              to="/admin/requests"
              className="text-xs font-semibold text-[#4A607A] hover:underline flex items-center"
            >
              <span>View All ({requests.length})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.slice(0, 4).map((req) => (
              <div key={req.$id || req.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{req.name}</h4>
                  <p className="text-xs text-slate-500">{req.category} • {req.phone}</p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {req.status || 'New'}
                </span>
              </div>
            ))}

            {requests.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">No custom requests submitted yet.</p>
            )}
          </div>
        </div>

        {/* Storefront Catalog Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-slate-800">
              Catalog Snapshot
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#4A607A] hover:underline flex items-center"
            >
              <span>Manage Products</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {products.slice(0, 4).map((prod) => (
              <div key={prod.$id || prod.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#EBF3FA] to-[#FAF7F2] border border-slate-200 shrink-0 flex items-center justify-center">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-8 h-8 object-contain drop-shadow-sm"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">{prod.name}</h4>
                    <p className="text-xs text-slate-400">₹{prod.price} • {prod.category}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {prod.views || 0} views
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
